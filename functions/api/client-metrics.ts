/**
 * API endpoint to fetch client metrics from Smartlead
 *
 * Returns:
 * - Mailbox count
 * - Sending capacity per mailbox
 * - Total sending capacity
 * - Remaining leads (not yet contacted)
 * - Days of capacity remaining
 */

interface Mailbox {
  id: number;
  from_email: string;
  from_name: string;
  message_per_day: number;
  warmup_details?: {
    status: string;
    max_email_per_day: number;
    warmup_reputation: string;
  };
}

interface Campaign {
  id: number;
  name: string;
  status: string;
  email_accounts?: Array<{
    from_email: string;
  }>;
}

interface CampaignDetail {
  name: string;
  status: string;
  totalLeads: number;
  sentCount: number;
  remainingLeads: number;
}

interface LeadStats {
  total_leads: number;
  total_count: number;
}

// Client names for matching
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
};

const SMARTLEAD_BASE_URL = 'https://server.smartlead.ai/api/v1';

// Remove emoji from text
function removeEmoji(text: string): string {
  const emojiPattern = /[\u{1F1E0}-\u{1F1FF}\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}]+/gu;
  return text.replace(emojiPattern, '').trim();
}

// Check if campaign matches client name
function matchesCampaign(campaignName: string, clientName: string): boolean {
  const withoutEmoji = removeEmoji(campaignName);
  const normalizedCampaign = withoutEmoji.toLowerCase().replace(/[\s-]/g, '');
  const normalizedClient = clientName.toLowerCase().replace(/[\s-]/g, '');
  return normalizedCampaign.startsWith(normalizedClient);
}

// Check if mailbox domain contains client name
function matchesMailbox(email: string, clientName: string): boolean {
  // Extract domain (everything after @)
  const domain = email.split('@')[1] || '';
  const normalizedDomain = domain.toLowerCase().replace(/[\s-]/g, '');
  const normalizedClient = clientName.toLowerCase().replace(/[\s-]/g, '');
  return normalizedDomain.includes(normalizedClient);
}

async function fetchSmartlead(endpoint: string, apiKey: string): Promise<any> {
  const url = `${SMARTLEAD_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Smartlead API error: ${response.status}`);
  }

  return await response.json();
}

export async function onRequest(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  const clientId = url.searchParams.get('clientId');

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!clientId) {
    return new Response(JSON.stringify({ error: 'clientId parameter required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const clientName = CLIENT_NAMES[clientId];
  if (!clientName) {
    return new Response(JSON.stringify({ error: 'Invalid clientId' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const apiKey = env.SMARTLEAD_API_KEY;
    if (!apiKey) {
      throw new Error('SMARTLEAD_API_KEY not configured');
    }

    // Fetch mailboxes
    const allMailboxes: Mailbox[] = await fetchSmartlead('/email-accounts', apiKey);

    // Debug: Log all mailboxes for this check
    console.log(`[${clientId}] Total mailboxes in Smartlead: ${allMailboxes.length}`);

    const clientMailboxes = allMailboxes.filter(m => matchesMailbox(m.from_email, clientName));

    // Debug: Show which mailboxes matched and which didn't
    console.log(`[${clientId}] Matched ${clientMailboxes.length} mailboxes`);
    if (clientId === 'intelsol') {
      console.log(`[${clientId}] Matched mailbox domains:`, clientMailboxes.map(m => m.from_email).slice(0, 5));
      const unmatched = allMailboxes.filter(m => !matchesMailbox(m.from_email, clientName));
      console.log(`[${clientId}] Unmatched mailbox domains (first 10):`, unmatched.map(m => m.from_email).slice(0, 10));
    }

    // Fetch campaigns
    const allCampaigns: Campaign[] = await fetchSmartlead('/campaigns/', apiKey);
    const clientCampaigns = allCampaigns.filter(c => matchesCampaign(c.name, clientName));

    // Get mailboxes assigned to campaigns
    const emailsInCampaigns = new Set<string>();

    // First check if campaigns list already includes email_accounts
    console.log(`[${clientId}] Checking ${clientCampaigns.length} campaigns for email accounts`);

    for (const campaign of clientCampaigns) {
      // Check if campaign object already has email_accounts
      if (campaign.email_accounts && Array.isArray(campaign.email_accounts)) {
        console.log(`[${clientId}] Campaign ${campaign.id} has ${campaign.email_accounts.length} email accounts in list`);
        campaign.email_accounts.forEach((account: any) => {
          if (account.from_email) {
            emailsInCampaigns.add(account.from_email.toLowerCase());
          }
        });
      } else {
        // Try fetching individual campaign details
        try {
          const campaignDetail = await fetchSmartlead(`/campaigns/${campaign.id}`, apiKey);
          console.log(`[${clientId}] Fetched campaign ${campaign.id} details, has email_accounts:`, !!campaignDetail.email_accounts);

          if (campaignDetail.email_accounts && Array.isArray(campaignDetail.email_accounts)) {
            console.log(`[${clientId}] Campaign ${campaign.id} details has ${campaignDetail.email_accounts.length} email accounts`);
            campaignDetail.email_accounts.forEach((account: any) => {
              if (account.from_email) {
                emailsInCampaigns.add(account.from_email.toLowerCase());
              }
            });
          }
        } catch (err) {
          console.error(`[${clientId}] Error fetching campaign ${campaign.id} details:`, err);
        }
      }
    }

    console.log(`[${clientId}] Total unique emails in campaigns: ${emailsInCampaigns.size}`);
    console.log(`[${clientId}] Emails in campaigns:`, Array.from(emailsInCampaigns));

    // Calculate total sending capacity
    const mailboxDetails = clientMailboxes.map(mb => {
      const capacity = mb.message_per_day || mb.warmup_details?.max_email_per_day || 0;
      const inCampaign = emailsInCampaigns.size === 0 || emailsInCampaigns.has(mb.from_email.toLowerCase());

      return {
        email: mb.from_email,
        name: mb.from_name,
        capacity: capacity,
        status: mb.warmup_details?.status || 'N/A',
        reputation: mb.warmup_details?.warmup_reputation || 'N/A',
        inCampaign: inCampaign,
      };
    });

    // If we got campaign email data, use it; otherwise count all mailboxes
    const totalCapacity = emailsInCampaigns.size > 0
      ? mailboxDetails.filter(mb => mb.inCampaign).reduce((sum, mb) => sum + mb.capacity, 0)
      : mailboxDetails.reduce((sum, mb) => sum + mb.capacity, 0);

    console.log(`[${clientId}] Total capacity: ${totalCapacity} (from ${mailboxDetails.filter(mb => mb.inCampaign).length} mailboxes)`);

    // Count remaining leads and collect campaign details
    let remainingLeads = 0;
    const campaignDetails: CampaignDetail[] = [];

    console.log(`[${clientId}] Processing ${clientCampaigns.length} campaigns for lead counts`);

    for (const campaign of clientCampaigns) {
      try {
        // Get lead counts for this campaign
        const leadsResponse: LeadStats = await fetchSmartlead(
          `/campaigns/${campaign.id}/leads?limit=1&offset=0`,
          apiKey
        );

        // Get analytics to find how many have been sent
        const analytics = await fetchSmartlead(`/campaigns/${campaign.id}/analytics`, apiKey);
        const sentCount = parseInt(String(analytics.unique_sent_count || 0));

        // Total leads - sent = remaining
        const totalLeads = leadsResponse.total_leads || leadsResponse.total_count || 0;
        const remaining = Math.max(0, totalLeads - sentCount);

        console.log(`[${clientId}] Campaign ${campaign.name}: total=${totalLeads}, sent=${sentCount}, remaining=${remaining}, status=${campaign.status}`);

        // Add to campaign details
        campaignDetails.push({
          name: campaign.name,
          status: campaign.status,
          totalLeads: totalLeads,
          sentCount: sentCount,
          remainingLeads: remaining,
        });

        // Only count ACTIVE campaigns toward remaining leads total
        if (campaign.status === 'ACTIVE') {
          remainingLeads += remaining;
        }
      } catch (err) {
        console.error(`[${clientId}] Error fetching leads for campaign ${campaign.id}:`, err);
        // Still add campaign with zero counts if error
        campaignDetails.push({
          name: campaign.name,
          status: campaign.status,
          totalLeads: 0,
          sentCount: 0,
          remainingLeads: 0,
        });
      }
    }

    console.log(`[${clientId}] Total remaining leads from ACTIVE campaigns: ${remainingLeads}`);

    // Calculate days remaining
    const daysRemaining = totalCapacity > 0 ? Math.ceil(remainingLeads / totalCapacity) : 0;

    const result = {
      clientId,
      clientName,
      mailboxCount: clientMailboxes.length,
      totalCapacity,
      remainingLeads,
      daysRemaining,
      mailboxes: mailboxDetails,
      campaigns: campaignDetails,
      activeCampaigns: campaignDetails.filter(c => c.status === 'ACTIVE').length,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error fetching client metrics:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
