'use client';

import { useState, useEffect } from 'react';
import { ContentSection } from './ContentSection';
import { BarChart3, Zap, Target } from 'lucide-react';

interface Campaign {
  campaignName: string;
  dateLaunched: string;
  totalLeads: number;
  leadsEmailed: number;
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
    interestedRate: string;
    notInterested: number;
  };
}

interface CampaignsTabDynamicProps {
  clientId: string;
}

export default function CampaignsTabDynamic({ clientId }: CampaignsTabDynamicProps) {
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
        setError('Failed to load campaigns');
        setLoading(false);
      });
  }, [clientId]);

  const totalLeads = campaigns.reduce((sum, c) => sum + c.totalLeads, 0);
  const totalCampaigns = campaigns.length;

  // Get unique months and calculate breakdown
  const uniqueMonths = Array.from(new Set(campaigns.map(c => c.month)));
  const currentYear = new Date().getFullYear();

  const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];

  const monthlyBreakdown = uniqueMonths
    .map(month => ({
      month: `${month} ${currentYear}`,
      leads: campaigns.filter(c => c.month === month).reduce((sum, c) => sum + c.totalLeads, 0),
      campaigns: campaigns.filter(c => c.month === month).length
    }))
    .sort((a, b) => {
      const monthA = a.month.split(' ')[0];
      const monthB = b.month.split(' ')[0];
      return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
    });

  if (loading) {
    return (
      <ContentSection title="Campaigns" icon={<Zap className="w-5 h-5" />}>
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-500">Loading campaigns...</div>
        </div>
      </ContentSection>
    );
  }

  if (error) {
    return (
      <ContentSection title="Campaigns" icon={<Zap className="w-5 h-5" />}>
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500">{error}</div>
        </div>
      </ContentSection>
    );
  }

  if (campaigns.length === 0) {
    return (
      <ContentSection title="Campaigns" icon={<Zap className="w-5 h-5" />}>
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-500">No campaigns found. Campaigns will appear here once they are created in Smartlead.</div>
        </div>
      </ContentSection>
    );
  }

  return (
    <>
      <ContentSection title="Campaign Summary" icon={<BarChart3 className="w-5 h-5" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-3 lg:p-6 shadow-sm">
            <p className="text-xs lg:text-sm text-green-700 font-medium mb-1">Total Leads</p>
            <p className="text-xl lg:text-4xl font-bold text-green-900">{totalLeads.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-3 lg:p-6 shadow-sm">
            <p className="text-xs lg:text-sm text-blue-700 font-medium mb-1">Campaigns</p>
            <p className="text-xl lg:text-4xl font-bold text-blue-900">{totalCampaigns}</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Campaign Details" icon={<Zap className="w-5 h-5" />}>
        {/* Mobile: Card Layout - Scrollable */}
        <div className="lg:hidden max-h-[500px] overflow-y-auto pr-2">
          <div className="space-y-3">
            {campaigns.map((campaign, index) => (
              <div key={index} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-slate-900 break-words flex-1">{campaign.campaignName}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 mt-2 pt-2 border-t border-slate-200">
                  <span>{campaign.dateLaunched}</span>
                  <span className="font-semibold text-green-700">{campaign.totalLeads.toLocaleString()} leads</span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals card for mobile - Fixed at bottom */}
          <div className="sticky bottom-0 bg-slate-100 rounded-lg p-3 border-2 border-slate-300 mt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">Total Leads:</span>
              <span className="text-lg font-bold text-green-700">{totalLeads.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Desktop: Table Layout - Scrollable */}
        <div className="hidden lg:block bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="min-w-full">
              <thead className="sticky top-0 bg-slate-50 z-10">
                <tr className="border-b border-slate-200">
                  <th className="text-left px-2 lg:px-4 py-2 lg:py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Campaign Name
                  </th>
                  <th className="text-center px-2 lg:px-4 py-2 lg:py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Date
                  </th>
                  <th className="text-right px-2 lg:px-4 py-2 lg:py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Leads
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.map((campaign, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-2 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-slate-700">
                      {campaign.campaignName}
                    </td>
                    <td className="px-2 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-slate-700 text-center whitespace-nowrap">
                      {campaign.dateLaunched}
                    </td>
                    <td className="px-2 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm font-semibold text-right whitespace-nowrap">
                      <span className="text-green-700">{campaign.totalLeads.toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
                {/* Totals row - Sticky at bottom */}
                <tr className="sticky bottom-0 bg-slate-50 border-t-2 border-slate-200 font-semibold">
                  <td className="px-2 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-slate-900" colSpan={2}>
                    Total
                  </td>
                  <td className="px-2 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-green-900 text-right">
                    {totalLeads.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ContentSection>

      {monthlyBreakdown.length > 0 && (
        <ContentSection title={`Monthly Breakdown - ${currentYear}`} icon={<Target className="w-5 h-5" />}>
          <div className="space-y-3 mb-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
              <p className="text-sm text-blue-900">
                <strong>Monthly Goal:</strong> 25,000 leads per month
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {monthlyBreakdown.map((item) => {
              const monthlyGoal = 25000;
              const percentageOfGoal = Math.round((item.leads / monthlyGoal) * 100);
              const progressWidth = Math.min((item.leads / monthlyGoal) * 100, 100);

              return (
                <div key={item.month} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 font-medium">{item.month}</p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">{item.leads.toLocaleString()} leads</p>
                      <p className="text-xs text-slate-500 mt-1">{item.campaigns} campaigns</p>
                      <p className="text-xs text-slate-400 mt-0.5">Goal: {monthlyGoal.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-green-600">
                        {percentageOfGoal}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${progressWidth}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </ContentSection>
      )}
    </>
  );
}
