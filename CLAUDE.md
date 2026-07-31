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
│   └── page.tsx                  # Landing page
├── functions/
│   └── api/                      # Cloudflare Functions (API endpoints)
│       ├── files.ts              # List files
│       ├── upload.ts             # Upload files
│       ├── delete.ts             # Delete files
│       └── tasks/
│           ├── get.ts            # Get tasks
│           └── update.ts         # Update tasks
├── public/
│   ├── tasks/                    # Task storage (JSON files)
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

Last updated: 2026-07-31 (Added Email Sequences tab to standard structure)
