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
            <h4 className="font-semibold text-slate-900 mb-1">Pilot Approach</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700 text-sm">
              <li>Days 1-14: Verify hotel list quality + test first 20 records per campaign + small launch batch (25-50 per campaign)</li>
              <li>Days 15-30: Analyze reply quality + refine targeting + expand volume</li>
              <li>Days 31-60: Reallocate capacity based on meeting quality across campaigns</li>
              <li>Days 61-90: Review accepted opportunities and decide next phase</li>
            </ul>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function ICPAndPersonasTab() {
  return (
    <>
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
        <p className="text-slate-600 mb-4">
          Evidence that a hotel may need professional tableware:
        </p>

        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-1">TIER 1: Hotel Renovation or Refresh</h4>
            <p className="text-slate-700">News, website updates, or LinkedIn posts about F&B refresh, restaurant renovation, or complete property update</p>
          </div>

          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-1">TIER 1: New Property Opening or Expansion</h4>
            <p className="text-slate-700">New hotel opening, new restaurant/bar concept, or banquet space expansion at existing property</p>
          </div>

          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-1">TIER 1: Management or Ownership Change</h4>
            <p className="text-slate-700">New hotel director, new F&B manager, new owner (often triggers operational upgrades including equipment)</p>
          </div>

          <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
            <h4 className="font-semibold text-green-900 mb-1">TIER 2: Events/Banquet Expansion</h4>
            <p className="text-slate-700">Hotel announcing new event spaces, wedding venues, or conference room expansion</p>
          </div>

          <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
            <h4 className="font-semibold text-green-900 mb-1">TIER 2: Recent Accreditation or Award</h4>
            <p className="text-slate-700">Michelin recognition, ISO certifications, or design/quality awards for F&B operations</p>
          </div>

          <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-500">
            <h4 className="font-semibold text-amber-900 mb-1">TIER 3: Seasonal High Demand</h4>
            <p className="text-slate-700">Summer season for mountain/ski resorts, conference season, local event patterns that trigger replacements</p>
          </div>
        </div>
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
    </>
  );
}
