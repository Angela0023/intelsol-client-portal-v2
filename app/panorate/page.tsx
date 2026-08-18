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
import StatusBadge, {
  getClientStatus,
  setClientStatus,
  DEFAULT_STATUSES,
  type ClientStatus,
} from '../components/StatusBadge';
import { Target, Users, Filter, Code, TrendingUp, FileText, CheckSquare, BarChart3, Zap, FolderOpen, AlertCircle } from 'lucide-react';

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

const PANORATE_DEFAULT_TASKS = [
  { text: 'Build DACH manufacturer list in Apollo (machinery, equipment, automation systems)', completed: false },
  { text: 'Enrich with trade fair participation (Hannover Messe, EMO, K, Interpack, SPS)', completed: false },
  { text: 'Find Marketing Directors, Export Sales Managers, CEOs (50-200 employee companies)', completed: false },
  { text: 'Create email sequences by buyer role (Marketing, Sales, Product, CEO)', completed: false },
  { text: 'Launch first pilot campaign to Tier 1 trigger companies (trade fair exhibitors)', completed: false },
];

export default function PanoratePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>(DEFAULT_STATUSES.panorate);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('panorate', DEFAULT_STATUSES.panorate));

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

    // URL navigation with admin permission check
    const path = window.location.pathname;
    const tabFromPath = path.split('/').pop();
    const validTab = tabs.find((t) => t.id === tabFromPath);
    if (validTab && (userIsAdmin || !internalTabs.includes(validTab.id))) {
      setActiveTab(validTab.id);
    }

    // Browser back/forward support
    const handlePopState = () => {
      const path = window.location.pathname;
      const tabFromPath = path.split('/').pop();
      const validTab = tabs.find((t) => t.id === tabFromPath);
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
    setClientStatus('panorate', newStatus);
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    window.history.pushState({}, '', `/panorate/${tabId}`);
  };

  // Filter tabs based on admin access
  const visibleTabs = isAdmin
    ? tabs
    : tabs.filter((tab) => !['filters', 'prompts'].includes(tab.id));

  return (
    <ClientLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center space-x-2 lg:space-x-3 mb-2">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl lg:text-2xl font-bold text-slate-600">PM</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 lg:space-x-3 flex-wrap">
                <h1 className="text-xl lg:text-3xl font-bold text-slate-900">Panorate Media</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
              </div>
              <p className="text-sm lg:text-base text-slate-600 break-words">
                3D Visualization for Industrial Manufacturers
              </p>
            </div>
          </div>
          <a
            href="https://www.panorate.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-600 hover:underline inline-block"
          >
            Visit Website →
          </a>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-6 lg:mb-8 overflow-x-auto">
          <nav className="flex space-x-4 lg:space-x-8 min-w-max">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center space-x-2 pb-3 lg:pb-4 border-b-2 transition-colors whitespace-nowrap text-sm lg:text-base ${
                  activeTab === tab.id
                    ? 'border-slate-600 text-slate-900 font-medium'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <tab.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <ContentSection title="About Panorate Media">
              <p className="text-slate-700 mb-4">
                Panorate Media specializes in creating interactive 3D visualizations, virtual tours, and product
                configurators for complex industrial machinery and equipment. Their service helps manufacturers
                showcase high-value, configurable machinery to international buyers who cannot easily visit in
                person.
              </p>
              <p className="text-slate-700 mb-4">
                The core value proposition: turn the "you have to see it to believe it" sales obstacle into a
                competitive advantage by letting remote buyers explore the product, machine, or process
                interactively before committing.
              </p>
              <p className="text-slate-700">
                Key applications include 3D product configurators (for made-to-order machinery), interactive
                virtual tours (for production systems and facilities), and digital trade fair presentations (make
                the trade fair experience available 365 days a year).
              </p>
            </ContentSection>

            <ContentSection title="Target Market Summary">
              <div className="bg-slate-50 border-l-4 border-slate-600 p-4 rounded">
                <p className="font-semibold text-slate-900 mb-2">Core ICP Statement:</p>
                <p className="text-slate-800">
                  DACH-based (and selected EU) mid-market and larger manufacturers of complex, high-value,
                  configurable machinery, equipment or industrial systems - sold internationally and often
                  showcased at trade fairs or through distributors - where prospective buyers need to see the
                  product, machine or process to understand it and commit with confidence.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoCard
                  icon={<Target className="w-5 h-5 text-slate-600" />}
                  title="Priority Segments"
                  description="Machinery & Equipment, Configurable/Made-to-Order Products, Industrial Automation/Production Systems"
                />
                <InfoCard
                  icon={<Users className="w-5 h-5 text-slate-600" />}
                  title="Geography"
                  description="DACH (Germany, Austria, Switzerland) + selected EU markets"
                />
                <InfoCard
                  icon={<TrendingUp className="w-5 h-5 text-slate-600" />}
                  title="Company Size"
                  description="50-200 employees (DACH Mittelstand), but product fit matters more than headcount"
                />
              </div>
            </ContentSection>

            <ContentSection title="Active Markets">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="font-semibold text-green-900 mb-2">Primary Markets (DACH):</p>
                  <ul className="ml-4 space-y-1 text-sm text-green-800">
                    <ListItem>Germany (primary focus)</ListItem>
                    <ListItem>Austria</ListItem>
                    <ListItem>Switzerland</ListItem>
                  </ul>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="font-semibold text-blue-900 mb-2">Secondary Markets (Selected EU):</p>
                  <ul className="ml-4 space-y-1 text-sm text-blue-800">
                    <ListItem>Netherlands</ListItem>
                    <ListItem>Belgium</ListItem>
                    <ListItem>Italy</ListItem>
                    <ListItem>Poland</ListItem>
                  </ul>
                </div>
              </div>
            </ContentSection>
          </div>
        )}

        {activeTab === 'icp' && (
          <div className="space-y-6">
            <ContentSection title="Priority Sub-Segments (Tier 1)">
              <div className="space-y-4">
                <div className="bg-slate-50 border-l-4 border-slate-600 p-4 rounded">
                  <p className="font-semibold text-slate-900 mb-2">A. Machinery & Equipment</p>
                  <p className="text-sm text-slate-700 mb-2">
                    The core segment - matches the PALLMANN reference case directly. Examples:
                  </p>
                  <p className="text-sm text-slate-600">
                    Industrial, production, processing, packaging, woodworking, metalworking, CNC, printing,
                    recycling, material handling, industrial cleaning, agricultural, food processing,
                    pharmaceutical, and special-purpose machinery.
                  </p>
                </div>

                <div className="bg-slate-50 border-l-4 border-slate-600 p-4 rounded">
                  <p className="font-semibold text-slate-900 mb-2">B. Configurable / Made-to-Order Products</p>
                  <p className="text-sm text-slate-700 mb-2">
                    Buyer chooses configuration, dimensions, components or options rather than a single fixed
                    product - a 3D configurator is potentially even more compelling here than a standard virtual
                    tour. Examples:
                  </p>
                  <p className="text-sm text-slate-600">
                    Industrial systems, modular machinery, production equipment, custom installations, automation
                    systems, industrial enclosures, modular structures, specialized/configurable technical
                    products.
                  </p>
                </div>

                <div className="bg-slate-50 border-l-4 border-slate-600 p-4 rounded">
                  <p className="font-semibold text-slate-900 mb-2">
                    C. Industrial Automation / Production Systems
                  </p>
                  <p className="text-sm text-slate-700 mb-2">
                    The product is not one machine - it is an entire system, which is even harder to grasp from a
                    photo. 3D/interactive content can show machine → process → workflow → output. Examples:
                  </p>
                  <p className="text-sm text-slate-600">
                    Automated production lines, robotics, factory automation, conveyor systems, sorting systems,
                    assembly systems, complete production lines, integrated industrial solutions.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="font-semibold text-blue-900 mb-2">
                    Shared characteristic across A/B/C:
                  </p>
                  <p className="text-sm text-blue-800">
                    Complex physical product + high-value sale + difficult to explain visually + international
                    sales.
                  </p>
                </div>
              </div>
            </ContentSection>

            <ContentSection title="Tier 2 (Verify Fit) & Negative ICP">
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="font-semibold text-amber-900 mb-2">Tier 2 - Verify Fit:</p>
                  <p className="text-sm text-amber-800 mb-2">
                    Industrial components, technical equipment, specialized vehicles, industrial technology,
                    energy equipment, environmental/recycling technology, advanced manufacturing products.
                  </p>
                  <p className="text-sm text-amber-700">
                    Worth contacting, but confirm a 3D/interactive experience is genuinely relevant to their sales
                    process before prioritizing.
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="font-semibold text-red-900 mb-2">Negative ICP (Do Not Contact):</p>
                  <ul className="ml-4 space-y-1 text-sm text-red-800">
                    <ListItem>Generic/simple consumer products</ListItem>
                    <ListItem>Commodity products</ListItem>
                    <ListItem>Simple components easy to understand from photos alone</ListItem>
                    <ListItem>Local-only manufacturers with no international sales</ListItem>
                    <ListItem>Low-ticket products</ListItem>
                    <ListItem>
                      Products where visual presentation does not meaningfully affect the purchase decision
                    </ListItem>
                    <ListItem>Real estate (separate, later-phase segment)</ListItem>
                  </ul>
                </div>
              </div>
            </ContentSection>

            <ContentSection title="Company Profile: What Actually Matters">
              <p className="text-slate-700 mb-4 italic">
                Employee count is a secondary filter here, not the primary one - a complex, high-value,
                internationally-sold product matters far more than headcount.
              </p>

              <table className="w-full border-collapse mb-4">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50">Must have</td>
                    <td className="py-3 px-4 text-slate-700">
                      Complex product, international/export sales, a physical product or facility genuinely worth
                      visualizing, and visible marketing/sales investment.
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50">
                      Strong positive signals
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      Regular trade fair presence, expensive/high-ticket products, configurable products, new
                      product launches, international distributors, remote sales motion, large machines or complex
                      installations, multiple product variants, long sales cycle.
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50">
                      Company size (secondary)
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      DACH Mittelstand reference point: roughly 50-200 employees, often privately/family-owned -
                      but treat as a secondary filter, not a gate. Larger exporters are equally in scope if the
                      product fits.
                    </td>
                  </tr>
                </tbody>
              </table>
            </ContentSection>

            <ContentSection title="Buyer Roles">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-4 py-2 text-left">Role</th>
                    <th className="border border-slate-300 px-4 py-2 text-left">Title Examples</th>
                    <th className="border border-slate-300 px-4 py-2 text-left">What They Care About</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">Economic Buyer</td>
                    <td className="border border-slate-300 px-4 py-2">
                      Head of Marketing, Marketing Director, Managing Director
                    </td>
                    <td className="border border-slate-300 px-4 py-2">
                      Product presentation, trade fairs, lead generation, brand differentiation, marketing ROI,
                      international reach.
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">Sales Champion</td>
                    <td className="border border-slate-300 px-4 py-2">
                      Head of Sales, Export Sales Manager, International Sales Director
                    </td>
                    <td className="border border-slate-300 px-4 py-2">
                      "How do I show this to a remote buyer without them having to visit?" - a strong outbound
                      persona.
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">
                      Product / Marketing Champion
                    </td>
                    <td className="border border-slate-300 px-4 py-2">
                      Product Marketing Manager, Product Manager
                    </td>
                    <td className="border border-slate-300 px-4 py-2">
                      Understands best that the product is technically complex and hard to explain - feels the
                      problem firsthand.
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">CEO / Geschäftsführer</td>
                    <td className="border border-slate-300 px-4 py-2">
                      CEO, Managing Director, Geschäftsführer
                    </td>
                    <td className="border border-slate-300 px-4 py-2">
                      Especially at 50-200-employee, privately-owned or family-run (Mittelstand) manufacturers - an
                      important direct target in DACH.
                    </td>
                  </tr>
                </tbody>
              </table>
            </ContentSection>

            <ContentSection title="Buying Triggers">
              <p className="text-slate-700 mb-4 italic">
                Used to prioritize and sequence outreach, not as a hard scoring system.
              </p>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
                <p className="font-semibold text-red-900 mb-2">TIER 1 TRIGGERS (Highest Priority)</p>
                <ul className="ml-4 space-y-2 text-sm text-red-800">
                  <ListItem>
                    <strong>Regular trade fair participation:</strong> Exhibits at fairs like Hannover Messe, EMO,
                    K, Interpack, SPS, Automatica, Formnext, LIGNA, etc. - proof they already invest in showing
                    their equipment in person.
                  </ListItem>
                  <ListItem>
                    <strong>New machine/product launch:</strong> Needs fresh sales/visual content right when it
                    matters most.
                  </ListItem>
                  <ListItem>
                    <strong>Complex/configurable machinery:</strong> Structural fit - the harder the product is to
                    explain from photos, the stronger the case.
                  </ListItem>
                  <ListItem>
                    <strong>International/export sales:</strong> Remote buyers who cannot easily visit are exactly
                    who benefits from an interactive experience.
                  </ListItem>
                </ul>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded mb-4">
                <p className="font-semibold text-orange-900 mb-2">TIER 2 TRIGGERS (Medium Priority)</p>
                <ul className="ml-4 space-y-2 text-sm text-orange-800">
                  <ListItem>
                    <strong>New product catalogue:</strong> Fresh content cycle - a natural moment to add
                    interactive/3D material.
                  </ListItem>
                  <ListItem>
                    <strong>New market expansion:</strong> Entering new export markets increases the remote-sales
                    problem.
                  </ListItem>
                  <ListItem>
                    <strong>New production facility:</strong> New facility often needs new marketing/sales material
                    to match.
                  </ListItem>
                  <ListItem>
                    <strong>Website redesign:</strong> A broader marketing refresh is a natural moment to pitch new
                    content formats.
                  </ListItem>
                  <ListItem>
                    <strong>Heavy investment in photography/video:</strong> Already spending on visual content -
                    receptive to a stronger interactive format.
                  </ListItem>
                </ul>
              </div>

              <div className="bg-slate-50 border-l-4 border-slate-500 p-4 rounded">
                <p className="font-semibold text-slate-900 mb-2">TIER 3 TRIGGERS (Lower Priority / Gap Signals)</p>
                <ul className="ml-4 space-y-2 text-sm text-slate-700">
                  <ListItem>
                    <strong>Website has static images only:</strong> No interactive or 360° content yet - a clear
                    gap.
                  </ListItem>
                  <ListItem>
                    <strong>No 3D/product visualization:</strong> Same gap, framed generally.
                  </ListItem>
                  <ListItem>
                    <strong>Competitor already uses interactive visualization:</strong> A very strong, specific
                    personalization trigger for outreach copy (see Messaging Angles).
                  </ListItem>
                </ul>
              </div>
            </ContentSection>

            <ContentSection title="Messaging Angles">
              <p className="text-slate-700 mb-4 italic">
                Do not sell "3D visualization" - it is too generic. Sell the business outcome, ideally tied to the
                buyer role and trigger:
              </p>

              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-4 py-2 text-left">Target Audience</th>
                    <th className="border border-slate-300 px-4 py-2 text-left">Messaging Angle</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">To sales / export lead</td>
                    <td className="border border-slate-300 px-4 py-2">
                      "Help international buyers understand your machinery before they visit."
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">
                      To marketing / product lead
                    </td>
                    <td className="border border-slate-300 px-4 py-2">
                      "Turn complex machinery into an interactive sales experience."
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">To trade-fair exhibitors</td>
                    <td className="border border-slate-300 px-4 py-2">
                      "Make your trade-fair presentation available 365 days a year."
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">
                      Competitor-personalization angle
                    </td>
                    <td className="border border-slate-300 px-4 py-2">
                      "We noticed [competitor] is already letting prospects explore their equipment online..." - a
                      strong, specific opener when a Tier 3 competitor-visualization trigger is present.
                    </td>
                  </tr>
                </tbody>
              </table>
            </ContentSection>
          </div>
        )}

        {activeTab === 'filters' && (
          <div className="space-y-6">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-amber-900 mb-1">Internal Use Only</p>
                  <p className="text-sm text-amber-800">
                    This tab contains internal Apollo/LinkedIn Sales Navigator search criteria and Clay enrichment
                    strategies. Not visible to clients.
                  </p>
                </div>
              </div>
            </div>

            <ContentSection title="Firmographic Fit Filters">
              <p className="text-slate-700 mb-4">
                Build the list around the Priority Sub-Segments (A/B/C) and Company Profile must-have
                characteristics first - complex, high-value, internationally-sold product - since that matters more
                than headcount.
              </p>

              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-4 py-2 text-left">Filter Category</th>
                    <th className="border border-slate-300 px-4 py-2 text-left">Apollo / LinkedIn Criteria</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">Industry Keywords</td>
                    <td className="border border-slate-300 px-4 py-2">
                      "machinery manufacturer", "industrial equipment", "production systems", "automation systems",
                      "CNC", "packaging machinery", "food processing equipment", "material handling", "industrial
                      automation"
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">Geography</td>
                    <td className="border border-slate-300 px-4 py-2">
                      Germany, Austria, Switzerland (primary), Netherlands, Belgium, Italy, Poland (secondary)
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">Company Size</td>
                    <td className="border border-slate-300 px-4 py-2">
                      50-200 employees (Mittelstand sweet spot), but also include 200-500 if product fit is strong
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">Website Signals</td>
                    <td className="border border-slate-300 px-4 py-2">
                      Multiple language versions (international sales signal), trade fair calendar/booth info,
                      distributor network pages, complex product images
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">Technology Signals</td>
                    <td className="border border-slate-300 px-4 py-2">
                      WordPress, HubSpot, Salesforce (marketing investment signal), YouTube (product video
                      investment)
                    </td>
                  </tr>
                </tbody>
              </table>
            </ContentSection>

            <ContentSection title="Decision-Maker Contact Targeting">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-4 py-2 text-left">Role</th>
                    <th className="border border-slate-300 px-4 py-2 text-left">Job Titles to Search</th>
                    <th className="border border-slate-300 px-4 py-2 text-left">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">Marketing</td>
                    <td className="border border-slate-300 px-4 py-2">
                      Head of Marketing, Marketing Director, CMO, Product Marketing Manager
                    </td>
                    <td className="border border-slate-300 px-4 py-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">HIGH</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">Sales</td>
                    <td className="border border-slate-300 px-4 py-2">
                      Head of Sales, Export Sales Manager, International Sales Director, Sales Director
                    </td>
                    <td className="border border-slate-300 px-4 py-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">HIGH</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">Product</td>
                    <td className="border border-slate-300 px-4 py-2">
                      Product Manager, Product Marketing Manager, Product Director
                    </td>
                    <td className="border border-slate-300 px-4 py-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">MEDIUM</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">CEO / Owner</td>
                    <td className="border border-slate-300 px-4 py-2">
                      CEO, Managing Director, Geschäftsführer, Owner
                    </td>
                    <td className="border border-slate-300 px-4 py-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                        HIGH (50-200 emp)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </ContentSection>

            <ContentSection title="Prioritization Strategy in Clay">
              <p className="text-slate-700 mb-4">
                Companies matching a Tier 1 trigger (trade fair presence, new launch, international sales) are
                sequenced first; Tier 2 next; the rest of the fitting list is worked through in parallel rather than
                excluded.
              </p>

              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-4 py-2 text-left">Enrichment Field</th>
                    <th className="border border-slate-300 px-4 py-2 text-left">Data Source / Method</th>
                    <th className="border border-slate-300 px-4 py-2 text-left">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">Trade fair participation</td>
                    <td className="border border-slate-300 px-4 py-2">
                      Website scrape for "Hannover Messe", "EMO", "K", "Interpack", "SPS", "Automatica", "LIGNA"
                    </td>
                    <td className="border border-slate-300 px-4 py-2">Tier 1 trigger identification</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">New product launch</td>
                    <td className="border border-slate-300 px-4 py-2">
                      Website scrape for "new", "launch", "introduce" in press/news section (last 6 months)
                    </td>
                    <td className="border border-slate-300 px-4 py-2">Tier 1 trigger identification</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">International sales signal</td>
                    <td className="border border-slate-300 px-4 py-2">
                      Multi-language website (detect), distributor network page, export sales job postings
                    </td>
                    <td className="border border-slate-300 px-4 py-2">Tier 1 trigger / ICP fit validation</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">Website redesign signal</td>
                    <td className="border border-slate-300 px-4 py-2">BuiltWith domain age / redesign detection</td>
                    <td className="border border-slate-300 px-4 py-2">Tier 2 trigger identification</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">Interactive content gap</td>
                    <td className="border border-slate-300 px-4 py-2">
                      Website scrape for absence of "360", "3D", "virtual tour", "configurator"
                    </td>
                    <td className="border border-slate-300 px-4 py-2">Tier 3 trigger / gap identification</td>
                  </tr>
                </tbody>
              </table>
            </ContentSection>
          </div>
        )}

        {activeTab === 'prompts' && (
          <div className="space-y-6">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-amber-900 mb-1">Internal Use Only</p>
                  <p className="text-sm text-amber-800">
                    This tab contains AI prompts for enrichment in Clay (using Anthropic API). Not visible to
                    clients.
                  </p>
                </div>
              </div>
            </div>

            <ContentSection title="ICP Matching Prompt (for Anthropic)">
              <p className="text-slate-700 mb-4">
                Use this prompt in Clay to analyze company websites and determine ICP fit for the Industrial /
                Manufacturing segment.
              </p>

              <CodeBlock
                code={`You are analyzing a company's website to determine if they match Panorate Media's Ideal Customer Profile (ICP) for the Industrial / Manufacturing segment.

IDEAL CUSTOMER PROFILE:
- Industry: Manufacturers of complex, high-value, configurable machinery, equipment or industrial systems
- Priority segments:
  A. Machinery & Equipment (industrial, production, processing, packaging, CNC, etc.)
  B. Configurable/Made-to-Order Products (modular machinery, custom installations, automation systems)
  C. Industrial Automation/Production Systems (production lines, robotics, factory automation)
- Geography: DACH (Germany, Austria, Switzerland) + selected EU markets
- Size: 50-200 employees (Mittelstand), but product fit matters more than headcount
- Must have: Complex product, international/export sales, physical product worth visualizing

DISQUALIFIERS:
- Generic/simple consumer products
- Commodity products or simple components easy to understand from photos
- Local-only manufacturers with no international sales
- Low-ticket products
- Products where visual presentation does not affect purchase decision
- Real estate

ANALYZE THE WEBSITE FOR:
1. Product Complexity: Is this complex machinery/equipment/systems that are hard to explain from photos alone?
2. Sales Motion: Do they sell internationally or have export markets?
3. Trade Fair Presence: Any mentions of Hannover Messe, EMO, K, Interpack, SPS, Automatica, LIGNA, Formnext?
4. Product Configuration: Are products configurable/made-to-order or standard fixed models?
5. Visual Presentation: Would 3D/interactive visualization genuinely help their sales process?

OUTPUT FORMAT:
**ICP Match:** [Yes / No / Unsure]
**Reasoning:** [2-3 sentences explaining why, citing specific evidence from the website]
**Confidence:** [High / Medium / Low]
**Key Signals:**
- Product Complexity: [Complex machinery / Moderate / Simple]
- International Sales: [Clear evidence / Some signals / None visible]
- Trade Fair Presence: [Yes - list fairs / No / Unknown]
- Product Type: [Segment A/B/C match or other]
- Red Flags: [Any disqualifiers noted]`}
              />
            </ContentSection>

            <ContentSection title="Buying Trigger Detection Prompt">
              <p className="text-slate-700 mb-4">
                Use this prompt to analyze websites for buying triggers and prioritize outreach sequencing.
              </p>

              <CodeBlock
                code={`You are analyzing a company's website to identify buying triggers for Panorate Media's 3D visualization service.

BUYING TRIGGERS TO DETECT:

TIER 1 TRIGGERS (Highest Priority):
- Trade fair participation: Look for mentions of Hannover Messe, EMO, K, Interpack, SPS, Automatica, Formnext, LIGNA, or other major industrial fairs
- New machine/product launch: Recent press releases or news about new product introductions (last 6-12 months)
- International/export sales: Multi-language website, distributor network pages, international office locations, export sales mentions
- Complex/configurable machinery: Products with multiple variants, configuration options, made-to-order mentions

TIER 2 TRIGGERS (Medium Priority):
- New product catalogue: Recent catalogue launches or downloads
- New market expansion: Announcements about entering new geographic markets
- New production facility: New factory, facility expansion, or production line announcements
- Website redesign: Recently redesigned website (check copyright dates, modern design patterns)
- Heavy investment in photography/video: Professional product videos, 360-degree photos, extensive visual content

TIER 3 TRIGGERS (Gap Signals):
- Website has static images only: No interactive content, 360-degree views, or video
- No 3D/product visualization: Absence of any interactive product exploration
- Competitor using visualization: Knowledge that competitors in same space use 3D/interactive content

ANALYZE THE WEBSITE AND OUTPUT:
**Tier 1 Triggers Found:** [List all Tier 1 triggers detected, or "None"]
**Tier 2 Triggers Found:** [List all Tier 2 triggers detected, or "None"]
**Tier 3 Triggers Found:** [List all Tier 3 triggers detected, or "None"]
**Priority Score:** [High / Medium / Low] (based on number and tier of triggers found)
**Recommended Sequence:** [Which email sequence to use based on strongest trigger]
**Personalization Hook:** [Specific trigger detail to reference in outreach email, e.g., "Exhibiting at Hannover Messe 2026" or "Recently launched new CNC line"]`}
              />
            </ContentSection>
          </div>
        )}

        {activeTab === 'campaigns-sequences' && (
          <div className="space-y-8">
            <SequencesTab clientId="panorate" />
            <div className="mt-8">
              <CampaignsTabGeneric />
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <>
            <PerformanceTabDynamic clientId="panorate" />
            <CampaignsTabDynamic clientId="panorate" />
          </>
        )}

        {activeTab === 'documents' && <DocumentsTabGeneric clientId="panorate" />}

        {activeTab === 'tasks' && <TasksTab clientId="panorate" defaultTasks={PANORATE_DEFAULT_TASKS} />}
      </div>
    </ClientLayout>
  );
}
