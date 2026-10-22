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
      <div className="p-4 lg:p-8">
        <div className="mb-6">
          <div className="flex items-center space-x-2 lg:space-x-3 mb-2">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl lg:text-2xl font-bold text-emerald-600">PR</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 lg:space-x-3 flex-wrap">
                <h1 className="text-xl lg:text-3xl font-bold text-slate-900">Pluritech ReefSecure Angler</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
                {isAdmin && <AssigneeBadge assignee={assignee} onAssigneeChange={handleAssigneeChange} size="md" />}
              </div>
              <p className="text-sm lg:text-base text-slate-600 break-words">Phishing awareness and employee cybersecurity training for office-based companies</p>
            </div>
          </div>
          <a
            href="https://pluritech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-emerald-600 hover:underline inline-block"
          >
            Visit Website →
          </a>
        </div>

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

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <ContentSection title="Product Overview" icon={FileText}>
              <div className="space-y-4">
                <InfoCard label="Solution" value="Phishing Awareness & Employee Cybersecurity Training" />
                <InfoCard label="Target Persona" value="CEO/Owner & IT Manager" />
                <div className="border-l-4 border-emerald-500 bg-emerald-50 p-4 rounded">
                  <p className="text-slate-700">ReefSecure Angler helps small office-based companies in Slovenia and Croatia systematically address the human aspect of cybersecurity. The solution focuses on employee awareness training to reduce phishing risk through education and consistent practice.</p>
                </div>
              </div>
            </ContentSection>

            <ContentSection title="Target Geography & Size" icon={Target}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard label="Geographies" value="Slovenia & Croatia" />
                <InfoCard label="Company Size" value="20-50 employees" />
              </div>
              <div className="mt-4 border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                <p className="text-sm text-slate-700"><strong>Key Criterion:</strong> Predominantly office-based workforce. Employees must regularly use business email and computers for daily work.</p>
              </div>
            </ContentSection>

            <ContentSection title="Primary Target Industries" icon={Target}>
              <div className="space-y-2">
                <ListItem type="check">Accounting, Bookkeeping, Payroll & Financial Advisory Services</ListItem>
                <ListItem type="check">Business Consulting & Professional Office Services</ListItem>
                <ListItem type="check">Marketing, Digital, Creative, PR & Recruitment Agencies</ListItem>
                <ListItem type="check">Insurance Brokers & Agencies</ListItem>
              </div>
            </ContentSection>

            <ContentSection title="Secondary Target Industries" icon={Target}>
              <div className="space-y-2">
                <ListItem type="check">Engineering & Design Consultancies</ListItem>
                <ListItem type="check">Architecture & Technical Consulting</ListItem>
                <ListItem type="check">Real Estate Agencies & Property Administration</ListItem>
                <ListItem type="check">B2B Wholesale & Distribution (office-based teams)</ListItem>
              </div>
            </ContentSection>
          </div>
        )}

        {activeTab === 'icp' && (
          <div className="space-y-6">
            <ContentSection title="ICP Profile" icon={Target}>
              <div className="space-y-4">
                <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded">
                  <p className="text-slate-700"><strong>Core Fit:</strong> Companies in Slovenia or Croatia with 20-50 employees where office work and daily email/computer use predominate.</p>
                </div>
              </div>
            </ContentSection>

            <ContentSection title="Buying Triggers (When Companies Are Ready)" icon={TrendingUp}>
              <div className="space-y-2">
                <ListItem type="check">Employee training initiative underway or planned</ListItem>
                <ListItem type="check">Review of existing awareness programme in progress</ListItem>
                <ListItem type="check">New IT leadership or team member joins</ListItem>
                <ListItem type="check">Growth of office team creating scaling challenges</ListItem>
                <ListItem type="check">Explicit initiative to improve phishing handling</ListItem>
              </div>
            </ContentSection>

            <ContentSection title="Pain Points & Problems" icon={Target}>
              <div className="space-y-2">
                <ListItem type="check">Employees find deceptive messages difficult to recognize</ListItem>
                <ListItem type="check">Training is occasional or inconsistent</ListItem>
                <ListItem type="check">Ownership of awareness programme is unclear</ListItem>
                <ListItem type="check">Company wants to review current awareness approach</ListItem>
              </div>
            </ContentSection>

            <ContentSection title="Business Impact" icon={TrendingUp}>
              <div className="space-y-2">
                <ListItem type="check">Business disruption from security incidents</ListItem>
                <ListItem type="check">Time spent handling suspicious messages</ListItem>
                <ListItem type="check">Risk of data or payment misuse</ListItem>
                <ListItem type="check">Reduced customer trust</ListItem>
              </div>
            </ContentSection>

            <ContentSection title="Exclusion Criteria (Poor Fit)" icon={Target}>
              <div className="space-y-2">
                <ListItem type="x">Companies outside Slovenia or Croatia</ListItem>
                <ListItem type="x">Fewer than 20 or more than 50 employees</ListItem>
                <ListItem type="x">Predominantly non-desk workforce (production, construction, hospitality, field services)</ListItem>
                <ListItem type="x">Direct competitors providing phishing-awareness solutions</ListItem>
                <ListItem type="x">Banks, clinics, schools, public institutions (not priority launch)</ListItem>
                <ListItem type="x">External contacts or opted-out relationships</ListItem>
              </div>
            </ContentSection>

            <ContentSection title="Decision Makers" icon={Target}>
              <div className="space-y-4">
                <div className="border-l-4 border-indigo-500 bg-indigo-50 p-4 rounded">
                  <h4 className="font-semibold text-slate-900 mb-2">Campaign 1: CEO / Owner / Managing Director</h4>
                  <p className="text-slate-700 text-sm">Business decision-maker and potential budget approver. Focus: employee awareness, business risk, how the company supports secure daily work.</p>
                </div>
                <div className="border-l-4 border-indigo-500 bg-indigo-50 p-4 rounded">
                  <h4 className="font-semibold text-slate-900 mb-2">Campaign 2: IT Manager / Security / IT Responsible</h4>
                  <p className="text-slate-700 text-sm">Expert stakeholder with responsibility for internal IT or information security. Assesses fit, recommends purchase (may not approve budget).</p>
                </div>
              </div>
            </ContentSection>
          </div>
        )}

        {activeTab === 'filters' && (
          <div className="space-y-6">
            <ContentSection title="Clay Filter Prompts" icon={Filter}>
              <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded">
                <p className="text-slate-700 text-sm">14 filters created covering both Slovenia and Croatia across primary (8) and secondary (6) industries:</p>
                <ul className="mt-3 space-y-1 text-sm text-slate-700">
                  <li><strong>PRIORITY 1:</strong> Slovenia - Accounting & Financial Services (highest conversion potential)</li>
                  <li><strong>PRIORITY 2-8:</strong> Other primary industry × location combinations</li>
                  <li><strong>PRIORITY 9-14:</strong> Secondary industries</li>
                </ul>
              </div>
            </ContentSection>

            <ContentSection title="Filter List" icon={Filter}>
              <div className="space-y-2">
                <div className="text-sm">
                  <p className="font-semibold text-slate-900 mb-2">Primary Filters (TIER 1):</p>
                  <ListItem type="check">Slovenia - Accounting & Financial Services (Priority 1)</ListItem>
                  <ListItem type="check">Slovenia - Business Consulting & Professional Services (Priority 3)</ListItem>
                  <ListItem type="check">Slovenia - Marketing & Digital Agencies (Priority 5)</ListItem>
                  <ListItem type="check">Slovenia - Insurance Brokers & Agencies (Priority 7)</ListItem>
                  <ListItem type="check">Croatia - Accounting & Financial Services (Priority 2)</ListItem>
                  <ListItem type="check">Croatia - Business Consulting & Professional Services (Priority 4)</ListItem>
                  <ListItem type="check">Croatia - Marketing & Digital Agencies (Priority 6)</ListItem>
                  <ListItem type="check">Croatia - Insurance Brokers & Agencies (Priority 8)</ListItem>
                </div>
                <div className="text-sm mt-4">
                  <p className="font-semibold text-slate-900 mb-2">Secondary Filters (TIER 2):</p>
                  <ListItem type="check">Slovenia - Engineering & Design Consultancies (Priority 9)</ListItem>
                  <ListItem type="check">Slovenia - Real Estate & Property Administration (Priority 11)</ListItem>
                  <ListItem type="check">Slovenia - B2B Wholesale & Distribution (Priority 13)</ListItem>
                  <ListItem type="check">Croatia - Engineering & Design Consultancies (Priority 10)</ListItem>
                  <ListItem type="check">Croatia - Real Estate & Property Administration (Priority 12)</ListItem>
                  <ListItem type="check">Croatia - B2B Wholesale & Distribution (Priority 14)</ListItem>
                </div>
              </div>
            </ContentSection>
          </div>
        )}

        {activeTab === 'prompts' && (
          <div className="space-y-6">
            <ContentSection title="AI Prompts for Lead Qualification" icon={Code}>
              <div className="border-l-4 border-cyan-500 bg-cyan-50 p-4 rounded">
                <p className="text-slate-700 text-sm">Each Clay Filter includes an AI prompt for ICP matching. The prompt guides review of company websites to determine fit based on:</p>
                <ul className="mt-3 space-y-1 text-sm text-slate-700 ml-4">
                  <li>✓ Location (Slovenia or Croatia)</li>
                  <li>✓ Employee count (20-50 verified)</li>
                  <li>✓ Predominantly office-based workforce</li>
                  <li>✓ Regular email & document workflow</li>
                  <li>✓ No known exclusions</li>
                </ul>
              </div>
            </ContentSection>

            <ContentSection title="Prompt Strategy" icon={Code}>
              <div className="space-y-4">
                <div className="border-l-4 border-slate-300 bg-slate-50 p-4 rounded">
                  <p className="text-slate-700 text-sm">Each prompt returns only YES or NO, with clear disqualifiers and qualifiers. Disqualifiers include: outside target country, wrong employee count, non-desk workforce, competitor status. Qualifiers verify target country, size, office-based model, email workflow, identifiable decision-maker.</p>
                </div>
              </div>
            </ContentSection>
          </div>
        )}

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
    </ClientLayout>
  );
}
