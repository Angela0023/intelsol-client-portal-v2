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

export default function AskitPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [assignee, setAssignee] = useState<Assignee | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setStatus(getClientStatus('askit', DEFAULT_STATUSES.askit));
    setAssignee(getStoredAssignee('askit', getClientAssignee('askit')));

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
    setClientStatus('askit', newStatus);
  };

  const handleAssigneeChange = (newAssignee: Assignee) => {
    setAssignee(newAssignee);
    setStoredAssignee('askit', newAssignee);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const newPath = tabId === 'overview' ? '/askit' : `/askit/${tabId}`;
    window.history.pushState({}, '', newPath);
  };

  // Filter tabs based on admin access
  const visibleTabs = isAdmin
    ? tabs
    : tabs.filter(tab => !['filters', 'prompts'].includes(tab.id));

  return (
    <ClientLayout>
      <div className="p-4 lg:p-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 lg:space-x-3 mb-2">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl lg:text-2xl font-bold text-red-600">AS</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 lg:space-x-3 flex-wrap">
                <h1 className="text-xl lg:text-3xl font-bold text-slate-900">ASKIT AIVaaS</h1>
                <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
                {isAdmin && <AssigneeBadge assignee={assignee} onAssigneeChange={handleAssigneeChange} size="md" />}
              </div>
              <p className="text-sm lg:text-base text-slate-600 break-words">Strategic AI transformation connecting business strategy, organizational development, and AI implementation</p>
            </div>
          </div>
          <a
            href="https://aivaas.biz/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-red-600 hover:underline inline-block"
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
                    ? 'border-red-600 text-red-600 font-medium'
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
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <ContentSection title="About ASKIT AIVaaS">
              <InfoCard label="Service Model" value="AI Value as a Service (AIVaaS)" />
              <InfoCard label="Primary Focus" value="Strategic AI transformation and organizational development" />
              <InfoCard label="Geographic Scope" value="Slovenia" />
              <ListItem type="check">Connects business strategy with AI implementation</ListItem>
              <ListItem type="check">Organizational enablement and people development</ListItem>
              <ListItem type="check">ROI measurement and value realization</ListItem>
            </ContentSection>

            <ContentSection title="Campaign Structure">
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r">
                  <h3 className="font-semibold text-red-900 mb-2">Campaign 1: AIVaaS Strategic Transformation</h3>
                  <p className="text-sm text-red-800 mb-2">Target: CEO / Managing Director / Owner</p>
                  <p className="text-sm text-red-700">Focus: Business strategy, competitive advantage, and measurable AI value</p>
                </div>
                <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r">
                  <h3 className="font-semibold text-orange-900 mb-2">Campaign 2: Business Academy Leadership Education</h3>
                  <p className="text-sm text-orange-800 mb-2">Target: HR Director / CHRO / L&D Director</p>
                  <p className="text-sm text-orange-700">Focus: In-house leadership academy for shared AI understanding</p>
                </div>
              </div>
            </ContentSection>

            <ContentSection title="Key Success Metrics">
              <InfoCard label="Primary Target Companies" value="80+ employees, €10m+ revenue" />
              <InfoCard label="Minimum Leadership Structure" value="At least 5 leaders able to participate" />
              <InfoCard label="Industry Focus" value="Manufacturing, Logistics, Complex Operations" />
              <ListItem type="check">Business complexity and multiple departments</ListItem>
              <ListItem type="check">Clear evidence of leadership structure</ListItem>
              <ListItem type="check">Demonstrated organizational ambition</ListItem>
            </ContentSection>
          </div>
        )}

        {activeTab === 'icp' && (
          <div className="space-y-6">
            <ContentSection title="Target Company Profile">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900">Primary Segments</h3>
                <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r">
                  <p className="font-medium text-red-900">A. Ambitious Market Leaders</p>
                  <p className="text-sm text-red-800">Successful companies seeking next competitive advantage and new value creation</p>
                </div>
                <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r">
                  <p className="font-medium text-red-900">B. Companies Under Margin Pressure</p>
                  <p className="text-sm text-red-800">Suppliers and manufacturers needing more than optimization</p>
                </div>
                <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r">
                  <p className="font-medium text-red-900">C. Manufacturing Companies</p>
                  <p className="text-sm text-red-800">Complex processes, multiple departments, connected operations</p>
                </div>
                <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r">
                  <p className="font-medium text-red-900">D. Logistics Integrators</p>
                  <p className="text-sm text-red-800">Process and system integration beyond transport services</p>
                </div>
              </div>
            </ContentSection>

            <ContentSection title="Buyer Personas and Messaging">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">AIVaaS Campaign (CEO/MD/Owner)</h3>
                  <ListItem type="check">Messaging: AI as business strategy and competitive advantage</ListItem>
                  <ListItem type="check">Primary CTA: Introductory conversation about AI strategy</ListItem>
                  <ListItem type="check">Timeline: 4 messages over 2-3 weeks</ListItem>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Business Academy Campaign (HR/L&D)</h3>
                  <ListItem type="check">Messaging: Shared AI understanding across leadership team</ListItem>
                  <ListItem type="check">Primary CTA: Permission to send program outline</ListItem>
                  <ListItem type="check">Timeline: 4 messages over 2-3 weeks</ListItem>
                </div>
              </div>
            </ContentSection>

            <ContentSection title="Pain Points and Triggers">
              <ListItem type="check">AI pilots without clear business value or ROI</ListItem>
              <ListItem type="check">License costs with low adoption rates</ListItem>
              <ListItem type="check">AI delegated solely to IT without business context</ListItem>
              <ListItem type="check">Margin pressure requiring new value creation</ListItem>
              <ListItem type="check">System complexity and process integration challenges</ListItem>
              <ListItem type="check">Leadership development and organizational change needs</ListItem>
            </ContentSection>

            <ContentSection title="Exclusion Criteria">
              <ListItem type="cross">Educational institutions, universities, education providers</ListItem>
              <ListItem type="cross">Companies with fewer than 80 employees (unless exceptional)</ListItem>
              <ListItem type="cross">Companies without sufficient leadership structure</ListItem>
              <ListItem type="cross">Existing customers, partners, or active opportunities</ListItem>
            </ContentSection>
          </div>
        )}

        {activeTab === 'filters' && (
          <div className="space-y-6">
            {/* YOUR CLAY FILTERS TAB CONTENT HERE */}
          </div>
        )}

        {activeTab === 'prompts' && (
          <div className="space-y-6">
            {/* YOUR AI PROMPTS TAB CONTENT HERE */}
          </div>
        )}

        {activeTab === 'campaigns-sequences' && (
          <>
            <SequencesTab clientId="askit" />
            <div className="mt-8">
              <CampaignsTabGeneric />
            </div>
          </>
        )}

        {activeTab === 'performance' && (
          <>
            <PerformanceTabDynamic clientId="askit" />
            <CampaignsTabDynamic clientId="askit" />
          </>
        )}

        {activeTab === 'documents' && <DocumentsTabGeneric clientId="askit" clientName="ASKIT" />}

        {activeTab === 'tasks' && <TasksTab clientId="askit" defaultTasks={[]} />}
      </div>
    </ClientLayout>
  );
}
