'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
import { ContentSection, CodeBlock, InfoCard, ListItem } from '../components/ContentSection';
import TasksTab, { XPOSE_DEFAULT_TASKS } from '../components/TasksTab';
import SequencesTab from '../components/SequencesTab';
import CampaignsTabDynamic from '../components/CampaignsTabDynamic';
import PerformanceTabDynamic from '../components/PerformanceTabDynamic';
import CampaignsTabGeneric from '../components/CampaignsTabGeneric';
import DocumentsTabGeneric from '../components/DocumentsTabGeneric';
import StatusBadge, { getClientStatus, setClientStatus, DEFAULT_STATUSES, type ClientStatus } from '../components/StatusBadge';
import { Target, Users, Filter, Code, TrendingUp, FileText, CheckSquare, BarChart3, Briefcase, Zap, Mail, FolderOpen } from 'lucide-react';

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

const PEOPLEFOCUS_DEFAULT_TASKS = [
  { text: 'Build company list in Apollo with DACH filters', completed: false },
  { text: 'Enrich & score leads in Clay (job postings, growth signals)', completed: false },
  { text: 'Verify emails via Prospeo/Hunter waterfall', completed: false },
  { text: 'Create campaign sequences (English & German)', completed: false },
  { text: 'Review and launch first campaign', completed: false },
];

export default function PeopleFocusPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('peoplefocus', DEFAULT_STATUSES.peoplefocus));

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
    setClientStatus('peoplefocus', newStatus);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const newPath = tabId === 'overview' ? '/peoplefocus' : `/peoplefocus/${tabId}`;
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
          <div className="flex items-center space-x-2 lg:space-x-3 mb-2">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl lg:text-2xl font-bold text-purple-600">PF</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 lg:space-x-3 flex-wrap">
                <h1 className="text-xl lg:text-3xl font-bold text-slate-900">People Focus</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
              </div>
              <p className="text-sm lg:text-base text-slate-600 break-words">IT & Executive Recruitment for DACH Companies</p>
            </div>
          </div>
          <a
            href="https://peoplefocus.rs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-purple-600 hover:underline inline-block"
          >
            Visit Website →
          </a>
        </div>

        {/* Tabs */}
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

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'icp' && <ICPAndPersonasTab />}
          {activeTab === 'filters' && <FiltersTab />}
          {activeTab === 'prompts' && <PromptsTab />}
          {activeTab === 'campaigns-sequences' && <CampaignsSequencesTab />}
          {activeTab === 'documents' && (
            <DocumentsTabGeneric
              clientId="peoplefocus"
              clientName="People Focus"
              totalLeads={0}
              totalCampaigns={1}
              accentColor="purple"
            />
          )}
          {activeTab === 'performance' && (
            <>
              <PerformanceTabDynamic clientId="peoplefocus" />
              <CampaignsTabDynamic clientId="peoplefocus" />
            </>
          )}
          {activeTab === 'tasks' && (
            <TasksTab clientId="peoplefocus" defaultTasks={PEOPLEFOCUS_DEFAULT_TASKS} />
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
            People Focus d.o.o. specializes in <strong>IT & Executive Recruitment</strong> for DACH-based companies
            (Germany, Austria, Switzerland), sourcing senior developers, engineers, and managers from Serbia and the Balkans.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Industry" value="IT & Executive Recruitment" />
            <InfoCard label="Business Model" value="B2B Recruitment Services" />
            <InfoCard label="Target Market" value="DACH Companies (DE, AT, CH)" />
            <InfoCard label="Geographic Focus" value="Germany, Austria, Switzerland" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Core Service" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900">IT Talent Pipeline for DACH Companies</h4>
          <p>
            Connecting DACH companies with vetted senior IT talent from Serbia — <strong>in weeks, not months</strong>.
          </p>

          <div className="bg-slate-50 border-l-4 border-purple-500 p-4 rounded">
            <p className="font-medium text-slate-900 mb-2">The Problem They Solve:</p>
            <p className="text-slate-700">
              DACH IT talent market is undersupplied — open roles stay unfilled for months.
              People Focus solves this with access to Serbia's strong IT talent pool at competitive rates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <InfoCard label="Candidates in Database" value="4,000+ active candidates" />
            <InfoCard label="Interviews per Year" value="1,000+ candidate interviews" />
            <InfoCard label="Experience" value="20+ years management experience" />
            <InfoCard label="University Source" value="University of Belgrade (Top 500)" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Key Differentiators" icon={<Users className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="check">Speed: Places candidates in weeks, not months</ListItem>
          <ListItem type="check">Quality: Access to University of Belgrade talent (Top 500 worldwide)</ListItem>
          <ListItem type="check">Cultural Fit: Deep understanding of DACH business culture</ListItem>
          <ListItem type="check">Cost: Competitive rates compared to local DACH talent</ListItem>
          <ListItem type="check">Scale: Large active candidate pool (4,000+)</ListItem>
        </ul>
      </ContentSection>
    </>
  );
}

function ICPAndPersonasTab() {
  return (
    <>
      <ContentSection title="Ideal Customer Profile" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="font-semibold text-green-900 mb-2">Primary Target</p>
            <p className="text-green-800">
              DACH companies (Germany, Austria, Switzerland) with 50-1,000 employees actively hiring IT talent
            </p>
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Geography & Size:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Geography" value="Germany, Austria, Switzerland (DACH)" />
            <InfoCard label="Company Size" value="50-1,000 employees" />
            <InfoCard label="Sweet Spot" value="100-500 employees" />
            <InfoCard label="Company Type" value="B2B SaaS, IT Services, Fintech" />
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Target Industries:</h4>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Primary:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Software / SaaS', 'IT Services', 'Fintech / Financial Services'].map((industry) => (
                  <div key={industry} className="bg-green-100 px-3 py-2 rounded text-sm font-medium text-green-800">
                    {industry}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Secondary:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['E-commerce', 'Digital Marketing', 'Cybersecurity', 'HealthTech', 'EdTech'].map((industry) => (
                  <div key={industry} className="bg-blue-100 px-3 py-2 rounded text-sm text-blue-800">
                    {industry}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Technologies Used:</h4>
          <p className="text-sm text-slate-600 mb-2">Companies using these technologies are ideal targets:</p>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {['Java', 'Python', '.NET', 'React', 'Node.js', 'AWS', 'Azure', 'GCP', 'DevOps', 'Kubernetes'].map((tech) => (
              <div key={tech} className="bg-slate-100 px-3 py-2 rounded text-sm text-center border border-slate-200">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Exclusion Criteria (Do Not Contact)" icon={<Target className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="cross">Recruitment agencies, headhunters, staffing firms (direct competitors)</ListItem>
          <ListItem type="cross">Companies with fewer than 50 employees</ListItem>
          <ListItem type="cross">Companies with no visible tech team or IT roles</ListItem>
          <ListItem type="cross">Companies outside DACH region (unless explicitly approved)</ListItem>
          <ListItem type="cross">Existing People Focus clients</ListItem>
          <ListItem type="cross">Companies that have responded negatively or unsubscribed</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Decision Maker Personas" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-6">
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
            <p className="font-semibold text-purple-900 mb-2">Primary Target (Companies 100+ employees)</p>
            <p className="text-purple-800 text-sm font-medium mb-2">HR Directors & Talent Leaders</p>
            <ul className="ml-4 space-y-1 text-sm text-purple-800">
              <ListItem>HR Director</ListItem>
              <ListItem>Head of Talent Acquisition</ListItem>
              <ListItem>VP People</ListItem>
              <ListItem>HR Manager</ListItem>
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">Secondary Target (Companies 50-100 employees)</p>
            <p className="text-blue-800 text-sm font-medium mb-2">CEOs & Founders (no dedicated HR)</p>
            <ul className="ml-4 space-y-1 text-sm text-blue-800">
              <ListItem>CEO</ListItem>
              <ListItem>Founder</ListItem>
              <ListItem>Geschäftsführer</ListItem>
              <ListItem>Managing Director</ListItem>
            </ul>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="font-semibold text-green-900 mb-2">Tertiary Target (CC / Warm Intro)</p>
            <p className="text-green-800 text-sm font-medium mb-2">CTOs & Engineering Leaders</p>
            <ul className="ml-4 space-y-1 text-sm text-green-800">
              <ListItem>CTO</ListItem>
              <ListItem>VP Engineering</ListItem>
              <ListItem>Head of Engineering</ListItem>
              <ListItem>Tech Lead</ListItem>
            </ul>
          </div>

          <div className="bg-slate-50 border-l-4 border-slate-400 p-4 rounded mt-4">
            <p className="font-semibold text-slate-900 mb-2">Targeting Strategy:</p>
            <p className="text-slate-700 text-sm">
              Primary outreach to HR Directors (100+ employees) or CEOs (50-100 employees).
              Use CTOs as CC or for warm introductions after initial HR contact.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Contact Data Requirements" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 mb-2">Required Fields:</h4>
          <ul className="space-y-2">
            <ListItem type="check">First Name</ListItem>
            <ListItem type="check">Last Name</ListItem>
            <ListItem type="check">Job Title</ListItem>
            <ListItem type="check">Email Address</ListItem>
            <ListItem type="check">LinkedIn URL</ListItem>
            <ListItem type="check">Company Name</ListItem>
            <ListItem type="check">Company Size</ListItem>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-4">
            <p className="font-semibold text-blue-900 mb-1">Note:</p>
            <p className="text-blue-800 text-sm">
              Use Apollo enrichment first (1 credit per contact). Only use Clay waterfall if Apollo doesn't provide enough emails (more expensive at 5-6 credits).
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Buying Signals Framework" icon={<Briefcase className="w-5 h-5" />}>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-6">
          <p className="font-semibold text-amber-900 mb-2">CRITICAL RULE:</p>
          <p className="text-amber-800">
            Only contact companies that show at least <strong>ONE Tier 1 signal</strong>, or <strong>TWO or more Tier 2/3 signals</strong> combined.
            <br />
            <strong>Do NOT spray — signal-based targeting only.</strong>
          </p>
        </div>
      </ContentSection>

      <ContentSection title="Tier 1 Signals (Highest Priority)" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="font-semibold text-red-900 mb-2">Active IT Job Postings</p>
            <ul className="ml-4 space-y-1 text-sm text-red-800">
              <ListItem>Open IT roles on LinkedIn, Indeed, Xing, Stepstone posted <strong>30+ days ago</strong></ListItem>
              <ListItem>Keywords: Software Engineer, Backend Developer, DevOps, Cloud Engineer, Java Developer, Python Developer, IT Manager</ListItem>
              <ListItem><strong>Same job reposted multiple times</strong> — strong signal of failed internal hiring</ListItem>
              <ListItem><strong>Job ad available in multiple languages</strong> — signal they are looking outside Germany/Austria/Switzerland</ListItem>
            </ul>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
            <p className="font-semibold text-orange-900 mb-2">Posting for Internal Recruiter</p>
            <p className="text-orange-800 text-sm mb-2">
              Company advertising for 'Talent Acquisition Manager' or 'IT Recruiter' — they have a pipeline problem
            </p>
            <p className="text-orange-700 text-sm">
              <strong>Opportunity:</strong> Position People Focus as faster & more cost-effective than building internal function
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Tier 2 Signals" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">Company Growth Signals</p>
            <ul className="ml-4 space-y-1 text-sm text-blue-800">
              <ListItem>LinkedIn headcount grew <strong>20%+ in last 6 months</strong></ListItem>
              <ListItem>Recent <strong>Series A or B funding</strong> (last 12 months) — needs to scale team fast</ListItem>
              <ListItem>New office opening or new product line announced</ListItem>
              <ListItem><strong>New CTO or VP Engineering appointed</strong> (last 90 days) — often triggers new hiring approach</ListItem>
            </ul>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="font-semibold text-green-900 mb-2">Market Entry / Expansion</p>
            <ul className="ml-4 space-y-1 text-sm text-green-800">
              <ListItem>DACH company expanding to new European market</ListItem>
              <ListItem>Recent press release about new product or partnership requiring tech build-out</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Tier 3 Signals" icon={<FileText className="w-5 h-5" />}>
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
          <p className="font-semibold text-purple-900 mb-2">Frustration Signals</p>
          <ul className="ml-4 space-y-1 text-sm text-purple-800">
            <ListItem>Glassdoor / Kununu reviews mentioning 'understaffed', 'too slow to hire', 'overworked team'</ListItem>
            <ListItem>CTO or CEO LinkedIn post about hiring challenges or talent shortage</ListItem>
            <ListItem><strong>Job ad older than 90 days still active</strong> — high frustration signal</ListItem>
          </ul>
        </div>
      </ContentSection>
    </>
  );
}

function FiltersTab() {
  return (
    <>
      <ContentSection title="Apollo Search Criteria (Step 1)" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600 mb-4">
            Build company list in Apollo using these filters:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Region" value="Germany, Austria, Switzerland" color="bg-purple-600 text-white" />
            <InfoCard label="# Employees" value="50 – 1,000" color="bg-purple-600 text-white" />
          </div>

          <h4 className="font-semibold text-slate-900 mt-4 mb-2">Industry Filters:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              'Software',
              'Information Technology',
              'SaaS',
              'Fintech',
              'E-Commerce',
              'Digital Agency'
            ].map((industry) => (
              <div key={industry} className="bg-slate-100 px-3 py-2 rounded text-sm border border-slate-200">
                {industry}
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-slate-900 mt-4 mb-2">Job Postings — Currently Hiring For:</h4>
          <CodeBlock code={`software engineer, backend developer, devops, cloud engineer, java developer, python developer, it manager, it specialist`} />

          <h4 className="font-semibold text-slate-900 mt-4 mb-2">Export Fields:</h4>
          <ul className="space-y-2">
            <ListItem type="check">Company name</ListItem>
            <ListItem type="check">Domain</ListItem>
            <ListItem type="check">LinkedIn URL</ListItem>
            <ListItem type="check">Headcount</ListItem>
          </ul>
        </div>
      </ContentSection>

      <ContentSection title="Clay Enrichment & Scoring (Step 2)" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="space-y-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 px-4 py-2 text-left">Clay Enrichment</th>
                <th className="border border-slate-300 px-4 py-2 text-left">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 px-4 py-2 font-medium">Track Job Posts</td>
                <td className="border border-slate-300 px-4 py-2">Confirm active IT roles + identify job titles being hired for</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-4 py-2 font-medium">LinkedIn Headcount Growth</td>
                <td className="border border-slate-300 px-4 py-2">Filter companies that grew 20%+ in last 6 months</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-4 py-2 font-medium">Funding (Crunchbase)</td>
                <td className="border border-slate-300 px-4 py-2">Flag companies that raised Series A/B in last 12 months</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-4 py-2 font-medium">Contact Finder</td>
                <td className="border border-slate-300 px-4 py-2">Find HR Director / Head of Talent / CEO — verify email via Prospeo or Hunter waterfall</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-4 py-2 font-medium">Lead Scoring</td>
                <td className="border border-slate-300 px-4 py-2">Score 1 point per signal. Export only leads with score 2+ into campaign</td>
              </tr>
            </tbody>
          </table>

          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded mt-4">
            <p className="font-semibold text-purple-900 mb-2">Signal-Based Targeting Only:</p>
            <p className="text-purple-800 text-sm">
              Only export leads with <strong>score 2+</strong>. Do NOT spray — quality over quantity.
            </p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function PromptsTab() {
  const icpPrompt = `You are an expert at analyzing company websites to determine if they match People Focus's Ideal Customer Profile (ICP).

IDEAL CUSTOMER PROFILE:
- Location: DACH region (Germany, Austria, Switzerland)
- Company Size: 50-1,000 employees (sweet spot: 100-500)
- Industries: B2B SaaS, Software Development, IT Services, Fintech, E-commerce, Digital Agencies, HealthTech, EdTech
- Has a software engineering team
- Technologies: Java, Python, .NET, React, Node.js, AWS/Azure/GCP, DevOps/Kubernetes

DISQUALIFIERS:
- Recruitment/staffing agencies (competitors)
- Companies under 50 employees
- Companies outside DACH region
- No visible tech team or IT roles

ANALYZE THE WEBSITE FOR:
1. Company Type: Is this a tech company, SaaS, or company with IT department?
2. Geography: Are they based in Germany, Austria, or Switzerland?
3. Team Size: Do they appear to have 50-1,000 employees?
4. Tech Stack: What technologies do they use or mention?

OUTPUT FORMAT:
**ICP Match:** [Yes or No]
**Reasoning:** [2-3 sentences explaining why, citing specific evidence from the website]
**Confidence:** [High / Medium / Low]
**Key Signals:**
- Location: [Country]
- Company Type: [Industry/Type]
- Team Size Estimate: [Range]
- Technologies Detected: [List]
- Red Flags: [Any disqualifiers noted]`;

  const signalDetectionPrompt = `Analyze if this company shows active IT hiring signals.

SIGNALS TO DETECT:
1. Active IT job postings (30+ days old)
2. Same job reposted multiple times
3. Hiring for internal recruiter/talent acquisition
4. Recent company growth (20%+ headcount in 6 months)
5. Recent funding (Series A/B in last 12 months)
6. Job ads in multiple languages

OUTPUT:
- Has Active Signals: Yes / No / Unsure
- Signal Types Detected: [List]
- Hiring Urgency: High / Medium / Low
- Confidence: High / Medium / Low`;

  return (
    <>
      <ContentSection title="ICP Matching Prompt (Anthropic)" icon={<Code className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            This prompt is used in Clay to analyze company websites and determine if they match People Focus's ICP.
          </p>
          <CodeBlock code={icpPrompt} language="text" />
        </div>
      </ContentSection>

      <ContentSection title="Signal Detection Prompt" icon={<Code className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            This prompt detects active hiring signals (critical for targeting).
          </p>
          <CodeBlock code={signalDetectionPrompt} language="text" />
        </div>
      </ContentSection>
    </>
  );
}

function CampaignsSequencesTab() {
  return (
    <>
      <SequencesTab clientId="peoplefocus" />
      <div className="mt-8">
        <CampaignsTabGeneric />
      </div>
    </>
  );
}

function PersonasTab() {
  return (
    <>
      <ContentSection title="Decision Maker Personas" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-6">
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
            <p className="font-semibold text-purple-900 mb-2">Primary Target (Companies 100+ employees)</p>
            <p className="text-purple-800 text-sm font-medium mb-2">HR Directors & Talent Leaders</p>
            <ul className="ml-4 space-y-1 text-sm text-purple-800">
              <ListItem>HR Director</ListItem>
              <ListItem>Head of Talent Acquisition</ListItem>
              <ListItem>VP People</ListItem>
              <ListItem>HR Manager</ListItem>
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">Secondary Target (Companies 50-100 employees)</p>
            <p className="text-blue-800 text-sm font-medium mb-2">CEOs & Founders (no dedicated HR)</p>
            <ul className="ml-4 space-y-1 text-sm text-blue-800">
              <ListItem>CEO</ListItem>
              <ListItem>Founder</ListItem>
              <ListItem>Geschäftsführer</ListItem>
              <ListItem>Managing Director</ListItem>
            </ul>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="font-semibold text-green-900 mb-2">Tertiary Target (CC / Warm Intro)</p>
            <p className="text-green-800 text-sm font-medium mb-2">CTOs & Engineering Leaders</p>
            <ul className="ml-4 space-y-1 text-sm text-green-800">
              <ListItem>CTO</ListItem>
              <ListItem>VP Engineering</ListItem>
              <ListItem>Head of Engineering</ListItem>
              <ListItem>Tech Lead</ListItem>
            </ul>
          </div>

          <div className="bg-slate-50 border-l-4 border-slate-400 p-4 rounded mt-4">
            <p className="font-semibold text-slate-900 mb-2">Targeting Strategy:</p>
            <p className="text-slate-700 text-sm">
              Primary outreach to HR Directors (100+ employees) or CEOs (50-100 employees).
              Use CTOs as CC or for warm introductions after initial HR contact.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Contact Data Requirements" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 mb-2">Required Fields:</h4>
          <ul className="space-y-2">
            <ListItem type="check">First Name</ListItem>
            <ListItem type="check">Last Name</ListItem>
            <ListItem type="check">Job Title</ListItem>
            <ListItem type="check">Email Address</ListItem>
            <ListItem type="check">LinkedIn URL</ListItem>
            <ListItem type="check">Company Name</ListItem>
            <ListItem type="check">Company Size</ListItem>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-4">
            <p className="font-semibold text-blue-900 mb-1">Note:</p>
            <p className="text-blue-800 text-sm">
              Use Apollo enrichment first (1 credit per contact). Only use Clay waterfall if Apollo doesn't provide enough emails (more expensive at 5-6 credits).
            </p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function SignalsTab() {
  return (
    <>
      <ContentSection title="Buying Signals Framework" icon={<Briefcase className="w-5 h-5" />}>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-6">
          <p className="font-semibold text-amber-900 mb-2">CRITICAL RULE:</p>
          <p className="text-amber-800">
            Only contact companies that show at least <strong>ONE Tier 1 signal</strong>, or <strong>TWO or more Tier 2/3 signals</strong> combined.
            <br />
            <strong>Do NOT spray — signal-based targeting only.</strong>
          </p>
        </div>
      </ContentSection>

      <ContentSection title="Tier 1 Signals (Highest Priority)" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="font-semibold text-red-900 mb-2">Active IT Job Postings</p>
            <ul className="ml-4 space-y-1 text-sm text-red-800">
              <ListItem>Open IT roles on LinkedIn, Indeed, Xing, Stepstone posted <strong>30+ days ago</strong></ListItem>
              <ListItem>Keywords: Software Engineer, Backend Developer, DevOps, Cloud Engineer, Java Developer, Python Developer, IT Manager</ListItem>
              <ListItem><strong>Same job reposted multiple times</strong> — strong signal of failed internal hiring</ListItem>
              <ListItem><strong>Job ad available in multiple languages</strong> — signal they are looking outside Germany/Austria/Switzerland</ListItem>
            </ul>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
            <p className="font-semibold text-orange-900 mb-2">Posting for Internal Recruiter</p>
            <p className="text-orange-800 text-sm mb-2">
              Company advertising for 'Talent Acquisition Manager' or 'IT Recruiter' — they have a pipeline problem
            </p>
            <p className="text-orange-700 text-sm">
              <strong>Opportunity:</strong> Position People Focus as faster & more cost-effective than building internal function
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Tier 2 Signals" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">Company Growth Signals</p>
            <ul className="ml-4 space-y-1 text-sm text-blue-800">
              <ListItem>LinkedIn headcount grew <strong>20%+ in last 6 months</strong></ListItem>
              <ListItem>Recent <strong>Series A or B funding</strong> (last 12 months) — needs to scale team fast</ListItem>
              <ListItem>New office opening or new product line announced</ListItem>
              <ListItem><strong>New CTO or VP Engineering appointed</strong> (last 90 days) — often triggers new hiring approach</ListItem>
            </ul>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="font-semibold text-green-900 mb-2">Market Entry / Expansion</p>
            <ul className="ml-4 space-y-1 text-sm text-green-800">
              <ListItem>DACH company expanding to new European market</ListItem>
              <ListItem>Recent press release about new product or partnership requiring tech build-out</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Tier 3 Signals" icon={<FileText className="w-5 h-5" />}>
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
          <p className="font-semibold text-purple-900 mb-2">Frustration Signals</p>
          <ul className="ml-4 space-y-1 text-sm text-purple-800">
            <ListItem>Glassdoor / Kununu reviews mentioning 'understaffed', 'too slow to hire', 'overworked team'</ListItem>
            <ListItem>CTO or CEO LinkedIn post about hiring challenges or talent shortage</ListItem>
            <ListItem><strong>Job ad older than 90 days still active</strong> — high frustration signal</ListItem>
          </ul>
        </div>
      </ContentSection>
    </>
  );
}
