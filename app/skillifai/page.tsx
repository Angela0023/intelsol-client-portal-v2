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
import { getClientAssignee, type Assignee } from '../../lib/auth';
import AssigneeBadge, { getStoredAssignee, setStoredAssignee } from '../components/AssigneeBadge';
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
          {activeTab === 'documents' && <DocumentsTabGeneric clientId="skillifai" clientName="SkillIfAi" />}
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
      <ContentSection title="What They Sell" icon={<FileText className="w-5 h-5" />}>
        <div className="space-y-4">
          <p>
            Skillifai develops practical AI skills and helps companies introduce AI into business processes through:
          </p>
          <ul className="space-y-2">
            <ListItem>Departmental AI training programmes</ListItem>
            <ListItem>Broader AI adoption and implementation solutions</ListItem>
            <ListItem>Custom projects (EUR 10,000+)</ListItem>
          </ul>
        </div>
      </ContentSection>

      <ContentSection title="Target Market" icon={<Target className="w-5 h-5" />}>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="font-semibold text-blue-900 mb-2">Primary Focus:</p>
          <p className="text-blue-800">
            Slovenian SMEs with approximately 20–250 employees with sufficiently large relevant teams.
          </p>
        </div>
      </ContentSection>

      <ContentSection title="Best-Fit Customers" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded">
            <p className="font-semibold text-amber-900 mb-2">Current Customers (To Be Confirmed)</p>
            <ul className="space-y-1 text-amber-800 text-sm">
              <li>• HS Plus <span className="italic">(relationship status & approval pending)</span></li>
              <li>• Petrol <span className="italic">(relationship status & approval pending)</span></li>
              <li>• Makro 5 <span className="italic">(relationship status & approval pending)</span></li>
            </ul>
            <p className="text-amber-800 text-xs mt-2">Permission to reference and inclusion in best-fit list must be confirmed before outreach use.</p>
          </div>
          <div className="bg-slate-50 border-l-4 border-slate-400 p-3 rounded">
            <p className="font-semibold text-slate-900 mb-2">Dream Customers</p>
            <p className="text-slate-600 text-sm">To be confirmed with Skillifai during strategy session.</p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function ICPAndPersonasTab() {
  return (
    <>
      <ContentSection title="Geography" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-3">
          <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
            <p className="font-semibold text-green-900 mb-1">Primary:</p>
            <p className="text-green-800 text-sm">Slovenia (all regions, equal priority)</p>
          </div>
          <div className="bg-slate-50 border-l-4 border-slate-400 p-3 rounded">
            <p className="font-semibold text-slate-900 mb-1">Future:</p>
            <p className="text-slate-600 text-sm">Croatia (post-validation expansion, NOT in initial lists)</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Company Size" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-3">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
            <p className="font-semibold text-blue-900 mb-1">Sweet Spot:</p>
            <p className="text-blue-800 text-sm">50–250 employees</p>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
            <p className="font-semibold text-blue-900 mb-1">Lower Bound:</p>
            <p className="text-blue-800 text-sm">20 employees (if team is sufficiently large and potential is clear)</p>
          </div>
          <div className="bg-slate-50 border-l-4 border-slate-400 p-3 rounded">
            <p className="font-semibold text-slate-900 mb-2">Assessment Factors:</p>
            <ul className="space-y-1 text-slate-600 text-sm">
              <li>• Relevant team size for training impact</li>
              <li>• Public financial data available</li>
              <li>• Commercial potential for EUR 10,000+ projects</li>
              <li>• Growth trajectory</li>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Target Industries" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-900 mb-2">Tier 1 (Strongest Fit):</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['Manufacturing', 'Wholesale & distribution', 'Logistics'].map((industry) => (
                <div key={industry} className="bg-green-100 px-3 py-2 rounded text-sm">
                  {industry}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold text-slate-900 mb-2">Tier 2 (Confirmed Fit):</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['Professional services', 'Retail', 'Hospitality', 'Real estate', 'Finance', 'Insurance', 'Healthcare', 'Pharmaceuticals'].map((industry) => (
                <div key={industry} className="bg-blue-100 px-3 py-2 rounded text-sm">
                  {industry}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold text-slate-900 mb-2">To Assess Manually:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['Construction', 'Tourism', 'Legal, accounting, architectural firms (do not auto-exclude)'].map((industry) => (
                <div key={industry} className="bg-slate-100 px-3 py-2 rounded text-sm border border-slate-200">
                  {industry}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Business Model Characteristics" icon={<Target className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem>Relevant team size for training</ListItem>
          <ListItem>Repetitive document, administrative, analytical processes</ListItem>
          <ListItem>Sales processes with manual components</ListItem>
          <ListItem>B2B and B2C both in scope</ListItem>
          <ListItem>AI adoption potential (not yet heavily saturated in their market)</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Exclude Explicitly" icon={<Target className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="cross">Software development / IT services</ListItem>
          <ListItem type="cross">IT outsourcing / IT consulting</ListItem>
          <ListItem type="cross">Management & business consulting</ListItem>
          <ListItem type="cross">Direct competitors (list TBD)</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Decision Makers & Buying Roles" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <h4 className="font-semibold text-slate-900">Primary Buyer (Tier 1) – 75% Focus</h4>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-2">
              <p className="text-blue-900 font-medium text-sm mb-1">Company Leadership</p>
              <p className="text-blue-800 text-sm mb-2">CEO, Director, Managing Director, Owner</p>
              <p className="text-blue-800 text-xs italic">Best for: SMEs (20–250 employees) with training + broader AI project potential</p>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">2</span>
              </div>
              <h4 className="font-semibold text-slate-900">Secondary Buyer (Tier 2) – 25% Focus</h4>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded mb-2">
              <p className="text-green-900 font-medium text-sm mb-1">HR & Learning & Development</p>
              <p className="text-green-800 text-sm mb-2">HR Director, HR Manager, Head of HR, Head of L&D</p>
              <p className="text-green-800 text-xs italic">Best for: 50+ employees with established HR function. Focus: Team skills development initiatives</p>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                <span className="text-slate-600 font-bold text-sm">3</span>
              </div>
              <h4 className="font-semibold text-slate-900">Future Testing (Not Initial Priority)</h4>
            </div>
            <div className="bg-slate-50 border-l-4 border-slate-400 p-3 rounded">
              <p className="text-slate-900 font-medium text-sm mb-1">Operations, Sales & Marketing</p>
              <p className="text-slate-600 text-sm mb-2">COO, Operations Director, Head of Sales, Head of Marketing</p>
              <p className="text-slate-600 text-xs italic">Use Case: Champion for specific AI use cases (later stage)</p>
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="font-semibold text-amber-900 mb-2">Targeting Strategy</p>
            <ul className="space-y-1 text-amber-800 text-sm">
              <li>• <strong>75% focus:</strong> CEO/Director outreach</li>
              <li>• <strong>25% focus:</strong> HR/L&D (50+ employees primarily)</li>
              <li>• <strong>One active campaign per company</strong> (avoid duplicate contact)</li>
              <li>• A/B test by industry, persona, and message</li>
              <li>• Adjust targeting based on results after 6 weeks</li>
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
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-6">
        <p className="font-semibold text-amber-900 mb-1">Internal Tab - Admin Only:</p>
        <p className="text-amber-800 text-sm">
          This tab contains your lead generation search criteria and is only visible to your team.
        </p>
      </div>

      <ContentSection title="Technology & Buying Signals" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Tools & Platforms (Hypotheses to Validate)</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Microsoft 365 / Copilot</li>
              <li>• Google Workspace</li>
              <li>• ChatGPT</li>
              <li>• Business CRM/ERP systems</li>
              <li>• Other AI tools</li>
            </ul>
            <p className="text-xs text-slate-500 mt-2"><em>Note: No tool is a mandatory filter. Validate technology patterns with best-fit customer data.</em></p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Verified Buying Signals</h4>
            <div className="space-y-3">
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                <p className="font-semibold text-green-900 mb-1">Tier 1 - Explicit need for AI training</p>
                <p className="text-green-800 text-sm">Published request, plan, or expressed interest from decision-maker; record source, date, target team</p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                <p className="font-semibold text-green-900 mb-1">Tier 1 - Active AI project facing obstacles</p>
                <p className="text-green-800 text-sm">Verified pilot/project with stated adoption or implementation problem; licence purchase alone is insufficient</p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p className="font-semibold text-blue-900 mb-1">Tier 2 - AI tool or licence rollout</p>
                <p className="text-blue-800 text-sm">Documented Copilot or similar tool adoption; verify scope and training needs</p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p className="font-semibold text-blue-900 mb-1">Tier 2 - Digitalisation or skills development programme</p>
                <p className="text-blue-800 text-sm">Specific programme, responsible person, training plan; verify current and AI-relevant</p>
              </div>
              <div className="bg-slate-50 border-l-4 border-slate-400 p-3 rounded">
                <p className="font-semibold text-slate-900 mb-1">Tier 3 - Team growth or leadership change</p>
                <p className="text-slate-600 text-sm">New hires or new leadership tasked with process improvement; weak signal without additional verified need</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Where to Find Signals</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• LinkedIn profile changes (new hires, promotions)</li>
              <li>• Company news (funding, partnerships, AI announcements)</li>
              <li>• LinkedIn job postings (training, operations, process improvement roles)</li>
              <li>• Company website (digitalisation, AI strategy mentions)</li>
              <li>• Industry publications and press releases</li>
            </ul>
          </div>
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
