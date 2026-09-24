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

export default function BMEventsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Onboarding');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('bmevents', DEFAULT_STATUSES.bmevents));

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
    setClientStatus('bmevents', newStatus);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const newPath = tabId === 'overview' ? '/bmevents' : `/bmevents/${tabId}`;
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
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl lg:text-2xl font-bold text-sky-600">BE</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 lg:space-x-3 flex-wrap">
                <h1 className="text-xl lg:text-3xl font-bold text-slate-900">BM Events</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
              </div>
              <p className="text-sm lg:text-base text-slate-600 break-words">Promoter Support for Events, Trade Fairs & Brand Activations - Slovenia</p>
            </div>
          </div>
          <a
            href="https://bmevents.si"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-sky-600 hover:underline inline-block"
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
              <PerformanceTabDynamic clientId="bmevents" />
              <CampaignsTabDynamic clientId="bmevents" />
            </>
          )}
          {activeTab === 'documents' && (
            <DocumentsTabGeneric
              clientId="bmevents"
              clientName="BM Events"
              totalLeads={0}
              totalCampaigns={0}
              accentColor="sky"
            />
          )}
          {activeTab === 'tasks' && (
            <TasksTab clientId="bmevents" defaultTasks={[]} />
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
            BM Events offers promoter support for promotional events, trade fairs and brand activations in Slovenia. They provide professional, communicative people who engage attendees, explain offers, and direct visitors to appropriate contacts.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Service" value="Promoter Support & Field Marketing" />
            <InfoCard label="Target Market" value="Slovenia" />
            <InfoCard label="Website" value={
              <a href="https://bmevents.si" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
                https://bmevents.si
              </a>
            } />
            <InfoCard label="Primary Service" value="Promotional Events, Trade Fairs, Brand Activations" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="What BM Events Offers" icon={<TrendingUp className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="check">Professional promoter support for face-to-face product promotions</ListItem>
          <ListItem type="check">Trade fair booth staff and visitor engagement</ListItem>
          <ListItem type="check">Brand activation support for in-store and outdoor events</ListItem>
          <ListItem type="check">Communicative, trained people who learn client offers</ListItem>
          <ListItem type="check">Direction of interested visitors to appropriate sales contacts</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Public Customer Reference">
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
          <p className="font-semibold text-sky-900 mb-2">Marles hiše</p>
          <p className="text-sm text-sky-800">
            "The team learned our offer, communicated with visitors, and directed them to appropriate contacts."
            <br />
            <span className="text-xs text-sky-700 mt-1 inline-block">- Nika Bratković, Marles hiše</span>
          </p>
        </div>
      </ContentSection>

      <ContentSection title="Value Proposition">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <p className="text-slate-900">
            Professional promoter support that helps companies in Slovenia engage people face-to-face and connect visitors with the right product information or sales contact. The intended benefit is more attention for the activation while the client team focuses on its core responsibilities.
          </p>
        </div>
      </ContentSection>
    </>
  );
}

function ICPAndPersonasTab() {
  return (
    <>
      <ContentSection title="Target Geography" icon={<Target className="w-5 h-5" />}>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Slovenia Only</h3>
          <p className="text-sm text-blue-800">
            Target Slovenian companies and local subsidiaries/distributors with authority and budget for promotional activity in Slovenia. Search nationally and tag the activation location separately from company headquarters.
          </p>
        </div>
      </ContentSection>

      <ContentSection title="Target Company Sizes">
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">A: Consumer Brands and Distributors</h3>
            <p className="text-sm text-green-800">10-500 employees (focus 20-250)</p>
            <p className="text-xs text-green-700 mt-1">Include smaller established distributors when they manage relevant brands and a real activation calendar</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">B: Retailers and Shopping-Centre Operators</h3>
            <p className="text-sm text-blue-800">20-1,000 employees</p>
            <p className="text-xs text-blue-700 mt-1">Prioritize chains, local headquarters or centre-management entities with centralized promotion budgets</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">C: Exhibitors and Demonstration-Led Businesses</h3>
            <p className="text-sm text-purple-800">10-500 employees</p>
            <p className="text-xs text-purple-700 mt-1">Require a named Slovenian fair, open day, showroom promotion or product presentation</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-900 mb-2">D: Marketing, Activation and Event Agencies</h3>
            <p className="text-sm text-amber-800">5-100 employees</p>
            <p className="text-xs text-amber-700 mt-1">Require evidence that they deliver physical client promotions and may source external promoters</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Top Industries">
        <div className="space-y-2">
          <p className="font-semibold text-slate-900">Primary (Consumer Brands/Distributors):</p>
          <ul className="space-y-1">
            <ListItem type="check">Food and non-alcoholic beverage brands/distributors</ListItem>
            <ListItem type="check">Beauty, cosmetics and personal care</ListItem>
            <ListItem type="check">Household and consumer products</ListItem>
          </ul>

          <p className="font-semibold text-slate-900 mt-4">Retail:</p>
          <ul className="space-y-1">
            <ListItem type="arrow">Retail chains and shopping-centre operators</ListItem>
            <ListItem type="arrow">Specialist stores with product promotions</ListItem>
          </ul>

          <p className="font-semibold text-slate-900 mt-4">Secondary Industries:</p>
          <ul className="space-y-1">
            <ListItem type="arrow">Home/building products and furnishings</ListItem>
            <ListItem type="arrow">Automotive/mobility products</ListItem>
            <ListItem type="arrow">Selected B2B exhibitors at trade fairs</ListItem>
            <ListItem type="arrow">Creative, marketing, experiential and event agencies</ListItem>
          </ul>
        </div>
      </ContentSection>

      <ContentSection title="Business Models (Strong Fit)">
        <ul className="space-y-2">
          <ListItem type="check">Brand owners selling through retail</ListItem>
          <ListItem type="check">Importers/distributors with local marketing responsibility</ListItem>
          <ListItem type="check">Retail chains with coordinated campaigns</ListItem>
          <ListItem type="check">Showroom businesses with promotional days</ListItem>
          <ListItem type="check">Exhibitors using face-to-face lead generation</ListItem>
          <ListItem type="check">Agencies delivering activations for multiple clients</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Buyer Personas (5 Tiers)" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">PRIMARY: Marketing / Brand</h3>
            <p className="text-sm text-blue-800 mb-2"><strong>Titles:</strong> Marketing Manager, Brand Manager, Trade Marketing Manager</p>
            <p className="text-sm text-blue-800 mb-2"><strong>When This Applies:</strong> Brands/distributors - campaign owner, brief and budget</p>
            <p className="text-sm text-blue-800"><strong>Slovenian Titles:</strong> Vodja marketinga, Vodja trženja, Vodja blagovne znamke</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">PRIMARY: Retail Marketing</h3>
            <p className="text-sm text-green-800 mb-2"><strong>Titles:</strong> Retail Marketing Manager, Shopping Centre Marketing Manager</p>
            <p className="text-sm text-green-800 mb-2"><strong>When This Applies:</strong> Store and centre promotions - confirm local buying authority</p>
            <p className="text-sm text-green-800"><strong>Slovenian Titles:</strong> Vodja marketinga trgovskega centra</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">PRIMARY: Sales / Business Owner</h3>
            <p className="text-sm text-purple-800 mb-2"><strong>Titles:</strong> Sales Manager, Managing Director, Owner</p>
            <p className="text-sm text-purple-800 mb-2"><strong>When This Applies:</strong> Smaller firms and exhibitors where Sales owns the activity</p>
            <p className="text-sm text-purple-800"><strong>Slovenian Titles:</strong> Vodja prodaje, Direktor</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-900 mb-2">SECONDARY: Agency Delivery</h3>
            <p className="text-sm text-amber-800 mb-2"><strong>Titles:</strong> Account Director, Project Manager, Production Manager</p>
            <p className="text-sm text-amber-800 mb-2"><strong>When This Applies:</strong> Agency client activations and external team coordination</p>
            <p className="text-sm text-amber-800"><strong>Slovenian Titles:</strong> Vodja projektov</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-2">TERTIARY: Procurement / Operations</h3>
            <p className="text-sm text-slate-700 mb-2"><strong>Titles:</strong> Purchasing Manager, Operations Manager</p>
            <p className="text-sm text-slate-700 mb-2"><strong>When This Applies:</strong> Commercial onboarding and delivery support after sponsor is identified</p>
            <p className="text-sm text-slate-700"><strong>Slovenian Titles:</strong> Vodja nabave</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Buying Signals (3 Tiers)">
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">TIER 1 (Strongest)</h3>
            <ul className="space-y-1 text-sm text-green-800">
              <ListItem type="arrow">Explicit promoter requirement - Live brief or sourcing request for promoters at a Slovenian activation</ListItem>
              <ListItem type="arrow">Confirmed upcoming activity - Named fair booking, store opening or launch with on-site visitor engagement</ListItem>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">TIER 2 (Moderate)</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <ListItem type="arrow">Expansion or repeat calendar - New local retail listing, campaign season or repeat exhibition programme</ListItem>
              <ListItem type="arrow">Local campaign responsibility - New trade/brand marketing role or agency activation project</ListItem>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-900 mb-2">TIER 3 (Baseline)</h3>
            <ul className="space-y-1 text-sm text-amber-800">
              <ListItem type="arrow">Structural fit - Multiple retail locations, brand portfolio, previous activations or fair participation</ListItem>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Exclusion Criteria">
        <ul className="space-y-2">
          <ListItem type="cross">Team building, private celebrations, children's/hotel animation</ListItem>
          <ListItem type="cross">Equipment rental, 360° Spot, or full event organization without a separate promoter requirement</ListItem>
          <ListItem type="cross">Digital-only advertising/SEO/social-media needs</ListItem>
          <ListItem type="cross">Printing or promotional merchandise enquiries without on-site staffing</ListItem>
          <ListItem type="cross">Job seekers, recruitment requests for permanent staff</ListItem>
          <ListItem type="cross">Direct competing promoter-staffing providers</ListItem>
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
          Use Clay's company search and enrichment to target brands, retailers, exhibitors and agencies in Slovenia with promotional activity needs.
        </p>
      </ContentSection>

      <ContentSection title="Firmographic Filters">
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-slate-900 mb-1">Location</p>
            <p className="text-sm text-slate-700">Slovenia only - search nationally, tag activation location separately</p>
          </div>

          <div>
            <p className="font-semibold text-slate-900 mb-1">Employee Count</p>
            <p className="text-sm text-slate-700">
              A: 10-500 (focus 20-250) | B: 20-1,000 | C: 10-500 | D: 5-100
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-900 mb-1">Revenue (Optional)</p>
            <p className="text-sm text-slate-700">Not a mandatory gate - campaign evidence and local buying authority matter more</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Industry Filters">
        <div className="space-y-2">
          <p className="font-semibold text-slate-900">A-Tier (Brands/Distributors):</p>
          <ul className="space-y-1">
            <ListItem type="check">Food & non-alcoholic beverages</ListItem>
            <ListItem type="check">Beauty, cosmetics, personal care</ListItem>
            <ListItem type="check">Household & consumer products</ListItem>
          </ul>

          <p className="font-semibold text-slate-900 mt-4">B-Tier (Retail):</p>
          <ul className="space-y-1">
            <ListItem type="arrow">Retail chains & shopping centres</ListItem>
            <ListItem type="arrow">Specialist stores</ListItem>
          </ul>

          <p className="font-semibold text-slate-900 mt-4">C/D-Tier (Other):</p>
          <ul className="space-y-1">
            <ListItem type="arrow">Home/building products</ListItem>
            <ListItem type="arrow">Automotive/mobility</ListItem>
            <ListItem type="arrow">Marketing/event agencies</ListItem>
          </ul>
        </div>
      </ContentSection>

      <ContentSection title="Evidence Requirements (Enrichment)">
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-slate-900 mb-1">Activation Evidence</p>
            <p className="text-sm text-slate-700">Website mentions exhibitions, product launches, store openings, brand activations, promotional events</p>
          </div>

          <div>
            <p className="font-semibold text-slate-900 mb-1">Face-to-Face Engagement</p>
            <p className="text-sm text-slate-700">Evidence of product demonstrations, tastings, sampling, visitor engagement at events</p>
          </div>

          <div>
            <p className="font-semibold text-slate-900 mb-1">Local Decision Authority</p>
            <p className="text-sm text-slate-700">Slovenian office with marketing/sales/event budget authority</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Contact Data Requirements">
        <ul className="space-y-2">
          <ListItem type="check">Valid work email (company domain)</ListItem>
          <ListItem type="check">LinkedIn profile (for role verification)</ListItem>
          <ListItem type="check">Job title matching one of 5 buyer personas</ListItem>
          <ListItem type="check">Based in Slovenia or responsible for Slovenian market</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Search Patterns (Clay Enrichment)">
        <div className="space-y-2">
          <p className="text-sm text-slate-700">Use Apollo, LinkedIn Sales Navigator, or website scraping enrichments:</p>
          <CodeBlock>
            Title contains: "Marketing" OR "Brand" OR "Trade Marketing" OR "Retail Marketing" OR "Sales" OR "Director" OR "Owner" OR "Project"
          </CodeBlock>
          <CodeBlock>
            Slovenian titles: "Vodja marketinga" OR "Vodja trženja" OR "Vodja blagovne znamke" OR "Vodja prodaje" OR "Direktor"
          </CodeBlock>
          <CodeBlock>
            Company description contains: "retail" OR "beverage" OR "food" OR "cosmetics" OR "consumer" OR "exhibition" OR "event" OR "agency"
          </CodeBlock>
        </div>
      </ContentSection>

      <ContentSection title="Qualification Routing">
        <ul className="space-y-2">
          <ListItem type="arrow">TIER 1 signals (explicit requirement, upcoming activity) → Priority sequence</ListItem>
          <ListItem type="arrow">TIER 2 signals (expansion, new role) → Standard sequence</ListItem>
          <ListItem type="arrow">TIER 3 baseline (structural fit) → Standard sequence</ListItem>
          <ListItem type="arrow">No signals or unclear campaign → Hold for review</ListItem>
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
          Use these prompts with Claude or ChatGPT to research prospects and identify promotional activity signals.
        </p>
      </ContentSection>

      <ContentSection title="1. Upcoming Promotional Activity Detection">
        <CodeBlock>
          Search company website, LinkedIn, and recent news for evidence of upcoming promotional activities in Slovenia:
          - Trade fair bookings or exhibition participation
          - Product launch announcements with dates
          - Store opening or expansion plans
          - Brand activation or sampling campaigns
          - In-store promotion calendars

          Return: Activity type + date + location + confirmation that staffing is not already arranged
        </CodeBlock>
      </ContentSection>

      <ContentSection title="2. Explicit Promoter Requirement">
        <CodeBlock>
          Search for explicit sourcing requests or staffing needs:
          - Live brief or RFP for promotional staff
          - Job postings for temporary promoters/brand ambassadors
          - Tender announcements for event staffing
          - Agency project requiring external field team

          Return: Brief details + timeline + decision maker + source URL
        </CodeBlock>
      </ContentSection>

      <ContentSection title="3. Retail Campaign Calendar">
        <CodeBlock>
          Search for recurring or seasonal promotional activity:
          - Annual product demonstration schedule
          - Seasonal sampling or tasting programmes
          - Shopping centre campaign calendar
          - Multi-location retail activation plans

          Return: Campaign frequency + locations + typical staffing scope
        </CodeBlock>
      </ContentSection>

      <ContentSection title="4. New Marketing/Sales Role">
        <CodeBlock>
          Search LinkedIn company page and job boards for new hires:
          - Marketing Manager, Brand Manager, Trade Marketing Manager
          - Retail Marketing Manager, Shopping Centre Marketing Manager
          - Sales Manager for companies with promotional activity
          - Agency Account Director or Project Manager

          Return: Role title + start date + responsibilities mentioning activations
        </CodeBlock>
      </ContentSection>

      <ContentSection title="5. Product Portfolio & Activation History">
        <CodeBlock>
          Verify past promotional activity and structural fit:
          - Number of product brands or SKUs
          - Evidence of past trade fair participation (photos, press releases)
          - Previous in-store demonstrations or sampling campaigns
          - Retail network size (multiple locations = recurring need potential)

          Return: Portfolio breadth + activation history + repeat potential
        </CodeBlock>
      </ContentSection>

      <ContentSection title="6. Agency Client List & Project Scope">
        <CodeBlock>
          For marketing/event agencies, verify promoter sourcing needs:
          - Client case studies mentioning activations or field marketing
          - Service offerings including experiential marketing or brand activations
          - Team structure (in-house vs. outsourced field staff)
          - Recent projects requiring on-site promotional support

          Return: Relevant clients + activation types + external staffing evidence
        </CodeBlock>
      </ContentSection>

      <ContentSection title="7. Local Decision Authority Verification">
        <CodeBlock>
          Verify that the Slovenian office has budget authority:
          - Office type (headquarters, regional office, distributor)
          - Marketing/sales team presence in Slovenia
          - Evidence of local campaign execution (not just HQ decisions)
          - Local PR or social media activity about events

          Return: Office autonomy level + local team evidence + budget indicators
        </CodeBlock>
      </ContentSection>

      <ContentSection title="8. Campaign Format & Staffing Fit">
        <CodeBlock>
          Verify the activation type matches BM Events service:
          - Face-to-face visitor engagement requirement
          - Product explanation and demonstration scope
          - Handover process to client sales team
          - Location accessibility within Slovenia

          Return: Campaign format fit + required promoter skills + BM Events capability match
        </CodeBlock>
      </ContentSection>
    </>
  );
}

function CampaignsSequencesTab() {
  return (
    <>
      <SequencesTab clientId="bmevents" />
      <div className="mt-8">
        <CampaignsTabGeneric />
      </div>
    </>
  );
}
