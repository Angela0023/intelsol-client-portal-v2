'use client';

import { useState, useEffect } from 'react';
import { Mail, Server, TrendingUp, Calendar, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';

interface MailboxDetail {
  email: string;
  name: string;
  capacity: number;
  status: string;
  reputation: string;
}

interface CampaignDetail {
  name: string;
  status: string;
  totalLeads: number;
  sentCount: number;
  remainingLeads: number;
}

interface ClientMetrics {
  clientId: string;
  clientName: string;
  mailboxCount: number;
  totalCapacity: number;
  remainingLeads: number;
  daysRemaining: number;
  mailboxes: MailboxDetail[];
  campaigns: CampaignDetail[];
  activeCampaigns: number;
}

const ALL_CLIENTS = [
  { id: 'intelsol', name: 'Intelsol' },
  { id: 'tslab', name: 'TS Lab' },
  { id: 'xpose', name: 'Xpose' },
  { id: 'adsigner', name: 'AdSigner' },
  { id: 'beeit', name: 'BeeIt' },
  { id: 'wulf', name: 'WULF' },
  { id: 'peoplefocus', name: 'People Focus' },
  { id: 'plantryx', name: 'Plantryx' },
  { id: 'mountaindrop', name: 'Mountaindrop' },
  { id: 'eblissai', name: 'eBliss AI' },
  { id: 'zen2fit', name: 'Zen2fit' },
  { id: 'panorate', name: 'Panorate' },
  { id: 'mbedtronix', name: 'MBEDTRONIX' },
];

export default function ClientsTab() {
  const [allMetrics, setAllMetrics] = useState<ClientMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);

  useEffect(() => {
    fetchAllMetrics();
  }, []);

  const fetchAllMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch metrics for all clients in parallel
      const promises = ALL_CLIENTS.map(client =>
        fetch(`/api/client-metrics?clientId=${client.id}`)
          .then(res => res.ok ? res.json() : null)
          .catch(() => null)
      );

      const results = await Promise.all(promises);
      const validResults = results.filter(r => r !== null) as ClientMetrics[];

      // Sort by days remaining (ascending) - clients needing attention first
      validResults.sort((a, b) => {
        // Show clients with remaining leads first
        if (a.remainingLeads > 0 && b.remainingLeads === 0) return -1;
        if (a.remainingLeads === 0 && b.remainingLeads > 0) return 1;

        // Then sort by days remaining
        if (a.remainingLeads > 0 && b.remainingLeads > 0) {
          return a.daysRemaining - b.daysRemaining;
        }

        // Finally by total capacity
        return b.totalCapacity - a.totalCapacity;
      });

      setAllMetrics(validResults);
    } catch (err: any) {
      console.error('Error fetching metrics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (clientId: string) => {
    setExpandedClient(expandedClient === clientId ? null : clientId);
  };

  const getDaysColor = (days: number, hasLeads: boolean) => {
    if (!hasLeads || days === 0) return 'text-slate-500';
    if (days <= 3) return 'text-red-600 font-bold';
    if (days <= 7) return 'text-amber-600 font-semibold';
    if (days <= 14) return 'text-blue-600';
    return 'text-green-600';
  };

  const getDaysBg = (days: number, hasLeads: boolean) => {
    if (!hasLeads || days === 0) return 'bg-slate-50';
    if (days <= 3) return 'bg-red-50';
    if (days <= 7) return 'bg-amber-50';
    return '';
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

  // Count clients needing attention
  const clientsNeedingAttention = allMetrics.filter(m => m.remainingLeads > 0 && m.daysRemaining <= 7).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">All Clients - Capacity Overview</h2>
        <p className="text-slate-600 mt-1">
          Mailbox metrics and lead capacity for all clients
        </p>
      </div>

      {/* Warning Banner */}
      {clientsNeedingAttention > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-amber-900">Attention Needed</h3>
              <p className="text-sm text-amber-800 mt-1">
                {clientsNeedingAttention} client{clientsNeedingAttention !== 1 ? 's' : ''} with ≤7 days of capacity remaining
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Clients Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-8"></th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Mailboxes
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Capacity/Day
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Remaining Leads
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Days Left
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Active Campaigns
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {allMetrics.map((client) => (
                <>
                  <tr
                    key={client.clientId}
                    className={`hover:bg-slate-50 cursor-pointer ${getDaysBg(client.daysRemaining, client.remainingLeads > 0)}`}
                    onClick={() => toggleExpand(client.clientId)}
                  >
                    <td className="px-4 py-4">
                      {expandedClient === client.clientId ? (
                        <ChevronDown className="w-4 h-4 text-slate-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                      {client.clientName}
                    </td>
                    <td className="px-4 py-4 text-sm text-center text-slate-900">
                      {client.mailboxCount}
                    </td>
                    <td className="px-4 py-4 text-sm text-center font-medium text-slate-900">
                      {client.totalCapacity.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-center text-slate-900">
                      {client.remainingLeads.toLocaleString()}
                    </td>
                    <td className={`px-4 py-4 text-sm text-center ${getDaysColor(client.daysRemaining, client.remainingLeads > 0)}`}>
                      {client.remainingLeads > 0 ? (
                        <>
                          {client.daysRemaining} day{client.daysRemaining !== 1 ? 's' : ''}
                          {client.daysRemaining <= 3 && ' ⚠️'}
                        </>
                      ) : (
                        <span className="text-slate-400">No leads</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-center text-slate-700">
                      {client.activeCampaigns}
                    </td>
                  </tr>

                  {/* Expanded Row - Mailbox & Campaign Details */}
                  {expandedClient === client.clientId && (
                    <tr>
                      <td colSpan={7} className="px-4 py-4 bg-slate-50">
                        <div className="space-y-6">
                          {/* Mailbox Details */}
                          {client.mailboxes.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="text-sm font-semibold text-slate-900">Mailbox Details</h4>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-slate-200">
                                      <th className="px-3 py-2 text-left text-xs font-medium text-slate-600">Email</th>
                                      <th className="px-3 py-2 text-center text-xs font-medium text-slate-600">Capacity</th>
                                      <th className="px-3 py-2 text-center text-xs font-medium text-slate-600">Status</th>
                                      <th className="px-3 py-2 text-center text-xs font-medium text-slate-600">Reputation</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {client.mailboxes.map((mailbox, idx) => (
                                      <tr key={idx}>
                                        <td className="px-3 py-2 font-mono text-xs">{mailbox.email}</td>
                                        <td className="px-3 py-2 text-center text-xs font-medium">{mailbox.capacity}/day</td>
                                        <td className="px-3 py-2 text-center">
                                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                                            mailbox.status === 'ACTIVE'
                                              ? 'bg-green-100 text-green-800'
                                              : 'bg-slate-100 text-slate-600'
                                          }`}>
                                            {mailbox.status}
                                          </span>
                                        </td>
                                        <td className="px-3 py-2 text-center text-xs">{mailbox.reputation}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Campaign Details */}
                          {client.campaigns && client.campaigns.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="text-sm font-semibold text-slate-900">Campaign Details</h4>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-slate-200">
                                      <th className="px-3 py-2 text-left text-xs font-medium text-slate-600">Campaign Name</th>
                                      <th className="px-3 py-2 text-center text-xs font-medium text-slate-600">Status</th>
                                      <th className="px-3 py-2 text-center text-xs font-medium text-slate-600">Total Leads</th>
                                      <th className="px-3 py-2 text-center text-xs font-medium text-slate-600">Sent</th>
                                      <th className="px-3 py-2 text-center text-xs font-medium text-slate-600">Remaining</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {client.campaigns.map((campaign, idx) => (
                                      <tr key={idx}>
                                        <td className="px-3 py-2 text-xs">{campaign.name}</td>
                                        <td className="px-3 py-2 text-center">
                                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                                            campaign.status === 'ACTIVE'
                                              ? 'bg-green-100 text-green-800'
                                              : campaign.status === 'PAUSED'
                                              ? 'bg-amber-100 text-amber-800'
                                              : 'bg-slate-100 text-slate-600'
                                          }`}>
                                            {campaign.status}
                                          </span>
                                        </td>
                                        <td className="px-3 py-2 text-center text-xs font-medium">{campaign.totalLeads.toLocaleString()}</td>
                                        <td className="px-3 py-2 text-center text-xs">{campaign.sentCount.toLocaleString()}</td>
                                        <td className="px-3 py-2 text-center text-xs font-medium">{campaign.remainingLeads.toLocaleString()}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={fetchAllMetrics}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
    </div>
  );
}
