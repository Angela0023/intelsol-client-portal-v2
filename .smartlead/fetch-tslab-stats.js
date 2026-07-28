#!/usr/bin/env node

/**
 * Fetch TSLab Campaign Statistics from SmartLead API
 *
 * This script:
 * 1. Reads API credentials from credentials.json
 * 2. Fetches all campaigns from SmartLead
 * 3. Filters for TSLab campaigns
 * 4. Fetches detailed analytics for each campaign
 * 5. Saves the data to tslab-stats.json
 *
 * Usage: node .smartlead/fetch-tslab-stats.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Read credentials
const credentialsPath = path.join(__dirname, 'credentials.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

const { apiKey, baseUrl } = credentials;

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

async function main() {
  console.log('🔄 Fetching TSLab campaign statistics from SmartLead...\n');

  try {
    // Step 1: Fetch all campaigns
    console.log('📋 Fetching all campaigns...');
    const campaigns = await fetchAPI('/campaigns/');

    // Step 2: Filter for TSLab campaigns
    const tslabCampaigns = campaigns.filter(c =>
      c.name && c.name.toLowerCase().includes('ts lab')
    );

    console.log(`✅ Found ${tslabCampaigns.length} TSLab campaigns\n`);

    // Step 3: Fetch analytics for each campaign
    const stats = [];

    for (const campaign of tslabCampaigns) {
      console.log(`📊 Fetching stats for: ${campaign.name}`);

      try {
        const data = await fetchAPI(`/campaigns/${campaign.id}/analytics`);

        const totalLeads = parseInt(data.unique_sent_count || 0);
        const emailsSent = parseInt(data.sent_count || 0);
        const replies = parseInt(data.reply_count || 0);
        const opens = parseInt(data.unique_open_count || 0);
        const clicks = parseInt(data.unique_click_count || 0);
        const bounces = parseInt(data.bounce_count || 0);
        const unsubscribed = parseInt(data.unsubscribed_count || 0);
        const positiveReplies = data.campaign_lead_stats?.interested || 0;

        stats.push({
          id: data.id,
          name: data.name,
          status: data.status,
          totalLeads: totalLeads,
          emailsSent: emailsSent,
          opens: opens,
          clicks: clicks,
          replies: replies,
          bounces: bounces,
          unsubscribed: unsubscribed,
          openRate: totalLeads > 0 ? ((opens / totalLeads) * 100).toFixed(2) : 0,
          clickRate: totalLeads > 0 ? ((clicks / totalLeads) * 100).toFixed(2) : 0,
          replyRate: totalLeads > 0 ? ((replies / totalLeads) * 100).toFixed(2) : 0,
          positiveReplies: positiveReplies,
          leadStats: data.campaign_lead_stats || {},
          lastUpdated: new Date().toISOString()
        });

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (err) {
        console.error(`   ❌ Error fetching analytics for campaign ${campaign.id}: ${err.message}`);
      }
    }

    // Step 4: Save to JSON file
    const outputPath = path.join(__dirname, 'tslab-stats.json');
    const output = {
      lastUpdated: new Date().toISOString(),
      totalCampaigns: stats.length,
      campaigns: stats,
      summary: {
        totalLeads: stats.reduce((sum, c) => sum + c.totalLeads, 0),
        totalEmailsSent: stats.reduce((sum, c) => sum + c.emailsSent, 0),
        totalReplies: stats.reduce((sum, c) => sum + c.replies, 0),
        totalPositiveReplies: stats.reduce((sum, c) => sum + c.positiveReplies, 0),
        avgReplyRate: stats.length > 0 ? (stats.reduce((sum, c) => sum + parseFloat(c.replyRate), 0) / stats.length).toFixed(2) : 0
      }
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    console.log(`\n✅ Stats saved to ${outputPath}`);
    console.log(`\n📊 Summary:`);
    console.log(`   Total Campaigns: ${output.totalCampaigns}`);
    console.log(`   Total Leads: ${output.summary.totalLeads}`);
    console.log(`   Total Emails Sent: ${output.summary.totalEmailsSent}`);
    console.log(`   Total Replies: ${output.summary.totalReplies}`);
    console.log(`   Positive Replies: ${output.summary.totalPositiveReplies}`);
    console.log(`   Avg Reply Rate: ${output.summary.avgReplyRate}%`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
