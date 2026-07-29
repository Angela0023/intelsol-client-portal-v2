'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '../components/ClientLayout';
import StatusBadge, {
  getClientStatus,
  setClientStatus,
  DEFAULT_STATUSES,
  type ClientStatus,
} from '../components/StatusBadge';
import { Building2, Users, Target, TrendingUp, CheckSquare, Square, User, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [statuses, setStatuses] = useState<Record<string, ClientStatus>>({});
  const [recentTasks, setRecentTasks] = useState<
    { clientId: string; clientName: string; task: { id: string; description: string; assignedTo: string; status: string; dueDate: string } }[]
  >([]);

  useEffect(() => {
    // Load statuses from localStorage
    const loadedStatuses: Record<string, ClientStatus> = {};
    for (const [clientId, defaultStatus] of Object.entries(DEFAULT_STATUSES)) {
      loadedStatuses[clientId] = getClientStatus(clientId, defaultStatus);
    }
    setStatuses(loadedStatuses);

    // Fetch recent tasks from all clients
    const fetchAllTasks = async () => {
      const clientIds = ['xpose', 'tslab', 'beeit', 'intelsol', 'peoplefocus', 'wulf'];
      const clientNames: Record<string, string> = {
        xpose: 'Xpose Solutions',
        tslab: 'TS Lab',
        beeit: 'BeeIt',
        intelsol: 'Intelsol',
        peoplefocus: 'PeopleFocus',
        wulf: 'Wulf'
      };

      const allTasks: any[] = [];

      for (const clientId of clientIds) {
        try {
          const response = await fetch(`/api/tasks/get?clientId=${clientId}`);
          const data = await response.json();

          if (response.ok && data.tasks) {
            data.tasks.forEach((task: any) => {
              allTasks.push({
                clientId,
                clientName: clientNames[clientId],
                task
              });
            });
          }
        } catch (err) {
          // Skip on error
        }
      }

      // Sort by due date (soonest first), pending first
      allTasks.sort((a, b) => {
        if (a.task.status !== b.task.status) return a.task.status === 'pending' ? -1 : 1;
        return a.task.dueDate.localeCompare(b.task.dueDate);
      });

      setRecentTasks(allTasks.slice(0, 5));
    };

    fetchAllTasks();
  }, []);

  const handleStatusChange = (clientId: string, newStatus: ClientStatus) => {
    setStatuses((prev) => ({ ...prev, [clientId]: newStatus }));
    setClientStatus(clientId, newStatus);
  };

  const clients = [
    {
      id: 'xpose',
      name: 'Xpose Solutions',
      industry: 'Healthcare Technology',
      color: 'bg-blue-100 text-blue-600',
      borderColor: 'border-blue-200',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'tslab',
      name: 'TS Lab',
      industry: 'Food Supplement Manufacturing',
      color: 'bg-green-100 text-green-600',
      borderColor: 'border-green-200',
      bgColor: 'bg-green-50',
    },
    {
      id: 'beeit',
      name: 'BeeIt',
      industry: 'eCommerce Development',
      color: 'bg-amber-100 text-amber-600',
      borderColor: 'border-amber-200',
      bgColor: 'bg-amber-50',
    },
    {
      id: 'intelsol',
      name: 'Intelsol',
      industry: 'Lead Generation Agency',
      color: 'bg-violet-100 text-violet-600',
      borderColor: 'border-violet-200',
      bgColor: 'bg-violet-50',
    },
    {
      id: 'wulf',
      name: 'WULF Arts',
      industry: '3D Production Studio',
      color: 'bg-orange-100 text-orange-600',
      borderColor: 'border-orange-200',
      bgColor: 'bg-orange-50',
    },
  ];

  const activeCount = Object.values(statuses).filter((s) => s === 'Active').length;

  const stats = [
    {
      label: 'Total Clients',
      value: '5',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Active Campaigns',
      value: String(activeCount || 3),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Target Markets',
      value: '15+',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Buyer Personas',
      value: '12+',
      icon: Users,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
  ];

  return (
    <ClientLayout>
      <div className="p-4 lg:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard Overview</h1>
          <p className="text-slate-600">Manage all client campaigns and documentation</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Clients Grid */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Clients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clients.map((client) => (
              <Link
                key={client.id}
                href={`/${client.id}`}
                className={`bg-white rounded-lg border-2 ${client.borderColor} p-6 hover:shadow-lg transition-all group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 ${client.color} rounded-lg flex items-center justify-center text-2xl font-bold`}>
                    {client.name.charAt(0)}
                  </div>
                  <StatusBadge
                    status={statuses[client.id] || DEFAULT_STATUSES[client.id] || 'Active'}
                    onStatusChange={(newStatus) => handleStatusChange(client.id, newStatus)}
                  />
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-[#1a2647] transition-colors">
                  {client.name}
                </h3>
                <p className="text-sm text-slate-600 mb-4">{client.industry}</p>

                <div className={`${client.bgColor} rounded-lg p-3 border ${client.borderColor}`}>
                  <p className="text-xs font-medium text-slate-600 mb-2">Quick Access:</p>
                  <div className="flex flex-wrap gap-2">
                    {client.id === 'intelsol' ? (
                      <>
                        <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">
                          Overview
                        </span>
                        <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">
                          Performance
                        </span>
                        <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">
                          Tasks
                        </span>
                      </>
                    ) : client.id === 'wulf' ? (
                      <>
                        <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">
                          Overview
                        </span>
                        <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">
                          Spam Check
                        </span>
                        <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">
                          Tasks
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">
                          ICP Profile
                        </span>
                        <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">
                          Clay Filters
                        </span>
                        <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">
                          AI Prompts
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center text-sm font-medium text-[#1a2647] group-hover:underline">
                  View Dashboard
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Tasks</h2>
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
            {recentTasks.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No tasks yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentTasks.map((item) => (
                  <div
                    key={item.task.id}
                    className={`p-4 flex items-center space-x-4 hover:bg-slate-50 transition-colors ${
                      item.task.status === 'done' ? 'opacity-60' : ''
                    }`}
                  >
                    {item.task.status === 'done' ? (
                      <CheckSquare className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          item.task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {item.task.description}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.clientName}</p>
                    </div>

                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          item.task.assignedTo === 'Matej'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {item.task.assignedTo}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-500">{item.task.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* System Info */}
        <div className="mt-8 bg-slate-50 rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-600 mb-1">Platform</p>
              <p className="font-medium text-slate-900">IntElsol Client Portal v1.0</p>
            </div>
            <div>
              <p className="text-slate-600 mb-1">Last Updated</p>
              <p className="font-medium text-slate-900">May 26, 2026</p>
            </div>
            <div>
              <p className="text-slate-600 mb-1">Access Level</p>
              <p className="font-medium text-slate-900">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
