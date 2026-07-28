# SmartLead Campaign Statistics

This directory contains scripts to fetch real campaign statistics from SmartLead's API and display them on the client portal.

## Setup

### Credentials File
The `credentials.json` file (gitignored) contains your SmartLead API key:

```json
{
  "apiKey": "your-api-key-here",
  "baseUrl": "https://server.smartlead.ai/api/v1"
}
```

## How to Update Campaign Stats

### For TSLab

1. **Fetch latest stats from SmartLead:**
   ```bash
   node .smartlead/fetch-tslab-stats.js
   ```

   This will:
   - Connect to SmartLead API
   - Find all campaigns with "TS Lab" in the name
   - Fetch analytics for each campaign
   - Save results to `.smartlead/tslab-stats.json`

2. **Copy to public directory:**
   ```bash
   cp .smartlead/tslab-stats.json public/data/tslab-stats.json
   ```

3. **Commit and push to GitHub:**
   ```bash
   git add public/data/tslab-stats.json
   git commit -m "Update: TSLab campaign statistics"
   git push origin main
   ```

4. The site will automatically rebuild and deploy with the new stats

## One-Command Update (TSLab)

Run all steps at once:

```bash
node .smartlead/fetch-tslab-stats.js && \
cp .smartlead/tslab-stats.json public/data/tslab-stats.json && \
git add public/data/tslab-stats.json && \
git commit -m "Update: TSLab campaign stats $(date +'%Y-%m-%d')" && \
git push origin main
```

## Data Structure

The stats JSON file contains:

```json
{
  "lastUpdated": "2026-07-28T16:38:31.797Z",
  "totalCampaigns": 12,
  "campaigns": [
    {
      "id": 3618907,
      "name": "TS Lab | Decision Makers | 10/Jul/2026",
      "status": "ACTIVE" | "COMPLETED" | "PAUSED",
      "totalLeads": 85,
      "emailsSent": 232,
      "replies": 11,
      "positiveReplies": 2,
      "replyRate": "12.94",
      "leadStats": { ... }
    }
  ],
  "summary": {
    "totalLeads": 811,
    "totalEmailsSent": 1270,
    "totalReplies": 109,
    "totalPositiveReplies": 13,
    "avgReplyRate": "12.01"
  }
}
```

## Adding More Clients

To add stats for another client (e.g., Intelsol):

1. Copy `fetch-tslab-stats.js` to `fetch-intelsol-stats.js`
2. Update the campaign filter: change `'ts lab'` to `'intelsol'`
3. Update output path: `'intelsol-stats.json'`
4. Create corresponding Performance component in `app/components/`
5. Update the client's page to use the new component

## Troubleshooting

**No campaigns found:**
- Check the filter string in the fetch script matches your campaign names
- Verify API key is correct in `credentials.json`

**All stats showing 0:**
- Check that campaigns have actually been launched in SmartLead
- Verify the API endpoint is returning data (use `test-api.js`)

**Stats not updating on site:**
- Make sure you copied the file to `public/data/`
- Verify the file was committed and pushed to GitHub
- Check the browser console for fetch errors
