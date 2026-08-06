'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
import { ContentSection, CodeBlock, InfoCard, ListItem } from '../components/ContentSection';
import TasksTab, { BEEIT_DEFAULT_TASKS } from '../components/TasksTab';
import SequencesTab from '../components/SequencesTab';
import CampaignsTabDynamic from '../components/CampaignsTabDynamic';
import PerformanceTabDynamic from '../components/PerformanceTabDynamic';
import CampaignsTabGeneric from '../components/CampaignsTabGeneric';
import StatusBadge, { getClientStatus, setClientStatus, DEFAULT_STATUSES, type ClientStatus } from '../components/StatusBadge';
import { Target, Users, Filter, Code, TrendingUp, FileText, Layers, CheckSquare, BarChart3, Zap, Mail } from 'lucide-react';

const tabs = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'tier1', label: 'Tier 1 - Strategic', icon: TrendingUp },
  { id: 'tier2', label: 'Tier 2 - Growth', icon: Layers },
  { id: 'filters', label: 'Clay Filters', icon: Filter },
  { id: 'prompts', label: 'AI Prompts', icon: Code },
  { id: 'sequences', label: 'Email Sequences', icon: Mail },
  { id: 'campaigns', label: 'Campaigns', icon: Zap },
  { id: 'tracking', label: 'Search Tracking', icon: Target },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
];

export default function BeeItPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('beeit', DEFAULT_STATUSES.beeit));

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
    setClientStatus('beeit', newStatus);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const newPath = tabId === 'overview' ? '/beeit' : `/beeit/${tabId}`;
    window.history.pushState({}, '', newPath);
  };

  // Filter tabs based on admin access
  // Hide internal tabs (filters, prompts) from non-admin users
  const visibleTabs = isAdmin
    ? tabs
    : tabs.filter(tab => !['filters', 'prompts', 'personas'].includes(tab.id));


  return (
    <ClientLayout>
      <div className="p-4 lg:p-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-amber-600">B</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-slate-900">BeeIt</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
              </div>
              <p className="text-slate-600">eCommerce Development Agency Partner Program</p>
            </div>
          </div>
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
          {activeTab === 'tier1' && <Tier1Tab />}
          {activeTab === 'tier2' && <Tier2Tab />}
          {activeTab === 'filters' && <FiltersTab />}
          {activeTab === 'prompts' && <PromptsTab />}
          {activeTab === 'sequences' && <SequencesTab clientId="beeit" />}
          {activeTab === 'campaigns' && <CampaignsTabGeneric />}
          {activeTab === 'tracking' && <TrackingTab />}
          {activeTab === 'performance' && (
            <>
              <PerformanceTabDynamic clientId="beeit" />
              <CampaignsTabDynamic clientId="beeit" />
            </>
          )}
          {activeTab === 'tasks' && (
            <TasksTab clientId="beeit" defaultTasks={BEEIT_DEFAULT_TASKS} />
          )}
        </div>
      </div>
    </ClientLayout>
  );
}

function OverviewTab() {
  return (
    <>
      <ContentSection title="Campaign Overview" icon={<FileText className="w-5 h-5" />}>
        <div className="space-y-4">
          <p>
            BeeIt Track B targets <strong>digital agencies</strong> and <strong>system integrators</strong> that
            need white-label eCommerce development capacity for their clients.
          </p>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="font-semibold text-amber-900 mb-2">Target Audience:</p>
            <p className="text-amber-800">
              Agencies that build eCommerce solutions on Magento, Salesforce Commerce Cloud (SFCC), and Adobe Commerce
              but need additional development capacity or specialized expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <InfoCard label="Platforms" value="Magento, SFCC, Adobe Commerce" />
            <InfoCard label="Markets" value="Benelux, DACH, UK, USA" />
            <InfoCard label="Partner Type" value="White-Label Development" />
            <InfoCard label="Service Model" value="Sub-contracting / Capacity" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Two-Tier Strategy" icon={<Layers className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h4 className="font-semibold text-blue-900 mb-2">Tier 1: Strategic Agency Partners</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <ListItem>Large full-service agencies (50-300 staff)</ListItem>
              <ListItem>$10M+ annual revenue</ListItem>
              <ListItem>Deal Size: $80k - $350k+</ListItem>
              <ListItem>Long sales cycle (4-8 months)</ListItem>
              <ListItem>High-volume sub-contracted work</ListItem>
            </ul>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <h4 className="font-semibold text-green-900 mb-2">Tier 2: Growth Agency Partners</h4>
            <ul className="text-green-800 text-sm space-y-1">
              <ListItem>Mid-size digital agencies (15-80 staff)</ListItem>
              <ListItem>$2M - $10M annual revenue</ListItem>
              <ListItem>Deal Size: $20k - $80k+</ListItem>
              <ListItem>Medium sales cycle (4-8 weeks)</ListItem>
              <ListItem>Steady ongoing project work</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function Tier1Tab() {
  return (
    <>
      <ContentSection title="Tier 1: Strategic Agency Partners" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Deal Size" value="$80,000 - $350,000+" color="bg-blue-600 text-white" />
            <InfoCard label="Sales Cycle" value="4 - 8 months" color="bg-blue-600 text-white" />
            <InfoCard label="Agency Revenue" value="$10M+" color="bg-blue-600 text-white" />
            <InfoCard label="Agency Size" value="50 - 300 staff" color="bg-blue-600 text-white" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Target Buyer Personas (Tier 1)" icon={<Users className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem>SVP/VP of Delivery / Director of Delivery</ListItem>
          <ListItem>CEO / Managing Director</ListItem>
          <ListItem>Chief Technology Officer (CTO)</ListItem>
          <ListItem>VP of Engineering</ListItem>
          <ListItem>Head of Client Services</ListItem>
          <ListItem>Engagement Director</ListItem>
          <ListItem>Practice Lead (Commerce / Salesforce)</ListItem>
          <ListItem>Solutions Architect</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Prospecting Signals (Tier 1)" icon={<Target className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="check">Salesforce or Adobe partner needing SFCC/Magento dev capacity</ListItem>
          <ListItem type="check">Has enterprise retainer but lacking certified technical depth</ListItem>
          <ListItem type="check">Expanding geographic footprint (USA to Europe or vice versa)</ListItem>
          <ListItem type="check">Recently lost senior developer or had team reduction</ListItem>
          <ListItem type="check">Listed and active on Salesforce AppExchange</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Persona Example: VP of Delivery (USA)" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-slate-50 border-l-4 border-slate-400 p-4 rounded">
            <p className="font-semibold text-slate-900 mb-2">Goals:</p>
            <ul className="text-slate-700 text-sm space-y-1">
              <ListItem>Deliver client projects on time and on budget without burning internal team</ListItem>
              <ListItem>Access certified SFCC and Magento talent fast</ListItem>
              <ListItem>White-label development where client is managed by the agency</ListItem>
            </ul>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="font-semibold text-red-900 mb-2">Pain Points:</p>
            <ul className="text-red-800 text-sm space-y-1">
              <ListItem>Cannot find reliable nearshore/offshore partners matching quality bar</ListItem>
              <ListItem>Previous partners missed deadlines and damaged client relationships</ListItem>
              <ListItem>Timezone gaps cause review and approval delays</ListItem>
            </ul>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="font-semibold text-green-900 mb-2">Buying Triggers:</p>
            <ul className="text-green-800 text-sm space-y-1">
              <ListItem>Winning new enterprise client requiring SFCC development</ListItem>
              <ListItem>Internal dev team overloaded with concurrent projects</ListItem>
              <ListItem>Existing nearshore/offshore partner failed on key delivery</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function Tier2Tab() {
  return (
    <>
      <ContentSection title="Tier 2: Growth Agency Partners" icon={<Layers className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Deal Size" value="$20,000 - $80,000+" color="bg-green-600 text-white" />
            <InfoCard label="Sales Cycle" value="4 - 8 weeks" color="bg-green-600 text-white" />
            <InfoCard label="Agency Revenue" value="$2M - $10M" color="bg-green-600 text-white" />
            <InfoCard label="Agency Size" value="15 - 80 staff" color="bg-green-600 text-white" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Target Buyer Personas (Tier 2)" icon={<Users className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem>CEO / Founder (boutique agency)</ListItem>
          <ListItem>Head of Delivery</ListItem>
          <ListItem>Project Director</ListItem>
          <ListItem>Technical Lead / Lead Developer</ListItem>
          <ListItem>Head of eCommerce Practice</ListItem>
          <ListItem>Account Director</ListItem>
          <ListItem>Head of Partnerships</ListItem>
          <ListItem>Operations Director</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Prospecting Signals (Tier 2)" icon={<Target className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="check">Active on Clutch with eCommerce clients in portfolio</ListItem>
          <ListItem type="check">Posts about Magento or SFCC on LinkedIn regularly</ListItem>
          <ListItem type="check">Currently hiring for senior developer roles (capacity issues)</ListItem>
          <ListItem type="check">Client base overlaps with Fashion, Retail, or FMCG sectors</ListItem>
          <ListItem type="check">Strong design/strategy capability but limited development bench</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Persona Example: CEO/Founder (Netherlands)" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-slate-50 border-l-4 border-slate-400 p-4 rounded">
            <p className="font-semibold text-slate-900 mb-2">Goals:</p>
            <ul className="text-slate-700 text-sm space-y-1">
              <ListItem>Scale project delivery without growing full-time headcount</ListItem>
              <ListItem>Take on Magento Enterprise clients currently out of reach</ListItem>
              <ListItem>Improve delivery margins on existing project portfolio</ListItem>
            </ul>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="font-semibold text-red-900 mb-2">Pain Points:</p>
            <ul className="text-red-800 text-sm space-y-1">
              <ListItem>Small team overwhelmed when multiple large projects run concurrently</ListItem>
              <ListItem>Cannot find reliable Magento developers locally at competitive rates</ListItem>
              <ListItem>Clients pushing for faster delivery windows than team can support</ListItem>
            </ul>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="font-semibold text-green-900 mb-2">What Makes Them Say Yes:</p>
            <ul className="text-green-800 text-sm space-y-1">
              <ListItem>Demonstrated portfolio overlap (similar projects/clients)</ListItem>
              <ListItem>Flexible engagement model: T&M or fixed price</ListItem>
              <ListItem>Low-stakes pilot project to prove quality within two weeks</ListItem>
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
      <ContentSection title="Geographic Targeting" icon={<Filter className="w-5 h-5" />}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            'Netherlands',
            'Belgium',
            'Luxembourg',
            'Germany',
            'Austria',
            'Switzerland',
            'United Kingdom',
            'United States',
          ].map((country) => (
            <div key={country} className="bg-amber-100 px-3 py-2 rounded text-sm">
              {country}
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection title="Tier 1: Strategic Agencies - Clay Filters" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm">
            <p className="font-medium text-blue-900 mb-1">📍 Filter names match the exact Clay interface</p>
            <p className="text-blue-700 text-xs">Use "Find companies with filters" → "Company attributes" section</p>
          </div>

          <h4 className="font-semibold text-slate-900 mb-2">Company sizes:</h4>
          <ul className="space-y-1">
            <ListItem>51-200 employees</ListItem>
            <ListItem>201-500 employees</ListItem>
            <ListItem>501-1000 employees</ListItem>
          </ul>

          <h4 className="font-semibold text-slate-900 mt-4 mb-2">Annual revenue:</h4>
          <ul className="space-y-1">
            <ListItem>$10M - $25M</ListItem>
            <ListItem>$25M - $75M</ListItem>
            <ListItem>$75M - $100M</ListItem>
            <ListItem>$100M - $500M</ListItem>
          </ul>

          <h4 className="font-semibold text-slate-900 mt-4 mb-2">Industries to include:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              'IT Services and IT Consulting',
              'Software Development',
              'Technology, Information and Internet',
            ].map((industry) => (
              <div key={industry} className="bg-green-100 px-3 py-2 rounded text-sm border border-green-200">
                {industry}
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-slate-900 mt-4 mb-2">Industries to EXCLUDE:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              'Computer Networking Products',
              'IT System Data Services',
              'Computer & Network Security',
              'IT System Training and Support',
              'Telecommunications',
              'Cloud Computing',
              'Data Infrastructure and Analytics',
              'Computer Hardware Manufacturing',
              'IT System Installation and Disposal',
              'Outsourcing and Offshoring Consulting',
            ].map((industry) => (
              <div key={industry} className="bg-red-100 px-3 py-2 rounded text-sm border border-red-200">
                {industry}
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-slate-900 mt-4 mb-2">Description keywords to include:</h4>
          <CodeBlock code={`agency, system integrator, consultancy, digital agency, ecommerce, e-commerce, Salesforce, SFCC, commerce cloud, Magento, magento enterprise`} />

          <h4 className="font-semibold text-slate-900 mt-4 mb-2">Description keywords to EXCLUDE:</h4>
          <div className="bg-slate-100 p-3 rounded border border-slate-300 text-sm text-slate-700">
            Leave this field <strong>EMPTY</strong> in Clay - the industry exclusions are sufficient
          </div>

          <p className="text-xs text-blue-600 mt-2 bg-blue-50 p-2 rounded border border-blue-200">
            ⚠️ Format: Clay uses comma-separated keywords (shown above). Copy and paste exactly as written. The industry exclusions filter out non-agency companies.
          </p>
        </div>
      </ContentSection>

      <ContentSection title="Tier 2: Growth Agencies - Clay Filters" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 p-3 rounded text-sm">
            <p className="font-medium text-green-900 mb-1">📍 Filter names match the exact Clay interface</p>
            <p className="text-green-700 text-xs">Use "Find companies with filters" → "Company attributes" section</p>
          </div>

          <h4 className="font-semibold text-slate-900 mb-2">Company sizes:</h4>
          <ul className="space-y-1">
            <ListItem>11-50 employees</ListItem>
            <ListItem>51-200 employees</ListItem>
          </ul>

          <h4 className="font-semibold text-slate-900 mt-4 mb-2">Annual revenue:</h4>
          <p className="text-sm text-slate-600">Not specified (agencies typically €2M-€10M)</p>

          <h4 className="font-semibold text-slate-900 mt-4 mb-2">Industries to include:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              'IT Services and IT Consulting',
              'Software Development',
              'Technology, Information and Internet',
              'Advertising Services',
              'Design Services',
            ].map((industry) => (
              <div key={industry} className="bg-green-100 px-3 py-2 rounded text-sm border border-green-200">
                {industry}
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-slate-900 mt-4 mb-2">Industries to EXCLUDE:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              'Computer Networking Products',
              'IT System Data Services',
              'Computer & Network Security',
              'IT System Training and Support',
              'Telecommunications',
              'Cloud Computing',
              'Data Infrastructure and Analytics',
              'Computer Hardware Manufacturing',
            ].map((industry) => (
              <div key={industry} className="bg-red-100 px-3 py-2 rounded text-sm border border-red-200">
                {industry}
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-slate-900 mt-4 mb-2">Description keywords to include:</h4>
          <CodeBlock code={`agency, consultancy, digital agency, ecommerce, e-commerce, Magento, Salesforce, SFCC, commerce cloud`} />

          <h4 className="font-semibold text-slate-900 mt-4 mb-2">Description keywords to EXCLUDE:</h4>
          <div className="bg-slate-100 p-3 rounded border border-slate-300 text-sm text-slate-700">
            Leave this field <strong>EMPTY</strong> in Clay - the industry exclusions are sufficient
          </div>

          <p className="text-xs text-green-600 mt-2 bg-green-50 p-2 rounded border border-green-200">
            ⚠️ Format: Clay uses comma-separated keywords. Copy and paste exactly as shown above.
          </p>
        </div>
      </ContentSection>
    </>
  );
}

function PromptsTab() {
  const icpPrompt = `Determine whether this company matches the ICP for BeeIt Track B (Agency Partners).

A match should be:
- digital agency or consultancy
- does eCommerce development
- mentions Magento, Salesforce Commerce Cloud (SFCC), or Adobe Commerce
- shows case studies or client work
- website looks professional

Not a match if:
- pure design agency (no development)
- pure marketing agency (no tech builds)
- only does basic websites (WordPress, Wix, Squarespace)
- freelancer or very small team
- website is old or broken
- pure Shopify agency (basic Shopify only)

Only use information visible on the domain.

OUTPUT:
- Answer: Yes / No / Unsure
- Reasoning: 2-3 sentence explanation
- Confidence: High / Medium / Low`;

  return (
    <>
      <ContentSection title="ICP Matching Prompt (Anthropic)" icon={<Code className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            This prompt is used in Clay to analyze agency websites and determine if they match BeeIt's ICP for Track B.
          </p>
          <CodeBlock code={icpPrompt} language="text" />
        </div>
      </ContentSection>

      <ContentSection title="Matching Criteria Summary" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-3">
          <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
            <p className="font-medium text-green-900">✓ GOOD MATCH</p>
            <p className="text-green-800 text-sm mt-1">
              Digital agency building eCommerce solutions on Magento or SFCC with professional portfolio and case studies.
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
            <p className="font-medium text-red-900">✗ NOT A MATCH</p>
            <p className="text-red-800 text-sm mt-1">
              Pure design/marketing agency, basic website builders (WordPress only), freelancers, or agencies with broken/old websites.
            </p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

interface TrackingData {
  targeted: boolean;
  lastTargeted: string;
  leadsFound: number;
  notes: string;
}

function TrackingTab() {
  const [selectedTier, setSelectedTier] = useState<'tier1' | 'tier2'>('tier1');
  const [trackingData, setTrackingData] = useState<Record<string, TrackingData>>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);

  // Load tracking data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('beeit-tracking-data');
    if (saved) {
      setTrackingData(JSON.parse(saved));
    }
  }, []);

  // Save tracking data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('beeit-tracking-data', JSON.stringify(trackingData));
  }, [trackingData]);

  // Tier 1 revenue ranges
  const tier1Revenues = {
    '51-200 employees': ['$10M - $25M', '$25M - $75M'],
    '201-500 employees': ['$25M - $75M', '$75M - $100M'],
    '501-1000 employees': ['$75M - $100M', '$100M - $500M']
  };

  // Tier 1 combinations (72 total)
  const tier1Countries = ['Netherlands', 'Belgium', 'Luxembourg', 'Germany', 'Austria', 'Switzerland', 'United Kingdom', 'United States'];
  const tier1Sizes = ['51-200 employees', '201-500 employees', '501-1000 employees'];
  const tier1Industries = ['IT Services and IT Consulting', 'Software Development', 'Technology, Information and Internet'];

  // Tier 2 combinations (80 total)
  const tier2Countries = ['Netherlands', 'Belgium', 'Luxembourg', 'Germany', 'Austria', 'Switzerland', 'United Kingdom', 'United States'];
  const tier2Sizes = ['11-50 employees', '51-200 employees'];
  const tier2Industries = ['IT Services and IT Consulting', 'Software Development', 'Technology, Information and Internet', 'Advertising Services', 'Design Services'];

  const getPriority = (size: string, tier: 'tier1' | 'tier2') => {
    if (tier === 'tier1') {
      if (size === '51-200 employees') return 'High';
      if (size === '201-500 employees') return 'Medium';
      return 'Low';
    } else {
      if (size === '11-50 employees') return 'High';
      return 'Medium';
    }
  };

  const getRevenue = (size: string): string => {
    return tier1Revenues[size as keyof typeof tier1Revenues]?.join(', ') || 'Not specified';
  };

  const tier1Combinations = tier1Countries.flatMap(country =>
    tier1Sizes.flatMap(size =>
      tier1Industries.map(industry => ({
        country,
        size,
        revenue: getRevenue(size),
        industry,
        priority: getPriority(size, 'tier1'),
        key: `tier1-${country}-${size}-${industry}`,
        tier: 'tier1' as const
      }))
    )
  );

  const tier2Combinations = tier2Countries.flatMap(country =>
    tier2Sizes.flatMap(size =>
      tier2Industries.map(industry => ({
        country,
        size,
        revenue: 'Not specified',
        industry,
        priority: getPriority(size, 'tier2'),
        key: `tier2-${country}-${size}-${industry}`,
        tier: 'tier2' as const
      }))
    )
  );

  const combinations = selectedTier === 'tier1' ? tier1Combinations : tier2Combinations;

  // Group by priority
  const groupedByPriority = combinations.reduce((acc, combo) => {
    if (!acc[combo.priority]) acc[combo.priority] = [];
    acc[combo.priority].push(combo);
    return acc;
  }, {} as Record<string, typeof combinations>);

  const toggleTargeted = (key: string) => {
    setTrackingData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        targeted: !prev[key]?.targeted,
        lastTargeted: !prev[key]?.targeted ? new Date().toISOString().split('T')[0] : prev[key]?.lastTargeted || '',
        leadsFound: prev[key]?.leadsFound || 0,
        notes: prev[key]?.notes || ''
      }
    }));
  };

  const updateDate = (key: string, date: string) => {
    setTrackingData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        targeted: prev[key]?.targeted || false,
        lastTargeted: date,
        leadsFound: prev[key]?.leadsFound || 0,
        notes: prev[key]?.notes || ''
      }
    }));
  };

  const updateLeads = (key: string, leads: number) => {
    setTrackingData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        targeted: prev[key]?.targeted || false,
        lastTargeted: prev[key]?.lastTargeted || '',
        leadsFound: leads,
        notes: prev[key]?.notes || ''
      }
    }));
  };

  const getStats = () => {
    const total = combinations.length;
    const targeted = combinations.filter(c => trackingData[c.key]?.targeted).length;
    const totalLeads = combinations.reduce((sum, c) => sum + (trackingData[c.key]?.leadsFound || 0), 0);
    return { total, targeted, remaining: total - targeted, totalLeads };
  };

  const stats = getStats();

  return (
    <>
      <ContentSection title="Search Combinations Tracker" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded">
            <p className="font-medium text-amber-900 mb-2">✓ Interactive Tracking</p>
            <p className="text-amber-800 text-sm">
              Check off combinations as you target them, add dates, and track lead counts. All data is saved automatically in your browser.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-50 border border-blue-200 p-3 rounded">
              <div className="text-xs text-blue-600 font-medium">Total Combinations</div>
              <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            </div>
            <div className="bg-green-50 border border-green-200 p-3 rounded">
              <div className="text-xs text-green-600 font-medium">Targeted</div>
              <div className="text-2xl font-bold text-green-900">{stats.targeted}</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded">
              <div className="text-xs text-slate-600 font-medium">Remaining</div>
              <div className="text-2xl font-bold text-slate-900">{stats.remaining}</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 p-3 rounded">
              <div className="text-xs text-purple-600 font-medium">Total Leads</div>
              <div className="text-2xl font-bold text-purple-900">{stats.totalLeads}</div>
            </div>
          </div>

          {/* Tier Selector */}
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedTier('tier1')}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                selectedTier === 'tier1'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Tier 1 - Strategic ({tier1Combinations.length} combinations)
            </button>
            <button
              onClick={() => setSelectedTier('tier2')}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                selectedTier === 'tier2'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Tier 2 - Growth ({tier2Combinations.length} combinations)
            </button>
          </div>

          {/* Combinations List */}
          <div className="space-y-6">
            {(['High', 'Medium', 'Low'] as const).map(priority => {
              const combos = groupedByPriority[priority] || [];
              if (combos.length === 0) return null;

              const priorityTargeted = combos.filter(c => trackingData[c.key]?.targeted).length;

              return (
                <div key={priority} className="space-y-2">
                  <h3 className={`font-semibold text-lg flex items-center space-x-2 ${
                    priority === 'High' ? 'text-green-700' :
                    priority === 'Medium' ? 'text-amber-700' :
                    'text-slate-600'
                  }`}>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      priority === 'High' ? 'bg-green-100' :
                      priority === 'Medium' ? 'bg-amber-100' :
                      'bg-slate-100'
                    }`}>
                      {priority} Priority
                    </span>
                    <span className="text-sm font-normal text-slate-600">
                      ({priorityTargeted}/{combos.length} targeted)
                    </span>
                  </h3>

                  <div className="grid grid-cols-1 gap-2">
                    {combos.map((combo) => {
                      const data = trackingData[combo.key] || { targeted: false, lastTargeted: '', leadsFound: 0, notes: '' };
                      const isEditing = editingKey === combo.key;

                      return (
                        <div
                          key={combo.key}
                          className={`bg-white border rounded p-3 transition-all ${
                            data.targeted
                              ? 'border-green-300 bg-green-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              checked={data.targeted}
                              onChange={() => toggleTargeted(combo.key)}
                              className="mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                            />

                            {/* Content */}
                            <div className="flex-1 space-y-2">
                              {/* Filter Details */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="font-semibold text-slate-700">Country:</span>
                                  <span className="ml-2 text-slate-900">{combo.country}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-700">Company Size:</span>
                                  <span className="ml-2 text-slate-900">{combo.size}</span>
                                </div>
                                {selectedTier === 'tier1' && (
                                  <div className="md:col-span-2">
                                    <span className="font-semibold text-slate-700">Annual Revenue:</span>
                                    <span className="ml-2 text-slate-900">{combo.revenue}</span>
                                  </div>
                                )}
                                <div className="md:col-span-2">
                                  <span className="font-semibold text-slate-700">Industry:</span>
                                  <span className="ml-2 text-slate-900">{combo.industry}</span>
                                </div>
                              </div>

                              {/* Tracking Fields */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-xs font-medium text-slate-600 mb-1">
                                    Last Targeted Date
                                  </label>
                                  <input
                                    type="date"
                                    value={data.lastTargeted}
                                    onChange={(e) => updateDate(combo.key, e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-slate-600 mb-1">
                                    Leads Found
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={data.leadsFound}
                                    onChange={(e) => updateLeads(combo.key, parseInt(e.target.value) || 0)}
                                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Priority Badge */}
                            <div className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${
                              priority === 'High' ? 'bg-green-100 text-green-700' :
                              priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {priority}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CSV Download Info */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-6">
            <p className="font-semibold text-blue-900 mb-2">📥 CSV Backup Available</p>
            <p className="text-blue-800 text-sm mb-2">
              CSV files are available in GitHub for offline tracking backup:
            </p>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• <code className="bg-blue-100 px-1 rounded">Clients/bit/beeit-tier1-search-combinations.csv</code></li>
              <li>• <code className="bg-blue-100 px-1 rounded">Clients/bit/beeit-tier2-search-combinations.csv</code></li>
            </ul>
          </div>
        </div>
      </ContentSection>
    </>
  );
}
