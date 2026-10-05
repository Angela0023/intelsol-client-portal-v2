'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
import { ContentSection, CodeBlock, InfoCard, SubSection, ListItem } from '../components/ContentSection';
import SequencesTab from '../components/SequencesTab';
import PerformanceTabDynamic from '../components/PerformanceTabDynamic';
import CampaignsTabDynamic from '../components/CampaignsTabDynamic';
import DocumentsTabGeneric from '../components/DocumentsTabGeneric';
import CampaignsTabGeneric from '../components/CampaignsTabGeneric';
import TasksTab from '../components/TasksTab';
import StatusBadge, { getClientStatus, setClientStatus, type ClientStatus } from '../components/StatusBadge';
import { FileText, Target, Filter, Code, Zap, BarChart3, FolderOpen, CheckSquare, Users, TrendingUp, Mail } from 'lucide-react';

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

export default function MoreFromFoodPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Onboarding');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const savedStatus = getClientStatus('morefromfood', 'Onboarding');
    setStatus(savedStatus);

    const access = sessionStorage.getItem('clientAccess');
    if (access) {
      try {
        const accessList = JSON.parse(access);
        setIsAdmin(accessList.includes('admin'));
      } catch (e) {
        console.error('Failed to parse clientAccess:', e);
      }
    }

    const internalTabs = ['filters', 'prompts'];
    const path = window.location.pathname;
    const tabFromPath = path.split('/').pop();

    if (tabFromPath && tabs.some(t => t.id === tabFromPath)) {
      if (!internalTabs.includes(tabFromPath) || isAdmin) {
        setActiveTab(tabFromPath);
      }
    }
  }, []);

  // Filter tabs for non-admin users (hide Clay Filters and AI Prompts)
  const internalTabs = ['filters', 'prompts'];
  const visibleTabs = isAdmin
    ? tabs
    : tabs.filter(tab => !internalTabs.includes(tab.id));

  const handleStatusChange = (newStatus: ClientStatus) => {
    setStatus(newStatus);
    setClientStatus('morefromfood', newStatus);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.history.pushState({}, '', `/morefromfood/${tabId}`);
  };

  return (
    <ClientLayout>
      <div className="p-4 lg:p-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 lg:space-x-3 mb-2">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-lime-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl lg:text-2xl font-bold text-lime-700">MF</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">MoreFromFood</h1>
                <StatusBadge clientId="morefromfood" status={status} onStatusChange={handleStatusChange} />
              </div>
              <p className="text-xs lg:text-sm text-gray-600 mt-1">
                HACCP & Quality Control Software (Croatia/Serbia)
              </p>
            </div>
          </div>
          <a
            href="https://morefromfood.com/sl/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-lime-700 hover:underline inline-block"
          >
            Visit Website →
          </a>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
          <nav className="-mb-px flex space-x-4 lg:space-x-8 min-w-max">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    whitespace-nowrap py-3 lg:py-4 px-1 border-b-2 font-medium text-xs lg:text-sm flex items-center space-x-2
                    ${
                      activeTab === tab.id
                        ? 'border-lime-700 text-lime-700'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="max-w-5xl">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'icp' && <ICPAndPersonasTab />}
          {activeTab === 'filters' && <FiltersTab />}
          {activeTab === 'prompts' && <PromptsTab />}
          {activeTab === 'campaigns-sequences' && <CampaignsSequencesTab />}
          {activeTab === 'performance' && (
            <>
              <PerformanceTabDynamic clientId="morefromfood" />
              <CampaignsTabDynamic clientId="morefromfood" />
            </>
          )}
          {activeTab === 'documents' && <DocumentsTabGeneric clientId="morefromfood" />}
          {activeTab === 'tasks' && <TasksTab clientId="morefromfood" />}
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
            MoreFromFood (Dotcom d.o.o.) provides digital HACCP records, checklists, temperature monitoring, corrective actions and audit documentation for food manufacturers. The platform supports multi-site oversight, traceability, technical specifications and ERP/IoT integration options.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Service" value="Digital HACCP & Quality Control" />
            <InfoCard label="Markets" value="Croatia & Serbia" />
            <InfoCard label="Target Segment" value="Food Manufacturing (50-500 employees)" />
            <InfoCard label="Website" value={
              <a href="https://morefromfood.com/sl/" target="_blank" rel="noopener noreferrer" className="text-lime-600 hover:underline">
                morefromfood.com
              </a>
            } />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="What MoreFromFood Offers" icon={<TrendingUp className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="check">Digital HACCP recordkeeping and checklists</ListItem>
          <ListItem type="check">Temperature monitoring and corrective action tracking</ListItem>
          <ListItem type="check">Multi-site oversight and audit documentation</ListItem>
          <ListItem type="check">Traceability and technical specifications management</ListItem>
          <ListItem type="check">ERP/IoT integration options</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Value Proposition" icon={<Target className="w-5 h-5" />}>
        <div className="bg-lime-50 border-l-4 border-lime-500 p-4 rounded">
          <p className="font-semibold text-lime-900 mb-2">Who MoreFromFood Helps:</p>
          <p className="text-lime-800">
            Help food manufacturers organize daily food-safety controls, records and corrective actions in one workflow,
            so quality and production teams can follow progress and retrieve evidence more easily.
          </p>
          <div className="mt-3 space-y-1 text-sm text-lime-800">
            <p><strong>Quality teams:</strong> Easier access to records and corrective action follow-up</p>
            <p><strong>Production teams:</strong> Visibility of completed vs. outstanding checks across shifts</p>
            <p><strong>Management:</strong> Consistent oversight across plants</p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

  function ICPAndPersonasTab() {
    return (
      <div className="space-y-6">
        <ContentSection title="ICP Criteria" icon={<Target className="w-5 h-5" />}>
          <SubSection title="Company Size" icon={<Users className="w-5 h-5" />}>
            <div>
              <strong className="text-green-600">Primary range:</strong> 50-500 employees
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <ListItem>Medium-sized and larger food manufacturers with established quality processes</ListItem>
                <ListItem>One substantial production site is sufficient</ListItem>
                <ListItem>Multiple sites increase relevance but are not mandatory</ListItem>
              </ul>

              <strong className="mt-4 block text-blue-600">Secondary range:</strong> 20-49 employees
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <ListItem>Only when production complexity is evident</ListItem>
                <ListItem>Supplying retail chains, export activity, multiple shifts, several production sites</ListItem>
                <ListItem>Do not qualify on headcount alone</ListItem>
              </ul>

              <strong className="mt-4 block text-amber-600">Above 500 employees:</strong> Selective account research
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <ListItem>Identify the operating plant and quality sponsor</ListItem>
                <ListItem>Understand group-level purchasing authority</ListItem>
                <ListItem>Separate site-level and group employee estimates</ListItem>
              </ul>
            </div>
          </SubSection>

          <SubSection title="Geography" icon={<Target className="w-5 h-5" />}>
            <strong>Initial markets:</strong> Croatia and Serbia
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <ListItem>🇭🇷 Create separate Croatian segment (language: Croatian)</ListItem>
              <ListItem>🇷🇸 Create separate Serbian segment (language: Serbian)</ListItem>
              <ListItem>Record actual food-handling site separately from headquarters</ListItem>
              <ListItem>Confirm whether a plant can buy locally or needs group approval</ListItem>
            </ul>
          </SubSection>

          <SubSection title="Primary Manufacturing Segments" icon={<Target className="w-5 h-5" />}>
            <div>
              <ul className="space-y-2 text-sm text-gray-600">
                <ListItem><strong>Meat processing</strong> - meat plants, meat processors</ListItem>
                <ListItem><strong>Dairy</strong> - dairy manufacturers, milk processors</ListItem>
                <ListItem><strong>Industrial bakery</strong> - bakery production plants</ListItem>
                <ListItem><strong>Beverages</strong> - beverage manufacturers</ListItem>
                <ListItem><strong>Prepared meals & convenience food</strong> - ready-meal producers</ListItem>
                <ListItem><strong>Confectionery</strong> - confectionery manufacturers</ListItem>
              </ul>
              <p className="mt-3 text-sm text-gray-600">
                Begin with separate meat, dairy, bakery and prepared-food segments to compare response and qualification rates. Require evidence of actual manufacturing from product, facility or company pages.
              </p>
            </div>
          </SubSection>

          <SubSection title="Business Model Fit" icon={<Target className="w-5 h-5" />}>
            <ul className="space-y-2 text-sm text-gray-600">
              <ListItem>✅ Own-brand manufacturers with production operations and recurring quality controls</ListItem>
              <ListItem>✅ Private-label producers with their own facilities</ListItem>
              <ListItem>✅ Contract manufacturers with quality/food-safety function</ListItem>
              <ListItem>✅ Retail-chain suppliers (indicates demanding documentation needs)</ListItem>
              <ListItem>✅ Export-active manufacturers (indicates quality standards)</ListItem>
              <ListItem>✅ Certified operations (IFS, BRCGS, FSSC 22000, ISO 22000)</ListItem>
            </ul>
          </SubSection>

          <SubSection title="Search Terms (Local)" icon={<Code className="w-5 h-5" />}>
            <div>
              <strong>Croatian/Serbian terms:</strong>
              <CodeBlock language="text">
proizvodnja hrane, prehrambena industrija, prerada mesa, mljekara / mlekara, pekarska industrija, gotova jela, proizvodnja pića, konditorska industrija
              </CodeBlock>
              <p className="mt-2 text-sm text-gray-600">
                Combine with Croatia/Hrvatska or Serbia/Srbija and locality. Verify manufacturing manually. A food-sector category alone is insufficient.
              </p>
            </div>
          </SubSection>
        </ContentSection>

        <ContentSection title="Buyer Personas" icon={<Users className="w-5 h-5" />}>
          <SubSection title="PRIMARY: Quality / Food Safety" icon={<Target className="w-5 h-5" />}>
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <div>
                <strong className="text-blue-900">Typical titles:</strong>
                <p className="text-sm text-gray-700 mt-1">Head of Quality, Quality Manager, Food Safety Manager</p>
              </div>
              <div>
                <strong className="text-blue-900">When this applies:</strong>
                <p className="text-sm text-gray-700 mt-1">Likely process champion - validates records, controls and evidence needs</p>
              </div>
              <div>
                <strong className="text-blue-900">Messaging angle:</strong>
                <p className="text-sm text-gray-700 mt-1">Easier access to HACCP records and corrective actions, faster evidence preparation for audits, centralized compliance visibility</p>
              </div>
              <div>
                <strong className="text-blue-900">Local titles:</strong>
                <CodeBlock language="text">
voditelj kvalitete, rukovodilac kvaliteta, menadžer kvaliteta, odgovorna osoba za sigurnost / bezbednost hrane
                </CodeBlock>
              </div>
            </div>
          </SubSection>

          <SubSection title="PRIMARY: QA / QC" icon={<Target className="w-5 h-5" />}>
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <div>
                <strong className="text-blue-900">Typical titles:</strong>
                <p className="text-sm text-gray-700 mt-1">QA Manager, Quality Control Manager</p>
              </div>
              <div>
                <strong className="text-blue-900">When this applies:</strong>
                <p className="text-sm text-gray-700 mt-1">Daily workflow owner - confirms practical gaps and user requirements</p>
              </div>
              <div>
                <strong className="text-blue-900">Messaging angle:</strong>
                <p className="text-sm text-gray-700 mt-1">Digital workspace for QC checks, immediate deviation flagging, organized records by date/check type/production line</p>
              </div>
            </div>
          </SubSection>

          <SubSection title="PRIMARY: Production / Plant" icon={<Target className="w-5 h-5" />}>
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <div>
                <strong className="text-blue-900">Typical titles:</strong>
                <p className="text-sm text-gray-700 mt-1">Production Manager, Plant Manager</p>
              </div>
              <div>
                <strong className="text-blue-900">When this applies:</strong>
                <p className="text-sm text-gray-700 mt-1">Operational sponsor for plant rollout and staff adoption</p>
              </div>
              <div>
                <strong className="text-blue-900">Messaging angle:</strong>
                <p className="text-sm text-gray-700 mt-1">Visibility of completed vs. outstanding checks across shifts, clearer shift handovers, real-time production status</p>
              </div>
              <div>
                <strong className="text-blue-900">Local titles:</strong>
                <CodeBlock language="text">
voditelj / rukovodilac proizvodnje, direktor proizvodnje, direktor pogona
                </CodeBlock>
              </div>
            </div>
          </SubSection>

          <SubSection title="SECONDARY: Operations / Leadership" icon={<Target className="w-5 h-5" />}>
            <div className="bg-green-50 p-4 rounded-lg space-y-2">
              <div>
                <strong className="text-green-900">Typical titles:</strong>
                <p className="text-sm text-gray-700 mt-1">Operations Director, Managing Director, Owner</p>
              </div>
              <div>
                <strong className="text-green-900">When this applies:</strong>
                <p className="text-sm text-gray-700 mt-1">Budget and priorities - ownership varies by company size</p>
              </div>
              <div>
                <strong className="text-green-900">Messaging angle:</strong>
                <p className="text-sm text-gray-700 mt-1">Consistent oversight across plants, real-time compliance status without manual reports, reduced administrative workload</p>
              </div>
            </div>
          </SubSection>

          <SubSection title="SUPPORTING: IT / Procurement" icon={<Target className="w-5 h-5" />}>
            <div className="bg-amber-50 p-4 rounded-lg space-y-2">
              <div>
                <strong className="text-amber-900">Typical titles:</strong>
                <p className="text-sm text-gray-700 mt-1">IT Manager, Procurement Manager, Group Quality</p>
              </div>
              <div>
                <strong className="text-amber-900">When this applies:</strong>
                <p className="text-sm text-gray-700 mt-1">Technical and commercial review in larger organizations</p>
              </div>
              <div>
                <strong className="text-amber-900">Messaging angle:</strong>
                <p className="text-sm text-gray-700 mt-1">Multi-site deployment, integration options, data security, commercial terms for group-level implementation</p>
              </div>
            </div>
          </SubSection>

          <SubSection title="Decision-Maker Strategy" icon={<Users className="w-5 h-5" />}>
            <ul className="space-y-2 text-sm text-gray-600">
              <ListItem><strong>Lead with Quality / Food Safety</strong> - likely process champion</ListItem>
              <ListItem><strong>Involve Production / Plant / Operations</strong> - for implementation</ListItem>
              <ListItem><strong>Confirm who approves spending</strong> - don't assume every manager is final decision maker</ListItem>
              <ListItem><strong>Smaller manufacturers:</strong> Owner or managing director may sponsor purchase</ListItem>
              <ListItem><strong>Larger groups:</strong> May add IT, procurement and central quality after operational interest</ListItem>
            </ul>
          </SubSection>
        </ContentSection>

        <ContentSection title="Buying Signals" icon={<TrendingUp className="w-5 h-5" />}>
          <SubSection title="Tier 1: Strongest Signals" icon={<Target className="w-5 h-5" />}>
            <div className="bg-green-50 p-4 rounded-lg space-y-3">
              <div>
                <strong className="text-green-900">Active project</strong>
                <p className="text-sm text-gray-700 mt-1">Confirmed search for digital HACCP or quality records, with an identified owner and timing.</p>
              </div>
              <div>
                <strong className="text-green-900">Defined operational deadline</strong>
                <p className="text-sm text-gray-700 mt-1">New site or line with a disclosed need to select or change recordkeeping workflows. Verify decision status.</p>
              </div>
            </div>
          </SubSection>

          <SubSection title="Tier 2: Moderate Signals" icon={<Target className="w-5 h-5" />}>
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <div>
                <strong className="text-blue-900">Growth and quality change</strong>
                <p className="text-sm text-gray-700 mt-1">Capacity expansion, new retail/export requirements or a stated certification project. Confirm the resulting need.</p>
              </div>
              <div>
                <strong className="text-blue-900">Role or process investment</strong>
                <p className="text-sm text-gray-700 mt-1">Hiring quality/production leaders or announcing process digitalization. Evidence of investment, not proof of purchase intent.</p>
              </div>
            </div>
          </SubSection>

          <SubSection title="Tier 3: Structural Fit" icon={<Target className="w-5 h-5" />}>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <strong className="text-gray-900">Structural fit</strong>
                <p className="text-sm text-gray-700 mt-1">Food manufacturing, recurring controls, quality ownership and sufficient scale. Multiple sites and standards add context.</p>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Research country, production activity, size, operating sites and quality ownership before prioritizing signals. Use IFS, BRCGS, FSSC 22000 or ISO 22000 mentions as research clues about process requirements.
              </p>
            </div>
          </SubSection>
        </ContentSection>
      </div>
    );
  }

  function FiltersTab() {
    return (
      <div className="space-y-6">
        <ContentSection title="Clay Table Filters" icon={<Filter className="w-5 h-5" />}>
          <SubSection title="Geography Filter" icon={<Target className="w-5 h-5" />}>
            <CodeBlock language="text">
HQ Country contains any of: Croatia, Serbia

# Record actual food-handling site separately from headquarters
# Confirm whether a plant can buy locally or needs group approval
            </CodeBlock>
          </SubSection>

          <SubSection title="Company Size Filter" icon={<Users className="w-5 h-5" />}>
            <CodeBlock language="text">
# Primary range
Employee Count is between 50 and 500

# Secondary range (with production complexity)
Employee Count is between 20 and 49
AND
(
  Keywords contains any of: "export", "retail chain", "multiple shifts", "certified"
  OR
  Number of Locations greater than 1
)

# Above 500 (selective research)
Employee Count greater than 500
# Manually identify operating plant, quality sponsor, group purchasing authority
            </CodeBlock>
          </SubSection>

          <SubSection title="Industry Keywords" icon={<Target className="w-5 h-5" />}>
            <CodeBlock language="text">
# Croatian/Serbian search terms
Industry / Keywords contains any of:
  "proizvodnja hrane",
  "prehrambena industrija",
  "prerada mesa",
  "mljekara",
  "mlekara",
  "pekarska industrija",
  "gotova jela",
  "proizvodnja pića",
  "konditorska industrija",
  "meat processing",
  "dairy",
  "bakery production",
  "beverage manufacturing",
  "prepared meals",
  "ready meals",
  "confectionery"

# Require evidence of actual manufacturing
# A food-sector category or product catalogue alone is insufficient
            </CodeBlock>
          </SubSection>

          <SubSection title="Segment-Specific Filters" icon={<Target className="w-5 h-5" />}>
            <div>
              <strong className="block mb-2">Meat Processing:</strong>
              <CodeBlock language="text">
Keywords contains any of: "prerada mesa", "meat processing", "meat plant", "mesnica", "mesna prerada"
              </CodeBlock>

              <strong className="block mb-2 mt-4">Dairy:</strong>
              <CodeBlock language="text">
Keywords contains any of: "mljekara", "mlekara", "dairy", "milk processing", "mljekara"
              </CodeBlock>

              <strong className="block mb-2 mt-4">Industrial Bakery:</strong>
              <CodeBlock language="text">
Keywords contains any of: "pekarska industrija", "bakery production", "industrial bakery", "pekarnica"
              </CodeBlock>

              <strong className="block mb-2 mt-4">Prepared Meals:</strong>
              <CodeBlock language="text">
Keywords contains any of: "gotova jela", "prepared meals", "ready meals", "convenience food"
              </CodeBlock>
            </div>
          </SubSection>

          <SubSection title="Exclusions" icon={<Filter className="w-5 h-5" />}>
            <CodeBlock language="text">
Industry does NOT contain any of:
  "restaurant", "hotel", "catering" (unless manufacturing is confirmed),
  "retailer" (unless production is confirmed),
  "broker", "importer", "wholesaler", "distributor" (without manufacturing),
  "software", "consultant", "consulting"
              </CodeBlock>
          </SubSection>

          <SubSection title="Job Title Filters (for Contact Discovery)" icon={<Users className="w-5 h-5" />}>
            <CodeBlock language="text">
# Primary contacts
Job Title contains any of:
  "Quality Manager",
  "Food Safety Manager",
  "Head of Quality",
  "QA Manager",
  "QC Manager",
  "Production Manager",
  "Plant Manager",
  "voditelj kvalitete",
  "rukovodilac kvaliteta",
  "menadžer kvaliteta",
  "voditelj proizvodnje",
  "rukovodilac proizvodnje",
  "direktor proizvodnje"

# Secondary contacts
Job Title contains any of:
  "Operations Director",
  "Managing Director",
  "Owner",
  "IT Manager",
  "Procurement Manager"

# Verify current responsibilities and employment
            </CodeBlock>
          </SubSection>

          <SubSection title="Quality Signals" icon={<TrendingUp className="w-5 h-5" />}>
            <CodeBlock language="text">
# Certification indicators (structural fit)
Certifications / Keywords contains any of:
  "IFS",
  "BRCGS",
  "FSSC 22000",
  "ISO 22000",
  "HACCP"

# Check scope and recency before referencing
# A certificate is structural fit; a new certification project can be timing signal
            </CodeBlock>
          </SubSection>
        </ContentSection>
      </div>
    );
  }

  function PromptsTab() {
    return (
      <div className="space-y-6">
        <ContentSection title="AI Qualification Prompts" icon={<Code className="w-5 h-5" />}>
          <SubSection title="Qualification Prompt" icon={<Target className="w-5 h-5" />}>
            <CodeBlock language="text">
Analyze this company and determine if they are a good fit for MoreFromFood:

Company: [Company Name]
Industry: [Industry]
Size: [Employee Count]
Location: [Country/City]
Website: [URL]

Qualification Criteria:
1. Manufacturing: Do they have actual food production/processing operations? (not just resale/distribution)
2. Geography: Are they located in Croatia or Serbia?
3. Size: Are they 50-500 employees (primary) or 20-49 with production complexity?
4. Segment: Do they operate in meat processing, dairy, bakery, beverages, prepared meals, or confectionery?
5. Quality function: Is there evidence of quality/food-safety processes or certification?

Research their website for:
- Production facilities and operations
- Product manufacturing details
- Quality certifications (IFS, BRCGS, FSSC 22000, ISO 22000)
- Export markets or retail-chain supply (indicates quality requirements)

Output:
- Fit Score: Strong Fit / Moderate Fit / Weak Fit / Not a Fit
- Reasoning: 2-3 sentences explaining the assessment
- Manufacturing evidence: What confirms they have production operations?
- Recommended persona: Which decision-maker to target first
            </CodeBlock>
          </SubSection>

          <SubSection title="Persona Identification Prompt" icon={<Users className="w-5 h-5" />}>
            <CodeBlock language="text">
Based on this company profile, identify the best decision-maker persona to target:

Company: [Company Name]
Size: [Employee Count]
Manufacturing: [Type - meat, dairy, bakery, etc.]
Sites: [Number of production sites]
Certifications: [Any quality certifications]

Decision-Maker Priorities:
1. PRIMARY - Quality / Food Safety (50-500+ employees with quality function)
   - Head of Quality, Quality Manager, Food Safety Manager
   - Best when: Established quality processes, certifications, multiple compliance requirements

2. PRIMARY - QA / QC (20-500 employees with daily quality checks)
   - QA Manager, Quality Control Manager
   - Best when: Active production lines, recurring quality checks, deviation tracking needs

3. PRIMARY - Production / Plant (50-500+ employees with plant operations)
   - Production Manager, Plant Manager
   - Best when: Multiple shifts, production complexity, operational efficiency focus

4. SECONDARY - Operations / Leadership (smaller manufacturers or budget approval)
   - Operations Director, Managing Director, Owner
   - Best when: Under 100 employees or operational digitalization project

5. SUPPORTING - IT / Procurement (larger groups with centralized decisions)
   - IT Manager, Procurement Manager, Group Quality
   - Best when: 200+ employees, group structure, technical evaluation needed

Recommended target: [Persona]
Reasoning: [Why this persona is the best entry point]
            </CodeBlock>
          </SubSection>

          <SubSection title="Signal Detection Prompt" icon={<TrendingUp className="w-5 h-5" />}>
            <CodeBlock language="text">
Analyze this company for buying signals related to digital quality/HACCP systems:

Company: [Company Name]
Recent news/updates: [Company announcements]
Hiring: [Open positions]
Website changes: [Recent updates]

Tier 1 Signals (Strongest - pursue immediately):
- Active project: Explicit mention of digital HACCP, quality records, or digitalization project
- Defined deadline: New production site, line launch, or facility opening with disclosed timeline
→ Look for: Press releases about expansion, job ads for quality/IT roles mentioning "implementation"

Tier 2 Signals (Moderate - qualified outreach):
- Growth indicators: Capacity expansion, new production lines, increased headcount
- Quality changes: New certification projects, new retail customers, export expansion
- Process investment: Hiring quality/production leaders, announcing digitalization initiatives
→ Look for: Job postings for Quality Manager, production capacity announcements, new partnerships

Tier 3 Signals (Structural fit - standard outreach):
- Manufacturing operations with recurring controls
- Quality ownership and certifications
- Sufficient scale and production complexity
→ Look for: IFS/BRCGS/FSSC certification, multi-site operations, retail/export supply

Output:
- Signal Tier: Tier 1 / Tier 2 / Tier 3 / No signals
- Specific evidence: What indicates timing or need?
- Recommended approach: How to reference this in outreach
            </CodeBlock>
          </SubSection>

          <SubSection title="Outreach Personalization Prompt" icon={<Mail className="w-5 h-5" />}>
            <CodeBlock language="text">
Create personalized outreach for this contact:

Contact: [First Name] [Last Name]
Title: [Job Title]
Company: [Company Name]
Manufacturing: [Type - meat, dairy, bakery, etc.]
Size: [Employee Count]
Location: [City, Country]
Signal: [Any identified buying signal]

Personalization Elements:
1. Specific production activity: Reference their actual products/operations from website
2. Local context: Use appropriate language (Croatian for Croatia, Serbian for Serbia)
3. Role-relevant pain: Match messaging to their persona (quality/production/operations)
4. Timing hook: If signal exists, reference the specific expansion/project/change

Example personalization:
- "I noticed your meat processing operation in Zagreb..."
- "I saw your recent expansion announcement about the new production line..."
- "As Quality Manager at [Company], you likely manage HACCP records for your dairy facility..."

Output:
- Opening line with specific company reference
- Pain point relevant to their role
- CTA: "Would a short walkthrough of how you manage production checks and corrective actions be useful?"
            </CodeBlock>
          </SubSection>
        </ContentSection>
      </div>
    );
  }

  function CampaignsSequencesTab() {
    return (
      <>
        <SequencesTab clientId="morefromfood" />
        <div className="mt-8">
          <CampaignsTabGeneric />
        </div>
      </>
    );
  }
