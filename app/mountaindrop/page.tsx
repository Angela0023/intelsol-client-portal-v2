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
import { Target, Users, Filter, Code, TrendingUp, FileText, Layers, CheckSquare, BarChart3, Zap, Mail, FolderOpen } from 'lucide-react';
import DocumentsTabGeneric from '../components/DocumentsTabGeneric';

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

const MOUNTAINDROP_DEFAULT_TASKS = [
  {
    id: 'task-1',
    title: 'Initial campaign setup and list building',
    description: 'Set up targeting filters and build initial prospect list',
    status: 'pending' as const,
    priority: 'high' as const,
  },
];

export default function MountaindropPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('mountaindrop', DEFAULT_STATUSES.mountaindrop));

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
    setClientStatus('mountaindrop', newStatus);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const newPath = tabId === 'overview' ? '/mountaindrop' : `/mountaindrop/${tabId}`;
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
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-emerald-600">M</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-slate-900">Mountaindrop</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
              </div>
              <p className="text-slate-600">Premium Shilajit & Adaptogen Supplements</p>
            </div>
          </div>
          <a
            href="https://mountaindrop.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-green-600 hover:underline inline-block"
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
          {activeTab === 'icp' && <ICPAndPersonasTab />}
          {activeTab === 'filters' && <FiltersTab />}
          {activeTab === 'prompts' && <PromptsTab />}
          {activeTab === 'campaigns-sequences' && <CampaignsSequencesTab />}
          {activeTab === 'performance' && (
            <>
              <PerformanceTabDynamic clientId="mountaindrop" />
              <CampaignsTabDynamic clientId="mountaindrop" />
            </>
          )}
          {activeTab === 'documents' && <DocumentsTabGeneric clientId="mountaindrop" />}
          {activeTab === 'tasks' && <TasksTab clientId="mountaindrop" defaultTasks={MOUNTAINDROP_DEFAULT_TASKS} />}
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
            <strong>Mountaindrop</strong> offers premium, third-party lab-tested Himalayan & Altai Shilajit resin
            and adaptogen-based wellness blends to B2B supplement retailers across Europe.
          </p>

          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded">
            <p className="font-semibold text-emerald-900 mb-2">Manufacturing Partner:</p>
            <p className="text-emerald-800">
              BTI KI TRENING d.o.o., Škofja Loka, Slovenia - GMP, HACCP, IFS and ISO 9001 certified facility
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Core Product" value="Himalayan & Altai Shilajit Resin" />
            <InfoCard label="Product Format" value="Authentic Resin (not powder/capsules)" />
            <InfoCard label="Certifications" value="6+ Independent Lab Tests" />
            <InfoCard label="Track Record" value="25,000+ Jars Delivered" />
            <InfoCard label="Customer Rating" value="4.8/5 from 1,000+ Reviews" />
            <InfoCard label="Distribution" value="Multiple Countries Active" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Product Line" icon={<Layers className="w-5 h-5" />}>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Shilajit Products:</h4>
            <ul className="space-y-2">
              <ListItem type="check">Pure Himalayan & Altai Shilajit Resin (30g and 60g jars)</ListItem>
              <ListItem type="check">Ashwagandha Plus (Shilajit + Ashwagandha blend)</ListItem>
              <ListItem type="check">Flourish (Women's wellness blend)</ListItem>
              <ListItem type="check">Genius (Cognitive support blend)</ListItem>
              <ListItem type="check">Microbion (Gut health blend)</ListItem>
              <ListItem type="check">Prime (Men's vitality blend)</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Additional Products:</h4>
            <ul className="space-y-2">
              <ListItem>Energy bars</ListItem>
              <ListItem>Natural skincare products</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Campaign Focus" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">Outbound B2B Strategy:</p>
            <p className="text-blue-800">
              Reaching existing multi-brand supplement retailers who could add Mountaindrop to their portfolio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Primary Markets" value="Croatia & Serbia" />
            <InfoCard label="Secondary Markets" value="DACH (Germany, Austria, Switzerland)" />
            <InfoCard label="Expansion" value="Wider EU" />
            <InfoCard label="Language" value="English + Local (HR/SRB/DACH)" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Value Proposition">
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded">
          <p className="text-slate-800 font-medium">
            Add a proven, lab-tested, premium Shilajit and adaptogen line to your portfolio - an established brand with real certifications and a track record, not an unproven newcomer.
          </p>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Primary Pain Addressed</h4>
            <p className="text-slate-700">
              Retailers want new, trending, high-margin SKUs (Shilajit and adaptogens are a growing category) without taking on the quality or sourcing risk of an unverified brand.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Proof Points</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>25,000+ jars delivered worldwide</li>
              <li>4.8/5 rating from 1,000+ verified customer reviews</li>
              <li>6+ independent lab certifications (heavy metals, fulvic acid, purity)</li>
              <li>GMP, HACCP, IFS and ISO 9001 certified manufacturing</li>
              <li>Existing distributor network active in multiple countries</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Messaging Tone</h4>
            <p className="text-slate-700">
              Professional, trust- and quality-led - lead with authenticity, lab-testing and proof, not hype.
            </p>
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
            <h4 className="font-semibold text-slate-900 mb-3">Target Geography:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoCard label="Primary" value="Croatia & Serbia" color="bg-emerald-50 text-emerald-700" />
              <InfoCard label="Secondary" value="DACH Region" color="bg-blue-50 text-blue-700" />
              <InfoCard label="Expansion" value="Wider EU" color="bg-slate-50 text-slate-700" />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Company Type - Multi-Brand Supplement Retailers:</h4>
            <p className="text-slate-700 mb-4">
              Retailers that already sell food supplements to end customers and carry multiple third-party brands - not exclusively their own private label.
            </p>

            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded mb-4">
              <p className="font-semibold text-emerald-900 mb-2">Include:</p>
              <ul className="text-emerald-800 text-sm space-y-1">
                <ListItem>Specialized supplement / sports nutrition stores (physical and/or online)</ListItem>
                <ListItem>Health food & wellness stores that stock supplement brands</ListItem>
                <ListItem>Pharmacies or wellness retailers with a multi-brand supplement section</ListItem>
                <ListItem>Online supplement shops / webshops carrying multiple brands</ListItem>
              </ul>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="font-semibold text-red-900 mb-2">Exclude:</p>
              <ul className="text-red-800 text-sm space-y-1">
                <ListItem type="cross">Shilajit producers/brands (direct competitors)</ListItem>
                <ListItem type="cross">Supplement manufacturers in general</ListItem>
                <ListItem type="cross">White label / private label production companies</ListItem>
                <ListItem type="cross">Retailers selling exclusively their own private-label products</ListItem>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Industries / Verticals:</h4>
            <div className="space-y-3">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p className="font-semibold text-blue-900 text-sm mb-1">Primary:</p>
                <p className="text-blue-800 text-sm">Sports nutrition retailers, health food & supplement stores, specialty wellness retailers</p>
              </div>
              <div className="bg-slate-50 border-l-4 border-slate-400 p-3 rounded">
                <p className="font-semibold text-slate-900 text-sm mb-1">Secondary:</p>
                <p className="text-slate-700 text-sm">Online supplement webshops/marketplaces, gyms or fitness centers with retail corners selling third-party products</p>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Buyer Personas">
        <p className="text-slate-600 mb-4">
          The buying decision sits with whoever controls what goes on the shelf or in the webshop catalog - usually the owner in smaller stores, a dedicated buyer in larger ones.
        </p>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-blue-900">PRIMARY PERSONA 1: Store Owner</h3>
              <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs font-semibold rounded">PRIMARY</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <p><strong>Title Examples:</strong> Owner, Founder, Managing Director</p>
              <p><strong>When to Target:</strong> Independent or small chain stores - final decision-maker on new brands</p>
              <p><strong>Pain Points:</strong> Need to curate profitable, quality brands without shelf space waste; concerned about quality/sourcing risks with new products</p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-green-900">PRIMARY PERSONA 2: Purchasing / Category Manager</h3>
              <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-semibold rounded">PRIMARY</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <p><strong>Title Examples:</strong> Purchasing Manager, Category Manager (Supplements/Health), Buyer</p>
              <p><strong>When to Target:</strong> Larger retail chains - owns which brands get listed</p>
              <p><strong>Pain Points:</strong> Evaluating new brands for supply reliability, certifications, margins; avoiding quality issues that hurt company reputation</p>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-amber-900">SECONDARY PERSONA: E-commerce Manager</h3>
              <span className="px-2 py-1 bg-amber-200 text-amber-800 text-xs font-semibold rounded">SECONDARY</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <p><strong>Title Examples:</strong> E-commerce Manager, Online Store Manager</p>
              <p><strong>When to Target:</strong> Webshop-based retailers - owns the online catalog</p>
              <p><strong>Pain Points:</strong> Need products that convert well online with ready content, reviews, and clear differentiation; avoiding customer service headaches</p>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Buying Signals & Targeting Logic">
        <p className="text-slate-600 mb-4">
          Fit is mostly structural (a multi-brand supplement retailer with real end-customer sales), so signals here are used to prioritize and sequence outreach, not to gate it.
        </p>

        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-1">TIER 1: Portfolio Expansion</h4>
            <p className="text-slate-700">Store actively adding new supplement brands - a "new arrivals" or "new brands" section, recent listings</p>
          </div>

          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-1">TIER 1: Shilajit Gap</h4>
            <p className="text-slate-700">No Shilajit or adaptogen product currently in their catalog - a clear gap to fill</p>
          </div>

          <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
            <h4 className="font-semibold text-green-900 mb-1">TIER 2: Premium/Quality Positioning</h4>
            <p className="text-slate-700">Store's own branding emphasizes quality, lab-testing, or premium sourcing - aligned with Mountaindrop's positioning</p>
          </div>

          <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
            <h4 className="font-semibold text-green-900 mb-1">TIER 2: Active Online Presence</h4>
            <p className="text-slate-700">Active webshop and/or social media - easier to onboard and list a new brand quickly</p>
          </div>

          <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-500">
            <h4 className="font-semibold text-amber-900 mb-1">TIER 3: Wellness/Adaptogen Trend Content</h4>
            <p className="text-slate-700">Store publishes content around wellness trends, biohacking, or adaptogens - audience already primed for Shilajit/Ashwagandha</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="How We Identify Target Companies" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Firmographic Fit:</h4>
            <p className="text-slate-700">
              Multi-brand supplement/sports nutrition retailer (store and/or webshop) selling to end customers in Croatia, Serbia, DACH or the wider EU; not a producer or private-label-only retailer.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Decision-Maker Contacts:</h4>
            <p className="text-slate-700">
              Owner or purchasing/category manager per persona definitions; e-commerce manager for webshop-led retailers.
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">Prioritization:</p>
            <p className="text-blue-800">
              Retailers matching a Tier 1 signal (actively expanding brands, no Shilajit yet) are sequenced first; the rest of the fitting list is worked through in parallel rather than excluded.
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
          Standard B2B data enrichment and web research to identify multi-brand supplement retailers in target geographies.
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Firmographic Filters:</h4>
            <ul className="space-y-2">
              <ListItem><strong>Geography:</strong> Croatia, Serbia (primary); Germany, Austria, Switzerland (DACH); wider EU (expansion)</ListItem>
              <ListItem><strong>Company Type:</strong> Supplement retailers, health food stores, pharmacies with supplement sections, online supplement webshops</ListItem>
              <ListItem><strong>Business Model:</strong> Multi-brand retailers (not private-label-only or manufacturers)</ListItem>
              <ListItem><strong>Customer Type:</strong> B2C retailers selling to end customers (not B2B producers/wholesalers)</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Exclusion Filters:</h4>
            <ul className="space-y-2">
              <ListItem type="cross">Shilajit producers/brands (direct competitors)</ListItem>
              <ListItem type="cross">Supplement manufacturers</ListItem>
              <ListItem type="cross">White label / private label production companies</ListItem>
              <ListItem type="cross">Retailers selling exclusively own private-label products</ListItem>
              <ListItem type="cross">Existing Mountaindrop distributors/retailers</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Contact Data Requirements:</h4>
            <ul className="space-y-2">
              <ListItem><strong>Job Titles:</strong> Owner, Founder, Managing Director, Purchasing Manager, Category Manager, Buyer, E-commerce Manager, Online Store Manager</ListItem>
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
          AI prompts for identifying buying signals and prioritizing prospects.
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Portfolio Expansion Signal (Tier 1)</h4>
            <CodeBlock code="Does this retailer's website show evidence of actively adding new supplement brands? Look for: 'new arrivals' sections, 'new brands' pages, recently added product listings, announcements about expanding their catalog. Return YES if clear evidence found, NO if not." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Shilajit Gap Signal (Tier 1)</h4>
            <CodeBlock code="Search this retailer's product catalog for Shilajit or adaptogen products (Shilajit, Ashwagandha, Rhodiola, etc.). Return YES if they currently have NO Shilajit or adaptogen products (gap in catalog), NO if they already stock these categories." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Premium/Quality Positioning Signal (Tier 2)</h4>
            <CodeBlock code="Analyze this retailer's branding and messaging. Do they emphasize quality, lab-testing, premium sourcing, certifications, or 'verified' products? Look for mentions of third-party testing, quality standards, premium positioning. Return YES if quality-focused, NO if price-focused or unclear." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Wellness/Adaptogen Content Signal (Tier 3)</h4>
            <CodeBlock code="Check if this retailer publishes content (blog, social media, newsletters) about wellness trends, biohacking, adaptogens, or natural supplements. Return YES if they actively create content in these areas, NO if not." />
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function CampaignsSequencesTab() {
  return (
    <>
      <SequencesTab clientId="mountaindrop" />
      <div className="mt-8">
        <CampaignsTabGeneric />
      </div>
    </>
  );
}
