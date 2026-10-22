'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
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
              <p className="text-sm lg:text-base text-slate-600 break-words">Phishing awareness and employee cybersecurity training for office-based companies in Slovenia and Croatia</p>
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
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded">
              <h2 className="font-semibold text-slate-900 mb-2">Pluritech ReefSecure Angler</h2>
              <p className="text-slate-700 text-sm">Phishing awareness and employee cybersecurity training solution for office-based companies in Slovenia and Croatia with 20-50 employees.</p>
              <ul className="mt-3 space-y-1 text-sm text-slate-700">
                <li>✓ Target: Accounting, consulting, marketing, insurance, engineering firms</li>
                <li>✓ Geography: Slovenia & Croatia (exclusive)</li>
                <li>✓ Decision makers: CEO/Owner and IT Manager</li>
                <li>✓ 14 Clay Filters + 2 Email Sequences ready</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'icp' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h3 className="font-semibold text-slate-900 mb-2">Target Company Profile</h3>
              <p className="text-sm text-slate-700"><strong>Size:</strong> 20-50 employees</p>
              <p className="text-sm text-slate-700"><strong>Geography:</strong> Slovenia, Croatia</p>
              <p className="text-sm text-slate-700"><strong>Key Criterion:</strong> Predominantly office-based workforce with regular email and computer use</p>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
              <h3 className="font-semibold text-slate-900 mb-2">Primary Industries</h3>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• Accounting & Financial Services</li>
                <li>• Business Consulting</li>
                <li>• Marketing & Digital Agencies</li>
                <li>• Insurance Brokers</li>
              </ul>
            </div>
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
              <h3 className="font-semibold text-slate-900 mb-2">Secondary Industries</h3>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• Engineering & Design Consultancies</li>
                <li>• Real Estate & Property</li>
                <li>• B2B Wholesale & Distribution</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'filters' && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <h3 className="font-semibold text-slate-900 mb-2">Clay Filter Prompts (14 total)</h3>
            <p className="text-sm text-slate-700 mb-3">8 primary filters (TIER 1) + 6 secondary filters (TIER 2) covering both Slovenia and Croatia across all target industries.</p>
            <p className="text-sm text-slate-700">CSV file: <code className="bg-white px-2 py-1 rounded text-xs">Leads_Pluritech_CLAY_Filter_Prompts.csv</code></p>
          </div>
        )}

        {activeTab === 'prompts' && (
          <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded">
            <h3 className="font-semibold text-slate-900 mb-2">AI Prompts for Lead Qualification</h3>
            <p className="text-sm text-slate-700">Each filter includes an ICP Match Prompt that helps evaluate company fit based on location, employee count, workforce composition, and email workflow patterns.</p>
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
