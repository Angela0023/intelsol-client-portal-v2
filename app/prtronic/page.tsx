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

export default function PRTronicPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Onboarding');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Load status from localStorage
    setStatus(getClientStatus('prtronic', DEFAULT_STATUSES.prtronic));

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

    // Internal tabs that should be hidden from non-admin users
    const internalTabs = ['filters', 'prompts'];

    // Read initial tab from URL pathname
    const path = window.location.pathname;
    const tabFromPath = path.split('/').pop();

    // Set active tab if URL specifies one and it's visible to this user
    if (tabFromPath && tabs.some(t => t.id === tabFromPath)) {
      // If it's an internal tab and user is not admin, don't set it
      if (!internalTabs.includes(tabFromPath) || isAdmin) {
        setActiveTab(tabFromPath);
      }
    }
  }, []);

  const handleStatusChange = (newStatus: ClientStatus) => {
    setStatus(newStatus);
    setClientStatus('prtronic', newStatus);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL without page reload
    window.history.pushState({}, '', `/prtronic/${tabId}`);
  };

  // Filter tabs based on admin access
  const internalTabs = ['filters', 'prompts'];
  const visibleTabs = isAdmin
    ? tabs
    : tabs.filter(tab => !internalTabs.includes(tab.id));

  function OverviewTab() {
    return (
      <div className="space-y-6">
        <ContentSection title="Client Overview" icon={FileText}>
          <InfoCard title="Service" icon={Target}>
            PRTronic provides display hardware and integration solutions for equipment manufacturers, system integrators, and professional display projects across Slovenia, Austria, Germany, and Switzerland (DACH region).
          </InfoCard>

          <InfoCard title="Core Offering">
            <ListItem>Open-frame and closed-frame monitors with customization options</ListItem>
            <ListItem>Touch screens and display kits for equipment integration</ListItem>
            <ListItem>Digital signage solutions for professional installations</ListItem>
            <ListItem>High-brightness displays for challenging viewing environments</ListItem>
            <ListItem>TFT/LCD modules with custom mechanical and firmware integration</ListItem>
          </InfoCard>

          <InfoCard title="Target Markets">
            <ListItem>Slovenia (primary market, local presence)</ListItem>
            <ListItem>Austria (DACH - Klagenfurt office presence)</ListItem>
            <ListItem>Germany (DACH - southern Germany priority, then wider coverage)</ListItem>
            <ListItem>Switzerland (DACH - included in expansion)</ListItem>
          </InfoCard>

          <InfoCard title="Primary Segments">
            <div className="space-y-3">
              <div>
                <div className="font-semibold text-gray-900">A: OEMs & Equipment Manufacturers</div>
                <div className="text-sm text-gray-600 mt-1">10-500 employees (sweet spot: 20-250). Self-service equipment, kiosks, terminals, industrial machinery with operator displays.</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">B: AV, Signage & System Integrators</div>
                <div className="text-sm text-gray-600 mt-1">5-250 employees. Digital signage, AV and interactive system integrators specifying displays for client projects.</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">C: Multi-Site Operators</div>
                <div className="text-sm text-gray-600 mt-1">50-2,000 employees. Retail chains, shopping centres, hotel groups, clinic groups with funded signage/information projects.</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">D: Specialized Applications</div>
                <div className="text-sm text-gray-600 mt-1">10-1,000 employees. Gaming-machine manufacturers, transport/parking information integrators, public-information projects.</div>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="Primary Industries">
            <ListItem>Self-service equipment (kiosks, parcel lockers, vending, ticketing/payment terminals)</ListItem>
            <ListItem>Industrial machinery manufacturers integrating operator displays</ListItem>
            <ListItem>Digital signage, AV and interactive-system integrators</ListItem>
            <ListItem>Retail chains, shopping centres, hotel groups, private clinic groups (multi-site operators)</ListItem>
            <ListItem>Gaming-machine OEMs and specialist integrators</ListItem>
            <ListItem>Parking, transport and public-information projects</ListItem>
          </InfoCard>
        </ContentSection>

        <ContentSection title="Value Proposition">
          <InfoCard title="Core Positioning">
            <p className="text-gray-700">
              <strong>Display solutions matched to your equipment or installation requirements.</strong>
            </p>
            <div className="mt-3 space-y-2">
              <div><strong>OEM Angle:</strong> Assess form factor, touch and integration for the next design or replacement.</div>
              <div><strong>Integrator Angle:</strong> Assess a display configuration for the next client project.</div>
              <div><strong>Operator Angle:</strong> Scope an information/signage rollout.</div>
            </div>
          </InfoCard>

          <InfoCard title="Differentiation">
            <ListItem>Application-focused supply and integration partnership (not just commodity screens)</ListItem>
            <ListItem>Open-frame customization and display-kit options for mechanical integration</ListItem>
            <ListItem>Broad signage range with indoor/outdoor and high-brightness solutions</ListItem>
            <ListItem>Published installation examples (clinic LCD/LED, Vrhnika bus station LED, GLS parcel locker)</ListItem>
            <ListItem>Technical specification support (form factor, environment, touch, interfaces, mounting)</ListItem>
          </InfoCard>

          <InfoCard title="Proof Points" variant="amber">
            <ListItem><strong>Clinic Installation:</strong> Indoor LCD + outdoor LED with central content management</ListItem>
            <ListItem><strong>Vrhnika Bus Station:</strong> LED passenger-information display installation</ListItem>
            <ListItem><strong>GLS Parcel Locker:</strong> Display application for parcel-locker systems</ListItem>
            <ListItem><strong>Technical Capabilities:</strong> Multiple video/touch interfaces, indoor operation ratings (validate per model)</ListItem>
          </InfoCard>
        </ContentSection>

        <ContentSection title="Exclusions & Bad-Fit Signals">
          <InfoCard title="Explicit Exclusions" variant="red">
            <ListItem>RFID-only and unrelated electronic component enquiries</ListItem>
            <ListItem>Consumer/home-gaming buyers seeking retail products</ListItem>
            <ListItem>Generic commodity-monitor resellers without integration needs</ListItem>
            <ListItem>Software/content-only agencies without hardware procurement role</ListItem>
            <ListItem>Firms without a confirmed display use case</ListItem>
            <ListItem>Existing customers, active deals, or protected partners (obtain exclusion lists)</ListItem>
          </InfoCard>

          <InfoCard title="Requires Manual Review">
            <ListItem>Complete-system requests beyond confirmed display scope</ListItem>
            <ListItem>Medical diagnostic or safety-critical display applications</ListItem>
            <ListItem>Hazardous-area use cases</ListItem>
            <ListItem>Military/aerospace applications</ListItem>
            <ListItem>Harsh-environment requirements beyond standard ratings</ListItem>
            <ListItem>Regulated gaming deployments requiring specific approvals</ListItem>
          </InfoCard>
        </ContentSection>
      </div>
    );
  }

  function ICPAndPersonasTab() {
    return (
      <div className="space-y-6">
        <ContentSection title="ICP Criteria">
          <InfoCard title="Geography">
            <ListItem><strong>Slovenia:</strong> Primary market (local presence confirmed)</ListItem>
            <ListItem><strong>Austria:</strong> DACH region (Klagenfurt office listed on website)</ListItem>
            <ListItem><strong>Germany:</strong> DACH region (priority: southern Germany, then wider coverage)</ListItem>
            <ListItem><strong>Switzerland:</strong> DACH region (included in market expansion)</ListItem>
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
              <strong>Note:</strong> Filter by buying/design entity location. Record installation markets separately. Confirm service coverage, languages, export terms, and Swiss delivery arrangements with PRTronic.
            </div>
          </InfoCard>

          <InfoCard title="Company Size by Segment">
            <div className="space-y-3">
              <div>
                <div className="font-semibold">A: OEMs & Equipment Manufacturers</div>
                <div className="text-sm text-gray-600">10-500 employees (sweet spot: 20-250). Include smaller established kiosk/terminal specialists with active products. Review larger groups by relevant business unit.</div>
              </div>
              <div>
                <div className="font-semibold">B: AV, Signage & System Integrators</div>
                <div className="text-sm text-gray-600">5-250 employees. Require hardware selection/integration responsibility and relevant project portfolio (not simply IT resale).</div>
              </div>
              <div>
                <div className="font-semibold">C: Multi-Site Operators</div>
                <div className="text-sm text-gray-600">50-2,000 employees (discovery range). Prioritize central procurement and multiple display locations. Smaller groups can qualify with concrete project.</div>
              </div>
              <div>
                <div className="font-semibold">D: Specialized Applications</div>
                <div className="text-sm text-gray-600">10-1,000 employees. Project scope matters more than size. Confirm minimum volumes and viable customer economics with PRTronic.</div>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="Business Models - Strong Fit">
            <ListItem>OEMs embedding displays in repeat-built products</ListItem>
            <ListItem>Integrators delivering repeated hardware projects</ListItem>
            <ListItem>Distributors with genuine technical value and agreed channel fit</ListItem>
            <ListItem>Centrally managed location networks with phased deployments</ListItem>
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
              <strong>Qualification:</strong> Visible product/project + display role + specification/purchasing ownership + credible demand. Pure software companies qualify only if they also specify/procure display hardware.
            </div>
          </InfoCard>
        </ContentSection>

        <ContentSection title="Buyer Personas">
          <div className="space-y-4">
            <InfoCard title="PRIMARY: Engineering / Product" variant="blue">
              <div className="space-y-2">
                <div><strong>Titles:</strong> Technical Director, Hardware Lead, Product Manager, Entwicklungsleiter, Vodja razvoja</div>
                <div><strong>When This Applies:</strong> OEM technical owner responsible for display fit, qualification and integration decisions</div>
                <div><strong>Discovery Focus:</strong> Form factor requirements, touch/interface specifications, environmental conditions, mounting/integration constraints, replacement/redesign triggers</div>
                <div><strong>Value Message:</strong> Assess the display configuration that matches your equipment specifications and integration requirements</div>
              </div>
            </InfoCard>

            <InfoCard title="PRIMARY: Purchasing / Procurement" variant="blue">
              <div className="space-y-2">
                <div><strong>Titles:</strong> Purchasing Manager, Strategic Buyer, Einkaufsleiter, Vodja nabave</div>
                <div><strong>When This Applies:</strong> OEM/integrator supplier selection, pricing and availability owner</div>
                <div><strong>Discovery Focus:</strong> Current supplier relationships, panel EOL/second-source needs, lead times, MOQ requirements, commercial terms</div>
                <div><strong>Value Message:</strong> Review display supply options for consistent availability, competitive pricing and technical support</div>
              </div>
            </InfoCard>

            <InfoCard title="PRIMARY: Integrator Delivery / Project Management" variant="blue">
              <div className="space-y-2">
                <div><strong>Titles:</strong> Technical Director, AV/Signage Project Manager, Projektleiter</div>
                <div><strong>When This Applies:</strong> Specifies hardware for client deployments, manages project delivery</div>
                <div><strong>Discovery Focus:</strong> Client project pipeline, signage/AV installation requirements, display specifications for upcoming projects</div>
                <div><strong>Value Message:</strong> Source the right display configuration for your next client installation with technical specification support</div>
              </div>
            </InfoCard>

            <InfoCard title="SECONDARY: Operator Programme / Rollout Owner" variant="green">
              <div className="space-y-2">
                <div><strong>Titles:</strong> Marketing Manager, IT/AV Manager, Facilities Manager, Rollout Manager</div>
                <div><strong>When This Applies:</strong> Multi-site signage sponsor and technical/deployment stakeholders at operator organizations</div>
                <div><strong>Discovery Focus:</strong> Funded rollout plans, site counts, information/signage objectives, deployment timeline</div>
                <div><strong>Value Message:</strong> Scope a signage/information screen rollout with consistent hardware across your locations</div>
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-sm"><strong>Note:</strong> Contact the person responsible for specific rollout rather than assuming Marketing buys all screens.</div>
              </div>
            </InfoCard>

            <InfoCard title="TERTIARY: Leadership / Final Approval" variant="amber">
              <div className="space-y-2">
                <div><strong>Titles:</strong> CEO, Owner, Managing Director, Geschäftsführer</div>
                <div><strong>When This Applies:</strong> Small firms where CEO/Owner covers technical and commercial decisions, or final approval at larger firms</div>
                <div><strong>Discovery Focus:</strong> Verify direct involvement in display sourcing decisions vs. delegated authority</div>
                <div><strong>Value Message:</strong> (Same as relevant persona above - Engineer/Purchasing/Integrator depending on firm role)</div>
              </div>
            </InfoCard>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="font-semibold text-blue-900 mb-2">Persona Variation by Size/Region</div>
            <div className="text-sm text-gray-700 space-y-2">
              <div><strong>OEMs (A/D):</strong> Engineering/Product owns technical fit; Purchasing owns commercial sourcing. At small firms CEO/Owner may cover both.</div>
              <div><strong>Integrators (B):</strong> Start with Technical/Project leadership and confirm hardware buying responsibility.</div>
              <div><strong>Operators (C):</strong> Marketing/CX sponsors signage; IT/AV and Facilities validate deployment; Procurement manages purchasing.</div>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Buying Signals (3 Tiers)">
          <InfoCard title="TIER 1: Strongest Signals" variant="green">
            <div className="space-y-3">
              <div>
                <div className="font-semibold">Active Display Sourcing</div>
                <div className="text-sm text-gray-600 mt-1"><strong>What to Look For:</strong> RFQ, replacement search, supplier review, or panel end-of-life affecting an identified product. Confirm scope and deadline.</div>
              </div>
              <div>
                <div className="font-semibold">Upcoming Design or Rollout</div>
                <div className="text-sm text-gray-600 mt-1"><strong>What to Look For:</strong> New terminal/machine prototype or funded signage deployment with display selection still open. Save project evidence URL.</div>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="TIER 2: Medium Signals" variant="amber">
            <div className="space-y-3">
              <div>
                <div className="font-semibold">Expansion or Redesign</div>
                <div className="text-sm text-gray-600 mt-1"><strong>What to Look For:</strong> New sites, equipment range, or refurbishment with plausible screen requirements. Verify budget and sourcing ownership.</div>
              </div>
              <div>
                <div className="font-semibold">Relevant Engineering/Project Role Hiring</div>
                <div className="text-sm text-gray-600 mt-1"><strong>What to Look For:</strong> Hiring for kiosk, HMI or signage hardware delivery roles. Note: Hiring alone is not proof of a purchase.</div>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="TIER 3: Structural Fit Signals" variant="blue">
            <div className="space-y-3">
              <div>
                <div className="font-semibold">Installed/Product Fit</div>
                <div className="text-sm text-gray-600 mt-1"><strong>What to Look For:</strong> Existing screen-equipped products, signage project portfolio, or multi-site network. This indicates fit evidence, not urgency.</div>
              </div>
            </div>
          </InfoCard>

          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="font-semibold text-purple-900 mb-2">Discovery Terms (German/Slovenian/English)</div>
            <div className="text-sm text-gray-700 space-y-1">
              <div><strong>German:</strong> Einbaumonitor, Touchdisplay, Kioskhersteller, Selbstbedienungsterminal, Systemintegrator</div>
              <div><strong>Slovenian:</strong> vgradni zaslon, zaslon na dotik, samopostrežni terminal, digitalno prikazovanje</div>
              <div><strong>English:</strong> open-frame monitor, touch display, kiosk manufacturer, self-service terminal, digital signage integrator</div>
              <div className="mt-2 text-amber-700"><strong>Note:</strong> Verify company role manually - search terms alone don't confirm fit.</div>
            </div>
          </div>
        </ContentSection>
      </div>
    );
  }

  function FiltersTab() {
    return (
      <div className="space-y-6">
        <ContentSection title="Clay Table Filters" description="Recommended filters for building targeted prospect lists in Clay">
          <InfoCard title="Geography Filters">
            <ListItem><strong>Country:</strong> Slovenia, Austria, Germany, Switzerland</ListItem>
            <ListItem><strong>Priority Sequencing (Recommended):</strong> Slovenia & Austria → Southern Germany → Wider Germany/Switzerland</ListItem>
            <ListItem><strong>City/Region (Germany):</strong> Focus southern Germany first (Bavaria, Baden-Württemberg regions)</ListItem>
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
              <strong>Important:</strong> Filter by buying/design entity location (HQ or decision-making office), not installation location. Installation markets are recorded separately.
            </div>
          </InfoCard>

          <InfoCard title="Company Size Filters">
            <div className="space-y-2">
              <ListItem><strong>OEMs & Equipment Manufacturers:</strong> 10-500 employees (sweet spot: 20-250)</ListItem>
              <ListItem><strong>AV/Signage/System Integrators:</strong> 5-250 employees</ListItem>
              <ListItem><strong>Multi-Site Operators:</strong> 50-2,000 employees (discovery range)</ListItem>
              <ListItem><strong>Specialized Applications:</strong> 10-1,000 employees</ListItem>
            </div>
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
              <strong>Note:</strong> Unknown headcount is not automatic exclusion. Technical fit, sourcing authority, and repeat/project demand are stronger gates than size alone.
            </div>
          </InfoCard>

          <InfoCard title="Industry Keywords">
            <div className="space-y-3">
              <div>
                <div className="font-semibold">Primary A: Self-Service Equipment</div>
                <div className="text-sm text-gray-600">kiosk, parcel locker, vending, ticketing terminal, payment terminal, self-service</div>
              </div>
              <div>
                <div className="font-semibold">Primary A Extension: Industrial Machinery</div>
                <div className="text-sm text-gray-600">industrial machinery, operator display, HMI, control panel (validate actual display spec)</div>
              </div>
              <div>
                <div className="font-semibold">Primary B: Signage/AV Integrators</div>
                <div className="text-sm text-gray-600">digital signage, AV integration, interactive display, system integrator</div>
              </div>
              <div>
                <div className="font-semibold">Secondary C: Multi-Site Operators</div>
                <div className="text-sm text-gray-600">retail chain, shopping centre, hotel group, clinic group, multi-location</div>
              </div>
              <div>
                <div className="font-semibold">Secondary D: Specialized</div>
                <div className="text-sm text-gray-600">gaming machine, transport display, parking system, public information</div>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="Job Title Filters (Personas)">
            <div className="space-y-2">
              <ListItem><strong>Engineering/Product:</strong> Technical Director, Hardware Lead, Product Manager, Entwicklungsleiter, Vodja razvoja, Tehnični direktor</ListItem>
              <ListItem><strong>Purchasing:</strong> Purchasing Manager, Strategic Buyer, Einkaufsleiter, Vodja nabave</ListItem>
              <ListItem><strong>Integrator Delivery:</strong> Technical Director, AV Manager, Signage Project Manager, Projektleiter, Vodja projektov</ListItem>
              <ListItem><strong>Operator Programme:</strong> Marketing Manager, IT Manager, AV Manager, Facilities Manager, Rollout Manager</ListItem>
              <ListItem><strong>Leadership (Small Firms):</strong> CEO, Owner, Managing Director, Geschäftsführer</ListItem>
            </div>
          </InfoCard>

          <InfoCard title="Exclusion Filters">
            <ListItem><strong>Company Type:</strong> Exclude pure software companies, content agencies, commodity resellers (without integration)</ListItem>
            <ListItem><strong>Product Focus:</strong> Exclude consumer/home gaming, RFID-only, unrelated electronics</ListItem>
            <ListItem><strong>Existing Relationships:</strong> Suppress customer list, active deals, protected partners (obtain lists from PRTronic)</ListItem>
          </InfoCard>
        </ContentSection>
      </div>
    );
  }

  function PromptsTab() {
    return (
      <div className="space-y-6">
        <ContentSection title="Clay AI Research Prompts">
          <InfoCard title="Company Qualification Prompt">
            <CodeBlock language="text">
Research this company and determine:

1. Display Application Role:
   - Do they manufacture equipment that requires displays? (kiosks, terminals, industrial machines, gaming machines)
   - Do they integrate displays for client projects? (AV/signage integrators, system integrators)
   - Do they operate multiple locations with information/signage needs? (retail chains, hotel groups, clinics)

2. Display Sourcing Authority:
   - Who would select/specify display components? (Engineering, Product Management, Technical Director)
   - Who would manage supplier relationships? (Purchasing, Strategic Buyer)
   - For integrators: who manages hardware specification for client projects?
   - For operators: who sponsors signage rollouts?

3. Geographic Fit:
   - Is the company headquartered or operating in Slovenia, Austria, Germany or Switzerland?
   - Where is their design/engineering team located?

4. Buying Signals (if visible):
   - Tier 1: Active RFQ, replacement search, product launch, funded rollout
   - Tier 2: Expansion, redesign, relevant hiring (hardware/project roles)
   - Tier 3: Existing products with displays, signage portfolio, multi-site presence

Return: FIT/NO FIT with reasoning, identified display application, sourcing authority, and any visible buying signals with source URLs.
            </CodeBlock>
          </InfoCard>

          <InfoCard title="Persona Identification Prompt">
            <CodeBlock language="text">
Find the following contacts at [Company Name]:

PRIMARY CONTACTS (OEM/Equipment Manufacturer):
1. Technical/Engineering Owner
   - Titles: Technical Director, Hardware Lead, Product Manager, Entwicklungsleiter, Vodja razvoja
   - Owns: Display fit, qualification, integration decisions

2. Purchasing/Procurement Owner
   - Titles: Purchasing Manager, Strategic Buyer, Einkaufsleiter, Vodja nabave
   - Owns: Supplier selection, pricing, availability

PRIMARY CONTACTS (Integrator/AV):
1. Technical/Project Leadership
   - Titles: Technical Director, AV/Signage Project Manager, Projektleiter
   - Owns: Hardware specification for client projects

SECONDARY CONTACTS (Multi-Site Operator):
1. Programme Sponsor
   - Titles: Marketing Manager, Customer Experience Manager
   - Owns: Signage initiative sponsorship

2. Technical/Deployment Stakeholder
   - Titles: IT Manager, AV Manager, Facilities Manager
   - Owns: Technical validation, deployment feasibility

For each contact return: Name, Title, LinkedIn URL, Email (if available), Department, Confidence Level (High/Medium/Low)

Note: At small firms (under 50 employees), CEO/Owner may cover both technical and commercial roles.
            </CodeBlock>
          </InfoCard>

          <InfoCard title="Buying Signal Detection Prompt">
            <CodeBlock language="text">
Search for recent activity indicating display hardware needs at [Company Name]:

TIER 1 SIGNALS (Strongest):
- Active RFQ or supplier search for displays/screens
- Panel/component end-of-life affecting current product
- New product launch announcement (kiosk, terminal, machine with display)
- Funded signage rollout or site deployment announcement

TIER 2 SIGNALS (Medium):
- New location openings or expansion plans
- Equipment redesign or product range update
- Hiring for: Hardware Engineer, Product Manager, HMI Developer, Signage Project Manager

TIER 3 SIGNALS (Structural Fit):
- Existing products with integrated displays
- Portfolio of signage/AV installation projects
- Multi-site network with information screens

For each signal found, return:
- Signal Type (Tier 1/2/3)
- Description
- Source URL
- Date observed
- Confidence (High/Medium/Low)

Return "NO SIGNALS DETECTED" if nothing found.
            </CodeBlock>
          </InfoCard>

          <InfoCard title="Installation Evidence Prompt">
            <CodeBlock language="text">
Search for evidence of PRTronic's previous work and installations:

Look for:
1. Published case studies or project references
2. Customer testimonials or quotes
3. Installation photos or videos
4. Technical specifications or datasheets
5. Certifications or compliance documentation

Current known projects:
- Indoor LCD + outdoor LED clinic installation with content management
- LED passenger information system at Vrhnika bus station
- GLS parcel locker display application

Return: Any new evidence found with source URLs, project details, customer names (if public), and application types.
            </CodeBlock>
          </InfoCard>
        </ContentSection>

        <ContentSection title="Email Personalization Prompts">
          <InfoCard title="OEM/Equipment Manufacturer Personalization">
            <CodeBlock language="text">
Research [Company Name] and personalize the outreach for a display hardware supplier:

1. Identify their primary products that include displays:
   - Kiosks, terminals, vending machines, gaming machines, industrial equipment
   - Current display specifications visible (size, resolution, touch capability)

2. Find recent product developments:
   - New product launches
   - Product line expansions
   - Equipment redesigns

3. Potential display challenges:
   - Panel EOL mentions
   - Custom form factor requirements
   - Harsh environment needs (outdoor, bright conditions)
   - Touch/interface integration complexity

Return 2-3 sentence personalization referencing their specific equipment and potential display requirement.

Example output: "I noticed [Product Name] kiosk on your website. Given the outdoor installation environment and touch interface requirements, I wanted to check whether you're currently sourcing displays for this product line or planning any updates that might involve display changes."
            </CodeBlock>
          </InfoCard>

          <InfoCard title="Integrator/AV Personalization">
            <CodeBlock language="text">
Research [Company Name] signage/AV integration business:

1. Project Portfolio:
   - Recent installations or case studies
   - Typical client types (retail, corporate, hospitality, public spaces)
   - Display technologies mentioned (LED, LCD, interactive, video walls)

2. Service Scope:
   - Hardware selection responsibility
   - Installation and integration services
   - Content management involvement

3. Recent Activity:
   - New project wins or announcements
   - Client testimonials
   - Geographic expansion

Return 2-3 sentence personalization referencing their project focus and potential hardware sourcing needs.

Example output: "I noticed your recent retail signage installation at [Location/Client]. For integrators working on multi-location retail displays, we provide display hardware that's pre-configured for your typical installation requirements - form factor, brightness, and interface specifications."
            </CodeBlock>
          </InfoCard>

          <InfoCard title="Multi-Site Operator Personalization">
            <CodeBlock language="text">
Research [Company Name] as potential signage rollout customer:

1. Location Network:
   - Number of locations visible
   - Geographic distribution
   - Location types (retail stores, hotels, clinics, offices)

2. Current Signage/Information Systems:
   - Evidence of existing digital displays
   - Information presentation needs (wayfinding, menu boards, information screens)
   - Recent renovations or site updates

3. Expansion or Update Signals:
   - New location openings
   - Renovation announcements
   - Technology upgrade initiatives

Return 2-3 sentence personalization referencing their network and potential rollout opportunity.

Example output: "I noticed your [X] locations across [Region]. For multi-site [retail chains/hotel groups/clinic networks] planning signage rollouts, we help scope display hardware that provides consistent performance across all locations while meeting your specific mounting, content interface and viewing requirements."
            </CodeBlock>
          </InfoCard>
        </ContentSection>
      </div>
    );
  }

  function CampaignsSequencesTab() {
    return (
      <>
        <SequencesTab clientId="prtronic" />
        <div className="mt-8">
          <CampaignsTabGeneric />
        </div>
      </>
    );
  }

  return (
    <ClientLayout>
      <div className="p-4 lg:p-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 lg:space-x-3 mb-2">
            {/* Logo/Avatar */}
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-fuchsia-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl lg:text-2xl font-bold text-fuchsia-600">PT</span>
            </div>

            {/* Title and Status */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">PRTronic</h1>
              <StatusBadge
                status={status}
                onStatusChange={handleStatusChange}
                size="sm"
              />
            </div>
          </div>
          <p className="text-sm lg:text-base text-gray-600 mb-2">Display Hardware & Integration Solutions (DACH)</p>
          <a
            href="https://www.prtronic.at"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-fuchsia-600 hover:underline inline-block"
          >
            Visit Website →
          </a>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
          <nav className="-mb-px flex space-x-4 lg:space-x-8 min-w-max">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  flex items-center space-x-2 py-2 lg:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                  ${
                    activeTab === tab.id
                      ? 'border-fuchsia-500 text-fuchsia-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'icp' && <ICPAndPersonasTab />}
          {activeTab === 'filters' && <FiltersTab />}
          {activeTab === 'prompts' && <PromptsTab />}
          {activeTab === 'campaigns-sequences' && <CampaignsSequencesTab />}
          {activeTab === 'performance' && (
            <>
              <PerformanceTabDynamic clientId="prtronic" />
              <CampaignsTabDynamic clientId="prtronic" />
            </>
          )}
          {activeTab === 'documents' && <DocumentsTabGeneric clientId="prtronic" />}
          {activeTab === 'tasks' && <TasksTab clientId="prtronic" />}
        </div>
      </div>
    </ClientLayout>
  );
}
