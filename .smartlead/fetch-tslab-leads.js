#!/usr/bin/env node

/**
 * Fetch All TSLab Leads from SmartLead API
 *
 * This script:
 * 1. Reads API credentials from credentials.json
 * 2. Fetches all campaigns from SmartLead
 * 3. Filters for TSLab campaigns
 * 4. Fetches all leads from each campaign
 * 5. Exports to CSV with all available data
 *
 * Usage: node .smartlead/fetch-tslab-leads.js
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

// Helper to convert array of objects to CSV
function arrayToCSV(data) {
  if (data.length === 0) return '';

  // Get all unique headers from all objects
  const headers = new Set();
  data.forEach(row => {
    Object.keys(row).forEach(key => headers.add(key));
  });
  const headerArray = Array.from(headers);

  // Create CSV header row
  const csvRows = [];
  csvRows.push(headerArray.map(h => `"${h}"`).join(','));

  // Create data rows
  data.forEach(row => {
    const values = headerArray.map(header => {
      const value = row[header] || '';
      // Escape quotes and wrap in quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  });

  return csvRows.join('\n');
}

async function main() {
  console.log('🔄 Fetching all TSLab leads from SmartLead...\n');

  try {
    // Step 1: Fetch all campaigns
    console.log('📋 Fetching all campaigns...');
    const campaigns = await fetchAPI('/campaigns/');

    // Step 2: Filter for TSLab campaigns
    const tslabCampaigns = campaigns.filter(c =>
      c.name && c.name.toLowerCase().includes('ts lab')
    );

    console.log(`✅ Found ${tslabCampaigns.length} TSLab campaigns\n`);

    // Step 3: Fetch leads from each campaign
    const allLeads = [];
    let totalLeadsCount = 0;

    for (const campaign of tslabCampaigns) {
      console.log(`📊 Fetching leads from: ${campaign.name}`);

      try {
        // Fetch first page to get total count
        const firstPage = await fetchAPI(`/campaigns/${campaign.id}/leads`);
        const totalLeadsInCampaign = parseInt(firstPage.total_leads || 0);

        console.log(`   Total leads in campaign: ${totalLeadsInCampaign}`);

        // Fetch all pages if there are more than 100 leads
        let offset = 0;
        let campaignLeads = [];

        while (offset < totalLeadsInCampaign) {
          const response = await fetchAPI(`/campaigns/${campaign.id}/leads?offset=${offset}`);

          if (response && response.data && Array.isArray(response.data)) {
            // Process each lead
            response.data.forEach(item => {
              const lead = item.lead || {};
              const customFields = lead.custom_fields || {};

              campaignLeads.push({
                campaign_name: campaign.name,
                campaign_id: campaign.id,
                campaign_status: item.status || '',
                first_name: lead.first_name || '',
                last_name: lead.last_name || '',
                email: lead.email || '',
                company_name: lead.company_name || '',
                website: lead.website || '',
                linkedin_profile: lead.linkedin_profile || '',
                phone_number: lead.phone_number || '',
                location: lead.location || '',
                lead_id: lead.id || '',
                is_unsubscribed: lead.is_unsubscribed || false,
                date_added: item.created_at || '',
                // Add all custom fields (these might include position/job title)
                ...customFields
              });
            });

            offset += response.data.length;

            // Small delay between pages
            if (offset < totalLeadsInCampaign) {
              await new Promise(resolve => setTimeout(resolve, 200));
            }
          } else {
            break;
          }
        }

        console.log(`   ✅ Fetched ${campaignLeads.length} leads`);
        allLeads.push(...campaignLeads);
        totalLeadsCount += campaignLeads.length;

        // Delay between campaigns
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (err) {
        console.error(`   ❌ Error fetching leads for campaign ${campaign.id}: ${err.message}`);
      }
    }

    // Step 4: Export to CSV
    const outputPath = path.join(__dirname, 'tslab-leads.csv');
    const csv = arrayToCSV(allLeads);
    fs.writeFileSync(outputPath, csv);

    console.log(`\n✅ Successfully exported ${totalLeadsCount} leads to ${outputPath}`);
    console.log(`\n📊 Summary:`);
    console.log(`   Total Campaigns: ${tslabCampaigns.length}`);
    console.log(`   Total Leads: ${totalLeadsCount}`);
    console.log(`\n💡 Next step: Copy to public directory for client access:`);
    console.log(`   cp .smartlead/tslab-leads.csv public/data/tslab-leads.csv`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
