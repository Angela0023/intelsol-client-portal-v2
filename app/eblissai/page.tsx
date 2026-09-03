'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
import { ContentSection, CodeBlock, InfoCard, ListItem } from '../components/ContentSection';
import SequencesTab from '../components/SequencesTab';
import CampaignsTabGeneric from '../components/CampaignsTabGeneric';
import PerformanceTabDynamic from '../components/PerformanceTabDynamic';
import CampaignsTabDynamic from '../components/CampaignsTabDynamic';
import DocumentsTabGeneric from '../components/DocumentsTabGeneric';
import TasksTab from '../components/TasksTab';
import StatusBadge, { getClientStatus, setClientStatus, DEFAULT_STATUSES, type ClientStatus } from '../components/StatusBadge';
import {
  FileText,
  Target,
  Filter,
  Code,
  Zap,
  BarChart3,
  FolderOpen,
  CheckSquare,
  Users,
  Layers,
  TrendingUp,
  Building2,
} from 'lucide-react';

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

export default function EblissAIPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('eblissai', DEFAULT_STATUSES.eblissai));

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
    setClientStatus('eblissai', newStatus);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const newPath = tabId === 'overview' ? '/eblissai' : `/eblissai/${tabId}`;
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
            <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-sky-600">e</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-slate-900">eBlissAI</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
              </div>
              <p className="text-slate-600">AI-Native Autonomous IT Operations Platform</p>
            </div>
          </div>
          <a
            href="https://eblissai.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-sky-600 hover:underline inline-block"
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
        <div className="space-y-8">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'icp' && <ICPAndPersonasTab />}
          {activeTab === 'filters' && <FiltersTab />}
          {activeTab === 'prompts' && <PromptsTab />}
          {activeTab === 'campaigns-sequences' && <CampaignsSequencesTab />}
          {activeTab === 'performance' && (
            <>
              <PerformanceTabDynamic clientId="eblissai" />
              <CampaignsTabDynamic clientId="eblissai" />
            </>
          )}
          {activeTab === 'documents' && <DocumentsTabGeneric clientId="eblissai" />}
          {activeTab === 'tasks' && <TasksTab clientId="eblissai" />}
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
            <strong>eBlissAI</strong> is an AI Workforce solution that diagnoses and resolves endpoint IT issues directly using AI, reasoning through each problem firsthand rather than matching it against a pre-built fix. It's for Digital Workplace/EUC and IT Ops teams at large enterprises who need to close the gap between tools that flag problems and issues that are actually fixed - without adding headcount.
          </p>

          <div className="bg-sky-50 border-l-4 border-sky-500 p-4 rounded">
            <p className="font-semibold text-sky-900 mb-2">Target Customer Profile:</p>
            <p className="text-sky-800">
              Mature but reactive enterprise IT environments with 5,000+ endpoints (sweet spot is 10,000+/- employees) who are struggling to close L2 and L3 tickets. Not greenfield (too early for 2-3 month cycle) and not already running modern AI-ops stack (no gap to sell into). Sharpest fit already owns the problem in measurable form - ticket volume, MTTR - but hasn't automated it yet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Typical Deal Size" value="$200k-$300k ARR" />
            <InfoCard label="Sales Cycle" value="2-3 months" />
            <InfoCard label="Large Deals" value="$1M+ ARR (~1 year cycle)" />
            <InfoCard label="Target Endpoint Count" value="5,000+ endpoints" />
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-slate-900 mb-3">Customer Proof Points:</h4>
            <div className="space-y-3">
              <div className="bg-slate-50 border-l-4 border-slate-500 p-4 rounded">
                <p className="text-slate-700 italic mb-2">
                  "A lot of these tools can tell us what's wrong, but they're not giving us that easy button to go fix it. I'm really looking for how to fix, and then quickly turning that into a script that I could deploy across the environment."
                </p>
                <p className="text-sm text-slate-600">- SVP of End User Computing, Fortune 250 company</p>
              </div>
              <div className="bg-slate-50 border-l-4 border-slate-500 p-4 rounded">
                <p className="text-slate-700 italic mb-2">
                  "Maybe you put in 100 machines. You say, can you please investigate why all these computers are not taking this update? Then you take your lunch. While you take your lunch, this is running in the background, and it comes back and says: 25 running out of disk space, 5 were off, 3 with this issue, 2 with that."
                </p>
                <p className="text-sm text-slate-600">- Senior Technical Lead, global professional services company</p>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Product Value Proposition" icon={<Layers className="w-5 h-5" />}>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Why eBlissAI Over Alternatives:</h4>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-4">
              <p className="text-blue-800">
                Existing DEX/EUM/ITSM tools (Nexthink, Lakeside SysTrack, etc.) tell IT something's wrong; eBliss figures out what's wrong and fixes it, with little or no human intervention. eBliss ships with a proprietary Knowledge Graph and guardrails so autonomous execution is safe and accurate from day one, and lets the same admin team support meaningfully more end users without adding headcount - the same leverage shift tools like GitHub Copilot and Cursor drove for software engineers.
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Core Capabilities:</h4>
            <ul className="space-y-2">
              <ListItem type="check">Diagnoses and resolves issues directly using AI reasoning (not pre-built fix matching)</ListItem>
              <ListItem type="check">Autonomous L2/L3 ticket resolution with guardrails</ListItem>
              <ListItem type="check">Proprietary Knowledge Graph for safe, accurate execution from day one</ListItem>
              <ListItem type="check">Closes the gap between tools that flag problems and issues that are actually fixed</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Business Impact:</h4>
            <ul className="space-y-2">
              <ListItem type="check">Reduces MTTR (mean time to repair) for L2/L3 tickets</ListItem>
              <ListItem type="check">Eliminates backlogs of unresolved tickets flagged but not fixed by existing DEX tools</ListItem>
              <ListItem type="check">Supports more endpoints without adding headcount</ListItem>
              <ListItem type="check">Captures and retains operational knowledge within the system (reduces tribal knowledge loss)</ListItem>
            </ul>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="font-semibold text-amber-900 mb-2">Messaging Requirements:</p>
            <ul className="text-amber-800 text-sm space-y-1">
              <ListItem><strong>Use:</strong> "AI Workforce" (not "software" or "tool") - eBliss is trained and directed like a new hire</ListItem>
              <ListItem><strong>Use:</strong> "Diagnose / Resolve / Detect" framing for exec-facing content</ListItem>
              <ListItem><strong>Use:</strong> "Supervisory Agent" and "Static Agent" for automation-graduation concept</ListItem>
              <ListItem><strong>Autonomy ladder:</strong> supervised → semi-autonomous → fully autonomous → proactive autonomous</ListItem>
              <ListItem><strong>Avoid:</strong> "replace" language - position as leverage, not headcount reduction</ListItem>
              <ListItem><strong>Avoid:</strong> Personifying the AI by model name (e.g., "Claude") in customer-facing copy</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Two Targeting Tracks" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h4 className="font-semibold text-blue-900 mb-2">Track 1: Direct Enterprise</h4>
            <p className="text-blue-800 mb-3">
              IT leadership at Fortune 500 and global top-5000 companies
            </p>
            <ul className="text-blue-800 text-sm space-y-1">
              <ListItem>VP IT Operations / Head of IT Operations (Primary)</ListItem>
              <ListItem>Head of Digital Workplace / EUC (Secondary)</ListItem>
              <ListItem>CIO (Tertiary - co-sign/CC)</ListItem>
            </ul>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <h4 className="font-semibold text-green-900 mb-2">Track 2: GSIs (Global System Integrators)</h4>
            <p className="text-green-800 mb-3">
              Reached through partner & alliance managers and digital workplace practice leads - one signed partner opens an entire client portfolio
            </p>
            <ul className="text-green-800 text-sm space-y-1">
              <ListItem>Partner / Alliance Manager (owns vendor portfolio decisions)</ListItem>
              <ListItem>Digital Workplace Practice Lead (technical champion)</ListItem>
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
      <ContentSection title="Company-Level ICP" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Target Geography (Prioritized):</h4>

            <div className="mb-4">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-3">
                <p className="font-semibold text-green-900 mb-2">HIGHEST PRIORITY: North America</p>
                <p className="text-green-800">United States & Canada</p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="font-semibold text-blue-900 mb-2">SECONDARY PRIORITY: EMEA</p>
                <div className="text-blue-800">
                  <ul className="space-y-1">
                    <ListItem>DACH: Germany, Austria, Switzerland</ListItem>
                    <ListItem>Benelux: Netherlands, Belgium, Luxembourg</ListItem>
                    <ListItem>Nordics: Sweden, Norway, Denmark, Finland</ListItem>
                    <ListItem>UK & Ireland</ListItem>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Company Profile - Mature But Reactive IT Environments:</h4>

            <div className="bg-sky-50 border-l-4 border-sky-500 p-4 rounded mb-4">
              <p className="font-semibold text-sky-900 mb-2">Include:</p>
              <ul className="text-sky-800 text-sm space-y-1">
                <ListItem><strong>Company Size:</strong> 5,000+ endpoints (sweet spot is 10,000+/- employees). Enterprises can be divided into 2,500-5,000 employees and 5,000+ employees (different org structures and titles)</ListItem>
                <ListItem><strong>Tech Stack:</strong> DEX tools (Nexthink, Lakeside SysTrack), UEM (Microsoft Intune, Jamf, Ivanti, Tanium), ITSM (ServiceNow), possibly Azure Virtual Desktop, Windows 365, or Nerdio</ListItem>
                <ListItem>Budget and process maturity already in place</ListItem>
                <ListItem>Measurable problem: high L2/L3 ticket volume, MTTR data available</ListItem>
              </ul>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="font-semibold text-red-900 mb-2">Exclude - Bad-Fit Profiles:</p>
              <ul className="text-red-800 text-sm space-y-1">
                <ListItem type="cross"><strong>Greenfield:</strong> No existing tooling - too early for 2-3 month cycle</ListItem>
                <ListItem type="cross"><strong>Already automated:</strong> Modern AI-ops stack already in place (no gap to sell into)</ListItem>
                <ListItem type="cross"><strong>Build-not-buy culture:</strong> Netflix, Google/Alphabet, Bank of America, IBM, Lockheed Martin</ListItem>
                <ListItem type="cross"><strong>Direct competitors:</strong> Nanoheal, Tanium, Nexthink, Lakeside, ControlUp, Console, Ivanti, Riverbed Aternity</ListItem>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Industry Fit - Top Priority Sectors:</h4>
            <div className="space-y-3 mb-4">
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="font-semibold text-green-900 text-sm mb-1">1. Large Technology / SaaS / Infrastructure</p>
                <p className="text-green-800 text-sm">Cloud-native culture, high endpoint counts, tech-forward adoption patterns</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="font-semibold text-green-900 text-sm mb-1">2. Multi-Location Retail / Restaurant / Hospitality</p>
                <p className="text-green-800 text-sm">Large distributed device fleets across locations (POS systems, back-office endpoints)</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="font-semibold text-green-900 text-sm mb-1">3. Airlines / Transportation</p>
                <p className="text-green-800 text-sm">Massive distributed endpoint footprint, high uptime requirements, resilience focus</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="font-semibold text-green-900 text-sm mb-1">4. Asset Management / Alternative Investment</p>
                <p className="text-green-800 text-sm">RIAs, PE, hedge funds - SEC-regulated (lighter than prudential banking regulation), aggressive early adopters, 5,000+ endpoint floor</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="font-semibold text-green-900 text-sm mb-1">5. Mid-Size / Regional Insurance Carriers</p>
                <p className="text-green-800 text-sm">Lighter regulatory oversight than banking, flatter approval chains, compliance-conscious</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Secondary / Opportunistic Industries:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded p-3">
                  <p className="font-semibold text-slate-900 text-sm mb-1">Consulting / SI Firms</p>
                  <p className="text-slate-600 text-sm">Deloitte, KPMG, PwC, Cognizant - both as direct prospects and channel partners</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded p-3">
                  <p className="font-semibold text-slate-900 text-sm mb-1">Managed Service Providers</p>
                  <p className="text-slate-600 text-sm">MSPs for IT (North America) or ICT (European) services</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded p-3">
                  <p className="font-semibold text-slate-900 text-sm mb-1">Large Telecom / Cable</p>
                  <p className="text-slate-600 text-sm">Demoted from primary to secondary tier - large distributed workforce</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded p-3">
                  <p className="font-semibold text-slate-900 text-sm mb-1">Prudentially-Regulated Banks</p>
                  <p className="text-slate-600 text-sm">BofA, JPMC, Wells, regional banks - opportunistic only (SR 11-7 MRM friction real)</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Buying Signals & Strain Indicators:</h4>
            <ul className="space-y-2">
              <ListItem><strong>High L2/L3 support hiring volume</strong> - Multiple open Help Desk / IT Support / Digital Workplace positions</ListItem>
              <ListItem><strong>Fast growth outpacing IT ops</strong> - Headcount or location expansion faster than current IT process can absorb</ListItem>
              <ListItem><strong>Existing Anthropic/Claude relationship</strong> - Natural extension sale opportunity</ListItem>
              <ListItem><strong>Patch quality complaints</strong> - Patch Tuesday/CVE compliance struggles, tools flag issues but don't fix them</ListItem>
              <ListItem><strong>Recent major outage or high-profile incident</strong> - Status quo became visibly unacceptable to leadership</ListItem>
              <ListItem><strong>New CIO/VP IT Ops/Digital Workplace leader</strong> - Within last 6-12 months, looking for visible wins</ListItem>
              <ListItem><strong>Headcount/hiring freeze with growing endpoint count</strong> - Math stops working, something has to give</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Buyer Personas - Detailed Profiles" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-6">
          {/* PRIMARY PERSONA */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
            <div className="mb-4">
              <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold mb-2">PRIMARY - HIGHEST PRIORITY</span>
              <h4 className="font-semibold text-blue-900 text-lg mb-2">EVP/SVP of EUC / Digital Workplace</h4>
              <p className="text-blue-800 mb-3">
                Default entry point for most eBliss deals. Owns the end-user device fleet and support experience. Measured on endpoint cost, support quality, and compliance - not aggregate infrastructure. Pilot execution happens here even when sponsored from above.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="font-semibold text-blue-900 mb-2">Top Priorities (what they're measured on):</p>
                <ul className="text-blue-800 text-sm space-y-1">
                  <ListItem><strong>Priority 1: Cost per endpoint / cost per ticket</strong> - The #1 metric reported upward. KPIs: cost per managed device, cost per resolved ticket, headcount ratio (devices per tech). eBliss fit: STRONG - autonomous L2 resolution attacks cost-per-ticket directly.</ListItem>
                  <ListItem><strong>Priority 2: End-user experience / DEX</strong> - Prove IT isn't a productivity drag. KPIs: MTTR, first-contact resolution, employee CSAT/NPS, digital friction scores. eBliss fit: STRONG - faster autonomous resolution improves MTTR and employee sentiment.</ListItem>
                  <ListItem><strong>Priority 3: Patch/vulnerability compliance</strong> - Patch Tuesday and CVE response time. KPIs: % devices patched within SLA, CVE MTTR, audit findings. eBliss fit: STRONG - extends into patch deployment/verification, closes "tools flag but don't fix" gap.</ListItem>
                  <ListItem><strong>Priority 4: Large-scale transformations</strong> - AVD/Windows 365 migrations, OS/hardware refresh. KPIs: migration completion %, on-time delivery, post-migration incident volume. eBliss fit: STRONG when applicable - absorbs ticket-volume spike during cutover without surge headcount.</ListItem>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-blue-900 mb-2">Messaging/Approach Tips:</p>
                <ul className="text-blue-800 text-sm space-y-1">
                  <ListItem><strong>Lead with Priority 1</strong> (cost per ticket) - broadest, safest opener</ListItem>
                  <ListItem><strong>Priority 3 (Patch/CVE)</strong> is strongest differentiated claim - use in second touch, directly answers "tools tell me what's wrong but not how to fix it" pain</ListItem>
                  <ListItem><strong>Priority 2 (DEX)</strong> works as second-touch or supporting color - emotional/political layer on top of financial case</ListItem>
                  <ListItem><strong>Priority 4 (migration)</strong> is conditional - only surface once confirmed via discovery (don't lead with it)</ListItem>
                  <ListItem><strong>Suggested 3-touch cadence:</strong> Touch 1 = cost per ticket. Touch 2 = Patch Tuesday/CVE story. Touch 3 = DEX + specific ask (pilot conversation).</ListItem>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-blue-900 mb-2">Friction Points (stakeholders who can slow the deal):</p>
                <ul className="text-blue-800 text-sm space-y-1">
                  <ListItem>CISO/Security - deep questions on audit logging, approval workflows, rollback (longest pole at regulated accounts)</ListItem>
                  <ListItem>Network/Infrastructure - territorial about endpoint connectivity</ListItem>
                  <ListItem>Service Desk leadership - can feel threatened if framed as "replacing" vs. "freeing them for higher-value work"</ListItem>
                  <ListItem>Finance/Procurement - needs hard before/after pilot numbers, not vendor case studies</ListItem>
                </ul>
              </div>
            </div>
          </div>

          {/* SECONDARY PERSONA 1 */}
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded">
            <div className="mb-4">
              <span className="inline-block bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold mb-2">SECONDARY</span>
              <h4 className="font-semibold text-green-900 text-lg mb-2">EVP/SVP of Infrastructure & Operations (I&O)</h4>
              <p className="text-green-800 mb-3">
                Owns full IT operating budget and entire ticket funnel - infrastructure, network, EUC, Service Desk all roll up here. Measured on aggregate performance across the whole estate. Reports to CIO and often to board.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="font-semibold text-green-900 mb-2">Top Priorities:</p>
                <ul className="text-green-800 text-sm space-y-1">
                  <ListItem><strong>Priority 1: Cost per managed asset / headcount-scaling ratio</strong> - Total IT opex as % of revenue, cost per managed asset (blended), growth vs. headcount trend. eBliss fit: STRONG - frame in aggregate terms, "scale without linear headcount growth."</ListItem>
                  <ListItem><strong>Priority 2: Audit/compliance findings (ITGC/PCI-DSS)</strong> - Personally on hook for audit outcomes. KPIs: # findings, time-to-remediate, clean cycles. eBliss fit: STRONG - logged, authorized action generates audit trail as byproduct.</ListItem>
                  <ListItem><strong>Priority 3: Aggregate incident/ticket volume and MTTR</strong> - Owns full funnel. KPIs: total tickets, blended MTTR, first-contact resolution. eBliss fit: STRONG - autonomous resolution shortens funnel itself.</ListItem>
                  <ListItem><strong>Priority 4: Uptime/reliability across estate</strong> - SLA adherence spanning network, infra, endpoints. KPIs: uptime %, SLA breaches, aggregate MTTR. eBliss fit: MODERATE-STRONG - reduces endpoint incident duration.</ListItem>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-green-900 mb-2">Messaging Tips:</p>
                <ul className="text-green-800 text-sm space-y-1">
                  <ListItem><strong>Lead with Priority 1</strong> (cost/headcount-scaling) - safest, broadest opener</ListItem>
                  <ListItem><strong>Reserve Priority 2</strong> (audit/compliance) as strongest follow-up IF regulated industry</ListItem>
                  <ListItem><strong>Use aggregate language</strong> - say "total IT operating cost" not "ticket resolution cost"</ListItem>
                  <ListItem><strong>Don't lead with uptime/reliability</strong> - shared metric, partial credit only</ListItem>
                  <ListItem><strong>Suggested cadence:</strong> Touch 1 = cost/headcount-scaling. Touch 2 = audit/compliance (if regulated) or ticket/MTTR. Touch 3 = uptime + specific ask.</ListItem>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-green-900 mb-2">Friction Points:</p>
                <ul className="text-green-800 text-sm space-y-1">
                  <ListItem>CISO/Security - wider blast radius than EUC (servers not just endpoints), heavier review</ListItem>
                  <ListItem>CTO/Platform Engineering - peer branch under CIO, territorial friction</ListItem>
                  <ListItem>Network Operations - connectivity friction pattern</ListItem>
                  <ListItem>Finance/Procurement - competes with cloud modernization budget, needs sharper ROI</ListItem>
                  <ListItem>Digital Workplace/EUC - adoption risk if tool feels imposed from above</ListItem>
                </ul>
              </div>
            </div>
          </div>

          {/* SECONDARY PERSONA 2 */}
          <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded">
            <div className="mb-4">
              <span className="inline-block bg-purple-600 text-white px-3 py-1 rounded text-xs font-semibold mb-2">SECONDARY - CONDITIONAL</span>
              <h4 className="font-semibold text-purple-900 text-lg mb-2">CTO / Chief AI Officer (CAIO)</h4>
              <p className="text-purple-800 mb-3">
                Owns Platform Engineering and Cloud Ops - day-to-day org doesn't touch eBliss's endpoint scope. Relevance is as sponsor of top-down AI/transformation mandate only, not operational evaluator. Engage ONLY when confirmed signal of active mandate exists. NOT a persona for scaled always-on outbound.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="font-semibold text-purple-900 mb-2">Top Priorities:</p>
                <ul className="text-purple-800 text-sm space-y-1">
                  <ListItem><strong>Priority 1: Board/CEO-visible AI transformation progress</strong> - Named initiative with board cadence. KPIs: # AI use cases in production, adoption metrics, board narrative. eBliss fit: STRONG as proof point - concrete "AI actually working" example.</ListItem>
                  <ListItem><strong>Priority 2: Speed of AI pilot-to-production conversion</strong> - Measured on converting pilots to scaled deployments. KPIs: conversion rate, time-to-scale. eBliss fit: STRONG - clean, fast pilot-to-production path.</ListItem>
                  <ListItem><strong>Priority 3: Responsible AI governance/risk framework</strong> - Owns model risk, audit trail, explainability. KPIs: framework completeness, compliance sign-off rate, incident-free track. eBliss fit: STRONG - logged, authorized action trail is governance asset.</ListItem>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-purple-900 mb-2">Messaging Tips:</p>
                <ul className="text-purple-800 text-sm space-y-1">
                  <ListItem><strong>Don't cold-outreach on fixed cadence</strong> - only engage with specific confirmed AI mandate signal</ListItem>
                  <ListItem><strong>Lead with Priority 2</strong> (pilot-to-production speed) - most concrete, avoids generic "AI is important" pitch</ListItem>
                  <ListItem><strong>Use Priority 1</strong> (board progress) as framing/context, not opening claim</ListItem>
                  <ListItem><strong>Hold Priority 3</strong> (governance) for second touch - can read as friction on cold first touch</ListItem>
                  <ListItem><strong>NEVER position eBliss as THE AI transformation story</strong> - position as one concrete proof point inside larger narrative</ListItem>
                  <ListItem><strong>Make clear:</strong> Pilot execution happens with Digital Workplace/EUC - this exec is sponsor/opener, not implementer</ListItem>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-purple-900 mb-2">Friction Points:</p>
                <ul className="text-purple-800 text-sm space-y-1">
                  <ListItem>CIO - if more business-facing, tension over who "owns" AI narrative; engage without CIO awareness risks political misstep</ListItem>
                  <ListItem>CISO/Legal - AI governance jointly owned, expect deferred risk/compliance sign-off</ListItem>
                  <ListItem>Digital Workplace/EUC - mandate-from-above friction if team feels tool imposed vs. chosen</ListItem>
                  <ListItem>Finance/Board - if earlier AI investments haven't shown returns, real skepticism to overcome</ListItem>
                </ul>
              </div>
            </div>
          </div>

          {/* TERTIARY PERSONA */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded">
            <div className="mb-4">
              <span className="inline-block bg-amber-600 text-white px-3 py-1 rounded text-xs font-semibold mb-2">TERTIARY - CONDITIONAL</span>
              <h4 className="font-semibold text-amber-900 text-lg mb-2">VP/Director of Service Desk / Incident Management</h4>
              <p className="text-amber-800 mb-3">
                Tertiary, conditional persona - only applies when L2 resolution work sits in Service Desk rather than directly under Digital Workplace/EUC. Owns ticket intake, triage, escalation, and major-incident response. BEFORE targeting, confirm relevance: "Is L2 absorbed into Service Desk or Digital Workplace/EUC?" If EUC, target EUC instead.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="font-semibold text-amber-900 mb-2">Top Priorities:</p>
                <ul className="text-amber-800 text-sm space-y-1">
                  <ListItem><strong>Priority 1: Ticket throughput and SLA adherence</strong> - Core operational metric. KPIs: tickets per tech, queue wait time, SLA compliance %. eBliss fit: STRONG - removes tickets from funnel before consuming queue time.</ListItem>
                  <ListItem><strong>Priority 2: First-contact resolution / escalation rate</strong> - Measured on FCR vs. escalation to L2/L3. KPIs: FCR rate, escalation rate. eBliss fit: STRONG - raises "first-contact" bar via autonomous resolution.</ListItem>
                  <ListItem><strong>Priority 3: Major incident response time</strong> - Personally on hook for P1/P2 MTTR. KPIs: time-to-detect, time-to-page, MTTR. eBliss fit: MODERATE - speeds endpoint-related resolution, but major incidents involve broader coordination.</ListItem>
                  <ListItem><strong>Priority 4: Staffing/scheduling efficiency</strong> - Agent utilization and shift-staffing scalability. KPIs: utilization rate, tickets per agent per shift, overtime costs. eBliss fit: STRONG - absorbs volume without additional shift coverage.</ListItem>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-amber-900 mb-2">Messaging Tips:</p>
                <ul className="text-amber-800 text-sm space-y-1">
                  <ListItem><strong>Qualify first:</strong> Confirm L2 sits in Service Desk before targeting this persona</ListItem>
                  <ListItem><strong>Lead with Priority 1</strong> (throughput/SLA) - broadest, most universally reported</ListItem>
                  <ListItem><strong>Priority 2 (FCR/escalation)</strong> is strong second-touch - personal to this leader's performance</ListItem>
                  <ListItem><strong>Don't lead with Priority 3</strong> (major incident) - narrower scope, partial eBliss fit</ListItem>
                  <ListItem><strong>Priority 4 (staffing)</strong> pairs well with Priority 1 - same "do more without adding headcount" story</ListItem>
                  <ListItem><strong>Suggested cadence:</strong> Touch 1 = throughput/SLA. Touch 2 = FCR. Touch 3 = staffing efficiency + specific ask.</ListItem>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-amber-900 mb-2">Friction Points:</p>
                <ul className="text-amber-800 text-sm space-y-1">
                  <ListItem>Digital Workplace/EUC - potential territorial tension if Service Desk champions tool touching endpoint remediation</ListItem>
                  <ListItem>CISO/Security - same autonomous-action scrutiny, audit logging and approval workflows examined</ListItem>
                  <ListItem>ITSM platform/tooling team - owns ServiceNow config, may need involvement for integration</ListItem>
                  <ListItem>I&O (parent org) - Service Desk reports through I&O, may need tacit sign-off even if Service Desk champions</ListItem>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Buyer Personas - GSI Track" icon={<Building2 className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
            <h4 className="font-semibold text-purple-900 mb-2">Partner / Alliance Manager</h4>
            <p className="text-purple-800 mb-3">
              Owns vendor portfolio decisions at the GSI. One signed partner opens an entire client portfolio.
            </p>
            <div className="text-purple-800 text-sm">
              <p className="font-semibold mb-1">Target GSIs (examples):</p>
              <ul className="space-y-1">
                <ListItem>Accenture, Capgemini, TCS, DXC</ListItem>
                <ListItem>Any GSI with a digital workplace practice</ListItem>
              </ul>
            </div>
          </div>

          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
            <h4 className="font-semibold text-indigo-900 mb-2">Digital Workplace Practice Lead</h4>
            <p className="text-indigo-800">
              Technical champion within the GSI. Understands endpoint automation value and can evangelize internally across GSI client engagements.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="font-semibold text-red-900 mb-2">EXCLUDE - Active Relationships / Do Not Contact:</p>
            <ul className="text-red-800 text-sm space-y-1">
              <ListItem type="cross"><strong>Direct Customer:</strong> FiServ</ListItem>
              <ListItem type="cross"><strong>GSIs with Active Relationships:</strong> Accenture, CapGemini, Coforge, HCL, InfoSys, LTM, Tata Consultant Services (TCS), Tech Mahindra, Wipro</ListItem>
            </ul>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mt-4">
            <p className="font-semibold text-amber-900 mb-2">GSI Strategy Note:</p>
            <p className="text-amber-800 text-sm">
              GSI partnerships are high-leverage: one signed partner relationship can open access to dozens or hundreds of enterprise clients already engaged with that GSI for IT transformation projects. Current active relationships should be managed directly, not through cold outbound.
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
          Companies are prioritized by <strong>signal strength</strong>, not just firmographics. A company matching multiple signal categories simultaneously (e.g., runs legacy ITSM stack AND is actively hiring L1 support) is the highest-priority target.
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Firmographic Filters:</h4>
            <ul className="space-y-2">
              <ListItem><strong>Company Size:</strong> Fortune 500 and global top-5000 companies</ListItem>
              <ListItem><strong>Geography:</strong> US, DACH (Germany, Austria, Switzerland), Benelux (Netherlands, Belgium, Luxembourg), Nordics (Sweden, Norway, Denmark, Finland)</ListItem>
              <ListItem><strong>Industries:</strong> Financial services/insurance, healthcare, multi-location retail, technology/telecom</ListItem>
              <ListItem><strong>Employee Count:</strong> Large enterprises (typically 1,000+ employees for distributed device fleet)</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Signal Category 1: Technographic (Static)</h4>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="font-semibold text-blue-900 mb-2">Company already runs:</p>
              <div className="text-blue-800 text-sm space-y-2">
                <div>
                  <p className="font-semibold mb-1">DEX / Endpoint Monitoring:</p>
                  <ul className="space-y-1">
                    <ListItem>Nexthink</ListItem>
                    <ListItem>Lakeside SysTrack</ListItem>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-1">UEM (Unified Endpoint Management):</p>
                  <ul className="space-y-1">
                    <ListItem>Microsoft Intune</ListItem>
                    <ListItem>Jamf</ListItem>
                    <ListItem>Ivanti</ListItem>
                    <ListItem>Tanium</ListItem>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-1">ITSM (IT Service Management):</p>
                  <ul className="space-y-1">
                    <ListItem>ServiceNow (ITSM/ITOM - but without AI-Ops layer)</ListItem>
                    <ListItem>BMC Helix</ListItem>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-1">Virtual Desktop / Cloud PC:</p>
                  <ul className="space-y-1">
                    <ListItem>Azure Virtual Desktop</ListItem>
                    <ListItem>Windows 365</ListItem>
                    <ListItem>Nerdio</ListItem>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-1">Other Endpoint Management:</p>
                  <ul className="space-y-1">
                    <ListItem>1E</ListItem>
                  </ul>
                </div>
              </div>
              <p className="text-blue-800 text-sm mt-3 italic">
                Why it matters: Mature but still reactive IT ops - has budget and process, but not yet autonomous. Available at no extra cost via standard technographic filters in Apollo/Clay.
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Signal Category 2: Buying Intent (Behavioral)</h4>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="font-semibold text-green-900 mb-2">People at company actively researching:</p>
              <ul className="text-green-800 text-sm space-y-1">
                <ListItem>ServiceNow, Tanium, Nexthink, BMC Helix, Ivanti, Lakeside SysTrack, 1E</ListItem>
                <ListItem>AI-ops, autonomous IT operations, endpoint automation</ListItem>
                <ListItem>ITSM automation, self-healing IT</ListItem>
              </ul>
              <p className="text-green-800 text-sm mt-2 italic">
                Why it matters: Behavioral, in-market signal. Available within existing stack (Apollo/Clay). Dedicated intent platforms (Bombora, 6sense) excluded due to cost ($10k-$100k+/year).
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Signal Category 3: Hiring (Pain Indicator)</h4>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
              <p className="font-semibold text-amber-900 mb-2">Job postings for:</p>
              <ul className="text-amber-800 text-sm space-y-1">
                <ListItem>Help Desk Technician (high volume)</ListItem>
                <ListItem>IT Support Specialist</ListItem>
                <ListItem>L1/L2 Support (multiple open roles)</ListItem>
                <ListItem>IT Operations Manager</ListItem>
                <ListItem>Digital Employee Experience Lead</ListItem>
              </ul>
              <p className="text-amber-800 text-sm mt-2 italic">
                Why it matters: High support hiring volume = high ticket load = the exact cost center eBlissAI automates away. Available at no extra cost in Apollo/Clay.
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Signal Category 4: Growth (Urgency Indicator)</h4>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
              <p className="font-semibold text-purple-900 mb-2">Company is:</p>
              <ul className="text-purple-800 text-sm space-y-1">
                <ListItem>Scaling headcount rapidly</ListItem>
                <ListItem>Opening new offices/locations</ListItem>
                <ListItem>Geographic expansion</ListItem>
              </ul>
              <p className="text-purple-800 text-sm mt-2 italic">
                Why it matters: More endpoints, faster than existing IT ops process can absorb - creates urgency to automate before support costs spiral.
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Signal Category 5: Event-Based (Optional Layer)</h4>
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
              <p className="font-semibold text-indigo-900 mb-2">Recent events:</p>
              <ul className="text-indigo-800 text-sm space-y-1">
                <ListItem>Funding round or M&A in last 3-6 months</ListItem>
                <ListItem>New CIO appointed in last 3-6 months</ListItem>
                <ListItem>New VP IT Operations in last 3-6 months</ListItem>
              </ul>
              <p className="text-indigo-800 text-sm mt-2 italic">
                Why it matters: New budget or new leadership typically re-evaluates existing tooling in the first 100 days. Optional enhancement layer.
              </p>
            </div>
          </div>

          <div className="bg-sky-50 border-l-4 border-sky-500 p-4 rounded">
            <p className="font-semibold text-sky-900 mb-2">Compounding Priority:</p>
            <p className="text-sky-800">
              Accounts matching 2+ signal categories at once are the sharpest targets. Example: Company already running ServiceNow (Signal 1) AND currently hiring multiple L1/L2 support roles (Signal 3) shows both budget/maturity and acute, current pain.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Exclusion Filters:</h4>
            <ul className="space-y-2">
              <ListItem type="cross">Greenfield companies (no existing ITSM tooling - too early for 2-3 month sales cycle)</ListItem>
              <ListItem type="cross">Companies already running modern AI-ops stack (Nexthink with full automation, etc. - no gap to sell into)</ListItem>
              <ListItem type="cross">Small/mid-market companies (below Fortune 5000)</ListItem>
              <ListItem type="cross">Direct competitors (if applicable)</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Contact Data Requirements:</h4>
            <ul className="space-y-2">
              <ListItem><strong>Job Titles (Direct Enterprise):</strong> VP IT Operations, Head of IT Operations, Head of Digital Workplace, EUC Lead, CIO (tertiary)</ListItem>
              <ListItem><strong>Job Titles (GSI):</strong> Partner Manager, Alliance Manager, Digital Workplace Practice Lead</ListItem>
              <ListItem><strong>Email Required:</strong> Yes (business email preferred)</ListItem>
              <ListItem><strong>LinkedIn:</strong> Optional but helpful for verification</ListItem>
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
      <ContentSection title="Technographic & Stack Signals" icon={<Code className="w-5 h-5" />}>
        <p className="text-slate-600 mb-4">
          Identify companies with mature IT ops tooling that signals budget and process maturity, but lack full automation.
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Technographic Signal Check</h4>
            <CodeBlock code={`Does this company use ServiceNow, Tanium, Nexthink, BMC Helix, Ivanti, Lakeside SysTrack, or 1E for IT service management or endpoint monitoring?

Look for technology stack mentions on their website, job postings, or press releases.

Return YES if any of these tools are confirmed, NO if not found.`} />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">AI-Ops Gap Signal</h4>
            <CodeBlock code={`Check if this company has implemented AI-powered IT operations automation or self-healing endpoint capabilities.

Look for mentions of autonomous IT ops, AI-driven support, or predictive resolution in their technology stack.

Return YES if they already have AI-ops automation (no gap), NO if they are still using traditional/reactive ITSM (gap exists).`} />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Hiring & Pain Signals" icon={<Users className="w-5 h-5" />}>
        <p className="text-slate-600 mb-4">
          High support hiring volume indicates acute ticket load - the exact cost center eBlissAI automates.
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">L1/L2 Support Hiring Volume Signal</h4>
            <CodeBlock code={`Search this company's job board or careers page for IT support hiring.

Count open positions for:
- Help Desk Technician
- IT Support Specialist
- L1 Support
- L2 Support
- Service Desk Analyst

Return the count:
- If 3+ positions open = HIGH PRIORITY signal
- If 1-2 positions = MEDIUM signal
- If 0 positions = NO signal`} />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">IT Operations Leadership Hiring Signal</h4>
            <CodeBlock code={`Check if this company is hiring for IT Operations Manager, VP IT Operations, Head of Digital Workplace, or EUC Lead positions.

Return YES if these leadership roles are open (suggests organizational strain or expansion), NO if not.`} />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Growth & Event-Based Signals" icon={<TrendingUp className="w-5 h-5" />}>
        <p className="text-slate-600 mb-4">
          Expansion and leadership changes create urgency to automate before support costs spiral or new budget opens.
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Growth/Expansion Signal</h4>
            <CodeBlock code={`Look for recent announcements about this company opening new offices, expanding to new locations, or significant headcount growth in the last 6-12 months.

Check:
- Press releases
- LinkedIn company updates
- News articles

Return YES if clear growth/expansion signals found, NO if not.`} />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">New Leadership Signal (Event-Based)</h4>
            <CodeBlock code={`Search for recent leadership changes at this company.

Check if they have a new CIO, VP IT Operations, or Head of Digital Workplace appointed in the last 3-6 months.

Look at:
- LinkedIn
- Press releases
- Company announcements

Return YES with name and date if found, NO if not.`} />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Company Profile Verification" icon={<Building2 className="w-5 h-5" />}>
        <p className="text-slate-600 mb-4">
          Verify the company matches enterprise scale and target industry profile.
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Distributed Workforce/Fleet Size Signal</h4>
            <CodeBlock code={`Analyze this company's structure to estimate endpoint fleet size.

Look for:
- Number of locations
- Branch networks
- Retail stores
- Employee count
- Remote workforce mentions

Industries like financial services (branches), healthcare (facilities), retail (stores) typically indicate large device fleets.

Return estimated fleet size category:
- LARGE (10,000+ endpoints)
- MEDIUM (1,000-10,000)
- SMALL (under 1,000)
- UNKNOWN`} />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Industry Fit Verification</h4>
            <CodeBlock code={`Confirm this company's primary industry.

Is it one of the high-fit sectors:
- Financial Services
- Insurance
- Healthcare
- Multi-Location Retail
- Technology
- Telecom

Return the industry category if it matches high-fit sectors, or return OTHER if it does not match.`} />
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function CampaignsSequencesTab() {
  return (
    <>
      <SequencesTab clientId="eblissai" />
      <div className="mt-8">
        <CampaignsTabGeneric />
      </div>
    </>
  );
}
