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

export default function DHMPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Onboarding');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('dhm', DEFAULT_STATUSES.dhm));

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

  const handleStatusChange = (newStatus: ClientStatus) => {
    setStatus(newStatus);
    setClientStatus('dhm', newStatus);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.history.pushState({}, '', `/dhm/${tabId}`);
  };

  const internalTabs = ['filters', 'prompts'];
  const visibleTabs = isAdmin
    ? tabs
    : tabs.filter(tab => !internalTabs.includes(tab.id));

  function OverviewTab() {
    return (
      <div className="space-y-6">
        <ContentSection title="Client Overview" icon={FileText}>
          <InfoCard title="Service" icon={Target}>
            DHM (Digital HACCP Manager) provides mobile, tablet and computer access to HACCP records, helping smaller food-handling businesses organize everyday food-safety records and responsibilities digitally across Slovenia and Croatia.
          </InfoCard>

          <InfoCard title="Core Offering">
            <ListItem>Digital HACCP recordkeeping (mobile, tablet, computer access)</ListItem>
            <ListItem>PDF reports and corrective action tracking</ListItem>
            <ListItem>Task management and shift planning</ListItem>
            <ListItem>Purchasing and goods receipt documentation</ListItem>
            <ListItem>Optional AI-assisted goods receipt</ListItem>
            <ListItem>Optional IoT temperature monitoring with alerts</ListItem>
          </InfoCard>

          <InfoCard title="Target Markets">
            <ListItem>Slovenia (primary market, confirmed)</ListItem>
            <ListItem>Croatia (confirmed target market)</ListItem>
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
              <strong>Note:</strong> Build separate country lists and messages. Cover both countries nationally, recording actual food-handling site separately from headquarters.
            </div>
          </InfoCard>

          <InfoCard title="Target Segments">
            <div className="space-y-3">
              <div>
                <div className="font-semibold text-gray-900">A: Small Food Producers</div>
                <div className="text-sm text-gray-600 mt-1">5-50 employees, typically one workshop or plant. Active production with recurring checks across storage, preparation or processing.</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">B: Independent Butcher Shops & Small Meat Processors</div>
                <div className="text-sm text-gray-600 mt-1">2-30 employees, typically 1-3 sites. Actual cutting, preparation or processing (not just resale of sealed goods).</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">C: Smaller Independent Hotels/Guesthouses</div>
                <div className="text-sm text-gray-600 mt-1">10-50 total employees, 1-3 properties with their own kitchen. Record kitchen operations separately.</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">D: Small Catering, Central Kitchens, Bakeries/Restaurants</div>
                <div className="text-sm text-gray-600 mt-1">3-30 employees, 1-3 sites. Clear routine-recordkeeping need required.</div>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="Sweet Spot">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="font-semibold text-green-900 mb-2">Initial Sweet Spot</div>
              <ListItem>5-30 employees</ListItem>
              <ListItem>1-3 food-handling sites</ListItem>
              <ListItem>Owner-managed businesses</ListItem>
              <ListItem>Small teams with repeated daily checks</ListItem>
              <ListItem>Accessible responsible manager</ListItem>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <strong>Broader discovery range:</strong> 2-50 employees, 1-5 sites. Revenue is optional enrichment only.
            </div>
          </InfoCard>
        </ContentSection>

        <ContentSection title="Value Proposition">
          <InfoCard title="Core Positioning">
            <p className="text-gray-700 font-semibold mb-3">
              "Digital HACCP records and daily task oversight for smaller food businesses."
            </p>
            <div className="space-y-2">
              <div><strong>Producer/Butcher Angle:</strong> Organize repeated checks and make records easier to find.</div>
              <div><strong>Hotel/Kitchen Angle:</strong> Clarify responsibilities across shifts.</div>
              <div><strong>Owner Angle:</strong> See outstanding work without collecting separate forms.</div>
            </div>
          </InfoCard>

          <InfoCard title="Key Benefits">
            <ListItem>Practical digital workspace for everyday food-safety records</ListItem>
            <ListItem>Assigned tasks with clear ownership</ListItem>
            <ListItem>Clearer view of what has been recorded and what needs follow-up</ListItem>
            <ListItem>Staff adoption focus - a workflow staff will actually use</ListItem>
            <ListItem>Record retrieval and owner oversight improvements</ListItem>
          </InfoCard>

          <InfoCard title="Current Pain Points (Hypotheses to Validate)" variant="amber">
            <ListItem>Routine checks recorded on paper, spreadsheets or scattered messages</ListItem>
            <ListItem>Owner must chase entries and signatures</ListItem>
            <ListItem>Shift handovers make responsibilities unclear</ListItem>
            <ListItem>Records hard to retrieve when needed</ListItem>
            <ListItem>Time spent compiling records for review or audit</ListItem>
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
              <strong>Important:</strong> These are discovery hypotheses. Confirm actual practices with buyer rather than assuming from company size.
            </div>
          </InfoCard>
        </ContentSection>

        <ContentSection title="Exclusions & Bad-Fit Signals">
          <InfoCard title="Explicit Exclusions" variant="red">
            <ListItem>Non-food businesses</ListItem>
            <ListItem>Accommodation-only providers without kitchens</ListItem>
            <ListItem>Food brokers without handling operations</ListItem>
            <ListItem>Sealed-goods resale without relevant workflow</ListItem>
            <ListItem>Hobby/pre-launch operations with too little recurring activity</ListItem>
            <ListItem>Requests solely for HACCP-plan creation, certification or legal advice (unless separately confirmed)</ListItem>
            <ListItem>Cafes/bars merely because website has cafe package (food handling is initial focus)</ListItem>
          </InfoCard>

          <InfoCard title="Requires Verification Before Proposing">
            <ListItem>Specialized batch traceability requirements</ListItem>
            <ListItem>Recall management needs</ListItem>
            <ListItem>Production recipes and formulation management</ListItem>
            <ListItem>Allergen management and label generation</ListItem>
            <ListItem>Laboratory integration requirements</ListItem>
            <ListItem>Full ERP replacement expectations</ListItem>
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
              <strong>Critical:</strong> Do not infer these capabilities from "digital HACCP" description. Verify exact requirements with DHM before proposing solution.
            </div>
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
            <ListItem><strong>Slovenia:</strong> Primary confirmed market</ListItem>
            <ListItem><strong>Croatia:</strong> Confirmed target market</ListItem>
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
              <strong>Market Approach:</strong> Build separate country lists and messages. Prioritize smaller businesses with local owner or operational decision maker. No additional countries in initial campaign.
            </div>
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
              <strong>To Confirm with DHM:</strong> Slovenian language support, local workflow/report adaptation, onboarding availability, Croatian delivery and support terms.
            </div>
          </InfoCard>

          <InfoCard title="Company Size by Segment">
            <div className="space-y-3">
              <div>
                <div className="font-semibold">Initial Sweet Spot: 5-30 employees, 1-3 sites</div>
                <div className="text-sm text-gray-600">Broader discovery range: 2-50 employees, 1-5 sites</div>
              </div>
              <div className="mt-4 space-y-2">
                <div>
                  <div className="font-semibold">A: Small Food Producers</div>
                  <div className="text-sm text-gray-600">5-50 employees, typically one workshop or plant</div>
                </div>
                <div>
                  <div className="font-semibold">B: Butcher Shops & Meat Processors</div>
                  <div className="text-sm text-gray-600">2-30 employees, typically 1-3 sites</div>
                </div>
                <div>
                  <div className="font-semibold">C: Hotels/Guesthouses with Kitchens</div>
                  <div className="text-sm text-gray-600">10-50 total employees, 1-3 properties</div>
                </div>
                <div>
                  <div className="font-semibold">D: Catering/Bakeries/Restaurants</div>
                  <div className="text-sm text-gray-600">3-30 employees, 1-3 sites</div>
                </div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
              <strong>Note:</strong> Revenue is optional enrichment. Unknown headcount is not automatic exclusion. Technical fit, workflow needs and accessible decision maker are stronger gates.
            </div>
          </InfoCard>

          <InfoCard title="Business Models - Strong Fit">
            <ListItem>Owner-managed businesses with own preparation/processing operation</ListItem>
            <ListItem>Small teams (2-50 employees)</ListItem>
            <ListItem>Repeated daily checks and recordkeeping routines</ListItem>
            <ListItem>Accessible responsible manager who can approve change</ListItem>
            <ListItem>Moving from paper or disconnected tools to shared digital workflow</ListItem>
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
              <strong>Discovery Topics:</strong> Cold storage routines, goods receipt processes, cleaning schedules, shift handovers, document retrieval. None proves a control failure - these are fit indicators only.
            </div>
          </InfoCard>

          <InfoCard title="Primary Industries">
            <div className="space-y-2">
              <div>
                <div className="font-semibold">Primary A: Small Food Manufacturing/Processing</div>
                <div className="text-sm text-gray-600">Prepared foods, delicatessen products, bakery/pastry production, small producers with storage and preparation processes</div>
              </div>
              <div>
                <div className="font-semibold">Primary B: Butcher Shops with Food Preparation</div>
                <div className="text-sm text-gray-600">Small meat-processing workshops. Start with owners who oversee daily operations and can approve change without enterprise procurement.</div>
              </div>
              <div>
                <div className="font-semibold">Secondary C: Smaller Hotels/Guesthouses</div>
                <div className="text-sm text-gray-600">Preparing breakfast or meals in-house. Lodging business without kitchen is not priority. Hotel label alone insufficient.</div>
              </div>
              <div>
                <div className="font-semibold">Secondary D: Food Service Operators</div>
                <div className="text-sm text-gray-600">Caterers, small central kitchens, independent restaurants, ready-meal kitchens with repeated daily records</div>
              </div>
            </div>
          </InfoCard>
        </ContentSection>

        <ContentSection title="Buyer Personas">
          <div className="space-y-4">
            <InfoCard title="PRIMARY: Owner / Director" variant="blue">
              <div className="space-y-2">
                <div><strong>Titles:</strong> Owner, Director, Managing Partner, Lastnik, Direktor, Vlasnik</div>
                <div><strong>When This Applies:</strong> Small producer or butcher shop - owns budget and operational priority decisions</div>
                <div><strong>Discovery Focus:</strong> Current recordkeeping method, administrative workload, staff adoption concerns, budget authority</div>
                <div><strong>Value Message:</strong> See outstanding work without collecting separate forms, organize daily checks digitally</div>
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                  <strong>Note:</strong> For very small businesses (under 10 employees), start with Owner/Director. They typically cover both operational and budget decisions.
                </div>
              </div>
            </InfoCard>

            <InfoCard title="PRIMARY: Production / HACCP Manager" variant="blue">
              <div className="space-y-2">
                <div><strong>Titles:</strong> Production Manager, HACCP Responsible Person, Vodja proizvodnje, Odgovorna oseba za HACCP, Voditelj proizvodnje, HACCP odgovorna osoba</div>
                <div><strong>When This Applies:</strong> Owns recurring records, checks and staff routines in production environment</div>
                <div><strong>Discovery Focus:</strong> Daily check routines, shift handover processes, record retrieval challenges, staff device access</div>
                <div><strong>Value Message:</strong> Organize repeated checks, make records easier to find, clarify task ownership across shifts</div>
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                  <strong>Small Plant Approach:</strong> Involve Production Manager or HACCP-responsible person. Do not require formal Quality Manager title at small operations.
                </div>
              </div>
            </InfoCard>

            <InfoCard title="SECONDARY: Hotel / Kitchen Manager" variant="green">
              <div className="space-y-2">
                <div><strong>Titles:</strong> Hotel Manager, Head Chef, F&B Manager, Vodja kuhinje, Voditelj kuhinje</div>
                <div><strong>When This Applies:</strong> Kitchen workflow champion at hotels/guesthouses. Budget owner varies (often general manager/owner).</div>
                <div><strong>Discovery Focus:</strong> Kitchen operation recordkeeping, shift responsibilities, current documentation method</div>
                <div><strong>Value Message:</strong> Clarify responsibilities across shifts, organize kitchen safety records digitally</div>
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-sm">
                  <strong>Hotels Approach:</strong> Owner/general manager may approve spending while chef/F&B manager validates daily use. Ask who owns the records AND who approves software.
                </div>
              </div>
            </InfoCard>

            <InfoCard title="SECONDARY: Quality / Operations Manager" variant="green">
              <div className="space-y-2">
                <div><strong>Titles:</strong> Quality Manager, Operations Manager, Vodja kakovosti, Voditelj kvalitete</div>
                <div><strong>When This Applies:</strong> Where a dedicated quality/operations role exists. Validates process fit.</div>
                <div><strong>Discovery Focus:</strong> Current quality system, recordkeeping processes, compliance workflow, improvement initiatives</div>
                <div><strong>Value Message:</strong> Digital workspace for food-safety records and task oversight, clearer visibility of completed vs. outstanding checks</div>
              </div>
            </InfoCard>

            <InfoCard title="TERTIARY: Daily Users / External Adviser" variant="amber">
              <div className="space-y-2">
                <div><strong>Titles:</strong> Shift Lead, Administrator, External HACCP Adviser</div>
                <div><strong>When This Applies:</strong> Checks usability or alignment with existing HACCP plan. Not automatically the buyer.</div>
                <div><strong>Discovery Focus:</strong> Daily workflow practicality, staff device access, ease of use for team</div>
                <div><strong>Value Message:</strong> Practical digital workflow that staff will actually use</div>
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-sm">
                  <strong>Important:</strong> These roles validate fit but rarely have budget authority. Identify the actual decision maker (usually Owner, Director, or designated Manager).
                </div>
              </div>
            </InfoCard>
          </div>
        </ContentSection>

        <ContentSection title="Buying Signals (3 Tiers)">
          <InfoCard title="TIER 1: Strongest Signals" variant="green">
            <div className="space-y-3">
              <div>
                <div className="font-semibold">Explicit Digitization Need</div>
                <div className="text-sm text-gray-600 mt-1"><strong>What to Look For:</strong> Company asks for digital HACCP/records or confirms problem with current workflow. Record the actual need and owner.</div>
              </div>
              <div>
                <div className="font-semibold">Upcoming Operational Change</div>
                <div className="text-sm text-gray-600 mt-1"><strong>What to Look For:</strong> Confirmed new food production site, kitchen or second location. Check timing, recordkeeping setup and software selection status.</div>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="TIER 2: Medium Signals" variant="amber">
            <div className="space-y-3">
              <div>
                <div className="font-semibold">Growing Operational Complexity</div>
                <div className="text-sm text-gray-600 mt-1"><strong>What to Look For:</strong> Added shift, production line, food range or catering activity. Verify whether it creates recordkeeping needs.</div>
              </div>
              <div>
                <div className="font-semibold">Responsible-Role Change</div>
                <div className="text-sm text-gray-600 mt-1"><strong>What to Look For:</strong> New production/kitchen/quality lead or internal improvement project. Hiring alone does not prove buying intent.</div>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="TIER 3: Structural Fit Signals" variant="blue">
            <div className="space-y-3">
              <div>
                <div className="font-semibold">Structural Fit</div>
                <div className="text-sm text-gray-600 mt-1"><strong>What to Look For:</strong> Small in-house production/preparation site with recurring checks. Paper records are a hypothesis until verified.</div>
              </div>
            </div>
          </InfoCard>

          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="font-semibold text-purple-900 mb-2">Discovery Search Terms</div>
            <div className="text-sm text-gray-700 space-y-1">
              <div><strong>Slovenian:</strong> proizvodnja hrane, predelava hrane, mesnica, mesarija, pripravljene jedi, pekarna, slaščičarna, hotel z restavracijo</div>
              <div><strong>Croatian:</strong> proizvodnja hrane, prerada hrane, mesnica, mesna prerada, gotova jela, pekarnica, slastičarnica, hotel s restoranom, catering</div>
              <div className="mt-2 text-amber-700"><strong>Important:</strong> Directory category alone is insufficient. Verify food activity manually and exclude irrelevant resale/accommodation-only results.</div>
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
            <ListItem><strong>Country:</strong> Slovenia OR Croatia (build separate lists)</ListItem>
            <ListItem><strong>Approach:</strong> Prioritize smaller businesses with local owner or operational decision maker</ListItem>
            <ListItem><strong>Site Recording:</strong> Record actual food-handling site separately from headquarters address</ListItem>
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
              <strong>Important:</strong> Build separate country lists and messages. Cover both countries nationally.
            </div>
          </InfoCard>

          <InfoCard title="Company Size Filters">
            <div className="space-y-2">
              <ListItem><strong>Sweet Spot:</strong> 5-30 employees, 1-3 sites</ListItem>
              <ListItem><strong>Discovery Range:</strong> 2-50 employees, 1-5 sites</ListItem>
              <ListItem><strong>Segment A (Producers):</strong> 5-50 employees, typically 1 site</ListItem>
              <ListItem><strong>Segment B (Butchers):</strong> 2-30 employees, 1-3 sites</ListItem>
              <ListItem><strong>Segment C (Hotels):</strong> 10-50 total employees, 1-3 properties</ListItem>
              <ListItem><strong>Segment D (Catering/Bakeries):</strong> 3-30 employees, 1-3 sites</ListItem>
            </div>
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
              <strong>Note:</strong> Revenue is optional enrichment only. Unknown headcount is not automatic exclusion. Focus on workflow fit and accessible decision maker.
            </div>
          </InfoCard>

          <InfoCard title="Industry Keywords">
            <div className="space-y-3">
              <div>
                <div className="font-semibold">Slovenian Terms</div>
                <div className="text-sm text-gray-600">proizvodnja hrane, predelava hrane, mesnica, mesarija, pripravljene jedi, pekarna, slaščičarna, hotel z restavracijo</div>
              </div>
              <div>
                <div className="font-semibold">Croatian Terms</div>
                <div className="text-sm text-gray-600">proizvodnja hrane, prerada hrane, mesnica, mesna prerada, gotova jela, pekarnica, slastičarnica, hotel s restoranom, catering</div>
              </div>
              <div>
                <div className="font-semibold">English Terms (for international databases)</div>
                <div className="text-sm text-gray-600">food production, food processing, butcher, meat processing, prepared meals, bakery, pastry shop, hotel with restaurant, catering</div>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="Job Title Filters (Personas)">
            <div className="space-y-2">
              <ListItem><strong>Owner/Director:</strong> Owner, Director, Managing Partner, Lastnik, Direktor, Vlasnik</ListItem>
              <ListItem><strong>Production/HACCP:</strong> Production Manager, HACCP Responsible Person, Vodja proizvodnje, Odgovorna oseba za HACCP, Voditelj proizvodnje</ListItem>
              <ListItem><strong>Hotel/Kitchen:</strong> Hotel Manager, Head Chef, F&B Manager, Vodja kuhinje, Voditelj kuhinje</ListItem>
              <ListItem><strong>Quality/Operations:</strong> Quality Manager, Operations Manager, Vodja kakovosti, Voditelj kvalitete</ListItem>
            </div>
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
              <strong>Approach:</strong> For very small businesses, start with Owner/Director. Verify current employment and identify actual role responsibilities.
            </div>
          </InfoCard>

          <InfoCard title="Exclusion Filters">
            <ListItem><strong>Business Type:</strong> Exclude non-food, accommodation-only, food brokers, sealed-goods resale only</ListItem>
            <ListItem><strong>Activity Level:</strong> Exclude hobby/pre-launch operations with too little recurring activity</ListItem>
            <ListItem><strong>Service Requests:</strong> Exclude requests solely for HACCP certification, consulting, legal advice (unless separately confirmed)</ListItem>
            <ListItem><strong>Existing Relationships:</strong> Suppress customer list, active deals, protected partners (obtain lists from DHM)</ListItem>
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

1. Food-Handling Activity:
   - Do they have actual food production, processing or preparation operations?
   - What food products/meals do they make or prepare?
   - Is this manufacturing, butcher shop, hotel kitchen, catering or bakery operation?
   - Do they just resell sealed goods, or do they actually handle/prepare food?

2. Business Size and Structure:
   - Estimated employee count (especially food-handling staff)
   - Number of sites/locations with food operations
   - Owner-managed or corporate structure?
   - Single location or multi-site?

3. Recordkeeping Indicators:
   - Evidence of HACCP system or food safety controls
   - Shift operations (multiple shifts suggest more recordkeeping complexity)
   - Cold storage, goods receipt, cleaning routines visible
   - Any mention of quality systems or certifications

4. Decision-Maker Accessibility:
   - Can you identify owner, director, production manager or HACCP-responsible person?
   - Is there an accessible operational decision maker?
   - Evidence of enterprise procurement layers?

Return: FIT/NO FIT with reasoning, business type, estimated size, food-handling activity description, and any visible recordkeeping indicators with source URLs.
            </CodeBlock>
          </InfoCard>

          <InfoCard title="Persona Identification Prompt">
            <CodeBlock language="text">
Find the following contacts at [Company Name]:

PRIMARY CONTACTS (Small Producers/Butchers):
1. Owner / Director
   - Titles: Owner, Director, Managing Partner, Lastnik, Direktor, Vlasnik
   - Owns: Budget and operational priority decisions

2. Production / HACCP Manager
   - Titles: Production Manager, HACCP Responsible Person, Vodja proizvodnje, Odgovorna oseba za HACCP
   - Owns: Recurring records, checks and staff routines

SECONDARY CONTACTS (Hotels/Larger Operations):
1. Hotel / Kitchen Manager
   - Titles: Hotel Manager, Head Chef, F&B Manager, Vodja kuhinje
   - Owns: Kitchen workflow, may validate solution (check budget owner separately)

2. Quality / Operations Manager
   - Titles: Quality Manager, Operations Manager, Vodja kakovosti
   - Owns: Process validation, quality system oversight

For each contact return: Name, Title, LinkedIn URL, Email (if available), Department, Confidence Level (High/Medium/Low)

Note: For very small businesses (under 10 employees), Owner/Director likely covers all decisions. For hotels, identify both kitchen workflow owner AND budget approver.
            </CodeBlock>
          </InfoCard>

          <InfoCard title="Buying Signal Detection Prompt">
            <CodeBlock language="text">
Search for recent activity indicating digital recordkeeping needs at [Company Name]:

TIER 1 SIGNALS (Strongest):
- Explicit request for digital HACCP or food safety records system
- Problem statement about current recordkeeping workflow
- New food production site, kitchen or location opening announcement
- Expansion requiring new recordkeeping setup

TIER 2 SIGNALS (Medium):
- Added shift, production line or food product range
- New catering activity or service expansion
- Hiring for production manager, kitchen manager, quality lead or HACCP-responsible person
- Internal improvement project or quality system update

TIER 3 SIGNALS (Structural Fit):
- Visible food production/preparation operations
- Multi-shift operations (suggests handover recordkeeping needs)
- Multiple cold storage units or preparation areas
- Evidence of existing HACCP system or food safety controls

For each signal found, return:
- Signal Type (Tier 1/2/3)
- Description
- Source URL
- Date observed
- Confidence (High/Medium/Low)

Return "NO SIGNALS DETECTED" if nothing found. Do not invent signals or assume paper-based records without evidence.
            </CodeBlock>
          </InfoCard>

          <InfoCard title="Workflow Discovery Prompt">
            <CodeBlock language="text">
Research [Company Name] food safety recordkeeping workflow indicators:

Look for evidence of:
1. Temperature monitoring needs (cold storage, cooking, hot-holding)
2. Goods receipt and supplier control processes
3. Cleaning and sanitation schedules
4. Shift handover procedures
5. Internal audit or inspection preparation
6. Current documentation method (paper forms, Excel, digital system)

Also check:
- Number of daily temperature checks implied by operation size
- Shift structure (single shift, multiple shifts, 24/7 operation)
- Staff device access (do workers have smartphones, tablets)
- Any mention of recordkeeping challenges or administrative workload

Return: Observable workflow indicators with source URLs. Do not assume problems without evidence. Frame findings as "suggests recordkeeping complexity" rather than "has unsafe practices."
            </CodeBlock>
          </InfoCard>
        </ContentSection>

        <ContentSection title="Email Personalization Prompts">
          <InfoCard title="Small Producer Personalization">
            <CodeBlock language="text">
Research [Company Name] and personalize outreach for digital HACCP records:

1. Identify their food products:
   - What do they produce/manufacture?
   - Prepared foods, delicatessen, baked goods, other products?
   - Visible production processes (storage, preparation, packaging)?

2. Operational indicators:
   - Single location or multiple sites?
   - Shift structure visible?
   - Team size estimate?

3. Recordkeeping complexity signals:
   - Cold storage requirements
   - Goods receipt processes
   - Multiple production areas or product lines

Return 2-3 sentence personalization referencing their specific food production and potential recordkeeping needs.

Example output: "I noticed you produce [product type] at your [location] facility. For small food producers managing daily temperature checks, goods receipt and cleaning records, we help organize these recurring checks digitally so the team can access records from any device and owners can see what's been completed without collecting paper forms."
            </CodeBlock>
          </InfoCard>

          <InfoCard title="Butcher Shop Personalization">
            <CodeBlock language="text">
Research [Company Name] butcher shop operation:

1. Shop Operations:
   - Number of locations visible?
   - Cutting/preparation area or resale only?
   - Product range (fresh meat, prepared products, deli items)?

2. HACCP Recordkeeping Needs:
   - Cold storage (display cases, walk-in coolers)
   - Preparation/cutting activities
   - Shift structure or operating hours

3. Ownership Structure:
   - Owner-operated or chain?
   - Accessible decision maker visible?

Return 2-3 sentence personalization referencing their operation type and recordkeeping workflow.

Example output: "I noticed your [number] butcher shop locations in [region]. For independent butcher shops managing temperature checks, cleaning schedules and goods receipt across preparation areas, we provide a digital workspace where staff can record checks from any device and owners can see outstanding tasks without collecting forms from each location."
            </CodeBlock>
          </InfoCard>

          <InfoCard title="Hotel Kitchen Personalization">
            <CodeBlock language="text">
Research [Company Name] hotel kitchen operation:

1. Hotel Details:
   - Number of properties/locations?
   - Guest capacity or room count (indicates kitchen size)?
   - Restaurant/F&B services offered?
   - Breakfast only, full restaurant service, or catering?

2. Kitchen Workflow Indicators:
   - In-house kitchen preparation visible?
   - Shift structure (breakfast, lunch, dinner services)?
   - Team size estimate for F&B operations?

3. Management Structure:
   - General manager or owner visible?
   - Head chef or F&B manager identified?
   - Quality or HACCP-responsible person mentioned?

Return 2-3 sentence personalization referencing their kitchen operation and recordkeeping needs.

Example output: "I noticed your [property/properties] hotel with in-house kitchen operations. For hotel kitchens managing daily food safety checks across breakfast and restaurant services, we help clarify task ownership across shifts and give managers a clearer view of completed checks without collecting separate paper forms from each shift."
            </CodeBlock>
          </InfoCard>
        </ContentSection>
      </div>
    );
  }

  function CampaignsSequencesTab() {
    return (
      <>
        <SequencesTab clientId="dhm" />
        <div className="mt-8">
          <CampaignsTabGeneric />
        </div>
      </>
    );
  }

  return (
    <ClientLayout>
      <div className="p-4 lg:p-8">
        <div className="mb-6">
          <div className="flex items-center space-x-2 lg:space-x-3 mb-2">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl lg:text-2xl font-bold text-stone-600">DH</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">DHM</h1>
              <StatusBadge
                status={status}
                onStatusChange={handleStatusChange}
                size="sm"
              />
            </div>
          </div>
          <p className="text-sm lg:text-base text-gray-600 mb-2">Digital HACCP & Food Safety Software (Slovenia/Croatia)</p>
          <a
            href="https://dhm.hr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-stone-600 hover:underline inline-block"
          >
            Visit Website →
          </a>
        </div>

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
                      ? 'border-stone-500 text-stone-600'
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

        <div className="mt-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'icp' && <ICPAndPersonasTab />}
          {activeTab === 'filters' && <FiltersTab />}
          {activeTab === 'prompts' && <PromptsTab />}
          {activeTab === 'campaigns-sequences' && <CampaignsSequencesTab />}
          {activeTab === 'performance' && (
            <>
              <PerformanceTabDynamic clientId="dhm" />
              <CampaignsTabDynamic clientId="dhm" />
            </>
          )}
          {activeTab === 'documents' && <DocumentsTabGeneric clientId="dhm" />}
          {activeTab === 'tasks' && <TasksTab clientId="dhm" />}
        </div>
      </div>
    </ClientLayout>
  );
}
