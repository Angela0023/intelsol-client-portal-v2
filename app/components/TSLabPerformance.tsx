'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Mail, MessageSquare, ThumbsUp, RefreshCw } from 'lucide-react';

interface CampaignStat {
  id: number;
  name: string;
  status: string;
  totalLeads: number;
  emailsSent: number;
  replies: number;
  positiveReplies: number;
  replyRate: string | number;
}

interface StatsData {
  lastUpdated: string;
  totalCampaigns: number;
  campaigns: CampaignStat[];
  summary: {
    totalLeads: number;
    totalEmailsSent: number;
    totalReplies: number;
    totalPositiveReplies: number;
    avgReplyRate: string;
  };
}

export default function TSLabPerformance() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/tslab-stats.json')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-900 font-medium">Failed to load performance data</p>
        <p className="text-red-700 text-sm mt-1">{error || 'Unknown error'}</p>
      </div>
    );
  }

  const lastUpdated = new Date(stats.lastUpdated).toLocaleString();

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-1">
            <Mail className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-slate-600">Total Leads</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.summary.totalLeads.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <p className="text-sm text-slate-600">Emails Sent</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.summary.totalEmailsSent.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-1">
            <MessageSquare className="w-4 h-4 text-green-600" />
            <p className="text-sm text-slate-600">Total Replies</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.summary.totalReplies}</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-1">
            <ThumbsUp className="w-4 h-4 text-amber-600" />
            <p className="text-sm text-slate-600">Positive Replies</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.summary.totalPositiveReplies}</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-1">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            <p className="text-sm text-slate-600">Avg Reply Rate</p>
          </div>
          <p className="text-2xl font-bold text-indigo-600">{stats.summary.avgReplyRate}%</p>
        </div>
      </div>

      {/* Campaign Details Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-[#1a2647]" />
            <h3 className="text-lg font-semibold text-slate-900">Campaign Performance</h3>
          </div>
          <p className="text-xs text-slate-500">Last updated: {lastUpdated}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Leads
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Emails Sent
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Replies
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Positive
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Reply Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-900 font-medium max-w-md truncate">
                    {campaign.name}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      campaign.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : campaign.status === 'COMPLETED'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 text-right">
                    {campaign.totalLeads.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 text-right">
                    {campaign.emailsSent.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 text-right">
                    {campaign.replies}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-700 text-right">
                    {campaign.positiveReplies}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-indigo-700 text-right">
                    {campaign.replyRate}%
                  </td>
                </tr>
              ))}
              {/* Totals row */}
              <tr className="bg-slate-50 border-t-2 border-slate-200 font-semibold">
                <td className="px-4 py-3 text-sm text-slate-900">Total</td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-sm text-slate-900 text-right">
                  {stats.summary.totalLeads.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-slate-900 text-right">
                  {stats.summary.totalEmailsSent.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-slate-900 text-right">
                  {stats.summary.totalReplies}
                </td>
                <td className="px-4 py-3 text-sm text-green-900 text-right">
                  {stats.summary.totalPositiveReplies}
                </td>
                <td className="px-4 py-3 text-sm text-indigo-900 text-right">
                  {stats.summary.avgReplyRate}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
