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
import { Target, Filter, Code, TrendingUp, FileText, CheckSquare, BarChart3, Zap, FolderOpen, Shield, Users } from 'lucide-react';

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

export default function PluritechPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [assignee, setAssignee] = useState<Assignee | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('pluritech', DEFAULT_STATUSES.pluritech));
    setAssignee(getStoredAssignee('pluritech', getClientAssignee('pluritech')));

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

    const internalTabs = ['filters', 'prompts'];

    const path = window.location.pathname;
    const tabFromPath = path.split('/').pop();
    const validTab = tabs.find(t => t.id === tabFromPath);
    if (validTab && (userIsAdmin || !internalTabs.includes(validTab.id))) {
      setActiveTab(validTab.id);
    }

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
    setClientStatus('pluritech', newStatus);
  };

  const handleAssigneeChange = (newAssignee: Assignee) => {
    setAssignee(newAssignee);
    setStoredAssignee('pluritech', newAssignee);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const newPath = tabId === 'overview' ? '/pluritech' : `/pluritech/${tabId}`;
    window.history.pushState({}, '', newPath);
  };

  const visibleTabs = isAdmin
    ? tabs
    : tabs.filter(tab => !['filters', 'prompts'].includes(tab.id));

  return (
    <ClientLayout>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-emerald-600">PR</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-slate-900">Pluritech ReefSecure Angler</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
                {isAdmin && <AssigneeBadge assignee={assignee} onAssigneeChange={handleAssigneeChange} size="md" />}
              </div>
              <p className="text-slate-600">Phishing awareness and employee cybersecurity training for office-based companies in Slovenia and Croatia</p>
            </div>
          </div>
          <a
            href="https://pluritech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-emerald-600 hover:underline"
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
                    ? 'border-[#1a2647] text-[#1a2647] font-medium'
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
          {activeTab === 'icp' && <ICPTab />}
          {activeTab === 'filters' && <FiltersTab />}
          {activeTab === 'prompts' && <PromptsTab />}
          {activeTab === 'campaigns-sequences' && (
            <>
              <SequencesTab clientId="pluritech" />
              <div className="mt-8">
                <CampaignsTabGeneric />
              </div>
            </>
          )}
          {activeTab === 'performance' && (
            <>
              <PerformanceTabDynamic clientId="pluritech" />
              <CampaignsTabDynamic clientId="pluritech" />
            </>
          )}
          {activeTab === 'documents' && <DocumentsTabGeneric clientId="pluritech" />}
          {activeTab === 'tasks' && <TasksTab clientId="pluritech" />}
        </div>
      </div>
    </ClientLayout>
  );
}

function OverviewTab() {
  return (
    <>
      <ContentSection title="Product Overview" icon={<Shield className="w-5 h-5" />}>
        <div className="space-y-4">
          <p>
            ReefSecure Angler is a phishing awareness and employee cybersecurity training solution designed for office-based companies. It helps organizations systematically improve how employees recognize and respond to phishing attacks through structured training and consistent practice.
          </p>
          <p>
            The solution targets small office-based companies in Slovenia and Croatia (20-50 employees) that rely on email and computer use for daily operations. Two distinct campaigns reach different decision-makers with targeted messaging.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 [&>*]:min-w-0">
            <InfoCard label="Solution" value="Phishing Awareness Training" />
            <InfoCard label="Geographic Focus" value="Slovenia & Croatia" />
            <InfoCard label="Company Size" value="20-50 employees" />
            <InfoCard label="Decision Makers" value="CEO/Owner & IT Manager" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Why Companies Buy" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900">Buying Triggers:</h4>
          <ul className="space-y-2">
            <ListItem type="check">Launching an employee training initiative</ListItem>
            <ListItem type="check">Reviewing existing awareness programme</ListItem>
            <ListItem type="check">New IT leadership or team member joins</ListItem>
            <ListItem type="check">Growing office team creating scaling challenges</ListItem>
            <ListItem type="check">Explicit initiative to improve phishing handling</ListItem>
          </ul>

          <h4 className="font-semibold text-slate-900 mt-6 mb-3">Common Problems They Experience:</h4>
          <ul className="space-y-2">
            <ListItem type="check">Employees find deceptive messages difficult to recognize</ListItem>
            <ListItem type="check">Training is occasional or inconsistent</ListItem>
            <ListItem type="check">Ownership of awareness programme is unclear</ListItem>
            <ListItem type="check">Company wants to review current awareness approach</ListItem>
          </ul>
        </div>
      </ContentSection>

      <ContentSection title="Campaign Strategy" icon={<Users className="w-5 h-5" />}>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
            <div>
              <h4 className="font-semibold text-slate-900">CEO/Owner Campaign</h4>
              <p className="text-sm text-slate-600">Business decision-maker and budget approver. Focus: business risk, awareness maturity, company-level security strategy.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
            <div>
              <h4 className="font-semibold text-slate-900">IT Manager Campaign</h4>
              <p className="text-sm text-slate-600">Technical stakeholder. Focus: system integration, implementation feasibility, technical evaluation of solution fit.</p>
            </div>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

function ICPTab() {
  return (
    <>
      <ContentSection title="Target Company Profile" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-4">
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded">
            <p className="font-semibold text-emerald-900 mb-2">Core Fit</p>
            <p className="text-emerald-800">
              Companies in Slovenia or Croatia with 20-50 employees where office work and daily email/computer use predominate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 [&>*]:min-w-0">
            <InfoCard label="Geography" value="Slovenia, Croatia" />
            <InfoCard label="Employee Count" value="20-50" />
            <InfoCard label="Workforce" value="Predominantly office-based" />
            <InfoCard label="Key Activity" value="Daily email & computer use" />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Primary Target Industries" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-2">
          <ListItem type="check">Accounting, bookkeeping, payroll & financial advisory services</ListItem>
          <ListItem type="check">Business consulting & professional office-based services</ListItem>
          <ListItem type="check">Marketing, digital, creative, PR & recruitment agencies</ListItem>
          <ListItem type="check">Insurance brokers & agencies</ListItem>
        </div>
      </ContentSection>

      <ContentSection title="Secondary Industries" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-2">
          <ListItem type="check">Engineering & design consultancies</ListItem>
          <ListItem type="check">Architecture & technical consulting</ListItem>
          <ListItem type="check">Real estate agencies & property administration</ListItem>
          <ListItem type="check">B2B wholesale & distribution (with office-based teams)</ListItem>
        </div>
      </ContentSection>

      <ContentSection title="Red Flags (Disqualifiers)" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-2">
          <ListItem type="cross">Companies outside Slovenia or Croatia</ListItem>
          <ListItem type="cross">Fewer than 20 or more than 50 employees</ListItem>
          <ListItem type="cross">Predominantly non-desk workforce (production, construction, hospitality, field services)</ListItem>
          <ListItem type="cross">Direct competitors providing phishing-awareness solutions</ListItem>
          <ListItem type="cross">Banks, clinics, schools, public institutions</ListItem>
          <ListItem type="cross">Existing customers, active sales opportunities, or protected relationships</ListItem>
        </div>
      </ContentSection>
    </>
  );
}

function FiltersTab() {
  return (
    <ContentSection title="Clay Filter Prompts" icon={<Filter className="w-5 h-5" />}>
      <div className="space-y-4">
        <p>
          14 filters created covering both Slovenia and Croatia across all target industries. Each filter includes an AI-powered ICP Match Prompt for evaluating company fit.
        </p>

        <h4 className="font-semibold text-slate-900 mt-4 mb-3">Primary Filters (TIER 1 - Highest Conversion):</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            'Slovenia - Accounting & Financial',
            'Slovenia - Business Consulting',
            'Slovenia - Marketing & Agencies',
            'Slovenia - Insurance Brokers',
            'Croatia - Accounting & Financial',
            'Croatia - Business Consulting',
            'Croatia - Marketing & Agencies',
            'Croatia - Insurance Brokers',
          ].map((filter) => (
            <div key={filter} className="bg-emerald-100 px-3 py-2 rounded text-sm font-medium">
              {filter}
            </div>
          ))}
        </div>

        <h4 className="font-semibold text-slate-900 mt-4 mb-3">Secondary Filters (TIER 2):</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            'Slovenia - Engineering & Design',
            'Slovenia - Real Estate & Property',
            'Slovenia - B2B Wholesale',
            'Croatia - Engineering & Design',
            'Croatia - Real Estate & Property',
            'Croatia - B2B Wholesale',
          ].map((filter) => (
            <div key={filter} className="bg-slate-100 px-3 py-2 rounded text-sm">
              {filter}
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-4">
          <p className="text-sm text-slate-700">
            <strong>CSV File:</strong> <code className="bg-white px-2 py-1 rounded text-xs">Leads_Pluritech_CLAY_Filter_Prompts.csv</code>
          </p>
        </div>
      </div>
    </ContentSection>
  );
}

function PromptsTab() {
  return (
    <ContentSection title="AI Prompts for Lead Qualification" icon={<Code className="w-5 h-5" />}>
      <div className="space-y-4">
        <p>
          Each Clay Filter includes an ICP Match Prompt that evaluates company fit based on:
        </p>
        <ul className="space-y-2">
          <ListItem type="check">Location verification (Slovenia or Croatia)</ListItem>
          <ListItem type="check">Employee count validation (20-50 verified)</ListItem>
          <ListItem type="check">Workforce composition (predominantly office-based)</ListItem>
          <ListItem type="check">Email and document workflow patterns</ListItem>
          <ListItem type="check">Absence of disqualifiers</ListItem>
        </ul>

        <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded mt-4">
          <p className="text-sm text-slate-700">
            Each prompt returns only YES or NO with clear decision criteria. Company must meet all qualifiers and have no disqualifiers to return YES.
          </p>
        </div>
      </div>
    </ContentSection>
  );
}
