'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
import { ContentSection, CodeBlock, InfoCard, ListItem } from '../components/ContentSection';
import TasksTab from '../components/TasksTab';
import SequencesTab from '../components/SequencesTab';
import CampaignsTabDynamic from '../components/CampaignsTabDynamic';
import PerformanceTabDynamic from '../components/PerformanceTabDynamic';
import CampaignsTabGeneric from '../components/CampaignsTabGeneric';
import StatusBadge, { getClientStatus, setClientStatus, DEFAULT_STATUSES, type ClientStatus } from '../components/StatusBadge';
import { Target, Users, Filter, Code, TrendingUp, FileText, Layers, CheckSquare, BarChart3, Zap, Mail, FolderOpen } from 'lucide-react';
import DocumentsTabGeneric from '../components/DocumentsTabGeneric';

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

const STOJKOV_DEFAULT_TASKS = [
  {
    id: 'task-1',
    title: 'Initial campaign setup and list building',
    description: 'Set up targeting filters and build initial prospect list for Slovenia',
    status: 'pending' as const,
    priority: 'high' as const,
  },
];

export default function StojkovPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('stojkov', DEFAULT_STATUSES.stojkov));

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
    setClientStatus('stojkov', newStatus);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const newPath = tabId === 'overview' ? '/stojkov' : `/stojkov/${tabId}`;
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
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-red-600">S</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-slate-900">Stojkov</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
              </div>
              <p className="text-slate-600">Premium Print & Packaging Manufacturing</p>
            </div>
          </div>
          <a
            href="https://stojkov.rs/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-green-600 hover:underline inline-block"
          >
            Visit Website →
          </a>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-6">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#1a2647] text-[#1a2647] font-medium'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'icp' && <ICPAndPersonasTab />}
          {activeTab === 'filters' && <FiltersTab />}
          {activeTab === 'prompts' && <PromptsTab />}
          {activeTab === 'campaigns-sequences' && <CampaignsSequencesTab />}
          {activeTab === 'performance' && (
            <>
              <PerformanceTabDynamic clientId="stojkov" />
              <CampaignsTabDynamic clientId="stojkov" />
            </>
          )}
          {activeTab === 'documents' && <DocumentsTabGeneric clientId="stojkov" />}
          {activeTab === 'tasks' && <TasksTab clientId="stojkov" defaultTasks={STOJKOV_DEFAULT_TASKS} />}
        </div>
      </div>
    </ClientLayout>
  );
}

function OverviewTab() {
  return (
    <>
      <ContentSection title="Client Overview" icon={<FileText className="w-5 h-5" />}>
        <div className="space-y-4">
          <p>
            <strong>Stojkov</strong> is a family-owned Serbian printer founded in 1963, offering cardboard and paperboard packaging, books, media books and corporate/promotional print. A nearshore European manufacturing partner with competitive Serbian production economics for premium folding carton and box requirements.
          </p>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="font-semibold text-red-900 mb-2">Production Capabilities:</p>
            <p className="text-red-800">
              Prepress, samples, B1 UV hybrid offset printing, binding, lamination, die-cutting, foil stamping, embossing, and fine-packaging line
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Founded" value="1963 (Family-Owned)" />
            <InfoCard label="Employees" value="75 Staff" />
            <InfoCard label="Facility" value="3,000 m²" />
            <InfoCard label="Location" value="Serbia" />
            <InfoCard label="ISO Certifications" value="9001, 14001, 45001" />
            <InfoCard label="Other Certifications" value="FSC, SEDEX SMETA" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Product & Service Line" icon={<Layers className="w-5 h-5" />}>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Packaging Products:</h4>
            <ul className="space-y-2">
              <ListItem type="check">Premium folding cartons and boxes</ListItem>
              <ListItem type="check">Cardboard and paperboard packaging</ListItem>
              <ListItem type="check">Presentation sets and gift boxes</ListItem>
              <ListItem type="check">Product outer cartons</ListItem>
              <ListItem type="check">Branded secondary packaging</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Print Services:</h4>
            <ul className="space-y-2">
              <ListItem>Books and media books</ListItem>
              <ListItem>Corporate and promotional print</ListItem>
              <ListItem>Premium catalogues and publications</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Production Processes:</h4>
            <ul className="space-y-2">
              <ListItem>Prepress and samples</ListItem>
              <ListItem>B1 UV hybrid offset printing</ListItem>
              <ListItem>Binding and lamination</ListItem>
              <ListItem>Die-cutting and finishing</ListItem>
              <ListItem>Foil stamping and embossing</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Campaign Focus" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">Outbound B2B Strategy:</p>
            <p className="text-blue-800">
              Target consumer brands and manufacturers with recurring premium carton and box demand in Slovenia and DACH region. Run packaging agencies as separate partner campaign.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Primary Market" value="Slovenia (Initial Pilot)" />
            <InfoCard label="Priority Expansion" value="Austria, S. Germany, Switzerland" />
            <InfoCard label="Secondary Markets" value="Croatia, Hungary, Czechia, Slovakia" />
            <InfoCard label="Tone" value="Professional, Consultative, Concise" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Value Proposition">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-slate-800 font-medium">
            A nearshore European print and packaging manufacturing partner with competitive Serbian production economics for your recurring premium folding carton and box requirements.
          </p>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Primary Pain Addressed</h4>
            <p className="text-slate-700">
              Companies need reliable packaging production at competitive landed costs without compromising on quality, finish consistency, or delivery reliability. Many face pressure on packaging costs, inconsistent results from current suppliers, or need a second source for capacity or risk management.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Key Advantages</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>Nearshore European location (Serbia) with competitive production economics</li>
              <li>Full production capabilities: offset printing, finishing, die-cutting, foil stamping, embossing</li>
              <li>ISO 9001, ISO 14001, ISO 45001 certified operations</li>
              <li>FSC certified and SEDEX SMETA audited</li>
              <li>75 employees with 60+ years of manufacturing experience</li>
              <li>3,000 m² production facility</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Messaging Approach</h4>
            <p className="text-slate-700">
              Professional and consultative. Lead with production breadth and explore specification-based landed-cost comparisons for repeat carton requirements. Avoid aggressive pricing claims - focus on evaluating fit against current supplier on like-for-like specs, tooling, finishing, freight and quality.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Call to Action</h4>
            <p className="text-slate-700">
              "Would it be useful to compare production options for one recurring carton or box specification?"
            </p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function ICPAndPersonasTab() {
  return (
    <>
      <ContentSection title="Company-Level ICP" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Target Geography (Priority Order):</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard label="1. Slovenia" value="Initial Pilot Market" color="bg-red-50 text-red-700" />
              <InfoCard label="2. Austria" value="Priority Expansion" color="bg-orange-50 text-orange-700" />
              <InfoCard label="3. Germany" value="Southern Germany Priority" color="bg-amber-50 text-amber-700" />
              <InfoCard label="4. Switzerland" value="DACH Region" color="bg-yellow-50 text-yellow-700" />
            </div>
            <div className="mt-3 p-3 bg-slate-50 rounded border border-slate-200">
              <p className="text-sm text-slate-700"><strong>Secondary Expansion:</strong> Croatia, Hungary, Czechia, Slovakia</p>
              <p className="text-sm text-slate-700 mt-1"><strong>Optional:</strong> Italy and nearby EU markets after fit validation</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Target Company Size:</h4>
            <div className="space-y-3">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p className="font-semibold text-blue-900 text-sm mb-1">A - Brands & Manufacturers:</p>
                <p className="text-blue-800 text-sm">20-500 employees (sweet spot: 50-250) | EUR 3m-200m revenue</p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                <p className="font-semibold text-green-900 text-sm mb-1">B - Packaging & Branding Agencies:</p>
                <p className="text-green-800 text-sm">5-100 employees (start with: 10-50) | Revenue not required</p>
              </div>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
                <p className="font-semibold text-purple-900 text-sm mb-1">C - Publishers & Premium Print:</p>
                <p className="text-purple-800 text-sm">10-250 employees with recurring title/catalogue programme</p>
              </div>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded">
                <p className="font-semibold text-amber-900 text-sm mb-1">D - Premium Retail/Hospitality/Gifting:</p>
                <p className="text-amber-800 text-sm">10-500 employees (requires centralized buying or recurring branded packaging)</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Target Industry Segments:</h4>
            <div className="space-y-3">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p className="font-semibold text-blue-900 text-sm mb-1">A1 - Cosmetics, Skincare & Personal Care:</p>
                <p className="text-blue-800 text-sm">Recurring outer cartons, product ranges, presentation sets</p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p className="font-semibold text-blue-900 text-sm mb-1">A2 - Premium Food & Confectionery:</p>
                <p className="text-blue-800 text-sm">Chocolates, specialty foods, gift assortments with branded secondary packaging</p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p className="font-semibold text-blue-900 text-sm mb-1">A3 - Supplements & Wellness:</p>
                <p className="text-blue-800 text-sm">Recurring retail carton demand (pharma/OTC requires technical validation)</p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                <p className="font-semibold text-green-900 text-sm mb-1">B - Packaging/Branding Agencies:</p>
                <p className="text-green-800 text-sm">Outsourced production, multiple packaging clients (separate partner campaign)</p>
              </div>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
                <p className="font-semibold text-purple-900 text-sm mb-1">C - Publishers & Premium Print:</p>
                <p className="text-purple-800 text-sm">Recurring catalogues, monographs, high-end printed material</p>
              </div>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded">
                <p className="font-semibold text-amber-900 text-sm mb-1">D - Premium Retail/Hospitality/Luxury:</p>
                <p className="text-amber-800 text-sm">Hotels, wineries, luxury products, corporate gifting with presentation/gift boxes</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Exclusion Criteria:</h4>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="font-semibold text-red-900 mb-2">DO NOT CONTACT:</p>
              <ul className="text-red-800 text-sm space-y-1">
                <ListItem type="cross">Direct printing/packaging manufacturing competitors</ListItem>
                <ListItem type="cross">Services/software-only firms without packaging needs</ListItem>
                <ListItem type="cross">Pure resellers without own-brand packaging control</ListItem>
                <ListItem type="cross">Pre-product startups and micro webshops</ListItem>
                <ListItem type="cross">Local restaurants and single-site buyers with only occasional print</ListItem>
                <ListItem type="cross">Commodity office-print and lowest-price-only brokers</ListItem>
                <ListItem type="cross">Labels-only, flexible plastic, bottles, cans or transport packaging (unless separate carton need)</ListItem>
              </ul>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Buyer Personas">
        <p className="text-slate-600 mb-4">
          Decision-makers vary by company size and structure. Below 50 employees, start with CEO/Owner if no purchasing role exists. At larger firms, pair Procurement with Packaging or Operations.
        </p>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-blue-900">PRIMARY PERSONA 1: Procurement / Purchasing</h3>
              <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs font-semibold rounded">PRIMARY</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <p><strong>Typical Titles:</strong> Head of Procurement, Purchasing Manager, Strategic Buyer, Einkaufsleiter, Strategischer Einkaufer, Vodja Nabave, Nabavnik</p>
              <p><strong>When This Applies:</strong> Commercial owner for supplier selection, landed cost evaluation and contract terms</p>
              <p><strong>Pain Points:</strong> Pressure on packaging costs, need for second source, evaluating competitive bids</p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-green-900">PRIMARY PERSONA 2: Packaging Manager</h3>
              <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-semibold rounded">PRIMARY</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <p><strong>Typical Titles:</strong> Packaging Manager, Packaging Development Manager, Verpackungsmanager, Vodja Embalaze</p>
              <p><strong>When This Applies:</strong> Technical champion for construction, finish, specifications and production approvals</p>
              <p><strong>Pain Points:</strong> Inconsistent finish or color from current supplier, fragmented production handoffs, specification challenges</p>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-purple-900">PRIMARY PERSONA 3: Supply Chain / Operations</h3>
              <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs font-semibold rounded">PRIMARY</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <p><strong>Typical Titles:</strong> Supply Chain Manager, Operations Director, Produktionsleiter, Vodja Proizvodnje</p>
              <p><strong>When This Applies:</strong> Owns repeat supply, capacity planning and delivery coordination</p>
              <p><strong>Pain Points:</strong> Insufficient supplier capacity, difficulty managing repeat orders across SKUs, stock availability risk</p>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-amber-900">PRIMARY PERSONA 4: Owner / Agency Leadership</h3>
              <span className="px-2 py-1 bg-amber-200 text-amber-800 text-xs font-semibold rounded">PRIMARY</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <p><strong>Typical Titles:</strong> CEO, Owner, Managing Director, Production Director, Geschaftsfuhrer, Direktor</p>
              <p><strong>When This Applies:</strong> Smaller firms (&lt;50 employees) and packaging agencies - confirm responsibility for production buying</p>
              <p><strong>Pain Points:</strong> Need production support without expanding own facilities (agencies), managing supplier relationships directly</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-slate-900">SECONDARY PERSONA: Brand / Production Manager</h3>
              <span className="px-2 py-1 bg-slate-200 text-slate-800 text-xs font-semibold rounded">SECONDARY</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <p><strong>Typical Titles:</strong> Brand Manager, Account Director, Print Production Manager</p>
              <p><strong>When This Applies:</strong> Initiates brief or coordinates programme - buying authority varies, involve alongside primary buyer</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-slate-900">TERTIARY PERSONA: Design / Quality</h3>
              <span className="px-2 py-1 bg-slate-200 text-slate-800 text-xs font-semibold rounded">TERTIARY</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <p><strong>Typical Titles:</strong> Head of Design, Packaging Designer, Quality Manager</p>
              <p><strong>When This Applies:</strong> Influences appearance, artwork or qualification - involve alongside commercial buyer</p>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Buying Signals & Targeting Logic">
        <p className="text-slate-600 mb-4">
          Qualify account fit first (structural criteria), then prioritize by timing signals. These are research rules to focus outreach sequencing.
        </p>

        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-1">TIER 1: Active Sourcing Event</h4>
            <p className="text-slate-700">Open packaging RFQ, supplier review or second-source request. Confirm scope, deadline and that selection is still open.</p>
          </div>

          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-1">TIER 1: Dated Packaging Change</h4>
            <p className="text-slate-700">Upcoming carton/box launch or redesign with visible sourcing relevance. Capture launch date and confirm supplier selection not complete.</p>
          </div>

          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-1">TIER 1: Relevant Hiring with Remit</h4>
            <p className="text-slate-700">Live packaging/procurement vacancy explicitly covering carton sourcing or supplier development.</p>
          </div>

          <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
            <h4 className="font-semibold text-green-900 mb-1">TIER 2: Market or SKU Expansion</h4>
            <p className="text-slate-700">New retail market, distributor, product range or language variants. Link expansion to likely packaging demand.</p>
          </div>

          <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
            <h4 className="font-semibold text-green-900 mb-1">TIER 2: Packaging Change Programme</h4>
            <p className="text-slate-700">Named material/sustainability redesign or packaging-related procurement hire without confirmed sourcing event.</p>
          </div>

          <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-500">
            <h4 className="font-semibold text-amber-900 mb-1">TIER 3: Recurring Packaging Fit</h4>
            <p className="text-slate-700">Multiple products with cartons/presentation boxes, premium finishes, repeat editions or gift programmes. Structural fit, not urgency.</p>
          </div>

          <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-500">
            <h4 className="font-semibold text-amber-900 mb-1">TIER 3: Broad Efficiency or Growth</h4>
            <p className="text-slate-700">Generic cost programme, funding, growth or event attendance. Use as context only until packaging relevance demonstrated.</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Best-Fit Business Models" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Strong Fit Indicators:</h4>
            <ul className="space-y-2">
              <ListItem>Own-brand manufacturers with packaging control</ListItem>
              <ListItem>Brand owners using contract manufacturing while retaining packaging sourcing</ListItem>
              <ListItem>Multi-SKU retail or omnichannel brands</ListItem>
              <ListItem>Established DTC brands with repeat replenishment needs</ListItem>
              <ListItem>Private-label operators controlling packaging decisions</ListItem>
              <ListItem>Agencies managing production for multiple clients</ListItem>
              <ListItem>Publishers with repeat releases/reprints</ListItem>
              <ListItem>Hospitality and gifting buyers with centralized, repeated programmes</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Qualification Requirements:</h4>
            <p className="text-slate-700">
              Verify owned products, visible carton/box use, repeat potential and who controls sourcing. Do not infer suitability from distribution channel, e-commerce presence, funding status or franchise model alone - these do not establish packaging demand.
            </p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function FiltersTab() {
  return (
    <>
      <ContentSection title="Data Enrichment Filters" icon={<Filter className="w-5 h-5" />}>
        <p className="text-slate-600 mb-4">
          Clay filters and data enrichment criteria for identifying packaging buyers in target geographies. All size bands are prospect filters, not production minimums.
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Firmographic Filters:</h4>
            <ul className="space-y-2">
              <ListItem><strong>Geography (Priority):</strong> Slovenia (pilot), Austria, southern Germany, Switzerland</ListItem>
              <ListItem><strong>Geography (Secondary):</strong> Croatia, Hungary, Czechia, Slovakia</ListItem>
              <ListItem><strong>Company Size A (Brands):</strong> 20-500 employees (sweet spot 50-250), EUR 3m-200m revenue (optional)</ListItem>
              <ListItem><strong>Company Size B (Agencies):</strong> 5-100 employees (start 10-50), revenue not required</ListItem>
              <ListItem><strong>Company Size C (Publishers):</strong> 10-250 employees with recurring programme</ListItem>
              <ListItem><strong>Company Size D (Premium/Gifting):</strong> 10-500 employees with centralized buying</ListItem>
              <ListItem><strong>Industries A:</strong> Cosmetics/skincare/personal care, premium food/confectionery, supplements/wellness</ListItem>
              <ListItem><strong>Industries B:</strong> Packaging/branding/creative agencies with outsourced production</ListItem>
              <ListItem><strong>Industries C:</strong> Publishers, premium book producers, recurring catalogue programmes</ListItem>
              <ListItem><strong>Industries D:</strong> Premium retail/private-label, hotel groups, wineries, luxury products, corporate gifting</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Exclusion Filters:</h4>
            <ul className="space-y-2">
              <ListItem type="cross">Direct printing/packaging manufacturing competitors</ListItem>
              <ListItem type="cross">Services/software-only firms</ListItem>
              <ListItem type="cross">Pure resellers without own-brand packaging control</ListItem>
              <ListItem type="cross">Pre-product startups and micro webshops</ListItem>
              <ListItem type="cross">Local restaurants and single-site buyers (occasional print only)</ListItem>
              <ListItem type="cross">Commodity office-print and lowest-price-only brokers</ListItem>
              <ListItem type="cross">Labels-only, flexible plastic packaging, bottles, cans, transport packaging</ListItem>
              <ListItem type="cross">Existing customers, active deals, protected partners (when lists provided)</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Evidence Required:</h4>
            <ul className="space-y-2">
              <ListItem><strong>Packaging Fit:</strong> Visible use of cartons/boxes on product pages or packaging images</ListItem>
              <ListItem><strong>Repeat Potential:</strong> Multiple SKUs, product ranges, or recurring programmes</ListItem>
              <ListItem><strong>Sourcing Control:</strong> Evidence of who controls packaging procurement decisions</ListItem>
              <ListItem><strong>Premium Quality:</strong> Finishes suggesting quality focus (foil, embossing, etc.)</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Contact Data Requirements:</h4>
            <ul className="space-y-2">
              <ListItem><strong>Primary Titles:</strong> Head of Procurement, Purchasing Manager, Strategic Buyer, Packaging Manager, Packaging Development Manager, Supply Chain Manager, Operations Director, CEO/Owner/Managing Director (smaller firms and agencies)</ListItem>
              <ListItem><strong>DACH Titles:</strong> Einkaufsleiter, Strategischer Einkaufer, Verpackungsmanager, Produktionsleiter, Geschaftsfuhrer</ListItem>
              <ListItem><strong>Slovenia Titles:</strong> Vodja Nabave, Nabavnik, Vodja Embalaze, Vodja Proizvodnje, Direktor</ListItem>
              <ListItem><strong>Email Required:</strong> Yes (business email preferred)</ListItem>
              <ListItem><strong>LinkedIn:</strong> Helpful for verification and evidence of current employment</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Routing Rules:</h4>
            <p className="text-slate-700 mb-2">
              Capture one likely commercial owner and one technical champion per account. Do not send simultaneous duplicate approaches to multiple contacts at same company.
            </p>
            <ul className="space-y-2">
              <ListItem><strong>Small Companies (&lt;50 employees):</strong> Start with CEO/Owner if no purchasing role exists</ListItem>
              <ListItem><strong>Larger Companies:</strong> Pair Procurement with Packaging or Operations</ListItem>
              <ListItem><strong>Agencies:</strong> Managing Director or Production Director leads</ListItem>
              <ListItem><strong>Publishers:</strong> Print Production, Publishing Production or Purchasing</ListItem>
              <ListItem><strong>Premium/Gifting:</strong> Central Procurement/Operations owns buying, Marketing/Brand can introduce</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function PromptsTab() {
  return (
    <>
      <ContentSection title="AI-Powered Prospect Research" icon={<Code className="w-5 h-5" />}>
        <p className="text-slate-600 mb-4">
          AI prompts for identifying buying signals and qualifying packaging fit. These are research rules to focus outreach sequencing.
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Active Sourcing Event (Tier 1)</h4>
            <CodeBlock code="Search for evidence of an open packaging RFQ, supplier review, or second-source request at this company. Look for: tender announcements, supplier review notifications, packaging sourcing projects, RFQ postings. Return YES with exact scope, deadline and source if found. Confirm it is still open (not closed/awarded). Return NO if not found or already closed." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Dated Packaging Change (Tier 1)</h4>
            <CodeBlock code="Look for upcoming product launches, packaging redesigns, or carton changes with visible sourcing relevance at this company. Check: product launch announcements, packaging redesign projects, sustainability/material change initiatives with dates. Return YES with launch date and details if found. Confirm supplier selection is not complete. Return NO if none found or selection already finished." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Relevant Hiring with Remit (Tier 1)</h4>
            <CodeBlock code="Search for live packaging or procurement vacancies that explicitly cover carton sourcing or supplier development. Look for: job postings for Packaging Manager, Procurement roles, Supply Chain positions with packaging responsibilities. Check LinkedIn, company careers page, job boards. Return YES with role title and key responsibilities if packaging/carton sourcing is explicitly mentioned. Return NO if no relevant opening or packaging not in remit." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Market or SKU Expansion (Tier 2)</h4>
            <CodeBlock code="Look for evidence of market expansion, new product ranges, new retail channels, or SKU growth. Check: press releases about entering new markets, distributor announcements, new product line launches, language variant expansions. Assess if expansion likely creates new packaging demand. Return YES with details and link to packaging needs if found. Return NO if no expansion or unclear packaging link." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Packaging Change Programme (Tier 2)</h4>
            <CodeBlock code="Search for named sustainability initiatives, material redesign programmes, or packaging-related procurement hires at this company. Look for: sustainability commitments mentioning packaging, material reduction goals, circular economy initiatives, procurement role hires. Return YES with programme scope and date if found, even without confirmed sourcing event. Return NO if none found." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Recurring Packaging Fit (Tier 3)</h4>
            <CodeBlock code="Analyze this company's product portfolio for recurring packaging requirements. Look for: multiple products with visible cartons or presentation boxes, premium finishes (foil, embossing, special printing), product ranges or sets, repeat editions, gift programmes, seasonal collections. Return YES with details if clear recurring carton/box fit is visible. This indicates structural fit, not urgency. Return NO if no visible packaging or one-off only." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Sourcing Control Verification</h4>
            <CodeBlock code="Determine who controls packaging sourcing decisions at this company. Check: company structure, procurement department presence, contract manufacturing relationships, brand ownership model. Look for evidence of: own-brand manufacturer, brand owner controlling packaging while outsourcing production, private-label operator, agency managing client packaging. Return the likely decision-maker role and evidence. Flag if unclear or pure reseller without packaging control." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Competitor Technology Check (Exclusion)</h4>
            <CodeBlock code="Check if this company is a direct printing or packaging manufacturing competitor. Look for: business model (do they manufacture print/packaging products themselves), service offerings (B2B print/packaging production), competitor mentions on industry sites. Return YES if they are a manufacturer/competitor with company type. Return NO if they are a brand/buyer who uses packaging (not makes it)." />
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function CampaignsSequencesTab() {
  return (
    <>
      <SequencesTab clientId="stojkov" />
      <div className="mt-8">
        <CampaignsTabGeneric />
      </div>
    </>
  );
}
