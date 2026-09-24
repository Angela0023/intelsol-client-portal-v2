/**
 * Cloudflare Scheduled Worker - Daily Campaign Sync
 *
 * Runs daily at 4 AM CEST (2 AM UTC) to:
 * 1. Fetch all campaigns from Smartlead API
 * 2. Filter campaigns by client name (emoji-agnostic matching)
 * 3. Get analytics/lead counts for each campaign
 * 4. Update JSON files in GitHub repo for each client
 *
 * Campaign Matching:
 * - Removes any emoji from start of campaign name
 * - Matches if campaign name starts with client name (case-insensitive)
 * - Example: "🏆 Intelsol | Campaign" matches client "Intelsol"
 * - Example: "🧪 TS Lab | Campaign" matches client "TS Lab"
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

// Client names for matching (emoji-agnostic)
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
};

const SMARTLEAD_BASE_URL = 'https://server.smartlead.ai/api/v1';

// Remove emoji from start of text
function removeEmoji(text: string): string {
  // Comprehensive emoji removal using Unicode ranges
  const emojiPattern = /[\u{1F1E0}-\u{1F1FF}\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}]+/gu;
  return text.replace(emojiPattern, '').trim();
}

// Check if campaign matches client name
function matchesCampaign(campaignName: string, clientName: string): boolean {
  // Remove emoji from campaign name
  const withoutEmoji = removeEmoji(campaignName);

  // Normalize both: lowercase, remove spaces and hyphens
  const normalizedCampaign = withoutEmoji.toLowerCase().replace(/[\s-]/g, '');
  const normalizedClient = clientName.toLowerCase().replace(/[\s-]/g, '');

  // Campaign must start with client name
  return normalizedCampaign.startsWith(normalizedClient);
}

// Helper to make Smartlead API requests
async function fetchSmartlead(endpoint: string, apiKey: string): Promise<any> {
  const url = `${SMARTLEAD_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Smartlead API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// Helper to format date as MM/DD/YYYY
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

// Helper to get month name from date
function getMonthName(dateString: string): string {
  const date = new Date(dateString);
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return months[date.getMonth()];
}

// Process campaigns for a specific client
async function processCampaignsForClient(
  clientId: string,
  campaigns: Campaign[],
  apiKey: string
): Promise<ProcessedCampaign[]> {
  const clientName = CLIENT_NAMES[clientId];
  if (!clientName) {
    throw new Error(`Unknown client ID: ${clientId}`);
  }

  // Filter campaigns by client name (emoji-agnostic)
  const clientCampaigns = campaigns.filter(c =>
    c.name && matchesCampaign(c.name, clientName)
  );

  console.log(`Found ${clientCampaigns.length} campaigns for ${clientId}`);

  const processed: ProcessedCampaign[] = [];

  // Fetch analytics and lead counts for each campaign
  for (const campaign of clientCampaigns) {
    try {
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));

      // Get total lead count
      const leadsResponse: LeadsResponse = await fetchSmartlead(
        `/campaigns/${campaign.id}/leads?limit=1&offset=0`,
        apiKey
      );
      const totalLeads = leadsResponse.total_leads || leadsResponse.total_count || 0;

      // Get analytics for performance metrics
      const analytics: CampaignAnalytics = await fetchSmartlead(
        `/campaigns/${campaign.id}/analytics`,
        apiKey
      );

      // Extract metrics from analytics
      const uniqueSent = parseInt(String(analytics.unique_sent_count || 0));
      const emailsSent = parseInt(String(analytics.sent_count || 0));
      const opens = parseInt(String(analytics.unique_open_count || 0));
      const clicks = parseInt(String(analytics.unique_click_count || 0));
      const replies = parseInt(String(analytics.reply_count || 0));
      const bounces = parseInt(String(analytics.bounce_count || 0));
      const unsubscribed = parseInt(String(analytics.unsubscribed_count || 0));
      const interested = parseInt(String(analytics.campaign_lead_stats?.interested || 0));
      const notInterested = parseInt(String(analytics.campaign_lead_stats?.not_interested || 0));

      // Calculate rates
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
      // Still include campaign with 0 values if fetch fails
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

  // Sort by date (oldest first)
  processed.sort((a, b) => {
    const dateA = new Date(a.dateLaunched);
    const dateB = new Date(b.dateLaunched);
    return dateA.getTime() - dateB.getTime();
  });

  return processed;
}

// Update campaign data in GitHub
async function updateGitHubFile(
  filePath: string,
  content: string,
  githubToken: string,
  repo: string = 'Angela0023/intelsol-client-portal',
  branch: string = 'main'
): Promise<void> {
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;

  // First, get the current file SHA (required for updates)
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

  // Update or create the file
  const payload: any = {
    message: `Auto-update: Campaign data sync at ${new Date().toISOString()}`,
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

export default {
  async scheduled(
    event: ScheduledEvent,
    env: {
      SMARTLEAD_API_KEY: string;
      GITHUB_TOKEN: string;
    },
    ctx: ExecutionContext
  ): Promise<void> {
    console.log('🔄 Starting daily campaign sync...');
    console.log(`Scheduled time: ${new Date(event.scheduledTime).toISOString()}`);

    try {
      // Fetch all campaigns from Smartlead
      console.log('📋 Fetching all campaigns from Smartlead...');
      const campaigns: Campaign[] = await fetchSmartlead('/campaigns/', env.SMARTLEAD_API_KEY);
      console.log(`✅ Fetched ${campaigns.length} total campaigns`);

      // Process campaigns for each client
      const clients = Object.keys(CLIENT_NAMES);

      for (const clientId of clients) {
        console.log(`\n🔄 Processing ${clientId}...`);

        const campaignData = await processCampaignsForClient(
          clientId,
          campaigns,
          env.SMARTLEAD_API_KEY
        );

        // Save to JSON file
        const jsonContent = JSON.stringify(campaignData, null, 2);
        const filePath = `public/campaigns/${clientId}.json`;

        await updateGitHubFile(
          filePath,
          jsonContent,
          env.GITHUB_TOKEN
        );

        console.log(`✅ Updated ${filePath} with ${campaignData.length} campaigns`);
      }

      console.log('\n✅ Daily campaign sync completed successfully!');

    } catch (error) {
      console.error('❌ Error during campaign sync:', error);
      throw error;
    }
  },
};
