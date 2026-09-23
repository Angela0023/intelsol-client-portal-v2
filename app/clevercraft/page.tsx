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

const CLEVERCRAFT_DEFAULT_TASKS = [
  {
    id: 'task-1',
    title: 'Initial campaign setup and list building',
    description: 'Set up targeting filters and build initial prospect list',
    status: 'pending' as const,
    priority: 'high' as const,
  },
];

export default function ClevercraftPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('clevercraft', DEFAULT_STATUSES.clevercraft));

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
    setClientStatus('clevercraft', newStatus);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const newPath = tabId === 'overview' ? '/clevercraft' : `/clevercraft/${tabId}`;
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
            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-rose-600">C</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-slate-900">Clever Craft</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
              </div>
              <p className="text-slate-600">Partner Experience Orchestration Platform</p>
            </div>
          </div>
          <a
            href="https://clevercraft.com/"
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
              <PerformanceTabDynamic clientId="clevercraft" />
              <CampaignsTabDynamic clientId="clevercraft" />
            </>
          )}
          {activeTab === 'documents' && <DocumentsTabGeneric clientId="clevercraft" />}
          {activeTab === 'tasks' && <TasksTab clientId="clevercraft" defaultTasks={CLEVERCRAFT_DEFAULT_TASKS} />}
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
            <strong>Clever Craft</strong> is a business orchestration platform that streamlines the entire partner experience lifecycle - from onboarding and enablement to order management and program performance tracking. Built specifically for companies that go to market through channel/partner ecosystems.
          </p>

          <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded">
            <p className="font-semibold text-rose-900 mb-2">Core Value Proposition:</p>
            <p className="text-rose-800">
              Replace fragmented partner workflows with a unified platform that handles everything from partner sign-up and training to complex multi-tier ordering and program compliance tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Platform Focus" value="Partner Experience Orchestration" />
            <InfoCard label="Go-to-Market Motion" value="Channel / Partner-Led" />
            <InfoCard label="Order Value Processed" value="$5B+ Annually" />
            <InfoCard label="Enterprise Programs" value="4+ Major Vendors" />
            <InfoCard label="Reference Customer" value="NetApp (Ralph Nissler)" />
            <InfoCard label="Partner Scale" value="Tens of Thousands of Users" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Platform Capabilities" icon={<Layers className="w-5 h-5" />}>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Business Orchestration Features:</h4>
            <ul className="space-y-2">
              <ListItem type="check">Partner onboarding and enablement workflows</ListItem>
              <ListItem type="check">Complex order management (multi-tier, configurator-based)</ListItem>
              <ListItem type="check">Program compliance and performance tracking</ListItem>
              <ListItem type="check">Automated partner communications and notifications</ListItem>
              <ListItem type="check">Integration with CRM, ERP, and e-commerce systems</ListItem>
              <ListItem type="check">Partner portal and self-service capabilities</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Technology Integrations:</h4>
            <ul className="space-y-2">
              <ListItem>Salesforce (SFDC)</ListItem>
              <ListItem>Microsoft Dynamics</ListItem>
              <ListItem>Liferay</ListItem>
              <ListItem>WebInfinity</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Campaign Focus" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">Outbound B2B Strategy:</p>
            <p className="text-blue-800">
              Targeting companies with complex partner ecosystems who are struggling with fragmented systems, manual workflows, or aging legacy partner management platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Primary Markets" value="North America & Europe" />
            <InfoCard label="Company Size" value="Enterprise ($1B+) & Mid-Market ($100M+)" />
            <InfoCard label="Go-to-Market" value="Channel/Partner-Led Companies" />
            <InfoCard label="Tone" value="Consultative" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Value Proposition">
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded">
          <p className="text-slate-800 font-medium">
            Replace fragmented spreadsheets, emails, and legacy portals with a unified partner experience platform that actually works the way your business does - handling complex orders, multi-tier channel structures, and program compliance without requiring an army of support staff.
          </p>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Primary Pain Addressed</h4>
            <p className="text-slate-700">
              Companies with mature channel programs waste enormous resources managing partners through disconnected systems - spreadsheets for tracking, emails for orders, separate portals for training, manual processes for compliance. This creates partner friction, operational bottlenecks, and missed revenue opportunities.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Proof Points</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>NetApp reference customer (Ralph Nissler can be named)</li>
              <li>$5B+ in order value processed annually</li>
              <li>4 enterprise vendor programs running on the platform</li>
              <li>Tens of thousands of partner users supported</li>
              <li>Integration with major systems (SFDC, Dynamics, Liferay, WebInfinity)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Messaging Tone</h4>
            <p className="text-slate-700">
              Consultative - lead with understanding their partner ecosystem complexity, show you've solved similar problems at scale, focus on operational efficiency and partner satisfaction outcomes rather than feature lists.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Call to Action</h4>
            <p className="text-slate-700">
              "Reach out to learn more" or "Get in touch to see how Clever Craft can help"
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
            <h4 className="font-semibold text-slate-900 mb-3">Target Geography:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard label="North America" value="Equal Weight" color="bg-rose-50 text-rose-700" />
              <InfoCard label="Europe" value="Equal Weight" color="bg-blue-50 text-blue-700" />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Company Size:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard label="Enterprise" value="$1B+ Revenue" color="bg-violet-50 text-violet-700" />
              <InfoCard label="Mid-Market" value="$100M+ Revenue" color="bg-indigo-50 text-indigo-700" />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Target Industries / Verticals:</h4>
            <div className="space-y-3">
              <div className="bg-rose-50 border-l-4 border-rose-500 p-3 rounded">
                <p className="font-semibold text-rose-900 text-sm mb-1">IT Channel:</p>
                <p className="text-rose-800 text-sm">VARs (Value-Added Resellers), Distributors, Managed Service Providers (MSPs)</p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p className="font-semibold text-blue-900 text-sm mb-1">Equipment Manufacturers:</p>
                <p className="text-blue-800 text-sm">Companies selling through dealer/distributor networks</p>
              </div>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
                <p className="font-semibold text-purple-900 text-sm mb-1">Private Equity Buy & Build:</p>
                <p className="text-purple-800 text-sm">PE-backed platforms integrating acquired companies' partner programs</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Technology Stack Indicators:</h4>
            <p className="text-slate-700 mb-3">
              Companies using these technologies are likely to have the integration requirements and scale that make Clever Craft a strong fit:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-blue-50 border border-blue-200 p-3 rounded text-center">
                <p className="text-sm font-semibold text-blue-900">Salesforce</p>
              </div>
              <div className="bg-green-50 border border-green-200 p-3 rounded text-center">
                <p className="text-sm font-semibold text-green-900">Microsoft Dynamics</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 p-3 rounded text-center">
                <p className="text-sm font-semibold text-purple-900">Liferay</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-3 rounded text-center">
                <p className="text-sm font-semibold text-amber-900">WebInfinity</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Competitor Technologies (EXCLUDE):</h4>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="font-semibold text-red-900 mb-2">Do NOT contact companies using:</p>
              <ul className="text-red-800 text-sm space-y-1">
                <ListItem type="cross">ZIFT</ListItem>
                <ListItem type="cross">Impartner</ListItem>
                <ListItem type="cross">Introw</ListItem>
                <ListItem type="cross">ChannelScaler</ListItem>
                <ListItem type="cross">Euler</ListItem>
              </ul>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Buyer Personas">
        <p className="text-slate-600 mb-4">
          Clever Craft sells to leaders responsible for partner experience, partner programs, or digital transformation in channel-led companies.
        </p>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-blue-900">PRIMARY PERSONA 1: Director of eCommerce</h3>
              <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs font-semibold rounded">PRIMARY</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <p><strong>Typical Background:</strong> Owns digital partner ordering experience and portal functionality</p>
              <p><strong>Pain Points:</strong> Partners complain about clunky ordering process, current system can't handle complex configurations, integration with back-end systems is manual</p>
              <p><strong>Success Metrics:</strong> Order accuracy, processing speed, partner portal adoption, reduction in support tickets</p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-green-900">PRIMARY PERSONA 2: Head of Digital / VP Digital Transformation</h3>
              <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-semibold rounded">PRIMARY</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <p><strong>Typical Background:</strong> Owns digital transformation initiatives including modernizing partner experience</p>
              <p><strong>Pain Points:</strong> Legacy systems don't integrate, partner experience is fragmented across multiple tools, company losing partner mindshare to competitors with better digital experiences</p>
              <p><strong>Success Metrics:</strong> Partner satisfaction scores, digital adoption rates, operational efficiency gains, ROI on platform investments</p>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-purple-900">PRIMARY PERSONA 3: Partner Experience / Partner Programs Leader</h3>
              <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs font-semibold rounded">PRIMARY</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <p><strong>Typical Titles:</strong> VP Partner Experience, Director Partner Programs, Head of Partner Operations</p>
              <p><strong>Pain Points:</strong> Partners struggle with onboarding, program compliance tracking is manual, can't get visibility into partner performance, internal teams waste time on repetitive partner support</p>
              <p><strong>Success Metrics:</strong> Partner engagement levels, program compliance rates, time-to-productivity for new partners, partner lifetime value</p>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-amber-900">SECONDARY PERSONA 1: Director of Sales Operations</h3>
              <span className="px-2 py-1 bg-amber-200 text-amber-800 text-xs font-semibold rounded">SECONDARY</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <p><strong>When to Target:</strong> When partner channel is a major revenue driver and sales ops owns channel performance</p>
              <p><strong>Pain Points:</strong> Can't get clean data on partner pipeline, deal registration process is broken, incentive/rebate tracking is manual nightmare</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-slate-900">SECONDARY PERSONA 2: Order Management / Quote Desk Manager</h3>
              <span className="px-2 py-1 bg-slate-200 text-slate-800 text-xs font-semibold rounded">SECONDARY</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <p><strong>When to Target:</strong> When order management is a major bottleneck in the partner experience</p>
              <p><strong>Pain Points:</strong> Team spends entire day manually processing partner orders, error rates are high, partners bypass system and email/call orders in</p>
            </div>
          </div>

          <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-rose-900">SECONDARY PERSONA 3: Director of Customer Experience</h3>
              <span className="px-2 py-1 bg-rose-200 text-rose-800 text-xs font-semibold rounded">SECONDARY</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <p><strong>When to Target:</strong> When partners are treated as "customers" from an experience standpoint</p>
              <p><strong>Pain Points:</strong> Partner NPS is declining, partners churn to competitors with better self-service, support team overwhelmed with basic partner questions that should be automated</p>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Buying Signals & Targeting Logic">
        <p className="text-slate-600 mb-4">
          These signals indicate companies are actively experiencing pain with their current partner management approach and may be in-market for a solution.
        </p>

        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-1">TIER 1: M&A Activity</h4>
            <p className="text-slate-700">Company has recently acquired or been acquired - often triggers partner program consolidation/modernization</p>
          </div>

          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-1">TIER 1: CRM/ERP System Changes</h4>
            <p className="text-slate-700">Implementing or migrating CRM/ERP systems - prime time to fix partner experience integration</p>
          </div>

          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-1">TIER 1: Partner Program Changes</h4>
            <p className="text-slate-700">Launching new partner tiers, restructuring incentives, or announcing partner program overhaul</p>
          </div>

          <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
            <h4 className="font-semibold text-green-900 mb-1">TIER 2: Legacy System Indicators</h4>
            <p className="text-slate-700">Job postings mention "modernizing partner portal" or "replacing legacy partner systems"</p>
          </div>

          <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
            <h4 className="font-semibold text-green-900 mb-1">TIER 2: Digital Transformation Hiring</h4>
            <p className="text-slate-700">Recently hired VP Digital Transformation, Head of Partner Experience, or Director of eCommerce</p>
          </div>

          <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-500">
            <h4 className="font-semibold text-amber-900 mb-1">TIER 3: Partner Growth Signals</h4>
            <p className="text-slate-700">Announcing expansion of partner network, opening new geographic markets through partners, launching new partner types</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="How We Identify Target Companies" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Firmographic Fit:</h4>
            <p className="text-slate-700">
              Enterprise or mid-market company ($100M+ revenue) in IT Channel, Equipment Manufacturing, or PE Buy & Build that sells through a partner/channel ecosystem. Presence in North America or Europe. Uses enterprise CRM/ERP systems (SFDC, Dynamics, etc.).
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Decision-Maker Contacts:</h4>
            <p className="text-slate-700">
              Primary: Director of eCommerce, Head of Digital, VP Digital Transformation, Partner Experience/Programs leaders. Secondary: Director of Sales Operations, Order Management Manager, Director of Customer Experience.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Exclusion Rules:</h4>
            <ul className="space-y-2">
              <ListItem type="cross">Companies already using ZIFT, Impartner, Introw, ChannelScaler, or Euler</ListItem>
              <ListItem type="cross">Companies with purely direct sales models (no channel/partner ecosystem)</ListItem>
              <ListItem type="cross">Companies below $100M revenue (too small for platform complexity)</ListItem>
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">Prioritization:</p>
            <p className="text-blue-800">
              Target Tier 1 buying signals first (M&A, CRM/ERP changes, partner program changes) as these indicate active in-market timing. Work Tier 2 and 3 in parallel as nurture sequences.
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
          Clay filters and data enrichment criteria for identifying target companies and decision-makers.
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Firmographic Filters:</h4>
            <ul className="space-y-2">
              <ListItem><strong>Geography:</strong> North America (US, Canada), Europe (equal weight)</ListItem>
              <ListItem><strong>Revenue:</strong> $100M+ (mid-market and enterprise)</ListItem>
              <ListItem><strong>Industries:</strong> IT Channel (VARs, Distributors, MSPs), Equipment Manufacturers, PE Buy & Build platforms</ListItem>
              <ListItem><strong>Go-to-Market Motion:</strong> Channel-led or partner-led sales model</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Technology Stack Filters:</h4>
            <ul className="space-y-2">
              <ListItem><strong>Include if using:</strong> Salesforce, Microsoft Dynamics, Liferay, WebInfinity</ListItem>
              <ListItem><strong>Exclude if using:</strong> ZIFT, Impartner, Introw, ChannelScaler, Euler (direct competitors)</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Buying Signal Enrichment:</h4>
            <ul className="space-y-2">
              <ListItem><strong>M&A Activity:</strong> Recent acquisitions, merger announcements, PE backing</ListItem>
              <ListItem><strong>System Changes:</strong> CRM/ERP implementation projects, digital transformation initiatives</ListItem>
              <ListItem><strong>Program Changes:</strong> Partner program restructuring, new partner tier launches</ListItem>
              <ListItem><strong>Hiring Signals:</strong> VP Digital Transformation, Head of Partner Experience, Director of eCommerce roles</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Contact Data Requirements:</h4>
            <ul className="space-y-2">
              <ListItem><strong>Primary Titles:</strong> Director of eCommerce, Head of Digital, VP Digital Transformation, VP/Director Partner Experience, Director Partner Programs, Head of Partner Operations</ListItem>
              <ListItem><strong>Secondary Titles:</strong> Director Sales Operations, Order Management Manager, Quote Desk Manager, Director Customer Experience</ListItem>
              <ListItem><strong>Email Required:</strong> Yes (business email preferred)</ListItem>
              <ListItem><strong>LinkedIn:</strong> Highly preferred for validation and multi-touch sequences</ListItem>
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
          AI prompts for identifying buying signals and prioritizing prospects.
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">M&A Activity Signal (Tier 1)</h4>
            <CodeBlock code="Has this company been involved in M&A activity (acquisition, merger, or PE backing) in the past 12 months? Look for: press releases, news articles, SEC filings, company announcements about acquisitions or being acquired. Return YES with details if found, NO if not." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">CRM/ERP System Change Signal (Tier 1)</h4>
            <CodeBlock code="Is this company currently implementing, migrating, or recently changed their CRM or ERP system? Look for: job postings mentioning CRM/ERP implementations, press releases about system upgrades, LinkedIn posts from employees about system migrations, news about Salesforce/Dynamics/SAP projects. Return YES with details if found, NO if not." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Partner Program Change Signal (Tier 1)</h4>
            <CodeBlock code="Has this company announced changes to their partner program in the past 12 months? Look for: new partner tier structures, partner program relaunch announcements, changes to partner incentives/rebates, partner portal updates. Return YES with details if found, NO if not." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Legacy System Indicator (Tier 2)</h4>
            <CodeBlock code="Does this company show signs of using legacy partner management systems? Look for: job postings mentioning 'modernize partner portal' or 'replace legacy partner system', old portal technology (WebSphere, old Liferay versions), partner complaints about portal on social media/reviews. Return YES with details if found, NO if not." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Digital Transformation Hiring Signal (Tier 2)</h4>
            <CodeBlock code="Has this company recently hired (past 6 months) a VP Digital Transformation, Head of Partner Experience, or Director of eCommerce? Check LinkedIn for new hires in these roles. Return YES with name and title if found, NO if not." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Partner Growth Signal (Tier 3)</h4>
            <CodeBlock code="Is this company actively expanding their partner network? Look for: announcements about entering new geographic markets through partners, launching new partner types (MSP, VAR, etc.), press releases about growing partner ecosystem. Return YES with details if found, NO if not." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Competitor Technology Check (Exclusion)</h4>
            <CodeBlock code="Does this company use any of these competitor platforms: ZIFT, Impartner, Introw, ChannelScaler, Euler? Check their website technology stack, job postings mentioning these platforms, case studies/testimonials on competitor websites. Return YES with platform name if found, NO if clear they don't use these." />
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function CampaignsSequencesTab() {
  return (
    <>
      <SequencesTab clientId="clevercraft" />
      <div className="mt-8">
        <CampaignsTabGeneric />
      </div>
    </>
  );
}
