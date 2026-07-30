'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
import { ContentSection, CodeBlock, InfoCard, ListItem } from '../components/ContentSection';
import TasksTab from '../components/TasksTab';
import StatusBadge, { getClientStatus, setClientStatus, DEFAULT_STATUSES, type ClientStatus } from '../components/StatusBadge';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import { Target, Users, Filter, Code, TrendingUp, FileText, CheckSquare, BarChart3, Zap, FolderOpen, AlertTriangle } from 'lucide-react';

const tabs = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'icp', label: 'ICP Profile', icon: Target },
  { id: 'filters', label: 'Clay Filters', icon: Filter },
  { id: 'prompts', label: 'AI Prompts', icon: Code },
  { id: 'personas', label: 'Buyer Personas', icon: Users },
  { id: 'campaigns', label: 'Campaigns', icon: Zap },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'documents', label: 'Documents', icon: FolderOpen },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
];

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('demo', DEFAULT_STATUSES.demo));

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
    setClientStatus('demo', newStatus);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const newPath = tabId === 'overview' ? '/demo' : `/demo/${tabId}`;
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
        {/* DEMO BANNER */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg p-4 mb-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-bold text-lg">DEMO DASHBOARD - Sample Data Only</p>
              <p className="text-sm text-amber-50">
                This is a demonstration of what your custom client dashboard will look like. All data shown here is sample data for presentation purposes.
              </p>
            </div>
          </div>
        </div>

        {/*Page Header*/}
        <div className="mb-6">
          <div className="flex items-center space-x-2 lg:space-x-3 mb-2">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl lg:text-2xl font-bold text-cyan-600">AC</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 lg:space-x-3 flex-wrap">
                <h1 className="text-xl lg:text-3xl font-bold text-slate-900">Acme Corporation</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white">
                  DEMO
                </span>
              </div>
              <p className="text-sm lg:text-base text-slate-600 break-words">Industrial Equipment Manufacturing (North America)</p>
            </div>
          </div>
          <a
            href="https://example.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-cyan-600 hover:underline inline-block"
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
          {activeTab === 'campaigns' && <CampaignsTab />}
          {activeTab === 'performance' && <PerformanceTab />}
          {activeTab === 'documents' && <DocumentsTab />}
          {activeTab === 'tasks' && (
            <TasksTab clientId="demo" defaultTasks={[]} />
          )}
        </div>
      </div>
    </ClientLayout>
  );
}

function OverviewTab() {
  return (
    <>
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-6">
        <p className="font-semibold text-amber-900 mb-1">Demo Notice:</p>
        <p className="text-amber-800 text-sm">
          All information below is sample data for demonstration purposes.
        </p>
      </div>

      <ContentSection title="Company Overview" icon={<FileText className="w-5 h-5" />}>
        <div className="space-y-4">
          <p>
            Acme Corporation is a fictional industrial equipment manufacturer serving the North American market.
            They specialize in heavy machinery and custom manufacturing solutions for the construction and
            mining industries.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Industry" value="Industrial Equipment Manufacturing" />
            <InfoCard label="Target Market" value="North America" />
            <InfoCard label="Business Model" value="B2B Manufacturing" />
            <InfoCard label="Revenue Range" value="$50M - $200M" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="What Acme Corporation Offers" icon={<TrendingUp className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="check">Custom industrial equipment design and manufacturing</ListItem>
          <ListItem type="check">Heavy machinery for construction and mining</ListItem>
          <ListItem type="check">OEM partnerships and component manufacturing</ListItem>
          <ListItem type="check">After-sales support and maintenance services</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Target Market Summary" icon={<Target className="w-5 h-5" />}>
        <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded">
          <p className="font-semibold text-cyan-900 mb-2">Who Acme Corporation Serves:</p>
          <p className="text-cyan-800">
            Mid-market construction and mining companies in North America with $10M+ annual revenue,
            operating fleets of 50+ units, and requiring custom equipment solutions or OEM partnerships.
          </p>
        </div>
      </ContentSection>
    </>
  );
}

function ICPTab() {
  return (
    <>
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-6">
        <p className="font-semibold text-amber-900 mb-1">Demo Notice:</p>
        <p className="text-amber-800 text-sm">
          This ICP profile is sample data for demonstration purposes.
        </p>
      </div>

      <ContentSection title="Ideal Customer Profile" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 mb-3">MUST HAVE:</h4>
          <ul className="space-y-2">
            <ListItem type="check">$10M+ annual revenue</ListItem>
            <ListItem type="check">50+ equipment units in operation</ListItem>
            <ListItem type="check">Located in North America (US, Canada, Mexico)</ListItem>
            <ListItem type="check">Active in construction or mining industries</ListItem>
            <ListItem type="check">Demonstrated need for custom equipment solutions</ListItem>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-4">
            <p className="font-semibold text-blue-900 mb-2">Target Company Size:</p>
            <p className="text-blue-800 text-sm">
              50-500 employees with established operations and growth plans
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Disqualifiers" icon={<Target className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="cross">Under $10M annual revenue</ListItem>
          <ListItem type="cross">Less than 50 equipment units</ListItem>
          <ListItem type="cross">Outside North America</ListItem>
          <ListItem type="cross">Residential construction only</ListItem>
          <ListItem type="cross">Equipment rental companies (not end users)</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Target Industries" icon={<Filter className="w-5 h-5" />}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            'Construction',
            'Mining',
            'Quarrying',
            'Heavy Civil Engineering',
            'Infrastructure Development',
            'Material Handling',
          ].map((industry) => (
            <div key={industry} className="bg-cyan-100 px-3 py-2 rounded text-sm">
              {industry}
            </div>
          ))}
        </div>
      </ContentSection>
    </>
  );
}

function FiltersTab() {
  return (
    <>
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-6">
        <p className="font-semibold text-amber-900 mb-1">Internal Tab - Admin Only:</p>
        <p className="text-amber-800 text-sm">
          This tab contains your lead generation search criteria and is only visible to your team.
        </p>
      </div>

      <ContentSection title="Clay Search Criteria" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 mb-3">Revenue Filter:</h4>
          <ul className="space-y-2">
            <ListItem>$10M–$500M USD</ListItem>
            <ListItem>Exclude: &lt;$10M and &gt;$500M</ListItem>
          </ul>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Location:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['United States', 'Canada', 'Mexico'].map((country) => (
              <div key={country} className="bg-cyan-100 px-3 py-2 rounded text-sm">
                {country}
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Industry Filters (LinkedIn):</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              'Construction',
              'Mining & Metals',
              'Heavy Equipment',
              'Civil Engineering',
              'Infrastructure',
            ].map((industry) => (
              <div key={industry} className="bg-slate-100 px-3 py-2 rounded text-sm border border-slate-200">
                {industry}
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Keywords:</h4>
          <CodeBlock code={`construction OR mining OR "heavy equipment" OR "industrial machinery"`} />
        </div>
      </ContentSection>
    </>
  );
}

function PromptsTab() {
  const icpPrompt = `You are analyzing a company to determine if they match Acme Corporation's Ideal Customer Profile (ICP).

TARGET PROFILE:
- Revenue: $10M–$500M USD
- Location: North America (US, Canada, Mexico)
- Industry: Construction, mining, or related heavy industry
- Company size: 50-500 employees
- Active operations with 50+ equipment units

ANALYZE FOR:
1. Revenue: Is the company in the $10M–$500M range?
2. Location: Are they based in North America?
3. Industry: Do they operate in construction, mining, or heavy industrial sectors?
4. Scale: Do they have significant equipment operations (50+ units)?

DISQUALIFIERS:
- Revenue outside target range
- Outside North America
- Residential construction only
- Equipment rental/leasing companies
- Service-only companies (no equipment operations)

OUTPUT:
- Answer: Yes / No / Unsure
- Reasoning: 2-3 sentences explaining revenue, location, industry, and scale
- Confidence: High / Medium / Low

Only answer "Yes" if confident the company:
- Has $10M-$500M revenue
- Operates in North America
- Works in target industries
- Has significant equipment operations`;

  return (
    <>
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-6">
        <p className="font-semibold text-amber-900 mb-1">Internal Tab - Admin Only:</p>
        <p className="text-amber-800 text-sm">
          This tab contains your AI prompts for lead qualification and is only visible to your team.
        </p>
      </div>

      <ContentSection title="ICP Matching Prompt (Anthropic)" icon={<Code className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            This prompt is used in Clay to analyze company profiles and determine if they match your ICP.
          </p>
          <CodeBlock code={icpPrompt} language="text" />
        </div>
      </ContentSection>

      <ContentSection title="Key Matching Criteria" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-3">
          <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
            <p className="font-medium text-green-900">✓ GOOD MATCH</p>
            <p className="text-green-800 text-sm mt-1">
              $50M revenue construction company in Texas with 150 employees operating 200+ pieces of heavy equipment.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
            <p className="font-medium text-red-900">✗ NOT A MATCH</p>
            <p className="text-red-800 text-sm mt-1">
              Small residential contractor with $2M revenue, 10 employees, outside North America, or equipment rental company.
            </p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function PersonasTab() {
  return (
    <>
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-6">
        <p className="font-semibold text-amber-900 mb-1">Demo Notice:</p>
        <p className="text-amber-800 text-sm">
          These are sample buyer personas for demonstration purposes.
        </p>
      </div>

      <ContentSection title="Target Job Titles / Buyer Personas" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-6">
          <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded">
            <p className="font-semibold text-cyan-900 mb-2">Target Positions for Acme Corporation</p>
            <p className="text-cyan-800 text-sm">
              The following job titles represent decision-makers at construction and mining companies.
            </p>
          </div>

          {/* Decision Makers */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-lg">Executive Decision Makers</h4>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-3">
              <p className="text-blue-900 text-sm">
                C-level executives and senior management who approve major equipment purchases.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {[
                'CEO',
                'President',
                'VP of Operations',
                'VP of Equipment',
                'Director of Operations',
                'General Manager',
                'COO',
                'Owner',
              ].map((position, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded px-2 py-1.5 text-xs">
                  {position}
                </div>
              ))}
            </div>
          </div>

          {/* Equipment Managers */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">2</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-lg">Equipment & Fleet Managers</h4>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded mb-3">
              <p className="text-green-900 text-sm">
                Managers responsible for fleet operations, equipment procurement, and maintenance.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {[
                'Equipment Manager',
                'Fleet Manager',
                'Equipment Director',
                'Fleet Director',
                'Equipment Coordinator',
                'Asset Manager',
                'Maintenance Manager',
                'Operations Manager',
              ].map((position, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded px-2 py-1.5 text-xs">
                  {position}
                </div>
              ))}
            </div>
          </div>

          {/* Procurement */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">3</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-lg">Procurement & Purchasing</h4>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded mb-3">
              <p className="text-purple-900 text-sm">
                Procurement professionals who source equipment and negotiate vendor contracts.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {[
                'Procurement Manager',
                'Purchasing Manager',
                'Director of Procurement',
                'Senior Buyer',
                'Procurement Director',
                'Purchasing Director',
              ].map((position, index) => (
                <div key={index} className="bg-purple-50 border border-purple-200 rounded px-2 py-1.5 text-xs">
                  {position}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function CampaignsTab() {
  const campaigns = [
    {
      list: 'Texas Construction Companies',
      listUrl: null,
      campaignName: 'Acme Corp | Texas | Decision Makers | Oct 2026',
      campaignUrl: null,
      dateLaunched: '15/Oct/26',
      leadsAdded: 250,
      launched: true,
    },
    {
      list: 'Texas Construction Companies',
      listUrl: null,
      campaignName: 'Acme Corp | Texas | Equipment Managers | Oct 2026',
      campaignUrl: null,
      dateLaunched: '15/Oct/26',
      leadsAdded: 180,
      launched: true,
    },
    {
      list: 'Canada Mining Operators',
      listUrl: null,
      campaignName: 'Acme Corp | Canada | Decision Makers | Oct 2026',
      campaignUrl: null,
      dateLaunched: '22/Oct/26',
      leadsAdded: 120,
      launched: true,
    },
    {
      list: 'California Heavy Civil',
      listUrl: null,
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

  return (
    <>
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-6">
        <p className="font-semibold text-amber-900 mb-1">Demo Notice:</p>
        <p className="text-amber-800 text-sm">
          These are sample campaign metrics for demonstration purposes.
        </p>
      </div>

      <ContentSection title="Campaign Summary" icon={<BarChart3 className="w-5 h-5" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200 p-3 lg:p-6 shadow-sm">
            <p className="text-xs lg:text-sm text-cyan-700 font-medium mb-1">Total Leads</p>
            <p className="text-xl lg:text-4xl font-bold text-cyan-900">{totalLeads.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-3 lg:p-6 shadow-sm">
            <p className="text-xs lg:text-sm text-blue-700 font-medium mb-1">Campaigns</p>
            <p className="text-xl lg:text-4xl font-bold text-blue-900">{totalCampaigns}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-3 lg:p-6 shadow-sm">
            <p className="text-xs lg:text-sm text-purple-700 font-medium mb-1">Markets</p>
            <p className="text-xl lg:text-4xl font-bold text-purple-900">2</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Campaign Details" icon={<Zap className="w-5 h-5" />}>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">List / Market</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Campaign Name</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Leads</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.map((campaign, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{campaign.list}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {campaign.campaignName || <span className="text-slate-400 italic">Not created yet</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 text-center">{campaign.dateLaunched || '—'}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-right">
                      <span className={campaign.leadsAdded > 0 ? 'text-cyan-700' : 'text-slate-400'}>
                        {campaign.leadsAdded.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        campaign.launched ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {campaign.launched ? 'Launched' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function PerformanceTab() {
  return (
    <>
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-6">
        <p className="font-semibold text-amber-900 mb-1">Demo Notice:</p>
        <p className="text-amber-800 text-sm">
          These are sample performance metrics for demonstration purposes.
        </p>
      </div>

      <ContentSection title="Campaign Performance Metrics" icon={<BarChart3 className="w-5 h-5" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-sm text-slate-600 mb-1">Emails Sent</p>
            <p className="text-2xl font-bold text-slate-900">12,450</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-sm text-slate-600 mb-1">Reply Rate</p>
            <p className="text-2xl font-bold text-green-600">8.2%</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-sm text-slate-600 mb-1">Positive Replies</p>
            <p className="text-2xl font-bold text-blue-600">247</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-sm text-slate-600 mb-1">Meetings Booked</p>
            <p className="text-2xl font-bold text-cyan-600">42</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Recent Activity" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="space-y-3">
          {[
            { date: '2026-10-28', event: 'Meeting booked with Johnson Construction', type: 'success' },
            { date: '2026-10-27', event: 'Positive reply from Alberta Mining Corp', type: 'success' },
            { date: '2026-10-26', event: 'Meeting booked with Southwest Heavy Equipment', type: 'success' },
            { date: '2026-10-25', event: 'Follow-up sequence started for 50 prospects', type: 'info' },
          ].map((activity, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-lg p-4 flex items-center space-x-4">
              <div className={`w-2 h-2 rounded-full ${activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{activity.event}</p>
                <p className="text-xs text-slate-500">{activity.date}</p>
              </div>
            </div>
          ))}
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
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-6">
        <p className="font-semibold text-amber-900 mb-1">Demo Notice:</p>
        <p className="text-amber-800 text-sm">
          In your actual dashboard, you'll be able to upload and download documents here.
        </p>
      </div>

      <ContentSection title="Uploaded Documents" icon={<FolderOpen className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-600">
              Upload and manage documents for your campaigns. All uploaded files will be available for download.
            </p>
            <FileUpload clientId="demo" onUploadComplete={handleUploadComplete} />
          </div>

          <FileList clientId="demo" refreshTrigger={refreshTrigger} />
        </div>
      </ContentSection>
    </>
  );
}
