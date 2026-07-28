#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const credentials = JSON.parse(fs.readFileSync(path.join(__dirname, 'credentials.json'), 'utf8'));
const { apiKey, baseUrl } = credentials;

function fetchAPI(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${apiKey}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${e.message}\nResponse: ${data}`));
        }
      });
    }).on('error', reject);
  });
}

async function testEndpoints() {
  try {
    console.log('Testing SmartLead API endpoints...\n');

    // Test campaign ID 3618907 (TS Lab | Decision Makers)
    const campaignId = 3618907;

    console.log('1. Campaign Analytics:');
    try {
      const analytics = await fetchAPI(`/campaigns/${campaignId}/analytics`);
      console.log(JSON.stringify(analytics, null, 2));
    } catch (e) {
      console.log('Error:', e.message);
    }

    console.log('\n2. Campaign Details:');
    try {
      const details = await fetchAPI(`/campaigns/${campaignId}`);
      console.log(JSON.stringify(details, null, 2));
    } catch (e) {
      console.log('Error:', e.message);
    }

    console.log('\n3. Campaign Stats:');
    try {
      const stats = await fetchAPI(`/campaigns/${campaignId}/stats`);
      console.log(JSON.stringify(stats, null, 2));
    } catch (e) {
      console.log('Error:', e.message);
    }

  } catch (error) {
    console.error('Fatal error:', error.message);
  }
}

testEndpoints();
