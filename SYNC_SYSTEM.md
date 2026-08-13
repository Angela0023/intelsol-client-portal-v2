# Client Data Sync System - Documentation

**Last Updated:** 2026-08-13
**Implemented:** 2026-08-12 to 2026-08-13

---

## Overview

The Client Data Sync System automatically fetches lead databases and campaign performance statistics from SmartLead and updates the client portal. This system standardized what was previously an Intelsol-only feature to work for all clients.

---

## Features Implemented

### 1. Generic Documents Tab with Auto-Sync (All Clients)

**Component:** `/app/components/DocumentsTabGeneric.tsx`

**What it does:**
- Displays uploaded documents (file upload/download)
- Shows downloadable lead database CSV
- Provides "Update Database" button to trigger sync
- Shows last updated timestamp
- Color-coded by client accent (violet/green/blue/amber)

**Clients using this:**
- Intelsol (violet)
- TS Lab (green)
- Xpose (blue)
- All future clients

**Usage:**
```tsx
<DocumentsTabGeneric
  clientId="intelsol"
  clientName="Intelsol"
  totalLeads={39318}
  totalCampaigns={72}
  accentColor="violet"
/>
```

### 2. Generic Sync Workflow

**File:** `.github/workflows/sync-client-data.yml`

**What it does:**
- Fetches all campaigns from SmartLead for specified client(s)
- Downloads lead data from each campaign (via Python script)
- Fetches campaign analytics and performance stats (via Node.js script)
- Commits updated files to GitHub
- Runs daily at 4 AM CEST automatically
- Can be triggered manually via API endpoint

**Triggers:**
- **Automatic:** Daily at 4 AM CEST (cron: `0 2 * * *`)
- **Manual:** Via "Update Database" button on portal
- **Manual:** GitHub Actions UI (workflow_dispatch)

**Parameters:**
- `client_id`: Which client to sync (intelsol, tslab, xpose, etc., or "all")

**Steps:**
1. Checkout repository
2. Setup Python 3.11
3. Install Python dependencies (requests, python-dotenv)
4. Setup Node.js 20
5. Create inline Python sync script
6. Determine which clients to sync
7. Sync lead databases (Python)
8. Sync campaign stats (Node.js)
9. Check for changes
10. Commit and push if changes detected (with rebase)

### 3. Generic API Endpoint

**File:** `/functions/api/sync-client-data.ts`

**What it does:**
- Accepts `clientId` parameter (query param or request body)
- Validates clientId against allowed list
- Triggers GitHub Actions workflow via GitHub API
- Returns success/error response

**Valid Client IDs:**
- intelsol
- tslab
- demo
- xpose
- beeit
- wulf
- peoplefocus
- plantryx
- all

**API Usage:**
```bash
# Trigger sync for specific client
POST /api/sync-client-data?clientId=intelsol

# Or via request body
POST /api/sync-client-data
{
  "clientId": "intelsol"
}
```

**Response:**
```json
{
  "success": true,
  "message": "intelsol data sync triggered successfully. Check GitHub Actions for progress.",
  "clientId": "intelsol"
}
```

### 4. Database Files Generated

**Location:** `/public/data/`

**Files:**
- `intelsol-database.csv` - 39,318 leads across 72 campaigns
- `tslab-database.csv` - 3,021 leads across 12 campaigns
- `xpose-database.csv` - 1,477 leads across 2 campaigns

**CSV Format:**
```csv
first_name,last_name,email,company_name,website,linkedin_url,campaign_name
```

### 5. Campaign Stats Files

**Location:** `/public/campaigns/`

**Files:**
- `intelsol.json` - 72 campaigns
- `tslab.json` - 12 campaigns
- `xpose.json` - 2 campaigns

**JSON Structure:**
```json
[
  {
    "campaignName": "🏆 Intelsol | Campaign Name",
    "dateLaunched": "8/12/2026",
    "totalLeads": 1381,
    "leadsEmailed": 172,
    "month": "August",
    "status": "ACTIVE",
    "performance": {
      "emailsSent": 345,
      "opens": 123,
      "openRate": "35.65",
      "clicks": 45,
      "clickRate": "13.04",
      "replies": 12,
      "replyRate": "3.48",
      "bounces": 5,
      "bounceRate": "1.45",
      "unsubscribed": 2,
      "interested": 8,
      "interestedRate": "2.32",
      "notInterested": 4
    }
  }
]
```

### 6. Heat Map Color Gradient for Performance

**File:** `/app/components/PerformanceTabDynamic.tsx`

**What it does:**
- Dynamically colors reply rates and positive rates based on performance
- Colors are calculated relative to max value in each column
- Makes it easy to visually identify top and bottom performers

**Color Scale:**
- **0%:** Red (worst)
- **1-20%:** Dark red
- **21-40%:** Orange
- **41-60%:** Yellow
- **61-80%:** Lime green
- **81-99%:** Green
- **100%/Highest:** Dark green (best)

---

## How the Sync Works

### Python Script (Lead Database)

**Created inline in workflow at runtime**

**Process:**
1. Fetch all campaigns from SmartLead API
2. Filter campaigns by client prefix (🏆 Intelsol, 🧪 TS Lab, etc.)
3. For each campaign:
   - Call `/campaigns/{id}/leads-export` endpoint
   - Parse CSV response
   - Deduplicate by email
   - Collect all leads
4. Save to `public/data/{client_id}-database.csv`

**Client Prefixes:**
```python
CLIENT_PREFIXES = {
    'intelsol': '🏆 Intelsol',
    'tslab': '🧪 TS Lab',
    'demo': '🏆 Demo',
    'xpose': '💥 Xpose',
    'beeit': '🏆 BeeIT',
    'wulf': '🏆 Wulf',
    'peoplefocus': '🎯 People Focus',
    'plantryx': '🏆 Plantryx',
}
```

### Node.js Script (Campaign Stats)

**File:** `.smartlead/sync-all-campaigns.js`

**Process:**
1. Read API credentials from `.smartlead/credentials.json`
2. Fetch all campaigns from SmartLead API
3. Filter campaigns by client prefix
4. For each campaign:
   - **Call `/campaigns/{id}/analytics`** → get contacted leads count
   - **Call `/campaigns/{id}/leads?limit=1`** → get total uploaded leads count
   - Calculate performance metrics
   - Calculate rates based on leads emailed
5. Sort campaigns by date (newest first)
6. Save to `public/campaigns/{client_id}.json`

**Key Metrics:**
- **totalLeads:** Total leads uploaded to campaign (from leads API)
- **leadsEmailed:** Leads contacted so far (from analytics API)
- **emailsSent:** Total emails sent (includes follow-ups)
- **replies, opens, clicks, bounces, interested, notInterested**
- **Rates:** Calculated as percentage of leadsEmailed

---

## Issues Encountered and Fixes

### Issue #1: Missing User-Agent Header (403 Error)

**Date:** 2026-08-12
**Error:** `Request forbidden by administrative rules. Please make sure your request has a User-Agent header`

**Cause:** GitHub API requires User-Agent header in all requests

**Fix:** Added `'User-Agent': 'Intelsol-Client-Portal'` to API request headers

**File:** `/functions/api/sync-client-data.ts:84`

**Commit:** `1cb18ca` - "Fix: Add User-Agent header to GitHub API request"

---

### Issue #2: Build Failure - Malformed JSX

**Date:** 2026-08-12
**Error:** `Expected '</', got 'jsx text' at line 1719`

**Cause:** Stray closing tags left behind when removing old DocumentsTab function

**Fix:** Removed stray `</p>` and extra `</div>` tags

**File:** `/app/intelsol/page.tsx:1719`

**Commit:** `e67dfd1` - "Fix: Remove stray closing tags in Intelsol page"

---

### Issue #3: Total Leads = Emailed Leads (Incorrect Data)

**Date:** 2026-08-12 to 2026-08-13
**Error:** TOTAL and EMAILED columns showed same numbers

**Cause:** Sync script tried to use `campaign.total_leads` field which doesn't exist in SmartLead API response, so it fell back to `analytics.unique_sent_count`

**Attempts:**
1. **First attempt:** Used `campaign.total_leads` field → didn't exist
2. **Second attempt:** Used `analytics.total_lead_count` → not reliable

**Final Fix:** Added second API call to `/campaigns/{id}/leads?limit=1` to get actual total uploaded lead count from `total_leads` or `total_count` field in leads API response

**File:** `.smartlead/sync-all-campaigns.js:117-125`

**Commits:**
- `5b1f015` - "Fix: Get total leads from campaign object, not analytics fallback"
- `83db89e` - "Fix: Fetch total lead count from leads API, not analytics"

**Code:**
```javascript
// Fetch analytics to get contacted leads count
const analytics = await fetchAPI(`/campaigns/${campaign.id}/analytics`);

// Small delay between API calls to avoid rate limiting
await new Promise(resolve => setTimeout(resolve, 100));

// Fetch leads to get TOTAL uploaded lead count (not just contacted)
const leadsResponse = await fetchAPI(`/campaigns/${campaign.id}/leads?limit=1&offset=0`);

const totalLeads = parseInt(leadsResponse.total_leads || leadsResponse.total_count || 0);
const leadsEmailed = parseInt(analytics.unique_sent_count || 0);
```

---

### Issue #4: Misleading Success Message

**Date:** 2026-08-13
**Error:** Message said "updated successfully" immediately, but sync actually takes 3-5 minutes

**Cause:** Success alert triggered when workflow started, not when it completed

**Fix:** Changed message to "sync started successfully" with instructions to wait 3-5 minutes and manually refresh

**File:** `/app/components/DocumentsTabGeneric.tsx:42`

**Old Message:**
```
Intelsol database and performance stats updated successfully!
```

**New Message:**
```
Intelsol sync started successfully!

The database and performance stats are now updating. This process takes 3-5 minutes.

Please refresh the page in a few minutes to see the updated data.
```

**Additional Change:** Removed automatic page reload since data won't be updated immediately

**Commit:** `2c9cb7e` - "Fix: Update sync success message to set correct expectations"

---

### Issue #5: Workflow Push Failure (Git Conflict)

**Date:** 2026-08-13
**Error:** `Updates were rejected because the remote contains work that you do not have locally`

**Cause:** When code was pushed while workflow was running, workflow's commit couldn't be pushed because it was behind remote

**Fix:** Added `git pull --rebase origin main` before `git push` in workflow

**File:** `.github/workflows/sync-client-data.yml:190`

**Commit:** `0aca5da` - "Fix: Add git pull --rebase before push in workflow"

**Code:**
```bash
git commit -m "Auto-update: Client data sync at $(date -u +'%Y-%m-%d %H:%M UTC')"
git pull --rebase origin main  # ← Added this
git push
```

---

## Environment Variables Required

### Cloudflare Pages

**Location:** Cloudflare Pages → Settings → Environment variables

| Variable | Purpose | Where to get it |
|----------|---------|-----------------|
| `GITHUB_TOKEN` | Cloudflare Functions use this to trigger workflow via GitHub API | GitHub Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token with `repo` scope |

### GitHub Repository Secrets

**Location:** GitHub Repo → Settings → Secrets and variables → Actions

| Secret | Purpose | Where to get it |
|--------|---------|-----------------|
| `SMARTLEAD_API_KEY` | Fetch campaigns and leads from SmartLead | SmartLead Dashboard → Settings → API |
| `GH_PAT` | Workflow uses this to commit updated files back to repo | GitHub Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token with `repo` scope |

---

## How to Use

### For Users (Triggering a Manual Sync)

1. Go to client portal: `https://intelsol.pages.dev/{clientId}/documents`
2. Click "Update Database" button
3. You'll see confirmation: "Sync started successfully! The database and performance stats are now updating. This process takes 3-5 minutes."
4. Wait 3-5 minutes
5. Refresh the page
6. Check Performance tab for updated stats

### For Developers (Checking Workflow Status)

**Check workflow runs:**
https://github.com/Angela0023/intelsol-client-portal/actions

**Check specific workflow run:**
1. Click on the workflow run
2. Click on "sync-client-data" job
3. Expand each step to see logs

**Common issues:**
- **Exit code 1:** Check the logs for the specific error
- **Push rejected:** Workflow needs `git pull --rebase` (already fixed)
- **403 Forbidden:** Missing User-Agent header or invalid GitHub token
- **SmartLead API errors:** Check if API key is valid and has correct permissions

### For Developers (Adding a New Client)

When adding a new client to the sync system:

1. **Add client prefix to sync scripts:**
   - `.github/workflows/sync-client-data.yml` (line 63-72)
   - `.smartlead/sync-all-campaigns.js` (line 36-45)

2. **Add clientId to API validation:**
   - `/functions/api/sync-client-data.ts` (line 16-26)

3. **Create empty campaign stats file:**
   ```bash
   echo "[]" > public/campaigns/{clientId}.json
   git add public/campaigns/{clientId}.json
   ```

4. **Add DocumentsTabGeneric to client page:**
   ```tsx
   import DocumentsTabGeneric from '../components/DocumentsTabGeneric';

   {activeTab === 'documents' && (
     <DocumentsTabGeneric
       clientId="newclient"
       clientName="New Client"
       totalLeads={0}
       totalCampaigns={0}
       accentColor="blue"
     />
   )}
   ```

5. **Run initial sync:**
   - Trigger manually via portal button, or
   - Run workflow manually via GitHub Actions UI

---

## Performance Impact

### API Calls Per Campaign

**Before (Single API call):**
- 1x `/campaigns/{id}/analytics`

**After (Two API calls):**
- 1x `/campaigns/{id}/analytics` (get contacted count)
- 1x `/campaigns/{id}/leads?limit=1` (get total count)

**Rate Limiting Protection:**
- 200ms delay between campaigns
- 100ms delay between the two API calls per campaign

**Estimated Sync Time:**
- **Intelsol (72 campaigns):** ~3-4 minutes
- **TSLab (12 campaigns):** ~1 minute
- **Xpose (2 campaigns):** ~30 seconds

---

## Files Modified/Created Summary

### Created Files
- `.github/workflows/sync-client-data.yml` - Generic sync workflow
- `functions/api/sync-client-data.ts` - Generic API endpoint
- `app/components/DocumentsTabGeneric.tsx` - Reusable Documents tab component
- `public/data/tslab-database.csv` - TS Lab lead database
- `public/data/xpose-database.csv` - Xpose lead database
- `SYNC_SYSTEM.md` - This documentation file

### Modified Files
- `app/intelsol/page.tsx` - Use generic DocumentsTab component
- `app/tslab/page.tsx` - Use generic DocumentsTab component
- `app/xpose/page.tsx` - Add Documents tab with generic component
- `app/components/PerformanceTabDynamic.tsx` - Add heat map color gradient
- `.smartlead/sync-all-campaigns.js` - Fetch total leads from leads API
- `public/data/intelsol-database.csv` - Updated with latest leads
- `public/campaigns/intelsol.json` - Updated with corrected total counts
- `public/campaigns/tslab.json` - Updated with corrected total counts

### Deleted Files
- `.github/workflows/sync-intelsol-data.yml` - Superseded by generic workflow
- `functions/api/sync-intelsol-data.ts` - Superseded by generic API endpoint

---

## Testing Checklist

Before considering the sync system complete, verify:

- [ ] Click "Update Database" button shows correct message
- [ ] Workflow triggers successfully (check GitHub Actions)
- [ ] Workflow completes without errors (green checkmark)
- [ ] New commit appears with "Auto-update: Client data sync at..." message
- [ ] Database CSV files updated in `/public/data/`
- [ ] Campaign JSON files updated in `/public/campaigns/`
- [ ] Performance tab shows different numbers for TOTAL vs EMAILED
- [ ] Heat map colors show correctly (red for 0%, green for highest)
- [ ] Refresh page after 5 minutes shows updated data
- [ ] Daily automatic sync runs at 4 AM CEST

---

## Future Improvements

### Potential Enhancements

1. **Real-time sync status indicator**
   - Show progress bar during sync
   - Poll GitHub Actions API to show live status
   - Show "Syncing..." indicator instead of requiring manual refresh

2. **Webhook instead of polling**
   - Have GitHub Actions send webhook when sync completes
   - Cloudflare Pages receives webhook and invalidates cache
   - User sees updated data immediately without manual refresh

3. **Incremental sync**
   - Only fetch campaigns that changed since last sync
   - Reduces API calls and sync time
   - Store last sync timestamp and use SmartLead's `updated_since` parameter

4. **Error notifications**
   - Send email/Slack notification if sync fails
   - Include error details and link to failed workflow run
   - Alert on consecutive failures

5. **Campaign change detection**
   - Detect new campaigns added
   - Detect campaigns that were deleted
   - Highlight campaigns with significant metric changes

6. **Better rate limiting**
   - Implement exponential backoff on rate limit errors
   - Batch API calls more efficiently
   - Use SmartLead bulk endpoints if available

---

## Troubleshooting

### Sync button does nothing

**Check:**
1. Browser console for errors (F12 → Console tab)
2. Network tab for failed API request
3. Verify `GITHUB_TOKEN` is set in Cloudflare Pages environment variables

### Workflow fails with "GitHub token not configured"

**Fix:** Add `GH_PAT` secret to GitHub repository secrets with `repo` scope token

### Workflow fails with "SmartLead API error"

**Fix:** Check if `SMARTLEAD_API_KEY` secret is valid and has correct permissions

### TOTAL and EMAILED show same numbers

**Check:**
1. Verify workflow is using latest version of sync script
2. Check workflow logs for errors in "Sync Campaign Stats" step
3. Manually inspect SmartLead campaign to verify actual lead counts
4. Trigger new sync to fetch latest data

### Heat map colors all the same

**Check:**
1. Verify all campaigns don't have identical rates
2. Check browser console for JavaScript errors
3. Ensure PerformanceTabDynamic component has latest heat map code

### Data doesn't update after sync

**Check:**
1. Wait full 5 minutes before refreshing
2. Hard refresh (Cmd+Shift+R or Ctrl+Shift+R) to clear cache
3. Check if workflow actually completed successfully
4. Check if new commit exists in GitHub repository
5. Wait for Cloudflare Pages cache invalidation (up to 10 minutes)

---

## Related Documentation

- **Main README:** `/README.md`
- **Portal Architecture:** `/CLAUDE.md`
- **GitHub Actions Workflow:** `.github/workflows/sync-client-data.yml`
- **SmartLead API Docs:** https://docs.smartlead.ai/

---

**Documentation maintained by:** Claude Sonnet 4.5
**Last reviewed:** 2026-08-13
