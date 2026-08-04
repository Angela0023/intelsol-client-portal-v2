'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
import { ContentSection, CodeBlock, InfoCard, ListItem } from '../components/ContentSection';
import TasksTab, { TSLAB_DEFAULT_TASKS } from '../components/TasksTab';
import SequencesTab from '../components/SequencesTab';
import TSLabPerformance from '../components/TSLabPerformance';
import StatusBadge, { getClientStatus, setClientStatus, DEFAULT_STATUSES, type ClientStatus } from '../components/StatusBadge';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import { Target, Users, Filter, Code, TrendingUp, FileText, CheckSquare, BarChart3, Zap, FolderOpen, Mail } from 'lucide-react';

const tabs = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'icp', label: 'ICP Profile', icon: Target },
  { id: 'filters', label: 'Clay Filters', icon: Filter },
  { id: 'prompts', label: 'AI Prompts', icon: Code },
  { id: 'personas', label: 'Buyer Personas', icon: Users },
  { id: 'sequences', label: 'Email Sequences', icon: Mail },
  { id: 'campaigns', label: 'Campaigns', icon: Zap },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'documents', label: 'Documents', icon: FolderOpen },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
];

export default function TSLabPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('tslab', DEFAULT_STATUSES.tslab));

    // Check if user is admin
    const access = sessionStorage.getItem('clientAccess');
    let userIsAdmin = false;
    if (access) {
      try {
        const parsedAccess = JSON.parse(access);
        userIsAdmin = parsedAccess.includes('admin');
        setIsAdmin(userIsAdmin);
      } catch {
        setIsAdmin(false);
      }
    }

    // Internal tabs that should be hidden from non-admin users
    const internalTabs = ['filters', 'prompts'];

    // Read initial tab from URL pathname
    const path = window.location.pathname;
    const tabFromPath = path.split('/').pop();
    const validTab = tabs.find(t => t.id === tabFromPath);
    // Only set the tab if it's valid AND (user is admin OR it's not an internal tab)
    if (validTab && (userIsAdmin || !internalTabs.includes(validTab.id))) {
      setActiveTab(validTab.id);
    }

    // Handle browser back/forward
    const handlePopState = () => {
      const path = window.location.pathname;
      const tabFromPath = path.split('/').pop();
      const validTab = tabs.find(t => t.id === tabFromPath);
      // Only set the tab if it's valid AND (user is admin OR it's not an internal tab)
      if (validTab && (userIsAdmin || !internalTabs.includes(validTab.id))) {
        setActiveTab(validTab.id);
      } else {
        setActiveTab('overview');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleStatusChange = (newStatus: ClientStatus) => {
    setStatus(newStatus);
    setClientStatus('tslab', newStatus);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const newPath = tabId === 'overview' ? '/tslab' : `/tslab/${tabId}`;
    window.history.pushState({}, '', newPath);
  };

  // Filter tabs based on admin access
  // Hide internal tabs (filters, prompts) from non-admin users
  const visibleTabs = isAdmin
    ? tabs
    : tabs.filter(tab => !['filters', 'prompts'].includes(tab.id));

  return (
    <ClientLayout>
      <div className="p-4 lg:p-8">
        {/*Page Header*/}
        <div className="mb-6">
          <div className="flex items-center space-x-2 lg:space-x-3 mb-2">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl lg:text-2xl font-bold text-green-600">TS</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 lg:space-x-3 flex-wrap">
                <h1 className="text-xl lg:text-3xl font-bold text-slate-900">TS Lab</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
              </div>
              <p className="text-sm lg:text-base text-slate-600 break-words">Food Supplement Capsule Manufacturing (Slovenia)</p>
            </div>
          </div>
          <a
            href="https://tslab.eu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-green-600 hover:underline inline-block"
          >
            Visit Website →
          </a>
        </div>

        {/*Tabs*/}
        <div className="border-b border-slate-200 mb-6 -mx-4 px-4 lg:mx-0 lg:px-0">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide pb-px">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-2 lg:py-3 border-b-2 transition-colors whitespace-nowrap text-sm lg:text-base flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'border-[#1a2647] text-[#1a2647] font-medium'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/*Tab Content*/}
        <div className="space-y-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'icp' && <ICPTab />}
          {activeTab === 'filters' && <FiltersTab />}
          {activeTab === 'prompts' && <PromptsTab />}
          {activeTab === 'personas' && <PersonasTab />}
          {activeTab === 'sequences' && <SequencesTab clientId="tslab" />}
          {activeTab === 'campaigns' && <CampaignsTab />}
          {activeTab === 'performance' && <TSLabPerformance />}
          {activeTab === 'documents' && <DocumentsTab />}
          {activeTab === 'tasks' && (
            <TasksTab clientId="tslab" defaultTasks={TSLAB_DEFAULT_TASKS} />
          )}
        </div>
      </div>
    </ClientLayout>
  );
}

function OverviewTab() {
  return (
    <>
      <ContentSection title="Company Overview" icon={<FileText className="w-5 h-5" />}>
        <div className="space-y-4">
          <p>
            TS Lab is a Slovenia-based food supplement capsule manufacturer. They produce capsules for other
            companies through B2B private-label manufacturing services.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Industry" value="Food Supplement Manufacturing" />
            <InfoCard label="Business Model" value="B2B Private-Label Manufacturing" />
            <InfoCard label="Location" value="Slovenia" />
            <InfoCard label="Service Type" value="Capsule/Tablet Production" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="What TS Lab Offers" icon={<TrendingUp className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="check">Private-label capsule and tablet manufacturing</ListItem>
          <ListItem type="check">Custom supplement formulation</ListItem>
          <ListItem type="check">Production capacity for companies needing additional manufacturing</ListItem>
          <ListItem type="check">B2B partnerships with supplement brands</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Target Market Summary" icon={<Target className="w-5 h-5" />}>
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="font-semibold text-green-900 mb-2">Who TS Lab Serves:</p>
          <p className="text-green-800">
            Companies that sell food supplements in capsule/tablet form with 20+ employees,
            operating in EU/UK markets, and needing manufacturing capacity or partnerships.
          </p>
        </div>
      </ContentSection>
    </>
  );
}

function ICPTab() {
  return (
    <>
      <ContentSection title="Ideal Customer Profile" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 mb-3">MUST HAVE:</h4>
          <ul className="space-y-2">
            <ListItem type="check">Sells food supplements</ListItem>
            <ListItem type="check">Products are in capsule/tablet form (NOT only powders or bars)</ListItem>
            <ListItem type="check">20+ employees</ListItem>
            <ListItem type="check">Has online store or retail shop</ListItem>
            <ListItem type="check">Multiple supplement brands</ListItem>
            <ListItem type="check">Located in EU or UK</ListItem>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-4">
            <p className="font-semibold text-blue-900 mb-2">Important Note:</p>
            <p className="text-blue-800 text-sm">
              Companies with their own manufacturing facility are NOT disqualified - they may need additional capacity.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Disqualifiers" icon={<Target className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="cross">Only sells protein powders or bars (no capsules)</ListItem>
          <ListItem type="cross">Private label (PL) manufacturing facilities</ListItem>
          <ListItem type="cross">Only pharmacy selling prescription drugs</ListItem>
          <ListItem type="cross">MLM companies</ListItem>
          <ListItem type="cross">Website is old or broken</ListItem>
          <ListItem type="cross">Under 20 employees</ListItem>
          <ListItem type="cross">Outside EU/UK</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Target Countries" icon={<Filter className="w-5 h-5" />}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            'United Kingdom',
            'Germany',
            'Netherlands',
            'Poland',
            'Austria',
            'Italy',
            'Belgium',
            'Ireland',
            'Sweden',
            'Norway',
          ].map((country) => (
            <div key={country} className="bg-green-100 px-3 py-2 rounded text-sm">
              {country}
            </div>
          ))}
        </div>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mt-4">
          <p className="font-semibold text-amber-900 mb-1">Note:</p>
          <p className="text-amber-800 text-sm">
            France is excluded due to language concerns (no French speakers at TS Lab).
          </p>
        </div>
      </ContentSection>
    </>
  );
}

function FiltersTab() {
  return (
    <>
      <ContentSection title="Clay Search Criteria" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 mb-3">Location:</h4>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="font-semibold text-amber-900 mb-1">Important:</p>
            <p className="text-amber-800 text-sm">
              Select <strong>ONE country at a time</strong> from the 10 target countries.
            </p>
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Company Size:</h4>
          <ul className="space-y-2">
            <ListItem>21-50 employees</ListItem>
            <ListItem>51-200 employees</ListItem>
            <ListItem>201-500 employees</ListItem>
            <ListItem>501-1000 employees</ListItem>
            <ListItem>1001-5000 employees</ListItem>
          </ul>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Industry Filters:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              'Wellness and Fitness Services',
              'Retail Health and Personal Care Products',
              'Food and Beverage Services',
              'Retail Vitamins and Supplements',
              'Health and Wellness Products',
              'Alternative Medicine',
              'Nutrition',
            ].map((industry) => (
              <div key={industry} className="bg-slate-100 px-3 py-2 rounded text-sm border border-slate-200">
                {industry}
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Keywords:</h4>
          <CodeBlock code={`supplements OR vitamins OR "food supplements" OR "dietary supplements"`} />
        </div>
      </ContentSection>
    </>
  );
}

function PromptsTab() {
  const icpPrompt = `You are analyzing a company's website to determine if they match our Ideal Customer Profile (ICP) for supplement capsule manufacturing.

TARGET PROFILE:
- Company sells food supplements (vitamins, minerals, herbal supplements, etc.)
- Products include capsules or tablets (NOT just powders or bars)
- Has online store or retail presence
- Multiple supplement brands/products
- 20+ employees
- Located in EU or UK
- NOT a manufacturing facility (PL/WL)
- NOT MLM company
- NOT just a pharmacy selling prescriptions
- Website is modern and functional

ANALYZE THE WEBSITE FOR:
1. Product Type: Do they sell food supplements in capsule/tablet form?
2. Business Model: Are they a brand/retailer (not a manufacturer)?
3. Product Range: Do they have multiple supplement products?
4. Sales Channels: Online store or retail presence visible?
5. Company Type: Legitimate supplement company (not MLM, not pharmacy-only)?
6. Website Quality: Is the website modern and functional?

OUTPUT:
- Answer: Yes / No / Unsure
- Reasoning: 2-3 sentence explanation explaining what products they sell and why they match or don't match
- Confidence: High / Medium / Low

Only answer "Yes" if you are confident this company:
- Sells food supplements in capsule/tablet form
- Is NOT a manufacturing facility
- Has a proper online presence
- Appears to be a legitimate supplement brand/retailer`;

  return (
    <>
      <ContentSection title="ICP Matching Prompt (Anthropic)" icon={<Code className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            This prompt is used in Clay to analyze company websites and determine if they match TS Lab's ICP.
          </p>
          <CodeBlock code={icpPrompt} language="text" />
        </div>
      </ContentSection>

      <ContentSection title="Key Matching Criteria" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-3">
          <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
            <p className="font-medium text-green-900">✓ GOOD MATCH</p>
            <p className="text-green-800 text-sm mt-1">
              Company selling vitamins, minerals, or herbal supplements in capsule form with online store and multiple products.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
            <p className="font-medium text-red-900">✗ NOT A MATCH</p>
            <p className="text-red-800 text-sm mt-1">
              Only sells protein powders, only operates as pharmacy, is itself a manufacturer, or is an MLM company.
            </p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function PersonasTab() {
  const decisionMakers = [
    'board member', 'business owner', 'business unit director', 'business unit manager', 'CEO', 'CCO', 'chairman', 'chairman of the board', 'chairperson', 'chief business officer', 'chief commercial officer', 'chief executive officer', 'chief growth officer', 'chief innovation officer', 'chief operating officer', 'chief product officer', 'chief revenue officer', 'chief strategy officer', 'COO', 'co-founder', 'co-founder & CEO', 'country director', 'country manager', 'director', 'director of operations', 'director of product', 'director of product development', 'director of sales', 'division director', 'division manager', 'EVP', 'executive chairman', 'executive director', 'executive vice president', 'founder', 'founder & CEO', 'founder & managing director', 'founder and CEO', 'founder and managing director', 'founder/CEO', 'general manager', 'general partner', 'group CEO', 'managing director', 'managing owner', 'managing partner', 'operations director', 'operations manager', 'owner', 'partner', 'president', 'president & CEO', 'principal CEO', 'regional director', 'senior managing director', 'senior vice president', 'vice president', 'vice president of operations', 'vice president of product', 'vice president of sales'
  ];

  const procurement = [
    'account director', 'assistant manager of purchasing', 'associate manager of purchasing', 'buyer', 'category lead', 'category manager', 'chief operations officer', 'chief procurement officer', 'chief purchasing officer', 'chief sourcing officer', 'chief supply chain officer', 'chief supply officer', 'commodity buyer', 'commodity manager', 'contract manager', 'contracts manager', 'CPO', 'CSO', 'deputy general manager of purchase', 'deputy general manager of purchasing', 'deputy head of procurement', 'deputy head of procurement department', 'deputy manager of purchasing', 'director of procurement', 'director of purchasing', 'director of sourcing', 'general procurement manager', 'general purchasing manager', 'global head of procurement', 'global procurement director', 'global procurement manager', 'global sourcing director', 'global sourcing manager', 'group head of procurement', 'group procurement director', 'group procurement manager', 'head of operations', 'head of procurement', 'head of procurement & contracts', 'head of procurement & logistics', 'head of procurement & operations', 'head of procurement & supply chain', 'head of procurement administration', 'head of procurement and administration', 'head of procurement and contracts', 'head of procurement and logistics', 'head of procurement and logistics department', 'head of procurement and supply chain', 'head of procurement and supply chain management', 'head of procurement department', 'head of procurement division', 'head of procurement Europe', 'head of procurement excellence', 'head of procurement operations', 'head of procurement section', 'head of procurement services', 'head of procurement unit', 'head of purchasing', 'head of sourcing', 'head of supply chain', 'interim head of procurement', 'inventory manager', 'lead buyer', 'logistics director', 'logistics manager', 'manager of fleet and facilities', 'manager of purchase', 'manager of purchase department', 'manager of purchases', 'manager of purchasing', 'manager of purchasing & risk management', 'manager of purchasing and contracts', 'manager of purchasing and inventory', 'manager of purchasing and logistic', 'manager of purchasing and logistics', 'manager of purchasing and logistics department', 'manager of purchasing and materials', 'manager of purchasing and stores', 'manager of purchasing department', 'materials manager', 'procurement', 'procurement analyst', 'procurement business partner', 'procurement category manager', 'procurement consultant', 'procurement coordinator', 'procurement director', 'procurement engineer', 'procurement executive', 'procurement lead', 'procurement manager', 'procurement officer', 'procurement operations manager', 'procurement specialist', 'procurement supervisor', 'project manager of purchasing', 'project procurement manager', 'purchase manager', 'purchasing director', 'purchasing lead', 'purchasing manager', 'purchasing specialist', 'regional procurement manager', 'regional sourcing manager', 'senior buyer', 'senior manager of purchasing', 'senior procurement manager', 'senior sourcing manager', 'sourcing director', 'sourcing lead', 'sourcing manager', 'sourcing specialist', 'strategic buyer', 'strategic sourcing director', 'strategic sourcing manager', 'supplier development manager', 'supplier quality manager', 'supplier relationship manager', 'supply chain director', 'supply chain manager', 'supply manager', 'technical buyer', 'vendor manager', 'vice president of procurement', 'vice president of purchasing', 'vice president of sourcing'
  ];

  return (
    <>
      <ContentSection title="Target Job Titles / Buyer Personas" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-6">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="font-semibold text-green-900 mb-2">Target Positions for TS Lab</p>
            <p className="text-green-800 text-sm">
              The following job titles represent decision-makers and procurement professionals at food supplement and health product companies. These are the exact positions to target when sourcing leads.
            </p>
          </div>

          {/* Decision Makers */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-lg">Decision Makers ({decisionMakers.length})</h4>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-3">
              <p className="text-blue-900 text-sm">
                C-level executives, founders, owners, and senior management who make final purchasing decisions or approve budgets.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {decisionMakers.map((position, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded px-2 py-1.5 text-xs">
                  {position}
                </div>
              ))}
            </div>
          </div>

          {/* Procurement */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">2</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-lg">Procurement & Supply Chain ({procurement.length})</h4>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded mb-3">
              <p className="text-green-900 text-sm">
                Procurement managers, purchasing directors, sourcing specialists, and supply chain professionals who identify suppliers and manage vendor relationships.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {procurement.map((position, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded px-2 py-1.5 text-xs">
                  {position}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-violet-50 border-l-4 border-violet-500 p-4 rounded">
            <p className="font-semibold text-violet-900 mb-2">Total Positions: {decisionMakers.length + procurement.length}</p>
            <p className="text-violet-800 text-sm">
              When searching in Sales Navigator or Apollo, use these exact job titles. For smaller companies (20-50 employees), focus on Decision Makers. For larger companies (50-100+ employees), target both Decision Makers and Procurement roles.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Apollo Enrichment Settings" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 mb-2">Required Fields:</h4>
          <ul className="space-y-2">
            <ListItem type="check">First Name</ListItem>
            <ListItem type="check">Last Name</ListItem>
            <ListItem type="check">Job Title</ListItem>
            <ListItem type="check">Email Address</ListItem>
            <ListItem type="check">LinkedIn URL</ListItem>
            <ListItem type="check">Company Name</ListItem>
          </ul>
        </div>
      </ContentSection>
    </>
  );
}

function CampaignsTab() {
  const campaigns = [
    {
      list: 'Initial',
      listUrl: null,
      campaignName: 'TS Lab | Decision Makers | 10/Jul/2026',
      campaignUrl: 'https://app.smartlead.ai/app/email-campaigns-v2/3618907/analytics',
      dateLaunched: '10/Jul/26',
      leadsAdded: 85,
      launched: true,
    },
    {
      list: 'Initial',
      listUrl: null,
      campaignName: 'TS Lab | Support, Procurement | 10/Jul/2026',
      campaignUrl: 'https://app.smartlead.ai/app/email-campaigns-v2/3618993/analytics',
      dateLaunched: '10/Jul/26',
      leadsAdded: 185,
      launched: true,
    },
    {
      list: 'Germany-403',
      listUrl: 'https://docs.google.com/spreadsheets/d/1R03b2nLaVo79dxmV1eqDGRpOaoBZfx6UBRrEJLbuqcw/edit?gid=1557246750#gid=1557246750',
      campaignName: 'TS Lab | Germany-403 | Decision Makers | 21/Jul/2026',
      campaignUrl: 'https://app.smartlead.ai/app/email-campaigns-v2/3701245/analytics',
      dateLaunched: '21/Jul/26',
      leadsAdded: 314,
      launched: true,
    },
    {
      list: 'Germany-403',
      listUrl: 'https://docs.google.com/spreadsheets/d/1R03b2nLaVo79dxmV1eqDGRpOaoBZfx6UBRrEJLbuqcw/edit?gid=1557246750#gid=1557246750',
      campaignName: 'TS Lab Germany-403 | Support, Procurement | 21/Jul/2026',
      campaignUrl: 'https://app.smartlead.ai/app/email-campaigns-v2/3701252/analytics',
      dateLaunched: '21/Jul/26',
      leadsAdded: 197,
      launched: true,
    },
    {
      list: 'UK Database 1999',
      listUrl: 'https://docs.google.com/spreadsheets/d/1R03b2nLaVo79dxmV1eqDGRpOaoBZfx6UBRrEJLbuqcw/edit?gid=1965638820#gid=1965638820',
      campaignName: 'TS Lab | UK DB 1999 | Decision Makers | 24/Jul/2026',
      campaignUrl: 'https://app.smartlead.ai/app/email-campaigns-v2/3715967/analytics',
      dateLaunched: '24/Jul/26',
      leadsAdded: 768,
      launched: true,
    },
    {
      list: 'UK Database 1999',
      listUrl: 'https://docs.google.com/spreadsheets/d/1R03b2nLaVo79dxmV1eqDGRpOaoBZfx6UBRrEJLbuqcw/edit?gid=1965638820#gid=1965638820',
      campaignName: 'TS Lab | UK DB 1999 | Support, Procurement | 24/Jul/2026',
      campaignUrl: 'https://app.smartlead.ai/app/email-campaigns-v2/3723696/analytics',
      dateLaunched: '24/Jul/26',
      leadsAdded: 94,
      launched: true,
    },
    {
      list: 'Netherlands',
      listUrl: 'https://docs.google.com/spreadsheets/d/1R03b2nLaVo79dxmV1eqDGRpOaoBZfx6UBRrEJLbuqcw/edit?gid=1153745105#gid=1153745105',
      campaignName: 'TS Lab | Nederland | Decision Makers | 24/Jul/2026',
      campaignUrl: 'https://app.smartlead.ai/app/email-campaigns-v2/3716053/analytics',
      dateLaunched: '24/Jul/26',
      leadsAdded: 936,
      launched: true,
    },
    {
      list: 'Netherlands',
      listUrl: 'https://docs.google.com/spreadsheets/d/1R03b2nLaVo79dxmV1eqDGRpOaoBZfx6UBRrEJLbuqcw/edit?gid=1153745105#gid=1153745105',
      campaignName: 'TS Lab | Nederland | Support, Procurement | 24/Jul/2026',
      campaignUrl: 'https://app.smartlead.ai/app/email-campaigns-v2/3716069/analytics',
      dateLaunched: '24/Jul/26',
      leadsAdded: 121,
      launched: true,
    },
    {
      list: 'UK',
      listUrl: 'https://docs.google.com/spreadsheets/d/1R03b2nLaVo79dxmV1eqDGRpOaoBZfx6UBRrEJLbuqcw/edit?gid=2119200258#gid=2119200258',
      campaignName: 'TS Lab | UK (VFS)| Decision Makers | 27/Jul/2026',
      campaignUrl: 'https://app.smartlead.ai/app/email-campaigns-v2/3723689/analytics',
      dateLaunched: '27/Jul/26',
      leadsAdded: 40,
      launched: true,
    },
    {
      list: 'UK',
      listUrl: 'https://docs.google.com/spreadsheets/d/1R03b2nLaVo79dxmV1eqDGRpOaoBZfx6UBRrEJLbuqcw/edit?gid=2119200258#gid=2119200258',
      campaignName: 'TS Lab | UK (VFS)| Support, Procurement | 27/Jul/2026',
      campaignUrl: 'https://app.smartlead.ai/app/email-campaigns-v2/3723696/analytics',
      dateLaunched: '27/Jul/26',
      leadsAdded: 7,
      launched: true,
    },
    {
      list: 'Italy',
      listUrl: 'https://docs.google.com/spreadsheets/d/1R03b2nLaVo79dxmV1eqDGRpOaoBZfx6UBRrEJLbuqcw/edit?gid=2138146016#gid=2138146016',
      campaignName: 'TS Lab | Italy (VFS)| Decision Makers | 27/Jul/2026',
      campaignUrl: 'https://app.smartlead.ai/app/email-campaigns-v2/3725096/analytics',
      dateLaunched: '27/Jul/26',
      leadsAdded: 160,
      launched: true,
    },
    {
      list: 'Italy',
      listUrl: 'https://docs.google.com/spreadsheets/d/1R03b2nLaVo79dxmV1eqDGRpOaoBZfx6UBRrEJLbuqcw/edit?gid=2138146016#gid=2138146016',
      campaignName: 'TS Lab | Italy (VFS) |  Support, Procurement | 27/Jul/2026',
      campaignUrl: 'https://app.smartlead.ai/app/email-campaigns-v2/3725099/analytics',
      dateLaunched: '27/Jul/26',
      leadsAdded: 114,
      launched: true,
    },
    // Pending campaigns
    {
      list: 'Verified Food Supplements (VFS)',
      listUrl: 'https://docs.google.com/spreadsheets/d/1R03b2nLaVo79dxmV1eqDGRpOaoBZfx6UBRrEJLbuqcw/edit?gid=945281568#gid=945281568',
      campaignName: '',
      campaignUrl: null,
      dateLaunched: '',
      leadsAdded: 0,
      launched: false,
    },
    {
      list: 'Sweden (VFS)',
      listUrl: 'https://docs.google.com/spreadsheets/d/1R03b2nLaVo79dxmV1eqDGRpOaoBZfx6UBRrEJLbuqcw/edit?gid=981026504#gid=981026504',
      campaignName: '',
      campaignUrl: null,
      dateLaunched: '',
      leadsAdded: 0,
      launched: false,
    },
    {
      list: 'Finland (VFS)',
      listUrl: 'https://docs.google.com/spreadsheets/d/1R03b2nLaVo79dxmV1eqDGRpOaoBZfx6UBRrEJLbuqcw/edit?gid=1587031046#gid=1587031046',
      campaignName: '',
      campaignUrl: null,
      dateLaunched: '',
      leadsAdded: 0,
      launched: false,
    },
    {
      list: 'Spain (VFS)',
      listUrl: 'https://docs.google.com/spreadsheets/d/1R03b2nLaVo79dxmV1eqDGRpOaoBZfx6UBRrEJLbuqcw/edit?gid=543112245#gid=543112245',
      campaignName: '',
      campaignUrl: null,
      dateLaunched: '',
      leadsAdded: 0,
      launched: false,
    },
    {
      list: 'Austria (VFS)',
      listUrl: 'https://docs.google.com/spreadsheets/d/1R03b2nLaVo79dxmV1eqDGRpOaoBZfx6UBRrEJLbuqcw/edit?gid=316568956#gid=316568956',
      campaignName: '',
      campaignUrl: null,
      dateLaunched: '',
      leadsAdded: 0,
      launched: false,
    },
    {
      list: 'Netherlands (VFS)',
      listUrl: 'https://docs.google.com/spreadsheets/d/1R03b2nLaVo79dxmV1eqDGRpOaoBZfx6UBRrEJLbuqcw/edit?gid=1065213412#gid=1065213412',
      campaignName: '',
      campaignUrl: null,
      dateLaunched: '',
      leadsAdded: 0,
      launched: false,
    },
    {
      list: 'UK Amazon 1641 (VFS)',
      listUrl: 'https://docs.google.com/spreadsheets/d/1R03b2nLaVo79dxmV1eqDGRpOaoBZfx6UBRrEJLbuqcw/edit?gid=1964340732#gid=1964340732',
      campaignName: '',
      campaignUrl: null,
      dateLaunched: '',
      leadsAdded: 0,
      launched: false,
    },
    {
      list: 'Cosmetic Shop UK (VFS)',
      listUrl: 'https://docs.google.com/spreadsheets/d/1R03b2nLaVo79dxmV1eqDGRpOaoBZfx6UBRrEJLbuqcw/edit?gid=793724587#gid=793724587',
      campaignName: '',
      campaignUrl: null,
      dateLaunched: '',
      leadsAdded: 0,
      launched: false,
    },
  ];

  const launchedCampaigns = campaigns.filter(c => c.launched);
  const totalLeads = launchedCampaigns.reduce((sum, c) => sum + c.leadsAdded, 0);
  const totalCampaigns = launchedCampaigns.length;
  const countriesTargeted = [...new Set(launchedCampaigns.map(c => c.list))].length;

  return (
    <>
      <ContentSection title="Campaign Summary" icon={<BarChart3 className="w-5 h-5" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-3 lg:p-6 shadow-sm">
            <p className="text-xs lg:text-sm text-green-700 font-medium mb-1">Total Leads</p>
            <p className="text-xl lg:text-4xl font-bold text-green-900">{totalLeads.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-3 lg:p-6 shadow-sm">
            <p className="text-xs lg:text-sm text-blue-700 font-medium mb-1">Campaigns</p>
            <p className="text-xl lg:text-4xl font-bold text-blue-900">{totalCampaigns}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-3 lg:p-6 shadow-sm">
            <p className="text-xs lg:text-sm text-purple-700 font-medium mb-1">Countries</p>
            <p className="text-xl lg:text-4xl font-bold text-purple-900">{countriesTargeted}</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Campaign Details" icon={<Zap className="w-5 h-5" />}>
        {/* Mobile: Card Layout */}
        <div className="lg:hidden space-y-3">
          {campaigns.map((campaign, index) => (
            <div key={index} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 mr-2">
                  <p className="text-xs text-slate-500 mb-0.5">List / Country</p>
                  {campaign.listUrl ? (
                    <a
                      href={campaign.listUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-green-600 hover:underline break-words"
                    >
                      {campaign.list}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-slate-900 break-words">{campaign.list}</p>
                  )}
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                  campaign.launched
                    ? 'bg-green-100 text-green-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {campaign.launched ? 'Launched' : 'Pending'}
                </span>
              </div>

              {campaign.campaignUrl ? (
                <a
                  href={campaign.campaignUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline break-words block mb-2"
                >
                  {campaign.campaignName}
                </a>
              ) : (
                <p className="text-xs text-slate-400 italic mb-2">
                  {campaign.campaignName || 'Not created yet'}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-slate-600 mt-2 pt-2 border-t border-slate-200">
                <span>{campaign.dateLaunched || '—'}</span>
                <span className={campaign.leadsAdded > 0 ? 'font-semibold text-green-700' : 'text-slate-400'}>
                  {campaign.leadsAdded.toLocaleString()} leads
                </span>
              </div>
            </div>
          ))}

          {/* Totals card for mobile */}
          <div className="bg-slate-100 rounded-lg p-3 border-2 border-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">Total Leads:</span>
              <span className="text-lg font-bold text-green-700">{totalLeads.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Desktop: Table Layout */}
        <div className="hidden lg:block bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-2 lg:px-4 py-2 lg:py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      List / Country
                    </th>
                    <th className="text-left px-2 lg:px-4 py-2 lg:py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Campaign Name
                    </th>
                    <th className="text-center px-2 lg:px-4 py-2 lg:py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Date
                    </th>
                    <th className="text-right px-2 lg:px-4 py-2 lg:py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Leads
                    </th>
                    <th className="text-center px-2 lg:px-4 py-2 lg:py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                  </tr>
                </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.map((campaign, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-2 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm font-medium text-slate-900 whitespace-nowrap">
                      {campaign.listUrl ? (
                        <a
                          href={campaign.listUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 hover:underline"
                        >
                          {campaign.list}
                        </a>
                      ) : (
                        campaign.list
                      )}
                    </td>
                    <td className="px-2 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-slate-700">
                      {campaign.campaignUrl ? (
                        <a
                          href={campaign.campaignUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline whitespace-nowrap"
                        >
                          {campaign.campaignName}
                        </a>
                      ) : (
                        <span className="text-slate-400 italic whitespace-nowrap">
                          {campaign.campaignName || 'Not created yet'}
                        </span>
                      )}
                    </td>
                    <td className="px-2 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-slate-700 text-center whitespace-nowrap">
                      {campaign.dateLaunched || '—'}
                    </td>
                    <td className="px-2 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm font-semibold text-right whitespace-nowrap">
                      <span className={campaign.leadsAdded > 0 ? 'text-green-700' : 'text-slate-400'}>
                        {campaign.leadsAdded.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-2 lg:px-4 py-2 lg:py-3 text-center">
                      <span className={`inline-flex items-center px-2 lg:px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                        campaign.launched
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {campaign.launched ? 'Launched' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
                {/*Totals row*/}
                <tr className="bg-slate-50 border-t-2 border-slate-200 font-semibold">
                  <td className="px-2 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-slate-900" colSpan={3}>
                    Total
                  </td>
                  <td className="px-2 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-green-900 text-right">
                    {totalLeads.toLocaleString()}
                  </td>
                  <td className="px-2 lg:px-4 py-2 lg:py-3"></td>
                </tr>
              </tbody>
              </table>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Breakdown by List" icon={<Target className="w-5 h-5" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { list: 'Initial', leads: 270 },
            { list: 'Germany-403', leads: 511 },
            { list: 'UK Database 1999', leads: 862 },
            { list: 'Netherlands', leads: 1057 },
            { list: 'UK', leads: 47 },
            { list: 'Italy', leads: 274 },
          ].map((item) => (
            <div key={item.list} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">{item.list}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{item.leads.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-green-600">
                    {Math.round((item.leads / totalLeads) * 100)}%
                  </span>
                </div>
              </div>
              <div className="mt-3 w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${(item.leads / totalLeads) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection title="Monthly Breakdown - 2026" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-3 mb-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
            <p className="text-sm text-blue-900">
              <strong>Monthly Goal:</strong> 5,000 leads per month
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">July 2026</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{totalLeads.toLocaleString()} leads</p>
                <p className="text-xs text-slate-500 mt-1">{totalCampaigns} campaigns</p>
                <p className="text-xs text-slate-400 mt-0.5">Goal: 5,000</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-green-600">
                  {Math.round((totalLeads / 5000) * 100)}%
                </span>
              </div>
            </div>
            <div className="mt-3 w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((totalLeads / 5000) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function DocumentsTab() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      {/* Uploaded Documents Section */}
      <ContentSection title="Uploaded Documents" icon={<FolderOpen className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-600">
              Upload and manage documents for TS Lab. All uploaded files will be available for download.
            </p>
            <FileUpload clientId="tslab" onUploadComplete={handleUploadComplete} />
          </div>

          <FileList clientId="tslab" refreshTrigger={refreshTrigger} />
        </div>
      </ContentSection>

      {/* Lead Database Section */}
      <ContentSection title="Lead Database" icon={<FileText className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-slate-600">
            Download the complete database of all leads targeted across all TS Lab campaigns.
            This file contains first name, last name, email, position, company information, and LinkedIn profiles.
          </p>

          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:border-green-500 transition-colors">
            <a
              href="/data/tslab-leads.csv"
              download="tslab-leads.csv"
              className="flex items-center justify-between group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-green-600 transition-colors">
                    Download Lead Database
                  </h3>
                  <p className="text-sm text-slate-500">CSV file • 3,021 leads across 12 campaigns</p>
                </div>
              </div>
              <div className="text-green-600 group-hover:translate-x-1 transition-transform">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </a>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> This database is updated regularly as new campaigns are launched.
              Last updated: Check the file timestamp after download.
            </p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}
