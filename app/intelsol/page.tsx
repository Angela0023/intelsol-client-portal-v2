'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
import { ContentSection, CodeBlock, InfoCard, ListItem } from '../components/ContentSection';
import TasksTab, { INTELSOL_DEFAULT_TASKS } from '../components/TasksTab';
import SequencesTab from '../components/SequencesTab';
import CampaignsTabDynamic from '../components/CampaignsTabDynamic';
import PerformanceTabDynamic from '../components/PerformanceTabDynamic';
import CampaignsTabGeneric from '../components/CampaignsTabGeneric';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import StatusBadge, { getClientStatus, setClientStatus, DEFAULT_STATUSES, type ClientStatus } from '../components/StatusBadge';
import { FileText, BarChart3, CheckSquare, TrendingUp, Target, Filter, Code, Users, BookOpen, Mail, Zap, FolderOpen } from 'lucide-react';

const tabs = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'icp', label: 'ICP Profile', icon: Target },
  { id: 'filters', label: 'Clay Filters', icon: Filter },
  { id: 'prompts', label: 'AI Prompts', icon: Code },
  { id: 'personas', label: 'Buyer Personas', icon: Users },
  { id: 'sequences', label: 'Email Sequences', icon: Mail },
  { id: 'campaigns', label: 'Campaigns', icon: Zap },
  { id: 'documents', label: 'Documents', icon: FolderOpen },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
];

export default function IntelsolPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('intelsol', DEFAULT_STATUSES.intelsol));

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
    setClientStatus('intelsol', newStatus);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const newPath = tabId === 'overview' ? '/intelsol' : `/intelsol/${tabId}`;
    window.history.pushState({}, '', newPath);
  };

  // Filter tabs based on admin access
  // Hide internal tabs (filters, prompts) from non-admin users
  const visibleTabs = isAdmin
    ? tabs
    : tabs.filter(tab => !['filters', 'prompts'].includes(tab.id));

  return (
    <ClientLayout>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-violet-600">I</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-slate-900">Intelsol</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
              </div>
              <p className="text-slate-600">B2B Lead Generation Agency — Cold Email Campaigns for Intelsol Services</p>
            </div>
          </div>
          <a
            href="https://www.intelsol.co"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-violet-600 hover:underline"
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
          {activeTab === 'icp' && <ICPTab />}
          {activeTab === 'filters' && <FiltersTab />}
          {activeTab === 'prompts' && <PromptsTab />}
          {activeTab === 'personas' && <PersonasTab />}
          {activeTab === 'sequences' && <SequencesTab clientId="intelsol" />}
          {activeTab === 'campaigns' && <CampaignsTabGeneric />}
          {activeTab === 'documents' && <DocumentsTab />}
          {activeTab === 'performance' && (
            <>
              <PerformanceTabDynamic clientId="intelsol" />
              <CampaignsTabDynamic clientId="intelsol" />
            </>
          )}
          {activeTab === 'tasks' && (
            <TasksTab clientId="intelsol" defaultTasks={INTELSOL_DEFAULT_TASKS} />
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
            Intelsol is a B2B lead generation agency based in Slovenia. We help companies build
            outbound sales pipelines through targeted cold email campaigns, Clay-based lead enrichment,
            and AI-powered ICP qualification.
          </p>
          <p>
            This dashboard tracks Intelsol's own lead generation campaigns — we run the same
            methodology for ourselves that we deliver to clients.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 [&>*]:min-w-0">
            <InfoCard label="Industry" value="B2B Lead Generation Services" />
            <InfoCard label="Business Model" value="Agency (Service-Based)" />
            <InfoCard label="Location" value="Ljubljana, Slovenia" />
            <InfoCard label="Channel" value="Cold Email via SmartLead" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Core Services" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900">What Intelsol Sells:</h4>
          <ul className="space-y-2">
            <ListItem type="check">B2B lead generation and prospecting</ListItem>
            <ListItem type="check">Cold email campaign management (SmartLead)</ListItem>
            <ListItem type="check">ICP development and Clay enrichment pipelines</ListItem>
            <ListItem type="check">AI-powered lead qualification (Anthropic via Clay)</ListItem>
            <ListItem type="check">Apollo email enrichment and verification</ListItem>
            <ListItem type="check">Campaign monitoring and reply management</ListItem>
          </ul>
        </div>
      </ContentSection>

      <ContentSection title="Campaign Strategy" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <span className="w-8 h-8 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
            <div>
              <h4 className="font-semibold text-slate-900">Build Lead Lists</h4>
              <p className="text-sm text-slate-600">Use Clay to identify and enrich companies matching our ICP across EU, UK, and USA markets.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="w-8 h-8 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
            <div>
              <h4 className="font-semibold text-slate-900">Qualify with AI</h4>
              <p className="text-sm text-slate-600">Run Anthropic-powered ICP matching to score and filter leads before adding to sequences.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="w-8 h-8 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
            <div>
              <h4 className="font-semibold text-slate-900">Launch Sequences</h4>
              <p className="text-sm text-slate-600">Deploy multi-step email sequences via SmartLead with personalized messaging.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="w-8 h-8 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
            <div>
              <h4 className="font-semibold text-slate-900">Optimize and Scale</h4>
              <p className="text-sm text-slate-600">Track performance weekly, A/B test messaging, and scale winning campaigns.</p>
            </div>
          </div>
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
          <div className="bg-violet-50 border-l-4 border-violet-500 p-4 rounded">
            <p className="font-semibold text-violet-900 mb-2">Primary Target</p>
            <p className="text-violet-800">
              B2B companies (2-200 employees) that rely on outbound sales but don't have an in-house
              SDR team or are looking to scale their pipeline without hiring.
            </p>
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Must-Have Characteristics:</h4>
          <ul className="space-y-2">
            <ListItem type="check">B2B company selling to other businesses</ListItem>
            <ListItem type="check">2-200 employees (sweet spots: 2-10, 10-50)</ListItem>
            <ListItem type="check">Sells services, SaaS, OR physical/industrial B2B products</ListItem>
            <ListItem type="check">High-ticket offers ($20K+ per deal)</ListItem>
            <ListItem type="check">Active sales process (not just distributors)</ListItem>
            <ListItem type="check">Has a website with clear value proposition</ListItem>
            <ListItem type="check">EU markets (Belgium, Netherlands, Germany, Austria, Switzerland, France, UK, Nordics)</ListItem>
          </ul>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Target Verticals:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              'SaaS Companies',
              'IT Consulting',
              'Management Consulting',
              'Industrial Automation',
              'Manufacturing Equipment',
              'Medical Equipment (B2B)',
              'Software Development',
              'Cybersecurity',
              'Data & Analytics',
              'Professional Services',
              'Business Consulting',
              'Industrial Machinery',
            ].map((vertical) => (
              <div key={vertical} className="bg-slate-100 px-3 py-2 rounded text-sm">
                {vertical}
              </div>
            ))}
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Red Flags (Disqualifiers)" icon={<Target className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="cross">B2C companies (selling to consumers)</ListItem>
          <ListItem type="cross">eCommerce selling low-ticket consumer goods</ListItem>
          <ListItem type="cross">Companies under 2 employees or over 200 employees</ListItem>
          <ListItem type="cross">Recruitment/staffing agencies</ListItem>
          <ListItem type="cross">Companies selling only through distributors (no direct sales)</ListItem>
          <ListItem type="cross">Commodity/low-margin businesses</ListItem>
          <ListItem type="cross">Non-EU website with no European market presence</ListItem>
          <ListItem type="cross">Outdated or broken website</ListItem>
          <ListItem type="cross">Already has large in-house SDR/sales team</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Target Geography" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 mb-3">Primary Markets:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              'Belgium',
              'Netherlands',
              'Germany',
              'Austria',
              'Switzerland',
              'France',
            ].map((country) => (
              <div key={country} className="bg-violet-100 px-3 py-2 rounded text-sm font-medium">
                {country}
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-slate-900 mt-4 mb-3">Secondary Markets:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              'United Kingdom',
              'Sweden',
              'Norway',
              'Denmark',
              'Finland',
              'Other EU',
            ].map((country) => (
              <div key={country} className="bg-slate-100 px-3 py-2 rounded text-sm">
                {country}
              </div>
            ))}
          </div>
        </div>
      </ContentSection>

      {/* NEW: Updated Target Profile - July 2026 */}
      <ContentSection title="Updated Target Profile - July 2026" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="font-semibold text-green-900 mb-2">Updated Targeting Strategy</p>
            <p className="text-green-800 text-sm">
              This updated ICP shifts focus from IT/software-heavy approach to prioritize manufacturing companies (40% of volume)
              while tightening company size requirements. Based on successful client analysis and July 23 + July 28, 2026 calls.
            </p>
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Key Changes from Original ICP:</h4>
          <ul className="space-y-2">
            <ListItem type="check">40% focus on manufacturing companies (like TS Lab - best client)</ListItem>
            <ListItem type="check">Added cosmetics/personal care and beverage manufacturing</ListItem>
            <ListItem type="check">Added tier 1 & tier 2 suppliers (automotive, industrial components)</ListItem>
            <ListItem type="check">Added staffing/recruiting as target industry</ListItem>
            <ListItem type="check">Added AI companies (5% - hungry for leads but challenging to deliver)</ListItem>
            <ListItem type="cross">Removed marketing agencies from targeting (meta ads, Google ads, SEO, WordPress)</ListItem>
            <ListItem type="check">Keep wholesale consumer goods (B2B wholesale is good, B2C retail is excluded)</ListItem>
            <ListItem type="check">Tightened employee range: 10-100 (max 150 for manufacturing only)</ListItem>
            <ListItem type="check">Target companies doing sales manually ("not advanced in IT")</ListItem>
            <ListItem type="check">60% US market, 40% European markets</ListItem>
          </ul>
        </div>
      </ContentSection>

      <ContentSection title="Company Size & Revenue" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 mb-3">Employee Count:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-green-50 border border-green-200 p-3 rounded">
              <p className="text-xs text-green-600 font-semibold mb-1">PRIMARY (50%)</p>
              <p className="text-lg font-bold text-green-900">10-50 employees</p>
            </div>
            <div className="bg-green-50 border border-green-200 p-3 rounded">
              <p className="text-xs text-green-600 font-semibold mb-1">PRIMARY (40%)</p>
              <p className="text-lg font-bold text-green-900">51-100 employees</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-3 rounded">
              <p className="text-xs text-blue-600 font-semibold mb-1">SECONDARY (10%)</p>
              <p className="text-lg font-bold text-blue-900">101-150 (Mfg only)</p>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded mt-4">
            <p className="font-semibold text-red-900 mb-1">DO NOT Target:</p>
            <p className="text-red-800 text-sm">Under 10 employees (too small, no budget) or Over 150 employees (likely has SDR/BDR team already)</p>
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Revenue Range:</h4>
          <ul className="space-y-2">
            <ListItem type="check">Primary: $10M - $50M</ListItem>
            <ListItem type="check">Secondary: $5M - $10M (growing companies)</ListItem>
            <ListItem type="check">For Manufacturing 100+ employees: $50M - $100M</ListItem>
          </ul>
        </div>
      </ContentSection>

      <ContentSection title="Geographic Focus (Updated)" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-blue-50 border border-blue-200 p-3 rounded">
              <p className="text-xs text-blue-600 font-semibold mb-1">TIER 1 (60%)</p>
              <p className="text-sm font-medium text-blue-900">United States</p>
              <p className="text-xs text-blue-700 mt-1">All states</p>
            </div>
            <div className="bg-violet-50 border border-violet-200 p-3 rounded">
              <p className="text-xs text-violet-600 font-semibold mb-1">TIER 2 (30%)</p>
              <p className="text-sm font-medium text-violet-900">UK, DE, NL, BE, AT, CH</p>
              <p className="text-xs text-violet-700 mt-1">Core European markets</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded">
              <p className="text-xs text-slate-600 font-semibold mb-1">TIER 3 (10%)</p>
              <p className="text-sm font-medium text-slate-900">Nordics & France</p>
              <p className="text-xs text-slate-700 mt-1">SE, DK, NO, FI, FR</p>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Industry Breakdown & Volume Distribution" icon={<BarChart3 className="w-5 h-5" />}>
        <div className="space-y-6">
          {/* Manufacturing - 40% */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900">1. Manufacturing Companies</h4>
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">40% Focus (800 leads)</span>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded mb-3">
              <p className="text-green-900 text-sm font-medium">
                Why This Works: TS Lab (our best client) is a manufacturing company - 65 employees, B2B, doing sales manually.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                'Industrial Automation',
                'Machinery Manufacturing',
                'Medical Equipment Mfg',
                'Pharmaceutical Mfg',
                'Food & Beverage Mfg',
                'Beverage Manufacturing',
                'Packaging & Containers',
                'Consumer Goods Mfg (B2B)',
                'Cosmetics Manufacturing',
                'Personal Care Products',
                'Chemical Manufacturing',
                'Plastics Manufacturing',
                'Tier 1 & 2 Suppliers',
                'Automotive Parts Suppliers',
                'Renewable Energy Equipment',
              ].map((industry) => (
                <div key={industry} className="bg-green-100 px-2 py-1 rounded text-xs border border-green-200">
                  {industry}
                </div>
              ))}
            </div>
            <div className="mt-3 bg-slate-50 p-3 rounded border border-slate-200">
              <p className="text-xs font-semibold text-slate-900 mb-2">Positive Signals (Company Keywords):</p>
              <div className="flex flex-wrap gap-1">
                {['B2B manufacturer', 'contract manufacturing', 'private label', 'white label', 'OEM', 'tier 1/2 supplier', 'custom manufacturing'].map(kw => (
                  <span key={kw} className="bg-white px-2 py-0.5 rounded text-xs border border-slate-200">{kw}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Specialized B2B Services - 30% */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900">2. Specialized B2B Services</h4>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">30% Focus (600 leads)</span>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-3">
              <p className="text-blue-900 text-sm font-medium">
                Why This Works: Xpose, BeeIT, WULF are all specialized (NOT generic) service companies.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                'Healthcare B2B Services',
                'Medical Device',
                'Advertising Services',
                'Design Services',
                'PR & Communications',
                'Events Services',
                'Graphic Design',
                'Computer Games',
                'Animation',
                'Niche Software Dev',
                'Specialized Consulting',
                'Logistics & Supply Chain',
                'Staffing & Recruiting',
                'IT Staffing',
              ].map((industry) => (
                <div key={industry} className="bg-blue-100 px-2 py-1 rounded text-xs border border-blue-200">
                  {industry}
                </div>
              ))}
            </div>
            <div className="mt-3 bg-red-50 p-3 rounded border border-red-200">
              <p className="text-xs font-semibold text-red-900 mb-2">AVOID:</p>
              <p className="text-xs text-red-800">Generic IT consulting, Marketing agencies (meta ads, Google ads, SEO), Website design agencies (WordPress), Managed services (MSP)</p>
            </div>
          </div>

          {/* Distribution & Wholesale - 15% */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900">3. Distribution & Wholesale</h4>
              <span className="bg-violet-600 text-white px-3 py-1 rounded-full text-xs font-bold">15% Focus (300 leads)</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                'Wholesale Building Materials',
                'Wholesale Machinery',
                'Wholesale Food & Beverage',
                'Wholesale Import/Export',
                'Wholesale Chemicals',
                'Wholesale Metals',
                'Wholesale Electronics',
                'B2B Consumer Goods Wholesale',
              ].map((industry) => (
                <div key={industry} className="bg-violet-100 px-2 py-1 rounded text-xs border border-violet-200">
                  {industry}
                </div>
              ))}
            </div>
          </div>

          {/* Niche SaaS/Technology - 10% */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900">4. Niche SaaS/Technology</h4>
              <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold">10% Focus (200 leads)</span>
            </div>
            <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded mb-3">
              <p className="text-orange-900 text-sm font-medium">
                IMPORTANT: Use sparingly - moving away from tech focus. Must be vertical/niche SaaS only.
              </p>
            </div>
            <ul className="space-y-1">
              <ListItem>Vertical SaaS (industry-specific)</ListItem>
              <ListItem>Niche B2B software</ListItem>
              <ListItem>Compliance/regulatory software</ListItem>
              <ListItem type="cross">Generic IT consulting, HR tech, Marketing automation, CRM platforms</ListItem>
            </ul>
          </div>

          {/* AI Companies - 5% */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900">5. AI Companies</h4>
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">5% Focus (100 leads)</span>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded mb-3">
              <p className="text-purple-900 text-sm font-medium">
                New companies developing/selling AI products - hungry for leads but challenging to deliver. Use sparingly.
              </p>
            </div>
            <ul className="space-y-1">
              <ListItem>AI Product Development companies</ListItem>
              <ListItem>Industry-specific AI solutions</ListItem>
              <ListItem>Founded 2022-2026 (recently launched)</ListItem>
              <ListItem>Struggling with customer acquisition</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Core Requirements & Deal Breakers" icon={<CheckSquare className="w-5 h-5" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 [&>*]:min-w-0">
          <div>
            <h4 className="font-semibold text-green-900 mb-3">✅ Core Requirements (All Companies Must Have)</h4>
            <ul className="space-y-2">
              <ListItem type="check">B2B Business Model - Sells to other businesses, NOT consumers</ListItem>
              <ListItem type="check">Active Sales Process - Need to prospect and acquire new clients</ListItem>
              <ListItem type="check">Broad Target Market - Many potential clients to reach</ListItem>
              <ListItem type="check">Growth-Focused - Open to systemizing their outbound</ListItem>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-red-900 mb-3">❌ Deal Breakers (Automatically Exclude)</h4>
            <ul className="space-y-2">
              <ListItem type="cross">B2C companies - Sells to consumers</ListItem>
              <ListItem type="cross">Marketing agencies - Meta ads, Google ads, SEO, WordPress</ListItem>
              <ListItem type="cross">Companies with SDR/BDR teams - Already has sales infrastructure</ListItem>
              <ListItem type="cross">Generic IT consulting - Too saturated</ListItem>
              <ListItem type="cross">Managed services (MSP) - Not a good fit</ListItem>
              <ListItem type="cross">Under 10 or over 150 employees - Too small or too large</ListItem>
              <ListItem type="cross">Broken or very outdated websites - 5+ years old design</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="ICP Match Signals" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 [&>*]:min-w-0">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="font-semibold text-green-900 mb-3">Strong Positive Signals (High Value)</p>
            <ul className="space-y-1 text-sm">
              <ListItem type="check">Manufacturing company selling B2B</ListItem>
              <ListItem type="check">Founder or CEO still involved in sales</ListItem>
              <ListItem type="check">Growing company (mentions scaling, expansion, hiring)</ListItem>
              <ListItem type="check">Mentions "manual processes" on website</ListItem>
              <ListItem type="check">No mention of "SDR team" or "BDR team"</ListItem>
              <ListItem type="check">Serves niche market within large industry</ListItem>
              <ListItem type="check">Private label, contract manufacturing, OEM model</ListItem>
              <ListItem type="check">"Custom" or "tailored" solutions (consultative sales)</ListItem>
            </ul>
          </div>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="font-semibold text-red-900 mb-3">Strong Negative Signals (Exclude)</p>
            <ul className="space-y-1 text-sm">
              <ListItem type="cross">Website mentions "SDR team", "BDR team", "sales development"</ListItem>
              <ListItem type="cross">Large corporate structure (200+ employees)</ListItem>
              <ListItem type="cross">B2C eCommerce for consumers</ListItem>
              <ListItem type="cross">Sells only through distributors (no direct sales)</ListItem>
              <ListItem type="cross">Generic positioning (not specialized)</ListItem>
              <ListItem type="cross">Very outdated or broken website</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Buyer Personas by Company Size (Updated)" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-violet-50 border border-violet-200 p-3 rounded">
            <h5 className="font-semibold text-violet-900 mb-2">Small Companies (10-50 employees)</h5>
            <div className="flex flex-wrap gap-2">
              {['CEO', 'Founder', 'Co-Founder', 'Owner', 'Managing Director', 'General Manager'].map(title => (
                <span key={title} className="bg-white px-2 py-1 rounded text-xs border border-violet-200">{title}</span>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-3 rounded">
            <h5 className="font-semibold text-blue-900 mb-2">Medium Companies (51-100 employees)</h5>
            <div className="flex flex-wrap gap-2">
              {['VP of Sales', 'Director of Business Development', 'Head of Sales', 'CEO (if founder-led)'].map(title => (
                <span key={title} className="bg-white px-2 py-1 rounded text-xs border border-blue-200">{title}</span>
              ))}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 p-3 rounded">
            <h5 className="font-semibold text-green-900 mb-2">Larger Companies (101-150 employees - Manufacturing Only)</h5>
            <div className="flex flex-wrap gap-2">
              {['VP of Sales', 'Director of Business Development', 'Sales Director', 'Head of Business Development'].map(title => (
                <span key={title} className="bg-white px-2 py-1 rounded text-xs border border-green-200">{title}</span>
              ))}
            </div>
            <p className="text-xs text-green-800 mt-2">DO NOT target CEOs at 100+ employee companies (too busy) or junior roles (no decision authority)</p>
          </div>
        </div>
      </ContentSection>

      {/* Clay Filters for Updated ICP */}
      <ContentSection title="Clay Search Criteria (Updated ICP)" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 [&>*]:min-w-0">
            <InfoCard label="Primary Location" value="United States (60%), UK/DE/NL/BE/AT/CH (30%), Nordics/France (10%)" color="bg-violet-600 text-white" />
            <InfoCard label="Business Type" value="Manufacturing (40%), B2B Services (30%), Distribution (15%), Tech/AI (15%)" color="bg-violet-600 text-white" />
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Company Size:</h4>
          <ul className="space-y-2">
            <ListItem>10-50 employees (primary - 50% of searches)</ListItem>
            <ListItem>51-100 employees (primary - 40% of searches)</ListItem>
            <ListItem>101-150 employees (secondary - 10%, manufacturing only)</ListItem>
          </ul>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Industry Filters:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 [&>*]:min-w-0">
            {[
              'Industrial Machinery Manufacturing',
              'Automation Machinery Manufacturing',
              'Medical Equipment Manufacturing',
              'Food and Beverage Manufacturing',
              'Consumer Goods Manufacturing',
              'Cosmetics Manufacturing',
              'Personal Care Product Manufacturing',
              'Chemical Manufacturing',
              'Plastics Manufacturing',
              'Tier 1 & Tier 2 Automotive Suppliers',
              'Advertising Services (specialized)',
              'Design Services',
              'Healthcare B2B Services',
              'Staffing and Recruiting',
              'Logistics and Supply Chain',
              'Wholesale Building Materials',
              'Wholesale Machinery',
              'Wholesale Food and Beverage',
              'Wholesale Consumer Goods',
              'Vertical SaaS',
              'AI Product Development',
              'Artificial Intelligence and Machine Learning',
            ].map((industry) => (
              <div key={industry} className="bg-slate-100 px-3 py-2 rounded text-sm border border-slate-200">
                {industry}
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Keywords (Manufacturing Focus):</h4>
          <CodeBlock code={`("B2B manufacturer" OR "contract manufacturing" OR "private label" OR "white label" OR "OEM" OR "tier 1 supplier" OR "tier 2 supplier") AND (B2B OR "business to business" OR industrial)`} />

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Revenue Filter:</h4>
          <ul className="space-y-2">
            <ListItem>$10M - $50M (primary target)</ListItem>
            <ListItem>$5M - $10M (growing companies)</ListItem>
            <ListItem>$50M - $100M (manufacturing 100+ employees only)</ListItem>
          </ul>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Additional Filters:</h4>
          <ul className="space-y-2">
            <ListItem type="check">Has active website</ListItem>
            <ListItem type="check">B2B filter enabled</ListItem>
            <ListItem type="check">LinkedIn company page active</ListItem>
            <ListItem type="cross">Exclude: Companies with "SDR team" or "BDR team" in description</ListItem>
            <ListItem type="cross">Exclude: Marketing agencies (meta ads, Google ads, SEO, WordPress)</ListItem>
          </ul>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mt-4">
            <p className="font-semibold text-green-900 mb-2">Manufacturing Companies (High-Priority - 40%):</p>
            <p className="text-green-800 text-sm">
              Companies doing contract manufacturing, private/white label, OEM, or tier 1/2 supplier work.
              Look for mentions of "B2B manufacturer", "custom manufacturing", or specific industry manufacturing
              (food/beverage, cosmetics, industrial equipment, medical devices, consumer goods sold to retailers).
            </p>
          </div>
        </div>
      </ContentSection>

      {/* Sales Navigator Search Templates */}
      <ContentSection title="Sales Navigator Search Templates" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">12 Ready-to-Use Search Templates</p>
            <p className="text-blue-800 text-sm">
              Copy these exact filters into LinkedIn Sales Navigator to find high-quality leads matching Intelsol's updated ICP.
              Each template includes geography, headcount, industry, and company keywords.
            </p>
          </div>

          {/* Template 1 */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-bold text-slate-900">Template 1: US Manufacturing 20-50 Employees</h5>
              <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">Manufacturing</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-semibold text-slate-700 mb-1">Geography:</p>
                <p className="text-slate-600">United States</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 mb-1">Headcount:</p>
                <p className="text-slate-600">20-50</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Industry:</p>
                <p className="text-slate-600">Industrial Machinery Manufacturing, Automation Machinery Manufacturing, Medical Equipment Manufacturing, Food and Beverage Manufacturing, Consumer Goods Manufacturing, Cosmetics Manufacturing</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Company Keywords:</p>
                <CodeBlock code={`"B2B manufacturer" OR "contract manufacturing" OR "private label" OR "white label"`} />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-500">Expected Results: 500-1,000 companies</p>
              <p className="text-xs font-semibold text-green-600">Save As: "Intelsol - US Manufacturing 20-50"</p>
            </div>
          </div>

          {/* Template 2 */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-bold text-slate-900">Template 2: US Manufacturing 51-100 Employees</h5>
              <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">Manufacturing</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-semibold text-slate-700 mb-1">Geography:</p>
                <p className="text-slate-600">United States</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 mb-1">Headcount:</p>
                <p className="text-slate-600">51-100</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Industry:</p>
                <p className="text-slate-600">Same as Template 1</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Company Keywords:</p>
                <CodeBlock code={`"B2B manufacturer" OR "contract manufacturing"`} />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-500">Expected Results: 300-600 companies</p>
              <p className="text-xs font-semibold text-green-600">Save As: "Intelsol - US Manufacturing 51-100"</p>
            </div>
          </div>

          {/* Template 3 */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-bold text-slate-900">Template 3: UK/Germany Manufacturing 20-100 Employees</h5>
              <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">Manufacturing</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-semibold text-slate-700 mb-1">Geography:</p>
                <p className="text-slate-600">United Kingdom + Germany</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 mb-1">Headcount:</p>
                <p className="text-slate-600">20-100</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Industry:</p>
                <p className="text-slate-600">Same as Template 1</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Company Keywords:</p>
                <CodeBlock code={`"B2B manufacturer"`} />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-500">Expected Results: 400-800 companies</p>
              <p className="text-xs font-semibold text-green-600">Save As: "Intelsol - UK/DE Manufacturing 20-100"</p>
            </div>
          </div>

          {/* Template 4 */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-bold text-slate-900">Template 4: US Food/Pharma/Consumer Goods 20-100</h5>
              <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">Manufacturing</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-semibold text-slate-700 mb-1">Geography:</p>
                <p className="text-slate-600">United States</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 mb-1">Headcount:</p>
                <p className="text-slate-600">20-100</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Industry:</p>
                <p className="text-slate-600">Food and Beverage Manufacturing, Consumer Goods Manufacturing, Pharmaceutical Manufacturing, Packaging and Containers, Cosmetics Manufacturing</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Company Keywords:</p>
                <CodeBlock code={`"B2B" OR "contract manufacturing" OR "private label" OR "white label"`} />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-500">Expected Results: 400-700 companies</p>
              <p className="text-xs font-semibold text-green-600">Save As: "Intelsol - US Food/Consumer Goods Mfg 20-100"</p>
            </div>
          </div>

          {/* Template 5 */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-bold text-slate-900">Template 5: US Specialized Marketing/Creative 15-50</h5>
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">Services</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-semibold text-slate-700 mb-1">Geography:</p>
                <p className="text-slate-600">United States</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 mb-1">Headcount:</p>
                <p className="text-slate-600">15-50</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Industry:</p>
                <p className="text-slate-600">Advertising Services, Design Services, Marketing Services</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Company Keywords:</p>
                <CodeBlock code={`"specialized" OR "boutique agency" OR "niche"`} />
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Negative Keywords:</p>
                <CodeBlock code={`"staffing" OR "recruiting"`} />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-500">Expected Results: 400-700 companies</p>
              <p className="text-xs font-semibold text-blue-600">Save As: "Intelsol - US Specialized Marketing 15-50"</p>
            </div>
          </div>

          {/* Template 6 */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-bold text-slate-900">Template 6: US Healthcare B2B Services 20-75</h5>
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">Services</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-semibold text-slate-700 mb-1">Geography:</p>
                <p className="text-slate-600">United States</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 mb-1">Headcount:</p>
                <p className="text-slate-600">20-75</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Industry:</p>
                <p className="text-slate-600">Hospital & Health Care, Medical Practice, Medical Device</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Company Keywords:</p>
                <CodeBlock code={`("B2B" OR "business to business") AND ("software" OR "platform" OR "technology" OR "services")`} />
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Negative Keywords:</p>
                <CodeBlock code={`"hospital" OR "clinic" OR "urgent care"`} />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-500">Expected Results: 300-500 companies</p>
              <p className="text-xs font-semibold text-blue-600">Save As: "Intelsol - US Healthcare Services 20-75"</p>
            </div>
          </div>

          {/* Template 7 */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-bold text-slate-900">Template 7: US Logistics/Supply Chain 20-75</h5>
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">Services</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-semibold text-slate-700 mb-1">Geography:</p>
                <p className="text-slate-600">United States</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 mb-1">Headcount:</p>
                <p className="text-slate-600">20-75</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Industry:</p>
                <p className="text-slate-600">Logistics and Supply Chain, Facilities Services</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Company Keywords:</p>
                <CodeBlock code={`"B2B" OR "3PL" OR "supply chain solutions"`} />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-500">Expected Results: 300-600 companies</p>
              <p className="text-xs font-semibold text-blue-600">Save As: "Intelsol - US Logistics Services 20-75"</p>
            </div>
          </div>

          {/* Template 8 */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-bold text-slate-900">Template 8: UK/EU Specialized Services 20-75</h5>
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">Services</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-semibold text-slate-700 mb-1">Geography:</p>
                <p className="text-slate-600">United Kingdom + Germany + Netherlands</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 mb-1">Headcount:</p>
                <p className="text-slate-600">20-75</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Industry:</p>
                <p className="text-slate-600">Advertising Services, Design Services, Events Services, Staffing and Recruiting</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Company Keywords:</p>
                <CodeBlock code={`"specialized" OR "boutique" OR "B2B"`} />
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Negative Keywords:</p>
                <CodeBlock code={`"meta ads" OR "Google ads" OR "SEO" OR "WordPress"`} />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-500">Expected Results: 300-500 companies</p>
              <p className="text-xs font-semibold text-blue-600">Save As: "Intelsol - EU Specialized Services 20-75"</p>
            </div>
          </div>

          {/* Template 9 */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-bold text-slate-900">Template 9: US Industrial Wholesale 20-75</h5>
              <span className="bg-violet-600 text-white px-2 py-1 rounded text-xs font-bold">Distribution</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-semibold text-slate-700 mb-1">Geography:</p>
                <p className="text-slate-600">United States</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 mb-1">Headcount:</p>
                <p className="text-slate-600">20-75</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Industry:</p>
                <p className="text-slate-600">Wholesale Building Materials, Wholesale Machinery, Wholesale Metals and Minerals</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Company Keywords:</p>
                <CodeBlock code={`"B2B distributor" OR "industrial distribution"`} />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-500">Expected Results: 400-800 companies</p>
              <p className="text-xs font-semibold text-violet-600">Save As: "Intelsol - US Industrial Wholesale 20-75"</p>
            </div>
          </div>

          {/* Template 10 */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-bold text-slate-900">Template 10: US Food/Beverage Distribution 30-100</h5>
              <span className="bg-violet-600 text-white px-2 py-1 rounded text-xs font-bold">Distribution</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-semibold text-slate-700 mb-1">Geography:</p>
                <p className="text-slate-600">United States</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 mb-1">Headcount:</p>
                <p className="text-slate-600">30-100</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Industry:</p>
                <p className="text-slate-600">Wholesale Food and Beverage</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Company Keywords:</p>
                <CodeBlock code={`"B2B" OR "food service distribution"`} />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-500">Expected Results: 200-400 companies</p>
              <p className="text-xs font-semibold text-violet-600">Save As: "Intelsol - US Food Distribution 30-100"</p>
            </div>
          </div>

          {/* Template 11 */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-bold text-slate-900">Template 11: US B2B SaaS 10-75</h5>
              <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs font-bold">SaaS</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-semibold text-slate-700 mb-1">Geography:</p>
                <p className="text-slate-600">United States</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 mb-1">Headcount:</p>
                <p className="text-slate-600">10-75</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Industry:</p>
                <p className="text-slate-600">Software Development, IT Services and IT Consulting, Technology Information and Internet, IT System Data Services, Computer and Network Security</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Company Keywords:</p>
                <CodeBlock code={`("SaaS" OR "software platform" OR "B2B software" OR "vertical SaaS") AND ("subscription" OR "B2B") AND -"marketing agency" AND -"SEO" AND -"meta ads" AND -"WordPress"`} />
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Negative Keywords:</p>
                <CodeBlock code={`"HR tech" OR "recruiting software" OR "marketing automation" OR "CRM platform" OR "project management" OR "B2C app" OR "SDR team" OR "BDR team"`} />
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Good Fit Examples:</p>
                <p className="text-xs text-slate-600">✅ IT operations/automation ✅ Supply chain software ✅ Email/communication tools ✅ Corporate wellness ✅ Compliance/regulatory ✅ Industry-specific vertical SaaS</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-500">Expected Results: 200-400 companies</p>
              <p className="text-xs font-semibold text-orange-600">Save As: "Intelsol - US B2B SaaS 10-75"</p>
            </div>
            <div className="mt-2 bg-orange-50 border-l-4 border-orange-500 p-2 rounded">
              <p className="text-xs text-orange-900 font-medium">Based on ideal customers: eBlissAI, Plantryx, AdSigner, Zen2Fit - growing SaaS companies need constant new client flow</p>
            </div>
          </div>

          {/* Template 12 */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-bold text-slate-900">Template 12: US AI Companies 10-75</h5>
              <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">AI</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-semibold text-slate-700 mb-1">Geography:</p>
                <p className="text-slate-600">United States (primary)</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 mb-1">Headcount:</p>
                <p className="text-slate-600">10-75</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Industry:</p>
                <p className="text-slate-600">Artificial Intelligence and Machine Learning, Technology, Information and Media</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Company Keywords:</p>
                <CodeBlock code={`"AI-powered" OR "AI for" OR "machine learning" OR "AI platform"`} />
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Founded:</p>
                <p className="text-slate-600">2022-2026 (use LinkedIn founded date filter)</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold text-slate-700 mb-1">Negative Keywords:</p>
                <CodeBlock code={`"consulting only" OR "Google" OR "Microsoft"`} />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-500">Expected Results: 100-200 companies</p>
              <p className="text-xs font-semibold text-purple-600">Save As: "Intelsol - US AI Companies 10-75"</p>
            </div>
            <div className="mt-2 bg-purple-50 border-l-4 border-purple-500 p-2 rounded">
              <p className="text-xs text-purple-900 font-medium">IMPORTANT: Use sparingly (5% of volume). Challenging to deliver but highly motivated buyers.</p>
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
      <ContentSection title="Clay Search Criteria" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 [&>*]:min-w-0">
            <InfoCard label="Primary Location" value="Belgium, Netherlands, Germany, Austria, Switzerland, France" color="bg-violet-600 text-white" />
            <InfoCard label="Business Type" value="B2B Services, SaaS, & Industrial Products" color="bg-violet-600 text-white" />
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Company Size:</h4>
          <ul className="space-y-2">
            <ListItem>20-50 employees</ListItem>
            <ListItem>51-100 employees (sweet spot)</ListItem>
            <ListItem>101-200 employees</ListItem>
          </ul>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Industry Filters:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 [&>*]:min-w-0">
            {[
              'IT Services and IT Consulting',
              'Software Development',
              'Management Consulting',
              'Business Consulting',
              'Industrial Automation',
              'Automation Machinery Manufacturing',
              'Industrial Machinery Manufacturing',
              'Medical Equipment Manufacturing',
              'Commercial and Service Industry Machinery',
              'Measuring and Control Instrument Manufacturing',
              'Computer and Network Security',
              'Technology, Information and Internet',
            ].map((industry) => (
              <div key={industry} className="bg-slate-100 px-3 py-2 rounded text-sm border border-slate-200">
                {industry}
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Keywords:</h4>
          <CodeBlock code={`(SaaS OR "software company" OR "IT consulting" OR "management consulting" OR "industrial automation" OR "manufacturing equipment" OR "medical equipment" OR "machinery") AND (B2B OR "business to business" OR enterprise OR industrial)`} />

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Revenue Filter:</h4>
          <ul className="space-y-2">
            <ListItem>$10M - $50M (sweet spot)</ListItem>
            <ListItem>$50M - $100M (upper mid-market)</ListItem>
          </ul>
          <p className="text-sm text-slate-600 mt-2">
            High-ticket B2B: Companies selling $20K+ deals typically have $10M+ annual revenue
          </p>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Additional Filters:</h4>
          <ul className="space-y-2">
            <ListItem type="check">Has active website</ListItem>
            <ListItem type="check">B2B filter enabled</ListItem>
            <ListItem type="check">LinkedIn company page active</ListItem>
            <ListItem type="check">Currently hiring for sales/SDR roles (buying signal)</ListItem>
          </ul>

          <div className="bg-violet-50 border-l-4 border-violet-500 p-4 rounded mt-4">
            <p className="font-semibold text-violet-900 mb-2">Buying Signals (High-Priority):</p>
            <p className="text-violet-800">
              Companies hiring for SDR/BDR roles, recently raised funding, or posting about
              scaling sales — these indicate active need for pipeline generation.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Clay Search Criteria (Updated ICP - July 2026)" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 [&>*]:min-w-0">
            <InfoCard label="Geography" value="US (60%), UK/DE/NL/BE/AT/CH (30%), Nordics/France (10%)" color="bg-violet-600 text-white" />
            <InfoCard label="Volume Distribution" value="Manufacturing (40%), Services (30%), Distribution (15%), Tech/AI (15%)" color="bg-violet-600 text-white" />
          </div>

          {/* Manufacturing Companies - 40% */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h4 className="font-bold text-blue-900 mb-3">1. Manufacturing Companies (40% - 800 leads)</h4>
            <p className="text-sm text-blue-800 mb-3">Like TS Lab - B2B manufacturing, manual sales processes</p>

            <div className="space-y-3">
              <div>
                <p className="font-semibold text-blue-900 text-sm mb-2">Company Size:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 [&>*]:min-w-0">
                  <div className="bg-white px-3 py-2 rounded text-sm">10-50 employees (50%)</div>
                  <div className="bg-white px-3 py-2 rounded text-sm">51-100 employees (40%)</div>
                  <div className="bg-white px-3 py-2 rounded text-sm">101-150 employees (10%)</div>
                </div>
              </div>

              <div>
                <p className="font-semibold text-blue-900 text-sm mb-2">Industries:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 [&>*]:min-w-0">
                  {[
                    'Industrial Machinery Manufacturing',
                    'Automation Machinery Manufacturing',
                    'Medical Equipment Manufacturing',
                    'Pharmaceutical Manufacturing',
                    'Food and Beverage Manufacturing',
                    'Beverage Manufacturing',
                    'Consumer Goods Manufacturing',
                    'Cosmetics Manufacturing',
                    'Personal Care Product Manufacturing',
                    'Chemical Manufacturing',
                    'Packaging and Containers Manufacturing',
                    'Plastics Manufacturing',
                    'Tier 1/2 Suppliers (Automotive, Industrial)',
                  ].map((industry) => (
                    <div key={industry} className="bg-white px-3 py-2 rounded text-xs border border-blue-200">
                      {industry}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-semibold text-blue-900 text-sm mb-2">Keywords:</p>
                <CodeBlock code={`("B2B manufacturer" OR "contract manufacturing" OR "private label" OR "white label" OR "OEM" OR "tier 1 supplier" OR "tier 2 supplier" OR "custom manufacturing") AND (B2B OR "business to business")`} />
              </div>

              <div>
                <p className="font-semibold text-blue-900 text-sm mb-2">Revenue:</p>
                <p className="text-sm text-blue-800">$5M - $50M (primary), $50M - $100M (100+ employees only)</p>
              </div>
            </div>
          </div>

          {/* Specialized B2B Services - 30% */}
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <h4 className="font-bold text-green-900 mb-3">2. Specialized B2B Services (30% - 600 leads)</h4>
            <p className="text-sm text-green-800 mb-3">Like Xpose, BeeIT, WULF - specialized services, NOT generic IT/marketing</p>

            <div className="space-y-3">
              <div>
                <p className="font-semibold text-green-900 text-sm mb-2">Company Size:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 [&>*]:min-w-0">
                  <div className="bg-white px-3 py-2 rounded text-sm">10-50 employees (50%)</div>
                  <div className="bg-white px-3 py-2 rounded text-sm">51-100 employees (50%)</div>
                </div>
              </div>

              <div>
                <p className="font-semibold text-green-900 text-sm mb-2">Industries:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 [&>*]:min-w-0">
                  {[
                    'Healthcare B2B Services (tech/mgmt)',
                    'Medical Device Services',
                    'Advertising Services (NOT generic marketing)',
                    'Design Services',
                    'PR and Communications',
                    'Events Services',
                    'Computer Games',
                    'Animation and Post-production',
                    'Specialized Consulting',
                    'Logistics and Supply Chain',
                    'Staffing and Recruiting (IT, Manufacturing)',
                    'Facilities Services',
                  ].map((industry) => (
                    <div key={industry} className="bg-white px-3 py-2 rounded text-xs border border-green-200">
                      {industry}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-semibold text-green-900 text-sm mb-2">Keywords:</p>
                <CodeBlock code={`("specialized in" OR "experts in" OR "boutique" OR "niche") AND "B2B services"`} />
              </div>

              <div>
                <p className="font-semibold text-green-900 text-sm mb-2">Revenue:</p>
                <p className="text-sm text-green-800">$10M - $50M (sweet spot)</p>
              </div>

              <div>
                <p className="font-semibold text-green-900 text-sm mb-2">⛔ EXCLUDE:</p>
                <div className="space-y-1 text-xs text-green-800">
                  <p>❌ Meta ads, Google ads, SEO agencies</p>
                  <p>❌ WordPress/website builders</p>
                  <p>❌ Generic IT consulting/MSPs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Distribution & Wholesale - 15% */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <h4 className="font-bold text-amber-900 mb-3">3. Distribution & Wholesale (15% - 300 leads)</h4>
            <p className="text-sm text-amber-800 mb-3">B2B sales to businesses/retailers, manual processes</p>

            <div className="space-y-3">
              <div>
                <p className="font-semibold text-amber-900 text-sm mb-2">Company Size:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 [&>*]:min-w-0">
                  <div className="bg-white px-3 py-2 rounded text-sm">10-50 employees (50%)</div>
                  <div className="bg-white px-3 py-2 rounded text-sm">51-100 employees (50%)</div>
                </div>
              </div>

              <div>
                <p className="font-semibold text-amber-900 text-sm mb-2">Industries:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 [&>*]:min-w-0">
                  {[
                    'Wholesale Building Materials',
                    'Wholesale Machinery',
                    'Wholesale Food and Beverage',
                    'Wholesale Import and Export',
                    'Wholesale Chemicals',
                    'Wholesale Metals and Minerals',
                    'Wholesale Electronics',
                    'Wholesale Consumer Goods (B2B only)',
                  ].map((industry) => (
                    <div key={industry} className="bg-white px-3 py-2 rounded text-xs border border-amber-200">
                      {industry}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-semibold text-amber-900 text-sm mb-2">Keywords:</p>
                <CodeBlock code={`("B2B distributor" OR "B2B distribution" OR "industrial distribution" OR "wholesale") AND B2B`} />
              </div>

              <div>
                <p className="font-semibold text-amber-900 text-sm mb-2">Revenue:</p>
                <p className="text-sm text-amber-800">$10M - $50M (sweet spot)</p>
              </div>

              <div>
                <p className="font-semibold text-amber-900 text-sm mb-2">⛔ EXCLUDE:</p>
                <p className="text-xs text-amber-800">❌ Direct-to-consumer retailers, B2C eCommerce</p>
              </div>
            </div>
          </div>

          {/* B2B SaaS - 10% */}
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
            <h4 className="font-bold text-purple-900 mb-3">4. B2B SaaS & Software (10% - 200 leads)</h4>
            <p className="text-sm text-purple-800 mb-3">Ideal customers: eBlissAI, Plantryx, AdSigner, Zen2Fit - SaaS companies selling subscriptions to businesses, need constant new client flow</p>

            <div className="space-y-3">
              <div>
                <p className="font-semibold text-purple-900 text-sm mb-2">Company Size:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 [&>*]:min-w-0">
                  <div className="bg-white px-3 py-2 rounded text-sm">5-25 employees (40%)</div>
                  <div className="bg-white px-3 py-2 rounded text-sm">25-50 employees (35%)</div>
                  <div className="bg-white px-3 py-2 rounded text-sm">51-100 employees (25%)</div>
                </div>
              </div>

              <div>
                <p className="font-semibold text-purple-900 text-sm mb-2">Industries:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 [&>*]:min-w-0">
                  {[
                    'Software Development',
                    'IT Services and IT Consulting',
                    'Technology, Information and Internet',
                    'IT System Data Services',
                    'Computer and Network Security',
                    'Vertical SaaS (industry-specific)',
                    'Enterprise Software',
                    'Business Intelligence Platforms',
                  ].map((industry) => (
                    <div key={industry} className="bg-white px-3 py-2 rounded text-xs border border-purple-200">
                      {industry}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-semibold text-purple-900 text-sm mb-2">Good Fit Examples:</p>
                <div className="space-y-1 text-xs text-purple-800">
                  <p>✅ Vertical SaaS for specific industries (healthcare, supply chain, logistics, finance)</p>
                  <p>✅ IT operations/automation platforms</p>
                  <p>✅ Email/communication tools for businesses</p>
                  <p>✅ Corporate wellness/employee platforms</p>
                  <p>✅ Industry-specific compliance/regulatory software</p>
                  <p>✅ Supply chain/planning software</p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-purple-900 text-sm mb-2">Keywords:</p>
                <CodeBlock code={`("SaaS" OR "software platform" OR "B2B software" OR "enterprise software" OR "vertical SaaS") AND ("subscription" OR "recurring revenue" OR "B2B") AND -"marketing agency" AND -"SEO" AND -"meta ads"`} />
              </div>

              <div>
                <p className="font-semibold text-purple-900 text-sm mb-2">Revenue:</p>
                <p className="text-sm text-purple-800">$500K - $50M (wide range to catch early-stage SaaS)</p>
              </div>

              <div>
                <p className="font-semibold text-purple-900 text-sm mb-2">⛔ EXCLUDE:</p>
                <div className="space-y-1 text-xs text-purple-800">
                  <p>❌ HR tech / Recruiting software (saturated, sophisticated buyers)</p>
                  <p>❌ Marketing automation / Email marketing platforms (saturated)</p>
                  <p>❌ CRM platforms (saturated, competitive)</p>
                  <p>❌ Project management tools (saturated)</p>
                  <p>❌ B2C apps / Consumer software</p>
                  <p>❌ Companies with large SDR/BDR teams already</p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-purple-900 text-sm mb-2">🎯 Target Profile:</p>
                <p className="text-xs text-purple-800">Growing B2B SaaS companies selling subscriptions to businesses, founder-led sales transitioning to scalable outbound, manual sales processes, need constant new pipeline</p>
              </div>
            </div>
          </div>

          {/* AI Companies - 5% */}
          <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded">
            <h4 className="font-bold text-rose-900 mb-3">5. AI Companies (5% - 100 leads)</h4>
            <p className="text-sm text-rose-800 mb-3">New AI companies hungry for leads - experimental focus</p>

            <div className="space-y-3">
              <div>
                <p className="font-semibold text-rose-900 text-sm mb-2">Company Size:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 [&>*]:min-w-0">
                  <div className="bg-white px-3 py-2 rounded text-sm">10-50 employees (70%)</div>
                  <div className="bg-white px-3 py-2 rounded text-sm">51-100 employees (30%)</div>
                </div>
              </div>

              <div>
                <p className="font-semibold text-rose-900 text-sm mb-2">Industries:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 [&>*]:min-w-0">
                  {[
                    'AI Product Development',
                    'Artificial Intelligence and Machine Learning',
                    'AI SaaS Platforms',
                    'Industry-specific AI Solutions',
                  ].map((industry) => (
                    <div key={industry} className="bg-white px-3 py-2 rounded text-xs border border-rose-200">
                      {industry}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-semibold text-rose-900 text-sm mb-2">Keywords:</p>
                <CodeBlock code={`("AI product" OR "AI platform" OR "artificial intelligence" OR "machine learning solution") AND B2B`} />
              </div>

              <div>
                <p className="font-semibold text-rose-900 text-sm mb-2">Revenue:</p>
                <p className="text-sm text-rose-800">$5M - $50M</p>
              </div>

              <div>
                <p className="font-semibold text-rose-900 text-sm mb-2">Target Profile:</p>
                <p className="text-xs text-rose-800">Founded in last 2-3 years, developing AI products, struggling with customer acquisition</p>
              </div>
            </div>
          </div>

          <div className="bg-violet-50 border-l-4 border-violet-500 p-4 rounded">
            <p className="font-semibold text-violet-900 mb-2">All Categories - Common Filters:</p>
            <ul className="space-y-1 text-sm text-violet-800">
              <li>✓ Has active website</li>
              <li>✓ B2B filter enabled in Clay</li>
              <li>✓ LinkedIn company page active</li>
              <li>✓ NOT using advanced sales tools (manual sales processes)</li>
              <li>✓ No large in-house SDR/BDR teams</li>
            </ul>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function PromptsTab() {
  const initialClayPrompt = `Determine if this company matches Intelsol's ICP for B2B lead generation services.

DISQUALIFY ONLY IF:
- Clearly sells to consumers (B2C) - e-commerce stores, consumer products, retail
- Marketing agency doing meta ads, Google ads, SEO, or WordPress development
- Nonprofit organization
- Explicitly states 500+ employees or Fortune 500 company

A MATCH if:
- Sells to businesses (B2B) or appears to be B2B
- No evidence of above disqualifiers

OUTPUT FORMAT:
1. B2B company (or appears to be B2B)? true/false
2. Any disqualifiers present? true/false
3. ICP MATCH? YES/NO (YES if B2B and no disqualifiers)

DEFAULT TO YES unless there is clear evidence the company does NOT fit.

Use only information visible in the provided content.`;

  const icpPrompt = `Determine if this company matches Intelsol's ICP for B2B lead generation services.

A match should be:
- Sells to businesses (B2B), not consumers
- 5-150 employees
- Located in: US, UK, Germany, Netherlands, Belgium, Austria, Switzerland, Nordics, or France

Not a match if:
- Sells to consumers (B2C)
- Marketing agency doing meta ads, Google ads, SEO, or WordPress development
- Nonprofit organization
- Under 5 or over 150 employees

OUTPUT FORMAT:
1. B2B company? YES/NO
2. Right size (5-150 employees)? YES/NO
3. Right location? YES/NO
4. ICP MATCH? YES/NO (only YES if all 3 above are YES and not a marketing agency/nonprofit/B2C)

Use only information visible on the company website.`;

  const personalizationPrompt = `Based on the company website and LinkedIn data provided, write a personalized opening sentence for a cold email.

Rules:
- Reference something specific about the company (recent news, service they offer, market they serve)
- Keep it to 1 sentence, under 25 words
- Sound like a peer, not a salesperson
- Do NOT use hype words (revolutionary, game-changing, cutting-edge)
- Do NOT mention Intelsol or our services in the opener

Output only the personalized sentence, nothing else.`;

  return (
    <>
      <ContentSection title="Initial Clay Website Match" icon={<Code className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Use this prompt FIRST in Clay to do initial filtering based on website content only.
            Defaults to YES unless company is clearly B2C, marketing agency, nonprofit, or enterprise (500+ employees).
          </p>
          <CodeBlock code={initialClayPrompt} language="text" />
        </div>
      </ContentSection>

      <ContentSection title="ICP Matching Prompt (Anthropic)" icon={<Code className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            This prompt is used in Clay to analyze company websites and determine if they match Intelsol's ICP.
          </p>
          <CodeBlock code={icpPrompt} language="text" />
        </div>
      </ContentSection>

      <ContentSection title="Personalization Prompt" icon={<Code className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Used to generate personalized email openers based on website and LinkedIn data.
          </p>
          <CodeBlock code={personalizationPrompt} language="text" />
        </div>
      </ContentSection>

      <ContentSection title="Matching Criteria Summary" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-3">
          <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
            <p className="font-medium text-green-900">GOOD MATCH</p>
            <p className="text-green-800 text-sm mt-1">
              B2B company (services, SaaS, OR industrial/manufacturing) with 20-200 employees, high-ticket offers ($20K+), active sales process, located in EU markets, clear website.
            </p>
          </div>
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
            <p className="font-medium text-red-900">NOT A MATCH</p>
            <p className="text-red-800 text-sm mt-1">
              B2C company, low-ticket consumer eCommerce, too small (&lt;20) or too large (&gt;200), distributors-only, commodity business, broken website, or already has large in-house SDR team.
            </p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function PersonasTab() {
  return (
    <>
      <ContentSection title="Buyer Personas" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-6">
          <div className="bg-violet-50 border-l-4 border-violet-500 p-4 rounded">
            <p className="font-semibold text-violet-900 mb-2">Primary Decision-Makers</p>
            <p className="text-violet-800 text-sm">
              Target the people who own revenue growth and sales pipeline. They feel the pain of
              not having enough leads and have budget authority to hire an agency.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <span className="w-8 h-8 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">1</span>
              Founders & CEOs (Companies 10-50 employees)
            </h4>
            <ul className="ml-10 space-y-2">
              <ListItem>CEO / Founder / Co-Founder</ListItem>
              <ListItem>Managing Director</ListItem>
              <ListItem>Owner</ListItem>
              <ListItem>General Manager</ListItem>
            </ul>
            <div className="ml-10 mt-3 bg-slate-50 border-l-4 border-slate-300 p-3 rounded">
              <p className="text-sm text-slate-700">
                <strong>Why:</strong> At this size, the founder typically owns sales and pipeline.
                They are doing outbound themselves and want to offload it.
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">2</span>
              Sales Leaders (Companies 50-200 employees)
            </h4>
            <ul className="ml-10 space-y-2">
              <ListItem>VP of Sales</ListItem>
              <ListItem>Head of Sales</ListItem>
              <ListItem>Sales Director</ListItem>
              <ListItem>Head of Business Development</ListItem>
              <ListItem>Director of Growth</ListItem>
              <ListItem>Revenue Operations Manager</ListItem>
            </ul>
            <div className="ml-10 mt-3 bg-slate-50 border-l-4 border-slate-300 p-3 rounded">
              <p className="text-sm text-slate-700">
                <strong>Why:</strong> At this size, a dedicated sales leader owns pipeline targets.
                They need more leads than their SDR team can generate.
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">3</span>
              Marketing Leaders (Secondary)
            </h4>
            <ul className="ml-10 space-y-2">
              <ListItem>VP of Marketing</ListItem>
              <ListItem>Head of Demand Generation</ListItem>
              <ListItem>Marketing Director</ListItem>
              <ListItem>Growth Marketing Manager</ListItem>
            </ul>
            <div className="ml-10 mt-3 bg-slate-50 border-l-4 border-slate-300 p-3 rounded">
              <p className="text-sm text-slate-700">
                <strong>Why:</strong> In some companies, marketing owns lead generation including outbound.
                Secondary target — only if sales leader not available.
              </p>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Apollo Enrichment Settings" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900 mb-2">Required Fields:</h4>
          <ul className="space-y-2">
            <ListItem type="check">First Name</ListItem>
            <ListItem type="check">Last Name</ListItem>
            <ListItem type="check">Job Title</ListItem>
            <ListItem type="check">Email Address</ListItem>
            <ListItem type="check">LinkedIn URL</ListItem>
            <ListItem type="check">Company Name</ListItem>
            <ListItem type="check">Company Website</ListItem>
          </ul>
        </div>
      </ContentSection>
    </>
  );
}


function DocumentsTab() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleUpdateDatabase = async () => {
    setSyncing(true);
    try {
      // Trigger GitHub Actions workflow
      const response = await fetch('/api/sync-intelsol-data', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setLastUpdated(new Date().toLocaleString());
        alert('Database and performance stats updated successfully!');
        // Reload page to show updated data
        window.location.reload();
      } else {
        alert('Failed to trigger update. Please try again.');
      }
    } catch (error) {
      console.error('Error triggering update:', error);
      alert('Error triggering update. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <>
      {/* Uploaded Documents Section */}
      <ContentSection title="Uploaded Documents" icon={<FolderOpen className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-600">
              Upload and manage documents for Intelsol. All uploaded files will be available for download.
            </p>
            <FileUpload clientId="intelsol" onUploadComplete={handleUploadComplete} />
          </div>

          <FileList clientId="intelsol" refreshTrigger={refreshTrigger} />
        </div>
      </ContentSection>

      {/* Lead Database Section */}
      <ContentSection title="Lead Database" icon={<FileText className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-slate-600">
            Download the complete database of all leads targeted across all Intelsol campaigns.
            This file contains first name, last name, email, company information, and LinkedIn profiles.
          </p>

          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:border-violet-500 transition-colors">
            <div className="flex items-center justify-between group">
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-violet-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <a
                      href="/data/intelsol-database.csv"
                      download="intelsol-database.csv"
                      className="text-lg font-semibold text-slate-900 hover:text-violet-600 transition-colors"
                    >
                      Download Lead Database
                    </a>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">CSV file • 37,635 leads across 70 campaigns</p>
                  {lastUpdated && (
                    <p className="text-xs text-slate-400 mt-1">Last updated: {lastUpdated}</p>
                  )}
                </div>
              </div>
              
              <button
                onClick={handleUpdateDatabase}
                disabled={syncing}
                className="ml-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {syncing ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Update Database</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-900">
              <strong>How it works:</strong> Click "Update Database" to fetch the latest leads from SmartLead.
              This will update both the database file and performance metrics. The sync typically takes 2-3 minutes.
            </p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}
