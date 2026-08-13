# IntElsol Client Portal — Claude Knowledge Base

> **CRITICAL:** Read this file BEFORE making any changes to the portal. Contains all deployment rules, lessons learned, and troubleshooting guides.

---

## 🚨 HARD RULES — NEVER BREAK THESE

### 1. Tab Structure Must Be Identical for All Clients
**Rule:** ALL client dashboards MUST have the exact same tabs. Never create unique tabs for individual clients.

**Standard Tabs (in order):**
1. Overview
2. ICP Profile
3. Clay Filters
4. AI Prompts
5. Buyer Personas
6. Email Sequences
7. Campaigns
8. Performance
9. Documents
10. Tasks

**Why:** Consistency is critical. Breaking this confuses users and creates maintenance nightmares.

**Lesson Learned (2026-07-30):** Created "Buying Signals" and "Messaging" tabs for Plantryx only. User immediately flagged this as wrong. Moved content into existing tabs instead.

**Lesson Learned (2026-07-31):** Added "Email Sequences" as new standard tab between Buyer Personas and Campaigns. Logical flow: know your personas → write sequences for them → launch campaigns.

**Email Sequences Tab Format:**
- Organize by persona tier or campaign type
- Each sequence = 3 emails (Initial + 2 follow-ups)
- Display: Subject line + Body for each email
- Use monospace font for copy-paste friendly format
- Color-code different tiers/personas
- Include sequence design principles at top
- Make it scannable: clear visual separation between sequences

**Campaigns & Performance Tab Organization (IMPLEMENTED 2026-08-06):**

**CAMPAIGNS TAB** = Campaign Planning & Strategy (HOW to run campaigns)
- Contains: Campaign structure, sequencing rules, messaging frameworks, CTAs, validation workflows
- Component: `CampaignsTabGeneric` (generic) OR custom component (e.g., Plantryx uses `CampaignsTabContent`)
- Purpose: Playbook for planning campaigns BEFORE launch
- Shows: Strategic guidelines, not execution data

**PERFORMANCE TAB** = Campaign Execution & Results (WHAT's running + metrics)
- Contains: Active campaign metrics + campaign execution data (both PerformanceTabDynamic AND CampaignsTabDynamic)
- Components:
  ```tsx
  <PerformanceTabDynamic clientId="[client]" />
  <CampaignsTabDynamic clientId="[client]" />
  ```
- Purpose: Dashboard for ACTIVE campaigns and their results
- Shows: Metrics, campaign lists, performance data, monthly breakdowns

**Why This Separation:**
- **Campaigns tab** = "How do we plan this?"
- **Performance tab** = "What's running and how is it performing?"
- Consistent across ALL clients
- No confusion about where content belongs

**Implementation Pattern:**
```tsx
// Campaigns tab - Planning content
{activeTab === 'campaigns' && <CampaignsTabGeneric />}

// Performance tab - Execution + Metrics
{activeTab === 'performance' && (
  <>
    <PerformanceTabDynamic clientId="clientname" />
    <CampaignsTabDynamic clientId="clientname" />
  </>
)}
```

---

### 1A. NEVER Remove Tab Content Without Explicit Instruction

**HARD RULE:** NEVER remove sections, content, or components from any client's tabs unless explicitly instructed to do so by the user.

**Why:** Each tab's content has been carefully designed and approved. Removing content breaks client workflows and loses important information.

**VIOLATION EXAMPLE (2026-08-06):**
- Removed sections from Plantryx Campaigns tab during campaign sync work
- User immediately flagged this as a critical mistake
- **This must NEVER happen again**

**Correct Approach:**
- If you think content should be moved or consolidated, ASK FIRST
- If you're unsure whether to keep something, KEEP IT and ask
- Only remove content when user explicitly says "remove [specific thing]"

---

### 1B. NEVER Expose Internal Tool Names to Clients

**HARD RULE:** Internal tabs containing tool names (Clay Filters, AI Prompts) MUST be hidden from non-admin users. Only admin users can see these tabs.

**Why:** Clients should not see references to internal tools (Clay, Anthropic, Apollo, SmartLead, etc.). This is proprietary information and process details they don't need to know.

**Internal Tabs (Admin-Only):**
- Clay Filters
- AI Prompts

**Client-Visible Tabs:**
- Overview
- ICP Profile
- Buyer Personas
- Email Sequences
- Campaigns
- Performance
- Documents
- Tasks

**Implementation Pattern:**
```tsx
// Define which tabs are internal
const internalTabs = ['filters', 'prompts'];

// Filter tabs based on admin access
const visibleTabs = isAdmin
  ? tabs
  : tabs.filter(tab => !internalTabs.includes(tab.id));
```

**Rule Established:** 2026-08-13

**This is a CRITICAL rule - violation exposes proprietary process to clients**

---

### 2. Adding a New Client Requires Multiple Files

**When creating a new client dashboard, you MUST update:**

1. **`/app/[clientname]/page.tsx`** - The dashboard page
2. **`/public/tasks/[clientname].json`** - Empty array `[]`
3. **`/public/uploads/[clientname]/.metadata.json`** - Empty array `[]`
4. **`/public/_redirects`** - Add route: `/[clientname]/* /[clientname] 200`
5. **`/lib/auth.ts`** - Add to `ClientAccess` type and `CLIENT_PASSWORDS`
6. **`/app/components/Sidebar.tsx`** - Add to `clients` array
7. **`/app/components/StatusBadge.tsx`** - Add to `DEFAULT_STATUSES`
8. **`/app/admin/page.tsx`** - Add to:
   - `clientIds` array (for task fetching)
   - `clientNames` object
   - `clients` array (for display)

**Why:** Missing any of these causes:
- 404 errors when accessing the page
- Upload failures (no directory)
- Tasks tab errors
- Client not showing in sidebar
- Missing from admin dashboard

**Lesson Learned (2026-07-31):**
- Created demo dashboard but forgot to add to `_redirects` → 404 errors
- Created Plantryx but no upload directory → upload failures

---

### 3. The `_redirects` File is Critical for Routing

**File:** `/public/_redirects`

**Current Structure:**
```
# Cloudflare Pages SPA routing
# Serve the base page for all sub-routes, but keep the URL intact

/demo/* /demo 200
/tslab/* /tslab 200
/intelsol/* /intelsol 200
/xpose/* /xpose 200
/beeit/* /beeit 200
/wulf/* /wulf 200
/peoplefocus/* /peoplefocus 200
/plantryx/* /plantryx 200
/admin/* /admin 200

# Fallback - SPA routing (Functions in /api/* take precedence automatically)
/* /index.html 200
```

**Critical Rules:**
- ✅ Every client route MUST have its own redirect rule
- ✅ The fallback `/* /index.html 200` MUST be at the end
- ✅ Cloudflare Functions in `/functions/api/*` automatically override the fallback
- ❌ DO NOT remove the fallback rule (breaks hard refresh on all pages)
- ❌ DO NOT put the fallback before specific routes (it will catch everything)

**Why the fallback is needed:**
- Next.js static export creates `/tslab.html`, `/demo.html`, etc.
- When user visits `/tslab/documents`, Cloudflare needs to serve `/tslab.html`
- Without the fallback, hard refresh on any sub-route returns 404

**Lesson Learned (2026-07-31):**
- Removed fallback to "fix" API errors → broke ALL pages on hard refresh
- The real issue was missing client routes in the redirect file

---

### 4. Upload Directories Must Exist BEFORE First Upload

**Rule:** Every client MUST have `/public/uploads/[clientname]/.metadata.json` file in GitHub before anyone can upload documents.

**Why:** The upload API commits files to GitHub. GitHub API cannot create directories, only files. If the directory doesn't exist in the repo, the upload API fails with 500 error.

**Correct Setup:**
```bash
mkdir -p public/uploads/[clientname]
echo "[]" > public/uploads/[clientname]/.metadata.json
git add public/uploads/[clientname]
git commit -m "Add: Upload directory for [clientname]"
git push
```

**Lesson Learned (2026-07-31):**
- TSLab uploads worked fine (directory existed)
- Plantryx uploads failed with 500 error (no directory)
- Fixed by creating directories for all clients

---

### 5. Business Terminology Matters — Get It Right

**Rule:** Use the EXACT terminology the client uses for their business model.

**Example - TS Lab:**
- ❌ WRONG: "white label manufacturing"
- ✅ CORRECT: "private label manufacturing"

**Why:** This is a critical business distinction. Using wrong terminology suggests you don't understand their business.

**Lesson Learned (2026-07-31):** Used "white label" in multiple places for TS Lab. User flagged this immediately. Changed all instances to "private label" with commit note emphasizing the correction.

---

## 📋 Deployment Checklist

### Before Pushing to GitHub

- [ ] Did you test the build locally? (`npm run build`)
- [ ] If adding a new client, did you update all 8 required files?
- [ ] If changing tabs, did you verify ALL clients still have identical tab structure?
- [ ] Did you add the new client route to `_redirects`?
- [ ] Did you create the upload directory for new clients?
- [ ] Did you use correct business terminology?

### After Pushing to GitHub

- [ ] Check Cloudflare Pages deployment status (2-3 minutes)
- [ ] Test on main domain: `https://intelsol.pages.dev/[route]`
- [ ] Test hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
- [ ] Test Documents tab (upload + download)
- [ ] Test Tasks tab
- [ ] If using custom domain (`intelsol.corsyx.com`), wait 5-10 min for CDN propagation

---

## 🔧 Troubleshooting Guide

### Issue: 404 Error on Client Page

**Symptoms:** Page shows "404 | This page could not be found"

**Diagnosis:**
1. Check if route exists in `/public/_redirects`
2. Check if page file exists at `/app/[clientname]/page.tsx`
3. Check build logs for errors

**Fix:**
- Add missing route to `_redirects`
- Create missing page file
- Ensure fallback rule exists: `/* /index.html 200`

**Reference:** Demo dashboard issue (2026-07-31)

---

### Issue: "Unexpected token '<', '<!DOCTYPE'... is not valid JSON"

**Symptoms:** Documents or Tasks tabs show this error

**Diagnosis:** API endpoint is returning HTML (404 page) instead of JSON

**Root Causes:**
1. Missing route in `_redirects` (most common)
2. Cloudflare Functions not deployed
3. `GITHUB_TOKEN` environment variable not set

**Fix:**
1. Verify route exists in `_redirects`
2. Check Cloudflare Pages deployment logs for Function deployment
3. Check Settings → Environment variables for `GITHUB_TOKEN`
4. Test API directly: `https://intelsol.pages.dev/api/files?clientId=demo`

**Reference:** Documents tab error (2026-07-31)

---

### Issue: Upload Fails with 500 Error

**Symptoms:** Upload button shows "Upload failed" with no specific error

**Diagnosis:**
1. Open browser console (F12)
2. Look for `/api/upload:1 Failed to load resource: the server responded with a status of 500`

**Root Causes:**
1. Upload directory doesn't exist in GitHub repo (most common)
2. `GITHUB_TOKEN` not configured or has wrong permissions
3. GitHub API rate limit reached

**Fix:**
1. Create upload directory and metadata file:
   ```bash
   mkdir -p public/uploads/[clientname]
   echo "[]" > public/uploads/[clientname]/.metadata.json
   git add public/uploads/[clientname] && git commit && git push
   ```
2. Check `GITHUB_TOKEN` in Cloudflare Pages environment variables
3. Wait if rate limited (rare)

**Reference:** Plantryx upload failure (2026-07-31)

---

### Issue: Hard Refresh Returns 404

**Symptoms:** Page works on initial load, but hard refresh shows 404

**Diagnosis:** Missing or misconfigured `_redirects` file

**Fix:**
- Ensure fallback exists in `_redirects`: `/* /index.html 200`
- Ensure fallback is LAST (after all specific routes)

**Reference:** Removed fallback rule issue (2026-07-31)

---

## 🏗️ Architecture Overview

### Tech Stack
- **Framework:** Next.js 16.2.6 (App Router)
- **Export Mode:** Static (`output: 'export'`)
- **Hosting:** Cloudflare Pages
- **Storage:** GitHub (for tasks and documents)
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React

### File Structure
```
intelsol-client-portal/
├── app/
│   ├── [clientname]/page.tsx    # Client dashboards
│   ├── admin/page.tsx            # Admin dashboard
│   ├── components/               # Reusable UI components
│   │   ├── SequencesTab.tsx     # Email sequences CRUD component
│   │   └── ...                   # Other components
│   └── page.tsx                  # Landing page
├── functions/
│   └── api/                      # Cloudflare Functions (API endpoints)
│       ├── files.ts              # List files
│       ├── upload.ts             # Upload files
│       ├── delete.ts             # Delete files
│       ├── sequences/
│       │   ├── get.ts            # Get email sequences
│       │   └── update.ts         # Update email sequences
│       └── tasks/
│           ├── get.ts            # Get tasks
│           └── update.ts         # Update tasks
├── public/
│   ├── tasks/                    # Task storage (JSON files)
│   ├── sequences/                # Email sequences storage (JSON files)
│   ├── uploads/                  # Document storage
│   └── _redirects                # Cloudflare Pages routing
├── lib/
│   └── auth.ts                   # Authentication logic
└── CLAUDE.md                     # This file
```

### How Routing Works
1. Next.js builds static HTML files: `/tslab.html`, `/demo.html`, etc.
2. Files are deployed to `out/` directory
3. Cloudflare Pages serves from `out/`
4. `_redirects` file tells Cloudflare how to handle routes
5. Client visits `/tslab/documents` → Cloudflare serves `/tslab.html` (via redirects)
6. React Router handles tab navigation client-side

### How API Works
1. API routes in `/functions/api/` are Cloudflare Functions
2. They run server-side on Cloudflare's edge network
3. They use GitHub API to read/write files
4. `GITHUB_TOKEN` environment variable provides authentication
5. Functions automatically override `_redirects` fallback rule

---

## 📧 Email Sequences Feature

**Overview:** The Email Sequences tab allows admins to create, edit, and delete email sequences directly in the portal. Each sequence contains 3 emails (Initial + 2 follow-ups) organized by persona tier or campaign type.

### Architecture

**Component:** `/app/components/SequencesTab.tsx` (reusable across all clients)

**API Endpoints:**
- `GET /api/sequences/get?clientId=[id]` - Fetches sequences from GitHub
- `POST /api/sequences/update` - Saves sequences to GitHub

**Storage:** `/public/sequences/[clientId].json` - JSON files in GitHub repo

**Data Structure:**
```typescript
interface Email {
  emailNumber: number;      // 1, 2, or 3
  type: string;             // e.g., "Initial Outreach", "Follow-Up"
  subject: string;          // Email subject line
  body: string;             // Email body (supports \n for line breaks)
}

interface Sequence {
  id: string;               // Unique ID (e.g., "tier-1-corporate")
  tierName: string;         // Display name (e.g., "TIER 1: Corporate Planning")
  tierColor: string;        // Color theme: blue, green, amber, purple, indigo
  targetPersonas: string;   // Target audience description
  messagingAngle: string;   // Key messaging points
  emails: Email[];          // Array of 3 emails
}
```

### Features

**Admin-Only Edit Mode:**
- Only visible when user is admin AND edit mode is enabled
- Edit mode controlled via `EditModeContext`
- Add sequence button appears in header when not editing
- Cancel button reverts changes without saving

**CRUD Operations:**
- **Create:** Click "Add Sequence" → new sequence with 3 empty emails
- **Edit:** Click edit icon → inline editing of all fields
- **Delete:** Click delete icon → confirmation dialog before deletion
- **Save:** Validates all fields → saves to GitHub via API

**Validation:**
- Tier name required (cannot be empty)
- All 3 emails must have subject and body
- Alert shown if validation fails

**Color Coding:**
- Blue: Tier 1 / Primary personas
- Green: Tier 2 / Secondary personas
- Amber: Tier 3 / Tertiary personas
- Purple: Tier 4 / Specialized personas
- Indigo: Executive layer / High-level personas

**Display:**
- Monospace font for email subject and body (copy-paste friendly)
- Color-coded backgrounds for each tier
- Visual separation between sequences
- Email numbers shown as badges

### Adding Sequences to New Clients

When creating a new client dashboard:

1. **Create sequences file:**
   ```bash
   echo "[]" > public/sequences/[clientname].json
   ```

2. **Add to client page:**
   ```typescript
   import SequencesTab from '../components/SequencesTab';
   import { Mail } from 'lucide-react';

   const tabs = [
     // ... other tabs
     { id: 'sequences', label: 'Email Sequences', icon: Mail },
   ];

   // In render:
   {activeTab === 'sequences' && <SequencesTab clientId="[clientname]" />}
   ```

3. **Commit to GitHub** before first use (API cannot create files)

### Troubleshooting

**Issue: Sequences not loading**
- Check `/public/sequences/[clientId].json` exists in repo
- Check API response in browser console
- Verify `GITHUB_TOKEN` has `repo` access

**Issue: Sequences not saving**
- Check browser console for API errors
- Verify all validation passes (tier name, email subjects/bodies)
- Check GitHub API rate limits

**Issue: 404 on API endpoint**
- Verify Cloudflare Functions deployed
- Check `_redirects` has fallback rule: `/* /index.html 200`

---

## 🔐 Environment Variables

**Location:** Cloudflare Pages → Settings → Environment variables

**Required Variables:**

| Variable | Value | Purpose |
|----------|-------|---------|
| `GITHUB_TOKEN` | GitHub Personal Access Token | API authentication for file operations |

**Token Permissions Required:**
- ✅ `repo` (full repository access)

**How to Create Token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Name: "Cloudflare Pages - Intelsol Portal"
4. Select: `repo` (all)
5. Generate and copy token
6. Add to Cloudflare Pages environment variables

---

## 📝 Commit Message Format

```
[Type]: Brief description

- Detailed change 1
- Detailed change 2
- Why this change was necessary

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Types:**
- `Add` - New feature or file
- `Fix` - Bug fix
- `Update` - Modification to existing functionality
- `Remove` - Deletion of code/files
- `Docs` - Documentation only

---

## 🎯 Demo Dashboard Special Rules

**Purpose:** Demo dashboard (`/demo`) is for presenting to potential clients during sales negotiations. It shows what their custom dashboard will look like.

**Client:** "Acme Corporation" (fictional industrial equipment manufacturer)

**Key Features:**
- Prominent amber warning banner: "DEMO DASHBOARD - Sample Data Only"
- All 9 standard tabs with realistic sample data
- 3 downloadable sample documents
- Functional upload/download (for demonstration)
- Password: `demo2026`

**Important:**
- Demo appears FIRST in sidebar (for easy access)
- Demo is fully functional (not read-only)
- Sample data should look realistic but clearly fictional

---

## 🚀 Quick Command Reference

### Local Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
```

### Git Operations
```bash
git status           # Check changes
git add .            # Stage all changes
git commit -m "msg"  # Commit with message
git push             # Push to GitHub
git pull --rebase    # Pull with rebase
```

### Debugging
```bash
# Build locally to check for errors
npm run build

# Check what gets generated
ls -la out/

# Test API endpoint
curl https://intelsol.pages.dev/api/files?clientId=demo
```

---

## 📚 Lessons Learned Log

### 2026-07-31: Multiple Critical Fixes

**Issue #1: Demo Dashboard 404**
- **Problem:** Created `/app/demo/page.tsx` but forgot to add route to `_redirects`
- **Result:** 404 error when accessing `/demo`
- **Fix:** Added `/demo/* /demo 200` to `_redirects`
- **Lesson:** ALWAYS add new client routes to `_redirects` file

**Issue #2: Tab Structure Inconsistency**
- **Problem:** Created "Buying Signals" and "Messaging" tabs only for Plantryx
- **User Feedback:** "These two sections are new to me. We need to keep this consistent."
- **Fix:** Removed custom tabs, moved content into standard tabs
- **Lesson:** ALL clients must have identical tab structure

**Issue #3: White Label vs Private Label**
- **Problem:** Used "white label" terminology for TS Lab
- **User Feedback:** Immediate correction required
- **Fix:** Changed all instances to "private label"
- **Lesson:** Use exact client business terminology

**Issue #4: Documents Tab JSON Error**
- **Problem:** API returning HTML instead of JSON
- **Diagnosis:** Missing route in `_redirects` → fallback serving index.html
- **Fix:** Added missing client routes
- **Lesson:** Verify `_redirects` has all client routes

**Issue #5: Removed Fallback Rule**
- **Problem:** Removed `/* /index.html 200` to "fix" API errors
- **Result:** ALL pages returned 404 on hard refresh
- **Fix:** Restored fallback rule
- **Lesson:** Fallback is essential for SPA routing, but must be LAST

**Issue #6: Plantryx Upload Failure**
- **Problem:** Upload worked for TSLab but failed for Plantryx (500 error)
- **Diagnosis:** `/public/uploads/plantryx/` directory didn't exist
- **Fix:** Created upload directories for all clients
- **Lesson:** Upload directory must exist BEFORE first upload

### 2026-07-31: Email Sequences Feature Implementation

**Feature:** Added editable Email Sequences tab to all client dashboards

**Implementation Approach:**
1. **Reusable Component:** Created `/app/components/SequencesTab.tsx` (583 lines)
   - Full CRUD functionality (Create, Read, Update, Delete)
   - Admin-only edit mode via EditModeContext
   - Color-coded tiers (blue, green, amber, purple, indigo)
   - Inline editing with validation
   - Monospace display for copy-paste friendly format

2. **API Endpoints:** Created sequences API in `/functions/api/sequences/`
   - `get.ts` - Fetches sequences from GitHub (handles 404 gracefully)
   - `update.ts` - Saves sequences to GitHub with SHA conflict handling

3. **Data Storage:** Created `/public/sequences/` directory
   - Each client has own JSON file: `[clientId].json`
   - Files must exist BEFORE first use (API cannot create files)

4. **Data Structure:**
   ```typescript
   interface Sequence {
     id: string;
     tierName: string;
     tierColor: string;
     targetPersonas: string;
     messagingAngle: string;
     emails: Email[];  // Array of 3 emails
   }
   ```

5. **Client Integration:** Added sequences tab to all 8 clients
   - plantryx, demo, xpose, tslab, beeit, intelsol, wulf, peoplefocus
   - Position: Tab #6 (after Buyer Personas)
   - Import: `import SequencesTab from '../components/SequencesTab'`
   - Render: `{activeTab === 'sequences' && <SequencesTab clientId="[id]" />}`

**Key Decisions:**
- **Why reusable component?** Ensures consistency across all clients, easier to maintain
- **Why GitHub storage?** Matches existing architecture (tasks, documents also in GitHub)
- **Why 3 emails per sequence?** Standard outreach pattern: Initial + 2 follow-ups
- **Why color-coded?** Visual organization for different persona tiers
- **Why admin-only?** Prevents clients from accidentally modifying sequences

**Lessons:**
1. **File must exist before API use** - Created empty `[]` files for all clients upfront
2. **Replace static implementations** - Removed 262-line static SequencesTab from Plantryx, replaced with component import
3. **Build validation** - Ran `npm run build` to catch TypeScript errors before committing
4. **Git conflicts** - Used `git pull --rebase` when remote changes exist
5. **Comprehensive documentation** - Added dedicated section in CLAUDE.md with architecture, troubleshooting, and examples

**Result:** All clients can now add/edit/delete email sequences directly in portal. Plantryx has 2 complete sequences (Tier 1 + Tier 2) with all 3 emails populated.

### 2026-08-06: Critical Mistakes and Corrections

**Issue #1: CRITICAL VIOLATION - Removed Tab Content Without Permission**
- **Problem:** Removed sections from Plantryx Campaigns tab while working on campaign sync
- **User Feedback:** "You removed sections from the campaigns tab. You should never do that. It's a hard rule to never do that."
- **Impact:** Lost user-approved content from client dashboard
- **Fix:** Added HARD RULE 1A: "NEVER Remove Tab Content Without Explicit Instruction"
- **Lesson:** ALWAYS preserve existing tab content unless user explicitly says to remove it. When in doubt, ASK FIRST.

**Issue #2: Fixed Smartlead Campaign Prefixes**
- **Problem:** Campaign sync script had incorrect emoji prefixes for TSLab, Xpose, and PeopleFocus
- **Diagnosis:**
  - Script was using 🏆 for all clients
  - Actual prefixes: TSLab uses 🧪, Xpose uses 💥, PeopleFocus uses 🎯
- **Fix:**
  - Fetched all 80 campaigns to identify actual naming patterns
  - Updated CLIENT_PREFIXES in sync script
  - Re-ran sync to populate campaign data for all clients
- **Result:**
  - Intelsol: 65 campaigns, 32,772 leads
  - TS Lab: 12 campaigns, 1,053 leads (newly found)
  - Xpose: 2 campaigns (DRAFTED status)
  - PeopleFocus: 1 campaign (DRAFTED status)
- **Lesson:** Always verify actual data before assuming naming patterns

### 2026-08-06: Campaigns/Performance Tab Reorganization (ALL CLIENTS)

**Problem:** Campaigns tab showed different content for different clients - some showed active campaign lists, some showed planning content. This was inconsistent and confusing.

**Solution:** Reorganized tabs across ALL clients to separate planning from execution:
- **Campaigns tab** = Campaign planning & strategy (HOW to plan campaigns)
- **Performance tab** = Campaign execution & metrics (WHAT's running + results)

**Implementation Details:**

1. **Created Generic Campaigns Component** (`/app/components/CampaignsTabGeneric.tsx`):
   - Pre-launch checklist
   - Universal within-account sequencing rules
   - Placeholder for client-specific campaign guidelines
   - Used by all clients except those with custom planning content

2. **Created Custom Campaigns Component for Plantryx** (`/app/plantryx/CampaignsTabContent.tsx`):
   - Campaign Structure by Segment (Manufacturing + Non-Manufacturing)
   - Within-Account Sequencing Strategy (both segments)
   - CTA Options (Planning Maturity Diagnostic + Demo Video)
   - 100-Lead Validation Workflow

3. **Updated Performance Tab for ALL Clients**:
   - Now shows BOTH PerformanceTabDynamic + CampaignsTabDynamic
   - Combined execution metrics with campaign lists
   - Provides complete view of active campaigns and their results

4. **Clients Updated:**
   - ✅ plantryx (custom CampaignsTabContent)
   - ✅ demo, beeit, wulf, peoplefocus, xpose, intelsol, tslab (generic CampaignsTabGeneric)

**Result:**
- Consistent tab structure across all clients
- Clear separation: planning (Campaigns) vs. execution (Performance)
- No content lost or removed
- All clients now follow same organizational pattern

**Key Lessons:**
1. **Consistency is critical** - Same tab structure prevents confusion
2. **Separation of concerns** - Planning vs. execution belong in different tabs
3. **Generic + Custom approach** - Generic component for most clients, custom for those with specific needs
4. **Document changes immediately** - Updated CLAUDE.md with implementation details and patterns

**Implementation Pattern (for future clients):**
```tsx
// Campaigns tab
{activeTab === 'campaigns' && <CampaignsTabGeneric />}

// Performance tab
{activeTab === 'performance' && (
  <>
    <PerformanceTabDynamic clientId="clientname" />
    <CampaignsTabDynamic clientId="clientname" />
  </>
)}
```

---

## 🔄 Update This File

**When to update:**
- You solve a new issue
- You discover a new gotcha
- You learn a deployment rule
- User corrects your understanding

**How to update:**
1. Read this file FIRST before making changes
2. Document new lessons in "Lessons Learned Log"
3. Update relevant sections if rules change
4. Commit changes to GitHub

**This file is your source of truth. Keep it current.**

---

Last updated: 2026-08-06 (Added HARD RULE: Never remove tab content without explicit instruction. Fixed Smartlead campaign prefixes for all clients. Documented upcoming tab structure changes.)
