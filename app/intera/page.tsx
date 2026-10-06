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
  { id: 'campaigns-sequences', label: 'Campaigns & Sequences', icon: Zap },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'documents', label: 'Documents', icon: FolderOpen },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
];

export default function InteraPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('intera', DEFAULT_STATUSES.intera));

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
    setClientStatus('intera', newStatus);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const newPath = tabId === 'overview' ? '/intera' : `/intera/${tabId}`;
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
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 lg:w-7 lg:h-7 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 lg:space-x-3 flex-wrap">
                <h1 className="text-xl lg:text-3xl font-bold text-slate-900">Intrix CRM</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
              </div>
              <p className="text-sm lg:text-base text-slate-600 break-words">B2B Sales CRM for Croatia and Serbia</p>
            </div>
          </div>
          <a
            href="https://www.intrix.si/crm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-600 hover:underline inline-block"
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
          {activeTab === 'icp' && <ICPAndPersonasTab />}
          {activeTab === 'filters' && <FiltersTab />}
          {activeTab === 'prompts' && <PromptsTab />}
          {activeTab === 'campaigns-sequences' && <CampaignsSequencesTab />}
          {activeTab === 'performance' && (
            <>
              <PerformanceTabDynamic clientId="intera" />
              <CampaignsTabDynamic clientId="intera" />
            </>
          )}
          {activeTab === 'documents' && (
            <DocumentsTabGeneric
              clientId="intera"
              clientName="Intrix CRM"
              totalLeads={2400}
              totalCampaigns={10}
              accentColor="indigo"
            />
          )}
          {activeTab === 'tasks' && (
            <TasksTab clientId="intera" defaultTasks={TSLAB_DEFAULT_TASKS} />
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
            Intrix CRM is a B2B sales CRM platform designed for companies with quotation-led sales processes in Croatia and Serbia. It helps sales teams manage complex B2B sales cycles, track quotations, and close deals efficiently.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Industry" value="Sales Software / CRM" />
            <InfoCard label="Business Model" value="B2B SaaS - CRM Platform" />
            <InfoCard label="Target Markets" value="Croatia & Serbia" />
            <InfoCard label="Service Type" value="Sales CRM with Quotation Management" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="What Intrix CRM Offers" icon={<TrendingUp className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="check">B2B sales CRM platform for quotation-led sales</ListItem>
          <ListItem type="check">Sales pipeline management and tracking</ListItem>
          <ListItem type="check">Quotation management and workflow</ListItem>
          <ListItem type="check">Deal forecasting and analytics</ListItem>
          <ListItem type="check">Integration with existing business systems</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Target Market Summary" icon={<Target className="w-5 h-5" />}>
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
          <p className="font-semibold text-indigo-900 mb-2">Who Intrix CRM Serves:</p>
          <p className="text-indigo-800">
            Sales Directors, Commercial Directors, and Managing Directors at B2B companies with 20-250 employees in Croatia and Serbia who operate on quotation-led sales models (technical distributors, manufacturers, integrators).
          </p>
        </div>
      </ContentSection>
    </>
  );
}

function ICPAndPersonasTab() {
  const salesLeadership = [
    'Sales Director', 'VP of Sales', 'Chief Revenue Officer', 'CRO', 'Head of Sales', 'Sales Manager', 'Regional Sales Manager', 'Area Sales Manager', 'Sales Lead', 'Director of Business Development', 'Head of Business Development'
  ];

  const commercialExecutives = [
    'Commercial Director', 'Commercial Manager', 'Managing Director', 'MD', 'Director', 'Executive Director', 'Operations Director', 'Business Unit Director', 'Director of Sales Operations', 'Sales Operations Manager', 'Commercial Operations Manager'
  ];

  const salesTeam = [
    'Account Executive', 'Sales Representative', 'Account Manager', 'Key Account Manager', 'Sales Manager', 'Account Development Representative', 'Business Development Representative', 'BDR', 'Inside Sales Representative', 'Territory Manager', 'Sales Specialist'
  ];

  return (
    <>
      <ContentSection title="Ideal Customer Profile" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 mb-3">MUST HAVE:</h4>
          <ul className="space-y-2">
            <ListItem type="check">20-250 employees</ListItem>
            <ListItem type="check">Based in Croatia or Serbia</ListItem>
            <ListItem type="check">B2B business model</ListItem>
            <ListItem type="check">Quotation-led sales process</ListItem>
            <ListItem type="check">Multiple sales team members (not solo seller)</ListItem>
            <ListItem type="check">Complex sales cycles requiring tracking and management</ListItem>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-4">
            <p className="font-semibold text-blue-900 mb-2">Company Types (Ideal):</p>
            <p className="text-blue-800 text-sm">
              Technical distributors, industrial equipment manufacturers, building material suppliers, IT integrators, machinery distributors, automotive parts suppliers, and other B2B companies with structured sales processes.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Disqualifiers" icon={<Target className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="cross">Under 20 employees</ListItem>
          <ListItem type="cross">Over 250 employees</ListItem>
          <ListItem type="cross">Located outside Croatia and Serbia</ListItem>
          <ListItem type="cross">B2C business model</ListItem>
          <ListItem type="cross">Transaction-based sales (e-commerce only)</ListItem>
          <ListItem type="cross">Already using enterprise CRM (Salesforce, HubSpot)</ListItem>
          <ListItem type="cross">No sales team or solo founder selling</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Target Job Titles / Buyer Personas" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-6">
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
            <p className="font-semibold text-indigo-900 mb-2">Target Positions for Intrix CRM</p>
            <p className="text-indigo-800 text-sm">
              The following job titles represent sales and commercial leaders at B2B organizations in Croatia and Serbia. These are the exact positions to target when sourcing leads.
            </p>
          </div>

          {/* Sales Leadership */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-lg">Sales Leadership ({salesLeadership.length})</h4>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-3">
              <p className="text-blue-900 text-sm">
                Sales directors and revenue leaders responsible for sales strategy, team management, and revenue targets. Primary decision-makers for CRM adoption.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {salesLeadership.map((position, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded px-2 py-1.5 text-xs">
                  {position}
                </div>
              ))}
            </div>
          </div>

          {/* Commercial Executives */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-bold text-sm">2</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-lg">Commercial & Managing Directors ({commercialExecutives.length})</h4>
            </div>
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-3 rounded mb-3">
              <p className="text-indigo-900 text-sm">
                Company owners, managing directors, and commercial leaders who oversee sales operations and make technology investment decisions.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {commercialExecutives.map((position, index) => (
                <div key={index} className="bg-indigo-50 border border-indigo-200 rounded px-2 py-1.5 text-xs">
                  {position}
                </div>
              ))}
            </div>
          </div>

          {/* Sales Team */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">3</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-lg">Sales Team & Account Managers ({salesTeam.length})</h4>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded mb-3">
              <p className="text-green-900 text-sm">
                Sales representatives and account managers who use CRM daily. They influence purchasing decisions and provide feedback on tool effectiveness.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {salesTeam.map((position, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded px-2 py-1.5 text-xs">
                  {position}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-violet-50 border-l-4 border-violet-500 p-4 rounded">
            <p className="font-semibold text-violet-900 mb-2">Total Positions: {salesLeadership.length + commercialExecutives.length + salesTeam.length}</p>
            <p className="text-violet-800 text-sm">
              Target Sales Directors and Commercial Directors for decision-making authority. Involve Account Managers in demos to show workflow benefits. In smaller organizations, one person may fill multiple roles.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Contact Data Requirements" icon={<Filter className="w-5 h-5" />}>
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

function FiltersTab() {
  return (
    <>
      <ContentSection title="Clay Search Criteria" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 mb-3">Location:</h4>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="font-semibold text-amber-900 mb-2">Target Markets:</p>
            <p className="text-amber-800 text-sm mb-3">
              <strong>Primary:</strong> Croatia (first focus)
            </p>
            <p className="text-amber-800 text-sm">
              <strong>Secondary:</strong> Serbia (after Croatia campaigns establish demand)
            </p>
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Company Size:</h4>
          <ul className="space-y-2">
            <ListItem>20-50 employees</ListItem>
            <ListItem>51-100 employees</ListItem>
            <ListItem>101-250 employees</ListItem>
          </ul>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Industry Filters:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              'Industrial Machinery',
              'Wholesale/Distribution',
              'Manufacturing',
              'Building Materials',
              'IT Services',
              'Technical Sales',
              'Equipment Sales',
              'B2B Commerce',
              'Business Services',
              'Commercial Supply',
            ].map((industry) => (
              <div key={industry} className="bg-slate-100 px-3 py-2 rounded text-sm border border-slate-200">
                {industry}
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Keywords:</h4>
          <CodeBlock code={`"sales" OR "CRM" OR "quotation" OR "distribution" OR "B2B sales" OR "manufacturer" OR "distributor"`} />
        </div>
      </ContentSection>
    </>
  );
}

function PromptsTab() {
  const icpPrompt = `You are analyzing a company's website to determine if they match our Ideal Customer Profile (ICP) for B2B sales CRM software.

TARGET PROFILE:
- Located in Croatia or Serbia
- 20-250 employees
- B2B business model (not B2C/e-commerce)
- Quotation-led sales process (not transaction/one-click sales)
- Multiple sales team members (not solo founder)
- Industries: Manufacturing, Distribution, Technical Sales, Industrial Equipment, Building Materials, IT Services
- Established company with structured sales operations

ANALYZE THE WEBSITE FOR:
1. Company Size: Do they appear to have 20-250 employees?
2. Location: Are they clearly based in Croatia or Serbia?
3. Business Model: Is this B2B (business-to-business)?
4. Sales Model: Do they appear to use quotations or proposals in sales process?
5. Sales Team: Do they mention multiple salespeople, account managers, or sales team?
6. Industry: Do they operate in target industries?
7. Complexity: Does this appear to be a company that would benefit from CRM?

OUTPUT:
- Answer: Yes / No / Unsure
- Reasoning: 2-3 sentence explanation of why they match or don't match
- Confidence: High / Medium / Low

Only answer "Yes" if you are confident this company:
- Has 20-250 employees
- Is based in Croatia or Serbia
- Operates B2B with quotation-led sales
- Has a sales team (not one person)
- Is in a target industry`;

  return (
    <>
      <ContentSection title="ICP Matching Prompt (Anthropic)" icon={<Code className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            This prompt is used in Clay to analyze company websites and determine if they match Intrix CRM's ICP.
          </p>
          <CodeBlock code={icpPrompt} language="text" />
        </div>
      </ContentSection>

      <ContentSection title="Key Matching Criteria" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-3">
          <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
            <p className="font-medium text-green-900">✓ GOOD MATCH</p>
            <p className="text-green-800 text-sm mt-1">
              Croatian or Serbian B2B company (20-250 employees) in distribution, manufacturing, or technical sales with structured sales team and quotation-based sales process.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
            <p className="font-medium text-red-900">✗ NOT A MATCH</p>
            <p className="text-red-800 text-sm mt-1">
              E-commerce business, B2C company, located outside Croatia/Serbia, under 20 or over 250 employees, or transaction-based sales model without quotations.
            </p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function CampaignsSequencesTab() {
  return (
    <>
      <SequencesTab clientId="intera" />
      <div className="mt-8">
        <CampaignsTabGeneric />
      </div>
    </>
  );
}
