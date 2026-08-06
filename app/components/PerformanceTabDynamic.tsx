'use client';

import { useState, useEffect } from 'react';
import { ContentSection } from './ContentSection';
import { BarChart3, TrendingUp, Mail, MousePointerClick, Reply, AlertCircle } from 'lucide-react';

interface Campaign {
  campaignName: string;
  dateLaunched: string;
  leadsAdded: number;
  month: string;
  status?: string;
  performance?: {
    emailsSent: number;
    opens: number;
    openRate: string;
    clicks: number;
    clickRate: string;
    replies: number;
    replyRate: string;
    bounces: number;
    bounceRate: string;
    unsubscribed: number;
    interested: number;
    notInterested: number;
  };
}

interface PerformanceTabDynamicProps {
  clientId: string;
}

export default function PerformanceTabDynamic({ clientId }: PerformanceTabDynamicProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch campaigns from JSON file
  useEffect(() => {
    fetch(`/campaigns/${clientId}.json`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch campaigns');
        return res.json();
      })
      .then(data => {
        setCampaigns(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading campaigns:', err);
        setError('Failed to load performance data');
        setLoading(false);
      });
  }, [clientId]);

  if (loading) {
    return (
      <ContentSection title="Performance" icon={<BarChart3 className="w-5 h-5" />}>
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-500">Loading performance data...</div>
        </div>
      </ContentSection>
    );
  }

  if (error) {
    return (
      <ContentSection title="Performance" icon={<BarChart3 className="w-5 h-5" />}>
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500">{error}</div>
        </div>
      </ContentSection>
    );
  }

  if (campaigns.length === 0) {
    return (
      <ContentSection title="Performance" icon={<BarChart3 className="w-5 h-5" />}>
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-500">No performance data available. Data will appear once campaigns are running.</div>
        </div>
      </ContentSection>
    );
  }

  // Calculate overall metrics
  const totalLeads = campaigns.reduce((sum, c) => sum + c.leadsAdded, 0);
  const totalEmailsSent = campaigns.reduce((sum, c) => sum + (c.performance?.emailsSent || 0), 0);
  const totalOpens = campaigns.reduce((sum, c) => sum + (c.performance?.opens || 0), 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + (c.performance?.clicks || 0), 0);
  const totalReplies = campaigns.reduce((sum, c) => sum + (c.performance?.replies || 0), 0);
  const totalBounces = campaigns.reduce((sum, c) => sum + (c.performance?.bounces || 0), 0);
  const totalInterested = campaigns.reduce((sum, c) => sum + (c.performance?.interested || 0), 0);

  const avgOpenRate = totalLeads > 0 ? ((totalOpens / totalLeads) * 100).toFixed(2) : '0.00';
  const avgClickRate = totalLeads > 0 ? ((totalClicks / totalLeads) * 100).toFixed(2) : '0.00';
  const avgReplyRate = totalLeads > 0 ? ((totalReplies / totalLeads) * 100).toFixed(2) : '0.00';
  const avgBounceRate = totalLeads > 0 ? ((totalBounces / totalLeads) * 100).toFixed(2) : '0.00';

  return (
    <>
      <ContentSection title="Overall Performance" icon={<TrendingUp className="w-5 h-5" />}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
          {/* Total Leads */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-3 lg:p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-1">
              <Mail className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-blue-700 font-medium">Total Leads</p>
            </div>
            <p className="text-xl lg:text-3xl font-bold text-blue-900">{totalLeads.toLocaleString()}</p>
            <p className="text-xs text-blue-600 mt-1">{totalEmailsSent.toLocaleString()} emails sent</p>
          </div>

          {/* Open Rate */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-3 lg:p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-1">
              <Mail className="w-4 h-4 text-green-600" />
              <p className="text-xs text-green-700 font-medium">Open Rate</p>
            </div>
            <p className="text-xl lg:text-3xl font-bold text-green-900">{avgOpenRate}%</p>
            <p className="text-xs text-green-600 mt-1">{totalOpens.toLocaleString()} opens</p>
          </div>

          {/* Reply Rate */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-3 lg:p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-1">
              <Reply className="w-4 h-4 text-purple-600" />
              <p className="text-xs text-purple-700 font-medium">Reply Rate</p>
            </div>
            <p className="text-xl lg:text-3xl font-bold text-purple-900">{avgReplyRate}%</p>
            <p className="text-xs text-purple-600 mt-1">{totalReplies.toLocaleString()} replies</p>
          </div>

          {/* Interested Leads */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200 p-3 lg:p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <p className="text-xs text-amber-700 font-medium">Interested</p>
            </div>
            <p className="text-xl lg:text-3xl font-bold text-amber-900">{totalInterested}</p>
            <p className="text-xs text-amber-600 mt-1">Positive replies</p>
          </div>
        </div>

        {/* Additional Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4 mt-4">
          <div className="bg-white rounded-lg border border-slate-200 p-3 lg:p-4">
            <div className="flex items-center space-x-2 mb-1">
              <MousePointerClick className="w-4 h-4 text-slate-600" />
              <p className="text-xs text-slate-700 font-medium">Click Rate</p>
            </div>
            <p className="text-lg lg:text-2xl font-bold text-slate-900">{avgClickRate}%</p>
            <p className="text-xs text-slate-500 mt-1">{totalClicks.toLocaleString()} clicks</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-3 lg:p-4">
            <div className="flex items-center space-x-2 mb-1">
              <AlertCircle className="w-4 h-4 text-slate-600" />
              <p className="text-xs text-slate-700 font-medium">Bounce Rate</p>
            </div>
            <p className="text-lg lg:text-2xl font-bold text-slate-900">{avgBounceRate}%</p>
            <p className="text-xs text-slate-500 mt-1">{totalBounces.toLocaleString()} bounces</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-3 lg:p-4">
            <div className="flex items-center space-x-2 mb-1">
              <BarChart3 className="w-4 h-4 text-slate-600" />
              <p className="text-xs text-slate-700 font-medium">Campaigns</p>
            </div>
            <p className="text-lg lg:text-2xl font-bold text-slate-900">{campaigns.length}</p>
            <p className="text-xs text-slate-500 mt-1">Active campaigns</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Campaign Performance Details" icon={<BarChart3 className="w-5 h-5" />}>
        {/* Mobile: Card Layout - Scrollable */}
        <div className="lg:hidden max-h-[500px] overflow-y-auto pr-2">
          <div className="space-y-3">
            {campaigns.map((campaign, index) => (
              <div key={index} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-slate-900 flex-1">{campaign.campaignName}</p>
                  <span className="text-xs text-slate-500 ml-2 whitespace-nowrap">{campaign.dateLaunched}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Leads:</span>
                    <span className="font-semibold text-slate-900 ml-1">{campaign.leadsAdded.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Opens:</span>
                    <span className="font-semibold text-green-700 ml-1">{campaign.performance?.openRate || '0'}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Clicks:</span>
                    <span className="font-semibold text-blue-700 ml-1">{campaign.performance?.clickRate || '0'}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Replies:</span>
                    <span className="font-semibold text-purple-700 ml-1">{campaign.performance?.replyRate || '0'}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Positive:</span>
                    <span className="font-semibold text-amber-700 ml-1">{campaign.performance?.interested || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Table Layout - Scrollable */}
        <div className="hidden lg:block bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="min-w-full">
              <thead className="sticky top-0 bg-slate-50 z-10">
                <tr className="border-b border-slate-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Date
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Leads
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Opens
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Clicks
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Replies
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Positive
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.map((campaign, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-700 max-w-md truncate">
                      {campaign.campaignName}
                    </td>
                    <td className="px-4 py-3 text-xs text-center text-slate-600 whitespace-nowrap">
                      {campaign.dateLaunched}
                    </td>
                    <td className="px-4 py-3 text-xs text-center font-semibold text-slate-900 whitespace-nowrap">
                      {campaign.leadsAdded.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-xs text-center whitespace-nowrap">
                      <div className="font-semibold text-green-700">{campaign.performance?.openRate || '0'}%</div>
                      <div className="text-slate-500 text-[10px]">{campaign.performance?.opens || 0}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-center whitespace-nowrap">
                      <div className="font-semibold text-blue-700">{campaign.performance?.clickRate || '0'}%</div>
                      <div className="text-slate-500 text-[10px]">{campaign.performance?.clicks || 0}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-center whitespace-nowrap">
                      <div className="font-semibold text-purple-700">{campaign.performance?.replyRate || '0'}%</div>
                      <div className="text-slate-500 text-[10px]">{campaign.performance?.replies || 0}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-center font-semibold text-amber-700 whitespace-nowrap">
                      {campaign.performance?.interested || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ContentSection>
    </>
  );
}
