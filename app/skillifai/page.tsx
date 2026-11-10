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
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import { Target, Users, Filter, Code, TrendingUp, FileText, CheckSquare, BarChart3, Zap, FolderOpen } from 'lucide-react';

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

export default function SkillifaiPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [assignee, setAssignee] = useState<Assignee | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('skillifai', DEFAULT_STATUSES.skillifai || 'Active'));
    setAssignee(getStoredAssignee('skillifai', getClientAssignee('skillifai')));

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
    setClientStatus('skillifai', newStatus);
  };
  const handleAssigneeChange = (newAssignee: Assignee) => {
    setAssignee(newAssignee);
    setStoredAssignee('skillifai', newAssignee);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const newPath = tabId === 'overview' ? '/skillifai' : `/skillifai/${tabId}`;
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
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl lg:text-2xl font-bold text-blue-600">SK</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 lg:space-x-3 flex-wrap">
                <h1 className="text-xl lg:text-3xl font-bold text-slate-900">Skillifai</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
                {isAdmin && <AssigneeBadge assignee={assignee} onAssigneeChange={handleAssigneeChange} size="md" />}
              </div>
              <p className="text-sm lg:text-base text-slate-600 break-words">AI Skills Training & Adoption for Slovenian SMEs</p>
            </div>
          </div>
          <a
            href="https://skillifai.si"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline inline-block"
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
              <PerformanceTabDynamic clientId="skillifai" />
              <CampaignsTabDynamic clientId="skillifai" />
            </>
          )}
          {activeTab === 'documents' && <DocumentsTab />}
          {activeTab === 'tasks' && (
            <TasksTab clientId="skillifai" defaultTasks={[]} />
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
            Skillifai develops practical AI skills and helps companies introduce AI into business processes through departmental training programmes and broader AI adoption solutions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Focus" value="AI Skills & Adoption" />
            <InfoCard label="Target Market" value="Slovenia" />
            <InfoCard label="Business Model" value="B2B Training & Consulting" />
            <InfoCard label="Employee Range" value="20–250" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="What Skillifai Offers" icon={<TrendingUp className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="check">Practical AI skills training for business processes</ListItem>
          <ListItem type="check">AI adoption and implementation support</ListItem>
          <ListItem type="check">Departmental AI training programmes</ListItem>
          <ListItem type="check">Broader AI projects (EUR 10,000+)</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Target Market Summary" icon={<Target className="w-5 h-5" />}>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="font-semibold text-blue-900 mb-2">Who Skillifai Serves:</p>
          <p className="text-blue-800">
            Slovenian SMEs with 20–250 employees and sufficiently large relevant teams, including companies in manufacturing, logistics, professional services, and other sectors with strong AI adoption potential.
          </p>
        </div>
      </ContentSection>
    </>
  );
}

function ICPAndPersonasTab() {
  return (
    <>
      <ContentSection title="Ideal Customer Profile" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 mb-3">MUST HAVE:</h4>
          <ul className="space-y-2">
            <ListItem type="check">Located in Slovenia</ListItem>
            <ListItem type="check">20–250 employees (sweet spot: 50+)</ListItem>
            <ListItem type="check">Sufficiently large relevant team for AI training impact</ListItem>
            <ListItem type="check">Public financial data available</ListItem>
            <ListItem type="check">Commercial potential for EUR 10,000+ projects</ListItem>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-4">
            <p className="font-semibold text-blue-900 mb-2">Target Company Size:</p>
            <p className="text-blue-800 text-sm">
              50–250 employees with established operations and readiness for AI adoption
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Disqualifiers" icon={<Target className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="cross">Outside Slovenia</ListItem>
          <ListItem type="cross">Software development or IT services</ListItem>
          <ListItem type="cross">IT outsourcing or IT consulting</ListItem>
          <ListItem type="cross">Management or business consulting</ListItem>
          <ListItem type="cross">Too few relevant team members</ListItem>
          <ListItem type="cross">No management support for AI adoption</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Target Industries" icon={<Filter className="w-5 h-5" />}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            'Manufacturing',
            'Logistics',
            'Wholesale/Distribution',
            'Professional Services',
            'Retail',
            'Hospitality',
            'Real Estate',
            'Finance',
            'Healthcare',
          ].map((industry) => (
            <div key={industry} className="bg-blue-100 px-3 py-2 rounded text-sm">
              {industry}
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection title="Target Job Titles / Buyer Personas" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">Target Decision Makers</p>
            <p className="text-blue-800 text-sm">
              Primary focus: CEO, Directors, and business leaders. Secondary focus: HR/L&D leaders at 50+ employees.
            </p>
          </div>

          {/* Tier 1: Executive */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-lg">Company Leadership (Tier 1)</h4>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-3">
              <p className="text-blue-900 text-sm">
                C-level executives and directors who approve training and broader AI projects.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {[
                'CEO',
                'Director',
                'Managing Director',
                'Owner',
              ].map((position, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded px-2 py-1.5 text-xs">
                  {position}
                </div>
              ))}
            </div>
          </div>

          {/* Tier 2: HR */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">2</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-lg">HR & Learning Development (Tier 2)</h4>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded mb-3">
              <p className="text-green-900 text-sm">
                HR leaders responsible for team skills development and training. Most effective at 50+ employees.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {[
                'HR Director',
                'HR Manager',
                'Head of HR',
                'Head of L&D',
              ].map((position, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded px-2 py-1.5 text-xs">
                  {position}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function FiltersTab() {
  return (
    <>
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-6">
        <p className="font-semibold text-amber-900 mb-1">Internal Tab - Admin Only:</p>
        <p className="text-amber-800 text-sm">
          This tab contains your lead generation search criteria and is only visible to your team.
        </p>
      </div>

      <ContentSection title="Clay Search Criteria" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 mb-3">Geography:</h4>
          <ul className="space-y-2">
            <ListItem>Slovenia (primary market)</ListItem>
          </ul>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Company Size:</h4>
          <ul className="space-y-2">
            <ListItem>20–250 employees (optimal: 50+)</ListItem>
            <ListItem>Exclude: smaller companies without team capacity</ListItem>
          </ul>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Target Industries:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              'Manufacturing',
              'Logistics & Distribution',
              'Professional Services',
              'Retail',
              'Hospitality',
              'Real Estate',
              'Finance',
              'Healthcare',
            ].map((industry) => (
              <div key={industry} className="bg-slate-100 px-3 py-2 rounded text-sm border border-slate-200">
                {industry}
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Keywords & Signals:</h4>
          <CodeBlock code={`AI OR Copilot OR ChatGPT OR "artificial intelligence" OR "machine learning" OR digitalisation OR "digital transformation" OR "skills development" OR "team training"`} />

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Exclusions:</h4>
          <CodeBlock code={`NOT (software development OR "IT services" OR "IT consulting" OR "IT outsourcing" OR "management consulting" OR "business consulting")`} />
        </div>
      </ContentSection>
    </>
  );
}

function PromptsTab() {
  const icpPrompt = `You are analyzing a company to determine if they match Skillifai's Ideal Customer Profile (ICP).

TARGET PROFILE:
- Location: Slovenia
- Employee count: 20–250 (optimal: 50+)
- Industries: Manufacturing, Logistics, Professional Services, Retail, Hospitality, Real Estate, Finance, Healthcare
- Commercial potential: EUR 10,000+ projects
- Team capacity: Sufficiently large relevant team for AI training

ANALYZE FOR:
1. Location: Are they based in Slovenia?
2. Size: Do they have 20–250 employees?
3. Industry: Do they operate in target industries?
4. Financial data: Is public financial data available?
5. Commercial potential: Can they support EUR 10,000+ projects?
6. Team capacity: Do they have a sufficiently large team for training impact?

DISQUALIFIERS:
- Outside Slovenia
- Software development or IT services
- IT consulting/outsourcing
- Management or business consulting
- Too few team members
- No management support for AI adoption

OUTPUT:
- Answer: Yes / No / Unsure
- Reasoning: 2-3 sentences explaining location, size, industry, and commercial potential
- Confidence: High / Medium / Low

Only answer "Yes" if confident the company:
- Is based in Slovenia
- Has 20–250 employees (preferably 50+)
- Operates in target industries
- Shows commercial potential for EUR 10,000+ projects`;

  return (
    <>
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-6">
        <p className="font-semibold text-amber-900 mb-1">Internal Tab - Admin Only:</p>
        <p className="text-amber-800 text-sm">
          This tab contains your AI prompts for lead qualification and is only visible to your team.
        </p>
      </div>

      <ContentSection title="ICP Matching Prompt (Anthropic)" icon={<Code className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            This prompt is used in Clay to analyze company profiles and determine if they match Skillifai's ICP.
          </p>
          <CodeBlock code={icpPrompt} language="text" />
        </div>
      </ContentSection>

      <ContentSection title="Key Matching Criteria" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-3">
          <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
            <p className="font-medium text-green-900">✓ GOOD MATCH</p>
            <p className="text-green-800 text-sm mt-1">
              Slovenian manufacturing company with 120 employees and growth trajectory, no existing AI training programme, management interest in digital transformation.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
            <p className="font-medium text-red-900">✗ NOT A MATCH</p>
            <p className="text-red-800 text-sm mt-1">
              IT company, outside Slovenia, fewer than 20 employees, or software/IT consulting firm.
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
      <SequencesTab clientId="skillifai" />
      <div className="mt-8">
        <CampaignsTabGeneric />
      </div>
    </>
  );
}

function DocumentsTab() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      <ContentSection title="Uploaded Documents" icon={<FolderOpen className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-600">
              Upload and manage documents for your campaigns. All uploaded files will be available for download.
            </p>
            <FileUpload clientId="skillifai" onUploadComplete={handleUploadComplete} />
          </div>

          <FileList clientId="skillifai" refreshTrigger={refreshTrigger} />
        </div>
      </ContentSection>
    </>
  );
}
