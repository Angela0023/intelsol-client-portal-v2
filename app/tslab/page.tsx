'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
import { ContentSection, CodeBlock, InfoCard, ListItem } from '../components/ContentSection';
import TasksTab, { TSLAB_DEFAULT_TASKS } from '../components/TasksTab';
import SequencesTab from '../components/SequencesTab';
import CampaignsTabDynamic from '../components/CampaignsTabDynamic';
import PerformanceTabDynamic from '../components/PerformanceTabDynamic';
import CampaignsTabGeneric from '../components/CampaignsTabGeneric';
import StatusBadge, { getClientStatus, setClientStatus, DEFAULT_STATUSES, type ClientStatus } from '../components/StatusBadge';
import DocumentsTabGeneric from '../components/DocumentsTabGeneric';
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
          {activeTab === 'campaigns' && <CampaignsTabGeneric />}
          {activeTab === 'performance' && (
            <>
              <PerformanceTabDynamic clientId="tslab" />
              <CampaignsTabDynamic clientId="tslab" />
            </>
          )}
          {activeTab === 'documents' && (
            <DocumentsTabGeneric
              clientId="tslab"
              clientName="TS Lab"
              totalLeads={3021}
              totalCampaigns={12}
              accentColor="green"
            />
          )}
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
