'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Users, Filter, Brain, BarChart3, TrendingUp, FolderOpen, CheckSquare, Mail } from 'lucide-react';
import { ContentSection, InfoCard, ListItem } from '../components/ContentSection';
import DocumentsTabGeneric from '../components/DocumentsTabGeneric';
import TasksTab from '../components/TasksTab';
import SequencesTab from '../components/SequencesTab';
import CampaignsTabGeneric from '../components/CampaignsTabGeneric';
import PerformanceTabDynamic from '../components/PerformanceTabDynamic';
import CampaignsTabDynamic from '../components/CampaignsTabDynamic';

export default function BirografikaPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const access = sessionStorage.getItem('clientAccess');
    let userIsAdmin = false;
    if (access) {
      try {
        const parsedAccess = JSON.parse(access);
        userIsAdmin = parsedAccess.includes('admin');
      } catch (e) {
        // If parsing fails, assume not admin
      }
    }
    setIsAdmin(userIsAdmin);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'icp', label: 'ICP Profile', icon: Users },
    { id: 'filters', label: 'Clay Filters', icon: Filter },
    { id: 'prompts', label: 'AI Prompts', icon: Brain },
    { id: 'campaigns-sequences', label: 'Campaigns & Sequences', icon: Mail },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'documents', label: 'Documents', icon: FolderOpen },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  ];

  // Filter tabs for non-admin users (hide internal tabs)
  const internalTabs = ['filters', 'prompts'];
  const visibleTabs = isAdmin
    ? tabs
    : tabs.filter(tab => !internalTabs.includes(tab.id));

  function OverviewTab() {
    return (
      <ContentSection title="Company Overview" icon={<FileText className="w-5 h-5" />}>
        <div className="space-y-4">
          <InfoCard label="Company Name" value="Birografika MB" />
          <InfoCard label="Industry" value="Label & Print Production" />
          <InfoCard label="Location" value="Subotica, Serbia" />
          <InfoCard label="Website" value={
            <a href="https://birografika.rs" target="_blank" rel="noopener noreferrer" className="text-lime-600 hover:underline">
              https://birografika.rs
            </a>
          } />

          <div className="bg-lime-50 p-4 rounded-lg border border-lime-200">
            <h3 className="font-semibold text-lime-900 mb-2">Primary Services</h3>
            <ul className="space-y-1 text-sm text-slate-700">
              <ListItem>Flexo printing (UV Flexo, Mark Andy equipment)</ListItem>
              <ListItem>Offset printing (large-run capability)</ListItem>
              <ListItem>Digital printing</ListItem>
              <ListItem>Specialized in recurring industrial labels</ListItem>
            </ul>
          </div>

          <div className="bg-lime-50 p-4 rounded-lg border border-lime-200">
            <h3 className="font-semibold text-lime-900 mb-2">Equipment & Capabilities</h3>
            <ul className="space-y-1 text-sm text-slate-700">
              <ListItem>UV Flexo production</ListItem>
              <ListItem>MPS EFC 430 (8 units, cold foil, lamination)</ListItem>
              <ListItem>Grafotronic SCF 350</ListItem>
              <ListItem>Rotoflex automatic label cutting</ListItem>
              <ListItem>Materials: Paper, OPP/BOPP, PP, PE, duplex/triplex films</ListItem>
              <ListItem>Format: Rolls or sheets for automatic application</ListItem>
            </ul>
          </div>

          <div className="bg-lime-50 p-4 rounded-lg border border-lime-200">
            <h3 className="font-semibold text-lime-900 mb-2">Quality Standards</h3>
            <ul className="space-y-1 text-sm text-slate-700">
              <ListItem>ISO 9001:2015 (Quality Management)</ListItem>
              <ListItem>HACCP (Food Safety)</ListItem>
              <ListItem>ISO 14001:2015 (Environmental Management)</ListItem>
              <ListItem>ISO 45001:2018 (Occupational Health & Safety)</ListItem>
              <ListItem>Note: Policy stated April 2025, current certificates to be confirmed</ListItem>
            </ul>
          </div>

          <div className="bg-lime-50 p-4 rounded-lg border border-lime-200">
            <h3 className="font-semibold text-lime-900 mb-2">Campaign Focus</h3>
            <p className="text-sm text-slate-700 mb-2">
              Target manufacturers with recurring, high-volume label requirements across Central & Eastern Europe.
            </p>
            <p className="text-sm text-slate-700">
              Primary focus: Industrial labels for food & beverage, dairy, edible oils, processed food, confectionery. Secondary: Cosmetics, personal care, household chemicals, automotive fluids.
            </p>
          </div>

          <div className="bg-lime-50 p-4 rounded-lg border border-lime-200">
            <h3 className="font-semibold text-lime-900 mb-2">Public Customer References</h3>
            <ul className="space-y-1 text-sm text-slate-700">
              <ListItem>Neoplanta</ListItem>
              <ListItem>Pionir</ListItem>
              <ListItem>Imlek</ListItem>
              <ListItem>Fruvita</ListItem>
              <ListItem>Premier Aqua</ListItem>
              <ListItem>Tigar Tires</ListItem>
              <ListItem>Nectar</ListItem>
              <ListItem className="text-amber-700 font-medium">Note: Permission to use in outbound to be confirmed</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>
    );
  }

  function ICPAndPersonasTab() {
    return (
      <>
        <ContentSection title="Target Geography" icon={<Users className="w-5 h-5" />}>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">NEARBY TESTS: Slovenia, Croatia, Hungary</h3>
              <p className="text-sm text-slate-700">
                Build separate country cohorts to validate segment fit and response. Do not treat proximity as evidence of existing exports.
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-bold text-green-900 mb-2">STRATEGIC SCALE: Austria & Germany</h3>
              <p className="text-sm text-slate-700">
                Build alongside nearby tests. Important larger opportunity. Start with accessible regional plants and purchasing teams.
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-bold text-purple-900 mb-2">EXPANSION: Czechia, Slovakia, Romania</h3>
              <p className="text-sm text-slate-700">
                Expand after reviewing qualified conversations and technical fit from initial waves.
              </p>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="font-bold text-amber-900 mb-2">DACH EXTENSION: Switzerland</h3>
              <p className="text-sm text-slate-700">
                Separate later cohort. Confirm commercial and fulfillment requirements. Austria and Germany remain initial DACH focus.
              </p>
            </div>

            <div className="bg-slate-100 p-4 rounded-lg border border-slate-300 mt-4">
              <p className="text-sm text-slate-700">
                <strong>Location Targeting:</strong> Use manufacturing-site country and purchasing location as well as headquarters. A group with local plants may buy centrally - resolve actual buying entity before adding contacts.
              </p>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Company Size & Sweet Spot" icon={<BarChart3 className="w-5 h-5" />}>
          <div className="space-y-3">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-bold text-green-900 mb-2">CORE SWEET SPOT: 50-500 Employees</h3>
              <p className="text-sm text-slate-700">
                EUR 10M-150M annual company revenue as soft discovery filter only. Operational sweet spot: manufacturer with repeat production, multiple labelled products/pack sizes, retail/distributor demand, identifiable packaging purchasing owner.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">SELECTIVE SMALL: 20-49 Employees</h3>
              <p className="text-sm text-slate-700">
                EUR 3M-10M indicative range. Include only with credible recurring production and label use evidence.
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-bold text-purple-900 mb-2">SELECTIVE LARGE: 501-2,000+ Employees</h3>
              <p className="text-sm text-slate-700">
                EUR 150M-500M+ indicative range. Qualify plant autonomy and supplier onboarding process. Many SKUs alone do not prove high volume - record repeat-demand evidence separately.
              </p>
            </div>

            <div className="bg-slate-100 p-4 rounded-lg border border-slate-300">
              <p className="text-sm text-slate-700">
                <strong>Important:</strong> Unknown revenue does not disqualify an account. Direct label-demand evidence outweighs size. Minimum annual label spend, order volume and MOQ remain to be confirmed with client.
              </p>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Primary Industries (A1-A3 Priority)" icon={<Filter className="w-5 h-5" />}>
          <div className="space-y-3">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">A1: Bottled Water, Juices & Other Beverages</h3>
              <p className="text-sm text-slate-700">
                <strong>Include When:</strong> Own bottling or controlled contract production. Repeat labelled bottles across formats.
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-bold text-green-900 mb-2">A2: Dairy & Edible Oils</h3>
              <p className="text-sm text-slate-700">
                <strong>Include When:</strong> Recurring labelled bottles, tubs or other packs. Verify actual label format.
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-bold text-purple-900 mb-2">A3: Processed Food & Confectionery</h3>
              <p className="text-sm text-slate-700">
                <strong>Include When:</strong> Multiple labelled retail products and repeat production. Screen out ranges using only unrelated packaging.
              </p>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Additional Target Segments" icon={<Filter className="w-5 h-5" />}>
          <ul className="space-y-2">
            <ListItem><strong>Cosmetics & Personal Care:</strong> Repeat product-label use, relevant material needs</ListItem>
            <ListItem><strong>Household Cleaners & Chemicals:</strong> Recurring labelled products</ListItem>
            <ListItem><strong>Automotive Fluids, Lubricants & Industrial Products:</strong> Label requirements confirmed</ListItem>
            <ListItem><strong>Wine & Spirits:</strong> When repeat volumes justify production route</ListItem>
            <ListItem><strong>Pharma & Supplements:</strong> Conditional until application, documentation and technical requirements confirmed</ListItem>
            <ListItem><strong>Secondary Offer:</strong> Recurring offset/digital/commercial print for relevant manufacturers (track separately from core label list)</ListItem>
          </ul>
        </ContentSection>

        <ContentSection title="Business Models & Fit" icon={<CheckSquare className="w-5 h-5" />}>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">INCLUDE</h3>
              <ul className="space-y-1 text-sm text-slate-700">
                <ListItem>Own-brand manufacturers with label purchasing control</ListItem>
                <ListItem>Private-label producers controlling packaging</ListItem>
                <ListItem>Contract manufacturers & co-packers controlling label sourcing</ListItem>
                <ListItem>Multi-SKU portfolios with regular replenishment</ListItem>
                <ListItem>Retail/distributor channels present</ListItem>
                <ListItem>Brand owners who specify/procure labels (otherwise map the co-packer)</ListItem>
              </ul>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-900 mb-2">EXCLUDE FROM PRIMARY LIST</h3>
              <ul className="space-y-1 text-sm text-slate-700">
                <ListItem>Printing companies and label converters (competitors)</ListItem>
                <ListItem>Print brokers and agencies</ListItem>
                <ListItem>Pure resellers/distributors without packaging control</ListItem>
                <ListItem>Services-only businesses</ListItem>
                <ListItem>Pre-launch brands without repeat demand</ListItem>
                <ListItem>One-off promotional print buyers</ListItem>
                <ListItem>Existing customers, deals or partners on exclusion list</ListItem>
                <ListItem>Carton-only, rigid-packaging-only or unsupported technical applications</ListItem>
              </ul>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="font-semibold text-amber-900 mb-2">HOLD FOR REVIEW</h3>
              <ul className="space-y-1 text-sm text-slate-700">
                <ListItem>Packaging format unclear</ListItem>
                <ListItem>Procurement controlled elsewhere</ListItem>
                <ListItem>Unverified volume</ListItem>
                <ListItem>Specialized requirements not yet qualified</ListItem>
                <ListItem>Do not exclude solely because revenue unavailable</ListItem>
              </ul>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Buyer Personas (6 Tiers)" icon={<Users className="w-5 h-5" />}>
          <div className="space-y-3">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-blue-900">PRIMARY: Procurement / Purchasing</h3>
                <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs font-semibold rounded">PRIMARY</span>
              </div>
              <div className="space-y-2 text-slate-700">
                <p><strong>Typical Titles:</strong> Head of Procurement, Procurement Manager, Purchasing Manager, Strategic Buyer, Packaging Buyer</p>
                <p><strong>Local Titles:</strong> Einkauf, Strategischer Einkäufer, Verpackungsmanager, vodja nabave, nabavnik, beszerzési vezető, beszerző</p>
                <p><strong>When This Applies:</strong> Default entry for repeat contracts, supplier qualification and cost reviews</p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-green-900">PRIMARY CHAMPION: Packaging</h3>
                <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-semibold rounded">PRIMARY</span>
              </div>
              <div className="space-y-2 text-slate-700">
                <p><strong>Typical Titles:</strong> Packaging Manager, Head of Packaging, Packaging Development Manager</p>
                <p><strong>When This Applies:</strong> Specifications, artwork/material changes, trials and label-line compatibility decisions</p>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-purple-900">PRIMARY/CO-BUYER: Supply Chain / Operations / Production</h3>
                <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs font-semibold rounded">PRIMARY</span>
              </div>
              <div className="space-y-2 text-slate-700">
                <p><strong>Typical Titles:</strong> Supply Chain Manager, Operations Director, Production Manager, Plant Manager</p>
                <p><strong>When This Applies:</strong> Capacity, replenishment and line expansion. Establish whether plant controls sourcing.</p>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-amber-900">PRIMARY IN SMALLER FIRMS: Leadership</h3>
                <span className="px-2 py-1 bg-amber-200 text-amber-800 text-xs font-semibold rounded">PRIMARY</span>
              </div>
              <div className="space-y-2 text-slate-700">
                <p><strong>Typical Titles:</strong> CEO, Managing Director, Owner, Founder</p>
                <p><strong>When This Applies:</strong> Use when packaging procurement has no dedicated owner. Confirm who handles specifications.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-slate-900">SECONDARY: Marketing / Product</h3>
                <span className="px-2 py-1 bg-slate-200 text-slate-800 text-xs font-semibold rounded">SECONDARY</span>
              </div>
              <div className="space-y-2 text-slate-700">
                <p><strong>Typical Titles:</strong> Marketing Manager, Brand Manager, Product Manager</p>
                <p><strong>When This Applies:</strong> Rebrand, new SKU or launch champion. Connect with procurement for commercial decisions.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-slate-900">TERTIARY: Quality / Technical</h3>
                <span className="px-2 py-1 bg-slate-200 text-slate-800 text-xs font-semibold rounded">TERTIARY</span>
              </div>
              <div className="space-y-2 text-slate-700">
                <p><strong>Typical Titles:</strong> Quality Manager, QA Manager, Technical Manager</p>
                <p><strong>When This Applies:</strong> Documentation, trials and application approval. Not the default first commercial contact.</p>
              </div>
            </div>

            <div className="bg-slate-100 p-4 rounded-lg border border-slate-300 mt-4">
              <h3 className="font-semibold text-slate-900 mb-2">Contact Strategy by Company Size</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <ListItem><strong>Smaller Manufacturers:</strong> Owner/CEO plus operations</ListItem>
                <ListItem><strong>Mid-Market:</strong> Procurement plus packaging/production</ListItem>
                <ListItem><strong>Larger Groups:</strong> Category buyer plus local plant or packaging specialist. Map central vs local authority.</ListItem>
                <ListItem><strong>Food/Chemicals/Demanding Applications:</strong> Involve quality early</ListItem>
              </ul>
              <p className="text-sm text-slate-700 mt-3">
                <strong>Contact Rule:</strong> Begin with 1-2 relevant contacts per account, then add technical validator if needed. Store buying entity and plant served. Avoid duplicate outreach to subsidiaries controlled by same central buyer.
              </p>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Buying Signals (Tier 1-3 Priority)" icon={<TrendingUp className="w-5 h-5" />}>
          <div className="space-y-3">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-bold text-red-900 mb-2">TIER 1: Active Purchasing Window</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <ListItem><strong>Active Sourcing/Cost Review:</strong> Label/packaging RFQ, supplier qualification, tender, consolidation or cost programme with owner/timetable. Capture scope and deadline.</ListItem>
                <ListItem><strong>Dated Launch/Redesign:</strong> Confirmed new SKU, rebrand or packaging refresh with future/recent rollout date and relevant label format. Ask about supplier qualification.</ListItem>
                <ListItem><strong>New Production/Filling Line:</strong> Confirmed line/site expansion, commissioning date and relevant packaged products. Verify label sourcing affected.</ListItem>
              </ul>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="font-bold text-amber-900 mb-2">TIER 2: Relevant Change Event</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <ListItem><strong>Market/Channel Expansion:</strong> New retailer, distributor or country entry. Evidence pack variants, language versions or production volumes may change.</ListItem>
                <ListItem><strong>Packaging/Procurement Hiring:</strong> Current vacancy naming packaging sourcing, labels, supplier management or production expansion. Generic hiring insufficient.</ListItem>
                <ListItem><strong>Sustainability/Packaging Initiative:</strong> Specific material, recyclability or packaging redesign project. Ask about specifications.</ListItem>
                <ListItem><strong>Undated Launch/Cost Initiative:</strong> Relevant announcement without purchasing window. Research timeline before promoting to Tier 1.</ListItem>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-bold text-green-900 mb-2">TIER 3: Durable Fit Indicators</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <ListItem><strong>Recurring High-Volume Label Use:</strong> Explicit repeat production/volume evidence, or documented proxy (bottling operations + broad retail distribution). Treat inferred volume as inferred.</ListItem>
                <ListItem><strong>Many SKUs & Pack Variants:</strong> Catalogue shows multiple sizes, flavours or brands. Record examples and repeat-demand evidence. Supports fit, not urgency.</ListItem>
              </ul>
            </div>

            <div className="bg-slate-100 p-4 rounded-lg border border-slate-300">
              <p className="text-sm text-slate-700">
                <strong>Signal Freshness:</strong> Prefer events within 90 days or confirmed forthcoming milestone. Review 91-180 day items for continuing relevance. Older/undated events are context unless open project verified. Record source URL, publication/event dates, check date and confidence. Do not count duplicated announcements as separate signals.
              </p>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Exclusion Criteria" icon={<CheckSquare className="w-5 h-5" />}>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-900 mb-3">Do NOT Target</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <ListItem>Printing companies and label converters (apply category exclusion)</ListItem>
              <ListItem>Print brokers and agencies</ListItem>
              <ListItem>Pure resellers/distributors without packaging control</ListItem>
              <ListItem>Services-only businesses</ListItem>
              <ListItem>Pre-launch brands without repeat demand</ListItem>
              <ListItem>One-off promotional print buyers</ListItem>
              <ListItem>Publicly displayed references (provisional exclusions pending client confirmation)</ListItem>
              <ListItem>Named competitors (to be confirmed with client)</ListItem>
            </ul>
            <p className="text-sm text-amber-700 font-medium mt-3">
              NOTE: Named competitor list to be confirmed with Birografika MB
            </p>
          </div>
        </ContentSection>
      </>
    );
  }

  function FiltersTab() {
    return (
      <ContentSection title="Clay Filters Configuration" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-lime-50 p-4 rounded-lg border border-lime-200">
            <h3 className="font-semibold text-lime-900 mb-3">Firmographic Filters</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <ListItem><strong>Countries (Phased):</strong> Wave 1: Slovenia, Croatia, Hungary | Strategic: Austria, Germany | Expansion: Czechia, Slovakia, Romania | Later: Switzerland</ListItem>
              <ListItem><strong>Employee Count:</strong> Sweet spot 50-500 | Selective small 20-49 | Selective large 501-2,000+</ListItem>
              <ListItem><strong>Revenue (Indicative):</strong> Sweet spot EUR 10-150M | Small EUR 3-10M | Large EUR 150-500M+ (unknown revenue allowed if label demand evident)</ListItem>
              <ListItem><strong>Industries (Primary):</strong> Beverage manufacturing, bottled water, juice production, dairy, edible oils, processed food, confectionery</ListItem>
              <ListItem><strong>Industries (Additional):</strong> Cosmetics manufacturing, personal care, household cleaners, chemicals, automotive fluids, lubricants, industrial products, wine/spirits</ListItem>
              <ListItem><strong>Business Model:</strong> Own-brand manufacturers, private-label producers, contract manufacturers, co-packers with packaging control</ListItem>
            </ul>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-900 mb-3">Exclusion Filters</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <ListItem><strong>Industry Exclusions:</strong> Printing companies, label converters, print brokers, agencies, pure resellers/distributors</ListItem>
              <ListItem><strong>Keyword Negative:</strong> -printer -"print shop" -"label converter" -agency (apply as refinement, then inspect manually)</ListItem>
              <ListItem><strong>Business Type:</strong> Services-only, no manufacturing control over packaging</ListItem>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3">Evidence Requirements (Clay Research)</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <ListItem><strong>Product Fit:</strong> Labelled bottles, tubs, jars, cartons - verify actual label use</ListItem>
              <ListItem><strong>Material Evidence:</strong> Paper, OPP/BOPP, PP, PE labels explicitly stated (otherwise mark unknown)</ListItem>
              <ListItem><strong>Application:</strong> Wrap-around, self-adhesive, automatic labeling equipment (when confirmed)</ListItem>
              <ListItem><strong>Repeat Demand:</strong> Multi-SKU portfolios, regular replenishment, retail/distributor channels present</ListItem>
              <ListItem><strong>Volume Proxy:</strong> Own bottling + broad retail distribution, documented high-volume production</ListItem>
            </ul>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-3">Contact Data Requirements</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <ListItem><strong>Target Functions:</strong> Procurement, Purchasing, Packaging, Supply Chain, Operations, Production (primary), CEO/Owner (smaller firms)</ListItem>
              <ListItem><strong>Local Titles:</strong> Search Einkauf, Verpackungsmanager, vodja nabave, beszerzési vezető alongside English titles</ListItem>
              <ListItem><strong>Verification:</strong> Confirm current employment and role scope before adding lead</ListItem>
              <ListItem><strong>Entity Mapping:</strong> Resolve actual buying entity (central vs local plant purchasing), link subsidiaries to parent</ListItem>
            </ul>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h3 className="font-semibold text-amber-900 mb-3">Search Patterns & Keywords</h3>
            <p className="text-sm text-slate-700 mb-2"><strong>Food & Beverage:</strong></p>
            <p className="text-xs text-slate-600 font-mono mb-3">
              ("bottled water" OR "juice manufacturer" OR dairy OR "edible oil") AND (manufacturer OR producer OR bottling) AND [country]
            </p>
            <p className="text-sm text-slate-700 mb-2"><strong>Other Segments:</strong></p>
            <p className="text-xs text-slate-600 font-mono mb-3">
              ("private label cosmetics" OR "detergent manufacturer" OR lubricants) AND (manufacturer OR producer) AND [country]
            </p>
            <p className="text-sm text-slate-700 mb-2"><strong>Local Language Enrichment:</strong></p>
            <ul className="space-y-1 text-xs text-slate-600">
              <ListItem>Slovenia: proizvajalec pijač, mlekarna, jedilno olje, kozmetika, čistila</ListItem>
              <ListItem>Croatia: proizvođač pića, mljekara, jestivo ulje, deterdženti</ListItem>
              <ListItem>Hungary: italgyártó, ásványvíz, tejüzem, kozmetikai gyártó</ListItem>
              <ListItem>Austria/Germany: Getränkehersteller, Mineralwasser, Molkerei, Speiseöl, Kosmetikhersteller</ListItem>
            </ul>
          </div>

          <div className="bg-slate-100 p-4 rounded-lg border border-slate-300">
            <h3 className="font-semibold text-slate-900 mb-3">Routing & Qualification Rules</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <ListItem><strong>P1 Priority:</strong> All gates passed + credible recurring-demand evidence + at least one current Tier 1 event</ListItem>
              <ListItem><strong>P2 Priority:</strong> All gates passed + repeat-demand evidence + Tier 2 or strong Tier 3 fit</ListItem>
              <ListItem><strong>Research Queue:</strong> Missing gate, unclear application, stale event or unknown repeat demand</ListItem>
              <ListItem><strong>Exclude:</strong> Explicit exclusion category or confirmed competitor/existing customer</ListItem>
              <ListItem><strong>Secondary Print:</strong> Separate queue for offset/digital/commercial print opportunities (never promoted to primary labels by print demand alone)</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>
    );
  }

  function PromptsTab() {
    return (
      <ContentSection title="AI Research Prompts" icon={<Brain className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-lime-50 p-4 rounded-lg border border-lime-200">
            <h3 className="font-semibold text-lime-900 mb-2">1. Active Sourcing Event Detection</h3>
            <p className="text-sm text-slate-700 mb-2">
              Search company website, news, LinkedIn for: label/packaging RFQ, supplier qualification, tender, consolidation or cost programme. Capture scope, owner, timetable. Mark as Tier 1 if window confirmed.
            </p>
            <p className="text-xs text-slate-600 font-mono">
              site:[domain] ("label supplier" OR "packaging RFQ" OR "supplier qualification" OR "packaging tender" OR "cost review")
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">2. Product Launch & Packaging Redesign</h3>
            <p className="text-sm text-slate-700 mb-2">
              Find new SKU, rebrand, packaging refresh with rollout date and relevant label format. Ask about supplier qualification for rollout. Mark Tier 1 if dated, Tier 2 if undated.
            </p>
            <p className="text-xs text-slate-600 font-mono">
              site:[domain] ("new product" OR "product launch" OR rebrand OR "packaging redesign" OR "new look")
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">3. Production Line Expansion</h3>
            <p className="text-sm text-slate-700 mb-2">
              Search for new filling line, bottling line, production expansion with commissioning date. Verify label sourcing affected. Mark as Tier 1 if confirmed and relevant.
            </p>
            <p className="text-xs text-slate-600 font-mono">
              site:[domain] ("new line" OR "production expansion" OR "filling line" OR "bottling line" OR "capacity expansion")
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-2">4. Market & Channel Expansion</h3>
            <p className="text-sm text-slate-700 mb-2">
              Find new retailer listing, distributor partnership, export market entry. Evidence that pack variants, language versions or production volumes may change. Mark as Tier 2.
            </p>
            <p className="text-xs text-slate-600 font-mono">
              site:[domain] ("new market" OR "new distributor" OR "retailer listing" OR "export" OR "market entry")
            </p>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h3 className="font-semibold text-amber-900 mb-2">5. Relevant Hiring Signals</h3>
            <p className="text-sm text-slate-700 mb-2">
              Find current vacancy naming packaging sourcing, labels, supplier management or production expansion. Generic hiring insufficient. Mark as Tier 2.
            </p>
            <p className="text-xs text-slate-600 font-mono">
              site:linkedin.com/jobs OR site:[domain]/careers ("packaging" OR "procurement" OR "supply chain" OR "supplier") [company name]
            </p>
          </div>

          <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
            <h3 className="font-semibold text-rose-900 mb-2">6. Sustainability & Packaging Initiative</h3>
            <p className="text-sm text-slate-700 mb-2">
              Find specific material change, recyclability or packaging redesign project. Ask about specifications before proposing solution. Mark as Tier 2.
            </p>
            <p className="text-xs text-slate-600 font-mono">
              site:[domain] ("sustainable packaging" OR recyclable OR "eco-friendly" OR "packaging initiative" OR "reduce plastic")
            </p>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <h3 className="font-semibold text-indigo-900 mb-2">7. Product Portfolio & Repeat Demand Verification</h3>
            <p className="text-sm text-slate-700 mb-2">
              Identify multiple labelled products, pack sizes, SKU variants. Confirm repeat production evidence. Look for bottling operations + broad retail distribution as volume proxy. Mark as Tier 3.
            </p>
            <p className="text-xs text-slate-600 font-mono">
              site:[domain] ("product range" OR "our products" OR portfolio) + check for pack images, formats, SKU variants
            </p>
          </div>

          <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
            <h3 className="font-semibold text-teal-900 mb-2">8. Technical Fit & Label Format Verification</h3>
            <p className="text-sm text-slate-700 mb-2">
              Identify bottle/pack format (wrap-around vs self-adhesive vs sleeve), materials (paper, OPP/BOPP, PP, PE), application process (automatic labeling). Images may be ambiguous - record only explicit statements.
            </p>
            <p className="text-xs text-slate-600 font-mono">
              site:[domain] ("production" OR "manufacturing" OR "our facility") + inspect pack images, technical specs, equipment mentions
            </p>
          </div>

          <div className="bg-slate-100 p-4 rounded-lg border border-slate-300">
            <h3 className="font-semibold text-slate-900 mb-3">Signal Recording Rules</h3>
            <ul className="space-y-1 text-sm text-slate-700">
              <ListItem>Record source URL, publication date, event date, check date, confidence level</ListItem>
              <ListItem>One record per distinct event - do not count duplicated announcements separately</ListItem>
              <ListItem>Preserve Confirmed vs Inferred vs Unknown labels for all assertions</ListItem>
              <ListItem>Signal freshness: prefer &lt;90 days or confirmed forthcoming milestone</ListItem>
              <ListItem>Review 91-180 day items for continuing relevance before using</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Birografika MB</h1>
            <a
              href="https://birografika.rs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-lime-600 hover:underline inline-block"
            >
              Visit Website →
            </a>
          </div>
          <p className="text-slate-600">Label & Print Production - Subotica, Serbia</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-x-auto">
          <div className="flex border-b border-slate-200 min-w-max">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-lime-600 border-b-2 border-lime-600 bg-lime-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
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
              <PerformanceTabDynamic clientId="birografika" />
              <CampaignsTabDynamic clientId="birografika" />
            </>
          )}
          {activeTab === 'documents' && <DocumentsTabGeneric clientId="birografika" />}
          {activeTab === 'tasks' && <TasksTab clientId="birografika" />}
        </div>
      </div>
    </div>
  );
}
