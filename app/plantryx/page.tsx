'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
import { ContentSection, CodeBlock, InfoCard, ListItem } from '../components/ContentSection';
import TasksTab from '../components/TasksTab';
import SequencesTab from '../components/SequencesTab';
import StatusBadge, { getClientStatus, setClientStatus, DEFAULT_STATUSES, type ClientStatus } from '../components/StatusBadge';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import { Target, Users, Filter, Code, TrendingUp, FileText, CheckSquare, BarChart3, Zap, FolderOpen, Mail, Award, MapPin, Building2, Briefcase } from 'lucide-react';
import BestFitsTab from '../components/BestFitsTab_NEW';

const tabs = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'icp', label: 'ICP Profile', icon: Target },
  { id: 'bestfits', label: 'Best Fits', icon: Award },
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
          {activeTab === 'bestfits' && <BestFitsTab />}
          {activeTab === 'filters' && <FiltersTab />}
          {activeTab === 'prompts' && <PromptsTab />}
          {activeTab === 'personas' && <PersonasTab />}
          {activeTab === 'sequences' && <SequencesTab clientId="plantryx" />}
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
      <ContentSection title="LinkedIn Sales Navigator — Lead Search Filters" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-6">
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
            <p className="font-semibold text-indigo-900 mb-2">Search Strategy:</p>
            <p className="text-indigo-800 text-sm">
              Run separate searches by <strong>company size</strong> and <strong>vertical</strong>.
              Small companies (€90M-€300M) target Tier 2 personas. Large companies (€300M-€900M) target Tier 1 personas.
            </p>
          </div>

          {/* Search Type A: Small Companies */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-lg">SMALL Companies (€90M-€300M) → Target Tier 2 Personas</h4>
            </div>

            <div className="bg-white rounded p-4 mb-4">
              <h5 className="font-semibold text-slate-900 mb-3">Company Filters:</h5>
              <div className="space-y-2 text-sm">
                <div><strong>Headcount:</strong> 201-500, 501-1,000</div>
                <div><strong>Geography:</strong> Netherlands, Sweden, Denmark, Finland, Norway, Poland, Germany</div>
                <div><strong>Seniority Level:</strong> Manager, Senior, Director</div>
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded mb-4">
              <p className="text-amber-900 text-sm font-medium">
                Job Titles (Tier 2 — Manufacturing-Native Planning):
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
              {[
                'Master Scheduler',
                'Master Production Scheduler',
                'Production Planning Manager',
                'Director of Production Planning',
                'Production Control Manager',
                'Planning & Scheduling Manager',
                'Materials Manager',
                'Director of Materials Management',
                'Materials Planning Manager',
                'Plant Manager',
                'Director of Manufacturing',
                'Director of Operations',
              ].map((title) => (
                <div key={title} className="bg-green-100 border border-green-200 rounded px-2 py-1.5 text-xs">
                  {title}
                </div>
              ))}
            </div>

            <h5 className="font-semibold text-slate-900 mb-3">Run 5 Searches (One Per Vertical):</h5>

            <div className="space-y-3">
              <div className="bg-white border border-slate-200 rounded p-3">
                <p className="font-medium text-slate-900 text-sm mb-2">Search A1: Electrical Equipment</p>
                <p className="text-xs text-slate-600 mb-2"><strong>Industries:</strong> Electrical/Electronic Manufacturing, Electric Lighting Equipment Manufacturing, Utilities, Industrial Machinery Manufacturing</p>
                <p className="text-xs text-slate-600"><strong>Keywords:</strong> transformer OR switchgear OR power OR electrical OR cable</p>
              </div>

              <div className="bg-white border border-slate-200 rounded p-3">
                <p className="font-medium text-slate-900 text-sm mb-2">Search A2: Automation & Industrial Machinery</p>
                <p className="text-xs text-slate-600 mb-2"><strong>Industries:</strong> Industrial Automation, Machinery Manufacturing, Packaging and Containers Manufacturing</p>
                <p className="text-xs text-slate-600"><strong>Keywords:</strong> "packaging machinery" OR "motion control" OR robotics OR automation</p>
              </div>

              <div className="bg-white border border-slate-200 rounded p-3">
                <p className="font-medium text-slate-900 text-sm mb-2">Search A3: Motor Vehicle / Auto Parts</p>
                <p className="text-xs text-slate-600 mb-2"><strong>Industries:</strong> Motor Vehicle Manufacturing, Automotive, Motor Vehicle Parts Manufacturing</p>
                <p className="text-xs text-slate-600"><strong>Keywords:</strong> "tier 1" OR "tier 2" OR "automotive supplier" OR OEM</p>
              </div>

              <div className="bg-white border border-slate-200 rounded p-3">
                <p className="font-medium text-slate-900 text-sm mb-2">Search A4: Fabricated Metals / Machining</p>
                <p className="text-xs text-slate-600 mb-2"><strong>Industries:</strong> Machinery Manufacturing, Primary Metal & Steel Manufacturing, Fabricated Metal Products</p>
                <p className="text-xs text-slate-600"><strong>Keywords:</strong> "precision machining" OR CNC OR "metal fabrication"</p>
              </div>

              <div className="bg-white border border-slate-200 rounded p-3">
                <p className="font-medium text-slate-900 text-sm mb-2">Search A5: Semiconductor / High-Tech</p>
                <p className="text-xs text-slate-600 mb-2"><strong>Industries:</strong> Semiconductors, Electrical/Electronic Manufacturing</p>
                <p className="text-xs text-slate-600"><strong>Keywords:</strong> "test equipment" OR "precision components" OR metrology</p>
              </div>
            </div>
          </div>

          {/* Search Type B: Large Companies */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-lg">LARGE Companies (€300M-€900M) → Target Tier 1 Personas</h4>
            </div>

            <div className="bg-white rounded p-4 mb-4">
              <h5 className="font-semibold text-slate-900 mb-3">Company Filters:</h5>
              <div className="space-y-2 text-sm">
                <div><strong>Headcount:</strong> 1,001-5,000</div>
                <div><strong>Geography:</strong> Netherlands, Sweden, Denmark, Finland, Norway, Poland, Germany</div>
                <div><strong>Seniority Level:</strong> Director, VP, Senior</div>
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded mb-4">
              <p className="text-amber-900 text-sm font-medium">
                Job Titles (Tier 1 — Corporate Planning):
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
              {[
                'Director of Supply Chain',
                'VP Supply Chain',
                'Sr. Manager Supply Chain',
                'Director of Demand Planning',
                'Demand Planning Director',
                'Director of Supply Planning',
                'Supply Planning Director',
                'S&OP Director',
                'IBP Director',
                'Sr. Manager of Demand Planning',
                'Sr. Manager of Supply Planning',
              ].map((title) => (
                <div key={title} className="bg-blue-100 border border-blue-200 rounded px-2 py-1.5 text-xs">
                  {title}
                </div>
              ))}
            </div>

            <h5 className="font-semibold text-slate-900 mb-3">Run 5 Searches (One Per Vertical):</h5>

            <div className="space-y-3">
              <div className="bg-white border border-slate-200 rounded p-3">
                <p className="font-medium text-slate-900 text-sm mb-2">Search B1: Electrical Equipment</p>
                <p className="text-xs text-slate-600 mb-2"><strong>Industries:</strong> Electrical/Electronic Manufacturing, Electric Lighting Equipment Manufacturing, Utilities, Industrial Machinery Manufacturing</p>
                <p className="text-xs text-slate-600"><strong>Keywords:</strong> transformer OR switchgear OR power OR electrical OR cable</p>
              </div>

              <div className="bg-white border border-slate-200 rounded p-3">
                <p className="font-medium text-slate-900 text-sm mb-2">Search B2: Automation & Industrial Machinery</p>
                <p className="text-xs text-slate-600 mb-2"><strong>Industries:</strong> Industrial Automation, Machinery Manufacturing, Packaging and Containers Manufacturing</p>
                <p className="text-xs text-slate-600"><strong>Keywords:</strong> "packaging machinery" OR "motion control" OR robotics OR automation</p>
              </div>

              <div className="bg-white border border-slate-200 rounded p-3">
                <p className="font-medium text-slate-900 text-sm mb-2">Search B3: Motor Vehicle / Auto Parts</p>
                <p className="text-xs text-slate-600 mb-2"><strong>Industries:</strong> Motor Vehicle Manufacturing, Automotive, Motor Vehicle Parts Manufacturing</p>
                <p className="text-xs text-slate-600"><strong>Keywords:</strong> "tier 1" OR "tier 2" OR "automotive supplier" OR OEM</p>
              </div>

              <div className="bg-white border border-slate-200 rounded p-3">
                <p className="font-medium text-slate-900 text-sm mb-2">Search B4: Fabricated Metals / Machining</p>
                <p className="text-xs text-slate-600 mb-2"><strong>Industries:</strong> Machinery Manufacturing, Primary Metal & Steel Manufacturing, Fabricated Metal Products</p>
                <p className="text-xs text-slate-600"><strong>Keywords:</strong> "precision machining" OR CNC OR "metal fabrication"</p>
              </div>

              <div className="bg-white border border-slate-200 rounded p-3">
                <p className="font-medium text-slate-900 text-sm mb-2">Search B5: Semiconductor / High-Tech</p>
                <p className="text-xs text-slate-600 mb-2"><strong>Industries:</strong> Semiconductors, Electrical/Electronic Manufacturing</p>
                <p className="text-xs text-slate-600"><strong>Keywords:</strong> "test equipment" OR "precision components" OR metrology</p>
              </div>
            </div>
          </div>

          {/* Search Type C: ERP/IT Owners */}
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-lg">ERP/IT Owners (All Company Sizes) → Tier 4 Separate Sequence</h4>
            </div>

            <div className="bg-white rounded p-4 mb-4">
              <h5 className="font-semibold text-slate-900 mb-3">Company Filters:</h5>
              <div className="space-y-2 text-sm">
                <div><strong>Headcount:</strong> 201-5,000</div>
                <div><strong>Geography:</strong> Netherlands, Sweden, Denmark, Finland, Norway, Poland, Germany</div>
                <div><strong>Seniority Level:</strong> Manager, Director, VP</div>
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded mb-4">
              <p className="text-amber-900 text-sm font-medium">
                Job Titles (Tier 4 — ERP/IT):
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {[
                'IT Manager',
                'IT Director',
                'ERP Manager',
                'ERP Project Manager',
                'Business Systems Manager',
                'CIO',
              ].map((title) => (
                <div key={title} className="bg-indigo-100 border border-indigo-200 rounded px-2 py-1.5 text-xs">
                  {title}
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-600 mt-3">Run same 5 vertical searches (C1-C5) using these job titles</p>
          </div>

          <div className="bg-violet-50 border-l-4 border-violet-500 p-4 rounded">
            <p className="font-semibold text-violet-900 mb-2">Export Strategy:</p>
            <ul className="space-y-1 text-violet-800 text-sm">
              <li>• Export all results from each search (up to 2,500 per search)</li>
              <li>• Include: First Name, Last Name, Title, Company Name, Company LinkedIn, LinkedIn Profile, Company Size</li>
              <li>• Send all CSVs for evaluation and de-duplication</li>
            </ul>
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
