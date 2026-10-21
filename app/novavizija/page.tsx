'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
import { ContentSection, CodeBlock, InfoCard, ListItem } from '../components/ContentSection';
import TasksTab from '../components/TasksTab';
import SequencesTab from '../components/SequencesTab';
import CampaignsTabGeneric from '../components/CampaignsTabGeneric';
import PerformanceTabDynamic from '../components/PerformanceTabDynamic';
import CampaignsTabDynamic from '../components/CampaignsTabDynamic';
import DocumentsTabGeneric from '../components/DocumentsTabGeneric';
import StatusBadge, { getClientStatus, setClientStatus, DEFAULT_STATUSES, type ClientStatus } from '../components/StatusBadge';
import { getClientAssignee, type Assignee } from '../../lib/auth';
import AssigneeBadge, { getStoredAssignee, setStoredAssignee } from '../components/AssigneeBadge';
import { Target, Users, Filter, Code, TrendingUp, FileText, Layers, CheckSquare, BarChart3, Zap, Mail, FolderOpen } from 'lucide-react';

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

const NOVAVIZIJA_DEFAULT_TASKS = [
  {
    id: 'task-1',
    title: 'Build initial prospect list for meat processing',
    description: 'Research and qualify meat processing companies in Croatia and Serbia with EUR 5M+ revenue',
    status: 'pending' as const,
    priority: 'high' as const,
  },
];

export default function NovaVizIjaPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [assignee, setAssignee] = useState<Assignee | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('novavizija', DEFAULT_STATUSES.novavizija));
    setAssignee(getStoredAssignee('novavizija', getClientAssignee('novavizija')));

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

    const internalTabs = ['filters', 'prompts'];
    const path = window.location.pathname;
    const tabFromPath = path.split('/').pop();
    const validTab = tabs.find(t => t.id === tabFromPath);
    if (validTab && (userIsAdmin || !internalTabs.includes(validTab.id))) {
      setActiveTab(validTab.id);
    }

    const handlePopState = () => {
      const path = window.location.pathname;
      const tabFromPath = path.split('/').pop();
      const validTab = tabs.find(t => t.id === tabFromPath);
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
    setClientStatus('novavizija', newStatus);
  };

  const handleAssigneeChange = (newAssignee: Assignee) => {
    setAssignee(newAssignee);
    setStoredAssignee('novavizija', newAssignee);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const newPath = tabId === 'overview' ? '/novavizija' : `/novavizija/${tabId}`;
    window.history.pushState({}, '', newPath);
  };

  const visibleTabs = isAdmin
    ? tabs
    : tabs.filter(tab => !['filters', 'prompts'].includes(tab.id));

  return (
    <ClientLayout>
      <div className="p-4 lg:p-8">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-teal-600">NV</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-slate-900">Nova Vizija</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
                {isAdmin && <AssigneeBadge assignee={assignee} onAssigneeChange={handleAssigneeChange} size="md" />}
              </div>
              <p className="text-slate-600">ProPIS ERP for Production, Procurement & Sales</p>
            </div>
          </div>
          <a
            href="https://www.novavizija.hr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-teal-600 hover:underline inline-block"
          >
            Visit Website →
          </a>
        </div>

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

        <div className="space-y-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'icp' && <ICPAndPersonasTab />}
          {activeTab === 'filters' && <FiltersTab />}
          {activeTab === 'prompts' && <PromptsTab />}
          {activeTab === 'campaigns-sequences' && <CampaignsSequencesTab />}
          {activeTab === 'performance' && (
            <>
              <PerformanceTabDynamic clientId="novavizija" />
              <CampaignsTabDynamic clientId="novavizija" />
            </>
          )}
          {activeTab === 'documents' && <DocumentsTabGeneric clientId="novavizija" clientName="Nova Vizija" />}
          {activeTab === 'tasks' && <TasksTab clientId="novavizija" defaultTasks={NOVAVIZIJA_DEFAULT_TASKS} />}
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
            <strong>Nova Vizija</strong> provides ProPIS ERP, an integrated operational system designed for manufacturing companies in meat processing and food production. The solution connects production, procurement and sales operations with built-in traceability from raw material to finished product.
          </p>

          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded">
            <p className="font-semibold text-teal-900 mb-2">Core Value Proposition:</p>
            <p className="text-teal-800">
              Replace fragmented systems and manual Excel-based processes with a unified operational platform that provides end-to-end visibility from raw material to finished product, enabling precise tracking and faster recalls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Platform Focus" value="Production, Procurement & Sales" />
            <InfoCard label="Primary Markets" value="Croatia & Serbia" />
            <InfoCard label="Target Industries" value="Meat Processing, Food Production" />
            <InfoCard label="Key Differentiator" value="Integrated Traceability & Recall Support" />
            <InfoCard label="Minimum Company Size" value="EUR 5M+ revenue" />
            <InfoCard label="Sales Cycle" value="3-16 months" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Product Scope" icon={<Layers className="w-5 h-5" />}>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">In Scope - Core Modules:</h4>
            <ul className="space-y-2">
              <ListItem type="check">Production management and process tracking</ListItem>
              <ListItem type="check">Procurement and supplier management</ListItem>
              <ListItem type="check">Sales order management</ListItem>
              <ListItem type="check">Raw material to finished product traceability</ListItem>
              <ListItem type="check">Integration with scanning devices, machinery and packaging lines</ListItem>
              <ListItem type="check">Product recall management and scope identification</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Out of Scope - NOT Included:</h4>
            <ul className="space-y-2">
              <ListItem type="cross">General accounting and finance (GL, fixed assets, payroll)</ListItem>
              <ListItem type="cross">Companies without in-house production</ListItem>
              <ListItem type="cross">Finance-only transformation initiatives</ListItem>
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-blue-800 text-sm">
              <strong>Key Requirement:</strong> ProPIS must integrate with existing accounting systems. Simple onboarding is a stated advantage; specific delivery timelines and training scope require validation per deal.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Campaign Focus" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded">
            <p className="font-semibold text-teal-900 mb-2">Outbound Campaign Strategy:</p>
            <p className="text-teal-800">
              Target manufacturing companies in meat processing and food production in Croatia and Serbia that have operational complexity requiring integrated production tracking and traceability. Focus on companies experiencing growth or expansion that strain current fragmented systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Primary Industries" value="Meat Processing" color="bg-red-50 text-red-700" />
            <InfoCard label="Secondary Industries" value="Livestock & Food Prod." color="bg-orange-50 text-orange-700" />
            <InfoCard label="Target Markets" value="Croatia & Serbia" color="bg-blue-50 text-blue-700" />
            <InfoCard label="Minimum Revenue" value="EUR 5M annual" color="bg-green-50 text-green-700" />
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
              <InfoCard label="Croatia" value="Primary Market" color="bg-red-50 text-red-700" />
              <InfoCard label="Serbia" value="Primary Market" color="bg-blue-50 text-blue-700" />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Revenue & Size:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard label="Minimum Annual Revenue" value="EUR 5 million" color="bg-green-50 text-green-700" />
              <InfoCard label="Employee Count" value="100+ preferred, not mandatory" color="bg-purple-50 text-purple-700" />
            </div>
            <p className="text-sm text-slate-600 mt-3">
              Profitability, growth and operational complexity carry more weight than employee count. A company with 70 employees but EUR 8M+ revenue and complex production flows can qualify.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Target Industries:</h4>
            <div className="space-y-3">
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                <p className="font-semibold text-red-900 text-sm mb-1">PRIMARY: Meat Processing</p>
                <p className="text-red-800 text-sm">Companies engaged in meat production with traceability and recall requirements. Clear industry fit with stated customer references.</p>
              </div>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
                <p className="font-semibold text-orange-900 text-sm mb-1">SECONDARY: Livestock & Food Production</p>
                <p className="text-orange-800 text-sm">Companies with relevant production processes, documented traceability needs and growth/expansion signals. Industry label alone is insufficient.</p>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                <p className="font-semibold text-yellow-900 text-sm mb-1">EXCLUDE: Pure Traders & Distributors</p>
                <p className="text-yellow-800 text-sm">Companies without in-house production of their own goods.</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Mandatory Qualification Criteria:</h4>
            <ul className="space-y-2">
              <ListItem><strong>Location:</strong> Croatia or Serbia</ListItem>
              <ListItem><strong>Production:</strong> In-house production activity confirmed</ListItem>
              <ListItem><strong>Revenue:</strong> EUR 5M+ annual (with financial year and source documented)</ListItem>
              <ListItem><strong>IT Capability:</strong> Available internal technical person for local collaboration on implementation</ListItem>
              <ListItem><strong>Scope Fit:</strong> Operational complexity in production, procurement, sales (NOT finance-only needs)</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Buyer Personas & Decision Makers" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-teal-900">PRIMARY CONTACT: CEO / Owner</h3>
              <span className="px-2 py-1 bg-teal-200 text-teal-800 text-xs font-semibold rounded">PRIMARY</span>
            </div>
            <div className="space-y-2 text-slate-700 text-sm">
              <p><strong>Responsibility:</strong> Business priorities, investment decisions, project sponsorship and growth initiatives</p>
              <p><strong>Pain Points:</strong> Growth constrained by manual processes, fragmented systems limiting visibility, inefficiency eating into margins</p>
              <p><strong>Success Metric:</strong> Operational efficiency, growth enablement, management visibility across production</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-blue-900">SECONDARY CONTACT: IT Manager / Technical Person</h3>
              <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs font-semibold rounded">SECONDARY</span>
            </div>
            <div className="space-y-2 text-slate-700 text-sm">
              <p><strong>Responsibility:</strong> Technical feasibility, system integrations, local implementation and ongoing support</p>
              <p><strong>Mandatory Requirement:</strong> Must exist and be available for collaboration. External IT partner acceptability requires client approval.</p>
              <p><strong>Success Metric:</strong> Integration capability, implementation timeline, support requirements manageable internally</p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-green-900">INFLUENCERS: Production & Logistics</h3>
              <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-semibold rounded">INFLUENCER</span>
            </div>
            <div className="space-y-2 text-slate-700 text-sm">
              <p><strong>Responsibility:</strong> Define actual production processes, traceability requirements, goods flows and operational needs</p>
              <p><strong>Production Manager:</strong> Current production workflows, raw material flows, batch tracking, recall procedures</p>
              <p><strong>Logistics Manager:</strong> Goods movement, inventory management, supplier and customer integration points</p>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <p className="text-sm text-slate-700">
              <strong>Approach Strategy:</strong> Contact CEO/Owner first to establish business case. Involve IT early to assess technical fit. Engage Production and Logistics during detailed qualification to validate operational requirements.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Market-Specific Considerations" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
            <h4 className="font-semibold text-red-900 mb-2">Croatia (HR)</h4>
            <ul className="space-y-1 text-sm text-red-800">
              <ListItem>Core ICP criteria apply (EUR 5M+, in-house production, internal IT capability)</ListItem>
              <ListItem>Localize outreach to Croatian language</ListItem>
              <ListItem>Validate local legislation and reporting requirements</ListItem>
              <ListItem>Research local competitor landscape</ListItem>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-2">Serbia (RS)</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <ListItem>Core ICP criteria apply (EUR 5M+, in-house production, internal IT capability)</ListItem>
              <ListItem>Localize outreach to Serbian language</ListItem>
              <ListItem>Validate local legislation and reporting requirements</ListItem>
              <ListItem>Research local competitor landscape</ListItem>
            </ul>
          </div>

          <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Open Items:</strong> Slaughter-specific process requirements, large buyer-imposed traceability mandates, and local ERP landscape require further validation during qualification.
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
      <ContentSection title="Clay Filters - Target Segments" icon={<Filter className="w-5 h-5" />}>
        <p className="text-slate-600 mb-4">
          Filter segmentation based on geography and industry. All filters require: EUR 5M+ revenue, in-house production, internal IT capability.
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Primary Filters (Tier 1):</h4>
            <ul className="space-y-2">
              <ListItem><strong>Croatia - Meat Processing:</strong> Primary target. Meat production companies with traceability and recall requirements.</ListItem>
              <ListItem><strong>Serbia - Meat Processing:</strong> Primary target. Meat production companies with traceability and recall requirements.</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Secondary Filters (Tier 2):</h4>
            <ul className="space-y-2">
              <ListItem><strong>Croatia - Livestock & Food Production:</strong> Companies with documented relevant production processes and traceability needs.</ListItem>
              <ListItem><strong>Serbia - Livestock & Food Production:</strong> Companies with documented relevant production processes and traceability needs.</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Qualification Signals:</h4>
            <ul className="space-y-2">
              <ListItem><strong>Growth:</strong> Verify whether growth is straining existing processes and prompting system review</ListItem>
              <ListItem><strong>Production Expansion:</strong> Planned or completed expansion timeline and operational implications</ListItem>
              <ListItem><strong>New IT Leadership:</strong> Recent appointment and actual implementation mandate</ListItem>
              <ListItem><strong>Buyer Requirements:</strong> Traceability, labelling or data exchange mandates with implementation deadlines</ListItem>
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
      <ContentSection title="AI-Powered Prospect Research Prompts" icon={<Code className="w-5 h-5" />}>
        <p className="text-slate-600 mb-4">
          Use these prompts to research and qualify prospects efficiently.
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Confirm In-House Production</h4>
            <CodeBlock code="Does this company conduct in-house production of meat, livestock products, or food items for sale? Look for: manufacturing facilities, production process descriptions, product lines manufactured on-site, production equipment mentions. Return YES with evidence or NO if pure trade/distribution only." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Verify Internal IT Capability</h4>
            <CodeBlock code="Does this company have an internal IT person, IT manager, or CTO available for local implementation collaboration? Check LinkedIn for IT staff, website tech mentions, job postings for IT roles. Return YES with role/name if found, or UNCLEAR if not verifiable." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Identify Growth Signals</h4>
            <CodeBlock code="What evidence of growth or expansion does this company show? Look for: revenue growth announcements, facility expansion, new product launches, hiring signals, market expansion. Return findings with dates/sources or NONE if no clear signals." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Check Current Systems</h4>
            <CodeBlock code="What ERP, production management, or operational software systems does this company currently use? Check: website tech stack, job postings mentioning systems, LinkedIn mentions, industry reports. List all systems found or state UNKNOWN if not verifiable." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Assess Operational Complexity</h4>
            <CodeBlock code="What operational complexity does this company demonstrate? Look for: number of production facilities, product variety, supplier relationships, batch/lot tracking mentions, quality certifications (ISO, etc.), recall procedures. Rate as HIGH, MEDIUM, or LOW with supporting evidence." />
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function CampaignsSequencesTab() {
  return (
    <>
      <SequencesTab clientId="novavizija" />
      <div className="mt-8">
        <CampaignsTabGeneric />
      </div>
    </>
  );
}
