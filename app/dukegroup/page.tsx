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

const DUKEGROUP_DEFAULT_TASKS = [
  {
    id: 'task-1',
    title: 'Initial campaign setup and list building',
    description: 'Set up targeting filters and build initial prospect list',
    status: 'pending' as const,
    priority: 'high' as const,
  },
];

export default function DukeGroupPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [assignee, setAssignee] = useState<Assignee | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('dukegroup', DEFAULT_STATUSES.dukegroup));
    setAssignee(getStoredAssignee('dukegroup', getClientAssignee('dukegroup')));

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
    setClientStatus('dukegroup', newStatus);
  };
  const handleAssigneeChange = (newAssignee: Assignee) => {
    setAssignee(newAssignee);
    setStoredAssignee('dukegroup', newAssignee);
  };


  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const newPath = tabId === 'overview' ? '/dukegroup' : `/dukegroup/${tabId}`;
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
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-emerald-600">C</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-slate-900">DukeGroup</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
                {isAdmin && <AssigneeBadge assignee={assignee} onAssigneeChange={handleAssigneeChange} size="md" />}
              </div>
              <p className="text-slate-600">Professional Tableware for Hotels</p>
            </div>
          </div>
          <a
            href="https://dukegroup.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-emerald-600 hover:underline inline-block"
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
              <PerformanceTabDynamic clientId="dukegroup" />
              <CampaignsTabDynamic clientId="dukegroup" />
            </>
          )}
          {activeTab === 'documents' && <DocumentsTabGeneric clientId="dukegroup" clientName="DukeGroup" />}
          {activeTab === 'tasks' && <TasksTab clientId="dukegroup" defaultTasks={DUKEGROUP_DEFAULT_TASKS} />}
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
            <strong>DukeGroup</strong> supplies professional tableware brands to hotels in Slovenia and Serbia. They represent six leading European brands (FIGGJO, SERAX, PORDAMSA, JARS, INFINITO DESIGN, ARTILUGIS) and help hotels select and order high-quality dishes, plates, silverware, and table linens for F&B operations, banquets, and restaurant renewals.
          </p>

          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded">
            <p className="font-semibold text-emerald-900 mb-2">Core Value Proposition:</p>
            <p className="text-emerald-800">
              Help hotel decision makers select professional tableware that matches their concept, improves guest experience, and supports their F&B operations - with guidance on replenishment, renovation, and new opening projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Target Markets" value="Slovenia & Serbia Only" />
            <InfoCard label="Primary Product Category" value="Professional Tableware" />
            <InfoCard label="Brand Portfolio" value="6 European Brands" />
            <InfoCard label="Customer Type" value="Hotels with F&B Operations" />
            <InfoCard label="Hotel Categories" value="3-5+ Stars & Boutique" />
            <InfoCard label="Service Model" value="Direct Personal Sales" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Hotel Targeting Criteria" icon={<Layers className="w-5 h-5" />}>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Hotel Characteristics (Priority Tiers):</h4>
            <ul className="space-y-2">
              <ListItem type="check"><strong>A (Highest Priority):</strong> 4-5 star hotels with strong F&B, local decision-making authority, verified current project</ListItem>
              <ListItem type="check"><strong>B (Secondary):</strong> 3-5 star boutique/design hotels with F&B operation and local management</ListItem>
              <ListItem type="check"><strong>C (Lower Priority):</strong> Group purchasing without clear local decision route, or weak F&B operations</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Hotel Needs Signals:</h4>
            <ul className="space-y-2">
              <ListItem>Hotel renovation or F&B refresh projects</ListItem>
              <ListItem>New restaurant opening or launch</ListItem>
              <ListItem>Banquet or events expansion</ListItem>
              <ListItem>Equipment replenishment or replacement</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Hard Exclusions:</h4>
            <ul className="space-y-2">
              <ListItem type="cross">Standalone restaurants, bars, cafes (must be hotels only)</ListItem>
              <ListItem type="cross">Hotels outside Slovenia & Serbia</ListItem>
              <ListItem type="cross">Hotels with no F&B operation or restaurant</ListItem>
              <ListItem type="cross">No local decision-making authority (foreign HQ controls all)</ListItem>
              <ListItem type="cross">Closed properties or unverifiable contact information</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Campaign Architecture" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">Four Parallel Campaigns:</p>
            <p className="text-blue-800 mb-2">Separated by country and buying decision process (hotel leadership vs. F&B/procurement):</p>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li><strong>SI Campaign 1:</strong> Slovenia - Hotel Leadership Track</li>
              <li><strong>SI Campaign 2:</strong> Slovenia - F&B/Procurement Track</li>
              <li><strong>SR Campaign 1:</strong> Serbia - Hotel Leadership Track</li>
              <li><strong>SR Campaign 2:</strong> Serbia - F&B/Procurement Track</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Total New Leads/Month Capacity" value="Up to 1,000" color="bg-amber-50 text-amber-700" />
            <InfoCard label="Leads per Campaign" value="250 (Target Math)" color="bg-amber-50 text-amber-700" />
            <InfoCard label="Initial Sequence" value="3 Messages Max" color="bg-amber-50 text-amber-700" />
            <InfoCard label="Message Touches" value="Day 1, Day 5, Day 12" color="bg-amber-50 text-amber-700" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Brand Portfolio & Product Positioning" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-slate-600 text-sm">
            DukeGroup represents six European brands. Each brand is positioned for specific hotel needs. Strategy: start with hotel need, then select 1-2 relevant brands.
          </p>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-2">FIGGJO</h3>
            <p className="text-slate-700 text-sm mb-2"><strong>Role in Outreach:</strong> Professional porcelain and customized decor</p>
            <p className="text-slate-700 text-sm"><strong>Verified:</strong> Official website confirms porcelain & custom decor. DukeGroup confirms order specific terms.</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-bold text-green-900 mb-2">SERAX</h3>
            <p className="text-slate-700 text-sm mb-2"><strong>Role in Outreach:</strong> Selection for visual concept of hotel table after catalogue review</p>
            <p className="text-slate-700 text-sm"><strong>Verified:</strong> Portfolio inclusion confirmed. Dušan approves relevant collections per project.</p>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h3 className="font-bold text-amber-900 mb-2">PORDAMSA</h3>
            <p className="text-slate-700 text-sm mb-2"><strong>Role in Outreach:</strong> Selection for food presentation and hotel F&B operations</p>
            <p className="text-slate-700 text-sm"><strong>Note:</strong> Proposed sales angle. Do not assert material properties without evidence.</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-bold text-purple-900 mb-2">JARS</h3>
            <p className="text-slate-700 text-sm mb-2"><strong>Role in Outreach:</strong> Selection for table character and gastronomic concepts</p>
            <p className="text-slate-700 text-sm"><strong>Note:</strong> Proposed sales angle. Verify origin and properties for each product.</p>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <h3 className="font-bold text-indigo-900 mb-2">INFINITO DESIGN</h3>
            <p className="text-slate-700 text-sm mb-2"><strong>Role in Outreach:</strong> Relevant hotel selections from general or nautical catalogue</p>
            <p className="text-slate-700 text-sm"><strong>Note:</strong> Nautical catalogue is supporting material only, not a reason to target vessels.</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-2">ARTILUGIS</h3>
            <p className="text-slate-700 text-sm mb-2"><strong>Role in Outreach:</strong> Complementary selection based on identified hotel needs</p>
            <p className="text-slate-700 text-sm"><strong>Note:</strong> Confirm relevant product categories and items before presentation.</p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mt-4">
            <p className="font-semibold text-red-900 mb-2">Critical Rules for Product Claims:</p>
            <ul className="list-disc list-inside space-y-1 text-red-800 text-sm">
              <li>Do NOT create six brand campaigns or send every catalogue in first message</li>
              <li>Claims about durability, washing, stock, delivery, price, warranty require current evidence</li>
              <li>Do NOT promise savings, faster delivery, reduced breakage, or higher food sales without supporting evidence</li>
              <li>All claims require explicit DukeGroup approval</li>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Service Delivery Model">
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded">
          <p className="text-slate-800 font-medium mb-2">INTELSOL's Role:</p>
          <p className="text-slate-800 text-sm mb-3">Research hotel eligibility → Verify local contacts → Qualify buying process → Book meetings with verified local decision makers.</p>

          <p className="text-slate-800 font-medium mb-2">DukeGroup's Role:</p>
          <p className="text-slate-800 text-sm">Personal presentations → Solution design → Proposals → Closing → Order fulfillment.</p>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Success Metric</h4>
            <p className="text-slate-700">
              Qualified meetings held with verified local decision makers who can validate hotel needs and open the buying process.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1">90-Day Pilot Delivery Plan</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-700 text-sm">
              <li><strong>Days 1-14:</strong> Confirm Dušan's ICP & suppression list. Verify first 20 records per campaign. Launch small batch (25-50 per campaign).</li>
              <li><strong>Days 15-30:</strong> Analyze actual replies and quality. Refine personas and messaging. Increase volume only when quality is sound.</li>
              <li><strong>Days 31-60:</strong> Reallocate capacity across four campaigns based on meeting quality held.</li>
              <li><strong>Days 61-90:</strong> Review accepted opportunities, proposals, orders, and time to next step. Decide whether to continue.</li>
            </ul>
            <p className="text-slate-600 text-sm mt-2">Weekly reporting covers volume, replies, meetings, rejection reasons, and concrete changes. Sales cycles may outlast the pilot - keep tracking open cohorts.</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Decisions to Confirm with Dusan (Before Launch)" icon={<CheckSquare className="w-5 h-5" />}>
        <p className="text-slate-600 text-sm mb-4">All items below require written approval from Dusan before campaign launch. ICP approval does not replace the cooperation contract.</p>

        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-1">1. Scope & Personas</h4>
            <p className="text-slate-700 text-sm">Confirm: Hotels only in SI/SR, four campaigns, local working responsibilities, room bands indicative</p>
          </div>

          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-1">2. Hotel Priorities</h4>
            <p className="text-slate-700 text-sm">Confirm: 4-5 stars, boutique, strong F&B; exceptional 3-star after review; no compulsory country quota</p>
          </div>

          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-1">3. Central Purchasing Rules</h4>
            <p className="text-slate-700 text-sm">Confirm: Include local group buying units; foreign headquarters outside initial scope</p>
          </div>

          <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
            <h4 className="font-semibold text-green-900 mb-1">4. Portfolio & Brand Claims</h4>
            <p className="text-slate-700 text-sm">Confirm: Current catalogues, approved claims, references, categories, distribution territory, any exclusivity</p>
          </div>

          <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
            <h4 className="font-semibold text-green-900 mb-1">5. Commercial Feasibility</h4>
            <p className="text-slate-700 text-sm">Confirm: Minimum value, quantities, margins, samples, delivery, service, Serbia logistics requirements</p>
          </div>

          <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
            <h4 className="font-semibold text-green-900 mb-1">6. Suppression List</h4>
            <p className="text-slate-700 text-sm">Confirm: Full list, related properties, existing customers, active projects before first import</p>
          </div>

          <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-500">
            <h4 className="font-semibold text-amber-900 mb-1">7. Senders & Channels</h4>
            <p className="text-slate-700 text-sm">Confirm: Selected domains, approved signature, language, permitted channels, opt-out requirements</p>
          </div>

          <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-500">
            <h4 className="font-semibold text-amber-900 mb-1">8. Meeting Quality Criteria & Capacity</h4>
            <p className="text-slate-700 text-sm">Confirm: Quality definition, Dusan's weekly capacity, meeting format, calendar availability</p>
          </div>

          <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-500">
            <h4 className="font-semibold text-purple-900 mb-1">9. Lead Definition & Capacity</h4>
            <p className="text-slate-700 text-sm">Confirm: Definition of 1,000 leads, inclusion of four campaigns, message and research limits</p>
          </div>

          <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-500">
            <h4 className="font-semibold text-purple-900 mb-1">10. Contract & Commission</h4>
            <p className="text-slate-700 text-sm">Confirm: Fees, pilot period, termination, commission basis/rate, payments, excluded costs, attribution</p>
          </div>

          <div className="bg-slate-50 p-3 rounded border-l-4 border-slate-500">
            <h4 className="font-semibold text-slate-900 mb-1">11. Measurement & Ownership</h4>
            <p className="text-slate-700 text-sm">Confirm: KPIs, response times, record ownership, access, retention, export rules</p>
          </div>

          <div className="bg-slate-50 p-3 rounded border-l-4 border-slate-500">
            <h4 className="font-semibold text-slate-900 mb-1">12. Opportunity Attribution</h4>
            <p className="text-slate-700 text-sm">Confirm: Attribution window, multiple properties in group, repeat orders, partial payments, dispute process</p>
          </div>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mt-4">
          <p className="text-red-900 text-sm"><strong>Critical:</strong> Do not automatically attribute entire group or all future orders. Attribute opportunity to INTELSOL only when: (1) new source is recorded, (2) no prior active DukeGroup opportunity exists, and (3) DukeGroup accepts it in writing.</p>
        </div>
      </ContentSection>
    </>
  );
}

function ICPAndPersonasTab() {
  return (
    <>
      <ContentSection title="Evidence Labels & Verification Standards" icon={<FileText className="w-5 h-5" />}>
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-1">Confirmed in Context</h4>
            <p className="text-slate-700 text-sm">Stated in DukeGroup correspondence or official communications</p>
          </div>

          <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
            <h4 className="font-semibold text-green-900 mb-1">Web Verified</h4>
            <p className="text-slate-700 text-sm">Checked directly on the cited website or official source</p>
          </div>

          <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-500">
            <h4 className="font-semibold text-amber-900 mb-1">Proposed</h4>
            <p className="text-slate-700 text-sm">An operational recommendation requiring Dusan's approval before implementation</p>
          </div>

          <div className="bg-slate-50 p-3 rounded border-l-4 border-slate-500">
            <h4 className="font-semibold text-slate-900 mb-1">Contractual Terms</h4>
            <p className="text-slate-700 text-sm">Require separate confirmation with INTELSOL and DukeGroup</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Hotel Targeting Criteria" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Geography:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard label="Slovenia" value="Primary Market" color="bg-blue-50 text-blue-700" />
              <InfoCard label="Serbia" value="Primary Market" color="bg-blue-50 text-blue-700" />
            </div>
            <p className="text-slate-600 text-sm mt-3">Local operational responsibility required. Foreign ownership is acceptable if local management controls F&B operations and tableware selection.</p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Hotel Categories & Size:</h4>
            <div className="space-y-2">
              <InfoCard label="Star Ratings" value="3-5+ Stars, Boutique, Design, Wellness, Resort, Conference" />
              <InfoCard label="Room Count" value="Small (up to 49) to Large (150+)" />
              <InfoCard label="Priority" value="Strong F&B operation and identifiable tableware budget" />
            </div>
            <p className="text-slate-600 text-sm mt-3">Size is a guide, not a rule. F&B strength and local purchasing authority take precedence over room count.</p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Hotel Types by Priority:</h4>
            <div className="space-y-3">
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded">
                <p className="font-semibold text-emerald-900 text-sm mb-1">Priority A - Strong F&B + Local Authority:</p>
                <p className="text-emerald-800 text-sm">4-5 star hotels or strong boutique/design hotels with documented F&B operation, local decision-making, AND verified current project (renovation, opening, refresh).</p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p className="font-semibold text-blue-900 text-sm mb-1">Priority B - Suitable Hotel + Local Role:</p>
                <p className="text-blue-800 text-sm">3-4 star hotel or good F&B operation with local management. Need or timing remains unknown, but location/management suggests opportunity.</p>
              </div>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded">
                <p className="font-semibold text-amber-900 text-sm mb-1">Priority C - Central Purchasing or Weak F&B:</p>
                <p className="text-amber-800 text-sm">Group purchasing without verified local decision route, or hotel with weak F&B operation. Keep in research status, activate after verification.</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Hard Exclusions (Do NOT Contact):</h4>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <ul className="text-red-800 text-sm space-y-1">
                <ListItem type="cross">Standalone restaurants, bars, cafes, apartments, hostels, campsites</ListItem>
                <ListItem type="cross">Closed properties or fabricated contact information</ListItem>
                <ListItem type="cross">Hotels outside Slovenia or Serbia</ListItem>
                <ListItem type="cross">No relevant local responsibility or foreign HQ with exclusive control</ListItem>
                <ListItem type="cross">Prior suppression entries or do-not-contact requests</ListItem>
              </ul>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Buyer Personas & Decision Hierarchy">
        <p className="text-slate-600 mb-4">
          For every hotel contact, identify their role in the buying process: Initiator, Technical Influencer, Process Owner, or Budget Approver. Title alone does not prove authority.
        </p>

        <div className="space-y-4">
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-emerald-900">PRIMARY: Hotel Director / General Manager</h3>
              <span className="px-2 py-1 bg-emerald-200 text-emerald-800 text-xs font-semibold rounded">FIRST CONTACT</span>
            </div>
            <div className="space-y-2 text-slate-700 text-sm">
              <p><strong>Local Titles:</strong> Direktor hotela, Generalni direktor, Vodja hotela (SI) | Direktor hotela, Generalni menadzer (SR)</p>
              <p><strong>Role:</strong> Can validate hotel needs and open the actual buying process. Has budget authority for F&B operations.</p>
              <p><strong>Next Step:</strong> If hotel has strong F&B, may need introduction to Chef or F&B Manager. If central decision-making, clarify local approval process.</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-blue-900">PRIMARY: F&B Manager / Director</h3>
              <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs font-semibold rounded">PROCESS OWNER</span>
            </div>
            <div className="space-y-2 text-slate-700 text-sm">
              <p><strong>Local Titles:</strong> Vodja gostinstva, Vodja hrane in pijace (SI) | Menadzer hrane i pica, Direktor F&B (SR)</p>
              <p><strong>Role:</strong> Owns tableware selection and specifications. Manages procurement process. Can introduce solution to hotel leadership.</p>
              <p><strong>Next Step:</strong> Technical specifications, samples, pricing. Then requires hotel director or GM approval.</p>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-purple-900">TECHNICAL INFLUENCER: Executive Chef / Sous Chef</h3>
              <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs font-semibold rounded">INFLUENCER</span>
            </div>
            <div className="space-y-2 text-slate-700 text-sm">
              <p><strong>Local Titles:</strong> Izvrsni chef, Glavni kuhar (SI) | Sef kuhinje, Glavnom kuhar (SR)</p>
              <p><strong>Role:</strong> Specifies technical requirements and quality standards. Validates fit for kitchen operations.</p>
              <p><strong>Important:</strong> Treat as technical influencer UNTIL purchasing authority is verified. Do not position as primary decision maker.</p>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-amber-900">SECONDARY: Procurement Manager</h3>
              <span className="px-2 py-1 bg-amber-200 text-amber-800 text-xs font-semibold rounded">PROCESS MANAGER</span>
            </div>
            <div className="space-y-2 text-slate-700 text-sm">
              <p><strong>Local Titles:</strong> Vodja nabave, Rukovodilac nabavke (SI/SR)</p>
              <p><strong>Role:</strong> Manages supplier relationships and ordering process. May be group-level for multi-property chains.</p>
              <p><strong>When to Use:</strong> After initial need is validated by hotel/F&B leadership. Use for implementation details and ongoing orders.</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-slate-900">DO NOT TARGET: Support Roles</h3>
              <span className="px-2 py-1 bg-slate-200 text-slate-800 text-xs font-semibold rounded">EXCLUDE</span>
            </div>
            <div className="space-y-2 text-slate-700 text-sm">
              <ul className="list-disc list-inside space-y-1">
                <li>Reception / General inbox (can help route, but not qualified)</li>
                <li>Marketing, HR, IT, Reservations (no operational role)</li>
                <li>Property owners without local operational role</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="font-semibold text-blue-900 mb-2">Verification Questions for Any Contact:</p>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Who selects tableware and who approves the order?</li>
            <li>• Do you purchase independently or through a group?</li>
            <li>• Can you introduce a new supplier, and how is this approved?</li>
            <li>• Does the decision cover one property or several?</li>
            <li>• Who owns the next step locally?</li>
          </ul>
        </div>
      </ContentSection>

      <ContentSection title="Buying Signals for Hotels" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-4 mb-6">
          <div className="bg-slate-50 border-l-4 border-slate-700 p-4 rounded">
            <p className="font-semibold text-slate-900 mb-2">Signal Verification Requirements:</p>
            <p className="text-slate-700 text-sm mb-3">For each signal, AI must record: URL, review date, supporting excerpt, finding, and confidence label (confirmed, likely, or unknown). Never invent information.</p>
          </div>

          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-900 mb-1">TIER 1: Hotel Renovation or Refresh</h4>
              <p className="text-slate-700 text-sm">Official announcement with location and date. Priority when purchasing route is verified.</p>
            </div>

            <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-900 mb-1">TIER 1: New Property Opening or Expansion</h4>
              <p className="text-slate-700 text-sm">Confirmed opening or new restaurant/banquet space. Approach F&B or Chef with relevant question.</p>
            </div>

            <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-900 mb-1">TIER 1: Management or Ownership Change</h4>
              <p className="text-slate-700 text-sm">New hotel director or F&B leader with verified start date. Reason to explore needs, not proof of intent.</p>
            </div>

            <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
              <h4 className="font-semibold text-green-900 mb-1">TIER 2: Banqueting, Weddings, or Conferences</h4>
              <p className="text-slate-700 text-sm">Actual hotel offering verified. Explore replenishment and inventory standardization.</p>
            </div>

            <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
              <h4 className="font-semibold text-green-900 mb-1">TIER 2: Recent Accreditation or Award</h4>
              <p className="text-slate-700 text-sm">Michelin recognition, ISO certifications, design awards. Signal of quality commitment and potential need.</p>
            </div>

            <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-500">
              <h4 className="font-semibold text-amber-900 mb-1">TIER 3: Seasonal Planning or Budget Cycles</h4>
              <p className="text-slate-700 text-sm">Confirm timing in conversation; do not infer from month alone. Agree suitable scope and recontact date.</p>
            </div>
          </div>
        </div>

        <ContentSection title="Eligibility Gates & Scoring System">
          <div className="space-y-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="font-semibold text-red-900 mb-2">Hard Filters (Check in Order - Failed = Exclusion):</p>
              <ol className="list-decimal list-inside space-y-1 text-red-800 text-sm">
                <li><strong>Country:</strong> Slovenia or Serbia only</li>
                <li><strong>Property Type:</strong> Hotel with F&B operations (no standalone restaurants/bars)</li>
                <li><strong>Local Authority:</strong> Verified operational responsibility in SI or SR</li>
                <li><strong>Suppression:</strong> Not on existing customer, active opportunity, or do-not-contact list</li>
              </ol>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="font-semibold text-blue-900 mb-2">Scoring (0-10 scale - Only after gates passed):</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                <li><strong>F&B Fit (0-3):</strong> Restaurant/banquet strength and tableware relevance</li>
                <li><strong>Current Need (0-3):</strong> Renovation, opening, or verified replenishment project</li>
                <li><strong>Local Access (0-3):</strong> Direct contact with decision-making authority</li>
                <li><strong>Clear Timing (0-1):</strong> Known timeline for purchasing decision</li>
              </ul>
              <div className="mt-3 text-sm">
                <p className="text-blue-900 font-semibold mb-1">Priority Classification:</p>
                <p className="text-blue-800"><strong>A (8-10):</strong> Strong F&B, verified local authority, current project</p>
                <p className="text-blue-800"><strong>B (5-7):</strong> Suitable hotel with local role, need/timing unknown</p>
                <p className="text-blue-800"><strong>C (0-4):</strong> Central purchasing OR weak F&B - research status</p>
              </div>
            </div>

            <div className="bg-slate-50 border-l-4 border-slate-700 p-4 rounded">
              <p className="font-semibold text-slate-900 mb-2">Quality Control Process:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-700 text-sm">
                <li>Manually review first 20 records per campaign</li>
                <li>Review 10% of every import after initial batch</li>
                <li>Manually review every ambiguous case</li>
                <li>Pause affected import if errors found (country, persona, suppression)</li>
                <li>Record all findings with source URL, review date, confidence level</li>
              </ul>
            </div>
          </div>
        </ContentSection>
      </ContentSection>

      <ContentSection title="Research & Verification Process" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Hotel Research Priority:</h4>
            <p className="text-slate-700">
              Verify on official hotel website first, then local group websites, official announcements. Use directories and professional profiles as supporting sources. When sources conflict, escalate for manual review.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Contact Verification:</h4>
            <p className="text-slate-700">
              For every contact, verify: current role at hotel, local operational responsibility, involvement in F&B decision-making. Recheck role before activation; proposed maximum research age is 30 days.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Priority Gates (Check in Order):</h4>
            <ul className="space-y-2">
              <ListItem><strong>Country:</strong> Slovenia or Serbia only</ListItem>
              <ListItem><strong>Property Type:</strong> Hotel with F&B operations (exclude standalone restaurants)</ListItem>
              <ListItem><strong>Local Authority:</strong> Verified local management or decision-making role</ListItem>
              <ListItem><strong>Suppression Check:</strong> Not on existing customer list, active opportunity list, or do-not-contact requests</ListItem>
              <ListItem><strong>Scoring:</strong> Only after all gates passed - 0-10 scale based on F&B fit, current need, local access, timing</ListItem>
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">Quality Control Process:</p>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Manually review first 20 records per campaign</li>
              <li>• Review 10% of every import after initial batch</li>
              <li>• Manually review every ambiguous case</li>
              <li>• Pause affected import if errors found in country, persona, or suppression</li>
              <li>• All findings recorded with source URL, review date, confidence level</li>
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
      <ContentSection title="Clay Filter Criteria" icon={<Filter className="w-5 h-5" />}>
        <p className="text-slate-600 mb-4">
          Hotel targeting criteria for Clay filters. Four separate campaigns organized by country and buyer decision process.
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Geography & Hotel Targeting:</h4>
            <ul className="space-y-2">
              <ListItem><strong>Slovenia:</strong> Hotels only, with F&B operation, local decision-making</ListItem>
              <ListItem><strong>Serbia:</strong> Hotels only, with F&B operation, local decision-making</ListItem>
              <ListItem><strong>Exclude:</strong> Restaurants, bars, cafes, hostels, apartments (standalone properties)</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Hotel Classification Filters:</h4>
            <ul className="space-y-2">
              <ListItem><strong>Priority A (Target First):</strong> 4-5 star hotels + strong F&B + local authority + current project verified</ListItem>
              <ListItem><strong>Priority B (Secondary):</strong> 3-5 star boutique/design + F&B operation + local management + unknown timing</ListItem>
              <ListItem><strong>Priority C (Research):</strong> Group purchasing without local route OR weak F&B operations</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Hotel Signals for Clay Enrichment:</h4>
            <ul className="space-y-2">
              <ListItem><strong>Current Project Signals:</strong> Renovation, F&B refresh, new opening, banquet expansion, new concept</ListItem>
              <ListItem><strong>Management Changes:</strong> New director, new F&B manager, new owner (triggers upgrades)</ListItem>
              <ListItem><strong>Quality/Awards:</strong> Michelin recognition, ISO certifications, design awards, accreditations</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Contact Targeting by Campaign:</h4>
            <ul className="space-y-2">
              <ListItem><strong>Hotel Leadership Track:</strong> Hotel Director, General Manager (primary contacts for hotel-level decisions)</ListItem>
              <ListItem><strong>F&B/Procurement Track:</strong> F&B Manager, Executive Chef, Procurement Manager (operational roles)</ListItem>
              <ListItem><strong>Exclude Roles:</strong> Reception, marketing, HR, IT, reservations (no procurement authority)</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Suppression Criteria:</h4>
            <ul className="space-y-2">
              <ListItem>Existing customers (confirmed in DukeGroup records)</ListItem>
              <ListItem>Active opportunity hotels (currently in discussion with DukeGroup)</ListItem>
              <ListItem>Do-not-contact requests (explicit opt-outs)</ListItem>
              <ListItem>Closed properties or unverifiable information</ListItem>
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
      <ContentSection title="AI Evaluation Prompts for Hotels" icon={<Code className="w-5 h-5" />}>
        <p className="text-slate-600 mb-4">
          AI prompts for researching and qualifying hotels for target campaigns.
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Hotel F&B Strength Assessment</h4>
            <CodeBlock code="Does this hotel have a strong F&B operation? Look for: detailed website description of restaurants, bars, conference facilities, or banquet spaces; menus or culinary information; F&B-specific manager or chef bios; or dedicated pages for dining venues. Return YES with details if found, NO if no clear F&B focus." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Hotel Renovation/Project Signals (Tier 1)</h4>
            <CodeBlock code="Is this hotel currently undergoing renovation or announcing a new project? Look for: recent news about F&B refresh, restaurant renovation, new opening, banquet space expansion; website updates with 'coming soon' or 'newly renovated'; LinkedIn posts or press releases about property updates. Return YES with project details and date if found, NO if not." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Management Change Signals (Tier 1)</h4>
            <CodeBlock code="Has this hotel recently changed management? Look for: new hotel director or general manager bios on website; new F&B manager or head chef information; LinkedIn posts announcing new leadership arrivals; press releases about management changes. Return YES with new manager names and titles if found, NO if not." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Hotel Category & Star Rating</h4>
            <CodeBlock code="What is this hotel's star rating and primary category? Look for: official star rating (3/4/5 stars), hotel type (boutique, design, wellness, resort, conference); online review sites (Google, TripAdvisor); official hotel classification. Return the confirmed star rating and category, or 'Unknown' if not clearly stated." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Local Decision-Making Authority</h4>
            <CodeBlock code="Does this hotel have local management authority for F&B procurement, or is this controlled by foreign headquarters? Look for: hotel management team bios with Slovenia/Serbia location; independent hotel status; local ownership; or group structure with local F&B director. Return 'Local Authority' if independent or local management found, 'Group Controlled' if central headquarters appears to control decisions, or 'Unknown' if unclear." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Quality/Accreditation Signals (Tier 2)</h4>
            <CodeBlock code="Does this hotel have quality certifications or awards? Look for: Michelin recognition or recommendation; ISO certifications; design awards; published menus or culinary reputation; professional certifications; local tourism board awards. Return YES with specific certifications found, or NO if none evident." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Tableware Procurement Need</h4>
            <CodeBlock code="What evidence suggests this hotel may need professional tableware? Look for: mention of high-quality dining, gourmet restaurants, banquet facilities, events or conferences, multi-cuisine offerings, or recent property renovations. Return YES if purchasing need is likely based on hotel type/operations, or NO if unclear." />
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function CampaignsSequencesTab() {
  return (
    <>
      <ContentSection title="Four-Campaign Architecture" icon={<Zap className="w-5 h-5" />}>
        <p className="text-slate-600 mb-4">
          DukeGroup campaigns target hotels in Slovenia and Serbia, separated by country and buyer decision process (hotel leadership vs. F&B/procurement operations).
        </p>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-2">SI Campaign 1: Slovenia - Hotel Leadership Track</h3>
            <div className="space-y-2 text-slate-700 text-sm">
              <p><strong>Audience:</strong> Hotel Directors, General Managers with budget authority</p>
              <p><strong>Approach:</strong> Lead with hotel need validation, mention verified projects, offer discussion with Dusan</p>
              <p><strong>Messaging:</strong> Professional tableware for hotel renovations, F&B refresh, or new concepts</p>
              <p><strong>Target:</strong> 250 hotels (mathematical allocation)</p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-bold text-green-900 mb-2">SI Campaign 2: Slovenia - F&B/Procurement Track</h3>
            <div className="space-y-2 text-slate-700 text-sm">
              <p><strong>Audience:</strong> F&B Managers, Executive Chefs, Procurement specialists</p>
              <p><strong>Approach:</strong> Understand hotel's selection process, ask about timing, clarify local vs. group procurement</p>
              <p><strong>Messaging:</strong> Technical specifications, brand portfolio, quality standards, customization options</p>
              <p><strong>Target:</strong> 250 hotels (mathematical allocation)</p>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-bold text-purple-900 mb-2">SR Campaign 1: Serbia - Hotel Leadership Track</h3>
            <div className="space-y-2 text-slate-700 text-sm">
              <p><strong>Audience:</strong> Hotel Directors, General Managers with budget authority</p>
              <p><strong>Approach:</strong> Lead with hotel need validation, mention verified projects, offer discussion with Dusan</p>
              <p><strong>Messaging:</strong> Professional tableware for hotel renovations, F&B refresh, or new concepts</p>
              <p><strong>Target:</strong> 250 hotels (mathematical allocation)</p>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h3 className="font-bold text-amber-900 mb-2">SR Campaign 2: Serbia - F&B/Procurement Track</h3>
            <div className="space-y-2 text-slate-700 text-sm">
              <p><strong>Audience:</strong> F&B Managers, Executive Chefs, Procurement specialists</p>
              <p><strong>Approach:</strong> Understand hotel's selection process, ask about timing, clarify local vs. group procurement</p>
              <p><strong>Messaging:</strong> Technical specifications, brand portfolio, quality standards, customization options</p>
              <p><strong>Target:</strong> 250 hotels (mathematical allocation)</p>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Sequencing Rules" icon={<Mail className="w-5 h-5" />}>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Initial Sequence (3 touches maximum):</h4>
            <ul className="space-y-2 text-slate-700 text-sm">
              <ListItem><strong>Day 1:</strong> Initial outreach with verified hotel fact + need question</ListItem>
              <ListItem><strong>Day 5:</strong> Substantive follow-up with additional context or offer</ListItem>
              <ListItem><strong>Day 12:</strong> Final short message (option to proceed or continue nurture)</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Automation Stops When:</h4>
            <ul className="space-y-2 text-slate-700 text-sm">
              <ListItem>Positive reply received (hand to DukeGroup)</ListItem>
              <ListItem>Negative reply or opt-out (suppress)</ListItem>
              <ListItem>Out of office reply (resume after return date)</ListItem>
              <ListItem>Hard bounce (remove from future campaigns)</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Overlapping Contacts Rule:</h4>
            <p className="text-slate-700 text-sm mb-2">
              One contact = one active campaign. If contact replies positively, stop automated outreach across the hotel. Approach second contact only after:
            </p>
            <ul className="space-y-1 text-slate-700 text-sm list-disc list-inside">
              <li>Manual review of first response (min 10 business days)</li>
              <li>First sequence has ended</li>
              <li>Only after DukeGroup approves next approach</li>
            </ul>
          </div>
        </div>
      </ContentSection>

      <SequencesTab clientId="dukegroup" />

      <ContentSection title="Email Message Templates (Master Copy)" icon={<Mail className="w-5 h-5" />}>
        <p className="text-slate-600 text-sm mb-4">Master English templates below. Localize to Slovenian and Serbian before sending. Keep underlying claims, qualification criteria, and local purchasing questions consistent.</p>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-3">SI Campaign 1: Slovenia - Hotel Leadership Track</h3>
            <div className="space-y-2">
              <div>
                <p className="font-semibold text-blue-900 text-sm">Subject:</p>
                <p className="text-slate-700 text-sm font-mono">Tableware for [hotel]</p>
              </div>
              <div>
                <p className="font-semibold text-blue-900 text-sm">Body:</p>
                <p className="text-slate-700 text-sm font-mono whitespace-pre-wrap">Hello [name],

DukeGroup helps hotels select professional tableware. [Verified connection to the hotel.]

Are you planning to replenish or refresh equipment for your F&B operation in the coming months?

If this is relevant, we suggest a brief conversation with Dusan about your needs and a suitable selection. If a colleague manages this area, an introduction to the right person would be helpful.</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-bold text-green-900 mb-3">SI Campaign 2: Slovenia - F&B/Procurement Track</h3>
            <div className="space-y-2">
              <div>
                <p className="font-semibold text-green-900 text-sm">Subject:</p>
                <p className="text-slate-700 text-sm font-mono">Equipment selection for [hotel restaurant]</p>
              </div>
              <div>
                <p className="font-semibold text-green-900 text-sm">Body:</p>
                <p className="text-slate-700 text-sm font-mono whitespace-pre-wrap">Hello [name],

We would like to understand how [hotel] selects tableware and whether any replenishment is planned.

DukeGroup represents FIGGJO, SERAX and other brands for professional use.

Would a brief discussion of your needs be useful? Is selection managed locally or through group procurement?</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-bold text-purple-900 mb-3">SR Campaign 1: Serbia - Hotel Leadership Track</h3>
            <div className="space-y-2">
              <div>
                <p className="font-semibold text-purple-900 text-sm">Subject:</p>
                <p className="text-slate-700 text-sm font-mono">Tableware for [hotel]</p>
              </div>
              <div>
                <p className="font-semibold text-purple-900 text-sm">Body:</p>
                <p className="text-slate-700 text-sm font-mono whitespace-pre-wrap">Dear [name],

DukeGroup helps hotels select professional tableware. [Verified fact about the hotel.]

Are you planning to replenish or renew equipment for your hotel restaurant in the coming months?

If the topic is relevant, we suggest a short conversation with Dusan about your needs and suitable options. If a colleague handles this, we would appreciate the name of the responsible person.</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h3 className="font-bold text-amber-900 mb-3">SR Campaign 2: Serbia - F&B/Procurement Track</h3>
            <div className="space-y-2">
              <div>
                <p className="font-semibold text-amber-900 text-sm">Subject:</p>
                <p className="text-slate-700 text-sm font-mono">Equipment for [hotel restaurant]</p>
              </div>
              <div>
                <p className="font-semibold text-amber-900 text-sm">Body:</p>
                <p className="text-slate-700 text-sm font-mono whitespace-pre-wrap">Dear [name],

We would like to understand how [hotel] selects tableware and whether replenishment is planned.

DukeGroup represents several brands for professional use, including FIGGJO and SERAX.

Would a short conversation about your needs be useful? Do you manage selection and purchasing locally or through central procurement?</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mt-4">
            <p className="font-semibold text-red-900 mb-2">Template Requirements:</p>
            <ul className="list-disc list-inside space-y-1 text-red-800 text-sm">
              <li>Replace bracketed text with verified information only</li>
              <li>Clearly identify sender and add approved signature</li>
              <li>Include simple way to stop further contact (opt-out link)</li>
              <li>Localize to Slovenian (SI campaigns) or Serbian Latin (SR campaigns) before sending</li>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Suppression & Contact Management" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="font-semibold text-red-900 mb-2">Before First Import:</p>
            <p className="text-red-800 text-sm mb-3">Dusan supplies: existing customers, active conversations, open proposals, projects, refusals, and do-not-contact requests. INTELSOL reconciles with opt-out and bounced address records.</p>
            <p className="text-red-800 text-sm"><strong>Required fields:</strong> Property name, legal entity, domain, known contacts, email, group/buying unit, suppression reason, scope, date, expiry, and owner.</p>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-50 p-3 rounded border-l-4 border-slate-500">
              <h4 className="font-semibold text-slate-900 mb-1">Opt Out or Do Not Contact Request</h4>
              <p className="text-slate-700 text-sm"><strong>Scope:</strong> Single contact OR company/group if explicitly requested</p>
              <p className="text-slate-700 text-sm"><strong>Reactivation:</strong> Only after documented change of preference</p>
            </div>

            <div className="bg-slate-50 p-3 rounded border-l-4 border-slate-500">
              <h4 className="font-semibold text-slate-900 mb-1">Existing Customer or Active Project</h4>
              <p className="text-slate-700 text-sm"><strong>Scope:</strong> Agreed property, legal entity, or buying unit</p>
              <p className="text-slate-700 text-sm"><strong>Reactivation:</strong> Only with Dusan's approval and separate attribution rules</p>
            </div>

            <div className="bg-slate-50 p-3 rounded border-l-4 border-slate-500">
              <h4 className="font-semibold text-slate-900 mb-1">Hard Bounce or Invalid Address</h4>
              <p className="text-slate-700 text-sm"><strong>Scope:</strong> Immediately suppress specific address</p>
              <p className="text-slate-700 text-sm"><strong>Reactivation:</strong> Only after fresh verification of valid business contact</p>
            </div>

            <div className="bg-slate-50 p-3 rounded border-l-4 border-slate-500">
              <h4 className="font-semibold text-slate-900 mb-1">Not the Right Time</h4>
              <p className="text-slate-700 text-sm"><strong>Scope:</strong> Contact with agreed recontact date</p>
              <p className="text-slate-700 text-sm"><strong>Reactivation:</strong> On agreed date if no other suppression applies</p>
            </div>

            <div className="bg-slate-50 p-3 rounded border-l-4 border-slate-500">
              <h4 className="font-semibold text-slate-900 mb-1">Duplicate or Parallel Campaign</h4>
              <p className="text-slate-700 text-sm"><strong>Scope:</strong> One master record and one active sequence</p>
              <p className="text-slate-700 text-sm"><strong>Action:</strong> Merge history before continuing</p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-4">
            <p className="font-semibold text-blue-900 mb-2">Execution & Audit Trail:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
              <li>Normalize email addresses, domains, and legal names while retaining property relationships</li>
              <li>Check suppression on import AND immediately before every send</li>
              <li>Process replies and opt-outs continuously (deadline: 1 business day max)</li>
              <li>Block further sends immediately when suppression is detected</li>
              <li>Limit access to people who need data for agreed work</li>
            </ul>
          </div>

          <div className="bg-slate-100 p-3 rounded">
            <p className="text-slate-700 text-sm"><strong>Known Suppression Entries (From Dusan's Correspondence):</strong></p>
            <p className="text-slate-600 text-sm mt-2">• ISTRABENZ Turizem - Investigate related properties</p>
            <p className="text-slate-600 text-sm">• Hotel CUBO Ljubljana (associated with MRKULIC COMPANY d.o.o.) - Related to above</p>
            <p className="text-slate-600 text-sm italic">Note: This is NOT a complete confirmed list. Full suppression must be aligned with Dusan before launch.</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Opportunity Handoff & Qualification" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">Qualified Meeting Criteria (Mandatory):</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
              <li>Eligible hotel in Slovenia or Serbia</li>
              <li>Verified relevant local contact with decision-making authority</li>
              <li>Expressed interest in discussing tableware needs</li>
              <li>Confirmed meeting time with known next step</li>
              <li>At least initial use case captured and purchasing role identified</li>
            </ul>
            <p className="text-blue-800 text-sm mt-3"><strong>Important:</strong> "Send a catalogue" = information request, NOT qualified meeting. "Interesting next year" = nurture with agreed recontact date. Without local path to selection/procurement, meeting is not qualified yet.</p>
          </div>

          <div className="bg-slate-50 p-3 rounded border-l-4 border-slate-500">
            <h4 className="font-semibold text-slate-900 mb-2">Handoff Responsibility Stage-by-Stage:</h4>
            <div className="space-y-2 text-sm">
              <p><strong>Research & Activation (INTELSOL):</strong> Verify ICP, persona, evidence, suppression</p>
              <p><strong>Approval (DukeGroup):</strong> Approve priorities, exclusions, permitted claims</p>
              <p><strong>Positive Reply (INTELSOL):</strong> Stop sequence and qualify need</p>
              <p><strong>Support (DukeGroup):</strong> Answer technical and commercial questions</p>
              <p><strong>Meeting (INTELSOL):</strong> Agree time and prepare handoff notes</p>
              <p><strong>Meeting (DukeGroup):</strong> Dusan confirms attendance and leads presentation</p>
              <p><strong>Post-Meeting (INTELSOL):</strong> Update status and track agreed next step</p>
              <p><strong>Post-Meeting (DukeGroup):</strong> Quality assessment and next step within 2 business days</p>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="font-semibold text-green-900 mb-2">Required Handoff Record:</p>
            <p className="text-green-800 text-sm mb-3">Hotel name, country, legal entity, group, domain, buying unit ID. Contact name, title, business contact details, local remit. Source and verification date. Campaign and first touch. Reply summary. Needs and use case. Decision role. Local or central procurement. Timing and budget (or explicit unknown). Brand interest. Agreed next step. Meeting time and participants. Suppression check history.</p>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="font-semibold text-amber-900 mb-2">Proposed Service Levels:</p>
            <ul className="list-disc list-inside space-y-1 text-amber-800 text-sm">
              <li>INTELSOL acts on positive replies within 1 business day</li>
              <li>DukeGroup confirms acceptance or requests missing info within 1 business day</li>
              <li>Handoff notes ready at least 24 hours before meeting</li>
              <li>DukeGroup returns quality assessment and next step within 2 business days after meeting</li>
            </ul>
          </div>

          <div className="bg-slate-50 border-l-4 border-slate-500 p-4 rounded">
            <p className="font-semibold text-slate-900 mb-2">Opportunity Status Progression:</p>
            <p className="text-slate-700 text-sm font-mono">Research → Verified & Eligible → Active Campaign → Reply → Qualified → Meeting Booked → Meeting Held → Opportunity Accepted → Proposal → Order → Paid</p>
            <p className="text-slate-700 text-sm mt-2"><strong>Closing Statuses:</strong> Unsuitable, Suppressed, Not Interested, Later, Unreachable, Lost (with reason)</p>
            <p className="text-slate-700 text-sm mt-2"><strong>Important:</strong> Accepted opportunity = DukeGroup validated real need and defined next sales step. Booking alone does NOT create opportunity. Rescheduling is NOT a new meeting.</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">Opportunity Attribution Rules:</p>
            <p className="text-blue-800 text-sm mb-3"><strong>Proposed:</strong> Attribute an opportunity to INTELSOL only when ALL of the following are true:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
              <li>The new source is recorded in handoff documentation</li>
              <li>No prior active DukeGroup opportunity exists for this hotel/contact</li>
              <li>DukeGroup accepts the opportunity in writing</li>
            </ol>
            <p className="text-blue-800 text-sm mt-3"><strong>Critical Rules:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
              <li>Do NOT automatically attribute entire group or all future orders</li>
              <li>Define attribution window (time period for credit)</li>
              <li>Define handling of multiple properties within a group</li>
              <li>Define handling of repeat orders and partial payments</li>
              <li>Define dispute process if attribution is unclear</li>
            </ul>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="font-semibold text-green-900 mb-2">Operational Agreement - Contact Management:</p>
            <p className="text-green-800 text-sm mb-3">Before launch, INTELSOL and DukeGroup must confirm responsibilities for:</p>
            <ul className="list-disc list-inside space-y-1 text-green-800 text-sm">
              <li><strong>Contact sources:</strong> Who provides hotel/contact lists and verification data</li>
              <li><strong>Permitted channels:</strong> Email, phone, LinkedIn, or other channels by country</li>
              <li><strong>Recipient notices:</strong> What information must be disclosed in outreach</li>
              <li><strong>Retention:</strong> How long contact and engagement data is retained</li>
              <li><strong>Deletion:</strong> Process for removing contacts from active campaigns</li>
              <li><strong>Objection records:</strong> How opt-outs and do-not-contact requests are logged and honored</li>
            </ul>
            <p className="text-green-800 text-sm mt-3"><strong>Important:</strong> This operational agreement is NOT legal approval of any particular contact source or channel. Separate legal review may be required for GDPR compliance and local regulations.</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="KPIs & 90-Day Success Metrics" icon={<BarChart3 className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-slate-600 text-sm">These are proposed operating thresholds for the pilot, not guarantees. Report by country, campaign, first contact cohort, and buying unit. Always show absolute counts alongside percentages for small samples.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Database Quality</h4>
              <p className="text-blue-800 text-sm">Eligible records / manually reviewed records</p>
              <p className="text-blue-900 font-semibold text-sm mt-2">Target: At least 95%</p>
            </div>

            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Hard Bounce Rate</h4>
              <p className="text-blue-800 text-sm">Permanently rejected addresses / first delivery attempts</p>
              <p className="text-blue-900 font-semibold text-sm mt-2">Target: Below 2%</p>
            </div>

            <div className="bg-green-50 p-4 rounded border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Positive Reply Rate</h4>
              <p className="text-green-800 text-sm">Unique contacts expressing relevant interest / delivered first contacts</p>
              <p className="text-green-900 font-semibold text-sm mt-2">Target: 2-5%</p>
            </div>

            <div className="bg-green-50 p-4 rounded border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Qualified Meeting Rate</h4>
              <p className="text-green-800 text-sm">Unique qualified bookings / delivered first contacts</p>
              <p className="text-green-900 font-semibold text-sm mt-2">Target: 0.5-1.5%</p>
            </div>

            <div className="bg-purple-50 p-4 rounded border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">Attendance Rate</h4>
              <p className="text-purple-800 text-sm">Meetings held / booked meetings due to take place</p>
              <p className="text-purple-900 font-semibold text-sm mt-2">Target: At least 75%</p>
            </div>

            <div className="bg-purple-50 p-4 rounded border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">Opportunity Acceptance</h4>
              <p className="text-purple-800 text-sm">DukeGroup accepted opportunities / meetings held</p>
              <p className="text-purple-900 font-semibold text-sm mt-2">Target: At least 60%</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded border border-slate-200">
            <p className="font-semibold text-slate-900 mb-2">Conversion Funnel Illustration (for 1,000 delivered first contacts):</p>
            <div className="text-sm text-slate-700 space-y-1">
              <p>• Positive replies (2-5%): 20-50 replies</p>
              <p>• Qualified bookings (0.5-1.5%): 5-15 meetings</p>
              <p>• Meetings held (75% attendance): approximately 4-11 meetings</p>
              <p>• Opportunities accepted (60%): approximately 2-7 opportunities</p>
              <p className="text-slate-600 italic mt-2">These rates are unvalidated and illustrative only - not guaranteed to occur together.</p>
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="font-semibold text-amber-900 mb-2">Weekly Reporting Requirements:</p>
            <ul className="list-disc list-inside space-y-1 text-amber-800 text-sm">
              <li>Volume delivered per campaign</li>
              <li>Reply counts and reply quality assessment</li>
              <li>Meeting bookings held vs. scheduled</li>
              <li>Rejection reasons and patterns</li>
              <li>Concrete changes made based on feedback</li>
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">Important Notes:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
              <li>Sales cycles may outlast the 90-day pilot - keep tracking open cohorts</li>
              <li>DukeGroup records sales outcomes and cohorts (never invent pipeline value)</li>
              <li>Decisions to expand or adjust recorded in writing with Dusan</li>
            </ul>
          </div>
        </div>
      </ContentSection>
    </>
  );
}
