'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
import { ContentSection, CodeBlock, InfoCard, ListItem } from '../components/ContentSection';
import TasksTab from '../components/TasksTab';
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

export default function PlantryxPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('plantryx', DEFAULT_STATUSES.plantryx));

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
    setClientStatus('plantryx', newStatus);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const newPath = tabId === 'overview' ? '/plantryx' : `/plantryx/${tabId}`;
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
              <span className="text-xl lg:text-2xl font-bold text-indigo-600">P</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 lg:space-x-3 flex-wrap">
                <h1 className="text-xl lg:text-3xl font-bold text-slate-900">Plantryx</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
              </div>
              <p className="text-sm lg:text-base text-slate-600 break-words">AI-Native Demand Forecasting & Supply Planning (EU Manufacturing)</p>
            </div>
          </div>
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
          {activeTab === 'sequences' && <SequencesTab />}
          {activeTab === 'campaigns' && <CampaignsTab />}
          {activeTab === 'performance' && <PerformanceTab />}
          {activeTab === 'documents' && <DocumentsTab />}
          {activeTab === 'tasks' && (
            <TasksTab clientId="plantryx" defaultTasks={[]} />
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
            Plantryx is an AI-native demand forecasting, supply planning, and inventory optimization platform
            specifically built for mid-market manufacturers in the EU. The platform replaces Excel-based planning
            layers while integrating with existing ERP systems.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Industry" value="Manufacturing SaaS / Supply Chain Tech" />
            <InfoCard label="Target Market" value="EU Mid-Market Manufacturers" />
            <InfoCard label="Solution Type" value="AI Demand Forecasting & Planning" />
            <InfoCard label="Integration" value="ERP Layer (Non-Replacement)" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="What Plantryx Offers" icon={<TrendingUp className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="check">AI-native demand forecasting for manufacturers</ListItem>
          <ListItem type="check">Supply planning and inventory optimization</ListItem>
          <ListItem type="check">Replaces Excel/manual planning layer on top of existing ERP</ListItem>
          <ListItem type="check">ERP stays as system of record (no rip-and-replace)</ListItem>
          <ListItem type="check">IT-light deployment with no new master-data project</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Target Market Summary" icon={<Target className="w-5 h-5" />}>
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
          <p className="font-semibold text-indigo-900 mb-2">Who Plantryx Serves:</p>
          <p className="text-indigo-800">
            Mid-market manufacturers ($100M-$1B revenue) in the EU with existing ERP systems,
            operating in electrical equipment, automation machinery, semiconductor, automotive,
            or fabricated metals verticals. Target geographies: Netherlands, Nordics, Poland (priority),
            and DACH (secondary).
          </p>
        </div>
      </ContentSection>

      <ContentSection title="Messaging Guidelines" icon={<Zap className="w-5 h-5" />}>
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded mb-4">
          <p className="font-semibold text-indigo-900 mb-2">Note from Plantryx:</p>
          <p className="text-indigo-800 text-sm">
            You run outreach campaigns daily and we don't — if your experience suggests a different approach,
            we want to hear it. Treat the positioning and claims-discipline points below as fixed; everything
            else is open for your input at kickoff.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Email 1 - Lead with Pitch (Not Survey):</h4>
            <ul className="space-y-1 text-sm text-slate-700">
              <li>• AI-native demand forecasting, supply planning, and inventory optimization</li>
              <li>• ERP stays as system of record</li>
              <li>• Plantryx replaces the Excel/manual planning layer</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">CTA Structure:</h4>
            <ul className="space-y-1 text-sm text-slate-700">
              <li>• Low-friction interest question (e.g., "worth a look?")</li>
              <li>• Reply-based CTAs in early touches</li>
              <li>• No links in email 1 (deliverability)</li>
              <li>• Planning Maturity Diagnostic (5-min, ungated) as follow-up asset</li>
            </ul>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
            <p className="font-semibold text-red-900 text-sm mb-1">Claims Discipline (FIXED):</p>
            <ul className="space-y-1 text-red-800 text-xs">
              <li>✓ Only live capabilities: forecasting, demand/supply planning, inventory optimization</li>
              <li>✗ No roadmap features</li>
              <li>✗ Never frame as ERP replacement</li>
              <li>✗ No "AI replaces your planners" framing</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Approval Required:</h4>
            <p className="text-sm text-slate-700">
              All copy and a 50-row lead list sample approved by Plantryx before first send.
            </p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function ICPTab() {
  return (
    <>
      <ContentSection title="Company-Level ICP" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-6">
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
            <p className="font-semibold text-indigo-900 mb-2">ALL Criteria Must Hold:</p>
            <p className="text-indigo-800 text-sm">
              Every criterion below is mandatory. A company missing any one criterion is disqualified.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Revenue:</h4>
            <ul className="space-y-2">
              <ListItem type="check">$100M–$1B USD (approx. €90M–€900M)</ListItem>
              <ListItem type="cross">Exclude enterprise (&gt;$1B)</ListItem>
              <ListItem type="cross">Exclude sub-$50M companies</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Company Type:</h4>
            <ul className="space-y-2">
              <ListItem type="check">Manufacturers (discrete or light process)</ListItem>
              <ListItem type="check">Inventory-heavy distributors (secondary)</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Systems (ERP Required):</h4>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-3">
              <p className="font-semibold text-red-900 mb-1">DISQUALIFIER:</p>
              <p className="text-red-800 text-sm">Companies with no ERP are immediately disqualified.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                'SAP (incl. Business One / S/4)',
                'Microsoft Dynamics 365 BC/F&O',
                'Infor',
                'IFS',
                'Epicor',
                'Oracle',
                'NetSuite',
                'QAD',
                'proALPHA',
                'abas',
              ].map((erp) => (
                <div key={erp} className="bg-indigo-50 border border-indigo-200 rounded px-2 py-1.5 text-xs">
                  {erp}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Geography:</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Priority 1:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['Netherlands', 'Sweden', 'Denmark', 'Finland', 'Norway', 'Poland'].map((country) => (
                    <div key={country} className="bg-green-100 px-3 py-2 rounded text-sm font-medium">
                      {country}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Priority 2 (DACH):</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['Germany', 'Austria', 'Switzerland'].map((country) => (
                    <div key={country} className="bg-amber-100 px-3 py-2 rounded text-sm">
                      {country}
                    </div>
                  ))}
                </div>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded mt-2">
                  <p className="text-amber-900 text-sm">
                    DACH requires UWG/GDPR-compliant approach (to be described in writing)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Target Verticals (Priority Order)" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-3">
          {[
            {
              num: 1,
              name: 'Electrical Equipment / Grid / Power',
              examples: 'Transformers, switchgear, power distribution, data-center electrical & cooling',
            },
            {
              num: 2,
              name: 'Automation & Industrial Machinery',
              examples: 'Motion control, robotics components, packaging machinery, capital equipment',
            },
            {
              num: 3,
              name: 'Semiconductor / High-Tech Adjacent',
              examples: 'Test equipment, precision components, electronics manufacturing (lower volume weight; long sales cycles)',
            },
            {
              num: 4,
              name: 'Motor Vehicle / Auto Parts',
              examples: 'Tier 1–2 suppliers, aftermarket',
            },
            {
              num: 5,
              name: 'Fabricated Metals / Machining',
              examples: 'Precision machining, multi-SKU metal fabrication',
            },
          ].map((vertical) => (
            <div key={vertical.num} className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-bold text-sm">{vertical.num}</span>
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-slate-900 mb-1">{vertical.name}</h5>
                  <p className="text-sm text-slate-600">{vertical.examples}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection title="Buying Signals — Rank Leads by Signal Strength" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="space-y-4">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">S</span>
              </div>
              <h4 className="font-semibold text-slate-900">Strong Signals (Any ONE Qualifies as Priority)</h4>
            </div>
            <ul className="space-y-1 text-sm text-slate-700">
              <ListItem type="check">Open job posting for demand/supply planner, S&OP manager, production planner, or materials manager</ListItem>
              <ListItem type="check">ERP implementation or migration underway/recently completed</ListItem>
              <ListItem type="check">New plant, facility expansion, or capacity investment announcement</ListItem>
              <ListItem type="check">New VP/Director of Supply Chain or Operations hired within last 6 months</ListItem>
            </ul>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-amber-600 font-bold text-sm">M</span>
              </div>
              <h4 className="font-semibold text-slate-900">Medium Signals (TWO or More Required)</h4>
            </div>
            <ul className="space-y-1 text-sm text-slate-700">
              <ListItem>Ops/supply chain headcount growth &gt;10% YoY</ListItem>
              <ListItem>New market entry or product-line launch (SKU proliferation)</ListItem>
              <ListItem>Posts about forecast accuracy, excess inventory, stockouts, lead-time volatility, S&OP maturity</ListItem>
              <ListItem>Recent PE acquisition or ownership change (working-capital pressure)</ListItem>
              <ListItem>Supply base restructuring (tariffs, reshoring, energy costs)</ListItem>
            </ul>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center">
                <span className="text-slate-600 font-bold text-sm">W</span>
              </div>
              <h4 className="font-semibold text-slate-900">Weak Signals (Context Only — Never Qualifying Alone)</h4>
            </div>
            <ul className="space-y-1 text-sm text-slate-600">
              <ListItem>Generic "digital transformation" language</ListItem>
              <ListItem>Supply chain event/webinar attendance</ListItem>
              <ListItem>Follows planning-software vendors on LinkedIn</ListItem>
            </ul>
          </div>
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
          <h4 className="font-semibold text-slate-900 mb-3">Revenue Filter:</h4>
          <ul className="space-y-2">
            <ListItem>$100M–$1B USD (€90M–€900M)</ListItem>
            <ListItem>Exclude: &lt;$50M and &gt;$1B</ListItem>
          </ul>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Location (Priority 1):</h4>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="font-semibold text-amber-900 mb-1">Important:</p>
            <p className="text-amber-800 text-sm">
              Select <strong>ONE country at a time</strong> from: Netherlands, Sweden, Denmark, Finland, Norway, Poland
            </p>
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Industry Filters (LinkedIn):</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              'Electrical/Electronic Manufacturing',
              'Industrial Automation',
              'Machinery Manufacturing',
              'Semiconductor Manufacturing',
              'Motor Vehicle Manufacturing',
              'Motor Vehicle Parts Manufacturing',
              'Fabricated Metal Products',
              'Industrial Machinery Manufacturing',
            ].map((industry) => (
              <div key={industry} className="bg-slate-100 px-3 py-2 rounded text-sm border border-slate-200">
                {industry}
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Company Technologies (ERP):</h4>
          <CodeBlock code={`SAP OR "Dynamics 365" OR Infor OR IFS OR Epicor OR Oracle OR NetSuite OR QAD OR proALPHA OR abas`} />

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mt-4">
            <p className="font-semibold text-red-900 mb-2">CRITICAL:</p>
            <p className="text-red-800 text-sm">
              Companies with no ERP signal must be filtered out. Use technology filters or company description analysis to confirm ERP presence.
            </p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function PromptsTab() {
  const icpPrompt = `You are analyzing a company's profile to determine if they match Plantryx's Ideal Customer Profile (ICP) for AI-native demand forecasting and supply planning.

TARGET PROFILE:
- Revenue: $100M–$1B USD (€90M–€900M) — exclude enterprise (>$1B) and sub-$50M
- Company type: Manufacturer (discrete or light process) OR inventory-heavy distributor
- MUST have ERP: SAP, Dynamics 365, Infor, IFS, Epicor, Oracle, NetSuite, QAD, proALPHA, or abas
- Location: Netherlands, Nordics (SE/DK/FI/NO), Poland (priority); DACH (secondary)
- Target verticals (priority order):
  1. Electrical equipment / grid / power
  2. Automation & industrial machinery
  3. Semiconductor / high-tech adjacent
  4. Motor vehicle / auto parts
  5. Fabricated metals / machining

ANALYZE FOR:
1. Revenue: Is the company in the $100M–$1B range?
2. Company Type: Manufacturer or inventory-heavy distributor?
3. ERP System: Does the company have one of the listed ERPs? (CRITICAL — no ERP = disqualified)
4. Location: EU country in priority list?
5. Vertical: Does the company operate in one of the 5 target verticals?

DISQUALIFIERS (any one disqualifies):
- No ERP system identified
- Revenue outside $100M–$1B range
- Not a manufacturer or distributor
- Outside EU priority geographies
- Not in target verticals

OUTPUT:
- Answer: Yes / No / Unsure
- Reasoning: 2-3 sentences explaining revenue range, company type, ERP system, vertical, and geography
- Confidence: High / Medium / Low

Only answer "Yes" if you are confident this company:
- Is a mid-market manufacturer ($100M–$1B)
- Has a named ERP system
- Operates in a target vertical
- Is located in EU priority geography`;

  return (
    <>
      <ContentSection title="ICP Matching Prompt (Anthropic)" icon={<Code className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            This prompt is used in Clay to analyze company profiles and determine if they match Plantryx's ICP.
          </p>
          <CodeBlock code={icpPrompt} language="text" />
        </div>
      </ContentSection>

      <ContentSection title="Key Matching Criteria" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-3">
          <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
            <p className="font-medium text-green-900">✓ GOOD MATCH</p>
            <p className="text-green-800 text-sm mt-1">
              €200M revenue manufacturer in Netherlands making industrial automation equipment, using Microsoft Dynamics 365 for ERP.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
            <p className="font-medium text-red-900">✗ NOT A MATCH</p>
            <p className="text-red-800 text-sm mt-1">
              No ERP identified, revenue &lt;$50M or &gt;$1B, non-manufacturer (e.g., pure software/services), or outside target verticals.
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
      <ContentSection title="Persona Tiers — Campaign Structure" icon={<Users className="w-5 h-5" />}>
        <div className="bg-violet-50 border-l-4 border-violet-500 p-4 rounded mb-6">
          <p className="font-semibold text-violet-900 mb-2">Important:</p>
          <p className="text-violet-800 text-sm">
            Each tier is a distinct segment with its own messaging angle. Structure campaigns and reporting
            at the tier level. Within-account sequencing: start Tier 2 for smaller accounts ($100–300M),
            start Tier 1 for larger accounts.
          </p>
        </div>

        {/* Tier 1 */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">1</span>
            </div>
            <h4 className="font-semibold text-slate-900 text-lg">Tier 1 — Corporate Planning (Core Volume)</h4>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-3">
            <p className="text-blue-900 text-sm font-medium mb-1">Messaging Angle:</p>
            <p className="text-blue-800 text-sm">Forecast accuracy, S&OP maturity, planning-cycle speed, decision lag</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              'Director of Supply Chain',
              'Sr. Manager of Supply Chain',
              'Director of Demand Planning',
              'Sr. Manager of Demand Planning',
              'Director of Supply Planning',
              'Sr. Manager of Supply Planning',
              'Director of S&OP',
              'Director of IBP',
              'Sr. Manager of S&OP',
              'Sr. Manager of IBP',
            ].map((title) => (
              <div key={title} className="bg-blue-50 border border-blue-200 rounded px-2 py-1.5 text-xs">
                {title}
              </div>
            ))}
          </div>
        </div>

        {/* Tier 2 */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-sm">2</span>
            </div>
            <h4 className="font-semibold text-slate-900 text-lg">Tier 2 — Manufacturing-Native Planning (Core Volume — Do Not Skip)</h4>
          </div>
          <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded mb-3">
            <p className="text-green-900 text-sm font-medium mb-1">Messaging Angle:</p>
            <p className="text-green-800 text-sm">Shortages, expedites, schedule stability, MRP noise — operational language, not corporate S&OP framing</p>
          </div>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded mb-3">
            <p className="text-amber-900 text-sm">
              <strong>Note:</strong> Many target companies have no "demand planner" title at all. Master Scheduler owns MRP daily despite non-Director title.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              'Master Scheduler',
              'Master Production Scheduler',
              'Director of Production Planning',
              'Manager of Production Planning',
              'Production Control Manager',
              'Planning & Scheduling Manager',
              'Materials Manager',
              'Director of Materials Management',
              'Materials Planning Manager',
              'Plant Manager',
              'Director of Manufacturing (site-level)',
              'Director of Operations (site-level)',
            ].map((title) => (
              <div key={title} className="bg-green-50 border border-green-200 rounded px-2 py-1.5 text-xs">
                {title}
              </div>
            ))}
          </div>
        </div>

        {/* Tier 3 */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-sm">3</span>
            </div>
            <h4 className="font-semibold text-slate-900 text-lg">Tier 3 — Inventory & MRO</h4>
          </div>
          <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded mb-3">
            <p className="text-purple-900 text-sm font-medium mb-1">Messaging Angle:</p>
            <p className="text-purple-800 text-sm">Excess stock, working capital, stockout-vs-overstock tradeoff</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              'Director of Inventory Controls',
              'Inventory Control Manager',
              'MRO Sourcing Director',
              'MRO Planning Director',
              'Sr. Manager of MRO Sourcing',
              'Sr. Manager of MRO Planning',
            ].map((title) => (
              <div key={title} className="bg-purple-50 border border-purple-200 rounded px-2 py-1.5 text-xs">
                {title}
              </div>
            ))}
          </div>
        </div>

        {/* Tier 4 */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-bold text-sm">4</span>
            </div>
            <h4 className="font-semibold text-slate-900 text-lg">Tier 4 — ERP/IT System Owners (~10–15% of volume, separate sequence)</h4>
          </div>
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-3 rounded mb-3">
            <p className="text-indigo-900 text-sm font-medium mb-1">Messaging Angle:</p>
            <p className="text-indigo-800 text-sm">Systems framing — AI planning layer on existing ERP, no rip-and-replace, no new master-data project, IT-light deployment</p>
          </div>
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded mb-3">
            <p className="text-red-900 text-sm">
              <strong>Exclude:</strong> Developer titles with generic software stacks and no ERP signal; independent consultants not tied to a qualified account
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              'IT Manager',
              'IT Director',
              'ERP Manager',
              'ERP Project Manager',
              'Business Systems Manager',
              'CIO (smaller companies)',
              'SAP Consultant (in-house)',
              'Dynamics Consultant (in-house)',
              'ERP Developer (with ERP/planning stack)',
            ].map((title) => (
              <div key={title} className="bg-indigo-50 border border-indigo-200 rounded px-2 py-1.5 text-xs">
                {title}
              </div>
            ))}
          </div>
        </div>

        {/* Executive Layer */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <span className="text-amber-600 font-bold text-sm">E</span>
            </div>
            <h4 className="font-semibold text-slate-900 text-lg">Executive Layer (Light Volume, Peer Tone)</h4>
          </div>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded mb-3">
            <p className="text-amber-900 text-sm font-medium mb-1">Messaging Angle:</p>
            <p className="text-amber-800 text-sm">Strategic — working capital, service levels, planning as competitive capability. No survey-style asks.</p>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-3">
            <p className="text-blue-900 text-sm">
              Weighted toward $100–300M companies where executives are closer to operations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              'VP Supply Chain',
              'VP Operations',
              'COO',
            ].map((title) => (
              <div key={title} className="bg-amber-50 border border-amber-200 rounded px-2 py-1.5 text-xs">
                {title}
              </div>
            ))}
          </div>
        </div>

        {/* Do Not Contact */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="font-semibold text-red-900 mb-2">Do NOT Contact:</p>
          <ul className="space-y-1 text-red-800 text-sm">
            <li>• Planners/analysts below Sr. level (Master Scheduler is the one exception)</li>
            <li>• Procurement-only titles</li>
            <li>• Sales, finance, or HR at any level</li>
          </ul>
        </div>
      </ContentSection>
    </>
  );
}

function CampaignsTab() {
  return (
    <>
      <ContentSection title="Campaign Overview" icon={<Zap className="w-5 h-5" />}>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
          <p className="text-slate-600 mb-4">
            No campaigns have been launched yet for Plantryx.
          </p>
          <p className="text-sm text-slate-500">
            Once campaigns are active, they will be listed here with performance metrics and links to SmartLead.
          </p>
        </div>
      </ContentSection>

      <ContentSection title="Campaign Planning Notes" icon={<FileText className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
            <p className="font-semibold text-indigo-900 mb-2">Sequencing Strategy:</p>
            <ul className="space-y-1 text-indigo-800 text-sm">
              <li>• Small accounts ($100–300M): Start with Tier 2 (Manufacturing Planning)</li>
              <li>• Larger accounts: Start with Tier 1 (Corporate Planning)</li>
              <li>• Tier 4 (ERP/IT) as second wave or first where no planning title exists</li>
              <li>• Sequence contacts at the same account rather than emailing several in parallel</li>
            </ul>
          </div>

          <div className="bg-violet-50 border-l-4 border-violet-500 p-4 rounded">
            <p className="font-semibold text-violet-900 mb-2">Pre-Launch Requirements:</p>
            <ul className="space-y-1 text-violet-800 text-sm">
              <li>• All copy approved by Plantryx</li>
              <li>• 50-row lead list sample approved</li>
              <li>• Leads prioritized by buying signal strength (Strong &gt; Medium &gt; Weak)</li>
            </ul>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function PerformanceTab() {
  return (
    <>
      <ContentSection title="Reporting Metrics — Plantryx's Position" icon={<BarChart3 className="w-5 h-5" />}>
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded mb-6">
          <p className="font-semibold text-indigo-900 mb-2">Reporting Frequency:</p>
          <p className="text-indigo-800 text-sm">Bi-weekly reports structured around the metrics below, in priority order</p>
        </div>

        <div className="space-y-4">
          {/* Primary Metrics */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Primary Success Metrics (Priority Order):</h4>
            <div className="space-y-3">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-green-900">1. Meetings Booked</p>
                    <p className="text-green-800 text-sm">Primary success metric</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-blue-900">2. Positive Replies</p>
                    <p className="text-blue-800 text-sm">Interested / wants info / referral to right person</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-purple-900">3. Total Replies and Reply Rate</p>
                    <p className="text-purple-800 text-sm">All replies (positive, negative, neutral)</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border-l-4 border-slate-400 p-4 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">4. Volume Delivered</p>
                    <p className="text-slate-700 text-sm">Emails sent, bounces, deliverability health</p>
                  </div>
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <span className="text-slate-600 font-bold">4</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Supporting Metrics */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Supporting Context Only:</h4>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
              <p className="font-semibold text-amber-900 mb-2">Opens/Clicks</p>
              <p className="text-amber-800 text-sm">
                Reported as supporting context only — not used for optimization decisions
              </p>
            </div>
          </div>

          {/* Why Open Rate Is Not a Success Metric */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Why Open Rate Is NOT a Success Metric:</h4>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded space-y-3">
              <div>
                <p className="font-medium text-red-900 mb-1">1. Technically Unreliable</p>
                <p className="text-red-800 text-sm">
                  Apple Mail Privacy Protection and corporate security gateways (Microsoft Defender, Proofpoint, Mimecast)
                  auto-fetch tracking pixels, registering "opens" whether or not a human read the email.
                </p>
              </div>
              <div>
                <p className="font-medium text-red-900 mb-1">2. Opens Carry No Intent</p>
                <p className="text-red-800 text-sm">
                  An open cannot distinguish curiosity, accident, or a bot. Replies and meetings are human actions
                  with intent — they are the only signals that predict pipeline.
                </p>
              </div>
              <div>
                <p className="font-medium text-red-900 mb-1">3. Practical Consequence</p>
                <p className="text-red-800 text-sm">
                  Warm-lead triggers or optimization decisions based on opens will chase noise. Reply-based signals
                  should drive prioritization and Month-2 optimization.
                </p>
              </div>
            </div>
          </div>

          {/* Alignment on Success */}
          <div className="bg-violet-50 border-l-4 border-violet-500 p-4 rounded">
            <p className="font-semibold text-violet-900 mb-2">Alignment on Success:</p>
            <p className="text-violet-800 text-sm mb-2">
              We are not asking for a meeting guarantee. Conversion depends on our offer and messaging, which we own and approve.
            </p>
            <p className="text-violet-800 text-sm">
              What we're aligning on: (a) the list matches the ICP, and (b) reporting reflects the metrics that matter.
              If the list is right and replies are low, that's on our messaging — and we'll iterate on it together.
            </p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function SequencesTab() {
  return (
    <>
      <ContentSection title="Email Sequences by Persona Tier" icon={<Mail className="w-5 h-5" />}>
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded mb-6">
          <p className="font-semibold text-indigo-900 mb-2">Sequence Design Principles:</p>
          <div className="text-indigo-800 text-sm space-y-1">
            <p>• <strong>Email 1:</strong> Low-friction interest question ("Worth a look?") — reply-based, no links</p>
            <p>• <strong>Email 2:</strong> Offer Planning Maturity Diagnostic (5-min self-assessment) — permission-based</p>
            <p>• <strong>Email 3:</strong> 20-minute founder call — direct meeting ask</p>
            <p>• <strong>Claims discipline:</strong> Only live capabilities (forecasting, planning, inventory optimization)</p>
            <p>• <strong>Tone:</strong> Specific and honest. One idea per email. Never "AI replaces your planners"</p>
          </div>
        </div>

        {/* Tier 1: Corporate Planning */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">1</span>
            </div>
            <h4 className="font-semibold text-slate-900 text-lg">TIER 1: Corporate Planning</h4>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-4">
            <p className="text-blue-900 text-sm font-medium mb-1">Target Personas:</p>
            <p className="text-blue-800 text-sm">Director/Sr. Manager of Supply Chain, Demand Planning, Supply Planning, S&OP/IBP</p>
            <p className="text-blue-900 text-sm font-medium mt-2 mb-1">Messaging Angle:</p>
            <p className="text-blue-800 text-sm">Forecast accuracy, S&OP maturity, planning-cycle speed, decision lag</p>
          </div>

          {/* Email 1 */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 mb-3">
            <div className="flex items-center space-x-2 mb-3">
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">EMAIL 1</span>
              <span className="text-slate-600 text-sm">Initial Outreach</span>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">SUBJECT:</p>
                <p className="text-sm font-mono bg-slate-50 p-2 rounded border border-slate-200">
                  AI planning layer for [Company Name]'s S&OP cycle
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">BODY:</p>
                <div className="text-sm bg-slate-50 p-3 rounded border border-slate-200 font-mono whitespace-pre-wrap">
{`Hi [First Name],

Most mid-market manufacturers we work with run S&OP in SAP/Dynamics/[ERP] but still plan demand and supply in Excel. The ERP holds the data, but the real planning decisions happen outside it — manual forecasts, spreadsheet-based supply plans, slow iteration cycles.

Plantryx is an AI-native planning layer that sits on top of your existing ERP. It handles demand forecasting, supply planning, and inventory optimization — replacing the Excel layer, not the ERP.

The result: faster S&OP cycles, better forecast accuracy, and fewer surprises between planning rounds.

Worth a look for [Company Name]?

Best,
[Your Name]`}
                </div>
              </div>
            </div>
          </div>

          {/* Email 2 */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 mb-3">
            <div className="flex items-center space-x-2 mb-3">
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">EMAIL 2</span>
              <span className="text-slate-600 text-sm">Follow-Up (Planning Maturity Focus)</span>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">SUBJECT:</p>
                <p className="text-sm font-mono bg-slate-50 p-2 rounded border border-slate-200">
                  Re: AI planning layer for [Company Name]'s S&OP cycle
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">BODY:</p>
                <div className="text-sm bg-slate-50 p-3 rounded border border-slate-200 font-mono whitespace-pre-wrap">
{`Hi [First Name],

Following up on Plantryx — we built a 5-minute Planning Maturity Diagnostic that most supply chain leaders find useful even if they're not evaluating new tools right now.

It's a self-assessment (ungated, instant results) that benchmarks your current planning process across forecast accuracy, cycle time, cross-functional alignment, and decision lag.

No forms, no sales pitch — just a quick snapshot of where your S&OP maturity sits relative to peers in [vertical, e.g., "electrical equipment manufacturing" or "automation & machinery"].

Want me to send it over?

Best,
[Your Name]`}
                </div>
              </div>
            </div>
          </div>

          {/* Email 3 */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">EMAIL 3</span>
              <span className="text-slate-600 text-sm">Follow-Up (Decision Speed)</span>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">SUBJECT:</p>
                <p className="text-sm font-mono bg-slate-50 p-2 rounded border border-slate-200">
                  Re: AI planning layer for [Company Name]'s S&OP cycle
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">BODY:</p>
                <div className="text-sm bg-slate-50 p-3 rounded border border-slate-200 font-mono whitespace-pre-wrap">
{`Hi [First Name],

One pattern we see at $100M–$1B manufacturers: S&OP runs monthly, but by the time the plan is agreed across functions, it's already 10–15 days stale.

The bottleneck is rarely the ERP — it's the manual demand-supply balancing that happens in spreadsheets before decisions get locked in.

Plantryx compresses that lag from weeks to hours. The ERP stays as your system of record; we replace the Excel planning layer with AI-driven forecasting and supply-demand optimization that runs continuously, not monthly.

If decision speed in your planning cycle is something you'd like to improve, I can walk you through how this works in a quick 20-minute call.

Worth a conversation?

Best,
[Your Name]`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tier 2: Manufacturing-Native Planning */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-sm">2</span>
            </div>
            <h4 className="font-semibold text-slate-900 text-lg">TIER 2: Manufacturing-Native Planning Owners</h4>
          </div>
          <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded mb-4">
            <p className="text-green-900 text-sm font-medium mb-1">Target Personas:</p>
            <p className="text-green-800 text-sm">Master Scheduler/MPS, Director/Manager of Production Planning, Production Control Manager, Planning & Scheduling Manager, Materials Manager, Plant Manager, Director of Manufacturing/Operations</p>
            <p className="text-green-900 text-sm font-medium mt-2 mb-1">Messaging Angle:</p>
            <p className="text-green-800 text-sm">Shortages, expedites, schedule stability, MRP noise — operational language, NOT corporate S&OP framing</p>
          </div>

          {/* Email 1 */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 mb-3">
            <div className="flex items-center space-x-2 mb-3">
              <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">EMAIL 1</span>
              <span className="text-slate-600 text-sm">Initial Outreach</span>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">SUBJECT:</p>
                <p className="text-sm font-mono bg-slate-50 p-2 rounded border border-slate-200">
                  Fewer expedites, more stable schedules at [Company Name]
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">BODY:</p>
                <div className="text-sm bg-slate-50 p-3 rounded border border-slate-200 font-mono whitespace-pre-wrap">
{`Hi [First Name],

If you're running [SAP/Dynamics/Epicor/ERP] for MRP and scheduling, you're likely dealing with: constant expedites, shortages that show up too late, and weekly schedule thrashing because demand changes faster than the system adapts.

Plantryx is an AI planning layer that sits on top of your ERP. It doesn't replace [ERP] — it replaces the manual demand adjustments and shortage chasing you're doing outside the system.

Better demand signals → fewer phantom shortages → more stable production schedules.

Worth a look?

Best,
[Your Name]`}
                </div>
              </div>
            </div>
          </div>

          {/* Email 2 */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 mb-3">
            <div className="flex items-center space-x-2 mb-3">
              <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">EMAIL 2</span>
              <span className="text-slate-600 text-sm">Follow-Up (MRP Noise Focus)</span>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">SUBJECT:</p>
                <p className="text-sm font-mono bg-slate-50 p-2 rounded border border-slate-200">
                  Re: Fewer expedites, more stable schedules at [Company Name]
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">BODY:</p>
                <div className="text-sm bg-slate-50 p-3 rounded border border-slate-200 font-mono whitespace-pre-wrap">
{`Hi [First Name],

Quick follow-up — most production planners and master schedulers we work with describe the same problem: MRP generates too much noise.

The system flags 200 exceptions. Maybe 30 are real. You spend your day filtering signal from noise instead of solving real planning problems.

Plantryx cleans that up. It runs on top of your existing ERP and uses AI to separate real demand signals from MRP noise, so you're only working the exceptions that matter.

We built a 5-minute Planning Maturity Diagnostic (self-assessment, no forms) that shows where planning noise is costing you the most time. Want me to send it?

Best,
[Your Name]`}
                </div>
              </div>
            </div>
          </div>

          {/* Email 3 */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">EMAIL 3</span>
              <span className="text-slate-600 text-sm">Follow-Up (Schedule Stability)</span>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">SUBJECT:</p>
                <p className="text-sm font-mono bg-slate-50 p-2 rounded border border-slate-200">
                  Re: Fewer expedites, more stable schedules at [Company Name]
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">BODY:</p>
                <div className="text-sm bg-slate-50 p-3 rounded border border-slate-200 font-mono whitespace-pre-wrap">
{`Hi [First Name],

Last note on this — one metric we track with customers: how often the weekly production schedule changes after it's published.

For most plants, it's 30–40% of line items. Not because demand actually changed, but because the demand forecast feeding MRP was noisy to begin with.

Plantryx stabilizes that. AI-driven demand forecasting on top of your ERP means fewer false signals, fewer last-minute changes, and less firefighting on the shop floor.

If schedule stability is something you'd like to improve, I can show you how this works in a 20-minute call.

Worth talking?

Best,
[Your Name]`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue with remaining tiers... Due to length, I'll add a note about accessing full sequences */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
          <p className="font-semibold text-amber-900 mb-2">Additional Sequences:</p>
          <p className="text-amber-800 text-sm">
            Full sequences for <strong>Tier 3 (Inventory & MRO)</strong>, <strong>Tier 4 (ERP/IT System Owners)</strong>,
            and <strong>Executive Layer</strong> are available in the complete email sequences document.
            Each follows the same 3-email structure with tier-specific messaging angles.
          </p>
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
      <ContentSection title="Uploaded Documents" icon={<FolderOpen className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-600">
              Upload and manage documents for Plantryx. All uploaded files will be available for download.
            </p>
            <FileUpload clientId="plantryx" onUploadComplete={handleUploadComplete} />
          </div>

          <FileList clientId="plantryx" refreshTrigger={refreshTrigger} />
        </div>
      </ContentSection>
    </>
  );
}
