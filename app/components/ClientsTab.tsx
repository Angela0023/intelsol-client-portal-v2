'use client';

import { useState, useEffect } from 'react';
import { Mail, Server, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

interface MailboxDetail {
  email: string;
  name: string;
  capacity: number;
  status: string;
  reputation: string;
}

interface ClientMetrics {
  clientId: string;
  clientName: string;
  mailboxCount: number;
  totalCapacity: number;
  remainingLeads: number;
  daysRemaining: number;
  mailboxes: MailboxDetail[];
  activeCampaigns: number;
}

interface ClientsTabProps {
  clientId: string;
}

export default function ClientsTab({ clientId }: ClientsTabProps) {
  const [metrics, setMetrics] = useState<ClientMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
  }, [clientId]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/client-metrics?clientId=${clientId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch client metrics');
      }

      const data = await response.json();
      setMetrics(data);
    } catch (err: any) {
      console.error('Error fetching metrics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading client metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div>
            <h3 className="text-sm font-semibold text-red-900">Error Loading Metrics</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  const warningThreshold = 7; // Days
  const isLowCapacity = metrics.daysRemaining <= warningThreshold && metrics.remainingLeads > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Client Capacity Overview</h2>
        <p className="text-slate-600 mt-1">
          Mailbox configuration and sending capacity for {metrics.clientName}
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Mailboxes */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Mail className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-medium text-slate-500 uppercase">Mailboxes</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{metrics.mailboxCount}</div>
          <p className="text-sm text-slate-600 mt-1">Active email accounts</p>
        </div>

        {/* Total Capacity */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Server className="w-5 h-5 text-green-600" />
            <span className="text-xs font-medium text-slate-500 uppercase">Capacity</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {metrics.totalCapacity.toLocaleString()}
          </div>
          <p className="text-sm text-slate-600 mt-1">Emails per day</p>
        </div>

        {/* Remaining Leads */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-medium text-slate-500 uppercase">Queue</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {metrics.remainingLeads.toLocaleString()}
          </div>
          <p className="text-sm text-slate-600 mt-1">Leads pending contact</p>
        </div>

        {/* Days Remaining */}
        <div className={`bg-white border rounded-lg p-6 ${isLowCapacity ? 'border-amber-300 bg-amber-50' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <Calendar className={`w-5 h-5 ${isLowCapacity ? 'text-amber-600' : 'text-indigo-600'}`} />
            <span className="text-xs font-medium text-slate-500 uppercase">Runway</span>
          </div>
          <div className={`text-3xl font-bold ${isLowCapacity ? 'text-amber-900' : 'text-slate-900'}`}>
            {metrics.daysRemaining}
          </div>
          <p className={`text-sm mt-1 ${isLowCapacity ? 'text-amber-700' : 'text-slate-600'}`}>
            Days of capacity
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      {isLowCapacity && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-amber-900">Low Capacity Warning</h3>
              <p className="text-sm text-amber-800 mt-1">
                Only {metrics.daysRemaining} days of sending capacity remaining. Consider adding more leads soon to maintain campaign momentum.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Active Campaigns Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <span className="text-sm font-medium text-blue-900">
            {metrics.activeCampaigns} active campaign{metrics.activeCampaigns !== 1 ? 's' : ''} running
          </span>
        </div>
      </div>

      {/* Mailbox Details Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Mailbox Details</h3>
          <p className="text-sm text-slate-600 mt-1">
            Individual mailbox sending capacity and status
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Email Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  From Name
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Reputation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {metrics.mailboxes.map((mailbox, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-mono text-slate-900">
                    {mailbox.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {mailbox.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-center font-medium text-slate-900">
                    {mailbox.capacity}/day
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      mailbox.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {mailbox.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-slate-700">
                    {mailbox.reputation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">
              Total: {metrics.mailboxCount} mailbox{metrics.mailboxCount !== 1 ? 'es' : ''}
            </span>
            <span className="font-semibold text-slate-900">
              Combined Capacity: {metrics.totalCapacity.toLocaleString()} emails/day
            </span>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={fetchMetrics}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
    </div>
  );
}
