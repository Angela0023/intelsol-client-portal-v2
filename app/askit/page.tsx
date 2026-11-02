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
import { getClientAssignee, type Assignee } from '../../lib/auth';
import AssigneeBadge, { getStoredAssignee, setStoredAssignee } from '../components/AssigneeBadge';
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

export default function AskitPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [assignee, setAssignee] = useState<Assignee | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('askit', DEFAULT_STATUSES.askit));
    setAssignee(getStoredAssignee('askit', getClientAssignee('askit')));

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
    setClientStatus('askit', newStatus);
  };
  const handleAssigneeChange = (newAssignee: Assignee) => {
    setAssignee(newAssignee);
    setStoredAssignee('askit', newAssignee);
  };


  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const newPath = tabId === 'overview' ? '/askit' : `/askit/${tabId}`;
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
              <span className="text-2xl font-bold text-red-600">AS</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-slate-900">ASKIT AIVaaS</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
                {isAdmin && <AssigneeBadge assignee={assignee} onAssigneeChange={handleAssigneeChange} size="md" />}
              </div>
              <p className="text-slate-600">Strategic AI transformation connecting business strategy, organizational development, and AI implementation</p>
            </div>
          </div>
          <a
            href="https://aivaas.biz/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-red-600 hover:underline inline-block"
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
              <PerformanceTabDynamic clientId="askit" />
              <CampaignsTabDynamic clientId="askit" />
            </>
          )}
          {activeTab === 'documents' && <DocumentsTabGeneric clientId="askit" clientName="ASKIT" />}
          {activeTab === 'tasks' && <TasksTab clientId="askit" defaultTasks={[]} />}
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
            <strong>ASKIT AIVaaS</strong> (AI Value as a Service) is a methodology and service that connects business strategy and AI ambition with organizational and people development, AI design and implementation, ROI measurement, and new business value creation. It goes beyond individual AI automations to create strategic competitive advantage.
          </p>

          <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded">
            <p className="font-semibold text-rose-900 mb-2">Core Value Proposition:</p>
            <p className="text-rose-800">
              Move organizations from isolated AI pilots without clear business value to aligned, strategic AI capabilities (L3–L4) with measurable ROI and competitive advantage. Covers strategy, organizational enablement, implementation, and value realization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Methodology" value="Strategy First, Tools Last" />
            <InfoCard label="Key Founder" value="Aleš Štempihar (IIBA)" />
            <InfoCard label="Experience" value="15+ Years, 70+ Leadership Teams" />
            <InfoCard label="Geographic Focus" value="Slovenia" />
            <InfoCard label="Primary Offering" value="AIVaaS + Business Academy" />
            <InfoCard label="Team Approach" value="Multidisciplinary, Not Single Software" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="The Three Pillars of AIVaaS" icon={<Layers className="w-5 h-5" />}>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Core Service Components:</h4>
            <ul className="space-y-2">
              <ListItem type="check">AI Business Value Definition (strategy and business case alignment)</ListItem>
              <ListItem type="check">Organization Enablement (people, processes, and structure readiness)</ListItem>
              <ListItem type="check">AI Design & Implementation (technology and integration)</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Cross-Cutting Elements:</h4>
            <ul className="space-y-2">
              <ListItem type="check">Governance and accountability structures</ListItem>
              <ListItem type="check">Value and ROI realization measurement</ListItem>
              <ListItem type="check">Capability development and leadership alignment</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Diagnostic Tools Provided:</h4>
            <ul className="space-y-2">
              <ListItem>AI Ambition Assessment</ListItem>
              <ListItem>AI Readiness Evaluation</ListItem>
              <ListItem>ROI Readiness Analysis</ListItem>
              <ListItem>CX/EX Opportunity Identification</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Value Creation Matrix (Quarterly Outcomes)" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-1">Q1: Cost Reduction</h4>
            <p className="text-slate-700 text-sm">AI-driven automation and efficiency improvements across business processes</p>
          </div>

          <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
            <h4 className="font-semibold text-green-900 mb-1">Q2: Revenue Growth</h4>
            <p className="text-slate-700 text-sm">New revenue streams and customer value creation through AI capabilities</p>
          </div>

          <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-500">
            <h4 className="font-semibold text-purple-900 mb-1">Q3: Productivity Step Change</h4>
            <p className="text-slate-700 text-sm">Significant improvements in team productivity and work quality</p>
          </div>

          <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-500">
            <h4 className="font-semibold text-amber-900 mb-1">Q4: New Forms of Value</h4>
            <p className="text-slate-700 text-sm">Entirely new business models, competitive advantages, or market opportunities</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Campaign Structure & Positioning">
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">Two Separate Campaigns (Different Personas, Offers, CTAs):</p>
            <p className="text-blue-800 text-sm">
              Campaign 1 targets C-suite (CEO/Owner) for strategic AI transformation. Campaign 2 targets HR/L&D for in-house leadership academy. Each has distinct messaging, pain points, and call-to-action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Primary Markets" value="Slovenia (Regional Scope)" />
            <InfoCard label="Company Size" value="80+ Employees, €10M+ Revenue" />
            <InfoCard label="Industry Focus" value="Manufacturing & Logistics (Primary)" />
            <InfoCard label="Messaging Tone" value="Consultative & Strategic" />
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function ICPAndPersonasTab() {
  return (
    <>
      <ContentSection title="Company Segmentation & ICP" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Target Company Segments (Operational Priority):</h4>
            <div className="space-y-3">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p className="font-semibold text-blue-900 text-sm mb-1">P1 - Ambitious Market Leaders:</p>
                <p className="text-blue-800 text-sm">Successful companies seeking their next competitive advantage and new ways to create value</p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p className="font-semibold text-blue-900 text-sm mb-1">P1 - Companies Under Margin Pressure:</p>
                <p className="text-blue-800 text-sm">Suppliers and manufacturers facing customer price pressure; they need more than optimization</p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p className="font-semibold text-blue-900 text-sm mb-1">P1 - Manufacturing Companies:</p>
                <p className="text-blue-800 text-sm">Complex processes, multiple departments, and connected operational and commercial activities</p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p className="font-semibold text-blue-900 text-sm mb-1">P1 - Logistics Integrators:</p>
                <p className="text-blue-800 text-sm">Integration of processes and systems, beyond transport services alone</p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                <p className="font-semibold text-green-900 text-sm mb-1">P2 - Other Complex Companies:</p>
                <p className="text-green-800 text-sm">Multiple functions, data and process dependencies, and clear leadership</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Key Firmographic Criteria:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard label="Primary Geography" value="Slovenia" />
              <InfoCard label="Employee Count" value="80+ (Primary); 70-79 Manual Review" />
              <InfoCard label="Minimum Revenue" value="€10M+" />
              <InfoCard label="Profit Indicator" value="~€1M+ (Quality Signal)" />
              <InfoCard label="Organizational Structure" value="5+ Leaders Required" />
              <InfoCard label="Industry Restriction" value="None (Manufacturing & Logistics Priority)" />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Fit & No-Fit Filtering Rules:</h4>
            <div className="space-y-3">
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                <p className="font-semibold text-green-900 text-sm">✓ YES - Strong Fit:</p>
                <p className="text-green-800 text-sm">80+ employees, €10M+ revenue, business complexity, leadership team of multiple people; industry not excluded</p>
              </div>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded">
                <p className="font-semibold text-amber-900 text-sm">⚠ REVIEW - Manual Assessment Needed:</p>
                <p className="text-amber-800 text-sm">70-79 employees OR below 80 with €10M+ revenue OR particularly attractive profitability/ambitious leadership</p>
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                <p className="font-semibold text-red-900 text-sm">✗ NO - Exclude:</p>
                <p className="text-red-800 text-sm">Educational institutions, universities, education providers, small companies without leadership/complexity/resources, blocked accounts</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">Critical Note on AI Signals:</p>
            <p className="text-blue-800 text-sm">
              Do NOT exclude companies simply because their websites don't mention AI. A director's ambition is generally not observable from public data and must not be used as a hard filter.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Buyer Personas & Decision-Makers">
        <p className="text-slate-600 mb-4">
          ASKIT AIVaaS has TWO distinct campaigns with different primary buyers, pain points, and CTAs. Do NOT combine personas in the same sequence.
        </p>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-lg border-b pb-2">Campaign 1: AIVaaS for Strategic AI Transformation</h3>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-blue-900">TIER 1 PERSONA: CEO / Managing Director / Owner</h3>
              <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs font-semibold rounded">PRIMARY BUYER</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <p><strong>Sourcing Titles:</strong> CEO, Chief Executive Officer, General Manager, Managing Director, President of Management Board, Owner, Founder</p>
              <p><strong>Opening Message Focus:</strong> AI as business strategy and competitive advantage over next 2-3 years</p>
              <p><strong>Pain Points:</strong> AI pilots without clear business value, margin pressure, AI treated solely as IT project, unclear priorities and accountability, difficulty converting investment into results</p>
              <p><strong>Primary CTA:</strong> "Would a brief introductory conversation about where AI could support your business priorities be useful?"</p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-green-900">TIER 2 PERSONA: CIO / IT Director / Digital Transformation Lead</h3>
              <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-semibold rounded">SUPPORTING STAKEHOLDER</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <p><strong>Sourcing Titles:</strong> CIO, Chief Information Officer, IT Director, Head of Digital Transformation, Chief AI Officer, Head of AI</p>
              <p><strong>Role:</strong> Important stakeholder but does not automatically own company's overall AI strategy</p>
              <p><strong>Pain Points:</strong> From individual tools to aligned accountability and processes</p>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-purple-900">TIER 2 PERSONA: Finance Leadership</h3>
              <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs font-semibold rounded">SUPPORTING STAKEHOLDER</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <p><strong>Sourcing Titles:</strong> CFO, Finance Director, Head of Finance</p>
              <p><strong>Pain Points:</strong> Demonstrating business value and ROI from AI investments</p>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-amber-900">TIER 3 PERSONA: Operations Leadership</h3>
              <span className="px-2 py-1 bg-amber-200 text-amber-800 text-xs font-semibold rounded">SUPPORTING STAKEHOLDER</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <p><strong>Sourcing Titles:</strong> COO, Operations Director, Head of Operations</p>
              <p><strong>Role:</strong> Selected contacts for business and operations opportunities</p>
            </div>
          </div>

          <hr className="my-6" />

          <h3 className="font-bold text-slate-900 text-lg border-b pb-2">Campaign 2: Business Academy for In-House Leadership Education</h3>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-blue-900">TIER 1 PERSONA: HR Leadership & L&D</h3>
              <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs font-semibold rounded">PRIMARY BUYER</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <p><strong>Sourcing Titles:</strong> CHRO, Chief HR Officer, HR Director, Head of HR, People & Culture Director, L&D Director, Head of Learning & Development, Learning & Development Manager</p>
              <p><strong>Opening Message Focus:</strong> Developing a shared understanding of AI across the leadership team</p>
              <p><strong>Pain Points:</strong> Inconsistent AI understanding across leaders, difficulty applying learning to business decisions, uncertainty about leading change, conflicting departmental priorities</p>
              <p><strong>Primary CTA:</strong> "May we send you a short outline of the internal leadership academy so you can assess its fit with your development plan?"</p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">Critical: Slovenian Title Aliases</p>
            <p className="text-blue-800 text-sm">
              For Slovenian sourcing, also search: Direktor, Generalni direktor, Predsednik uprave, Direktor kadrovske službe, Vodja kadrovske službe, Vodja izobraževanja in razvoja, Direktor financ, Direktor operacij
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Pain Points & Personalization Triggers">
        <p className="text-slate-600 mb-4">
          Verified signals that indicate a company is experiencing pain and may be in-market for AIVaaS or Business Academy.
        </p>

        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-1">AI Pilots Without Clear Value</h4>
            <p className="text-slate-700"><strong>Observable Signals:</strong> Announcements of AI pilots, programs, or internal initiatives</p>
            <p className="text-slate-700"><strong>Messaging:</strong> "How do you measure the impact of AI on business results?"</p>
          </div>

          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-1">License Costs & Low Adoption</h4>
            <p className="text-slate-700"><strong>Observable Signals:</strong> Public rollout announcements for AI tools or licenses; actual adoption may be limited</p>
            <p className="text-slate-700"><strong>Messaging:</strong> "How does the investment translate into business ROI?"</p>
          </div>

          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-1">AI Delegated Solely to IT</h4>
            <p className="text-slate-700"><strong>Observable Signals:</strong> Public emphasis on technology deployment without business context</p>
            <p className="text-slate-700"><strong>Messaging:</strong> "Are ambition, processes, and accountability aligned?"</p>
          </div>

          <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
            <h4 className="font-semibold text-green-900 mb-1">Need for AI Talent</h4>
            <p className="text-slate-700"><strong>Observable Signals:</strong> Vacancies for Head of AI, AI Transformation, or AI Program Manager</p>
            <p className="text-slate-700"><strong>Messaging:</strong> "How should strategy, accountability, and implementation be organized?"</p>
          </div>

          <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
            <h4 className="font-semibold text-green-900 mb-1">Margin Pressure</h4>
            <p className="text-slate-700"><strong>Observable Signals:</strong> Public statements about pricing pressure, results challenges, or cost concerns</p>
            <p className="text-slate-700"><strong>Messaging:</strong> "Where could AI create different value for customers?"</p>
          </div>

          <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-500">
            <h4 className="font-semibold text-amber-900 mb-1">System Complexity & Integration</h4>
            <p className="text-slate-700"><strong>Observable Signals:</strong> Evidence of multiple ERP/CRM systems, connected processes, integration projects</p>
            <p className="text-slate-700"><strong>Messaging:</strong> "How can processes be connected beyond individual tools?"</p>
          </div>

          <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-500">
            <h4 className="font-semibold text-amber-900 mb-1">Leadership Development & Change Management</h4>
            <p className="text-slate-700"><strong>Observable Signals:</strong> Growth, reorganization, internal academies, L&D programs (Academy targeting)</p>
            <p className="text-slate-700"><strong>Messaging:</strong> "A shared framework for leadership decisions"</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">Critical: Distinguish Verification from Hypothesis</p>
            <p className="text-blue-800 text-sm">
              Use verified signals (e.g., active Head of AI vacancy) not hypotheses (e.g., "AI may not be working"). Never write "I noticed AI is not working at your company" without evidence.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Scoring & ICP Classification" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Proposed Scoring Framework (Internal Use):</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                <p className="font-semibold text-blue-900">80+ Employees: +30 pts</p>
              </div>
              <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                <p className="font-semibold text-blue-900">€10M+ Revenue: +20 pts</p>
              </div>
              <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                <p className="font-semibold text-green-900">Process Complexity: +20 pts</p>
              </div>
              <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                <p className="font-semibold text-green-900">Manufacturing or Logistics: +10 pts</p>
              </div>
              <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-500">
                <p className="font-semibold text-amber-900">Verified AI Signal: +10 pts</p>
              </div>
              <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-500">
                <p className="font-semibold text-amber-900">5+ Leaders: +10 pts</p>
              </div>
            </div>
            <p className="text-slate-700 mt-3 text-sm">
              <strong>Scoring Guide:</strong> 80-100 = P1 | 60-79 = P2 | Below 60 = REVIEW/NO (based on hard filters)
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Classification Process:</h4>
            <ol className="list-decimal list-inside space-y-2 text-slate-700 text-sm">
              <li>Verify company activity; exclude education providers immediately</li>
              <li>Verify employee count and revenue with source/year</li>
              <li>Verify organizational complexity with evidence</li>
              <li>Classify as YES / REVIEW / NO with one verifiable explanation</li>
              <li>Check blocklist before export</li>
              <li>Assign campaign_id: AIVaaS_CEO or ACADEMY_HR</li>
            </ol>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="font-semibold text-red-900 mb-2">Blocklist Checks (MUST Complete):</p>
            <p className="text-red-800 text-sm">
              Before exporting contacts: verify against client's existing customers, active conversations, partners, and competitively sensitive accounts (to be obtained from ASKIT).
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
      <ContentSection title="Clay Filter Strategy & Required Fields" icon={<Filter className="w-5 h-5" />}>
        <p className="text-slate-600 mb-4">
          Clay enrichment criteria for identifying target companies and qualifying decision-makers. Two separate campaigns require separate contact lists and filters.
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Firmographic Base Filters (All Campaigns):</h4>
            <ul className="space-y-2">
              <ListItem><strong>Geography:</strong> Slovenia (primary geographic scope)</ListItem>
              <ListItem><strong>Employee Count:</strong> 80+ (primary); 70-79 requires manual review</ListItem>
              <ListItem><strong>Revenue:</strong> €10M+ minimum</ListItem>
              <ListItem><strong>Profit:</strong> ~€1M+ as quality indicator (not mandatory)</ListItem>
              <ListItem><strong>Organization Structure:</strong> At least 5 identifiable leaders</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Industry & Complexity Filters:</h4>
            <ul className="space-y-2">
              <ListItem><strong>Priority Industries:</strong> Manufacturing, Logistics/Integration (no hard restriction on others)</ListItem>
              <ListItem><strong>Business Complexity:</strong> Multiple departments, process integration, ERP/CRM systems</ListItem>
              <ListItem><strong>Exclude:</strong> Educational institutions, universities, education providers</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Campaign-Specific Contact Filters:</h4>
            <div className="space-y-3 mt-3">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p className="font-semibold text-blue-900 text-sm mb-1">Campaign 1 (AIVaaS - CEO):</p>
                <p className="text-blue-800 text-sm">CEO, Chief Executive, General Manager, Managing Director, President, Owner, Founder</p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                <p className="font-semibold text-green-900 text-sm mb-1">Campaign 2 (Business Academy - HR/L&D):</p>
                <p className="text-green-800 text-sm">CHRO, HR Director, Head of HR, L&D Director, Head of L&D, People & Culture Director</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Contact Data Requirements:</h4>
            <ul className="space-y-2">
              <ListItem><strong>Email:</strong> Business email required and verified</ListItem>
              <ListItem><strong>LinkedIn URL:</strong> Highly preferred for direct contact and sequence personalization</ListItem>
              <ListItem><strong>Phone (Optional):</strong> Useful for follow-up after initial engagement</ListItem>
              <ListItem><strong>Verification:</strong> Cross-reference title, company size, industry from multiple sources</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Do NOT Combine in Single Filter:</h4>
            <ul className="space-y-2">
              <ListItem type="cross">CEO and HR contacts in the same sequence (different buying drivers)</ListItem>
              <ListItem type="cross">Multiple countries in single filter (regional focus is Slovenia)</ListItem>
              <ListItem type="cross">Unverified "AI signals" as exclusion criteria (ambition not observable from website)</ListItem>
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
          AI prompts for identifying verified buying signals and qualifying prospects for AIVaaS or Business Academy.
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">AI Pilot or Initiative Announcement</h4>
            <CodeBlock code="Has this company announced AI pilots, AI programs, or internal AI initiatives in the past 12 months? Look for: press releases, news articles, LinkedIn posts, job postings mentioning AI projects. Return YES with details and source URL if found, NO if not. Do NOT assume lack of mention means absence of pilots." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">AI Tool Adoption or License Announcement</h4>
            <CodeBlock code="Has this company publicly announced adoption of AI tools or licenses (ChatGPT, Copilot, specialized AI platforms)? Look for: press releases, LinkedIn announcements, news articles about tool rollout. Return YES with tool name and source if found, NO if not. Note: announcement does NOT confirm actual adoption or ROI." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">AI Talent or Leadership Hiring (Signal)</h4>
            <CodeBlock code="Is this company actively hiring for AI leadership or management roles (Head of AI, Chief AI Officer, AI Transformation Manager, Head of AI Strategy)? Check LinkedIn and company career pages for open or recently filled positions. Return YES with job title and posting date if found, NO if not." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Margin Pressure or Efficiency Focus</h4>
            <CodeBlock code="Does this company show evidence of margin pressure or cost/efficiency focus? Look for: earnings announcements mentioning profitability pressure, news about cost reduction initiatives, job postings for automation or efficiency roles. Return YES with details and source if found, NO if not." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">System Complexity & ERP/CRM Presence</h4>
            <CodeBlock code="Does this company show evidence of multiple systems or complex integrations? Look for: job postings mentioning ERP, CRM, system integration, process automation; news about system implementations; LinkedIn profiles mentioning SAP, Salesforce, or supply chain systems. Return YES with system/job details if found, NO if not." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Leadership Development or L&D Program (Academy Signal)</h4>
            <CodeBlock code="Is this company investing in leadership development, internal academies, or L&D programs? Look for: announcements of internal training programs, hiring for L&D roles, news about organizational development, LinkedIn posts about learning initiatives. Return YES with program/role details if found, NO if not. This signals readiness for Business Academy." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Organizational Change or Growth</h4>
            <CodeBlock code="Is this company undergoing organizational change or expansion? Look for: restructuring announcements, new department launches, geographic expansion, new leadership hires, acquisition/integration news. Return YES with details and source if found, NO if not." />
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">Critical Research Rule:</p>
            <p className="text-blue-800 text-sm">
              Only use these prompts to VERIFY signals from reliable sources (press releases, official job postings, news, LinkedIn). Do NOT infer company problems from absence of AI mentions. A company's AI strategy is not observable from public data alone.
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
      <SequencesTab clientId="askit" />
      <div className="mt-8">
        <CampaignsTabGeneric />
      </div>
    </>
  );
}
