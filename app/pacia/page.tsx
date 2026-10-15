'use client';

import { useState, useEffect } from 'react';
import { Building2, Users, Filter, MessageSquare, Send, TrendingUp, FileText, CheckSquare, Mail } from 'lucide-react';
import { ContentSection } from '../components/ContentSection';
import SequencesTab from '../components/SequencesTab';
import CampaignsTabGeneric from '../components/CampaignsTabGeneric';
import PerformanceTabDynamic from '../components/PerformanceTabDynamic';
import CampaignsTabDynamic from '../components/CampaignsTabDynamic';
import DocumentsTabGeneric from '../components/DocumentsTabGeneric';
import TasksTab from '../components/TasksTab';
import StatusBadge, { getClientStatus, setClientStatus, type ClientStatus, DEFAULT_STATUSES } from '../components/StatusBadge';
import { getClientAssignee, type Assignee } from '../../lib/auth';
import AssigneeBadge, { getStoredAssignee, setStoredAssignee } from '../components/AssigneeBadge';

type TabId = 'overview' | 'icp' | 'filters' | 'prompts' | 'campaigns-sequences' | 'performance' | 'documents' | 'tasks';

export default function PACIADashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [status, setStatus] = useState(DEFAULT_STATUSES.pacia);
  const [assignee, setAssignee] = useState<string>(getClientAssignee('pacia'));
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('pacia', DEFAULT_STATUSES.pacia));
    setAssignee(getStoredAssignee('pacia', getClientAssignee('pacia')));

    // Check if user is admin
    const access = sessionStorage.getItem('clientAccess');
    if (access) {
      try {
        const accessList = JSON.parse(access);
        setIsAdmin(accessList.includes('admin'));
      } catch (e) {
        console.error('Failed to parse clientAccess:', e);
      }
    }
  }, []);

  const handleStatusChange = (newStatus: ClientStatus) => {
    setStatus(newStatus);
    setClientStatus('pacia', newStatus);
  };

  const handleAssigneeChange = (newAssignee: Assignee) => {
    setAssignee(newAssignee);
    setStoredAssignee('pacia', newAssignee);
  };

  const tabs = [
    { id: 'overview' as TabId, label: 'Overview', icon: Building2 },
    { id: 'icp' as TabId, label: 'ICP Profile', icon: Users },
    { id: 'filters' as TabId, label: 'Clay Filters', icon: Filter },
    { id: 'prompts' as TabId, label: 'AI Prompts', icon: MessageSquare },
    { id: 'campaigns-sequences' as TabId, label: 'Campaigns & Sequences', icon: Send },
    { id: 'performance' as TabId, label: 'Performance', icon: TrendingUp },
    { id: 'documents' as TabId, label: 'Documents', icon: FileText },
    { id: 'tasks' as TabId, label: 'Tasks', icon: CheckSquare },
  ];

  // Filter tabs based on admin access
  const internalTabs = ['filters', 'prompts'];
  const visibleTabs = isAdmin
    ? tabs
    : tabs.filter(tab => !internalTabs.includes(tab.id));

  function OverviewTab() {
    return (
      <ContentSection title="Client Overview" icon={<Building2 size={20} />}>
        <div className="space-y-4 text-sm lg:text-base">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">About PACIA</h4>
            <p className="text-slate-700">
              PACIA designs bespoke AI customer support agents using a company's own knowledge, with multilingual support across web, email and social channels. Implementation includes knowledge preparation, brand adaptation, testing and deployment, with approximately 4-week delivery timeline.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Offer</h4>
            <p className="text-slate-700">
              Tailored AI customer support implementation for Slovenian businesses with 20-250 employees. Focus on reducing repetitive support work by handling recurring customer enquiries with approved company information.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Target Market</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li><strong>Geography:</strong> Slovenia (primary); UK and US expansion only after local validation</li>
              <li><strong>Company Size:</strong> 20-250 employees (priority band: 30-150 employees)</li>
              <li><strong>Primary Segments:</strong> E-commerce & Retail (60%), Tourism & Hospitality (40%)</li>
              <li><strong>Second-Wave Segments:</strong> Logistics, Service Businesses, Subscription Businesses</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Value Proposition</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>Help support teams spend less time on recurring questions</li>
              <li>Make routine information easier for customers to access</li>
              <li>Improve support capacity, coverage and consistency</li>
              <li>Start with one clearly defined category of customer questions</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Campaign Direction</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li><strong>First Campaign:</strong> E-commerce and retail (60% of initial accounts)</li>
              <li><strong>Second Campaign:</strong> Tourism and hospitality (40% of initial accounts)</li>
              <li><strong>Initial Sample:</strong> 100 unique companies (60 e-commerce/retail, 40 tourism/hospitality)</li>
              <li><strong>Primary CTA:</strong> Qualified discovery conversation</li>
              <li><strong>Language:</strong> Slovenian for outreach; English for internal documentation</li>
            </ul>
          </div>

          <div className="pt-2">
            <h4 className="font-semibold text-slate-900 mb-2">Key Contacts</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li><strong>PACIA Business Contact:</strong> David Šeruga (david@pacia-support.com)</li>
              <li><strong>INTELSOL Account Lead:</strong> Matej Gostiša</li>
            </ul>
          </div>
        </div>
      </ContentSection>
    );
  }

  function ICPAndPersonasTab() {
    return (
      <div className="space-y-6">
        <ContentSection title="Ideal Customer Profile" icon={<Users size={20} />}>
          <div className="space-y-4 text-sm lg:text-base">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Best Fit Account</h4>
              <p className="text-slate-700 mb-3">
                Established Slovenian business with recurring customer enquiries, a clear owner of the support process and usable company information. Needs to improve support capacity, coverage or consistency and is willing to start with a defined scope.
              </p>

              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <h5 className="font-semibold text-indigo-900 mb-2">Operational Fit Criteria:</h5>
                <ul className="list-disc list-inside space-y-1 text-indigo-800 text-sm">
                  <li><strong>Customer Interaction:</strong> Active support or guest enquiry function visible</li>
                  <li><strong>Repeatability:</strong> Common questions answerable from stable, approved information</li>
                  <li><strong>Business Pressure:</strong> Growth, seasonal peaks, workload, response gaps or new languages create reason to act</li>
                  <li><strong>Knowledge Readiness:</strong> Policies, FAQs, product/service information exist with owner willing to review</li>
                  <li><strong>Buying Readiness:</strong> Relevant manager open to discovery and can involve sponsor/budget holder</li>
                  <li><strong>Technical Scope:</strong> Useful first release feasible without unsupported integrations</li>
                  <li><strong>Economic Fit:</strong> Prospect can describe operational value justifying scoped paid project</li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Target Company Profile</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li><strong>Geography:</strong> Slovenia (primary market)</li>
                <li><strong>Company Size:</strong> 20-250 employees</li>
                <li><strong>Priority Band:</strong> 30-150 employees</li>
                <li><strong>Support Function:</strong> Active customer support or guest enquiry function</li>
                <li><strong>Knowledge Base:</strong> Existing policies, FAQs, product/service information</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Priority Industries</h4>

              <div className="space-y-3">
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <h5 className="font-semibold text-green-900">TIER 1: E-commerce & Retail (60% allocation)</h5>
                  <p className="text-green-800 text-sm mt-1">
                    Slovenian online retailers, consumer brands and established retailers with active online sales channel. Focus on recurring delivery, returns, product and payment-policy enquiries.
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <h5 className="font-semibold text-blue-900">TIER 2: Tourism & Hospitality (40% allocation)</h5>
                  <p className="text-blue-800 text-sm mt-1">
                    Hotel groups, larger accommodation operators, tour operators and travel businesses with visible guest enquiry activity. Focus on recurring booking information, guest policies, languages and enquiry coverage around peak periods.
                  </p>
                </div>

                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <h5 className="font-semibold text-amber-900">TIER 3: Second-Wave Segments</h5>
                  <ul className="text-amber-800 text-sm mt-1 space-y-1">
                    <li><strong>Logistics:</strong> Delivery, fulfilment and transport providers (advance when information use case separable from live tracking)</li>
                    <li><strong>Service Businesses:</strong> Established providers with standard offerings and repeat customer questions (require identifiable support workflow)</li>
                    <li><strong>Subscription:</strong> Recurring consumer/business services with onboarding and account enquiries (scope general guidance first)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Buying Signals</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li><strong>Support Recruitment:</strong> Current job adverts for customer support roles</li>
                <li><strong>New Market/Language:</strong> Company announcement or active localised website</li>
                <li><strong>Seasonal Demand:</strong> Published operating season, offers or events</li>
                <li><strong>Multiple Channels:</strong> Contact page with active customer-facing channels</li>
                <li><strong>Response Complaints:</strong> Specific public reviews about slow responses</li>
              </ul>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-900 mb-2">Negative ICP (Exclusions)</h4>
              <ul className="list-disc list-inside space-y-1 text-red-800 text-sm">
                <li>Businesses with little recurring support activity or enquiries that are almost entirely bespoke and expert-led</li>
                <li>Prospects seeking only the cheapest self-service chatbot and unwilling to invest in implementation or maintaining accurate information</li>
                <li>Companies without access to usable knowledge, an accountable internal owner or permission to use required systems</li>
                <li>Projects demanding autonomous decisions or transactions beyond PACIA's confirmed capability</li>
                <li>Large procurement-led projects outside core size range unless PACIA explicitly accepts</li>
                <li>Existing PACIA customers, active sales opportunities, partners and specifically restricted companies</li>
              </ul>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Buyer Personas" icon={<Users size={20} />}>
          <div className="space-y-4">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h4 className="font-semibold text-indigo-900 mb-2">Owner or CEO</h4>
              <p className="text-sm text-indigo-800 mb-2"><strong>Primary Concern:</strong> Growth, operating cost and impact of support on small management team</p>
              <p className="text-sm text-indigo-800"><strong>Engagement:</strong> First contact in founder-led businesses. Discuss workload and focused first project.</p>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h4 className="font-semibold text-indigo-900 mb-2">COO or Operations Lead</h4>
              <p className="text-sm text-indigo-800 mb-2"><strong>Primary Concern:</strong> Staff capacity, process consistency and peak demand</p>
              <p className="text-sm text-indigo-800"><strong>Engagement:</strong> Lead with recurring work and operational bottlenecks. Likely business sponsor.</p>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h4 className="font-semibold text-indigo-900 mb-2">Head of Support / Customer Service</h4>
              <p className="text-sm text-indigo-800 mb-2"><strong>Primary Concern:</strong> Repeated questions, backlogs, quality and team time</p>
              <p className="text-sm text-indigo-800"><strong>Engagement:</strong> Lead with specific enquiry category. Treat as likely internal champion.</p>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h4 className="font-semibold text-indigo-900 mb-2">Head of Customer Experience</h4>
              <p className="text-sm text-indigo-800 mb-2"><strong>Primary Concern:</strong> Consistent information and customer effort across channels</p>
              <p className="text-sm text-indigo-800"><strong>Engagement:</strong> Discuss where customers wait or receive inconsistent guidance.</p>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h4 className="font-semibold text-indigo-900 mb-2">Digital Transformation Lead</h4>
              <p className="text-sm text-indigo-800 mb-2"><strong>Primary Concern:</strong> Feasible automation project with measurable ownership</p>
              <p className="text-sm text-indigo-800"><strong>Engagement:</strong> Link support use case to existing improvement initiative.</p>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h4 className="font-semibold text-indigo-900 mb-2">CTO or Technology Lead</h4>
              <p className="text-sm text-indigo-800 mb-2"><strong>Primary Concern:</strong> Access, integration effort, security and maintenance</p>
              <p className="text-sm text-indigo-800"><strong>Engagement:</strong> Include in technical discovery once business use case established. Don't assume ownership of support budget.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-4">
              <h4 className="font-semibold text-slate-900 mb-2">Contact Strategy</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700 text-sm">
                <li>Research up to 2 relevant contacts per account</li>
                <li>Start with support/operations owner where identifiable; otherwise CEO/owner</li>
                <li>Contact one person at a time</li>
                <li>After first sequence ends with no response, approach second contact after 5 business days</li>
                <li>Any reply pauses other outreach to the account while conversation assessed</li>
              </ul>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Pain to Value Mapping">
          <div className="space-y-4 text-sm lg:text-base">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">E-commerce & Retail</h4>
              <p className="text-green-800 text-sm mb-2"><strong>Pain:</strong> Repeat questions about delivery, returns and products consume support time</p>
              <p className="text-green-800 text-sm"><strong>Value Message:</strong> Reduce routine handling and improve access to approved information</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Tourism & Hospitality</h4>
              <p className="text-blue-800 text-sm mb-2"><strong>Pain:</strong> Repeat guest questions and multiple languages stretch reception/reservations teams</p>
              <p className="text-blue-800 text-sm"><strong>Value Message:</strong> Improve enquiry coverage and staff capacity during busy periods</p>
            </div>
          </div>
        </ContentSection>
      </div>
    );
  }

  function FiltersTab() {
    return (
      <ContentSection title="Clay Filtering Strategy" icon={<Filter size={20} />}>
        <div className="space-y-4 text-sm lg:text-base">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Account Selection Criteria</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li><strong>Geography:</strong> Slovenia only (no UK/US until validation)</li>
              <li><strong>Company Size:</strong> 20-250 employees (filter range)</li>
              <li><strong>Priority Band:</strong> 30-150 employees (emphasize in targeting)</li>
              <li><strong>Industries:</strong> E-commerce/Retail (60%), Tourism/Hospitality (40%)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Account Scoring for Prioritization (0-10 scale)</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700 text-sm">
              <li>2 points: Slovenia location</li>
              <li>2 points: Core size fit (30-150 employees)</li>
              <li>2 points: Active support function visible</li>
              <li>2 points: Credible repeatable enquiry category identified</li>
              <li>2 points: Current buying signal present</li>
            </ul>
            <p className="text-slate-600 text-sm mt-2">
              <strong>Priority A:</strong> 8-10 points | <strong>Priority B:</strong> 6 points | <strong>Further Research:</strong> 0-4 points
            </p>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-900 mb-2">Initial Sample Size</h4>
            <p className="text-amber-800 text-sm">
              Research initial sample of 100 unique companies: 60 e-commerce/retail + 40 tourism/hospitality. This is a research and QA batch, not a monthly delivery commitment.
            </p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-900 mb-2">Suppression (Takes Precedence)</h4>
            <ul className="list-disc list-inside space-y-1 text-red-800 text-sm">
              <li>Existing PACIA customers</li>
              <li>Active sales opportunities</li>
              <li>Partners and specifically restricted companies</li>
              <li>Opt-outs and hard bounces</li>
              <li>Direct competitors</li>
            </ul>
            <p className="text-red-800 text-sm mt-2">
              <strong>Process:</strong> Normalize company domains before deduplication. Apply suppression before enrichment and again before sending.
            </p>
          </div>
        </div>
      </ContentSection>
    );
  }

  function PromptsTab() {
    return (
      <ContentSection title="AI Prompts & Messaging Framework" icon={<MessageSquare size={20} />}>
        <div className="space-y-4 text-sm lg:text-base">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Message Framework</h4>
            <p className="text-slate-700 mb-2">
              Use verified company observation + relevant support hypothesis + brief PACIA description + single discovery call to action.
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-700 text-sm">
              <li>Write in clear Slovenian for local launch</li>
              <li>English as internal working language</li>
              <li>Avoid invented familiarity, unsupported personalisation, technology jargon</li>
              <li>No quantified outcome claims without evidence</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2">E-commerce Angle (TIER 1)</h4>
            <p className="text-green-800 text-sm">
              Help the support team handle routine delivery, returns and product questions with less repetitive work. The first conversation establishes which enquiry category is worth automating.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Tourism Angle (TIER 2)</h4>
            <p className="text-blue-800 text-sm">
              Make recurring guest information easier to access across languages and busy periods. Start with information support before discussing booking-system actions.
            </p>
          </div>

          <div className="bg-slate-100 p-4 rounded-lg border border-slate-300 font-mono text-sm">
            <h4 className="font-semibold text-slate-900 mb-2">Email Structure Template (English master copy)</h4>
            <div className="space-y-3 text-slate-800">
              <p><strong>Subject:</strong> Customer enquiries at [Company]</p>
              <div className="mt-2">
                <p>Hi [First name],</p>
                <p className="mt-2">I noticed [verified company observation].</p>
                <p className="mt-2">How does your team currently handle recurring questions about [relevant category]?</p>
                <p className="mt-2">PACIA builds tailored AI support around a company's own information.</p>
                <p className="mt-2">Would a short conversation about whether this could fit your support process be useful?</p>
                <p className="mt-2">[Approved sender]</p>
              </div>
            </div>
            <p className="text-slate-600 text-xs mt-3">
              Note: Localise to Slovenian for actual outreach. Observation and question must be specific to selected segment.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Sequence Configuration</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700 text-sm">
              <li><strong>Structure:</strong> Initial email + 2 follow-ups</li>
              <li><strong>Timing:</strong> Follow-up 1 after 4 business days, Follow-up 2 after 5 business days</li>
              <li><strong>Schedule:</strong> Business days in Europe/Ljubljana timezone, 09:00-16:00 initially</li>
              <li><strong>Stop Conditions:</strong> Reply, opt-out, or hard bounce</li>
            </ul>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-900 mb-2">Reply Handling Guidelines</h4>
            <ul className="list-disc list-inside space-y-1 text-amber-800 text-sm">
              <li><strong>Existing chatbot users:</strong> Ask which support work remains manual</li>
              <li><strong>Low enquiry volume:</strong> Qualify out rather than forcing the case</li>
              <li><strong>Accuracy concerns:</strong> Arrange scope and testing discussion with PACIA</li>
              <li><strong>Pricing/integration/data questions:</strong> Escalate with full conversation context</li>
              <li><strong>Never:</strong> Make unconfirmed commitments in the inbox</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Offer Boundaries for Sales</h4>
            <div className="bg-green-50 p-3 rounded-lg border border-green-200 mb-2">
              <p className="text-green-900 font-semibold text-sm mb-1">Lead With (Information Support):</p>
              <p className="text-green-800 text-sm">Product/service FAQs, delivery and returns policies, booking information, general customer guidance</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <p className="text-red-900 font-semibold text-sm mb-1">Separately Scoped (Integration Requirements):</p>
              <p className="text-red-800 text-sm">Live order lookups, booking changes, refunds, account actions. Don't promise connector/transaction capability before technical review.</p>
            </div>
          </div>
        </div>
      </ContentSection>
    );
  }

  function CampaignsSequencesTab() {
    return (
      <>
        <SequencesTab clientId="pacia" />
        <div className="mt-8">
          <CampaignsTabGeneric />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">PACIA</h1>
              <a
                href="https://www.pacia-support.com/sl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:underline inline-block"
              >
                Visit Website →
              </a>
              <StatusBadge clientId="pacia" status={status} onStatusChange={handleStatusChange} />
              {isAdmin && <AssigneeBadge assignee={assignee} onAssigneeChange={handleAssigneeChange} size="md" />}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 lg:gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap text-sm lg:text-base ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={16} className="lg:w-5 lg:h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'icp' && <ICPAndPersonasTab />}
        {activeTab === 'filters' && <FiltersTab />}
        {activeTab === 'prompts' && <PromptsTab />}
        {activeTab === 'campaigns-sequences' && <CampaignsSequencesTab />}
        {activeTab === 'performance' && (
          <>
            <PerformanceTabDynamic clientId="pacia" />
            <CampaignsTabDynamic clientId="pacia" />
          </>
        )}
        {activeTab === 'documents' && <DocumentsTabGeneric clientId="pacia" />}
        {activeTab === 'tasks' && <TasksTab clientId="pacia" />}
      </div>
    </div>
  );
}
