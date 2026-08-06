/**
 * Cloudflare Scheduled Worker - Daily Campaign Sync
 *
 * Runs daily at 4 AM CEST (2 AM UTC) to:
 * 1. Fetch all campaigns from Smartlead API
 * 2. Filter campaigns by client name prefix
 * 3. Get analytics/lead counts for each campaign
 * 4. Update JSON files in GitHub repo for each client
 *
 * Clients and their prefixes:
 * - Intelsol: 🏆 Intelsol
 * - TSLab: 🏆 TS Lab
 * - Demo: 🏆 Demo
 * - Xpose: 🏆 Xpose
 * - BeeIT: 🏆 BeeIT
 * - Wulf: 🏆 Wulf
 * - PeopleFocus: 🏆 PeopleFocus
 * - Plantryx: 🏆 Plantryx
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
  campaign_lead_stats?: any;
}

interface ProcessedCampaign {
  campaignName: string;
  dateLaunched: string;
  leadsAdded: number;
  month: string;
}

const CLIENT_PREFIXES: Record<string, string> = {
  'intelsol': '🏆 Intelsol',
  'tslab': '🏆 TS Lab',
  'demo': '🏆 Demo',
  'xpose': '🏆 Xpose',
  'beeit': '🏆 BeeIT',
  'wulf': '🏆 Wulf',
  'peoplefocus': '🏆 PeopleFocus',
  'plantryx': '🏆 Plantryx',
};

const SMARTLEAD_BASE_URL = 'https://server.smartlead.ai/api/v1';

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
  const prefix = CLIENT_PREFIXES[clientId];
  if (!prefix) {
    throw new Error(`Unknown client ID: ${clientId}`);
  }

  // Filter campaigns by prefix
  const clientCampaigns = campaigns.filter(c =>
    c.name && c.name.startsWith(prefix)
  );

  console.log(`Found ${clientCampaigns.length} campaigns for ${clientId}`);

  const processed: ProcessedCampaign[] = [];

  // Fetch analytics for each campaign to get lead counts
  for (const campaign of clientCampaigns) {
    try {
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));

      const analytics: CampaignAnalytics = await fetchSmartlead(
        `/campaigns/${campaign.id}/analytics`,
        apiKey
      );

      // Use unique_sent_count as the "imported leads" metric
      // This represents the total unique leads that have been contacted
      const leadsAdded = parseInt(String(analytics.unique_sent_count || 0));

      processed.push({
        campaignName: campaign.name,
        dateLaunched: formatDate(campaign.created_at),
        leadsAdded: leadsAdded,
        month: getMonthName(campaign.created_at),
      });

    } catch (error) {
      console.error(`Error fetching analytics for campaign ${campaign.id}:`, error);
      // Still include campaign with 0 leads if analytics fetch fails
      processed.push({
        campaignName: campaign.name,
        dateLaunched: formatDate(campaign.created_at),
        leadsAdded: 0,
        month: getMonthName(campaign.created_at),
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
      const clients = Object.keys(CLIENT_PREFIXES);

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
