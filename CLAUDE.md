# IntElsol Client Portal — Claude Knowledge Base

> **CRITICAL:** Read this file BEFORE making any changes to the portal. Contains all deployment rules, lessons learned, and troubleshooting guides.

---

## 🚨 HARD RULES — NEVER BREAK THESE

### META-RULE: How to Handle Hard Rules

**RULE:** When the user mentions a "hard rule", AUTOMATICALLY store it in this CLAUDE.md file and push to GitHub IMMEDIATELY. No exclusions. No exceptions. No asking for permission.

**Process:**
1. User says "this is a hard rule" or "hard rule: [something]"
2. IMMEDIATELY add it to this CLAUDE.md file under appropriate section
3. IMMEDIATELY commit to Git with clear message
4. IMMEDIATELY push to GitHub
5. Confirm to user that it's stored and pushed

**Why:** Hard rules must persist across all Claude sessions. GitHub is the single source of truth. Local-only storage is NOT acceptable.

**Examples:**
- User: "Hard rule: Never use Unicode in emails" → Add to CLAUDE.md → Commit → Push → Done
- User: "This should be a hard rule" → Add to CLAUDE.md → Commit → Push → Done

**This applies to ALL hard rules, no matter what they are about.**

**Rule Established:** 2026-09-24

---

### 0. CLIENT DATA LOCATION — SINGLE SOURCE OF TRUTH (CRITICAL)

**HARD RULE:** When accessing ANY client data, pull immediately from `https://github.com/Angela0023/intelsol-client-portal-v2` and look up the client in the map below. NEVER ask clarifying questions about location or repository.

**The Golden Rule:**
- **ALL client data is in:** `https://github.com/Angela0023/intelsol-client-portal-v2`
- **Two types of clients exist** (see mapping below)
- **Know which type, know where to look** — NO QUESTIONS ASKED
- **NO OTHER REPOSITORIES** contain client data (client-matej-lead-gen is obsolete)

---

## CLIENT DATA LOCATION MAP (REQUIRED — MEMORIZE THIS)

**TYPE A: Full Documentation Clients (8 clients)**
These have complete documentation in `/clients/[client-name]/`

| Client | ICP Location | Sequences | Lead Lists |
|--------|--------------|-----------|-----------|
| **bit** | `clients/bit/*.md` | `clients/bit/sequences/` | `clients/bit/*.csv` |
| **eblissai** | `clients/eblissai/ICP-SUMMARY.md` | `clients/eblissai/sequences/` | `clients/eblissai/*.csv` |
| **intelsol** | `clients/intelsol/icp-documentation.md` | `clients/intelsol/` | `clients/intelsol/*.csv` |
| **mbedtronix** | `clients/mbedtronix/ICP-PROFILE.md` | `clients/mbedtronix/sequences/` | N/A |
| **mountaindrop** | `clients/mountaindrop/*.md` | Portal only | N/A |
| **peoplefocus** | `clients/peoplefocus/icp-brief.md` | `clients/peoplefocus/` | `clients/peoplefocus/*.csv` |
| **tslab** | `clients/tslab/ICP-documentation.md` | `clients/tslab/` | `clients/tslab/*.csv` |
| **xpose** | `clients/xpose/*.md` | `clients/xpose/` | `clients/xpose/*.csv` |

**TYPE B: Portal-Only Clients (19 clients)**
These exist only in the portal. Pull data from:
- ICP/sequences: `/app/[client]/page.tsx` (static content + SequencesTab)
- Sequences JSON: `/public/sequences/[client].json`
- Campaigns: `/public/campaigns/[client].json`

`adsigner`, `beeit`, `birografika`, `bmevents`, `clevercraft`, `demo`, `dhm`, `integraplast`, `intera`, `morefromfood`, `pacia`, `panorate`, `plantryx`, `prtronic`, `selekcija`, `seyens`, `stojkov`, `wulf`, `zen2fit`

---

**WHEN YOU SEE A REQUEST, USE THIS FLOWCHART (DO NOT SKIP):**

```
1. Is the client in TYPE A (8 clients)? YES → `/clients/[client-name]/`
2. Is the client in TYPE B (19 clients)? YES → `/app/[client]/` + `/public/sequences/[client].json`
3. Is the client NOT in either list? → It doesn't exist yet, create `/clients/[client-name]/`
```

---

## HOW TO ACCESS THE DATA — ALWAYS USE GIT CLONE

**IF GitHub MCP tools fail or return auth errors:**
- ❌ NEVER ask the user for help or clarification
- ❌ NEVER say "Can you provide the GitHub URL?"
- ✅ **ALWAYS immediately use bash `git clone`**

**The Reliable Method (ALWAYS WORKS):**

```bash
cd /tmp
git clone https://github.com/Angela0023/intelsol-client-portal-v2.git
# Now access files directly:
# - Read client docs: cat clients/[client]/ICP-PROFILE.md
# - Read sequences: cat public/sequences/[client].json
# - No authentication needed, works in any session
```

**Why This Rule Exists:**

On 2026-10-20, a Claude instance encountered GitHub MCP authentication errors and asked the user for help clarifying the repository URL and file paths. This violates the "pull immediately, no questions" requirement. The solution: GitHub MCP tools are optional. Bash `git clone` always works and requires no credentials.

**CRITICAL:** If any GitHub tool returns auth error, ignore it and use bash. The user has already authenticated their machine with GitHub SSH/credentials.

---

## CLIENT ONBOARDING SKILL — Use This for New Clients

**Available skill:** `/client-onboarding-intelsol`

**Location:** `/Users/angelapetkovska/.claude/skills/client-onboarding-intelsol.md`

When onboarding a new client, use this skill to:
1. Extract ICP data from documentation
2. Create complete portal dashboard (all required files per HARD RULE 0B)
3. Generate Clay Filter Prompts CSV (ready for Google Sheets)
4. Generate Positions CSV (ready for Google Sheets)
5. Ensure everything is GitHub-synchronized

**How to invoke:**
```
User: "Onboard [client] for the dashboard"
→ Run: /client-onboarding-intelsol
→ Skill handles everything end-to-end
```

---

**EXAMPLES OF IMMEDIATE ACTION (NO QUESTIONS):**

| Request | Client Type | Action | Location |
|---------|-----------|--------|----------|
| "Pull mbedtronix ICP" | A | Read file | `clients/mbedtronix/ICP-PROFILE.md` |
| "Get birografika sequences" | B | Read file + JSON | `/app/birografika/page.tsx` + `/public/sequences/birografika.json` |
| "Show intelsol lead lists" | A | Read files | `clients/intelsol/List-1-Target-Now.csv` |
| "Pull prtronic email sequences" | B | Read JSON | `/public/sequences/prtronic.json` |
| "Get xpose ICP" | A | Read file | `clients/xpose/xpose-overview.md` |

**WRONG BEHAVIOR (NEVER DO THIS):**

❌ "Which repository has Birogafika's data?"
❌ "Should I look in /clients/ or /app/?"
❌ "Can you clarify where Birografika's ICP is stored?"
❌ "I can't find the client, where should I search?"

**Why This Rule Exists:**

On 2026-10-20, another Claude instance asked 3 clarifying questions about where to find Birogafika data instead of immediately pulling from the correct location (portal: `/app/birografika/` + `/public/sequences/birografika.json`). This wasted user time and violates the "pull immediately" requirement. The map above eliminates all ambiguity.

**Rule Established:** 2026-10-20

**Last Updated:** 2026-10-20

---

### 0B. NEW CLIENT ONBOARDING — GITHUB FIRST (CRITICAL)

**HARD RULE:** Every new client MUST be documented on GitHub BEFORE portal files are created. No exceptions. No "we'll document it later."

**The Workflow (MANDATORY FOR ALL NEW CLIENTS):**

1. **Create GitHub documentation folder**
   ```bash
   mkdir clients/[client-name]
   ```

2. **Create ICP-PROFILE.md with:**
   - Client overview (what they do, who they serve)
   - ICP criteria (geography, company size, business models)
   - Buyer personas (job titles, decision-making roles)
   - Buying signals (Tier 1/2/3 indicators)
   - Email sequence strategy (how many sequences, why)
   - Any segmentation logic (if applicable)

3. **Create supporting files (if applicable):**
   - `sequences/` folder with sequence definitions
   - `*.csv` files for lead lists or filter prompts
   - `*.md` files for SOPs, call notes, analysis

4. **Commit to GitHub**
   ```bash
   git add clients/[client-name]/
   git commit -m "Add: [Client Name] documentation"
   git push
   ```

5. **THEN create portal files:**
   - `/public/sequences/[client].json`
   - `/public/campaigns/[client].json`
   - `/public/tasks/[client].json`
   - `/app/[client]/page.tsx`

**Why This Rule Exists:**

**Before 2026-10-20:** 19 clients existed ONLY in the portal code (`/app/[client]/page.tsx`). Their ICP, personas, and strategy were scattered in React components with no version control history, no searchability, and zero protection against code loss. If that file broke, the entire client documentation was gone.

**After this rule:** ALL clients (100% of them) will have a GitHub-backed single source of truth. The portal reads FROM GitHub documentation, not replaces it.

**Consequences of Breaking This Rule:**
- ❌ Client data becomes version-uncontrolled
- ❌ No audit trail of ICP changes
- ❌ Impossible to reference "what did we decide about this client?"
- ❌ Portal code becomes a bloated documentation file
- ❌ New team members can't find client info

**Verification Checklist Before Creating Portal Files:**
- [ ] `/clients/[client-name]/` folder exists on GitHub
- [ ] `ICP-PROFILE.md` documents complete client strategy
- [ ] All persona definitions are in GitHub, not just in portal code
- [ ] Commit is pushed and visible on GitHub
- [ ] Client documentation can be understood WITHOUT looking at portal code

**Rule Established:** 2026-10-20

---

### 0A. UPDATING DASHBOARD CONTENT — The Correct Workflow (CRITICAL)

**RULE:** When updating dashboard content (sequences, tasks, campaigns, etc.), follow this EXACT workflow. NEVER hallucinate deployment problems.

**The Workflow (3 Steps Only):**

1. **Edit the file locally**
   ```bash
   # Example: Update sequences
   # Edit public/sequences/[clientname].json
   ```

2. **Commit and push to GitHub**
   ```bash
   git add public/sequences/[clientname].json
   git commit -m "Update: [Client] email sequences"
   git push
   ```

3. **Wait 2-3 minutes for Cloudflare Pages to auto-deploy**
   - Cloudflare is connected to GitHub via webhook
   - Deployment happens automatically on every push
   - NO manual intervention needed in Cloudflare Dashboard
   - NO need to "trigger deployment" or "check webhook connection"

**That's it. Nothing else.**

---

**What Files Update This Way:**

- **Email Sequences:** `/public/sequences/[client].json`
  - API: `/api/sequences/get?clientId=[client]`
  - Live at: `https://intelsol.pages.dev/[client]/campaigns-sequences`

- **Tasks:** `/public/tasks/[client].json`
  - API: `/api/tasks/get?clientId=[client]`
  - Live at: `https://intelsol.pages.dev/[client]/tasks`

- **Campaigns:** `/public/campaigns/[client].json`
  - API: Auto-synced via GitHub Actions workflow
  - Live at: `https://intelsol.pages.dev/[client]/performance`

- **Any React Component:** `/app/components/*.tsx` or `/app/[client]/page.tsx`
  - Deployed as static HTML/JS bundle
  - Live at: Respective client dashboard URLs

---

**How to Verify It Worked:**

```bash
# 1. Verify file is committed to GitHub
git log --oneline --follow public/sequences/[client].json | head -3

# 2. Check latest commit is pushed
git status  # Should say "Your branch is up to date with 'origin/main'"

# 3. Wait 2-3 minutes, then test the live URL
curl "https://intelsol.pages.dev/api/sequences/get?clientId=[client]"
```

**If Changes Don't Appear After 5 Minutes:**

1. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R) to clear cache
2. Check if file is actually committed: `git log --follow [filepath]`
3. Check Cloudflare Pages Deployments tab for deployment status
4. **DO NOT** hallucinate webhook problems or manual deployment needs

---

**CRITICAL MISTAKES TO AVOID:**

❌ **NEVER say:** "The GitHub → Cloudflare webhook appears to be disconnected"
❌ **NEVER say:** "You need to manually trigger a deployment in Cloudflare"
❌ **NEVER say:** "Go to Cloudflare Pages → Settings → Builds & deployments"
❌ **NEVER say:** "Verify the GitHub connection is active"
❌ **NEVER recommend:** Manual deployment triggers unless deployment actually failed

✅ **ALWAYS do:** Edit → Commit → Push → Wait 2-3 minutes → Done

---

**Why This Rule Exists:**

On 2026-10-12, a Claude instance hallucinated a "broken webhook" problem when updating CleverCraft sequences. The commits were successfully pushed to GitHub, but Claude:
- Checked Cloudflare too quickly (deployment wasn't instant)
- Diagnosed a non-existent webhook problem
- Recommended unnecessary manual intervention in Cloudflare settings
- Overcomplicated a simple 3-step workflow

**The reality:** Commits were in GitHub, Cloudflare auto-deployed 2 minutes later, everything worked fine. No webhook was broken. No manual intervention was needed.

---

**Verification Checklist:**

Before claiming "deployment isn't working":
- [ ] Did you wait at least 3 minutes after pushing?
- [ ] Did you hard refresh the browser (Cmd+Shift+R)?
- [ ] Did you verify the commit is actually in GitHub? (`git log`)
- [ ] Did you check the actual API response? (`curl [api-url]`)
- [ ] Did you check Cloudflare Deployments tab for real errors?

**If all checks pass and it still doesn't work, THEN investigate. Not before.**

**Rule Established:** 2026-10-12

---

### 0. FEATURE ISOLATION — Each Feature is Independent (CRITICAL)

**RULE:** Each tab/feature is completely isolated and independent. When updating Feature X, touch ONLY Feature X files. NEVER touch any other feature's files.

**Why:** The portal has 8 independent features that work across all clients. Changes to one feature must NEVER affect any other feature. This prevents cascading bugs and maintains system stability.

**Feature File Mapping:**

1. **Overview Tab** - Static content in each `/app/[client]/page.tsx` (OverviewTab section only)

2. **ICP Profile Tab** - Static content in each `/app/[client]/page.tsx` (ICPAndPersonasTab section only)

3. **Clay Filters Tab** - Static content in each `/app/[client]/page.tsx` (FiltersTab section only)

4. **AI Prompts Tab** - Static content in each `/app/[client]/page.tsx` (PromptsTab section only)

5. **Campaigns & Sequences Tab**
   - `/app/components/SequencesTab.tsx`
   - `/app/components/CampaignsTabGeneric.tsx`
   - `/functions/api/sequences/get.ts`
   - `/functions/api/sequences/update.ts`
   - `/public/sequences/*.json` (16 files)
   - Campaign planning content in each client's page.tsx (CampaignsSequencesTab section only)

6. **Performance Tab**
   - `/app/components/PerformanceTabDynamic.tsx`
   - `/app/components/CampaignsTabDynamic.tsx`
   - `/functions/scheduled/sync-campaigns.ts`
   - `/functions/api/sync-campaigns-manual.ts`
   - `/public/campaigns/*.json` (16 files)

7. **Documents Tab**
   - `/app/components/DocumentsTabGeneric.tsx`
   - `/functions/api/files.ts`
   - `/functions/api/upload.ts`
   - `/functions/api/delete.ts`
   - `/public/uploads/[client]/*` (16 directories)

8. **Tasks Tab**
   - `/app/components/TasksTab.tsx`
   - `/functions/api/tasks/get.ts`
   - `/functions/api/tasks/update.ts`
   - `/public/tasks/*.json` (16 files)

**Examples of CORRECT behavior:**
- User says "Update Performance tab" → Touch ONLY Performance tab files (PerformanceTabDynamic.tsx, sync-campaigns.ts, campaigns/*.json)
- User says "Fix Tasks" → Touch ONLY Tasks tab files (TasksTab.tsx, tasks/*.ts, tasks/*.json)
- User says "Update email sequences" → Touch ONLY Sequences files (SequencesTab.tsx, sequences/*.ts, sequences/*.json)
- User says "Change ICP for Plantryx" → Touch ONLY Plantryx page.tsx ICPAndPersonasTab section

**Examples of WRONG behavior (NEVER DO THIS):**
- ❌ Updating Performance tab and also changing Tasks tab files
- ❌ Fixing Documents tab and also modifying Sequences files
- ❌ Changing campaign sync and also updating ICP content
- ❌ Making "improvements" to other features while working on one feature

**VIOLATION CONSEQUENCES:**
- Breaks working features that weren't supposed to change
- Creates debugging nightmares across multiple features
- Loses user trust in system stability
- **This is the #1 rule violation to avoid**

**Rule Established:** 2026-09-24

---

### 1. Tab Structure Must Be Identical for All Clients
**Rule:** ALL client dashboards MUST have the exact same tabs. Never create unique tabs for individual clients.

**Standard Tabs (in order):** *(Consolidated from 10 to 8 tabs on 2026-08-13)*
1. Overview
2. ICP Profile *(includes Buyer Personas)*
3. Clay Filters
4. AI Prompts
5. Campaigns & Sequences *(consolidated tab)*
6. Performance
7. Documents
8. Tasks

**Why:** Consistency is critical. Breaking this confuses users and creates maintenance nightmares.

**Lesson Learned (2026-07-30):** Created "Buying Signals" and "Messaging" tabs for Plantryx only. User immediately flagged this as wrong. Moved content into existing tabs instead.

**Lesson Learned (2026-07-31):** Added "Email Sequences" as new standard tab between Buyer Personas and Campaigns. Logical flow: know your personas → write sequences for them → launch campaigns.

**Lesson Learned (2026-08-13):** Consolidated tabs for better organization:
- Moved Buyer Personas content into ICP Profile tab (related persona targeting information)
- Merged Email Sequences and Campaigns into single "Campaigns & Sequences" tab (complete campaign workflow)
- Reduced from 10 tabs to 8 tabs across ALL client dashboards

**ICP Profile Tab Structure:**
- Contains all ICP criteria (company-level, geography, verticals, etc.)
- Includes Buyer Personas section at the end
- All persona tiers with job titles, messaging angles, and targeting rules
- Single comprehensive view of WHO to target

**Campaigns & Sequences Tab Structure:**
- **Email Sequences** section first (using SequencesTab component)
  - Organize by persona tier or campaign type
  - Each sequence = 3 emails (Initial + 2 follow-ups)
  - Display: Subject line + Body for each email
  - Use monospace font for copy-paste friendly format
  - Color-code different tiers/personas
- **Campaign Planning** section below (using CampaignsTabGeneric or custom component)
  - Campaign structure, sequencing rules, messaging frameworks
  - CTAs, validation workflows, pre-launch checklists
  - Complete campaign planning playbook

**Performance Tab:**
- Contains: Active campaign metrics + campaign execution data
- Components:
  ```tsx
  <PerformanceTabDynamic clientId="[client]" />
  <CampaignsTabDynamic clientId="[client]" />
  ```
- Purpose: Dashboard for ACTIVE campaigns and their results
- Shows: Metrics, campaign lists, performance data, monthly breakdowns

**Implementation Pattern:**
```tsx
// ICP Profile tab - ICP + Personas combined
{activeTab === 'icp' && <ICPAndPersonasTab />}

// Campaigns & Sequences tab - Sequences + Campaign planning
{activeTab === 'campaigns-sequences' && <CampaignsSequencesTab />}

function CampaignsSequencesTab() {
  return (
    <>
      <SequencesTab clientId="clientname" />
      <div className="mt-8">
        <CampaignsTabGeneric />  {/* or custom CampaignsTabContent */}
      </div>
    </>
  );
}

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
- ICP Profile *(includes Buyer Personas)*
- Campaigns & Sequences
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

### 1C. NEVER Use Em Dashes or Special Characters in Email Sequences

**HARD RULE:** Email sequences MUST use only standard ASCII characters. NO em dashes (—), en dashes (–), smart quotes (" " ' '), or any other special Unicode characters.

**Why:** Special characters cause encoding issues in email clients, appearing as corrupted text like "â" or other gibberish. This makes emails look unprofessional and damages deliverability.

**Correct Characters to Use:**
- ✅ Regular hyphen: `-` (ASCII 45)
- ✅ Regular apostrophe: `'` (ASCII 39)
- ✅ Regular quotes: `"` (ASCII 34)
- ✅ Standard punctuation: `. , ! ? : ;`

**NEVER Use:**
- ❌ Em dash: `—` (Unicode 2014)
- ❌ En dash: `–` (Unicode 2013)
- ❌ Smart quotes: `" "` (Unicode 201C, 201D)
- ❌ Smart apostrophes: `' '` (Unicode 2018, 2019)
- ❌ Any other Unicode special characters

**Validation:**
- Before saving any email sequence, verify ALL characters are standard ASCII
- Use regular hyphens instead of em dashes for pauses or breaks
- Use regular quotes/apostrophes instead of smart typography

**Example:**
```
❌ WRONG: "I'm curious — how are you managing..."
✅ CORRECT: "I'm curious - how are you managing..."

❌ WRONG: "Here's what we typically see:"
✅ CORRECT: "Here's what we typically see:"
```

**VIOLATION EXAMPLE (2026-08-13):**
- AdSigner sequences contained em dashes that appeared as "â" in email clients
- User immediately flagged this as unacceptable
- **This must NEVER happen again**

**Correct Approach:**
- Always use plain ASCII text in email body content
- Test sequences in multiple email clients before deployment
- Use find/replace to remove all special characters before saving

**Rule Established:** 2026-08-13

**This is a CRITICAL rule - corrupted characters destroy email credibility**

---

### 1D. ALWAYS Add Client Website to Dashboard

**HARD RULE:** Every client dashboard MUST include a clickable website link in the header section. If you don't have the website URL or are unsure about it, ASK the user for it.

**Why:** Client website links provide quick reference and professional appearance. Missing website links look incomplete and unprofessional.

**Correct Implementation:**
```tsx
<div className="flex items-center gap-3">
  <h1 className="text-2xl font-bold text-gray-900">[Client Name]</h1>
  <a
    href="https://[client-website].com"
    target="_blank"
    rel="noopener noreferrer"
    className="text-sm text-green-600 hover:underline inline-block"
  >
    Visit Website →
  </a>
</div>
```

**Checklist:**
- [ ] Website link added to client dashboard header
- [ ] Link opens in new tab (`target="_blank"`)
- [ ] Security attributes included (`rel="noopener noreferrer"`)
- [ ] URL verified with user if uncertain

**Rule Established:** 2026-08-13

**This is a MANDATORY rule - every client dashboard must have their website link**

---

### 1E. ALWAYS Create Clay Filter Prompts for ALL Industry Segments (CRITICAL)

**HARD RULE:** When creating Clay Filter Prompts CSV during client onboarding, you MUST create ONE filter prompt for EVERY industry segment mentioned in the client's ICP Profile tab. NEVER assume there are only 2 segments without reading the complete ICP documentation.

**Why:** Missing industry segments means incomplete lead generation coverage and wastes client's time when they discover entire segments are missing from their filters.

**Correct Process:**

1. **Read the COMPLETE ICP Profile tab** in `/app/[client]/page.tsx`
2. **Count ALL industry segments** mentioned (look for TIER 1, TIER 2, TIER 3, etc.)
3. **Create ONE filter prompt per segment** with appropriate priority
4. **Verify count matches** before finalizing CSV

**Example Structure:**
```
TIER 1: Primary Industry (60% allocation) → Filter Priority 1
TIER 2: Secondary Industry (40% allocation) → Filter Priority 2
TIER 3: Additional Segments → Filters Priority 3+
  - Segment A
  - Segment B
  - Segment C
```

**VIOLATION EXAMPLE (2026-10-15):**
- Created Pacia Clay Filter Prompts with only 2 filters (E-commerce + Tourism)
- MISSED 3 entire industry segments (Logistics, Service Businesses, Subscription Businesses)
- User had to catch this mistake: "Are you sure they only need to target those two industries?"
- **This wasted time and showed incomplete work**

**Correct Implementation for Pacia:**
```csv
Slovenia - E-commerce & Retail (Priority 1)
Slovenia - Tourism & Hospitality (Priority 2)
Slovenia - Logistics & Delivery (Priority 3)
Slovenia - Service Businesses (Priority 3)
Slovenia - Subscription Businesses (Priority 3)
```

**Checklist Before Finalizing Clay Filter Prompts:**
- [ ] Read COMPLETE ICP Profile tab content
- [ ] Counted all TIER 1, TIER 2, TIER 3+ segments
- [ ] Created filter for EVERY segment mentioned
- [ ] Verified filter count matches segment count
- [ ] Asked user if unsure about any segment

**Rule Established:** 2026-10-15

**This is a CRITICAL rule - incomplete filters = incomplete lead generation = frustrated client**

---

### 1F. HARD RULES: Clay Filter Prompts CSV Format (CRITICAL)

**HARD RULE:** When creating Clay Filter Prompts CSV during client onboarding, you MUST follow this EXACT format. This format has been validated across multiple clients (MoreFromFood, PRTronic, etc.) and MUST be used consistently.

**Why:** Wrong format = incomplete lead generation, confused users, wasted time recreating files. This format is optimized for Clay import and covers complete ICP.

**Column Structure (EXACT ORDER):**
```csv
Title,PROMPT,Industry,Location,Date targeted,Company List,ICP Match Prompt,Priority
```

**CRITICAL CONSTRAINTS:**

1. **PRIORITY 1 CAN ONLY BE ONE FILTER** - Not multiple. Only the single highest-priority location × industry gets Priority 1.
   - Priority sequence: 1, 2, 3, 4... in descending order of conversion potential
   - NEVER have multiple filters with Priority 1

2. **ONE filter per location × industry combination** - Never combine multiple locations into one filter
   - Example: "Slovenia - Display Integration", "Austria - Display Integration" (two separate filters)
   - NOT: "DACH Region - Display Integration" (one combined filter)

3. **Title format:** "[Location] - [Industry]"
   - Examples: "Slovenia - Display Integration", "Germany - Food Manufacturing"

4. **PROMPT format (EXACT STRUCTURE):**
   ```
   [Industry description] companies in [Location] including: [segments]. Company size: [ranges]. Prioritize companies with evidence of: [signals]. Search terms: [local language terms].
   ```

   **Example:**
   ```
   Display hardware sourcing companies in Slovenia including: (A) equipment manufacturers embedding displays in products (kiosks, terminals, industrial machines, medical devices, gaming machines), (B) AV/digital signage system integrators delivering display projects for clients, (C) multi-site operators with signage needs (retail chains, hotel groups, healthcare networks, transport operators), or (D) specialized display application developers (parking systems, public information). Company size: 5-500 employees for manufacturers/integrators, 50-2000 for multi-site operators. Prioritize companies with evidence of: current product lines with displays, signage project portfolio, quality certifications, hiring for hardware/project/technical roles, or multi-location operations. Search terms: vgradni zaslon, zaslon na dotik, samopostrežni terminal, digitalno prikazovanje, AV integracija.
   ```

5. **ICP Match Prompt format (EXACT STRUCTURE):**
   ```
   Review this company's website and public information to determine if they are a good fit for [Client Name], [what client offers].

   Return ONLY "YES" or "NO" based on these criteria:

   RETURN "NO" IF ANY OF THESE ARE TRUE:
   1. [Disqualifier 1]
   2. [Disqualifier 2]
   3. [Disqualifier 3]
   ...

   RETURN "YES" IF ALL OF THESE ARE TRUE:
   1. [Qualifier 1]
   2. [Qualifier 2]
   3. [Qualifier 3]
   ...

   Base your decision on information found on company website, [relevant sections].

   Return only: YES or NO
   ```

   **Example:**
   ```
   Review this company's website and public information to determine if they are a good fit for PRTronic, a display hardware supplier for OEMs, integrators, and operators.

   Return ONLY "YES" or "NO" based on these criteria:

   RETURN "NO" IF ANY OF THESE ARE TRUE:
   1. Company is only a pure software company without hardware procurement responsibility
   2. Company is a basic IT reseller without integration or specification role
   3. Company manufactures consumer/home products only (residential gaming, home automation)
   4. Company is headquartered outside DACH+Slovenia region
   5. Company has fewer than 5 employees (too small for display procurement needs)
   6. Company is only a retailer or distributor without own equipment development or integration projects

   RETURN "YES" IF ALL OF THESE ARE TRUE:
   1. Company EITHER manufactures equipment embedding displays OR integrates displays for client projects OR operates multiple locations with signage needs OR develops public display applications
   2. Company is headquartered or operating in Slovenia with design/engineering presence
   3. Company has 5-500 employees if manufacturer/integrator OR 50-2000 if multi-site operator
   4. Evidence of display hardware needs (products with screens, signage portfolio, multi-site network, or specialized applications)
   5. Company appears to need display sourcing for OEM products, client projects, or multi-location rollouts

   Base your decision on information found on company website, Products page, Projects/Case Studies, Locations, About Us, and Careers sections.

   Return only: YES or NO
   ```

6. **Date targeted:** Today's date in M/D/YYYY format (e.g., "10/16/2026")

7. **Company List column:** Leave empty (blank)

8. **Industry column:** Short industry name (e.g., "Display Integration", "Food Manufacturing")

9. **Location column:** Country name (e.g., "Slovenia", "Austria", "Germany")

**VIOLATION EXAMPLE (2026-10-16 - PRTronic):**
- Created filters with multiple Priority 1 entries (Slovenia, Austria, Germany all Priority 1)
- Used wrong PROMPT format (missing local language search terms)
- Used wrong ICP Match Prompt format (missing YES/NO structure)
- **This wasted time and required complete recreation of files**

**Checklist Before Finalizing Clay Filter Prompts CSV:**
- [ ] Read complete ICP Profile tab to count ALL industry segments
- [ ] Created ONE filter per location × industry combination
- [ ] Only ONE filter has Priority 1
- [ ] PROMPT follows exact format with local language search terms
- [ ] ICP Match Prompt follows exact YES/NO structure
- [ ] Date targeted is today's date
- [ ] Verified against reference examples (MoreFromFood, PRTronic)

**Reference Files:**
- `/public/clay-filters/PRTRONIC-CLAY-Filters-final.csv` - Correct format example
- Look for MoreFromFood examples in previous client work

**Rule Established:** 2026-10-16

**This is a CRITICAL rule - wrong format = client cannot use files, must recreate from scratch**

---

### 1G. HARD RULES: Positions CSV Format (CRITICAL)

**HARD RULE:** When creating Positions CSV during client onboarding, you MUST follow this EXACT format. This format has been validated across multiple clients and MUST be used consistently.

**Why:** Wrong format = incomplete lead generation, wrong people contacted, confused users. Format must match Clay import requirements and cover all relevant job titles.

**Column Structure Varies by Client Type:**

**B2B SaaS/Services:**
```csv
SEQUENCE,Title,Industries to Target,Position List EN,Position List [Local],Notes
```

**Hardware/Manufacturing:**
```csv
TIER,Title,Segments to Target,Position List EN,Position List DE,Position List SL,Notes
```

**CRITICAL CONSTRAINTS:**

1. **Position List in ONE cell** - Comma-separated titles, NOT split across List 1-7 columns
   - CORRECT: "CEO,Chief Executive Officer,Managing Director,General Manager,President,Founder"
   - WRONG: Separate columns for List 1, List 2, List 3, etc.

2. **Local language columns** - Add separate columns for each relevant language
   - German markets: Add "Position List DE" column
   - Slovenian markets: Add "Position List SL" column
   - Example: "Vodja razvoja,Vodja produktnega razvoja,Vodja tehnične razvoja"

3. **Title variations: 50-150 per PRIMARY category** including:
   - VP of X, Vice President of X, SVP of X, Senior Vice President of X
   - Head of X, Director of X, Senior Director of X, Global Director of X
   - Manager X, X Manager, Manager of X, Senior Manager of X
   - Lead X, X Lead, Principal X, Chief X
   - Local language equivalents (Leiter X, Vodja X, etc.)

4. **Notes column:** When to target these positions and why
   - Example: "OEMs & Integrators - Owns display specification, technical fit, qualification, and integration decisions. These are the technical gatekeepers who evaluate form factor, touch/interface specs, environmental requirements, and mounting constraints."

5. **TIER/SEQUENCE classification:**
   - **PRIMARY / SEQUENCE 1:** Core decision makers (50-150 titles each category)
   - **SECONDARY / SEQUENCE 2:** Influencers (30-80 titles each category)
   - **TERTIARY / TIER 3:** Fallback/small companies only (20-40 titles)

**Example Structure (Hardware/Manufacturing):**

```csv
TIER,Title,Segments to Target,Position List EN,Position List DE,Position List SL,Notes
PRIMARY,Engineering & Product Leadership,"OEMs • Equipment Manufacturers • Integrators • Specialized Applications","Technical Director,Director of Engineering,Engineering Director,Director Technical Development,Director of Technical Development,Hardware Lead,Hardware Engineering Lead,Lead Hardware Engineer,Product Manager,Technical Product Manager,Product Development Manager,Hardware Manager,Hardware Engineering Manager,Manager Hardware Development,Manager of Hardware,Head of Engineering,Head of Product,Head of Hardware,Head of Product Development,Head of Technical Development,VP Engineering,VP of Engineering,VP Product Development,VP of Product Development,VP Technical Development,VP of Technical Development,Chief Technical Officer,CTO","Entwicklungsleiter,Leiter Entwicklung,Entwicklungsmanager,Produktentwicklungsleiter,Leiter Produktentwicklung,Hardware-Entwicklungsleiter,Technischer Leiter,Leiter Technik,Leiter Engineering,Produktmanager,Technischer Produktmanager,Hardwaremanager,Manager Hardware,CTO","Vodja razvoja,Vodja produktnega razvoja,Vodja tehnične razvoja,Vodja inženiringa,Tehnični direktor,Direktor razvoja,Produktni manager,Tehnični produktni manager,Manager produktnega razvoja","OEMs & Integrators - Owns display specification, technical fit, qualification, and integration decisions. These are the technical gatekeepers who evaluate form factor, touch/interface specs, environmental requirements, and mounting constraints."
```

**VIOLATION EXAMPLE (2026-10-16 - PRTronic):**
- Created positions with Position List split across List 1-7 columns
- Used wrong column structure (Type instead of TIER)
- Missing local language columns for German and Slovenian
- Too few title variations (only 10-20 per category instead of 50-150)
- **This wasted time and required complete recreation of files**

**Checklist Before Finalizing Positions CSV:**
- [ ] Column structure matches client type (B2B SaaS vs Hardware)
- [ ] Position List in ONE cell (comma-separated)
- [ ] Added local language columns for target markets
- [ ] 50-150 title variations per PRIMARY category
- [ ] 30-80 title variations per SECONDARY category
- [ ] 20-40 title variations per TERTIARY category
- [ ] Notes column explains when to target each tier
- [ ] Verified against reference examples (Selekcija, PRTronic)

**Reference Files:**
- `/public/clay-filters/PRTRONIC-CLAY-Positions-final.csv` - Correct format example (Hardware)
- Look for Selekcija examples in previous client work (B2B SaaS)

**Rule Established:** 2026-10-16

**This is a CRITICAL rule - wrong format = client contacts wrong people, lead gen fails**

### 1H. HARD RULES: ICP Match Prompt Creation (CRITICAL)

**HARD RULE:** When creating ICP Match Prompts for Clay filters, follow this EXACT framework. These prompts determine which companies qualify for the client.

**Why This Matters:** The ICP Match Prompt is what separates qualified prospects from non-fits. Wrong criteria = wasted outreach on wrong companies.

---

## ICP Checker Framework (For All Clients)

### Phase 1: Define Qualification Criteria

Before writing ANY ICP Match Prompt, answer these questions:

1. **What does YES look like?**
   - What specific business activities/operations qualify?
   - What revenue/employee ranges apply?
   - What geographic markets?
   - What customer types or industries?

2. **What does NO look like?**
   - What disqualifies a company (list 5-7 specific disqualifiers)?
   - What business models don't fit?
   - What to explicitly exclude?

3. **What's UNSURE?**
   - What makes a company unclear without website verification?
   - What information requires digging deeper?

### Phase 2: ICP Match Prompt Structure

**EXACT FORMAT (MANDATORY):**

```
Review this company's website and public information to determine if they are a good fit for [CLIENT NAME], [what client offers].

Return ONLY "YES" or "NO" based on these criteria:

RETURN "NO" IF ANY OF THESE ARE TRUE:
1. [Disqualifier 1 - specific, measurable]
2. [Disqualifier 2 - specific, measurable]
3. [Disqualifier 3 - specific, measurable]
4. [Disqualifier 4 - specific, measurable]
5. [Disqualifier 5 - specific, measurable]
[... up to 7 disqualifiers]

RETURN "YES" IF ALL OF THESE ARE TRUE:
1. [Qualifier 1 - specific, measurable]
2. [Qualifier 2 - specific, measurable]
3. [Qualifier 3 - specific, measurable]
4. [Qualifier 4 - specific, measurable]
[... up to 6 qualifiers]

Base your decision on information found on company website, [relevant sections: Products page, About Us, Services, Careers, etc.].

Return only: YES or NO
```

### Phase 3: Critical Rules for Disqualifiers & Qualifiers

**DISQUALIFIERS (Make them specific, not vague):**

❌ WRONG: "Company is not in the right industry"
✅ CORRECT: "Company only manufactures consumer retail products without B2B operations"

❌ WRONG: "Company doesn't have the right size"
✅ CORRECT: "Company has fewer than 10 employees and no evidence of multi-site operations"

**5-7 Disqualifiers should cover:**
- Wrong business model (pure software, consultants, retailers without manufacturing, etc.)
- Wrong geography (if geography-dependent)
- Too small/too large (with specific numbers)
- Missing critical function (no quality team, no manufacturing, no operations, etc.)
- Explicit competitors or incompatible solutions

**QUALIFIERS (Make them measurable, not aspirational):**

❌ WRONG: "Company is growing and innovative"
✅ CORRECT: "Company manufactures food products with documented production facilities or multi-location operations"

❌ WRONG: "Company might need our solution"
✅ CORRECT: "Company operates production lines with documented quality controls or certifications (IFS, BRCGS, FSSC 22000, ISO 22000)"

**4-6 Qualifiers should cover:**
- Explicit manufacturing/business activity (what they actually do)
- Geographic match (if applicable)
- Size range (if applicable)
- Quality/operations signals (certifications, hiring, complexity)
- Evidence of buying authority (department exists on website)

---

### Phase 4: Evaluation Rules (For All Stages)

**Rule 1: Description-Based FIRST**
- Evaluate based ONLY on what description/website explicitly states
- Do NOT infer from company name or domain
- If unclear → mark UNSURE for website scraping (don't guess YES/NO)

**Rule 2: Ignore Pre-Assigned Classifications**
- Ignore third-party industry/category fields (like Clay's "Industry" field)
- Reason: These are often inaccurate
- Trust only factual company statements

**Rule 3: Ignore Unverified Metadata**
- Don't use employee count, revenue, or funding in initial evaluation
- These fields are frequently wrong in databases
- Only verify during website scraping for UNSURE companies

**Rule 4: Don't Disqualify for Competitor Usage**
- If company uses competitor solution → Still potentially qualified
- This is a BUYING SIGNAL (they have budget, understand value, may be unhappy)
- Do NOT add "uses competitor X" as a disqualifier

**Rule 5: Two-Pass Evaluation Strategy**
- **Pass 1:** Use descriptions to mark YES/NO/UNSURE (batch, cheap)
- **Pass 2:** Website scraping ONLY for UNSURE companies (targeted, expensive)
- Saves 80-95% of scraping costs

---

### Phase 5: Common Pitfalls (Do NOT Repeat)

❌ **Making disqualifiers too vague:**
- "Not in our target market" → Instead: "Company is a pure-software B2B firm without operations"

❌ **Making qualifiers too aspirational:**
- "Company might benefit from our solution" → Instead: "Company has documented quality control processes"

❌ **Excluding based on competitor usage:**
- "Uses competitor tool X" → This signals buying intent, not disqualification

❌ **Using unverified metadata:**
- "Company has 50 employees" (from database) → Only use if you verify on their website/LinkedIn

❌ **Ignoring third-party classification guidance:**
- "Clay says they're in retail" → Verify on actual website; Clay is often wrong

---

### Phase 6: Validation Before Using

**Before finalizing ICP Match Prompt, verify:**

- [ ] 5-7 disqualifiers are SPECIFIC and MEASURABLE
- [ ] 4-6 qualifiers are SPECIFIC and MEASURABLE
- [ ] No disqualifier mentions "competitor usage"
- [ ] No qualifiers mention unverified metadata (employee count, revenue)
- [ ] Format matches EXACT structure above (YES/NO section headers, YES IF ALL, NO IF ANY)
- [ ] Website sections specified ("Base your decision on...Products page, About Us, etc.")
- [ ] Ends with "Return only: YES or NO"

---

**Reference Examples:**
- `/public/clay-filters/PRTRONIC-CLAY-Filters-final.csv` - See ICP Match Prompt for Display Integration
- MoreFromFood example (from 235-company evaluation) - Manufacturing disqualifiers and qualifiers

**Rule Established:** 2026-10-16

**This is a CRITICAL rule - wrong ICP Match Prompt = wrong companies contacted, wasted lead gen budget**

---

---

### 2. Adding a New Client Requires Multiple Files (CRITICAL - ALWAYS DO ALL)

**HARD RULE:** When the user says "create a dashboard" for a new client, you MUST update ALL of these files. No exceptions. Client must appear in navigation immediately.

**Required files when creating a new client dashboard:**

1. **`/app/[clientname]/page.tsx`** - The dashboard page
2. **`/public/tasks/[clientname].json`** - Empty array `[]`
3. **`/public/uploads/[clientname]/.metadata.json`** - Empty array `[]`
4. **`/public/sequences/[clientname].json`** - Email sequences JSON
5. **`/public/_redirects`** - Add route: `/[clientname]/* /[clientname] 200`
6. **`/lib/auth.ts`** - Add to:
   - `ClientAccess` type
   - `CLIENT_PASSWORDS` object
   - `getAllowedClients()` admin array
7. **`/app/components/Sidebar.tsx`** - Add to `defaultClients` array (NAVIGATION - MANDATORY)
8. **`/app/components/ClientsTab.tsx`** - Add to `ALL_CLIENTS` array
9. **`/app/components/StatusBadge.tsx`** - Add to `DEFAULT_STATUSES`
10. **`/app/admin/page.tsx`** - Add to:
    - `clientIds` array (for task fetching)
    - `clientNames` object

**Why this is CRITICAL:**
- Missing Sidebar.tsx → Client invisible in navigation (USER WILL ASK "WHERE IS IT?")
- Missing auth.ts → Cannot log in
- Missing _redirects → 404 errors
- Missing upload directory → Upload failures
- Missing tasks/sequences → Feature tabs broken
- Missing ClientsTab.tsx → Not visible in /intelsol/clients
- Missing admin page → Not tracked in admin dashboard

**Lesson Learned (2026-10-06):**
- Created Selekcija and Intera dashboards but forgot Sidebar.tsx
- User had to ask "why don't I see the 2 new dashboards in navigation?"
- **This wasted time and frustrated the user**
- **Rule established: Dashboard creation = MUST appear in navigation IMMEDIATELY**

**Checklist before saying "dashboard created":**
- [ ] Dashboard page exists
- [ ] Client appears in sidebar navigation
- [ ] Login credentials work
- [ ] All tabs functional (Tasks, Documents, Sequences)
- [ ] Build passes
- [ ] Committed and pushed to GitHub

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

### 6. ALWAYS Paginate Smartlead API Calls

**Rule:** The Smartlead API returns a MAXIMUM of 100 results per request. You MUST implement pagination to fetch ALL results.

**Critical Endpoints That Require Pagination:**
- `/api/v1/email-accounts` - Mailboxes (can have 98+ per client)
- `/api/v1/campaigns` - Campaigns (can have 50+ per client)
- `/api/v1/campaigns/{id}/leads` - Leads (can have thousands per campaign)

**Pagination Parameters:**
- `limit` (max: 100, default: 100)
- `offset` (start position, increment by 100)

**Implementation Pattern:**
```typescript
async function fetchAllSmartlead(endpoint: string, apiKey: string): Promise<any[]> {
  let allResults: any[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const url = `${SMARTLEAD_BASE_URL}${endpoint}?api_key=${apiKey}&offset=${offset}&limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();
    const results = Array.isArray(data) ? data : (data.accounts || data.campaigns || []);

    allResults = allResults.concat(results);

    if (results.length < limit) break; // Last page
    offset += limit;
  }

  return allResults;
}
```

**Why This Is Critical:**
- Without pagination, you only get the FIRST PAGE (up to 100 results)
- Intelsol has 98 mailboxes - was showing only 23 (the ones on page 1)
- Missing data causes incorrect capacity calculations and lead counts
- ALL clients are affected, not just large ones

**Lesson Learned (2026-09-08):**
- Intelsol showed 23 mailboxes instead of 98 → only fetching first page
- Other clients had incorrect counts too
- Implemented `fetchAllSmartlead()` function that paginates through all results
- **This is now implemented in `/functions/api/client-metrics.ts`**
- NEVER remove or modify this pagination logic

---

### 7. NEVER Commit Personal Data to Public Repositories (GDPR/GitHub Policy)

**HARD RULE:** NEVER commit files containing personal contact information to any GitHub repository. This violates GitHub's Acceptable Use Policy, GDPR, and will cause repository disablement.

**Files That MUST NEVER Be Committed:**

❌ **NEVER commit:**
- CSV files with personal contact data (names, emails, phone numbers, LinkedIn URLs)
- Lead databases or CRM exports
- Client lists with contact information
- Any file containing personal identifiable information (PII)
- Marketing campaign databases with prospect data

✅ **ALWAYS keep these files:**
- In `/public/data/` directory (already in .gitignore)
- Stored locally only on your machine
- Backed up outside the repository
- Never tracked by git

**Why This Is Critical:**
- GitHub disabled `intelsol-client-portal` repository for privacy violation
- Received DMCA-style takedown notice for private information
- Violates GDPR (EU privacy law)
- Violates GitHub Acceptable Use Policy
- Can result in permanent account suspension

**What Happened (2026-10-05):**
- Repository `Angela0023/intelsol-client-portal` disabled by GitHub Trust & Safety
- Reason: CSV files with 52,000+ personal records (names, emails, LinkedIn URLs)
- Specifically cited: `eblissai-database.csv` with private contact information
- Had to create new repository `intelsol-client-portal-v2`
- Used `git-filter-repo` to remove all personal data from entire git history

**Protection Implemented:**
- Added `/public/data/` to `.gitignore`
- Removed all 12 database CSV files from git tracking
- Removed all personal data from entire git history (467 commits cleaned)
- Created backups outside repository: `BACKUP-CSV-FILES-20261005/`
- Repository size reduced from bloated to 32.82 MiB

**Download Functionality Still Works:**
- Files exist locally in `/public/data/` directory
- Static site serves them via `/data/[client]-database.csv` links
- Files are NOT in git, but ARE in deployed site (copied during build)
- Cloudflare Pages serves local files automatically

**If You Accidentally Commit Personal Data:**
1. STOP immediately - do NOT push to GitHub
2. Remove files from git tracking: `git rm --cached public/data/*.csv`
3. Add to .gitignore if not already there
4. Commit the removal
5. Use `git-filter-repo` to remove from history
6. Force push to clean the repository

**Correct Workflow:**
1. Lead/contact data syncs to local `/public/data/` directory
2. `.gitignore` prevents git from tracking these files
3. Files remain local for download functionality
4. Git commits/pushes contain NO personal data
5. Repository stays compliant with GDPR and GitHub policies

**VIOLATION CONSEQUENCES:**
- Repository disabled by GitHub Trust & Safety
- Cannot push or access repository
- Must appeal for reinstatement (can take days/weeks)
- Potential account suspension for repeat violations
- Legal liability under GDPR
- **This is a CRITICAL rule violation with severe external consequences**

**Rule Established:** 2026-10-05

---

## 🗄️ R2 Storage for CSV Files (GDPR-Compliant)

### Overview

**Why R2?** CSV files contain personal data (names, emails, LinkedIn URLs) that CANNOT be committed to GitHub due to GDPR and GitHub's Acceptable Use Policy. Previously, the repository was disabled for violating these policies. R2 provides secure, authenticated storage that keeps personal data protected while allowing downloads to work on the live site.

### Architecture

**Storage:**
- Cloudflare R2 bucket: `intelsol-client-data`
- Bucket is **PRIVATE** (no public access)
- Files stored at: `data/{clientId}-database.csv`

**Access:**
- Downloads route through `/api/download-csv` (authenticated API)
- API checks portal login via session cookie
- API verifies user has access to requested client
- API streams file from R2 to user
- NO direct public access to R2

**Sync Flow:**
1. User clicks "Update Database" button on Documents tab
2. Triggers `/api/sync-client-data` API endpoint
3. API triggers GitHub Actions workflow: `sync-client-data.yml`
4. Workflow fetches leads from SmartLead API
5. Workflow generates CSV files locally in workflow runner
6. Workflow uploads CSV files to R2 (NOT to git)
7. CSV files NEVER committed to GitHub repository

### Why This Is Safe (GDPR-Compliant)

✅ **CSV files never in git** - No personal data in repository
✅ **R2 bucket is private** - No public access to personal data
✅ **Downloads require authentication** - Portal login required
✅ **Access control enforced** - Users only access their clients
✅ **Complies with GDPR** - Personal data properly protected
✅ **GitHub won't block us** - No policy violations

### Required Configuration

**GitHub Secrets** (https://github.com/Angela0023/intelsol-client-portal-v2/settings/secrets/actions):
- `GH_PAT` - GitHub Personal Access Token (repo access)
- `SMARTLEAD_API_KEY` - SmartLead API key
- `CLOUDFLARE_R2_TOKEN` - Cloudflare R2 API token

**Cloudflare Pages R2 Binding**:
1. Go to Cloudflare Dashboard → Workers & Pages → intelsol-client-portal-v2
2. Settings → Functions → R2 bucket bindings
3. Add binding: Variable name = `R2_BUCKET`, R2 bucket = `intelsol-client-data`

### Files

**API Endpoints:**
- `/functions/api/download-csv.ts` - Authenticated download endpoint
- `/functions/api/sync-client-data.ts` - Trigger sync workflow

**Workflow:**
- `.github/workflows/sync-client-data.yml` - Syncs SmartLead → R2

**Scripts:**
- `scripts/sync-csv-to-r2.sh` - Manual sync script

**Component:**
- `/app/components/DocumentsTabGeneric.tsx` - Download link points to `/api/download-csv`

### Storage Tracking

**Current Usage:**
- CSV files: ~10 MB
- R2 Free Tier: 10 GB/month
- Usage: <1% of free tier

**R2 Free Tier Limits:**
- 10 GB storage/month
- 10 million Class A operations (list, write)
- 100 million Class B operations (read)
- No egress fees

### Manual Sync (if needed)

```bash
export CLOUDFLARE_API_TOKEN="your-r2-token"
./scripts/sync-csv-to-r2.sh
```

### Troubleshooting

**Issue: Downloads return 404**
- Check R2 binding is configured in Cloudflare Pages
- Verify `R2_BUCKET` binding points to `intelsol-client-data`
- Check Cloudflare Pages deployment logs

**Issue: Unauthorized error on download**
- User not logged into portal
- User doesn't have access to that client
- Session cookie expired

**Issue: Workflow fails to upload to R2**
- Check `CLOUDFLARE_R2_TOKEN` secret is configured
- Verify R2 token has permissions: Account → Workers R2 Storage → Edit + Read
- Check workflow logs for specific error

**Issue: Download works but file is outdated**
- Run "Update Database" from Documents tab
- Wait 3-5 minutes for workflow to complete
- Check GitHub Actions for workflow status

### Lesson Learned (2026-10-06)

**Problem:** GitHub disabled original repository (`intelsol-client-portal`) for committing CSV files with 52,000+ personal records, violating GDPR and GitHub Acceptable Use Policy.

**Solution:** Implemented R2 storage with authenticated access. CSV files never committed to git, downloads require portal login, personal data protected. This architecture is compliant and sustainable.

**Rule Established:** 2026-10-06

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

## 📊 Clients Tab & Mailbox Metrics

**Overview:** The Clients tab (`/app/components/ClientsTab.tsx`) displays real-time metrics for all clients by fetching data from Smartlead API.

**API Endpoint:** `/functions/api/client-metrics.ts`

**Request:** `GET /api/client-metrics?clientId=intelsol`

### Mailbox Logic

**Active vs Inactive Mailboxes:**
- **Active mailbox:** `message_per_day > 1`
- **Inactive mailbox:** `message_per_day == 1`
- **Why:** Setting daily limit to 1 is how user marks mailboxes as "not in use"

**Capacity Calculation:**
- **Total Capacity** = Sum of `message_per_day` from ACTIVE mailboxes ONLY
- Inactive mailboxes (limit=1) are NOT counted toward capacity
- This is the correct number for "how many emails can we send per day"

**Example (Intelsol):**
- Total mailboxes: 98
- Active mailboxes: 37 (message_per_day > 1)
- Inactive mailboxes: 61 (message_per_day == 1)
- Total capacity: 240/day (sum from 37 active mailboxes)

### Remaining Leads Calculation

**Definition:** Leads that have NOT been sent the first email yet

**Formula:**
```
For each ACTIVE campaign:
  Remaining = Total Leads - Sent Count

Total Remaining Leads = Sum of all ACTIVE campaign remainingLeads
```

**Days Remaining:** `Math.ceil(remainingLeads / totalCapacity)`

### Data Structure

```typescript
interface ClientMetrics {
  clientId: string;
  clientName: string;
  mailboxCount: number;              // Total mailboxes
  activeMailboxCount: number;        // Where message_per_day > 1
  inactiveMailboxCount: number;      // Where message_per_day == 1
  totalCapacity: number;             // Sum from active mailboxes
  remainingLeads: number;            // Leads not yet contacted
  daysRemaining: number;             // remainingLeads / totalCapacity
  activeCampaigns: number;           // Count of ACTIVE campaigns
  campaigns: CampaignDetail[];       // Array of campaign details
  mailboxes: MailboxDetail[];        // Array of mailbox details
}
```

### Critical Requirements

1. **MUST use pagination** - See Hard Rule #6 above
2. **MUST fetch ALL clients in parallel** - Use `Promise.all()`
3. **MUST show all 13 clients even if API fails** - Show zeros for failed clients
4. **MUST only count ACTIVE campaigns** - Status === 'ACTIVE'

**Lesson Learned (2026-09-08):**
- Implemented active/inactive mailbox tracking
- Only active mailboxes (limit > 1) count toward capacity
- This matches user's workflow for marking mailboxes as unused

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

Last updated: 2026-08-13 (Added HARD RULES: Never use Unicode characters in email sequences (1C), Always add client website to dashboard (1D). Fixed AdSigner sequence corruption. Removed all internal tool names from client-visible tabs.)
