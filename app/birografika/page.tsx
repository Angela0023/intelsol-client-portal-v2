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
  { id: 'campaigns-sequences', label: 'Campaigns & Sequences', icon: Zap },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'documents', label: 'Documents', icon: FolderOpen },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
];

export default function BirografikaPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Onboarding');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('birografika', DEFAULT_STATUSES.birografika));

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
    setClientStatus('birografika', newStatus);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const newPath = tabId === 'overview' ? '/birografika' : `/birografika/${tabId}`;
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
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-lime-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl lg:text-2xl font-bold text-lime-600">BM</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 lg:space-x-3 flex-wrap">
                <h1 className="text-xl lg:text-3xl font-bold text-slate-900">Birografika MB</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
              </div>
              <p className="text-sm lg:text-base text-slate-600 break-words">Label & Print Production - Subotica, Serbia</p>
            </div>
          </div>
          <a
            href="https://birografika.rs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-lime-600 hover:underline inline-block"
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
              <PerformanceTabDynamic clientId="birografika" />
              <CampaignsTabDynamic clientId="birografika" />
            </>
          )}
          {activeTab === 'documents' && (
            <DocumentsTabGeneric
              clientId="birografika"
              clientName="Birografika MB"
              totalLeads={0}
              totalCampaigns={0}
              accentColor="lime"
            />
          )}
          {activeTab === 'tasks' && (
            <TasksTab clientId="birografika" defaultTasks={[]} />
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
            Birografika MB is a label and print production company based in Subotica, Serbia, with over 60 years of experience since 1963. They manufacture recurring industrial labels (flexo, offset, digital) for bottled beverages, dairy, processed food, and other FMCG segments across Central Europe.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Industry" value="Label & Print Production" />
            <InfoCard label="Location" value="Subotica, Serbia" />
            <InfoCard label="Website" value={
              <a href="https://birografika.rs" target="_blank" rel="noopener noreferrer" className="text-lime-600 hover:underline">
                https://birografika.rs
              </a>
            } />
            <InfoCard label="Experience" value="60+ years (since 1963)" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Primary Services" icon={<TrendingUp className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="check">Flexo printing (UV Flexo, Mark Andy equipment)</ListItem>
          <ListItem type="check">Offset printing (large-run capability)</ListItem>
          <ListItem type="check">Digital printing</ListItem>
          <ListItem type="check">Specialized in recurring industrial labels</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Equipment & Capabilities">
        <ul className="space-y-2">
          <ListItem type="arrow">UV Flexo production</ListItem>
          <ListItem type="arrow">MPS EFC 430 (8 units, cold foil, lamination)</ListItem>
          <ListItem type="arrow">Grafotronic SCF 350 (die-cutting machine)</ListItem>
          <ListItem type="arrow">Rotoflex (automatic label cutting and inspection, VLI 250)</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Materials">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <ListItem type="dot">Paper</ListItem>
          <ListItem type="dot">OPP/BOPP</ListItem>
          <ListItem type="dot">PP</ListItem>
          <ListItem type="dot">PE</ListItem>
          <ListItem type="dot">Duplex films</ListItem>
          <ListItem type="dot">Triplex films</ListItem>
        </div>
      </ContentSection>

      <ContentSection title="Quality Standards & Certifications">
        <ul className="space-y-2">
          <ListItem type="check">ISO 9001:2015 (Quality Management)</ListItem>
          <ListItem type="check">ISO 14001:2015 (Environmental Management)</ListItem>
          <ListItem type="check">ISO 45001:2018 (Occupational Health & Safety)</ListItem>
          <ListItem type="check">HACCP (Food Safety)</ListItem>
          <ListItem type="check">FSC Certified (Sustainable Sourcing)</ListItem>
          <ListItem type="check">SEDEX Audited (Ethical Supply Chain)</ListItem>
        </ul>
        <p className="text-sm text-slate-600 mt-4">
          Quality management policy dated April 2025
        </p>
      </ContentSection>

      <ContentSection title="Public Customer References">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <ListItem type="arrow">Neoplanta (food/oils)</ListItem>
          <ListItem type="arrow">Pionir (confectionery)</ListItem>
          <ListItem type="arrow">Imlek (dairy)</ListItem>
          <ListItem type="arrow">Fruvita (beverages)</ListItem>
          <ListItem type="arrow">Premier Aqua (bottled water)</ListItem>
          <ListItem type="arrow">Tigar Tires (industrial)</ListItem>
          <ListItem type="arrow">Nectar (food/beverage)</ListItem>
        </div>
      </ContentSection>
    </>
  );
}

function ICPAndPersonasTab() {
  return (
    <>
      <ContentSection title="Target Geography (4-Wave Rollout)" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Wave 1: Nearby Tests</h3>
            <p className="text-sm text-blue-800">Slovenia, Croatia, Hungary</p>
            <p className="text-xs text-blue-700 mt-1">Lower shipping, shorter lead time, culturally similar buyers</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">Wave 2: Strategic Scale</h3>
            <p className="text-sm text-green-800">Austria, Germany</p>
            <p className="text-xs text-green-700 mt-1">High FMCG volume, cost-conscious, nearshore advantage</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-900 mb-2">Wave 3: Expansion</h3>
            <p className="text-sm text-amber-800">Czechia, Slovakia, Romania</p>
            <p className="text-xs text-amber-700 mt-1">CEE expansion markets</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">Wave 4: DACH Extension</h3>
            <p className="text-sm text-purple-800">Switzerland</p>
            <p className="text-xs text-purple-700 mt-1">Premium FMCG segment, nearshore alternative to higher-cost local production</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Company Size Targets">
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-2">CORE: 50-500 Employees</h3>
            <p className="text-sm text-slate-700">EUR 10-150M revenue, dedicated packaging buyer or packaging-aware procurement</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-2">SELECTIVE SMALL: 20-49 Employees</h3>
            <p className="text-sm text-slate-700">EUR 3-10M revenue, owner/CEO is primary buyer</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-2">SELECTIVE LARGE: 501-2,000+ Employees</h3>
            <p className="text-sm text-slate-700">EUR 150-500M+ revenue, second-source or cost-benchmarking context only</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Primary Industries (A-Tier)">
        <ul className="space-y-2">
          <ListItem type="check">A1: Bottled water, juices, soft drinks, other beverages</ListItem>
          <ListItem type="check">A2: Dairy (milk, yogurt, kefir), edible oils</ListItem>
          <ListItem type="check">A3: Processed food, confectionery, snacks</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Additional Segments (B-Tier)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <ListItem type="arrow">Cosmetics & personal care</ListItem>
          <ListItem type="arrow">Household & industrial chemicals</ListItem>
          <ListItem type="arrow">Automotive fluids & lubricants</ListItem>
          <ListItem type="arrow">Wine & spirits</ListItem>
          <ListItem type="arrow">Pharmaceutical & nutraceuticals</ListItem>
        </div>
      </ContentSection>

      <ContentSection title="Business Models">
        <ul className="space-y-2">
          <ListItem type="check">Own-brand manufacturers (primary target)</ListItem>
          <ListItem type="check">Private-label manufacturers</ListItem>
          <ListItem type="check">Contract manufacturers (co-packers)</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Buyer Personas (6 Tiers)" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">TIER 1 (PRIMARY): Procurement/Purchasing</h3>
            <p className="text-sm text-blue-800 mb-2"><strong>Titles:</strong> Head of Procurement, Purchasing Manager, Strategic Buyer, Packaging Buyer</p>
            <p className="text-sm text-blue-800 mb-2"><strong>Role:</strong> Default buyer for repeat contracts, supplier qualification, cost benchmarking</p>
            <p className="text-sm text-blue-800"><strong>Messaging:</strong> Landed-cost comparison, nearshore advantage, competitive Serbian economics, second-source evaluation</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">TIER 2 (PRIMARY CHAMPION): Packaging</h3>
            <p className="text-sm text-green-800 mb-2"><strong>Titles:</strong> Packaging Manager, Head of Packaging, Packaging Development Manager</p>
            <p className="text-sm text-green-800 mb-2"><strong>Role:</strong> Specifications, material changes, label-line compatibility, trials</p>
            <p className="text-sm text-green-800"><strong>Messaging:</strong> Technical capabilities, finish consistency, quality certifications, artwork support</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">TIER 3 (PRIMARY/CO-BUYER): Supply Chain/Operations/Production</h3>
            <p className="text-sm text-purple-800 mb-2"><strong>Titles:</strong> Supply Chain Manager, Operations Director, Production Manager, Plant Manager</p>
            <p className="text-sm text-purple-800 mb-2"><strong>Role:</strong> Capacity planning, replenishment, delivery coordination, line expansion</p>
            <p className="text-sm text-purple-800"><strong>Messaging:</strong> Repeat supply reliability, capacity planning, nearshore logistics advantage</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-900 mb-2">TIER 4 (PRIMARY IN SMALLER FIRMS): Leadership</h3>
            <p className="text-sm text-amber-800 mb-2"><strong>Titles:</strong> CEO, Managing Director, Owner, Founder</p>
            <p className="text-sm text-amber-800 mb-2"><strong>Role:</strong> Primary buyer when no dedicated packaging role exists</p>
            <p className="text-sm text-amber-800"><strong>Messaging:</strong> Production partnership, reliable European partner, competitive economics</p>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h3 className="font-semibold text-indigo-900 mb-2">TIER 5 (SECONDARY): Marketing/Product</h3>
            <p className="text-sm text-indigo-800 mb-2"><strong>Titles:</strong> Marketing Manager, Brand Manager, Product Manager</p>
            <p className="text-sm text-indigo-800 mb-2"><strong>Role:</strong> Rebrand champion, new SKU launch, specification briefing</p>
            <p className="text-sm text-indigo-800"><strong>Messaging:</strong> Rebrand support, new product launches, specification coordination</p>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
            <h3 className="font-semibold text-rose-900 mb-2">TIER 6 (TERTIARY): Quality/Technical</h3>
            <p className="text-sm text-rose-800 mb-2"><strong>Titles:</strong> Quality Manager, QA Manager, Technical Manager</p>
            <p className="text-sm text-rose-800 mb-2"><strong>Role:</strong> Documentation, trials, application approval</p>
            <p className="text-sm text-rose-800"><strong>Messaging:</strong> Quality documentation, trials, standards consistency</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Buying Signals">
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">TIER 1 (Strongest)</h3>
            <ul className="space-y-1 text-sm text-green-800">
              <ListItem type="arrow">Active sourcing event (RFQ, supplier search, cost benchmarking)</ListItem>
              <ListItem type="arrow">Dated launch plan (Q3 2026 rebrand, H2 2026 new line)</ListItem>
              <ListItem type="arrow">New production line or filling equipment announced</ListItem>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">TIER 2 (Moderate)</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <ListItem type="arrow">Market or channel expansion (new geography, retail entry)</ListItem>
              <ListItem type="arrow">Hiring for packaging, supply chain, or production roles</ListItem>
              <ListItem type="arrow">Sustainability or packaging redesign initiative</ListItem>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-900 mb-2">TIER 3 (Baseline)</h3>
            <ul className="space-y-1 text-sm text-amber-800">
              <ListItem type="arrow">Recurring volume evidence (many SKUs, consistent production)</ListItem>
              <ListItem type="arrow">Established FMCG brand with retail distribution</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Exclusion Criteria">
        <ul className="space-y-2">
          <ListItem type="cross">Direct competitors (other label printers)</ListItem>
          <ListItem type="cross">Packaging brokers or agencies</ListItem>
          <ListItem type="cross">Pure resellers or distributors</ListItem>
          <ListItem type="cross">Services-only companies (no manufactured products)</ListItem>
          <ListItem type="cross">Pre-launch brands with no existing volume</ListItem>
        </ul>
      </ContentSection>
    </>
  );
}

function FiltersTab() {
  return (
    <>
      <ContentSection title="Clay Configuration" icon={<Filter className="w-5 h-5" />}>
        <p className="text-sm text-slate-600 mb-4">
          Use Clay's company search and enrichment to target FMCG manufacturers across CEE and DACH markets.
        </p>
      </ContentSection>

      <ContentSection title="Firmographic Filters">
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-slate-900 mb-1">Location</p>
            <p className="text-sm text-slate-700">Wave 1: Slovenia, Croatia, Hungary → Wave 2: Austria, Germany → Wave 3: Czechia, Slovakia, Romania → Wave 4: Switzerland</p>
          </div>

          <div>
            <p className="font-semibold text-slate-900 mb-1">Employee Count</p>
            <p className="text-sm text-slate-700">Core: 50-500 | Selective Small: 20-49 | Selective Large: 501-2,000+</p>
          </div>

          <div>
            <p className="font-semibold text-slate-900 mb-1">Revenue</p>
            <p className="text-sm text-slate-700">Core: EUR 10-150M | Selective Small: EUR 3-10M | Selective Large: EUR 150-500M+</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Industry Filters">
        <div className="space-y-2">
          <p className="font-semibold text-slate-900">A-Tier (Primary):</p>
          <ul className="space-y-1">
            <ListItem type="check">Beverages (water, juice, soft drinks)</ListItem>
            <ListItem type="check">Dairy & edible oils</ListItem>
            <ListItem type="check">Processed food & confectionery</ListItem>
          </ul>

          <p className="font-semibold text-slate-900 mt-4">B-Tier (Additional):</p>
          <ul className="space-y-1">
            <ListItem type="arrow">Cosmetics & personal care</ListItem>
            <ListItem type="arrow">Household & industrial chemicals</ListItem>
            <ListItem type="arrow">Automotive fluids</ListItem>
            <ListItem type="arrow">Wine & spirits</ListItem>
            <ListItem type="arrow">Pharmaceutical</ListItem>
          </ul>
        </div>
      </ContentSection>

      <ContentSection title="Exclusions">
        <ul className="space-y-2">
          <ListItem type="cross">Label printers (competitors)</ListItem>
          <ListItem type="cross">Packaging brokers, agencies</ListItem>
          <ListItem type="cross">Pure resellers/distributors</ListItem>
          <ListItem type="cross">Services-only companies</ListItem>
          <ListItem type="cross">Pre-launch brands</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Evidence Requirements (Enrichment)">
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-slate-900 mb-1">Product Fit</p>
            <p className="text-sm text-slate-700">Website mentions bottles, cartons, sleeves, labels, packaging materials</p>
          </div>

          <div>
            <p className="font-semibold text-slate-900 mb-1">Materials Match</p>
            <p className="text-sm text-slate-700">OPP/BOPP, PP, PE, paper labels, duplex/triplex films</p>
          </div>

          <div>
            <p className="font-semibold text-slate-900 mb-1">Application Match</p>
            <p className="text-sm text-slate-700">Bottles, jars, cartons, pouches, tubes</p>
          </div>

          <div>
            <p className="font-semibold text-slate-900 mb-1">Repeat Demand</p>
            <p className="text-sm text-slate-700">Multiple SKUs, established product lines, retail distribution</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Contact Data Requirements">
        <ul className="space-y-2">
          <ListItem type="check">Valid work email (company domain)</ListItem>
          <ListItem type="check">LinkedIn profile (for persona verification)</ListItem>
          <ListItem type="check">Job title matching one of 6 buyer personas</ListItem>
          <ListItem type="check">Recent activity (LinkedIn updated within 12 months)</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Search Patterns (Clay Enrichment)">
        <div className="space-y-2">
          <p className="text-sm text-slate-700">Use Apollo, LinkedIn Sales Navigator, or website scraping enrichments:</p>
          <CodeBlock>
            Title contains: "Procurement" OR "Purchasing" OR "Packaging" OR "Supply Chain" OR "Operations" OR "Quality" OR "CEO" OR "Owner"
          </CodeBlock>
          <CodeBlock>
            Company description contains: "beverage" OR "dairy" OR "food" OR "confectionery" OR "FMCG" OR "consumer goods"
          </CodeBlock>
        </div>
      </ContentSection>

      <ContentSection title="Local Language Enrichment">
        <p className="text-sm text-slate-700">
          For Slovenia, Croatia: Check for "Vodja nabave", "Vodja proizvodnje"<br />
          For Germany, Austria: Check for "Einkaufsleiter", "Verpackungsmanager"<br />
          For Czech, Slovak: Check for "Vedouci nakupu", "Manazer obalu"
        </p>
      </ContentSection>

      <ContentSection title="Routing & Qualification">
        <ul className="space-y-2">
          <ListItem type="arrow">TIER 1 signals (RFQ, dated launch) → Priority sequence</ListItem>
          <ListItem type="arrow">TIER 2 signals (expansion, hiring) → Standard sequence</ListItem>
          <ListItem type="arrow">TIER 3 baseline (established brand) → Standard sequence</ListItem>
          <ListItem type="arrow">No signals → Lower priority or exclude</ListItem>
        </ul>
      </ContentSection>
    </>
  );
}

function PromptsTab() {
  return (
    <>
      <ContentSection title="AI Research Prompts" icon={<Code className="w-5 h-5" />}>
        <p className="text-sm text-slate-600 mb-4">
          Use these prompts with Claude or ChatGPT to research prospects and identify buying signals.
        </p>
      </ContentSection>

      <ContentSection title="1. Active Sourcing Event Detection">
        <CodeBlock>
          Search company website, LinkedIn, and recent news for evidence of active label/packaging sourcing:
          - RFQ or tender announcements
          - Supplier search or cost benchmarking mentions
          - Packaging redesign or material change projects
          - Supplier diversification initiatives

          Return: Yes/No + specific evidence quote + date if available
        </CodeBlock>
      </ContentSection>

      <ContentSection title="2. Product Launch & Packaging Redesign">
        <CodeBlock>
          Search company website, press releases, and social media for:
          - Dated product launch plans (Q3 2026, H2 2026, etc.)
          - Rebrand or packaging redesign announcements
          - New SKU introductions
          - Sustainability packaging initiatives

          Return: Launch date + product details + packaging scope
        </CodeBlock>
      </ContentSection>

      <ContentSection title="3. Production Line Expansion">
        <CodeBlock>
          Search for evidence of production capacity expansion:
          - New filling line or bottling equipment announced
          - Factory expansion or new facility construction
          - Co-packing or contract manufacturing announcements
          - Capital investment in production equipment

          Return: Expansion type + timeline + expected volume impact
        </CodeBlock>
      </ContentSection>

      <ContentSection title="4. Market & Channel Expansion">
        <CodeBlock>
          Search for market expansion signals:
          - New geography or export market entry
          - Retail channel expansion (entering major chains)
          - E-commerce launch or online sales growth
          - Distribution partnership announcements

          Return: Expansion details + timeline + packaging implications
        </CodeBlock>
      </ContentSection>

      <ContentSection title="5. Relevant Hiring Signals">
        <CodeBlock>
          Search LinkedIn company page and job boards for hiring:
          - Packaging Manager, Packaging Development roles
          - Supply Chain Manager, Operations Director
          - Production Manager, Plant Manager
          - Quality Manager, Technical Manager

          Return: Open roles + seniority + expected start date
        </CodeBlock>
      </ContentSection>

      <ContentSection title="6. Sustainability & Packaging Initiative">
        <CodeBlock>
          Search for sustainability-driven packaging changes:
          - Transition to recyclable or biodegradable materials
          - FSC certification pursuit or sustainable sourcing commitment
          - Plastic reduction or lightweighting initiatives
          - Circular economy or zero-waste goals

          Return: Initiative scope + materials involved + timeline
        </CodeBlock>
      </ContentSection>

      <ContentSection title="7. Product Portfolio & Repeat Demand Verification">
        <CodeBlock>
          Verify recurring label demand potential:
          - Count of active SKUs across product lines
          - Evidence of retail distribution (store locator, retailer logos)
          - Production scale indicators (annual volume, plant capacity)
          - Multi-format packaging (bottles, cartons, pouches)

          Return: SKU count + distribution reach + format diversity
        </CodeBlock>
      </ContentSection>

      <ContentSection title="8. Technical Fit & Label Format Verification">
        <CodeBlock>
          Verify label production fit:
          - Packaging formats: bottles, jars, cartons, pouches, tubes
          - Label materials mentioned: paper, OPP/BOPP, PP, PE, films
          - Print requirements: flexo, offset, digital capability needed
          - Finishing requirements: die-cutting, lamination, foil

          Return: Compatible formats + material match + production method fit
        </CodeBlock>
      </ContentSection>
    </>
  );
}

function CampaignsSequencesTab() {
  return (
    <>
      <SequencesTab clientId="birografika" />
      <div className="mt-8">
        <CampaignsTabGeneric />
      </div>
    </>
  );
}
