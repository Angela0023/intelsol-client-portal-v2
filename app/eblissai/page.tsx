'use client';

import { useState } from 'react';
import ClientLayout from '../components/ClientLayout';
import { ContentSection, CodeBlock, InfoCard, ListItem } from '../components/ContentSection';
import SequencesTab from '../components/SequencesTab';
import CampaignsTabGeneric from '../components/CampaignsTabGeneric';
import PerformanceTabDynamic from '../components/PerformanceTabDynamic';
import CampaignsTabDynamic from '../components/CampaignsTabDynamic';
import DocumentsTabGeneric from '../components/DocumentsTabGeneric';
import TasksTab from '../components/TasksTab';
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

export default function EblissAIPage() {
  const [activeTab, setActiveTab] = useState('overview');

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

  return (
    <ClientLayout>
      <div className="p-4 lg:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">eBlissAI</h1>
            <a
              href="https://eblissai.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-sky-600 hover:underline inline-block"
            >
              Visit Website →
            </a>
          </div>
          <p className="text-gray-600 mt-1">AI-Native Autonomous IT Operations Platform</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 font-medium text-sm whitespace-nowrap border-b-2 transition-colors flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-[#1a2647] text-[#1a2647]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
            <strong>eBlissAI</strong> is an AI-native, autonomous IT operations platform delivering self-healing, predictive resolution, and personalization across enterprise endpoint environments - reducing helpdesk ticket volume and IT operations cost while improving employee experience.
          </p>

          <div className="bg-sky-50 border-l-4 border-sky-500 p-4 rounded">
            <p className="font-semibold text-sky-900 mb-2">Target Customer Profile:</p>
            <p className="text-sky-800">
              Mature but reactive enterprise IT environments with large, distributed device fleets. Not greenfield (too early for 2-3 month cycle) and not already running modern AI-ops stack (no gap to sell into). Sharpest fit already owns the problem in measurable form - ticket volume, MTTR - but hasn't automated it yet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Typical Deal Size" value="$200k-$300k ARR" />
            <InfoCard label="Sales Cycle" value="2-3 months" />
            <InfoCard label="Large Deals" value="$1M+ ARR (~1 year cycle)" />
            <InfoCard label="Target Company Size" value="Fortune 500 / Global Top-5000" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Product Value Proposition" icon={<Layers className="w-5 h-5" />}>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Core Capabilities:</h4>
            <ul className="space-y-2">
              <ListItem type="check">Self-healing endpoint automation</ListItem>
              <ListItem type="check">Predictive issue resolution before tickets are created</ListItem>
              <ListItem type="check">Personalized IT support experience across enterprise devices</ListItem>
              <ListItem type="check">Autonomous operations reducing manual IT intervention</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Business Impact:</h4>
            <ul className="space-y-2">
              <ListItem type="check">Reduces helpdesk ticket volume</ListItem>
              <ListItem type="check">Decreases IT operations costs (headcount, MTTR)</ListItem>
              <ListItem type="check">Improves employee experience and productivity</ListItem>
              <ListItem type="check">Automates L1/L2 support workload</ListItem>
            </ul>
          </div>

          <div className="bg-slate-50 border-l-4 border-slate-500 p-4 rounded">
            <p className="font-semibold text-slate-900 mb-2">Founder Expertise:</p>
            <p className="text-slate-700">
              Shirish (founder) previously sold successfully into Fortune 2000 companies at Nanoheal (endpoint monitoring/automation). This ICP mirrors that proven profile.
            </p>
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
            <h4 className="font-semibold text-slate-900 mb-3">Target Geography (Equal Weight):</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard label="United States" value="All regions" color="bg-sky-50 text-sky-700" />
              <InfoCard label="DACH" value="Germany, Austria, Switzerland" color="bg-blue-50 text-blue-700" />
              <InfoCard label="Benelux" value="Netherlands, Belgium, Luxembourg" color="bg-indigo-50 text-indigo-700" />
              <InfoCard label="Nordics" value="Sweden, Norway, Denmark, Finland" color="bg-purple-50 text-purple-700" />
            </div>
            <p className="text-sm text-slate-600 mt-2 italic">
              Markets are weighted equally - no single market is prioritized; sourcing and sequencing run in parallel across all.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Company Profile - Mature But Reactive IT Environments:</h4>

            <div className="bg-sky-50 border-l-4 border-sky-500 p-4 rounded mb-4">
              <p className="font-semibold text-sky-900 mb-2">Include:</p>
              <ul className="text-sky-800 text-sm space-y-1">
                <ListItem>Large, distributed device fleet (enterprise endpoints)</ListItem>
                <ListItem>Existing ITSM stack: ServiceNow (without ITOM/AI-Ops layer), BMC Helix, or comparable legacy tooling</ListItem>
                <ListItem>Fortune 500 and global top-5000 companies</ListItem>
                <ListItem>Budget and process maturity already in place</ListItem>
                <ListItem>Measurable problem: high ticket volume, MTTR data available</ListItem>
              </ul>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="font-semibold text-red-900 mb-2">Exclude:</p>
              <ul className="text-red-800 text-sm space-y-1">
                <ListItem type="cross">Greenfield companies (no existing tooling - too early for 2-3 month cycle)</ListItem>
                <ListItem type="cross">Companies already running modern AI-ops stack (no gap to sell into)</ListItem>
                <ListItem type="cross">Small/mid-market companies (below Fortune 5000)</ListItem>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Industry Fit - High Device Fleet Sectors:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <p className="font-semibold text-slate-900 text-sm mb-1">Financial Services / Insurance</p>
                <p className="text-slate-600 text-sm">Branch networks, distributed workforce</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <p className="font-semibold text-slate-900 text-sm mb-1">Healthcare</p>
                <p className="text-slate-600 text-sm">High device turnover + compliance pressure</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <p className="font-semibold text-slate-900 text-sm mb-1">Multi-Location Retail</p>
                <p className="text-slate-600 text-sm">POS systems + back-office endpoints</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <p className="font-semibold text-slate-900 text-sm mb-1">Technology / Telecom</p>
                <p className="text-slate-600 text-sm">Early AI-ops adopters, tech-forward</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Visible Strain Indicators:</h4>
            <ul className="space-y-2">
              <ListItem><strong>High L1/L2 support hiring volume</strong> - Multiple open Help Desk / IT Support positions</ListItem>
              <ListItem><strong>Fast growth outpacing IT ops</strong> - Headcount or location expansion faster than current IT process can absorb</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Buyer Personas - Direct Enterprise Track" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h4 className="font-semibold text-blue-900 mb-2">PRIMARY: VP IT Operations / Head of IT Operations</h4>
            <p className="text-blue-800 mb-3">
              Owns the operational cost line (headcount, tickets, MTTR) directly. Has the data to justify business case fast. Can sponsor $200-300k deal without full CIO-led process on first touch.
            </p>
            <div className="text-blue-800 text-sm">
              <p className="font-semibold mb-1">Why Primary:</p>
              <ul className="space-y-1">
                <ListItem>Direct budget ownership for support headcount</ListItem>
                <ListItem>Measured on ticket volume and MTTR metrics</ListItem>
                <ListItem>Feels the pain daily (support escalations, capacity issues)</ListItem>
                <ListItem>Can move fast without lengthy approval chain</ListItem>
              </ul>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <h4 className="font-semibold text-green-900 mb-2">SECONDARY: Head of Digital Workplace / EUC</h4>
            <p className="text-green-800 mb-3">
              Closest functional fit where the title exists, but less universal across enterprises than VP IT Operations.
            </p>
            <div className="text-green-800 text-sm">
              <p className="font-semibold mb-1">Why Secondary:</p>
              <ul className="space-y-1">
                <ListItem>Not all enterprises have this dedicated role</ListItem>
                <ListItem>When it exists, strong alignment with endpoint automation</ListItem>
                <ListItem>Often reports to VP IT Operations or CIO</ListItem>
              </ul>
            </div>
          </div>

          <div className="bg-slate-50 border-l-4 border-slate-500 p-4 rounded">
            <h4 className="font-semibold text-slate-900 mb-2">TERTIARY: CIO</h4>
            <p className="text-slate-700 mb-3">
              Co-sign on larger deals or CC on the account - not the first cold touch.
            </p>
            <div className="text-slate-700 text-sm">
              <p className="font-semibold mb-1">Why Tertiary:</p>
              <ul className="space-y-1">
                <ListItem>Too senior for first cold outreach</ListItem>
                <ListItem>Too removed from day-to-day ticket/MTTR pain</ListItem>
                <ListItem>Slower first response rate</ListItem>
                <ListItem>Appropriate for $1M+ deals or as escalation path</ListItem>
              </ul>
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

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mt-4">
            <p className="font-semibold text-amber-900 mb-2">GSI Strategy Note:</p>
            <p className="text-amber-800 text-sm">
              GSI partnerships are high-leverage: one signed partner relationship can open access to dozens or hundreds of enterprise clients already engaged with that GSI for IT transformation projects.
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
              <ul className="text-blue-800 text-sm space-y-1">
                <ListItem>ServiceNow (ITSM/ITOM - but without AI-Ops layer)</ListItem>
                <ListItem>Tanium</ListItem>
                <ListItem>Nexthink</ListItem>
                <ListItem>BMC Helix</ListItem>
                <ListItem>Ivanti</ListItem>
                <ListItem>Lakeside SysTrack</ListItem>
                <ListItem>1E</ListItem>
              </ul>
              <p className="text-blue-800 text-sm mt-2 italic">
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
      <ContentSection title="AI-Powered Prospect Research" icon={<Code className="w-5 h-5" />}>
        <p className="text-slate-600 mb-4">
          AI prompts for identifying buying signals and prioritizing prospects based on the 5 signal categories.
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Technographic Signal Check</h4>
            <CodeBlock code="Does this company use ServiceNow, Tanium, Nexthink, BMC Helix, Ivanti, Lakeside SysTrack, or 1E for IT service management or endpoint monitoring? Look for technology stack mentions on their website, job postings, or press releases. Return YES if any of these tools are confirmed, NO if not found." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">AI-Ops Gap Signal</h4>
            <CodeBlock code="Check if this company has implemented AI-powered IT operations automation or self-healing endpoint capabilities. Look for mentions of autonomous IT ops, AI-driven support, or predictive resolution in their technology stack. Return YES if they already have AI-ops automation (no gap), NO if they are still using traditional/reactive ITSM (gap exists)." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">L1/L2 Support Hiring Volume Signal</h4>
            <CodeBlock code="Search this company's job board or careers page for IT support hiring. Count open positions for: Help Desk Technician, IT Support Specialist, L1 Support, L2 Support, Service Desk Analyst. Return the count. If 3+ positions open = HIGH PRIORITY signal. If 1-2 positions = MEDIUM signal. If 0 positions = NO signal." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">IT Operations Leadership Hiring Signal</h4>
            <CodeBlock code="Check if this company is hiring for IT Operations Manager, VP IT Operations, Head of Digital Workplace, or EUC Lead positions. Return YES if these leadership roles are open (suggests organizational strain or expansion), NO if not." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Growth/Expansion Signal</h4>
            <CodeBlock code="Look for recent announcements about this company opening new offices, expanding to new locations, or significant headcount growth in the last 6-12 months. Check press releases, LinkedIn company updates, or news articles. Return YES if clear growth/expansion signals found, NO if not." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">New Leadership Signal (Event-Based)</h4>
            <CodeBlock code="Search for recent leadership changes at this company. Check if they have a new CIO, VP IT Operations, or Head of Digital Workplace appointed in the last 3-6 months. Look at LinkedIn, press releases, company announcements. Return YES with name and date if found, NO if not." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Distributed Workforce/Fleet Size Signal</h4>
            <CodeBlock code="Analyze this company's structure to estimate endpoint fleet size. Look for: number of locations, branch networks, retail stores, employee count, remote workforce mentions. Industries like financial services (branches), healthcare (facilities), retail (stores) typically indicate large device fleets. Return estimated fleet size category: LARGE (10,000+ endpoints), MEDIUM (1,000-10,000), SMALL (under 1,000), or UNKNOWN." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Industry Fit Verification</h4>
            <CodeBlock code="Confirm this company's primary industry. Is it one of the high-fit sectors: Financial Services, Insurance, Healthcare, Multi-Location Retail, Technology, or Telecom? Return the industry category if it matches high-fit sectors, or return OTHER if it does not match." />
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
