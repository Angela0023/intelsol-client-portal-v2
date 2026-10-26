'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
import { ContentSection, CodeBlock, InfoCard, ListItem } from '../components/ContentSection';
import SequencesTab from '../components/SequencesTab';
import CampaignsTabGeneric from '../components/CampaignsTabGeneric';
import PerformanceTabDynamic from '../components/PerformanceTabDynamic';
import CampaignsTabDynamic from '../components/CampaignsTabDynamic';
import DocumentsTabGeneric from '../components/DocumentsTabGeneric';
import TasksTab from '../components/TasksTab';
import StatusBadge, { getClientStatus, setClientStatus, DEFAULT_STATUSES, type ClientStatus } from '../components/StatusBadge';
import { getClientAssignee, type Assignee } from '../../lib/auth';
import AssigneeBadge, { getStoredAssignee, setStoredAssignee } from '../components/AssigneeBadge';
import { Target, Filter, Code, TrendingUp, FileText, CheckSquare, BarChart3, Zap, FolderOpen } from 'lucide-react';

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

export default function SeyensPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [assignee, setAssignee] = useState<Assignee | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('seyens', DEFAULT_STATUSES.seyens));
    setAssignee(getStoredAssignee('seyens', getClientAssignee('seyens')));

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
    if (validTab && (userIsAdmin || !internalTabs.includes(validTab.id))) {
      setActiveTab(validTab.id);
    }

    // Handle browser back/forward
    const handlePopState = () => {
      const path = window.location.pathname;
      const tabFromPath = path.split('/').pop();
      const validTab = tabs.find(t => t.id === tabFromPath);
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
    setClientStatus('seyens', newStatus);
  };

  const handleAssigneeChange = (newAssignee: Assignee) => {
    setAssignee(newAssignee);
    setStoredAssignee('seyens', newAssignee);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const newPath = tabId === 'overview' ? '/seyens' : `/seyens/${tabId}`;
    window.history.pushState({}, '', newPath);
  };

  // Filter tabs based on admin access
  const visibleTabs = isAdmin
    ? tabs
    : tabs.filter(tab => !['filters', 'prompts'].includes(tab.id));

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <ContentSection title="Client Overview">
              <div className="space-y-4">
                <p className="text-gray-700">
                  <strong>Seyens</strong> provides premium, science-specific visual communication training for scientists and R&D teams. They teach a systematic method for making complex figures, slides, posters and other research visuals easier to understand, combining self-study with highly interactive live training and feedback on participants' own scientific materials.
                </p>
                <p className="text-gray-700">
                  The target customer is a research-intensive company with enough scientists and internal learning infrastructure for one workshop to grow into recurring cohorts, multiple R&D teams/sites or an annual training relationship.
                </p>
              </div>
            </ContentSection>

            <ContentSection title="Campaign Metrics">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <InfoCard label="Primary Geographies" value="DACH, North America, UK/Ireland" />
                <InfoCard label="Ideal R&D Size" value="100+ scientists/engineers" />
                <InfoCard label="Minimum R&D Size" value="50+ scientists" />
                <InfoCard label="Decision Timeline" value="Training calendar windows" />
              </div>
            </ContentSection>

            <ContentSection title="Target Industries">
              <div className="space-y-3">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h5 className="font-semibold text-blue-900 mb-2">PRIMARY: Life Sciences (Pharmaceuticals, Biotechnology)</h5>
                  <p className="text-blue-800 mb-2">Pharma and biotech R&D with large scientific teams and multiple sites</p>
                  <ul className="space-y-2">
                    <ListItem type="check">Complex technical content requiring clear visual communication</ListItem>
                    <ListItem type="check">Large PhD/research populations</ListItem>
                    <ListItem type="check">Frequent internal/external scientific presentations</ListItem>
                    <ListItem type="check">Established L&D budgets for scientist development</ListItem>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h5 className="font-semibold text-green-900 mb-2">SECONDARY: Industrial & Deep-Tech R&D</h5>
                  <p className="text-green-800 mb-2">AI, semiconductors, photonics, advanced materials, chemicals, advanced manufacturing</p>
                  <ul className="space-y-2">
                    <ListItem type="check">Highly technical, research-intensive engineering organizations</ListItem>
                    <ListItem type="check">Complex internal and external technical communication needs</ListItem>
                    <ListItem type="check">Large populations of advanced technical researchers</ListItem>
                  </ul>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                  <h5 className="font-semibold text-amber-900 mb-2">TERTIARY: Medtech, Diagnostics & Scientific Instruments</h5>
                  <p className="text-amber-800 mb-2">Science-led technology companies with research-intensive cultures</p>
                  <ul className="space-y-2">
                    <ListItem type="check">High publication, patent and conference activity</ListItem>
                    <ListItem type="check">Meaningful share of staff conducting original research</ListItem>
                  </ul>
                </div>
              </div>
            </ContentSection>

            <ContentSection title="Value Proposition">
              <div className="space-y-3">
                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
                  <h5 className="font-semibold text-indigo-900 mb-2">Core Problem</h5>
                  <ul className="space-y-2">
                    <ListItem type="check">Scientists are highly trained in content but rarely trained systematically in visual communication</ListItem>
                    <ListItem type="check">Their figures and slides can be technically correct yet dense, inconsistent or difficult to understand quickly</ListItem>
                    <ListItem type="check">Organizations address this through trial and error or generic presentation courses that don't work with real scientific data</ListItem>
                  </ul>
                </div>

                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
                  <h5 className="font-semibold text-indigo-900 mb-2">Business Impact</h5>
                  <ul className="space-y-2">
                    <ListItem type="check">Scientists and managers spend avoidable time revising slides, figures and posters</ListItem>
                    <ListItem type="check">Complex technical information takes longer to understand</ListItem>
                    <ListItem type="check">Communication quality varies widely between researchers and teams</ListItem>
                    <ListItem type="check">The organization keeps correcting individual outputs instead of giving researchers a reusable method</ListItem>
                  </ul>
                </div>

                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
                  <h5 className="font-semibold text-indigo-900 mb-2">Why Seyens</h5>
                  <ul className="space-y-2">
                    <ListItem type="check">Specialized in scientific visual communication (not generic presentation training)</ListItem>
                    <ListItem type="check">Proprietary, systematic method developed specifically for scientists</ListItem>
                    <ListItem type="check">Principles grounded in visual perception, not subjective design taste</ListItem>
                    <ListItem type="check">Application to participants' real figures, slides and research materials</ListItem>
                    <ListItem type="check">Blended learning: concise self-study plus live application, critique and redesign</ListItem>
                    <ListItem type="check">Science-native trainers who can work credibly with technical material</ListItem>
                    <ListItem type="check">Repeatable method researchers can continue applying after the course</ListItem>
                  </ul>
                </div>
              </div>
            </ContentSection>

            <ContentSection title="Proof Points">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard label="Researchers Trained" value="7,000+" />
                <InfoCard label="Institutions Served" value="200+" />
                <InfoCard label="Trustpilot Rating" value="~95% five-star (294/311)" />
                <InfoCard label="Corporate References" value="IBM Research, Roche, Boehringer Ingelheim" />
              </div>
            </ContentSection>
          </div>
        );

      case 'icp':
        return (
          <ContentSection title="Ideal Customer Profile" icon={<Target className="w-5 h-5" />}>
            <div className="space-y-4">
              <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded">
                <p className="font-semibold text-cyan-900 mb-2">Primary Target</p>
                <p className="text-cyan-800">
                  Research-intensive companies with substantial R&D or scientific workforce (100+ scientists/engineers ideal, 50+ minimum) and organizational infrastructure for staff development including research academies, symposia, or dedicated L&D.
                </p>
              </div>

              <h4 className="font-semibold text-slate-900 mt-6 mb-3">Must-Have Characteristics:</h4>
              <ul className="space-y-2">
                <ListItem type="check">100+ scientists/engineers ideal (50+ minimum when structured L&D exists)</ListItem>
                <ListItem type="check">Research-intensive culture with publications, patents or conference participation</ListItem>
                <ListItem type="check">Internal R&D academy, learning curriculum, or dedicated L&D support for scientists</ListItem>
                <ListItem type="check">Regular research events: symposia, poster sessions, technical forums or onboarding cohorts</ListItem>
                <ListItem type="check">Multi-site or global R&D organization (or concentrated R&D at identifiable site)</ListItem>
                <ListItem type="check">Clear organizational owner of scientist development or training budget</ListItem>
                <ListItem type="check">High-income markets where English-language specialist training is standard</ListItem>
              </ul>

              <h4 className="font-semibold text-slate-900 mt-6 mb-3">Target Industries:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  'Pharmaceuticals',
                  'Biotechnology',
                  'Medical Devices',
                  'Semiconductors',
                  'AI/Advanced Materials',
                  'Advanced Manufacturing',
                  'Diagnostics',
                  'Scientific Instruments',
                  'Chemicals',
                ].map((industry) => (
                  <div key={industry} className="bg-slate-100 px-3 py-2 rounded text-sm">
                    {industry}
                  </div>
                ))}
              </div>
            </div>
          </ContentSection>
        );

      case 'personas':
        return (
          <div className="space-y-6">
            <ContentSection title="Red Flags (Disqualifiers)" icon={<Target className="w-5 h-5" />}>
              <ul className="space-y-2">
                <ListItem type="cross">Very early-stage startups with fewer than ~20-30 researchers and no structured L&D budget</ListItem>
                <ListItem type="cross">Companies looking for generic presentation, sales-pitch or PowerPoint training</ListItem>
                <ListItem type="cross">Organizations buying only low-cost, high-volume lectures (cannot support interactive cohort training)</ListItem>
                <ListItem type="cross">Teams where the need is primarily marketing/brand design rather than scientists communicating technical work</ListItem>
                <ListItem type="cross">Large companies where the contact has no connection to R&D learning or no path to budget owner</ListItem>
                <ListItem type="cross">Universities, doctoral schools, or publicly funded academic research programs</ListItem>
              </ul>
            </ContentSection>

            <ContentSection title="Best-Fit Examples" icon={<Filter className="w-5 h-5" />}>
              <div className="space-y-3">
                <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded">
                  <h5 className="font-semibold text-cyan-900 mb-2">Confirmed Customers</h5>
                  <ul className="space-y-2">
                    <ListItem type="check">IBM Research Zurich - Advanced corporate research environment</ListItem>
                    <ListItem type="check">Roche - Large science-led organization with substantial researcher populations</ListItem>
                    <ListItem type="check">Boehringer Ingelheim - Research-intensive pharmaceutical environment</ListItem>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h5 className="font-semibold text-green-900 mb-2">Comparable Dream Customers</h5>
                  <ul className="space-y-2">
                    <ListItem type="check">Novartis - Global pharmaceutical R&D with large scientific teams and multiple sites</ListItem>
                    <ListItem type="check">ASML - Highly technical, research-intensive engineering organization</ListItem>
                    <ListItem type="check">NVIDIA Research - Large populations of advanced technical researchers</ListItem>
                    <ListItem type="check">AstraZeneca, Novo Nordisk, Infineon, BioNTech</ListItem>
                  </ul>
                </div>
              </div>
            </ContentSection>

            <ContentSection title="Target Geography" icon={<Filter className="w-5 h-5" />}>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Primary Markets:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      'Germany',
                      'Austria',
                      'Switzerland',
                      'United States',
                      'Canada',
                      'United Kingdom',
                      'Ireland',
                    ].map((country) => (
                      <div key={country} className="bg-cyan-100 px-3 py-2 rounded text-sm font-medium">
                        {country}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Secondary Markets:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      'Belgium',
                      'Netherlands',
                      'France',
                      'Sweden',
                      'Singapore',
                      'Australia',
                    ].map((country) => (
                      <div key={country} className="bg-slate-100 px-3 py-2 rounded text-sm">
                        {country}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ContentSection>

            <ContentSection title="Business Model Indicators" icon={<TrendingUp className="w-5 h-5" />}>
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900 mb-3">Particularly Strong Fits</h4>
                <ul className="space-y-2">
                  <ListItem type="check">Multi-site or global R&D organizations</ListItem>
                  <ListItem type="check">Companies with internal R&D academy, learning curriculum or dedicated L&D support for scientists/engineers</ListItem>
                  <ListItem type="check">Organizations with regular research symposia, poster sessions, technical conferences or scientific onboarding</ListItem>
                  <ListItem type="check">Research cultures with high publication, patent and conference activity</ListItem>
                  <ListItem type="check">Companies where one successful engagement can expand across teams, sites or yearly cohorts</ListItem>
                </ul>
              </div>
            </ContentSection>
          </div>
        );

      case 'filters':
        return (
          <div className="space-y-6">
            <ContentSection title="Clay Filters Overview">
              <p className="text-gray-700 mb-4">
                All filters target research-intensive companies with substantial R&D populations. The filters are organized by priority geography and industry focus.
              </p>

              <div className="space-y-3">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h5 className="font-semibold text-blue-900 mb-2">Priority 1: DACH + Life Sciences</h5>
                  <p className="text-blue-800">
                    Pharmaceuticals and biotechnology companies in Germany, Austria, Switzerland with 50+ R&D staff
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h5 className="font-semibold text-blue-900 mb-2">Priority 2: DACH + Deep-Tech</h5>
                  <p className="text-blue-800">
                    Industrial R&D, semiconductors, AI, advanced materials in DACH region with 50+ R&D staff
                  </p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h5 className="font-semibold text-green-900 mb-2">Priority 3: North America + Life Sciences</h5>
                  <p className="text-green-800">
                    Pharma/biotech companies in US and Canada with 50+ R&D staff
                  </p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h5 className="font-semibold text-green-900 mb-2">Priority 4: North America + Deep-Tech</h5>
                  <p className="text-green-800">
                    Industrial R&D, semiconductors, AI companies in North America with 50+ R&D staff
                  </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                  <h5 className="font-semibold text-amber-900 mb-2">Priority 5: UK/Ireland + All Industries</h5>
                  <p className="text-amber-800">
                    All target industries (Life Sciences, Deep-Tech, Medtech) in UK and Ireland with 50+ R&D staff
                  </p>
                </div>
              </div>
            </ContentSection>

            <ContentSection title="Filter Criteria">
              <div className="space-y-3">
                <div className="bg-slate-50 border-l-4 border-slate-500 p-4 rounded">
                  <h5 className="font-semibold text-slate-900 mb-3">Core Requirements (All Filters)</h5>
                  <ul className="space-y-2">
                    <ListItem type="check">Minimum 50 R&D/scientific staff (ideal 100+)</ListItem>
                    <ListItem type="check">Industries: Pharmaceuticals, Biotechnology, Medical Devices, Semiconductors, AI, Advanced Materials, Chemicals, Scientific Instruments</ListItem>
                    <ListItem type="check">Exclude: Universities, academic programmes, publicly funded research programmes</ListItem>
                    <ListItem type="check">Exclude: Very early-stage startups without sufficient researcher headcount</ListItem>
                  </ul>
                </div>
              </div>
            </ContentSection>

            <ContentSection title="Buying Signals">
              <div className="space-y-3">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h5 className="font-semibold text-blue-900 mb-3">Tier 1 Signals (Highest Priority)</h5>
                  <ul className="space-y-2">
                    <ListItem type="check">Dedicated R&D academy/L&D programme with current courses in scientific writing, presentation, or communication</ListItem>
                    <ListItem type="check">Recurring scientific event or cohort (symposium, poster day, technical conference, graduate R&D cohort)</ListItem>
                    <ListItem type="check">Named owner who buys external training for scientists</ListItem>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h5 className="font-semibold text-green-900 mb-3">Tier 2 Signals (Medium Priority)</h5>
                  <ul className="space-y-2">
                    <ListItem type="check">Large, concentrated R&D workforce (100+ scientists/engineers at identifiable R&D site)</ListItem>
                    <ListItem type="check">High PhD density with active publications, patents or conference participation</ListItem>
                    <ListItem type="check">R&D expansion: substantial scientist hiring, new R&D site/lab, acquisition/integration</ListItem>
                    <ListItem type="check">Rapid team growth creating onboarding and communication-standardization needs</ListItem>
                  </ul>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                  <h5 className="font-semibold text-amber-900 mb-3">Tier 3 Signals (Lower Priority)</h5>
                  <ul className="space-y-2">
                    <ListItem type="check">Research-intensive company without visible training trigger</ListItem>
                    <ListItem type="check">Strong technical/scientific workforce but no public evidence yet of training ownership, cohort timing or upcoming event</ListItem>
                  </ul>
                  <p className="text-amber-800 mt-3 text-sm">
                    Note: Buying signals should be used for prioritization and message personalization, not as mandatory inclusion criteria. A very strong ICP company should still be contacted when no public timing trigger can be found.
                  </p>
                </div>
              </div>
            </ContentSection>

            <ContentSection title="Technology Signals">
              <div className="bg-slate-50 border-l-4 border-slate-500 p-4 rounded">
                <h5 className="font-semibold text-slate-900 mb-3">R&D-Intensity Proxies (Optional)</h5>
                <p className="text-slate-800 mb-3">
                  Technology stack is NOT a primary filter. Use only as R&D-intensity proxy if available:
                </p>
                <ul className="space-y-2">
                  <ListItem type="check">Life Sciences: BioRender, GraphPad Prism, Benchling</ListItem>
                  <ListItem type="check">Engineering: MATLAB, COMSOL, Origin, LabVIEW</ListItem>
                </ul>
                <p className="text-slate-800 mt-3 text-sm">
                  Publication/patent activity, R&D headcount and learning infrastructure are stronger signals than software usage.
                </p>
              </div>
            </ContentSection>

            <ContentSection title="Explicit Exclusions">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h5 className="font-semibold text-red-900 mb-3">Do NOT Contact</h5>
                <ul className="space-y-2">
                  <ListItem type="check">Universities, doctoral schools, graduate schools, public academic programmes</ListItem>
                  <ListItem type="check">MSCA Doctoral Networks/COFUND, Horizon Europe training cohorts, DFG GRKs/SFBs/Excellence Clusters</ListItem>
                  <ListItem type="check">Very early-stage companies without sufficient researcher headcount or learning budget</ListItem>
                  <ListItem type="check">Marketing/design agencies, generic training providers, scientific-communication consultancies (potential competitors)</ListItem>
                  <ListItem type="check">Companies with little genuine R&D despite nominally technical sector</ListItem>
                </ul>
              </div>
            </ContentSection>
          </div>
        );

      case 'personas':
        return (
          <div className="space-y-6">
            <ContentSection title="Decision Maker Hierarchy">
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h5 className="font-semibold text-blue-900 mb-2">PRIMARY: R&D Learning & Capability Development</h5>
                  <p className="text-blue-800 mb-3">
                    <strong>When This Applies:</strong> Best target in large companies. Owns scientist/engineer development, training calendars and external providers.
                  </p>
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-blue-900 mb-2">Typical Titles:</p>
                    <ul className="space-y-2">
                      <ListItem type="check">R&D Learning & Development Manager</ListItem>
                      <ListItem type="check">Scientific Training Manager</ListItem>
                      <ListItem type="check">R&D Academy Lead</ListItem>
                      <ListItem type="check">Capability Development Lead</ListItem>
                      <ListItem type="check">L&D Business Partner for R&D</ListItem>
                      <ListItem type="check">Talent Development Manager</ListItem>
                    </ul>
                  </div>
                  <p className="text-blue-800 text-sm">
                    <strong>Important:</strong> Do not require "R&D" or "Scientific" in job title. Generic L&D, Learning Programme, Talent Development, Early Careers or Capability roles are valid when there is evidence the person supports R&D/scientific populations.
                  </p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h5 className="font-semibold text-green-900 mb-2">SECONDARY: R&D / Scientific Leadership</h5>
                  <p className="text-green-800 mb-3">
                    <strong>When This Applies:</strong> More important in mid-sized biotech/deep-tech firms or when no dedicated R&D learning role exists. May own budget or sponsor a pilot.
                  </p>
                  <div>
                    <p className="text-sm font-semibold text-green-900 mb-2">Typical Titles:</p>
                    <ul className="space-y-2">
                      <ListItem type="check">VP/Head/Director of R&D</ListItem>
                      <ListItem type="check">Research Director</ListItem>
                      <ListItem type="check">Site Head</ListItem>
                      <ListItem type="check">Chief Scientific Officer</ListItem>
                      <ListItem type="check">Head of Research Operations</ListItem>
                    </ul>
                  </div>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                  <h5 className="font-semibold text-amber-900 mb-2">TERTIARY: Scientific Programme / Event Champion</h5>
                  <p className="text-amber-800 mb-3">
                    <strong>When This Applies:</strong> Useful champion when they organize a defined cohort/event, but often not the final budget owner.
                  </p>
                  <div>
                    <p className="text-sm font-semibold text-amber-900 mb-2">Typical Titles:</p>
                    <ul className="space-y-2">
                      <ListItem type="check">Scientific Communications Manager (internal/R&D)</ListItem>
                      <ListItem type="check">Research Programme Manager</ListItem>
                      <ListItem type="check">Symposium/Poster-Day Organizer</ListItem>
                      <ListItem type="check">Senior Scientist</ListItem>
                      <ListItem type="check">Technical Community Lead</ListItem>
                    </ul>
                  </div>
                </div>
              </div>
            </ContentSection>

            <ContentSection title="Persona Variation by Company Type">
              <div className="space-y-3">
                <div className="bg-slate-50 border-l-4 border-slate-500 p-4 rounded">
                  <h5 className="font-semibold text-slate-900 mb-3">Buyer Prioritization Rules</h5>
                  <ul className="space-y-2">
                    <ListItem type="check"><strong>Large multinationals:</strong> Prioritize dedicated R&D L&D/capability teams or L&D business partner aligned to R&D</ListItem>
                    <ListItem type="check"><strong>Mid-sized biotech/deep-tech:</strong> CSO, VP/Director of R&D or Research Operations leader may directly sponsor training</ListItem>
                    <ListItem type="check"><strong>Site-based organizations:</strong> Relevant buyer may sit at individual research site rather than global headquarters</ListItem>
                  </ul>
                  <p className="text-slate-800 mt-3 text-sm">
                    <strong>Do NOT default to generic HR or corporate communications.</strong> The contact should have clear connection to R&D staff development, a scientific cohort or an internal research event.
                  </p>
                </div>
              </div>
            </ContentSection>
          </div>
        );

      case 'messaging':
        return (
          <div className="space-y-6">
            <ContentSection title="Messaging Framework">
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h5 className="font-semibold text-blue-900 mb-3">Core Positioning</h5>
                  <ul className="space-y-2">
                    <ListItem type="check">Scientific visual communication</ListItem>
                    <ListItem type="check">Science-specific / built for scientists and R&D teams</ListItem>
                    <ListItem type="check">A systematic method grounded in visual perception</ListItem>
                    <ListItem type="check">Practical application to participants' own scientific figures, slides and posters</ListItem>
                    <ListItem type="check">Capability development rather than graphic-design outsourcing</ListItem>
                  </ul>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <h5 className="font-semibold text-red-900 mb-3">AVOID</h5>
                  <ul className="space-y-2">
                    <ListItem type="check">Reducing Seyens to generic "presentation skills", "PowerPoint training" or graphic design</ListItem>
                    <ListItem type="check">Hype, generic AI personalization, unverifiable ROI claims</ListItem>
                    <ListItem type="check">Guaranteed claims about publications, grants, productivity or business outcomes</ListItem>
                  </ul>
                </div>
              </div>
            </ContentSection>

            <ContentSection title="Proof Points for Outreach">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
                  <h5 className="font-semibold text-indigo-900 mb-2">Quantitative Proof</h5>
                  <ul className="space-y-2">
                    <ListItem type="check">7,000+ researchers trained</ListItem>
                    <ListItem type="check">200+ institutions served</ListItem>
                    <ListItem type="check">~95% five-star Trustpilot reviews (294/311)</ListItem>
                  </ul>
                </div>
                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
                  <h5 className="font-semibold text-indigo-900 mb-2">Corporate References</h5>
                  <ul className="space-y-2">
                    <ListItem type="check">IBM Research Zurich</ListItem>
                    <ListItem type="check">Roche</ListItem>
                    <ListItem type="check">Boehringer Ingelheim</ListItem>
                  </ul>
                  <p className="text-indigo-800 mt-2 text-sm">
                    Use corporate references first in corporate outreach. Academic references can be used as secondary credibility.
                  </p>
                </div>
              </div>
            </ContentSection>

            <ContentSection title="Call to Action Framework">
              <div className="space-y-3">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h5 className="font-semibold text-green-900 mb-3">Email 1 (First Cold Email)</h5>
                  <p className="text-green-800 mb-2">
                    <strong>Do NOT ask for a meeting or send a calendar link.</strong> Goal: establish interest/relevance and start a conversation.
                  </p>
                  <ul className="space-y-2">
                    <ListItem type="check"><strong>When contact is clearly responsible for R&D/scientist development:</strong> "Would this be relevant to your R&D/scientist development programme?"</ListItem>
                    <ListItem type="check"><strong>When ownership is uncertain:</strong> "Is this something you look after, or is there someone else responsible for development of your scientists/researchers?"</ListItem>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h5 className="font-semibold text-green-900 mb-3">Follow-Up Strategy</h5>
                  <p className="text-green-800 mb-2">
                    <strong>Sequence:</strong> Email 1 → Follow-up 1 → Follow-up 2 → stop.
                  </p>
                  <ul className="space-y-2">
                    <ListItem type="check">Do NOT write follow-ups that only say "bumping this" or "did you see my previous email?"</ListItem>
                    <ListItem type="check">Each follow-up should introduce one new reason to respond</ListItem>
                  </ul>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h5 className="font-semibold text-blue-900 mb-3">After Positive Response</h5>
                  <ul className="space-y-2">
                    <ListItem type="check"><strong>If prospect mentions concrete cohort/event/timing:</strong> Suggest short call directly</ListItem>
                    <ListItem type="check"><strong>If interested but not ready for call:</strong> Offer up to 2 complimentary places in Seyens' live Fundamentals of Visual Communication training</ListItem>
                    <ListItem type="check"><strong>Once ready:</strong> Move toward short call</ListItem>
                  </ul>
                </div>
              </div>
            </ContentSection>

            <ContentSection title="Tone & Style">
              <div className="bg-slate-50 border-l-4 border-slate-500 p-4 rounded">
                <h5 className="font-semibold text-slate-900 mb-3">Professional, Concise, Consultative, Direct</h5>
                <p className="text-slate-800 mb-3">
                  Messages should feel like one specialist contacting another professional:
                </p>
                <ul className="space-y-2">
                  <ListItem type="check">Specific enough to show why the company was selected</ListItem>
                  <ListItem type="check">Short enough to read quickly</ListItem>
                  <ListItem type="check">Low-hype</ListItem>
                  <ListItem type="check">Easy to answer with simple yes/no or referral to right person</ListItem>
                </ul>
              </div>
            </ContentSection>
          </div>
        );

      case 'campaigns-sequences':
        return (
          <>
            <SequencesTab clientId="seyens" />
            <div className="mt-8">
              <CampaignsTabGeneric />
            </div>
          </>
        );

      case 'performance':
        return (
          <>
            <PerformanceTabDynamic clientId="seyens" />
            <CampaignsTabDynamic clientId="seyens" />
          </>
        );

      case 'documents':
        return <DocumentsTabGeneric clientId="seyens" />;

      case 'tasks':
        return <TasksTab clientId="seyens" />;

      case 'prompts':
        return (
          <div className="space-y-6">
            <ContentSection title="AI Prompts">
              <div className="bg-slate-50 border-l-4 border-slate-500 p-4 rounded">
                <p className="text-slate-800">AI prompts configuration coming soon.</p>
              </div>
            </ContentSection>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ClientLayout>
      <div className="p-4 lg:p-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 lg:space-x-3 mb-2">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl lg:text-2xl font-bold text-cyan-700">SY</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 lg:space-x-3 flex-wrap">
                <h1 className="text-xl lg:text-3xl font-bold text-slate-900">Seyens</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
                {isAdmin && <AssigneeBadge assignee={assignee} onAssigneeChange={handleAssigneeChange} size="md" />}
              </div>
              <p className="text-sm lg:text-base text-slate-600 break-words">Science-Specific Visual Communication Training for R&D Teams</p>
            </div>
          </div>
          <a
            href="https://www.seyens.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-cyan-600 hover:underline inline-block"
          >
            Visit Website →
          </a>
        </div>

        {/* Tabs */}
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

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </ClientLayout>
  );
}
