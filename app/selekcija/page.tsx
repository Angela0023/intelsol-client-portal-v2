'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
import { ContentSection, CodeBlock, InfoCard, ListItem } from '../components/ContentSection';
import TasksTab, { TSLAB_DEFAULT_TASKS } from '../components/TasksTab';
import SequencesTab from '../components/SequencesTab';
import CampaignsTabDynamic from '../components/CampaignsTabDynamic';
import PerformanceTabDynamic from '../components/PerformanceTabDynamic';
import CampaignsTabGeneric from '../components/CampaignsTabGeneric';
import StatusBadge, { getClientStatus, setClientStatus, DEFAULT_STATUSES, type ClientStatus } from '../components/StatusBadge';
import DocumentsTabGeneric from '../components/DocumentsTabGeneric';
import { Target, Users, Filter, Code, TrendingUp, FileText, CheckSquare, BarChart3, Zap, FolderOpen, Mail } from 'lucide-react';

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

export default function SelekcijiaPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('selekcija', DEFAULT_STATUSES.selekcija));

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
    setClientStatus('selekcija', newStatus);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const newPath = tabId === 'overview' ? '/selekcija' : `/selekcija/${tabId}`;
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
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 lg:w-7 lg:h-7 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 lg:space-x-3 flex-wrap">
                <h1 className="text-xl lg:text-3xl font-bold text-slate-900">Selekcija.hr</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
              </div>
              <p className="text-sm lg:text-base text-slate-600 break-words">Online Psychometric Assessments for Slovenian Employers</p>
            </div>
          </div>
          <a
            href="https://selekcija.hr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-purple-600 hover:underline inline-block"
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
              <PerformanceTabDynamic clientId="selekcija" />
              <CampaignsTabDynamic clientId="selekcija" />
            </>
          )}
          {activeTab === 'documents' && (
            <DocumentsTabGeneric
              clientId="selekcija"
              clientName="Selekcija.hr"
              totalLeads={1850}
              totalCampaigns={8}
              accentColor="purple"
            />
          )}
          {activeTab === 'tasks' && (
            <TasksTab clientId="selekcija" defaultTasks={TSLAB_DEFAULT_TASKS} />
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
            Selekcija.hr is a Slovenia-based provider of online psychometric assessments for employers. They deliver personality and ability tests designed specifically for recruitment and talent management processes in the Slovenian market.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Industry" value="HR Technology / Psychometric Testing" />
            <InfoCard label="Business Model" value="B2B SaaS - Assessment Platform" />
            <InfoCard label="Location" value="Slovenia" />
            <InfoCard label="Service Type" value="Online Psychometric Assessments" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="What Selekcija.hr Offers" icon={<TrendingUp className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="check">Online psychometric personality assessments</ListItem>
          <ListItem type="check">Ability and aptitude testing</ListItem>
          <ListItem type="check">Candidate profiling for recruitment</ListItem>
          <ListItem type="check">Talent management and assessment solutions</ListItem>
          <ListItem type="check">Customized assessment packages for employers</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Target Market Summary" icon={<Target className="w-5 h-5" />}>
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
          <p className="font-semibold text-purple-900 mb-2">Who Selekcija.hr Serves:</p>
          <p className="text-purple-800">
            HR Directors, Talent Acquisition Managers, and Organizational Psychologists at companies with 100-1,000 employees in Slovenia who conduct recurring recruitment and need structured assessment tools.
          </p>
        </div>
      </ContentSection>
    </>
  );
}

function ICPAndPersonasTab() {
  const hrDirectors = [
    'HR Director', 'Head of HR', 'HR Manager', 'Human Resources Director', 'VP of Human Resources', 'Chief Human Resources Officer', 'CHRO', 'Director of Talent', 'Head of Talent Management', 'HR Business Partner', 'Senior HR Manager', 'HR Operations Manager'
  ];

  const talentManagers = [
    'Talent Acquisition Manager', 'Talent Manager', 'Recruiting Manager', 'Head of Recruitment', 'Director of Talent Acquisition', 'Recruitment Manager', 'Hiring Manager', 'Senior Recruiter', 'Recruitment Specialist', 'Talent Development Manager', 'Career Development Manager'
  ];

  const psychologists = [
    'Organizational Psychologist', 'Industrial Psychologist', 'HR Psychologist', 'Assessment Specialist', 'Selection Consultant', 'Talent Consultant', 'Organizational Development Manager', 'Organizational Development Specialist', 'HR Consultant'
  ];

  return (
    <>
      <ContentSection title="Ideal Customer Profile" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 mb-3">MUST HAVE:</h4>
          <ul className="space-y-2">
            <ListItem type="check">HR Department with active recruitment needs</ListItem>
            <ListItem type="check">100-1,000 employees</ListItem>
            <ListItem type="check">Recurring/frequent hiring (not one-time)</ListItem>
            <ListItem type="check">Based in Slovenia</ListItem>
            <ListItem type="check">Conducts structured recruitment processes</ListItem>
            <ListItem type="check">Budget for recruitment tools and assessments</ListItem>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-4">
            <p className="font-semibold text-blue-900 mb-2">Company Types (Preferred):</p>
            <p className="text-blue-800 text-sm">
              Manufacturing companies, technology firms, professional services, financial institutions, healthcare organizations, and larger organizations with structured HR departments.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Disqualifiers" icon={<Target className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="cross">Under 100 employees</ListItem>
          <ListItem type="cross">No active or recurring recruitment needs</ListItem>
          <ListItem type="cross">Located outside Slovenia</ListItem>
          <ListItem type="cross">No HR department (one-person HR function)</ListItem>
          <ListItem type="cross">Only hiring contractors/temporary staff</ListItem>
          <ListItem type="cross">Unwilling to use structured assessment tools</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Target Job Titles / Buyer Personas" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-6">
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
            <p className="font-semibold text-purple-900 mb-2">Target Positions for Selekcija.hr</p>
            <p className="text-purple-800 text-sm">
              The following job titles represent HR leaders and talent professionals at organizations in Slovenia. These are the exact positions to target when sourcing leads.
            </p>
          </div>

          {/* HR Directors */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-lg">HR Directors & Leadership ({hrDirectors.length})</h4>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-3">
              <p className="text-blue-900 text-sm">
                HR executives and managers responsible for recruitment strategy, HR operations, and talent decisions at the company level.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {hrDirectors.map((position, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded px-2 py-1.5 text-xs">
                  {position}
                </div>
              ))}
            </div>
          </div>

          {/* Talent Acquisition */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">2</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-lg">Talent Acquisition Managers ({talentManagers.length})</h4>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded mb-3">
              <p className="text-purple-900 text-sm">
                Recruiting professionals who directly manage hiring processes, candidate screening, and recruitment operations. They actively seek assessment tools.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {talentManagers.map((position, index) => (
                <div key={index} className="bg-purple-50 border border-purple-200 rounded px-2 py-1.5 text-xs">
                  {position}
                </div>
              ))}
            </div>
          </div>

          {/* Organizational Psychologists */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">3</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-lg">Organizational Psychologists ({psychologists.length})</h4>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded mb-3">
              <p className="text-green-900 text-sm">
                Specialists in talent assessment, organizational development, and selection consulting who recommend or directly implement psychometric tools.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {psychologists.map((position, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded px-2 py-1.5 text-xs">
                  {position}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-violet-50 border-l-4 border-violet-500 p-4 rounded">
            <p className="font-semibold text-violet-900 mb-2">Total Positions: {hrDirectors.length + talentManagers.length + psychologists.length}</p>
            <p className="text-violet-800 text-sm">
              Use these exact job titles when identifying prospects. HR Directors are primary decision-makers. Talent Acquisition Managers are power users who influence decisions. Organizational Psychologists are technical evaluators of assessment quality.
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
          </ul>
        </div>
      </ContentSection>
    </>
  );
}

function FiltersTab() {
  return (
    <>
      <ContentSection title="Clay Search Criteria" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 mb-3">Location:</h4>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="font-semibold text-amber-900 mb-1">Focus Market:</p>
            <p className="text-amber-800 text-sm">
              <strong>Slovenia</strong> is the primary target market. Start here and refine based on company size and industry.
            </p>
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Company Size:</h4>
          <ul className="space-y-2">
            <ListItem>100-250 employees</ListItem>
            <ListItem>251-500 employees</ListItem>
            <ListItem>501-1000 employees</ListItem>
          </ul>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Industry Filters:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              'Manufacturing',
              'Technology',
              'Professional Services',
              'Financial Services',
              'Healthcare',
              'Retail',
              'Telecommunications',
              'Business Services',
              'Education',
              'Government/Public Sector',
            ].map((industry) => (
              <div key={industry} className="bg-slate-100 px-3 py-2 rounded text-sm border border-slate-200">
                {industry}
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Keywords:</h4>
          <CodeBlock code={`HR OR "recruitment" OR "talent acquisition" OR "psychometric" OR "assessment" OR "hiring"`} />
        </div>
      </ContentSection>
    </>
  );
}

function PromptsTab() {
  const icpPrompt = `You are analyzing a company's website to determine if they match our Ideal Customer Profile (ICP) for psychometric assessment services.

TARGET PROFILE:
- Located in Slovenia
- 100-1,000 employees
- Has active HR department with recruitment responsibilities
- Conducts regular/recurring hiring (not one-time)
- Industries: Manufacturing, Technology, Professional Services, Financial, Healthcare, etc.
- NOT a startup (needs stability and regular hiring needs)
- NOT one-person operation

ANALYZE THE WEBSITE FOR:
1. Company Size: Is this a medium to large organization?
2. Industry: Do they operate in target industries?
3. HR Department: Is there clear HR/Recruitment function?
4. Hiring Activity: Do they appear to hire regularly?
5. Location: Are they clearly based in Slovenia?
6. Professionalism: Does the company appear legitimate and established?

OUTPUT:
- Answer: Yes / No / Unsure
- Reasoning: 2-3 sentence explanation of why they match or don't match
- Confidence: High / Medium / Low

Only answer "Yes" if you are confident this company:
- Has 100-1,000 employees
- Is actively hiring
- Has an HR department
- Is based in Slovenia
- Appears to be an established, legitimate organization`;

  return (
    <>
      <ContentSection title="ICP Matching Prompt (Anthropic)" icon={<Code className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            This prompt is used in Clay to analyze company websites and determine if they match Selekcija.hr's ICP.
          </p>
          <CodeBlock code={icpPrompt} language="text" />
        </div>
      </ContentSection>

      <ContentSection title="Key Matching Criteria" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-3">
          <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
            <p className="font-medium text-green-900">✓ GOOD MATCH</p>
            <p className="text-green-800 text-sm mt-1">
              Established Slovenian company with 100-1,000 employees actively hiring across manufacturing, technology, or professional services sectors.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
            <p className="font-medium text-red-900">✗ NOT A MATCH</p>
            <p className="text-red-800 text-sm mt-1">
              Startup with under 100 employees, company outside Slovenia, one-person HR function, or no hiring activity.
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
      <SequencesTab clientId="selekcija" />
      <div className="mt-8">
        <CampaignsTabGeneric />
      </div>
    </>
  );
}
