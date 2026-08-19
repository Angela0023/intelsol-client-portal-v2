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
import { Target, Users, Filter, Code, TrendingUp, FileText, Layers, CheckSquare, BarChart3, Zap, Mail, FolderOpen, Cpu } from 'lucide-react';
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

const MBEDTRONIX_DEFAULT_TASKS = [
  {
    id: '1',
    title: 'Confirm references/case studies with Filip',
    description: 'Get Slovenian market-relevant case studies for messaging',
    status: 'pending',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Build Tier 1 lead list (active hiring signal)',
    description: 'Scrape MojeDelo, Optius, LinkedIn Jobs for embedded/firmware job postings',
    status: 'pending',
    priority: 'high',
  },
  {
    id: '3',
    title: 'Build Segment A lead list (manufacturers)',
    description: 'Filter Bizi.si/AJPES by SKD C26, C27, C28 + size/revenue criteria',
    status: 'pending',
    priority: 'medium',
  },
  {
    id: '4',
    title: 'Set up Smartlead campaigns',
    description: 'Create campaigns for Tier 1 + Segments A, B, C',
    status: 'pending',
    priority: 'medium',
  },
];

export default function MbedtronixPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('mbedtronix', DEFAULT_STATUSES.mbedtronix || 'Active'));

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
    setClientStatus('mbedtronix', newStatus);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const newPath = tabId === 'overview' ? '/mbedtronix' : `/mbedtronix/${tabId}`;
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
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Cpu className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-slate-900">MBEDTRONIX</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
              </div>
              <p className="text-slate-600">Nearshore Embedded & Electronics Development Partner</p>
            </div>
          </div>
          <a
            href="https://mbedtronix.com"
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
              <PerformanceTabDynamic clientId="mbedtronix" />
              <CampaignsTabDynamic clientId="mbedtronix" />
            </>
          )}
          {activeTab === 'documents' && (
            <DocumentsTabGeneric
              clientId="mbedtronix"
              clientName="MBEDTRONIX"
              totalLeads={0}
              totalCampaigns={0}
              accentColor="indigo"
            />
          )}
          {activeTab === 'tasks' && (
            <TasksTab clientId="mbedtronix" defaultTasks={MBEDTRONIX_DEFAULT_TASKS} />
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
            MBEDTRONIX campaign targets <strong>Slovenian manufacturers</strong>, <strong>hardware startups</strong>,
            and <strong>industrial automation companies</strong> that need embedded & electronics development capacity.
          </p>

          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
            <p className="font-semibold text-indigo-900 mb-2">Core Value Proposition:</p>
            <p className="text-indigo-800">
              Nearshore development partner (Serbia, ~4h from Slovenia) for electronics and embedded systems -
              HW + FW under one roof, without hiring, covering the full hardware development cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <InfoCard label="Services" value="PCB Design + Firmware Development" />
            <InfoCard label="Target Market" value="Slovenia" />
            <InfoCard label="Location" value="Krusevac, Serbia (~4h drive)" />
            <InfoCard label="Positioning" value="Nearshore Development Partner" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Four-Segment Strategy" icon={<Layers className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h4 className="font-semibold text-blue-900 mb-2">Segment A: Manufacturers with Own Product (PRIMARY)</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <ListItem>10-250 employees, EUR 1M-50M revenue</ListItem>
              <ListItem>Industries: C26 (electronic components), C27 (electrical equipment), C28 (machinery)</ListItem>
              <ListItem>Why they buy: In-house development overloaded or doesn't exist</ListItem>
              <ListItem>Priority: PRIMARY (high volume)</ListItem>
            </ul>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <h4 className="font-semibold text-green-900 mb-2">Segment B: Hardware & IoT Startups</h4>
            <ul className="text-green-800 text-sm space-y-1">
              <ListItem>2-30 employees, Seed to Series A stage</ListItem>
              <ListItem>Building connected products (sensors, wearables, smart devices)</ListItem>
              <ListItem>Why they buy: Can't afford full in-house hardware team</ListItem>
              <ListItem>Priority: SECONDARY</ListItem>
            </ul>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <h4 className="font-semibold text-amber-900 mb-2">Segment C: Industrial Automation & Integrators (PRIMARY)</h4>
            <ul className="text-amber-800 text-sm space-y-1">
              <ListItem>5-100 employees, project-based work</ListItem>
              <ListItem>Automation, machine vision, robotics, industrial IoT</ListItem>
              <ListItem>Why they buy: Overflow capacity - extra developers without hiring</ListItem>
              <ListItem>Priority: PRIMARY (high volume)</ListItem>
            </ul>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
            <h4 className="font-semibold text-purple-900 mb-2">Segment D: Medtech / Specialized Electronics (SECONDARY)</h4>
            <ul className="text-purple-800 text-sm space-y-1">
              <ListItem>10-100 employees, medical/lab devices</ListItem>
              <ListItem>Higher project value, longer sales cycles, regulatory requirements</ListItem>
              <ListItem>Approach: Smaller, more personalized outreach (not volume)</ListItem>
              <ListItem>Priority: SECONDARY (low volume, highly targeted)</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Buying Signals & Targeting Priority" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="space-y-3">
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
            <h4 className="font-semibold text-red-900 text-sm">TIER 1: Active Hiring (TARGET FIRST)</h4>
            <p className="text-red-800 text-sm">Open job postings for embedded/firmware/electronics engineers - strongest signal</p>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
            <h4 className="font-semibold text-orange-900 text-sm">TIER 2: Development Funding or Product Launch</h4>
            <p className="text-orange-800 text-sm">EU/national funding secured OR new product announcement</p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
            <h4 className="font-semibold text-yellow-900 text-sm">TIER 3: Trade Fairs or Growth/Expansion</h4>
            <p className="text-yellow-800 text-sm">Exhibiting at IFAM Ljubljana, MOS, embedded world OR growth news</p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function ICPAndPersonasTab() {
  return (
    <>
      <ContentSection title="Target Geography" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
            <h4 className="font-semibold text-indigo-900 mb-2">Primary Market: Slovenia</h4>
            <p className="text-indigo-800 mb-3">
              Focus exclusively on Slovenian companies building physical products with electronics.
            </p>
            <div className="bg-white/50 p-3 rounded">
              <p className="font-semibold text-indigo-900 mb-2 text-sm">EXCLUDE:</p>
              <ul className="text-indigo-800 text-sm space-y-1">
                <ListItem>Pure software companies (no hardware component)</ListItem>
                <ListItem>Electronics distributors/resellers with no in-house development</ListItem>
                <ListItem>Contract manufacturers (EMS) with no own products</ListItem>
                <ListItem>Corporations with large R&D departments (&gt;250 employees)</ListItem>
                <ListItem>Micro companies with no product and no funding</ListItem>
              </ul>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Segment A: Manufacturers (PRIMARY)" icon={<Layers className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <InfoCard label="Company Size" value="10-250 employees" />
            <InfoCard label="Revenue" value="EUR 1M-50M" />
            <InfoCard label="Industries (SKD)" value="C26, C27, C28" />
            <InfoCard label="Signal" value="Own product + dev team <10" />
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h4 className="font-semibold text-blue-900 mb-2">Typical Examples:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <ListItem>Measurement equipment manufacturers</ListItem>
              <ListItem>Electric motors & drives</ListItem>
              <ListItem>Heating/cooling technology</ListItem>
              <ListItem>Lighting equipment</ListItem>
              <ListItem>Agricultural & forestry equipment</ListItem>
              <ListItem>Cleaning equipment</ListItem>
            </ul>
          </div>

          <div className="bg-white border border-blue-200 p-3 rounded">
            <h4 className="font-semibold text-blue-900 mb-2 text-sm">Why They Buy:</h4>
            <p className="text-blue-800 text-sm">
              In-house development is overloaded or doesn't exist; MBEDTRONIX takes on the firmware/PCB part of the project.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Segment B: Hardware/IoT Startups (SECONDARY)" icon={<Cpu className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <InfoCard label="Company Size" value="2-30 employees" />
            <InfoCard label="Stage" value="Seed to Series A" />
            <InfoCard label="Funding" value="EU/SPS/SID backed" />
            <InfoCard label="Signal" value="Prototype/pre-series stage" />
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <h4 className="font-semibold text-green-900 mb-2">Product Types:</h4>
            <p className="text-green-800 text-sm">
              Connected products - sensors, wearables, smart devices, agritech, energy tech
            </p>
          </div>

          <div className="bg-white border border-green-200 p-3 rounded">
            <h4 className="font-semibold text-green-900 mb-2 text-sm">Why They Buy:</h4>
            <p className="text-green-800 text-sm">
              Can't afford a full in-house hardware team; need a fast path from concept to validated prototype.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Segment C: Industrial Automation (PRIMARY)" icon={<Cpu className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <InfoCard label="Company Size" value="5-100 employees" />
            <InfoCard label="Work Type" value="Project-based" />
            <InfoCard label="Solutions" value="Automation, vision, robotics, IIoT" />
            <InfoCard label="Signal" value="Custom industrial solutions" />
          </div>

          <div className="bg-white border border-amber-200 p-3 rounded">
            <h4 className="font-semibold text-amber-900 mb-2 text-sm">Why They Buy:</h4>
            <p className="text-amber-800 text-sm">
              Overflow capacity - larger projects need extra embedded developers without hiring.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Segment D: Medtech (SECONDARY)" icon={<FileText className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <InfoCard label="Company Size" value="10-100 employees" />
            <InfoCard label="Products" value="Medical/lab devices" />
            <InfoCard label="Approach" value="LOW VOLUME, personalized" />
            <InfoCard label="Sales Cycle" value="Longer (regulatory)" />
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
            <h4 className="font-semibold text-purple-900 mb-2">Important Notes:</h4>
            <ul className="text-purple-800 text-sm space-y-1">
              <ListItem>Higher project value but longer sales cycles</ListItem>
              <ListItem>Regulatory requirements (CE, MDR, EMC)</ListItem>
              <ListItem>Suited to smaller, more personalized outreach</ListItem>
              <ListItem>NOT suited to volume cold email</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Decision Maker Personas" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
            <h4 className="font-semibold text-indigo-900 mb-2">Primary: Technical Lead</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
              <InfoCard label="Titles" value="CTO, Technical Director, Head of R&D" />
              <InfoCard label="Decision Type" value="Deadlines, capacity, quality" />
            </div>
            <p className="text-indigo-800 text-sm mt-2">
              Main decision-maker - cares about project deadlines, development capacity, and code quality
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h4 className="font-semibold text-blue-900 mb-2">Primary: Director (companies &lt;30 employees)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
              <InfoCard label="Titles" value="Director, CEO" />
              <InfoCard label="Decision Type" value="Cost vs. hiring, time-to-market" />
            </div>
            <p className="text-blue-800 text-sm mt-2">
              Decision-maker / signatory in smaller companies - focuses on cost and speed to market
            </p>
          </div>

          <div className="bg-slate-50 border-l-4 border-slate-500 p-4 rounded">
            <h4 className="font-semibold text-slate-900 mb-2">Secondary: Product Lead</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
              <InfoCard label="Titles" value="Project Manager, Product Manager" />
              <InfoCard label="Role" value="Influencer (not decision-maker)" />
            </div>
            <p className="text-slate-800 text-sm mt-2">
              Influencer - cares about feasibility and product roadmap
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
      <ContentSection title="Segment A: Manufacturers - Clay Filters" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-700">
            Build lead list from Bizi.si / AJPES filtered by:
          </p>

          <CodeBlock language="json">
{`{
  "country": "Slovenia",
  "industries_skd": ["C26", "C27", "C28"],
  "skd_descriptions": [
    "C26: Manufacture of computer, electronic and optical products",
    "C27: Manufacture of electrical equipment",
    "C28: Manufacture of machinery and equipment n.e.c."
  ],
  "employees": {
    "min": 10,
    "max": 250
  },
  "revenue_eur": {
    "min": 1000000,
    "max": 50000000
  },
  "signals": {
    "own_product": true,
    "dev_team_size": "<=10 people"
  }
}`}
          </CodeBlock>
        </div>
      </ContentSection>

      <ContentSection title="Segment B: Hardware/IoT Startups - Sales Navigator" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-700">
            LinkedIn Sales Navigator filters for startup founders/CTOs:
          </p>

          <CodeBlock language="json">
{`{
  "location": "Slovenia",
  "company_size": ["2-10", "11-50"],
  "seniority": ["CXO", "VP", "Director"],
  "titles": [
    "CEO",
    "CTO",
    "Technical Director",
    "Founder",
    "Co-Founder"
  ],
  "industries": [
    "Computer Hardware",
    "Electronics",
    "Industrial Automation",
    "Internet of Things"
  ],
  "keywords": [
    "hardware",
    "IoT",
    "embedded",
    "sensors",
    "wearables",
    "smart devices",
    "prototype"
  ]
}`}
          </CodeBlock>
        </div>
      </ContentSection>

      <ContentSection title="Segment C: Industrial Automation - Sales Navigator" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-700">
            Target companies doing automation/integrator work:
          </p>

          <CodeBlock language="json">
{`{
  "location": "Slovenia",
  "company_size": ["5-10", "11-50", "51-200"],
  "titles": [
    "CTO",
    "Technical Director",
    "Head of Development",
    "Head of R&D",
    "Engineering Manager"
  ],
  "industries": [
    "Industrial Automation",
    "Robotics",
    "Electrical/Electronic Manufacturing"
  ],
  "keywords": [
    "automation",
    "machine vision",
    "robotics",
    "industrial IoT",
    "PLC",
    "SCADA",
    "industrial control"
  ]
}`}
          </CodeBlock>
        </div>
      </ContentSection>

      <ContentSection title="TIER 1 Signal: Active Hiring (HIGHEST PRIORITY)" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <h4 className="font-semibold text-red-900 mb-2">Job Board Scraping Strategy</h4>
            <p className="text-red-800 text-sm mb-3">
              Monitor these job boards weekly for embedded/firmware/electronics engineer postings:
            </p>
            <ul className="text-red-800 text-sm space-y-1">
              <ListItem>MojeDelo.com (Slovenia's largest job board)</ListItem>
              <ListItem>Optius.com (tech-focused job board)</ListItem>
              <ListItem>LinkedIn Jobs (Slovenia location filter)</ListItem>
              <ListItem>Company career pages (for Tier 2/3 companies)</ListItem>
            </ul>
          </div>

          <CodeBlock language="text">
{`Search keywords (Slovenian):
- "embedded engineer"
- "firmware developer"
- "embedded software"
- "electronics engineer"
- "PCB design engineer"
- "hardware engineer"

Priority: Send TIER 1 sequences to these companies FIRST
Expected volume: 10-30 companies/month
Conversion: HIGHEST (demonstrated need)`}
          </CodeBlock>
        </div>
      </ContentSection>
    </>
  );
}

function PromptsTab() {
  return (
    <>
      <ContentSection title="Lead Enrichment Prompt - Segment A (Manufacturers)" icon={<Code className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-700">
            Use this prompt to enrich manufacturer leads and identify product categories:
          </p>

          <CodeBlock language="text">
{`Visit the company website {{website}} and analyze their products.

Company: {{company_name}}
Location: Slovenia
Industry: {{industry}}

Extract:
1. **Product Category**: What type of electronic products do they manufacture? (e.g., measurement equipment, electric motors, lighting, industrial sensors, etc.)
2. **Development Team Size**: Any mention of R&D team, engineering team, or technical staff size?
3. **Recent Product Launches**: Any new products announced in the last 12 months?
4. **IoT/Smart Features**: Do they mention connectivity, IoT, smart features, or Industry 4.0?
5. **Hiring Signals**: Check careers page for any embedded/firmware/electronics engineer openings

Format response:
Product Category: [category]
Dev Team Size: [size if found, or "Unknown"]
Recent Launches: [yes/no + details]
IoT Features: [yes/no + details]
Active Hiring: [yes/no + job title if found]
Tier Assignment: [1, 2, or 3 based on signals]`}
          </CodeBlock>
        </div>
      </ContentSection>

      <ContentSection title="Lead Enrichment Prompt - Segment B (Startups)" icon={<Code className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-700">
            Use this prompt to qualify hardware startup leads:
          </p>

          <CodeBlock language="text">
{`Visit the company website {{website}} and LinkedIn company page.

Company: {{company_name}}
Location: Slovenia

Extract:
1. **Product Type**: What hardware product are they building? (sensors, wearables, smart device, agritech, etc.)
2. **Stage**: What stage are they at? (prototype, pre-series, production)
3. **Funding**: Any mention of funding rounds, investors, or EU grants (SPS, Horizon)?
4. **Team Size**: How many people are on the team?
5. **Technical Team**: Do they have in-house hardware engineers? If yes, how many?
6. **Disqualifiers**: Are they pure software (no hardware)? Consumer app only?

Format response:
Product Type: [type]
Stage: [stage]
Funding: [details or "Unknown"]
Team Size: [number]
Technical Team: [size or "No mention"]
Qualified: [YES/NO + reason if NO]
Tier Assignment: [2 or 3 based on signals]`}
          </CodeBlock>
        </div>
      </ContentSection>

      <ContentSection title="Personalization Prompt - All Segments" icon={<Code className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-700">
            Use this prompt to generate personalized email opening lines:
          </p>

          <CodeBlock language="text">
{`Generate a personalized opening line for this prospect:

Company: {{company_name}}
Product Category: {{product_category}}
Signal/Trigger: {{signal}}
Segment: {{segment}}

Instructions:
- Reference their specific product/industry
- If Tier 1 (active hiring): mention the job posting
- If product launch signal: congratulate on launch
- If funding signal: acknowledge the funding
- Keep it under 20 words
- Don't be overly enthusiastic
- Focus on relevance, not flattery

Examples:
"I saw {{company}} builds {{product_type}} - and if you're like most Slovenian manufacturers..."
"Congrats on the {{funding}} round - building {{product_type}} to production scale requires..."
"I noticed your {{job_title}} posting - while you're searching, do you have projects that need..."

Generate personalized line:`}
          </CodeBlock>
        </div>
      </ContentSection>

      <ContentSection title="TIER 1 Job Posting Analysis Prompt" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-slate-700">
            Use this prompt to extract key info from job postings:
          </p>

          <CodeBlock language="text">
{`Analyze this job posting and extract key information:

Job URL: {{job_url}}
Company: {{company_name}}

Extract:
1. **Exact Job Title**: [from posting]
2. **Key Technologies**: What embedded/firmware/hardware tech do they need? (e.g., ARM, STM32, C/C++, RTOS, PCB design, etc.)
3. **Project Type**: What are they building? (if mentioned)
4. **Urgency**: Any indication of timeline/urgency?
5. **Decision Maker**: Who should we reach out to? (based on company size)
6. **Posting Duration**: How long has this been posted? (if visible)

Format response:
Job Title: [exact title]
Technologies: [list]
Project Type: [type if found]
Urgency: [high/medium/low + reason]
Contact: [CTO/Technical Director/CEO based on size]
Posted: [duration if found]

Recommended sequence: TIER-1-ACTIVE-HIRING.md
Priority: HIGHEST`}
          </CodeBlock>
        </div>
      </ContentSection>
    </>
  );
}

function CampaignsSequencesTab() {
  return (
    <>
      <SequencesTab clientId="mbedtronix" />
      <div className="mt-8">
        <CampaignsTabGeneric />
      </div>
    </>
  );
}
