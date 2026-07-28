const https = require('https');

const apiKey = 'ff44f2a9-de08-4d8e-82c4-1be91080598f_s6jwdve';
const campaignId = '3618907';  // The completed campaign

const url = `https://server.smartlead.ai/api/v1/campaigns/${campaignId}/analytics?api_key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Raw API Response:');
    console.log(JSON.stringify(JSON.parse(data), null, 2));
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
