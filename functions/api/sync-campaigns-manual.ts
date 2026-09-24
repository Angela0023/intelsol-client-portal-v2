/**
 * Manual Campaign Sync Trigger
 *
 * GET /api/sync-campaigns-manual
 *
 * Manually triggers the campaign sync worker to update campaign data immediately
 * instead of waiting for the scheduled daily run.
 *
 * This endpoint runs the same logic as the scheduled worker but can be triggered on-demand.
 */

interface Campaign {
  id: number;
  name: string;
  status: string;
  created_at: string;
}

interface CampaignAnalytics {
  id: number;
  name: string;
  status: string;
  unique_sent_count?: number;
  sent_count?: number;
  reply_count?: number;
  unique_open_count?: number;
  unique_click_count?: number;
  bounce_count?: number;
  unsubscribed_count?: number;
  campaign_lead_stats?: {
    interested?: number;
    not_interested?: number;
  };
}

interface LeadsResponse {
  total_leads?: number;
  total_count?: number;
}

interface ProcessedCampaign {
  campaignName: string;
  dateLaunched: string;
  totalLeads: number;
  leadsEmailed: number;
  month: string;
  status: string;
  performance: {
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

const CLIENT_NAMES: Record<string, string> = {
  'intelsol': 'Intelsol',
  'tslab': 'TS Lab',
  'demo': 'Demo',
  'xpose': 'Xpose',
  'adsigner': 'AdSigner',
  'beeit': 'BeeIt',
  'wulf': 'WULF',
  'peoplefocus': 'People Focus',
  'plantryx': 'Plantryx',
  'mountaindrop': 'Mountaindrop',
  'eblissai': 'eBliss AI',
  'zen2fit': 'Zen2fit',
  'panorate': 'Panorate',
  'mbedtronix': 'MBEDTRONIX',
  'clevercraft': 'Clever Craft',
  'stojkov': 'Stojkov',
  'birografika': 'Birografika MB',
  'bmevents': 'BM Events',
};

const SMARTLEAD_BASE_URL = 'https://server.smartlead.ai/api/v1';

function removeEmoji(text: string): string {
  const emojiPattern = /[\u{1F1E0}-\u{1F1FF}\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}]+/gu;
  return text.replace(emojiPattern, '').trim();
}

function matchesCampaign(campaignName: string, clientName: string): boolean {
  const withoutEmoji = removeEmoji(campaignName);
  const normalizedCampaign = withoutEmoji.toLowerCase().replace(/[\s-]/g, '');
  const normalizedClient = clientName.toLowerCase().replace(/[\s-]/g, '');
  return normalizedCampaign.startsWith(normalizedClient);
}

async function fetchSmartlead(endpoint: string, apiKey: string): Promise<any> {
  const url = `${SMARTLEAD_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Smartlead API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function getMonthName(dateString: string): string {
  const date = new Date(dateString);
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return months[date.getMonth()];
}

async function processCampaignsForClient(
  clientId: string,
  campaigns: Campaign[],
  apiKey: string
): Promise<ProcessedCampaign[]> {
  const clientName = CLIENT_NAMES[clientId];
  if (!clientName) {
    throw new Error(`Unknown client ID: ${clientId}`);
  }

  const clientCampaigns = campaigns.filter(c =>
    c.name && matchesCampaign(c.name, clientName)
  );

  console.log(`Found ${clientCampaigns.length} campaigns for ${clientId}`);

  const processed: ProcessedCampaign[] = [];

  for (const campaign of clientCampaigns) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      const leadsResponse: LeadsResponse = await fetchSmartlead(
        `/campaigns/${campaign.id}/leads?limit=1&offset=0`,
        apiKey
      );
      const totalLeads = leadsResponse.total_leads || leadsResponse.total_count || 0;

      const analytics: CampaignAnalytics = await fetchSmartlead(
        `/campaigns/${campaign.id}/analytics`,
        apiKey
      );

      const uniqueSent = parseInt(String(analytics.unique_sent_count || 0));
      const emailsSent = parseInt(String(analytics.sent_count || 0));
      const opens = parseInt(String(analytics.unique_open_count || 0));
      const clicks = parseInt(String(analytics.unique_click_count || 0));
      const replies = parseInt(String(analytics.reply_count || 0));
      const bounces = parseInt(String(analytics.bounce_count || 0));
      const unsubscribed = parseInt(String(analytics.unsubscribed_count || 0));
      const interested = parseInt(String(analytics.campaign_lead_stats?.interested || 0));
      const notInterested = parseInt(String(analytics.campaign_lead_stats?.not_interested || 0));

      const openRate = uniqueSent > 0 ? ((opens / uniqueSent) * 100).toFixed(2) : '0.00';
      const clickRate = uniqueSent > 0 ? ((clicks / uniqueSent) * 100).toFixed(2) : '0.00';
      const replyRate = uniqueSent > 0 ? ((replies / uniqueSent) * 100).toFixed(2) : '0.00';
      const bounceRate = uniqueSent > 0 ? ((bounces / uniqueSent) * 100).toFixed(2) : '0.00';
      const interestedRate = uniqueSent > 0 ? ((interested / uniqueSent) * 100).toFixed(2) : '0.00';

      processed.push({
        campaignName: campaign.name,
        dateLaunched: formatDate(campaign.created_at),
        totalLeads: totalLeads,
        leadsEmailed: uniqueSent,
        month: getMonthName(campaign.created_at),
        status: campaign.status,
        performance: {
          emailsSent: emailsSent,
          opens: opens,
          openRate: openRate,
          clicks: clicks,
          clickRate: clickRate,
          replies: replies,
          replyRate: replyRate,
          bounces: bounces,
          bounceRate: bounceRate,
          unsubscribed: unsubscribed,
          interested: interested,
          interestedRate: interestedRate,
          notInterested: notInterested,
        },
      });

    } catch (error) {
      console.error(`Error fetching data for campaign ${campaign.id}:`, error);
      processed.push({
        campaignName: campaign.name,
        dateLaunched: formatDate(campaign.created_at),
        totalLeads: 0,
        leadsEmailed: 0,
        month: getMonthName(campaign.created_at),
        status: campaign.status,
        performance: {
          emailsSent: 0,
          opens: 0,
          openRate: '0.00',
          clicks: 0,
          clickRate: '0.00',
          replies: 0,
          replyRate: '0.00',
          bounces: 0,
          bounceRate: '0.00',
          unsubscribed: 0,
          interested: 0,
          interestedRate: '0.00',
          notInterested: 0,
        },
      });
    }
  }

  processed.sort((a, b) => {
    const dateA = new Date(a.dateLaunched);
    const dateB = new Date(b.dateLaunched);
    return dateA.getTime() - dateB.getTime();
  });

  return processed;
}

async function updateGitHubFile(
  filePath: string,
  content: string,
  githubToken: string,
  repo: string = 'Angela0023/intelsol-client-portal',
  branch: string = 'main'
): Promise<void> {
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;

  let sha: string | undefined;
  try {
    const getResponse = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    if (getResponse.ok) {
      const data = await getResponse.json();
      sha = data.sha;
    }
  } catch (error) {
    console.log(`File ${filePath} does not exist, will create new file`);
  }

  const payload: any = {
    message: `Manual sync: Campaign data update at ${new Date().toISOString()}`,
    content: Buffer.from(content).toString('base64'),
    branch: branch,
  };

  if (sha) {
    payload.sha = sha;
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GitHub API error: ${response.status} - ${error}`);
  }
}

export async function onRequest(context: {
  request: Request;
  env: {
    SMARTLEAD_API_KEY: string;
    GITHUB_TOKEN: string;
  };
}) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔄 Starting manual campaign sync...');

    const campaigns: Campaign[] = await fetchSmartlead('/campaigns/', context.env.SMARTLEAD_API_KEY);
    console.log(`✅ Fetched ${campaigns.length} total campaigns`);

    const clients = Object.keys(CLIENT_NAMES);
    const results: any[] = [];

    for (const clientId of clients) {
      console.log(`\n🔄 Processing ${clientId}...`);

      const campaignData = await processCampaignsForClient(
        clientId,
        campaigns,
        context.env.SMARTLEAD_API_KEY
      );

      const jsonContent = JSON.stringify(campaignData, null, 2);
      const filePath = `public/campaigns/${clientId}.json`;

      await updateGitHubFile(
        filePath,
        jsonContent,
        context.env.GITHUB_TOKEN
      );

      console.log(`✅ Updated ${filePath} with ${campaignData.length} campaigns`);

      results.push({
        clientId,
        campaignsUpdated: campaignData.length,
        filePath,
      });
    }

    console.log('\n✅ Manual campaign sync completed successfully!');

    return new Response(JSON.stringify({
      success: true,
      message: 'Campaign sync completed successfully',
      timestamp: new Date().toISOString(),
      results: results,
    }, null, 2), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });

  } catch (error: any) {
    console.error('❌ Error during manual campaign sync:', error);

    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Unknown error',
      timestamp: new Date().toISOString(),
    }, null, 2), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
}
