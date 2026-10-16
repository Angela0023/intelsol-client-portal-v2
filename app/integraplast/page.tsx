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

const INTEGRAPLAST_DEFAULT_TASKS = [
  {
    id: 'task-1',
    title: 'Initial campaign setup and list building',
    description: 'Set up targeting filters and build initial prospect list for Slovenia and Croatia',
    status: 'pending' as const,
    priority: 'high' as const,
  },
];

export default function IntegraplastPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [assignee, setAssignee] = useState<Assignee | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('integraplast', DEFAULT_STATUSES.integraplast));
    setAssignee(getStoredAssignee('integraplast', getClientAssignee('integraplast')));

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
    setClientStatus('integraplast', newStatus);
  };
  const handleAssigneeChange = (newAssignee: Assignee) => {
    setAssignee(newAssignee);
    setStoredAssignee('integraplast', newAssignee);
  };


  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const newPath = tabId === 'overview' ? '/integraplast' : `/integraplast/${tabId}`;
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
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-teal-600">I</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-slate-900">Integraplast</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
                {isAdmin && <AssigneeBadge assignee={assignee} onAssigneeChange={handleAssigneeChange} size="md" />}
              </div>
              <p className="text-slate-600">Injection Molding Equipment & Automation Solutions</p>
            </div>
          </div>
          <a
            href="https://integraplast.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-teal-600 hover:underline inline-block"
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
                    ? 'border-teal-500 text-teal-600 font-medium'
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
              <PerformanceTabDynamic clientId="integraplast" />
              <CampaignsTabDynamic clientId="integraplast" />
            </>
          )}
          {activeTab === 'documents' && <DocumentsTabGeneric clientId="integraplast" />}
          {activeTab === 'tasks' && <TasksTab clientId="integraplast" defaultTasks={INTEGRAPLAST_DEFAULT_TASKS} />}
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
            <strong>Integraplast</strong> supplies and services injection-moulding equipment, automation and process solutions for plastics manufacturers in Slovenia and Croatia. The offer combines TEDERIC machines with local and regional technical and after-sales support, enabling equipment and production cells to be configured around the customer's application.
          </p>

          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded">
            <p className="font-semibold text-teal-900 mb-2">Target Customers:</p>
            <p className="text-teal-800">
              Manufacturers in Slovenia and Croatia that operate plastic injection-moulding production or have a concrete plan to introduce or expand it. Contract injection moulders and technical plastics manufacturers are the primary focus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Primary Geography" value="Slovenia and Croatia" />
            <InfoCard label="Company Size" value="10-500 employees" />
            <InfoCard label="Sweet Spot" value="20-250 employees" />
            <InfoCard label="Primary Segment" value="Contract Injection Moulders" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Product & Service Portfolio" icon={<Layers className="w-5 h-5" />}>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Machine Portfolio:</h4>
            <ul className="space-y-2">
              <ListItem type="check">TEDERIC NEO T servo-hydraulic toggle machines</ListItem>
              <ListItem type="check">NEO H and HII two-platen machines</ListItem>
              <ListItem type="check">NEO E and EII electric machines with configuration-dependent hydraulic functions</ListItem>
              <ListItem type="check">NEO M multi-component systems (Ms and Mv variants)</ListItem>
              <ListItem type="check">TAYU vertical injection-moulding equipment</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Process Technologies:</h4>
            <ul className="space-y-2">
              <ListItem>MultiMold, SpinSure, Addshot-E - Multi-component configurations</ListItem>
              <ListItem>LabelSure - In-mould labelling</ListItem>
              <ListItem>CoinSure - Injection-compression moulding</ListItem>
              <ListItem>CellSure - Microcellular foaming</ListItem>
              <ListItem>GlosSure - High-gloss applications</ListItem>
              <ListItem>BlowSure - Injection-blow moulding</ListItem>
              <ListItem>X-Shot - Large-shot technology</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Complete Production Solution:</h4>
            <ul className="space-y-2">
              <ListItem>Linear and six-axis robots</ListItem>
              <ListItem>Cooling and mould-temperature control</ListItem>
              <ListItem>Drying and dehumidification</ListItem>
              <ListItem>Material feeding and conveying</ListItem>
              <ListItem>Grinding and shredding</ListItem>
              <ListItem>Gravimetric dosing and mixing</ListItem>
              <ListItem>Central drying systems</ListItem>
              <ListItem>SIGMASOFT simulation and STASA QC process optimization</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Value Proposition" icon={<Target className="w-5 h-5" />}>
        <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded">
          <p className="text-slate-800 font-medium mb-3">
            Modern injection-moulding technology with local and regional technical support, configured around the application and the complete production cell.
          </p>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Key Positioning Angles</h4>
            <ul className="space-y-2">
              <ListItem type="check"><strong>Modernization and Energy:</strong> Replace older hydraulic machines with potential for 30-80% lower energy consumption (NEO T product claim)</ListItem>
              <ListItem type="check"><strong>Capacity and New Projects:</strong> Add capacity efficiently or support upcoming products/contracts with required tonnage, shot size and process capability</ListItem>
              <ListItem type="check"><strong>Precision and Automation:</strong> Improve repeatability with robot handling, material preparation, temperature control and process optimization</ListItem>
              <ListItem type="check"><strong>Service and Implementation:</strong> Local Slovenian office, warehouse and service presence with regional technical support</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Preferred Call to Action</h4>
            <p className="text-slate-700">
              "Would a short technical discussion be useful to review your current injection-moulding setup, planned capacity investments or an upcoming project?"
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Communication Tone</h4>
            <p className="text-slate-700">
              Technical, consultative and credible. Lead with the production requirement and a relevant question. Use clear application language and realistic benefits, without aggressive selling or unsupported performance claims.
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
            <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded">
              <p className="font-semibold text-teal-900 mb-2">Slovenia and Croatia ONLY</p>
              <p className="text-teal-800">
                The relevant injection-moulding plant or planned production investment must be in one of these two countries. Both markets are in scope; application fit and investment timing determine priority.
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Target Company Size:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard label="Size Range" value="10-500 employees" color="bg-teal-50 text-teal-700" />
              <InfoCard label="Sweet Spot" value="20-250 employees" color="bg-green-50 text-green-700" />
            </div>
            <p className="text-sm text-slate-600 mt-3">
              Revenue is not a hard filter; production scale, technical requirements and investment readiness matter more.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Priority Industry Segments:</h4>
            <div className="space-y-3">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p className="font-semibold text-blue-900 text-sm mb-1">Segment A - Contract Injection Moulders & Technical Plastics (PRIORITY 1)</p>
                <p className="text-blue-800 text-sm">Companies producing moulded components for external customers, with an established machine fleet or a defined expansion project.</p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                <p className="font-semibold text-green-900 text-sm mb-1">Segment B - Automotive Tier 1 & Tier 2 Suppliers</p>
                <p className="text-green-800 text-sm">Manufacturers that mould automotive plastic components internally (interior parts, housings, connectors, lighting, electrical or EV-related components).</p>
              </div>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
                <p className="font-semibold text-purple-900 text-sm mb-1">Segment C - Plastic Packaging Manufacturers</p>
                <p className="text-purple-800 text-sm">Injection-moulded containers, buckets, tubs, caps and closures, thin-wall packaging and IML packaging. Focus on additional capacity, repeatability, fast cycles.</p>
              </div>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded">
                <p className="font-semibold text-amber-900 text-sm mb-1">Segment D - Household & Consumer Products</p>
                <p className="text-amber-800 text-sm">Manufacturers with in-house injection moulding: storage products, bins, kitchen and garden products, furniture components.</p>
              </div>
              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-3 rounded">
                <p className="font-semibold text-indigo-900 text-sm mb-1">Segment E - Medical/Electronics/Precision Plastics</p>
                <p className="text-indigo-800 text-sm">Secondary, potentially high-value manufacturers in medical, electronics, electrical, construction, and precision or technical plastics. Fit depends on internal moulding or concrete plan to establish it.</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Business Models:</h4>
            <ul className="space-y-2">
              <ListItem type="check">Contract moulding operations</ListItem>
              <ListItem type="check">OEM or own-brand manufacturing with internal moulding</ListItem>
              <ListItem type="check">Integrated tooling-plus-moulding businesses</ListItem>
              <ListItem type="check">Both established production and concrete new injection-moulding investment</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Exclusion Criteria:</h4>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="font-semibold text-red-900 mb-2">DO NOT CONTACT:</p>
              <ul className="text-red-800 text-sm space-y-1">
                <ListItem type="cross">Companies that only buy plastic parts (no internal moulding)</ListItem>
                <ListItem type="cross">Pure plastics distributors or resellers</ListItem>
                <ListItem type="cross">Tooling-only businesses without moulding production</ListItem>
                <ListItem type="cross">Very small hobby or micro operations</ListItem>
                <ListItem type="cross">Extrusion-only or blow-moulding-only manufacturers (unless they also injection mould)</ListItem>
                <ListItem type="cross">Recycling-only companies</ListItem>
                <ListItem type="cross">Businesses with neither evidence nor realistic plan for injection moulding</ListItem>
              </ul>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Buying Signals & Triggers" icon={<TrendingUp className="w-5 h-5" />}>
        <p className="text-slate-600 mb-4">
          Investment signals prioritized by urgency and clarity of need. Tier 1 indicates clearest investment context; Tier 2 suggests developing need; Tier 3 establishes structural fit rather than purchase timing.
        </p>

        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-1">TIER 1: Defined Capacity or Equipment Investment</h4>
            <p className="text-slate-700 text-sm">New moulding line, planned machine purchase or replacement, or a new facility with confirmed injection-moulding capacity.</p>
          </div>

          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 mb-1">TIER 1: Committed Project or Capacity Need</h4>
            <p className="text-slate-700 text-sm">New automotive, FMCG or industrial contract; constrained moulding capacity; or new product requiring different tonnage, process or multi-component capability.</p>
          </div>

          <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
            <h4 className="font-semibold text-green-900 mb-1">TIER 2: Automation or Energy-Efficiency Initiative</h4>
            <p className="text-slate-700 text-sm">Planned cell-automation project, hydraulic-machine modernization or energy-reduction initiative tied to moulding.</p>
          </div>

          <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
            <h4 className="font-semibold text-green-900 mb-1">TIER 2: Specialist Hiring or Expansion</h4>
            <p className="text-slate-700 text-sm">Moulding, process, plastics or tooling roles; broader plant expansion where equipment requirement not yet explicit.</p>
          </div>

          <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-500">
            <h4 className="font-semibold text-amber-900 mb-1">TIER 3: Established Injection-Moulding Operation</h4>
            <p className="text-slate-700 text-sm">Confirmed machines or moulding production, including named machine brands, but no current investment trigger.</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Buyer Personas & Decision-Makers" icon={<Users className="w-5 h-5" />}>
        <p className="text-slate-600 mb-4">
          In smaller companies, the owner or managing director often combines investment authority with technical involvement. In larger plants, production and engineering typically define requirements, with procurement managing commercial steps and senior management approving capital expenditure.
        </p>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-blue-900">PRIMARY: Business Leadership</h3>
              <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs font-semibold rounded">PRIMARY</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <p><strong>Typical Titles:</strong> Owner, CEO, Managing Director</p>
              <p><strong>Role in Decision:</strong> Economic buyer in smaller firms; investment approval and business case ownership</p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-green-900">PRIMARY: Production & Technical Leadership</h3>
              <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-semibold rounded">PRIMARY</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <p><strong>Typical Titles:</strong> Production Director, Plant Manager, Technical Director, Head of Production</p>
              <p><strong>Role in Decision:</strong> Capacity, production performance, equipment strategy and project sponsorship</p>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-purple-900">PRIMARY CHAMPION: Engineering & Process</h3>
              <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs font-semibold rounded">CHAMPION</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <p><strong>Typical Titles:</strong> Engineering Manager, Process Manager, Manufacturing Manager</p>
              <p><strong>Role in Decision:</strong> Application definition, mould and machine compatibility, process validation and technical evaluation</p>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-amber-900">SECONDARY: Procurement & Purchasing</h3>
              <span className="px-2 py-1 bg-amber-200 text-amber-800 text-xs font-semibold rounded">SECONDARY</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <p><strong>Typical Titles:</strong> Procurement Manager, Purchasing Manager, Head of Purchasing</p>
              <p><strong>Role in Decision:</strong> Supplier qualification, pricing, commercial terms and purchase coordination</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-slate-900">INFLUENCER: Maintenance & Automation</h3>
              <span className="px-2 py-1 bg-slate-200 text-slate-800 text-xs font-semibold rounded">INFLUENCER</span>
            </div>
            <div className="space-y-2 text-slate-700">
              <p><strong>Typical Titles:</strong> Maintenance Manager, Automation Manager, Automation Engineer</p>
              <p><strong>Role in Decision:</strong> Maintainability, service needs, cell integration, reliability and operational acceptance</p>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-2">Buying Group Variation</h4>
          <ul className="list-disc list-inside space-y-1 text-slate-700 text-sm">
            <li>Automotive and precision applications usually require close engineering and quality involvement</li>
            <li>Packaging projects often emphasize cycle time, output and automation</li>
            <li>Maintenance and automation teams are relevant whenever serviceability, robots, auxiliaries or cell integration form part of the investment</li>
          </ul>
        </div>
      </ContentSection>

      <ContentSection title="Technology & Market Signals">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Strongest Fit Indicators:</h4>
            <p className="text-slate-700 mb-2">
              Explicit evidence that a company owns or operates injection-moulding machines. A machine list, production description or clearly identified moulding department is stronger than a generic reference to plastic products.
            </p>
            <ul className="space-y-2">
              <ListItem type="check">Relevant terminology: injection moulding, injection molding, brizganje plastike, brizganje termoplastov, brizganje, injekcijsko presanje, Kunststoffspritzguss, Spritzguss</ListItem>
              <ListItem type="check">Existing machine brands: Engel, Arburg, KraussMaffei, Haitian, Wittmann Battenfeld, Fanuc, Sumitomo/SHI Demag</ListItem>
              <ListItem type="check">Hiring: Injection Moulding Technicians, Process Engineers, Plastics Engineers, Tooling Engineers</ListItem>
              <ListItem type="check">Automation projects and energy-efficiency initiatives linked to moulding</ListItem>
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
      <ContentSection title="Data Enrichment Filters" icon={<Filter className="w-5 h-5" />}>
        <p className="text-slate-600 mb-4">
          Clay filters and data enrichment criteria for identifying injection moulding equipment buyers in Slovenia and Croatia.
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Firmographic Filters:</h4>
            <ul className="space-y-2">
              <ListItem><strong>Geography:</strong> Slovenia and Croatia ONLY</ListItem>
              <ListItem><strong>Company Size:</strong> 10-500 employees (sweet spot 20-250)</ListItem>
              <ListItem><strong>Primary Segment A:</strong> Contract injection moulders and technical plastics manufacturers</ListItem>
              <ListItem><strong>Segment B:</strong> Automotive Tier 1 and Tier 2 suppliers with internal moulding</ListItem>
              <ListItem><strong>Segment C:</strong> Plastic packaging manufacturers (containers, caps, closures, thin-wall)</ListItem>
              <ListItem><strong>Segment D:</strong> Household and consumer products with in-house injection moulding</ListItem>
              <ListItem><strong>Segment E:</strong> Medical, electronics, electrical, construction, precision plastics</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Technology & Equipment Signals:</h4>
            <ul className="space-y-2">
              <ListItem><strong>Keywords (English):</strong> injection moulding, injection molding, plastic injection, moulding machines</ListItem>
              <ListItem><strong>Keywords (Slovenian/Croatian):</strong> brizganje plastike, brizganje termoplastov, injekcijsko presanje</ListItem>
              <ListItem><strong>Keywords (German):</strong> Kunststoffspritzguss, Spritzguss</ListItem>
              <ListItem><strong>Machine Brands:</strong> Engel, Arburg, KraussMaffei, Haitian, Wittmann Battenfeld, Fanuc, Sumitomo, SHI Demag</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Exclusion Filters:</h4>
            <ul className="space-y-2">
              <ListItem type="cross">Companies that only buy plastic parts (no internal moulding)</ListItem>
              <ListItem type="cross">Pure plastics distributors or resellers</ListItem>
              <ListItem type="cross">Tooling-only businesses without moulding</ListItem>
              <ListItem type="cross">Very small operations without equipment investment capacity</ListItem>
              <ListItem type="cross">Extrusion-only or blow-moulding-only (unless they also injection mould)</ListItem>
              <ListItem type="cross">Recycling-only companies</ListItem>
              <ListItem type="cross">Named competitors (when list provided)</ListItem>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Contact Data Requirements:</h4>
            <ul className="space-y-2">
              <ListItem><strong>Primary Titles:</strong> Owner, CEO, Managing Director, Production Director, Plant Manager, Technical Director, Engineering Manager, Process Manager</ListItem>
              <ListItem><strong>Secondary Titles:</strong> Procurement Manager, Purchasing Manager, Maintenance Manager, Automation Manager</ListItem>
              <ListItem><strong>Email Required:</strong> Yes (business email preferred)</ListItem>
              <ListItem><strong>LinkedIn:</strong> Helpful for verification and current employment evidence</ListItem>
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
          AI prompts for identifying buying signals and qualifying injection moulding fit. These are research rules to focus outreach sequencing.
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Tier 1: Defined Equipment Investment</h4>
            <CodeBlock code="Search for evidence of a planned injection moulding machine purchase, capacity expansion, or new production line at this company. Look for: press releases about new equipment, capacity expansion announcements, new facility projects mentioning moulding, tenders or RFQs for injection moulding machines. Return YES with exact scope, timeline and source if found. Return NO if not found or already completed." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Tier 1: Committed Project or Contract</h4>
            <CodeBlock code="Look for new manufacturing contracts, automotive programmes, or product launches that would require injection moulding capacity at this company. Check: automotive supplier awards, new customer announcements, product launch dates, capacity shortage mentions. Return YES with project details and timeline if found. Assess if this creates equipment investment need. Return NO if none found or moulding relevance unclear." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Tier 2: Automation or Energy Initiative</h4>
            <CodeBlock code="Search for automation projects, energy efficiency programmes, or Industry 4.0 initiatives at this company. Look for: automation investment announcements, energy reduction goals, smart manufacturing projects, government funding for modernization. Check if these are tied to injection moulding operations specifically. Return YES with initiative scope and dates if found. Return NO if no initiative or unclear moulding connection." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Tier 2: Specialist Hiring</h4>
            <CodeBlock code="Search for active job postings related to injection moulding, plastics processing, or production engineering. Look for: Injection Moulding Technician, Process Engineer, Plastics Engineer, Tooling Engineer, Production Manager roles. Check LinkedIn, company careers page, job boards. Return YES with role title and posting date if found. Return NO if no relevant openings." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Tier 3: Established Moulding Operation (Structural Fit)</h4>
            <CodeBlock code="Analyze this company's website and production information to confirm they operate injection moulding equipment internally. Look for: machine park descriptions, production process details, mentions of specific machine brands (Engel, Arburg, KraussMaffei, etc.), photos of moulding equipment, technical capabilities mentioning tonnage or shot size. Return YES with evidence of owned equipment if found. This indicates structural fit, not urgency. Return NO if only buying parts or no evidence of internal moulding." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Equipment Ownership Verification</h4>
            <CodeBlock code="Determine if this company owns and operates injection moulding machines or only purchases moulded parts. Check: business model (manufacturer vs distributor), production descriptions, equipment lists, technical capabilities. Look for evidence of: own machine park, in-house moulding department, technical staff for moulding operations. Return OWNS EQUIPMENT with details if they have internal moulding. Return BUYS PARTS ONLY if they are a distributor/buyer. Return UNCLEAR if insufficient information." />
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Competitor Technology Check (Exclusion)</h4>
            <CodeBlock code="Check if this company is a direct injection moulding equipment supplier or competitor to Integraplast. Look for: business model (do they sell machines or auxiliary equipment), product lines (machine brands they represent), service offerings (equipment sales vs using equipment). Return YES if they are a supplier/competitor with company type. Return NO if they are a manufacturer/buyer who uses moulding equipment (not sells it)." />
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function CampaignsSequencesTab() {
  return (
    <>
      <SequencesTab clientId="integraplast" />
      <div className="mt-8">
        <CampaignsTabGeneric />
      </div>
    </>
  );
}
