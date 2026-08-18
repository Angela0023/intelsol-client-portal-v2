'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
import { ContentSection, CodeBlock, InfoCard, ListItem } from '../components/ContentSection';
import TasksTab from '../components/TasksTab';
import SequencesTab from '../components/SequencesTab';
import CampaignsTabDynamic from '../components/CampaignsTabDynamic';
import PerformanceTabDynamic from '../components/PerformanceTabDynamic';
import CampaignsTabGeneric from '../components/CampaignsTabGeneric';
import DocumentsTabGeneric from '../components/DocumentsTabGeneric';
import StatusBadge, { getClientStatus, setClientStatus, DEFAULT_STATUSES, type ClientStatus } from '../components/StatusBadge';
import { Target, Users, Filter, Code, TrendingUp, FileText, CheckSquare, BarChart3, Zap, FolderOpen, AlertCircle } from 'lucide-react';

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

const ZEN2FIT_DEFAULT_TASKS = [
  { text: 'Build Tech/SaaS company list in Apollo (100-250 employees, target markets)', completed: false },
  { text: 'Enrich with buying signals (new HR leaders, rapid hiring, funding)', completed: false },
  { text: 'Find HR Directors / People & Culture Leads via Apollo/LinkedIn', completed: false },
  { text: 'Create email sequences by buyer persona (HR Director, P&C Lead, CEO)', completed: false },
  { text: 'Launch first pilot campaign to Tier 1 trigger companies', completed: false },
];

export default function Zen2FitPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('zen2fit', DEFAULT_STATUSES.zen2fit));

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
    setClientStatus('zen2fit', newStatus);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const newPath = tabId === 'overview' ? '/zen2fit' : `/zen2fit/${tabId}`;
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
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl lg:text-2xl font-bold text-pink-600">Z2F</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 lg:space-x-3 flex-wrap">
                <h1 className="text-xl lg:text-3xl font-bold text-slate-900">Zen2Fit</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
              </div>
              <p className="text-sm lg:text-base text-slate-600 break-words">Corporate Wellness SaaS Platform</p>
            </div>
          </div>
          <a
            href="https://zen2fit.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-pink-600 hover:underline inline-block"
          >
            Visit Website →
          </a>
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
          {activeTab === 'icp' && <ICPAndPersonasTab />}
          {activeTab === 'filters' && <FiltersTab />}
          {activeTab === 'prompts' && <PromptsTab />}
          {activeTab === 'campaigns-sequences' && <CampaignsSequencesTab />}
          {activeTab === 'performance' && (
            <>
              <PerformanceTabDynamic clientId="zen2fit" />
              <CampaignsTabDynamic clientId="zen2fit" />
            </>
          )}
          {activeTab === 'documents' && (
            <DocumentsTabGeneric
              clientId="zen2fit"
              clientName="Zen2Fit"
              totalLeads={0}
              totalCampaigns={0}
              accentColor="pink"
            />
          )}
          {activeTab === 'tasks' && (
            <TasksTab clientId="zen2fit" defaultTasks={ZEN2FIT_DEFAULT_TASKS} />
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
            Zen2Fit is a holistic corporate wellness and health-prevention SaaS platform sold to companies via annual or semi-annual licenses.
            The platform includes online workouts, mindfulness and mental health tools, nutrition guidance, gamified engagement, and a GDPR-compliant HR reporting dashboard.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Industry" value="Corporate Wellness SaaS" />
            <InfoCard label="Business Model" value="B2B SaaS (Annual/Semi-Annual Licenses)" />
            <InfoCard label="Target Segment" value="Tech / SaaS Companies" />
            <InfoCard label="Sweet Spot" value="100-250 employees" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="What Zen2Fit Offers" icon={<TrendingUp className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="check">4,000+ on-demand workout videos (strength, cardio, yoga, mindfulness)</ListItem>
          <ListItem type="check">Mental health and mindfulness content library</ListItem>
          <ListItem type="check">Nutrition guidance and healthy lifestyle resources</ListItem>
          <ListItem type="check">Gamified engagement features (challenges, leaderboards, rewards)</ListItem>
          <ListItem type="check">GDPR-compliant HR reporting dashboard with engagement metrics</ListItem>
          <ListItem type="check">Research-backed methodology (tested across 70 SEE companies)</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Target Market Summary" icon={<Target className="w-5 h-5" />}>
        <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded">
          <p className="font-semibold text-pink-900 mb-2">This Segment: Tech / SaaS Companies</p>
          <p className="text-pink-800">
            100-250 employees (sweet spot), digital-native white-collar workforce, located in Slovenia, Hungary, Poland, Denmark, or Norway.
            Chosen as the first priority segment because retention, remote/hybrid culture, and employer branding are well-understood pain points here.
          </p>
        </div>
      </ContentSection>

      <ContentSection title="Active Markets" icon={<Target className="w-5 h-5" />}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {['Slovenia', 'Hungary', 'Poland', 'Denmark', 'Norway'].map((market) => (
            <div key={market} className="bg-pink-100 px-3 py-2 rounded text-sm font-medium text-pink-800">
              {market}
            </div>
          ))}
        </div>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mt-4">
          <p className="font-semibold text-amber-900 mb-1">Note:</p>
          <p className="text-amber-800 text-sm">
            Bulgaria and Romania are excluded at the client's request.
          </p>
        </div>
      </ContentSection>
    </>
  );
}

function ICPAndPersonasTab() {
  return (
    <>
      <ContentSection title="Ideal Customer Profile - Tech / SaaS Segment" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded">
            <p className="font-semibold text-pink-900 mb-2">PRIMARY TARGET:</p>
            <p className="text-pink-800">
              Tech / SaaS companies with 100-250 employees (sweet spot), predominantly white-collar desk-based workforce, located in Slovenia, Hungary, Poland, Denmark, or Norway.
            </p>
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Company Size Priority:</h4>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 px-4 py-2 text-left">Size Band</th>
                <th className="border border-slate-300 px-4 py-2 text-left">Priority</th>
                <th className="border border-slate-300 px-4 py-2 text-left">Why</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 px-4 py-2 font-medium">100-250 employees</td>
                <td className="border border-slate-300 px-4 py-2"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">HIGH</span></td>
                <td className="border border-slate-300 px-4 py-2">Sweet spot: has dedicated HR/People function and real budget authority, but still actively shaping culture and benefits - not yet locked into legacy vendor</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-4 py-2 font-medium">250-500 employees</td>
                <td className="border border-slate-300 px-4 py-2"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">MEDIUM</span></td>
                <td className="border border-slate-300 px-4 py-2">Good fit, but HR structure is more layered - expect slightly longer buying process and more stakeholders</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-4 py-2 font-medium">50-100 employees</td>
                <td className="border border-slate-300 px-4 py-2"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">MEDIUM</span></td>
                <td className="border border-slate-300 px-4 py-2">Fit depends on whether HR is a dedicated role yet; often still founder/ops-led, so qualify per company before prioritizing</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-4 py-2 font-medium">500+ employees</td>
                <td className="border border-slate-300 px-4 py-2"><span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm font-medium">LOW</span></td>
                <td className="border border-slate-300 px-4 py-2">Often already has an incumbent wellness/EAP vendor and a longer procurement cycle - deprioritize for outbound, don't exclude</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-4 py-2 font-medium">Under 50 employees</td>
                <td className="border border-slate-300 px-4 py-2"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">DEPRIORITIZE</span></td>
                <td className="border border-slate-300 px-4 py-2">Rarely has a dedicated HR budget owner - treat as negative ICP unless a clear signal says otherwise</td>
              </tr>
            </tbody>
          </table>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Business Model & Workforce:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Business Model" value="Software/SaaS, Fintech, Martech, Dev Tools" />
            <InfoCard label="Workforce Type" value="Predominantly white-collar desk-based roles" />
            <InfoCard label="Work Style" value="Digital-native, hybrid-capable teams" />
            <InfoCard label="Departments" value="Engineering, Product, Sales, Marketing, Ops" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Negative ICP (Do Not Contact)" icon={<AlertCircle className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="cross">No HR/People function at all, and no clear signal one is being built</ListItem>
          <ListItem type="cross">Under 50 employees (unless a strong Tier 1 trigger is present)</ListItem>
          <ListItem type="cross">Predominantly non-desk/field workforce - the product fits digital, office-based teams best</ListItem>
          <ListItem type="cross">Company already has a well-established, well-adopted wellbeing program (low likelihood of switching)</ListItem>
          <ListItem type="cross">No visible employee-benefits budget line</ListItem>
          <ListItem type="cross">Direct competitors - other corporate wellness / EAP / employee benefits platforms</ListItem>
          <ListItem type="cross">Companies in Bulgaria or Romania (excluded at client's request)</ListItem>
          <ListItem type="cross">Existing Zen2Fit customers</ListItem>
          <ListItem type="cross">Companies that have responded negatively or unsubscribed</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Buyer Roles in the Purchase Process" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-6">
          <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded">
            <p className="font-semibold text-pink-900 mb-2">Economic Buyer (Budget Owner)</p>
            <p className="text-pink-800 text-sm font-medium mb-2">HR Director, Head of People, CHRO</p>
            <p className="text-pink-700 text-sm">
              Owns the budget and the final call. Cares about retention, engagement, productivity, employer brand, and ROI on HR spend.
            </p>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
            <p className="font-semibold text-purple-900 mb-2">Champion (Day-to-Day Problem Owner)</p>
            <p className="text-purple-800 text-sm font-medium mb-2">People & Culture Lead, Employee Experience Lead, Wellbeing Lead</p>
            <p className="text-purple-700 text-sm">
              Owns the day-to-day problem and would advocate internally - the person most likely to actually reply to cold outreach.
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">Influencer (Shapes Decision, No Budget)</p>
            <p className="text-blue-800 text-sm font-medium mb-2">HR Business Partner, Talent Acquisition Lead, Internal Communications, Workplace/Office Lead</p>
            <p className="text-blue-700 text-sm">
              Can shape the decision without owning budget - useful as a secondary contact or CC, not a primary target.
            </p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="font-semibold text-green-900 mb-2">CEO / Founder (Smaller Companies)</p>
            <p className="text-green-800 text-sm font-medium mb-2">CEO, Founder, Managing Director</p>
            <p className="text-green-700 text-sm">
              Acts as economic buyer AND champion at smaller companies (under ~100 employees) that don't yet have a dedicated HR function.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Buying Triggers - Why Now?" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-6">
          <p className="font-semibold text-amber-900 mb-2">CRITICAL PRINCIPLE:</p>
          <p className="text-amber-800">
            A company can fit the profile perfectly and still have no reason to act. These triggers indicate the moment is right.
            Use these to prioritize and sequence outreach, not as a hard scoring system.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="font-semibold text-red-900 mb-2">TIER 1 TRIGGERS (Highest Priority)</p>
            <ul className="ml-4 space-y-2 text-sm text-red-800">
              <ListItem><strong>New HR/People leader:</strong> A new HR Director or Head of People hired in the last 3-6 months typically reviews and refreshes the benefits stack early - the single strongest "why now" moment</ListItem>
              <ListItem><strong>Rapid hiring / headcount growth:</strong> 20%+ headcount growth in 6 months means onboarding culture and benefits are actively being built or rebuilt</ListItem>
              <ListItem><strong>Recent funding or major growth:</strong> Fresh funding usually means fresh HR/people budget and pressure to professionalize benefits</ListItem>
            </ul>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
            <p className="font-semibold text-orange-900 mb-2">TIER 2 TRIGGERS</p>
            <ul className="ml-4 space-y-2 text-sm text-orange-800">
              <ListItem><strong>Hybrid/remote workforce:</strong> Harder to keep culture and wellbeing consistent without a digital platform - a standing, structural need</ListItem>
              <ListItem><strong>Active employer branding:</strong> Publicly investing in employer brand/talent attraction - wellbeing is a natural differentiator to add</ListItem>
              <ListItem><strong>Public wellbeing/culture messaging:</strong> Leadership or company content already talks about employee wellbeing or mental health - receptive audience, easy opening line</ListItem>
            </ul>
          </div>

          <div className="bg-slate-50 border-l-4 border-slate-400 p-4 rounded">
            <p className="font-semibold text-slate-900 mb-2">TIER 3 TRIGGER</p>
            <p className="text-slate-700 text-sm">
              <strong>Tech-sector baseline:</strong> Being a tech/SaaS company alone is a weak signal on its own - useful only as a tiebreaker alongside Tier 1/2 triggers, not a reason by itself.
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
      <ContentSection title="Apollo / LinkedIn Sales Navigator Search" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600 mb-4">
            Build company list using these filters. Focus on firmographic fit FIRST, then prioritize with buying triggers afterward.
          </p>

          <h4 className="font-semibold text-slate-900 mb-2">Firmographic Fit (Required):</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Geography" value="Slovenia, Hungary, Poland, Denmark, Norway" color="bg-pink-600 text-white" />
            <InfoCard label="Company Size" value="100-250 employees (priority)" color="bg-pink-600 text-white" />
            <InfoCard label="Secondary Size" value="50-100 and 250-500 employees" color="bg-pink-600 text-white" />
            <InfoCard label="Industry" value="Software / SaaS / Tech-enabled" color="bg-pink-600 text-white" />
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-2">Industry Keywords:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              'Software',
              'SaaS',
              'Information Technology',
              'Fintech',
              'Martech',
              'Dev Tools',
              'Platforms',
              'Tech Services'
            ].map((industry) => (
              <div key={industry} className="bg-slate-100 px-3 py-2 rounded text-sm border border-slate-200">
                {industry}
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-2">Decision-Maker Contacts (Primary Targets):</h4>
          <ul className="space-y-2">
            <ListItem type="check">HR Director, Head of People, CHRO (economic buyers at 100+ employees)</ListItem>
            <ListItem type="check">People & Culture Lead, Employee Experience Lead, Wellbeing Lead (champions)</ListItem>
            <ListItem type="check">CEO, Founder, Managing Director (economic buyers at 50-100 employees)</ListItem>
          </ul>

          <h4 className="font-semibold text-slate-900 mt-6 mb-2">Export Fields:</h4>
          <ul className="space-y-2">
            <ListItem type="check">Company name, domain, LinkedIn URL, headcount</ListItem>
            <ListItem type="check">Person: First name, last name, job title, email, LinkedIn URL</ListItem>
          </ul>
        </div>
      </ContentSection>

      <ContentSection title="Enrichment & Prioritization (Clay)" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="space-y-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 px-4 py-2 text-left">Enrichment</th>
                <th className="border border-slate-300 px-4 py-2 text-left">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 px-4 py-2 font-medium">Track New HR Hires</td>
                <td className="border border-slate-300 px-4 py-2">Identify companies that hired a new HR Director / Head of People in last 3-6 months (Tier 1 trigger)</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-4 py-2 font-medium">LinkedIn Headcount Growth</td>
                <td className="border border-slate-300 px-4 py-2">Filter companies that grew 20%+ in last 6 months (Tier 1 trigger)</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-4 py-2 font-medium">Funding (Crunchbase)</td>
                <td className="border border-slate-300 px-4 py-2">Flag companies that raised Series A/B/C in last 12 months (Tier 1 trigger)</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-4 py-2 font-medium">Remote/Hybrid Keywords</td>
                <td className="border border-slate-300 px-4 py-2">Check company website / job postings for hybrid/remote work mentions (Tier 2 trigger)</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-4 py-2 font-medium">Employer Brand Activity</td>
                <td className="border border-slate-300 px-4 py-2">Check LinkedIn company posts for employer brand content (Tier 2 trigger)</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-4 py-2 font-medium">Contact Finder</td>
                <td className="border border-slate-300 px-4 py-2">Find HR Director / People & Culture Lead / CEO - verify email</td>
              </tr>
            </tbody>
          </table>

          <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded mt-4">
            <p className="font-semibold text-pink-900 mb-2">Prioritization Strategy:</p>
            <p className="text-pink-800 text-sm">
              Companies matching a <strong>Tier 1 trigger</strong> (new HR leader, rapid hiring, recent funding) are sequenced first.
              <strong>Tier 2</strong> next. The rest of the fitting list is worked through in parallel rather than excluded.
            </p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function PromptsTab() {
  const icpPrompt = `You are analyzing a company's website to determine if they match Zen2Fit's Ideal Customer Profile (ICP) for the Tech / SaaS segment.

IDEAL CUSTOMER PROFILE:
- Industry: Software/SaaS, tech-enabled companies (fintech, martech, dev tools, platforms)
- Size: 100-250 employees (sweet spot), or 50-500 employees (secondary)
- Workforce: Predominantly white-collar desk-based roles (engineering, product, sales, marketing, ops)
- Location: Slovenia, Hungary, Poland, Denmark, Norway
- Work style: Digital-native, hybrid-capable teams

DISQUALIFIERS:
- Under 50 employees (unless strong Tier 1 trigger present)
- Predominantly non-desk / field workforce
- Already has well-established wellness program
- Corporate wellness competitor
- Bulgaria or Romania (excluded)

ANALYZE THE WEBSITE FOR:
1. Business Model: Is this a software/SaaS or tech-enabled company?
2. Workforce Type: Do they have white-collar desk-based teams (engineers, product, sales, marketing)?
3. Company Size: Estimate if they have 50-500 employees (check team page, office photos, job postings)
4. Work Style: Any signs of remote/hybrid work culture?
5. Existing Wellness: Do they already promote a wellness platform or program?

OUTPUT FORMAT:
**ICP Match:** [Yes / No / Unsure]
**Reasoning:** [2-3 sentences explaining why, citing specific evidence from the website]
**Confidence:** [High / Medium / Low]
**Key Signals:**
- Business Model: [Software/SaaS / Tech-enabled / Other]
- Workforce Type: [Desk-based / Mixed / Field-based]
- Size Estimate: [Range]
- Work Style: [Remote/Hybrid / Office-based / Unclear]
- Red Flags: [Any disqualifiers noted]`;

  const triggerDetectionPrompt = `Analyze if this company shows buying triggers for corporate wellness platform.

TIER 1 TRIGGERS (Highest Priority):
1. New HR Director / Head of People hired in last 3-6 months
2. Rapid hiring (20%+ headcount growth in 6 months)
3. Recent funding (Series A/B/C in last 12 months)

TIER 2 TRIGGERS:
4. Hybrid/remote workforce mentioned
5. Active employer branding efforts
6. Public wellbeing/culture messaging on LinkedIn/website

OUTPUT:
- Has Active Triggers: Yes / No / Unsure
- Trigger Types Detected: [List specific triggers found]
- Tier Level: Tier 1 / Tier 2 / None
- Priority: High / Medium / Low
- Confidence: High / Medium / Low`;

  return (
    <>
      <ContentSection title="ICP Matching Prompt (Anthropic)" icon={<Code className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            This prompt is used to analyze company websites and determine if they match Zen2Fit's Tech/SaaS segment ICP.
          </p>
          <CodeBlock code={icpPrompt} language="text" />
        </div>
      </ContentSection>

      <ContentSection title="Buying Trigger Detection Prompt" icon={<Code className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            This prompt detects active buying signals to prioritize outreach timing.
          </p>
          <CodeBlock code={triggerDetectionPrompt} language="text" />
        </div>
      </ContentSection>
    </>
  );
}

function CampaignsSequencesTab() {
  return (
    <>
      <SequencesTab clientId="zen2fit" />
      <div className="mt-8">
        <CampaignsTabGeneric />
      </div>
    </>
  );
}
