#!/usr/bin/env node

/**
 * Sync All Client Campaigns from SmartLead API
 *
 * This script:
 * 1. Reads API credentials from credentials.json
 * 2. Fetches all campaigns from SmartLead
 * 3. Filters campaigns by client name prefix
 * 4. Fetches analytics for each campaign to get lead counts
 * 5. Saves campaign data to public/campaigns/{client}.json for each client
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
 *
 * Usage: node .smartlead/sync-all-campaigns.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Read credentials
const credentialsPath = path.join(__dirname, 'credentials.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

const { apiKey, baseUrl } = credentials;

// Client prefixes
const CLIENT_PREFIXES = {
  'intelsol': '🏆 Intelsol',
  'tslab': '🏆 TS Lab',
  'demo': '🏆 Demo',
  'xpose': '🏆 Xpose',
  'beeit': '🏆 BeeIT',
  'wulf': '🏆 Wulf',
  'peoplefocus': '🏆 PeopleFocus',
  'plantryx': '🏆 Plantryx',
};

// Helper function to make API requests
function fetchAPI(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${apiKey}`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${e.message}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Format date as M/D/YYYY
function formatDate(dateString) {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

// Get month name from date
function getMonthName(dateString) {
  const date = new Date(dateString);
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return months[date.getMonth()];
}

// Process campaigns for a specific client
async function processCampaignsForClient(clientId, allCampaigns) {
  const prefix = CLIENT_PREFIXES[clientId];
  if (!prefix) {
    throw new Error(`Unknown client ID: ${clientId}`);
  }

  console.log(`\n🔄 Processing ${clientId}...`);

  // Filter campaigns by prefix
  const clientCampaigns = allCampaigns.filter(c =>
    c.name && c.name.startsWith(prefix)
  );

  console.log(`   Found ${clientCampaigns.length} campaigns for ${clientId}`);

  const processed = [];

  // Fetch analytics for each campaign
  for (const campaign of clientCampaigns) {
    try {
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));

      const analytics = await fetchAPI(`/campaigns/${campaign.id}/analytics`);

      // Use unique_sent_count as the "imported leads" metric
      const leadsAdded = parseInt(analytics.unique_sent_count || 0);

      processed.push({
        campaignName: campaign.name,
        dateLaunched: formatDate(campaign.created_at),
        leadsAdded: leadsAdded,
        month: getMonthName(campaign.created_at),
      });

    } catch (error) {
      console.error(`   ❌ Error fetching analytics for campaign ${campaign.id}: ${error.message}`);
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

async function main() {
  console.log('🔄 Syncing all client campaigns from SmartLead...\n');

  try {
    // Step 1: Fetch all campaigns
    console.log('📋 Fetching all campaigns from SmartLead...');
    const allCampaigns = await fetchAPI('/campaigns/');
    console.log(`✅ Fetched ${allCampaigns.length} total campaigns\n`);

    // Step 2: Process each client
    const clients = Object.keys(CLIENT_PREFIXES);
    const results = {};

    for (const clientId of clients) {
      const campaignData = await processCampaignsForClient(clientId, allCampaigns);
      results[clientId] = campaignData;

      // Save to JSON file
      const outputDir = path.join(__dirname, '..', 'public', 'campaigns');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const outputPath = path.join(outputDir, `${clientId}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(campaignData, null, 2));

      console.log(`   ✅ Saved ${campaignData.length} campaigns to ${outputPath}`);

      // Summary
      const totalLeads = campaignData.reduce((sum, c) => sum + c.leadsAdded, 0);
      console.log(`   📊 Total leads: ${totalLeads.toLocaleString()}`);
    }

    console.log('\n✅ All client campaigns synced successfully!');
    console.log('\n📊 Summary:');
    for (const [clientId, data] of Object.entries(results)) {
      const totalLeads = data.reduce((sum, c) => sum + c.leadsAdded, 0);
      console.log(`   ${clientId}: ${data.length} campaigns, ${totalLeads.toLocaleString()} leads`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
