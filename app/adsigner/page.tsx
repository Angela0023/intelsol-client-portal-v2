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
import DocumentsTabGeneric from '../components/DocumentsTabGeneric';
import { Target, Users, Filter, Code, TrendingUp, FileText, CheckSquare, BarChart3, Zap, FolderOpen, Mail } from 'lucide-react';

const tabs = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'icp', label: 'ICP Profile', icon: Target },
  { id: 'filters', label: 'Clay Filters', icon: Filter },
  { id: 'prompts', label: 'AI Prompts', icon: Code },
  { id: 'personas', label: 'Buyer Personas', icon: Users },
  { id: 'sequences', label: 'Email Sequences', icon: Mail },
  { id: 'campaigns', label: 'Campaigns', icon: Zap },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'documents', label: 'Documents', icon: FolderOpen },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
];

export default function AdSignerPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Onboarding');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('adsigner', DEFAULT_STATUSES.adsigner));

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
    setClientStatus('adsigner', newStatus);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const newPath = tabId === 'overview' ? '/adsigner' : `/adsigner/${tabId}`;
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
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl lg:text-2xl font-bold text-teal-600">AS</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 lg:space-x-3 flex-wrap">
                <h1 className="text-xl lg:text-3xl font-bold text-slate-900">AdSigner</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
              </div>
              <p className="text-sm lg:text-base text-slate-600 break-words">Email Signature Marketing & Management Platform</p>
            </div>
          </div>
          <a
            href="https://www.adsigner.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-teal-600 hover:underline inline-block"
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
          {activeTab === 'icp' && <ICPTab />}
          {activeTab === 'filters' && <FiltersTab />}
          {activeTab === 'prompts' && <PromptsTab />}
          {activeTab === 'personas' && <PersonasTab />}
          {activeTab === 'sequences' && <SequencesTab clientId="adsigner" />}
          {activeTab === 'campaigns' && <CampaignsTabGeneric />}
          {activeTab === 'performance' && (
            <>
              <PerformanceTabDynamic clientId="adsigner" />
              <CampaignsTabDynamic clientId="adsigner" />
            </>
          )}
          {activeTab === 'documents' && (
            <DocumentsTabGeneric
              clientId="adsigner"
              clientName="AdSigner"
              totalLeads={0}
              totalCampaigns={0}
              accentColor="teal"
            />
          )}
          {activeTab === 'tasks' && (
            <TasksTab clientId="adsigner" defaultTasks={[]} />
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
            AdSigner (legal entity: Erpium d.o.o.) provides email signature marketing and management solutions.
            Their platform enables companies to turn every employee email into a brand-consistent marketing channel
            without requiring additional advertising spend.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Industry" value="Marketing Technology (MarTech)" />
            <InfoCard label="Product Category" value="Email Signature Management" />
            <InfoCard label="Business Model" value="B2B SaaS Platform" />
            <InfoCard label="Primary Markets" value="EU, Ex-Yugoslavia, UAE" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="What AdSigner Offers" icon={<TrendingUp className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="check">Centralized email signature management across organization</ListItem>
          <ListItem type="check">Brand consistency enforcement for all employee emails</ListItem>
          <ListItem type="check">Marketing banner campaigns inserted into email signatures</ListItem>
          <ListItem type="check">Analytics and tracking for signature engagement</ListItem>
          <ListItem type="check">Integration with major email platforms (Outlook, Gmail, etc.)</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Value Proposition" icon={<Target className="w-5 h-5" />}>
        <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded">
          <p className="font-semibold text-teal-900 mb-2">Core Message:</p>
          <p className="text-teal-800">
            Turn your existing email communication into a marketing channel without spending on new advertising.
            Every employee email becomes a brand touchpoint with consistent signatures and targeted marketing messages.
          </p>
        </div>
      </ContentSection>
    </>
  );
}

function ICPTab() {
  return (
    <>
      <ContentSection title="Ideal Customer Profile" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 mb-3">MUST HAVE:</h4>
          <ul className="space-y-2">
            <ListItem type="check">50+ employees (critical mass for ROI)</ListItem>
            <ListItem type="check">High volume of external email communication</ListItem>
            <ListItem type="check">Multiple departments sending client/prospect emails</ListItem>
            <ListItem type="check">Located in target geographies (Ex-Yugoslavia, EU, UAE)</ListItem>
            <ListItem type="check">Growth-oriented company culture</ListItem>
            <ListItem type="check">Active marketing or digital presence</ListItem>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-4">
            <p className="font-semibold text-blue-900 mb-2">Sweet Spot:</p>
            <p className="text-blue-800 text-sm">
              Companies with 100-500 employees that send thousands of external emails monthly and care about brand consistency.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Target Geographies" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-teal-600 mb-1">30%</div>
              <div className="text-sm font-medium text-slate-900">Ex-Yugoslavia</div>
              <div className="text-xs text-slate-600 mt-1">Slovenia, Croatia, Serbia, Bosnia, Montenegro, North Macedonia</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600 mb-1">50%</div>
              <div className="text-sm font-medium text-slate-900">European Union</div>
              <div className="text-xs text-slate-600 mt-1">Germany, Austria, Netherlands, Belgium, etc.</div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-amber-600 mb-1">10%</div>
              <div className="text-sm font-medium text-slate-900">UAE</div>
              <div className="text-xs text-slate-600 mt-1">Dubai, Abu Dhabi</div>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Buying Signals" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="space-y-2">
          <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
            <p className="font-medium text-green-900">Strong Signals:</p>
            <ul className="mt-2 space-y-1 text-sm text-green-800">
              <li>• Recent team expansion (hiring announcements)</li>
              <li>• Company rebranding or visual identity refresh</li>
              <li>• New IT infrastructure investments</li>
              <li>• GDPR/compliance initiatives mentioned</li>
              <li>• Marketing team growth or new CMO</li>
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
      <ContentSection title="Search Criteria" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 mb-3">Location:</h4>
          <p className="text-sm text-slate-600 mb-2">Target countries by priority:</p>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Tier 1: Ex-Yugoslavia (30%)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Slovenia', 'Croatia', 'Serbia', 'Bosnia and Herzegovina', 'Montenegro', 'North Macedonia'].map((country) => (
                  <div key={country} className="bg-teal-100 px-3 py-2 rounded text-sm">
                    {country}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Tier 2: European Union (50%)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['Germany', 'Austria', 'Netherlands', 'Belgium', 'Luxembourg', 'Switzerland'].map((country) => (
                  <div key={country} className="bg-blue-100 px-3 py-2 rounded text-sm">
                    {country}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Tier 3: UAE (10%)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['United Arab Emirates'].map((country) => (
                  <div key={country} className="bg-amber-100 px-3 py-2 rounded text-sm">
                    {country}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Company Size:</h4>
          <ul className="space-y-2">
            <ListItem>51-200 employees (primary target)</ListItem>
            <ListItem>201-500 employees (ideal size)</ListItem>
            <ListItem>501-1000 employees (good fit)</ListItem>
          </ul>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Keywords:</h4>
          <CodeBlock code={`email OR marketing OR "brand management" OR "corporate communications"`} />
        </div>
      </ContentSection>
    </>
  );
}

function PromptsTab() {
  const icpPrompt = `You are analyzing a company to determine if they are a good fit for an email signature management and marketing platform.

TARGET PROFILE:
- 50+ employees (ideally 100-500)
- High volume of external email communication
- Active marketing or sales teams
- Located in EU, Ex-Yugoslavia, or UAE
- Growth-oriented company
- Multiple departments (sales, marketing, support, etc.)

ANALYZE THE COMPANY FOR:
1. Company Size: Do they have 50+ employees? (Check LinkedIn, About page)
2. Email Volume Indicators: Do they have sales, marketing, support, or consulting teams that email clients?
3. Brand Awareness: Do they care about brand consistency? (Check website design, social presence)
4. Growth Stage: Are they actively growing? (Check hiring pages, news, funding)
5. Marketing Sophistication: Do they have a marketing team or CMO?
6. Geography: Are they in target regions (EU, Ex-Yugoslavia, UAE)?

POSITIVE INDICATORS:
- Multiple office locations
- Active job postings (especially marketing/sales)
- Recent rebranding or website redesign
- Professional services (consulting, agency, SaaS, etc.)
- B2B focus with high-touch sales

NEGATIVE INDICATORS:
- Very small team (<20 employees)
- Fully remote with no email-heavy functions
- Pure e-commerce/transactional business
- Government or non-profit (different buying process)

OUTPUT:
- Answer: Yes / No / Maybe
- Reasoning: 2-3 sentences explaining why they match or don't match
- Confidence: High / Medium / Low

Only answer "Yes" if confident they:
- Have 50+ employees
- Send high volumes of external emails
- Care about brand consistency
- Are in target geography`;

  return (
    <>
      <ContentSection title="ICP Qualification Prompt" icon={<Code className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            This prompt analyzes companies to determine if they match AdSigner's ideal customer profile.
          </p>
          <CodeBlock code={icpPrompt} language="text" />
        </div>
      </ContentSection>

      <ContentSection title="Key Matching Criteria" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-3">
          <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
            <p className="font-medium text-green-900">✓ GOOD MATCH</p>
            <p className="text-green-800 text-sm mt-1">
              Professional services firm with 200 employees, active sales and marketing teams, recent branding refresh, located in Germany or Slovenia.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
            <p className="font-medium text-red-900">✗ NOT A MATCH</p>
            <p className="text-red-800 text-sm mt-1">
              Small local business with 15 employees, mostly internal communication, no active marketing team, or pure e-commerce with automated emails only.
            </p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function PersonasTab() {
  const personas = [
    {
      tier: 1,
      name: 'Marketing Lead',
      color: 'blue',
      description: 'CMO, Marketing Director, Head of Marketing, VP Marketing',
      painPoints: [
        'Brand inconsistency across employee emails',
        'Missed marketing opportunities in email footers',
        'No visibility into email signature compliance',
        'Difficulty promoting campaigns to existing email audiences'
      ],
      value: 'Marketing leaders see every employee email as untapped marketing real estate'
    },
    {
      tier: 2,
      name: 'IT Lead',
      color: 'green',
      description: 'CTO, IT Director, IT Manager, Head of IT',
      painPoints: [
        'Manual signature updates are time-consuming',
        'Security and compliance risks with unmanaged signatures',
        'Inconsistent implementation across email platforms',
        'Support tickets for signature changes'
      ],
      value: 'IT teams want centralized management and reduced manual work'
    },
    {
      tier: 3,
      name: 'HR Lead',
      color: 'purple',
      description: 'HR Director, Head of People, HR Manager',
      painPoints: [
        'Onboarding includes manual signature setup',
        'Keeping signatures updated when people change roles',
        'Ensuring company policies in signatures',
        'Managing signature changes at scale'
      ],
      value: 'HR wants automated onboarding and role change processes'
    },
    {
      tier: 4,
      name: 'Sales Lead',
      color: 'amber',
      description: 'VP Sales, Sales Director, Head of Sales',
      painPoints: [
        'Inconsistent messaging from sales team emails',
        'Missed opportunities to promote events/webinars',
        'No way to A/B test signature CTAs',
        'Difficulty tracking signature click-through'
      ],
      value: 'Sales leaders want every email to support pipeline generation'
    },
    {
      tier: 5,
      name: 'SEO/Digital Marketing',
      color: 'indigo',
      description: 'Digital Marketing Manager, SEO Specialist, Growth Marketer',
      painPoints: [
        'Untapped channel for content promotion',
        'No data on email signature performance',
        'Missing attribution for signature-driven traffic',
        'Lack of integration with marketing stack'
      ],
      value: 'Digital marketers see signatures as high-ROI channel'
    },
    {
      tier: 6,
      name: 'C-Level / CEO',
      color: 'teal',
      description: 'CEO, Managing Director, COO, CFO',
      painPoints: [
        'Brand inconsistency damages company image',
        'Wasted marketing opportunity in daily emails',
        'Compliance and legal risks',
        'Inefficient processes across departments'
      ],
      value: 'Executives want brand consistency and operational efficiency'
    }
  ];

  const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' },
    indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600' },
    teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-600' },
  };

  return (
    <>
      <ContentSection title="Buyer Personas" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-6">
          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded">
            <p className="font-semibold text-teal-900 mb-2">Multi-Stakeholder Decision</p>
            <p className="text-teal-800 text-sm">
              Email signature solutions typically require buy-in from multiple departments: Marketing wants brand control,
              IT needs technical feasibility, and executives care about ROI. Target all personas in your outreach strategy.
            </p>
          </div>

          {personas.map((persona) => {
            const colors = colorClasses[persona.color];
            return (
              <div key={persona.tier} className={`${colors.bg} border-l-4 ${colors.border} rounded-lg p-4`}>
                <div className="flex items-start space-x-3 mb-3">
                  <div className={`w-8 h-8 ${colors.bg} rounded-full flex items-center justify-center border-2 ${colors.border}`}>
                    <span className={`${colors.text} font-bold text-sm`}>{persona.tier}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${colors.text} text-lg`}>{persona.name}</h4>
                    <p className="text-slate-600 text-sm">{persona.description}</p>
                  </div>
                </div>

                <div className="ml-11">
                  <p className="font-medium text-slate-900 text-sm mb-2">Pain Points:</p>
                  <ul className="space-y-1 mb-3">
                    {persona.painPoints.map((pain, idx) => (
                      <li key={idx} className="text-slate-700 text-sm">• {pain}</li>
                    ))}
                  </ul>

                  <div className={`${colors.bg} border ${colors.border} rounded p-2`}>
                    <p className="text-slate-900 text-sm font-medium">Value Proposition:</p>
                    <p className="text-slate-700 text-sm mt-1">{persona.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ContentSection>
    </>
  );
}
