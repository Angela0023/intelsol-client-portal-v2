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
import DocumentsTabGeneric from '../components/DocumentsTabGeneric';
import { Target, FileText, Filter, Code, Zap, BarChart3, FolderOpen, CheckSquare, TrendingUp } from 'lucide-react';

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

export default function NoticeTheElephantPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [assignee, setAssignee] = useState<Assignee | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('noticetheelephant', DEFAULT_STATUSES.noticetheelephant || 'Active'));
    setAssignee(getStoredAssignee('noticetheelephant', getClientAssignee('noticetheelephant')));

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
    setClientStatus('noticetheelephant', newStatus);
  };
  const handleAssigneeChange = (newAssignee: Assignee) => {
    setAssignee(newAssignee);
    setStoredAssignee('noticetheelephant', newAssignee);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const newPath = tabId === 'overview' ? '/noticetheelephant' : `/noticetheelephant/${tabId}`;
    window.history.pushState({}, '', newPath);
  };

  // Filter tabs based on admin access
  const visibleTabs = isAdmin
    ? tabs
    : tabs.filter(tab => !['filters', 'prompts'].includes(tab.id));

  return (
    <ClientLayout>
      <div className="p-4 lg:p-8">
        {/*Page Header*/}
        <div className="mb-6">
          <div className="flex items-center space-x-2 lg:space-x-3 mb-2">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl lg:text-2xl font-bold text-purple-600">NE</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 lg:space-x-3 flex-wrap">
                <h1 className="text-xl lg:text-3xl font-bold text-slate-900">Notice the Elephant</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
                {isAdmin && <AssigneeBadge assignee={assignee} onAssigneeChange={handleAssigneeChange} size="md" />}
              </div>
              <p className="text-sm lg:text-base text-slate-600 break-words">Full-service marketing agency - Northern Italy</p>
            </div>
          </div>
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
              <PerformanceTabDynamic clientId="noticetheelephant" />
              <CampaignsTabDynamic clientId="noticetheelephant" />
            </>
          )}
          {activeTab === 'documents' && (
            <DocumentsTabGeneric
              clientId="noticetheelephant"
              clientName="Notice the Elephant"
              totalLeads={0}
              totalCampaigns={0}
              accentColor="purple"
            />
          )}
          {activeTab === 'tasks' && (
            <TasksTab clientId="noticetheelephant" defaultTasks={[]} />
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
            Notice the Elephant is a full-service marketing agency combining strategy, digital campaigns, content, websites and conversion optimisation across the customer journey. Based in northern Italy, they help established private companies with measurable growth, stronger digital presence, and clear communication of complex products and research.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Type" value="Full-Service Marketing Agency" />
            <InfoCard label="Location" value="Northern Italy" />
            <InfoCard label="Focus" value="B2B Strategy & Digital" />
            <InfoCard label="Status" value="Active Campaign" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Core Positioning" icon={<TrendingUp className="w-5 h-5" />}>
        <ul className="space-y-2">
          <ListItem type="check">One partner connecting strategy, delivery, website experience, and measurement</ListItem>
          <ListItem type="check">Customer journey optimization across all touchpoints</ListItem>
          <ListItem type="check">Scientific communication expertise (complex subjects to multiple audiences)</ListItem>
          <ListItem type="check">Cross-border experience and remote collaboration capabilities</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Primary Services">
        <ul className="space-y-2">
          <ListItem type="arrow">Marketing strategy and planning</ListItem>
          <ListItem type="arrow">Digital campaign management</ListItem>
          <ListItem type="arrow">Content creation and copywriting</ListItem>
          <ListItem type="arrow">Website design and development</ListItem>
          <ListItem type="arrow">Conversion optimisation</ListItem>
          <ListItem type="arrow">Customer journey mapping</ListItem>
        </ul>
      </ContentSection>

      <ContentSection title="Target Segments">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-semibold text-blue-900 mb-1 text-sm">Automotive & Mobility</h4>
            <p className="text-xs text-blue-800">Vehicle manufacturers, suppliers, aftermarket & mobility tech</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <h4 className="font-semibold text-green-900 mb-1 text-sm">Sports & Ecommerce</h4>
            <p className="text-xs text-green-800">Event organisers, sports brands, sports ecommerce</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <h4 className="font-semibold text-amber-900 mb-1 text-sm">Scientific & R&D</h4>
            <p className="text-xs text-amber-800">Pharma, biotech, medtech, deep tech, research-intensive</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <h4 className="font-semibold text-purple-900 mb-1 text-sm">Website Redesign</h4>
            <p className="text-xs text-purple-800">B2B and ecommerce, EUR 50,000+ projects</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Target Geography">
        <p className="mb-3 text-sm text-slate-700">Primary focus on <strong>northern Italy</strong>, with expansion potential across Europe for:</p>
        <ul className="space-y-2">
          <ListItem type="arrow">International sales and market expansion opportunities</ListItem>
          <ListItem type="arrow">Cross-border ecommerce and marketing needs</ListItem>
          <ListItem type="arrow">European research and pharma collaboration</ListItem>
        </ul>
      </ContentSection>
    </>
  );
}

function ICPAndPersonasTab() {
  return (
    <>
      <ContentSection title="Target Decision Makers" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-2">Tier 1 — Primary Decision Makers</h3>
            <p className="text-sm text-slate-700">Marketing Director, VP Marketing, CMO, Digital Director</p>
            <p className="text-xs text-slate-600 mt-1">Best prospects. Responsible for marketing and digital strategy.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-2">Tier 2 — Budget Influencers</h3>
            <p className="text-sm text-slate-700">CEO, COO, General Management</p>
            <p className="text-xs text-slate-600 mt-1">May approve larger commitments and strategic initiatives.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-2">Tier 3 — Specialist Evaluators</h3>
            <p className="text-sm text-slate-700">IT Director, Scientific/R&D Leads, Ecommerce Manager</p>
            <p className="text-xs text-slate-600 mt-1">Assess specialist requirements for website, tech, or scientific projects.</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Company Size Targets">
        <div className="space-y-3">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-2">CORE: 50+ Employees</h3>
            <p className="text-sm text-slate-700">EUR 2M - EUR 50M+ revenue with dedicated marketing function</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Qualification Framework">
        <div className="space-y-2 text-sm">
          <p><span className="font-semibold text-green-700">YES:</span> Fits target profile, has relevant need, credible budget, passes exclusions</p>
          <p><span className="font-semibold text-red-700">NO:</span> Clear exclusion, unsuitable scope, insufficient budget established</p>
          <p><span className="font-semibold text-amber-700">UNKNOWN:</span> Missing material fact - requires manual review before inclusion</p>
        </div>
      </ContentSection>

      <ContentSection title="Exclusions (Do Not Target)">
        <ul className="space-y-2">
          <ListItem type="cross">Existing clients or active opportunities</ListItem>
          <ListItem type="cross">Competing marketing agencies</ListItem>
          <ListItem type="cross">Early startups without stable revenue</ListItem>
          <ListItem type="cross">Companies with insufficient marketing budgets</ListItem>
          <ListItem type="cross">Clients seeking only low-cost maintenance or individual posts</ListItem>
          <ListItem type="cross">Carglass Italia and direct competitors (automotive glass repair)</ListItem>
          <ListItem type="cross">Companies requiring only frequent on-site social media filming</ListItem>
        </ul>
      </ContentSection>
    </>
  );
}

function FiltersTab() {
  return (
    <ContentSection title="Clay Filter Prompts" icon={<Filter className="w-5 h-5" />}>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-900">
          <strong>20 Clay filter search prompts</strong> are available in the Documents tab under <code className="bg-white px-2 py-1 rounded">notice-the-elephant-clay-filters.csv</code>
        </p>
      </div>

      <p className="text-sm text-slate-700 mb-4">
        Filters are organized by segment and sub-segment:
      </p>

      <ul className="space-y-2 text-sm">
        <ListItem type="arrow"><span className="font-semibold">Automotive (4 filters):</span> Marketing leaders, digital, purchasing/supply, broad CEE</ListItem>
        <ListItem type="arrow"><span className="font-semibold">Sports/Ecommerce (3 filters):</span> Event directors, ecommerce, broader sports/fitness</ListItem>
        <ListItem type="arrow"><span className="font-semibold">Pharma (2 filters):</span> Pharma marketing, product management</ListItem>
        <ListItem type="arrow"><span className="font-semibold">Biotech/Medtech (2 filters):</span> Biotech marketing, medtech marketing</ListItem>
        <ListItem type="arrow"><span className="font-semibold">Deep Tech (1 filter):</span> Engineering and research-intensive</ListItem>
        <ListItem type="arrow"><span className="font-semibold">Website Redesign (3 filters):</span> B2B, ecommerce, multi-language</ListItem>
        <ListItem type="arrow"><span className="font-semibold">Budget Authority (2 filters):</span> C-level prospects, broad exploration</ListItem>
        <ListItem type="arrow"><span className="font-semibold">LinkedIn Search (2 alternative filters):</span> Automotive and pharma on Sales Navigator</ListItem>
      </ul>

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-900">
          <strong>Import to Clay:</strong> Download the CSV and upload to Clay. Filters are ready for search execution with expected volumes per filter.
        </p>
      </div>
    </ContentSection>
  );
}

function PromptsTab() {
  return (
    <ContentSection title="AI Prompts for Qualification & Outreach" icon={<Code className="w-5 h-5" />}>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-900">
          AI prompts and qualification guidelines are included in <code className="bg-white px-2 py-1 rounded">ICP-SUMMARY.md</code> in the Documents tab.
        </p>
      </div>

      <p className="text-sm text-slate-700 mb-4">
        Key sections include:
      </p>

      <ul className="space-y-2 text-sm">
        <ListItem type="arrow">Qualification framework (YES/NO/UNKNOWN decisions)</ListItem>
        <ListItem type="arrow">Buying signals and conversation hypotheses</ListItem>
        <ListItem type="arrow">Tone guidelines (professional, consultative Italian)</ListItem>
        <ListItem type="arrow">Copy standards and what to avoid</ListItem>
        <ListItem type="arrow">Technology assessment guidelines (supporting context only)</ListItem>
      </ul>

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-900">
          <strong>Prompt approach:</strong> Use verified observations, one clear CTA, consultative tone. Primary CTA is a 20-minute introductory conversation.
        </p>
      </div>
    </ContentSection>
  );
}

function CampaignsSequencesTab() {
  return (
    <SequencesTab clientId="noticetheelephant" />
  );
}
