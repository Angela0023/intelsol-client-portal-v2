---
name: client-onboarding-intelsol
description: Complete IntElsol client dashboard onboarding - Creates portal dashboard following all GitHub rules + generates Clay Filter Prompts CSV and Positions CSV for Google Sheets import. One command, everything synchronized.
---

# Client Onboarding - IntElsol Portal

**Skill Name:** `client-onboarding-intelsol`
**Invocation:** `/client-onboarding-intelsol`
**Purpose:** Automated end-to-end onboarding of new IntElsol client with dashboard + Google Sheets CSVs

---

## What This Skill Does

Fully automates the creation of:
1. **Client Portal Dashboard** (all 10 required files per GitHub rules)
2. **Clay Filter Prompts CSV** (ready for Google Sheets import)
3. **Positions CSV** (ready for Google Sheets import)

Everything is synchronized - the dashboard ICP content matches the CSVs exactly.

---

## ⚠️ CRITICAL RULES FROM RECENT LEARNINGS (Oct 2026)

### Rule 1: DEPLOYMENT VERIFICATION IS MANDATORY

**Never claim a dashboard is "deployed" unless you can verify it on Cloudflare Pages.**

Process:
1. **Edit code** and test locally (npm run build)
2. **Commit locally** (git commit)
3. **Push to GitHub** (git push origin main) - **THIS IS CRITICAL**
4. **Verify on GitHub** - confirm commits appear on main branch
5. **Wait 30-60 seconds** for Cloudflare to detect the push
6. **Check Cloudflare Pages dashboard** at https://dash.cloudflare.com/
   - Go to Pages > intelsol-client-portal-v2
   - Check Deployments tab
   - Verify latest deployment shows build status
   - Confirm commit SHA matches what you pushed
7. **ONLY THEN** claim the work is done

**RULE: If you haven't verified on Cloudflare Pages dashboard, you have NOT deployed.**

**What NOT to do:**
- ❌ Claim "deployed" without pushing to GitHub
- ❌ Assume deployment happened (verify it!)
- ❌ Skip the Cloudflare verification step
- ❌ Move on before confirming build succeeded

**Real example that violated this rule:**
- Claude claimed deployment was done ✓
- Code was never pushed to GitHub ✗
- User refreshed dashboard 100+ times ✗
- Nothing appeared because code wasn't on remote ✗
- This must NEVER happen again ✗

---

### Rule 2: SEQUENCE NAMING AND COLOR DIFFERENTIATION

**When creating email sequences, ALWAYS:**

1. **Use `tierName` field, not `name` field**
   - ❌ WRONG: `"name": "SI LEAD - Slovenia Hotel Leadership"`
   - ✅ RIGHT: `"tierName": "SEQUENCE A: Slovenia Hotel Leadership"`

2. **ALWAYS include `tierColor` field**
   - ❌ WRONG: No color specified, defaults to blue
   - ✅ RIGHT: Explicitly set `"tierColor": "emerald"` for each sequence

3. **ALWAYS differentiate colors between sequences**
   - ❌ WRONG: All 4 sequences have `"tierColor": "emerald"`
   - ✅ RIGHT: Sequence A = emerald, Sequence B = orange, Sequence C = cyan, Sequence D = yellow

4. **Ensure colors are supported in SequencesTab component**
   - Supported colors: blue, green, amber, purple, indigo, emerald, orange, cyan, yellow
   - If you use a different color, update `/app/components/SequencesTab.tsx` tierColors object first

5. **Verify sequences display correctly on dashboard**
   - Sequence names should be visible (from tierName field)
   - Each sequence should have its own color
   - If all sequences show blue or are missing names, the component isn't recognizing the colors/names

---

### Rule 3: FILTER-TO-POSITION MAPPING (ASKIT LESSON)

(See "CRITICAL MISTAKES TO AVOID" section below for complete details)

The rule: **Positions CSV must explicitly map each position to which Clay Filters it applies, with PRIMARY/SECONDARY designation in the Notes column.**

---

## ⚠️ CRITICAL MISTAKES TO AVOID (Learned from ASKIT)

**MISTAKE 1: Generic Positions CSV (WRONG)**
```
Position,Filters,EN Titles
CEO,All Filters,"CEO, President, MD, ..."
CFO,All Filters,"CFO, Finance Director, ..."
```
❌ This is generic and doesn't help anyone targeting specific filters.

**CORRECT FORMAT:**
```
Position,Filters to Target,EN Titles,Notes
CEO,ALL FILTERS,CEO, President, MD,...,"PRIMARY decision maker across all segments. Target in ALL FIVE filters."
CFO,"B2B Services (primary), Market Leaders (secondary)","CFO, Finance Director,...","TIER 2... Critical for B2B Services (margin optimization)... Target in: B2B Services (primary), Market Leaders (secondary)..."
COO,"Manufacturing (primary), Logistics (primary), Complex Enterprise (primary), B2B Services (secondary)","COO, Operations Director,...","TIER 2 stakeholder... Primary for Manufacturing (production systems), Logistics (supply chain)... Target in: Manufacturing (primary), Logistics (primary)..."
```

**MISTAKE 2: Treating "Filters to Target" as Optional Description**
❌ Wrong: Notes = just a description of the role
✅ Right: Notes = **THE BRIDGE** - explicitly maps position to filters and marks PRIMARY/SECONDARY

**MISTAKE 3: Creating Positions Without Understanding Which Filters They Apply To**
❌ Wrong: "Create 5 position categories and assume they all apply to all filters"
✅ Right: "For each position, think: Which filters does this decision maker actually matter in? PRIMARY or SECONDARY?"

**Example Analysis:**
- Manufacturing Company Problem = Operational efficiency & production systems → CEO + **COO** + **CIO**
- B2B Services Problem = Margin pressure & cost optimization → CEO + **CFO** + COO
- Market Leaders Problem = Growth capability & transformation → CEO + **HR/L&D** + CFO

If you ignore this, your Positions CSV will be confusing and useless.

**MISTAKE 4: Copying PRTronic Format Without Understanding Why It Works**
❌ Wrong: Copy PRTronic's CLAY Filter Prompts but create generic positions
✅ Right: Understand that PRTronic maps positions to filters because different regions have different buying patterns

**RULE: NO POSITIONS CSV IS COMPLETE WITHOUT EXPLICIT FILTER-TO-POSITION MAPPING IN THE NOTES COLUMN.**

---

## Process Flow

### STEP 1: Gather Client Information

**Ask user for:**

1. **Client ICP Documentation**
   - "Please provide the path to the client's ICP documentation (DOCX, MD, or text file)"
   - Search locations if not provided:
     - `~/Dopamine-Digital/clients/[client-name]/*ICP*.docx`
     - `~/Downloads/*ICP*.docx`
     - `~/Downloads/INTELSOL_*_ICP.docx`

2. **Assignee**
   - "Who should be assigned to this client? (Frosina, Matej, or Filip)"
   - Wait for response, validate it's one of the three names

3. **Client Basic Info** (extract from ICP or ask):
   - Client name (lowercase for folder, e.g., "clientname")
   - Display name (e.g., "ClientName Inc.")
   - Company website URL
   - Brief description (e.g., "SaaS Platform for Healthcare")
   - Default status (usually "Onboarding")
   - Password (generate secure one: `{ClientName}.Leads.{random2digits}`)

---

### STEP 2: Extract ICP Data

**Read and parse ICP documentation:**

Extract:
- Product/offering description
- Target geographies/locations
- Target company size (employees, revenue)
- Target industries (primary, secondary, tertiary)
- Target positions/decision makers
- Best customers (examples)
- Dream customers (wishlist)
- Bad-fit customers (exclusions)
- Pain points and triggers
- Buying signals
- Technology signals
- Proof points/case studies
- Exclusion criteria

**Convert .docx if needed:**
```bash
textutil -convert txt "path/to/ICP.docx" -output /tmp/icp_temp.txt && cat /tmp/icp_temp.txt
```

---

### STEP 3: Strategic Industry Analysis

**CRITICAL - Follow `/icp-google-sheets` logic:**

For each industry mentioned:
1. Does this industry actually buy this type of product?
2. What drives buying in this industry?
3. Conversion potential scoring (TIER 1, TIER 2, TIER 3)
4. Check "catch-all" phrases and fill gaps
5. Dashboard vs. ICP reconciliation

Output: Ranked industry list with conversion tier and priority

---

### STEP 4: Create Client Dashboard

**Follow HARD RULES from:**
- `/Users/angelapetkovska/Desktop/Claude Clients/intelsol-client-portal/CLAUDE.md`

**Required Files (10 total):**

1. **`/app/[clientname]/page.tsx`** - **COMPLETE STRUCTURE TEMPLATE (NO EXCEPTIONS)**

   **YOU MUST USE THIS EXACT STRUCTURE:**

   ```typescript
   'use client';

   import { useState, useEffect } from 'react';
   import ClientLayout from '../components/ClientLayout';
   import { ContentSection, CodeBlock, InfoCard, ListItem } from '../components/ContentSection';
   import SequencesTab from '../components/SequencesTab';
   import CampaignsTabGeneric from '../components/CampaignsTabGeneric';
   import PerformanceTabDynamic from '../components/PerformanceTabDynamic';
   import CampaignsTabDynamic from '../components/CampaignsTabDynamic';
   import DocumentsTabGeneric from '../components/DocumentsTabGeneric';
   import TasksTab from '../components/TasksTab';
   import StatusBadge, { getClientStatus, setClientStatus, DEFAULT_STATUSES, type ClientStatus } from '../components/StatusBadge';
   import { getClientAssignee, type Assignee } from '../../lib/auth';
   import AssigneeBadge, { getStoredAssignee, setStoredAssignee } from '../components/AssigneeBadge';
   import { Target, Filter, Code, TrendingUp, FileText, CheckSquare, BarChart3, Zap, FolderOpen } from 'lucide-react';

   const tabs = [
     { id: 'overview', label: 'Overview', icon: FileText },
     { id: 'icp', label: 'ICP Profile', icon: Target },
     { id: 'filters', label: 'Clay Filters', icon: Filter },
     { id: 'prompts', label: 'AI Prompts', icon: Code },
     { id: 'campaigns-sequences', label: 'Campaigns & Sequences', icon: Zap },
     { id: 'performance', label: 'Performance', icon: BarChart3 },
     { id: 'documents', label: 'Documents', icon: FolderOpen },
     { id: 'tasks', label: 'Tasks', icon: CheckSquare },
   ];

   export default function ClientNamePage() {
     const [activeTab, setActiveTab] = useState('overview');
     const [status, setStatus] = useState<ClientStatus>('Active');
     const [assignee, setAssignee] = useState<Assignee | null>(null);
     const [isAdmin, setIsAdmin] = useState(false);

     useEffect(() => {
       setStatus(getClientStatus('clientname', DEFAULT_STATUSES.clientname));
       setAssignee(getStoredAssignee('clientname', getClientAssignee('clientname')));

       // Check if user is admin
       const access = sessionStorage.getItem('clientAccess');
       let userIsAdmin = false;
       if (access) {
         try {
           const parsedAccess = JSON.parse(access);
           userIsAdmin = parsedAccess.includes('admin');
           setIsAdmin(userIsAdmin);
         } catch {
           setIsAdmin(false);
         }
       }

       // Internal tabs that should be hidden from non-admin users
       const internalTabs = ['filters', 'prompts'];

       // Read initial tab from URL pathname
       const path = window.location.pathname;
       const tabFromPath = path.split('/').pop();
       const validTab = tabs.find(t => t.id === tabFromPath);
       if (validTab && (userIsAdmin || !internalTabs.includes(validTab.id))) {
         setActiveTab(validTab.id);
       }

       // Handle browser back/forward
       const handlePopState = () => {
         const path = window.location.pathname;
         const tabFromPath = path.split('/').pop();
         const validTab = tabs.find(t => t.id === tabFromPath);
         if (validTab && (userIsAdmin || !internalTabs.includes(validTab.id))) {
           setActiveTab(validTab.id);
         } else {
           setActiveTab('overview');
         }
       };

       window.addEventListener('popstate', handlePopState);
       return () => window.removeEventListener('popstate', handlePopState);
     }, []);

     const handleStatusChange = (newStatus: ClientStatus) => {
       setStatus(newStatus);
       setClientStatus('clientname', newStatus);
     };

     const handleAssigneeChange = (newAssignee: Assignee) => {
       setAssignee(newAssignee);
       setStoredAssignee('clientname', newAssignee);
     };

     const handleTabChange = (tabId: string) => {
       setActiveTab(tabId);
       const newPath = tabId === 'overview' ? '/clientname' : `/clientname/${tabId}`;
       window.history.pushState({}, '', newPath);
     };

     // Filter tabs based on admin access
     const visibleTabs = isAdmin
       ? tabs
       : tabs.filter(tab => !['filters', 'prompts'].includes(tab.id));

     return (
       <ClientLayout>
         <div className="p-4 lg:p-8">
           {/* Page Header */}
           <div className="mb-6">
             <div className="flex items-center space-x-2 lg:space-x-3 mb-2">
               <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                 <span className="text-xl lg:text-2xl font-bold text-blue-600">CN</span>
               </div>
               <div className="flex-1 min-w-0">
                 <div className="flex items-center space-x-2 lg:space-x-3 flex-wrap">
                   <h1 className="text-xl lg:text-3xl font-bold text-slate-900">Client Name</h1>
                   <StatusBadge status={status} onStatusChange={handleStatusChange} size="md" />
                   {isAdmin && <AssigneeBadge assignee={assignee} onAssigneeChange={handleAssigneeChange} size="md" />}
                 </div>
                 <p className="text-sm lg:text-base text-slate-600 break-words">Brief description of what client does</p>
               </div>
             </div>
             <a
               href="https://www.clientwebsite.com"
               target="_blank"
               rel="noopener noreferrer"
               className="text-sm text-blue-600 hover:underline inline-block"
             >
               Visit Website →
             </a>
           </div>

           {/* Tabs */}
           <div className="border-b border-slate-200 mb-6 -mx-4 px-4 lg:mx-0 lg:px-0">
             <div className="flex space-x-1 overflow-x-auto scrollbar-hide pb-px">
               {visibleTabs.map((tab) => (
                 <button
                   key={tab.id}
                   onClick={() => handleTabChange(tab.id)}
                   className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-2 lg:py-3 border-b-2 transition-colors whitespace-nowrap text-sm lg:text-base flex-shrink-0 ${
                     activeTab === tab.id
                       ? 'border-[#1a2647] text-[#1a2647] font-medium'
                       : 'border-transparent text-slate-600 hover:text-slate-900'
                   }`}
                 >
                   <tab.icon className="w-4 h-4" />
                   <span className="hidden sm:inline">{tab.label}</span>
                 </button>
               ))}
             </div>
           </div>

           {/* Tab Content */}
           {activeTab === 'overview' && (
             <div className="space-y-6">
               {/* YOUR OVERVIEW TAB CONTENT HERE */}
             </div>
           )}

           {activeTab === 'icp' && (
             <div className="space-y-6">
               {/* YOUR ICP PROFILE TAB CONTENT HERE */}
             </div>
           )}

           {activeTab === 'filters' && (
             <div className="space-y-6">
               {/* YOUR CLAY FILTERS TAB CONTENT HERE */}
             </div>
           )}

           {activeTab === 'prompts' && (
             <div className="space-y-6">
               {/* YOUR AI PROMPTS TAB CONTENT HERE */}
             </div>
           )}

           {activeTab === 'campaigns-sequences' && (
             <>
               <SequencesTab clientId="clientname" />
               <div className="mt-8">
                 <CampaignsTabGeneric />
               </div>
             </>
           )}

           {activeTab === 'performance' && (
             <>
               <PerformanceTabDynamic clientId="clientname" />
               <CampaignsTabDynamic clientId="clientname" />
             </>
           )}

           {activeTab === 'documents' && <DocumentsTabGeneric clientId="clientname" />}

           {activeTab === 'tasks' && <TasksTab clientId="clientname" />}
         </div>
       </ClientLayout>
     );
   }
   ```

   **CRITICAL - Replace these placeholders:**
   - `clientname` → actual client ID (lowercase, no spaces)
   - `ClientName` → actual display name
   - `CN` → client initials (2 letters max)
   - `bg-blue-100` / `text-blue-600` → unique color for this client
   - `Brief description` → actual product description
   - `https://www.clientwebsite.com` → actual website URL

   **Tab Content Styling Rules (NO EXCEPTIONS):**
   - ✅ Use `<InfoCard label="X" value="Y" />` for metrics in grids
   - ✅ Use colored border-left cards for all sections
   - ✅ Use `<ListItem type="check">Item</ListItem>` for ALL lists
   - ❌ NEVER use plain `<ul>` or `<li>` tags
   - ❌ NEVER use plain paragraph text without card wrappers

2. **`/public/tasks/[clientname].json`**
   - Empty array: `[]`

3. **`/public/uploads/[clientname]/.metadata.json`**
   - Empty array: `[]`

4. **`/public/sequences/[clientname].json`**
   - Empty array: `[]` (sequences created separately later)

5. **`/public/_redirects`**
   - Add route: `/[clientname]/* /[clientname] 200`

6. **`/lib/auth.ts`**
   - Add to `ClientAccess` type
   - Add to `CLIENT_PASSWORDS` object
   - Add to `getAllowedClients()` admin array
   - Add to `CLIENT_ASSIGNEES` with assignee from STEP 1

7. **`/app/components/Sidebar.tsx`**
   - Add to `defaultClients` array (NAVIGATION - MANDATORY)

8. **`/app/components/ClientsTab.tsx`**
   - Add to `ALL_CLIENTS` array

9. **`/app/components/StatusBadge.tsx`**
   - Add to `DEFAULT_STATUSES`

10. **`/app/admin/page.tsx`**
    - Add to `clientIds` array
    - Add to `clientNames` object

**Color scheme:** Rotate through: blue, green, purple, amber, indigo (based on existing clients)

**CRITICAL:** Dashboard ICP content MUST match the CSV filters exactly.

---

### STEP 5: Create Clay Filter Prompts CSV

**CRITICAL CONCEPT - FILTERS AND POSITIONS MUST WORK TOGETHER**

Before creating filters, understand this relationship:
- **Clay Filters** = WHO to target (geographic × industry segments)
- **Positions CSV** = WHICH decision makers to reach in those companies
- **The Notes column in Positions** = THE BRIDGE that connects filters to positions

**Example:**
- If you create "Slovenia - Manufacturing" filter, your Positions CSV must show which roles apply to manufacturing companies
- If you create "Austria - Retail" filter, your Positions CSV must show which roles apply to retail companies
- If COO/Operations is PRIMARY for Manufacturing but SECONDARY for Retail, the Notes column must make this crystal clear

**Rule:** Never create a Positions CSV that treats all positions equally for all filters. Each position's Notes must explicitly list which filters it applies to and whether it's PRIMARY or SECONDARY for each.

**File structure:**
```
Title,PROMPT,Industry,Location,Date targeted,Company List,ICP Match Prompt,Priority
```

**HARD RULES (CRITICAL - NEVER BREAK):**

1. **PRIORITY 1 CAN ONLY BE ONE FILTER** - Not multiple. Only the single highest-priority location × industry gets Priority 1.
2. **ONE filter per location × industry combination** - Never combine multiple locations into one filter
3. **Title format:** "[Location] - [Industry]" (e.g., "Slovenia - Display Integration", "Austria - Food Manufacturing")

4. **PROMPT format (EXACT STRUCTURE):**
   ```
   [Industry description] companies in [Location] including: [segments]. Company size: [ranges]. Prioritize companies with evidence of: [signals]. Search terms: [local language terms].
   ```
   **Example:**
   ```
   "Display hardware sourcing companies in Slovenia including: (A) equipment manufacturers embedding displays, (B) AV/signage integrators, (C) multi-site operators. Company size: 5-500 employees for manufacturers/integrators, 50-2000 for operators. Prioritize companies with evidence of: current product lines with displays, signage portfolio, quality certifications, hiring for technical roles. Search terms: vgradni zaslon, zaslon na dotik, digitalno prikazovanje."
   ```

5. **ICP Match Prompt format (EXACT STRUCTURE):**
   ```
   Review this company's website and public information to determine if they are a good fit for [Client Name], [what client offers].

   Return ONLY "YES" or "NO" based on these criteria:

   RETURN "NO" IF ANY OF THESE ARE TRUE:
   1. [Disqualifier 1]
   2. [Disqualifier 2]
   3. [Disqualifier 3]
   4. [Disqualifier 4]
   5. [Disqualifier 5]
   6. [Disqualifier 6]

   RETURN "YES" IF ALL OF THESE ARE TRUE:
   1. [Qualifier 1]
   2. [Qualifier 2]
   3. [Qualifier 3]
   4. [Qualifier 4]
   5. [Qualifier 5]

   Base your decision on information found on company website, [relevant sections].

   Return only: YES or NO
   ```

6. **Priority sequence:** Only ONE filter can be Priority 1. Priority 2, 3, 4... in descending order of conversion potential.

7. **Date targeted:** Today's date in M/D/YYYY format (e.g., "10/16/2026")

**Save to:**
`~/Downloads/Leads_[ClientName]_CLAY_Filter_Prompts.csv`

---

### STEP 6: Create Positions CSV

**Follow Selekcija/MoreFromFood format exactly:**

**File structure:**
```
TIER (or SEQUENCE),Title,[Industry/Segment Column],Position List EN,Position List [Local Language],Notes
```

**HARD RULES (CRITICAL - NEVER BREAK):**

1. **Column structure varies by client type:**
   - **B2B SaaS/Services:** `SEQUENCE,Title,Industries to Target,Position List EN,Position List [Local],Notes`
   - **Hardware/Manufacturing:** `TIER,Title,Segments to Target,Position List EN,Position List DE,Position List SL,Notes`

2. **Position List format:** Comma-separated titles in ONE cell (not split across List 1-7)
   **Example:**
   ```
   "HR Director,Head of HR,HR Manager,VP of HR,Vice President of HR,Director of HR,..."
   ```

3. **Local language columns:** Add separate columns for each relevant language
   - German markets: Add "Position List DE"
   - Slovenian markets: Add "Position List SL"
   - Multi-language: Include all relevant columns

4. **Title variations:** 50-150 variations per PRIMARY category including:
   - VP of X, Vice President of X, SVP of X, Senior Vice President of X
   - Head of X, Director of X, Senior Director of X, Global Director of X
   - Manager X, X Manager, Manager of X, Senior Manager of X
   - Local language equivalents (Leiter X, Vodja X, etc.)

5. **CRITICAL - Notes column MUST map positions to Clay Filters:**
   **RULE:** The Notes column is NOT just a description. It MUST explicitly state which Clay Filters this position applies to.
   **Format:** "TIER [1/2] decision maker for [what]. Target in: [Filter 1 (primary)], [Filter 2 (secondary)], [Filter 3]..."
   **Example:**
   ```
   "TIER 1 decision maker for strategic operations and process optimization. Primary for Manufacturing (production systems) and Logistics (supply chain). Secondary for B2B Services. Target in: Manufacturing (primary), Logistics (primary), B2B Services (secondary)."
   ```
   **Why this matters:** Anyone using the Positions CSV must immediately understand:
   - When I target this Clay Filter, which position categories apply?
   - Is this position PRIMARY or SECONDARY for that filter?
   - Which other filters also use this position?

   **This prevents confusion:** Without this mapping, users cannot know whether to use all 5 positions for every filter, or only specific positions for each filter.

6. **Tier/Sequence classification:**
   - PRIMARY / SEQUENCE 1: Core decision makers (50-150 titles each category)
   - SECONDARY / SEQUENCE 2: Influencers (30-80 titles each category)
   - TERTIARY / TIER 3: Fallback/small companies only (20-40 titles)

**Save to:**
`~/Downloads/Leads_[ClientName]_Positions.csv`

---

### STEP 7: Create Email Sequences

**CRITICAL - ALWAYS CREATE SEQUENCES. NO EXCEPTIONS.**

**Hormozi Logic - Keep It Simple:**
1. **Analyze the ICP** - How many distinct industries/segments?
2. **Check pain points** - Do different segments have different pains?
3. **Decision rule:**
   - Same pain across all → **1 sequence for everyone**
   - Different pains by industry → **1 sequence per industry**
   - Different pains by position → **1 sequence per position tier**
4. **Default to simplest approach** - Don't overcomplicate

**Sequence Structure:**
- Each sequence = **3 emails**: Initial + Follow-Up 1 + Follow-Up 2
- Subject lines must be relevant to segment
- Body must address specific pain point
- CTA must be clear and single

**Targeting Specification (MANDATORY):**

For each sequence, specify:
1. **Clay Filter:** Which filter(s) from Clay Filter Prompts CSV
   - If all filters → write "All companies"
   - If specific → write filter name(s)
2. **Positions:** Which positions from Positions CSV
   - If all positions → write "All positions"
   - If specific → write position categories

**Example targeting:**
```
Sequence 1: E-commerce & Retail
- Clay Filter: "Slovenia - E-commerce & Retail"
- Positions: All positions (Owner/CEO, COO, Head of Support, Head of CX)
```

**File structure:**
```json
[
  {
    "id": "sequence-1",
    "tierName": "E-commerce & Retail",
    "tierColor": "blue",
    "targetPersonas": "All positions in e-commerce/retail companies",
    "messagingAngle": "Reduce time spent on delivery, returns, and product enquiries",
    "clayFilter": "Slovenia - E-commerce & Retail",
    "targetPositions": "All positions",
    "emails": [
      {
        "emailNumber": 1,
        "type": "Initial Outreach",
        "subject": "Subject line here",
        "body": "Email body here"
      },
      {
        "emailNumber": 2,
        "type": "Follow-Up 1",
        "subject": "Subject line here",
        "body": "Email body here"
      },
      {
        "emailNumber": 3,
        "type": "Follow-Up 2",
        "subject": "Subject line here",
        "body": "Email body here"
      }
    ]
  }
]
```

**Save to:**
`/public/sequences/[clientname].json`

**HARD RULES:**
- ❌ **NEVER skip sequences** - Always create them
- ❌ **NEVER overcomplicate** - Follow Hormozi logic (simple = fast launch)
- ✅ **ALWAYS specify targeting** - Clay Filter + Positions
- ✅ **ALWAYS use standard ASCII** - No em dashes, smart quotes, or Unicode
- ✅ **ALWAYS commit sequences to GitHub** - Must exist before dashboard works

---

### STEP 8: Build and Deploy

**Build:**
```bash
cd "/Users/angelapetkovska/Desktop/Claude Clients/intelsol-client-portal"
npm run build
```

**If build passes:**
```bash
git add -A
git commit -m "Add: New client [ClientName] dashboard + onboarding

- Complete dashboard with all 8 standard tabs
- ICP Profile with targeting strategy
- Clay Filters and AI Prompts tabs
- Email sequences (X sequences) with targeting specs
- Assigned to [Assignee]
- Status: [Status]
- Generated Clay Filter Prompts CSV (X filters)
- Generated Positions CSV (X categories)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
git push
```

**Wait 2-3 minutes for Cloudflare Pages deployment**

---

### STEP 9: Push Credentials to LastPass

**CRITICAL - ALWAYS DO THIS. NO EXCEPTIONS.**

**LastPass Account Email:** `frosinap0023@gmail.com`

**If login required (session expired):**
```bash
lpass login frosinap0023@gmail.com
```

Push the dashboard login to LastPass using the CLI (2 commands):

**Command 1: Add the entry**
```bash
printf "URL: https://intelsol.pages.dev/\nUsername: [clientname]\nPassword: [password]\n" | lpass add "Intelsol Dashboard Passwords/[ClientName]" --non-interactive
```

**Command 2: Add notes field**
```bash
lpass edit "Intelsol Dashboard Passwords/[ClientName]" --notes --non-interactive <<< "https://intelsol.pages.dev/[clientname]"
```

**Exact Format Requirements:**
- **Folder:** Intelsol Dashboard Passwords (exact spelling)
- **Name:** [ClientName] (display name, e.g., "PACIA", "AdSigner")
- **URL:** https://intelsol.pages.dev/ (ALWAYS the same base URL)
- **Username:** [clientname] (lowercase, e.g., "pacia", "adsigner")
- **Password:** [exact password from auth.ts]
- **Notes:** https://intelsol.pages.dev/[clientname] (full client-specific URL)

**Example for PACIA:**
```bash
printf "URL: https://intelsol.pages.dev/\nUsername: pacia\nPassword: PACIA.Leads.34\n" | lpass add "Intelsol Dashboard Passwords/PACIA" --non-interactive
lpass edit "Intelsol Dashboard Passwords/PACIA" --notes --non-interactive <<< "https://intelsol.pages.dev/pacia"
```

**Verify it was added:**
```bash
lpass show "Intelsol Dashboard Passwords/[ClientName]"
```

**Note:** Sharing credentials with matejgostisa@intelsol.co must be done manually through LastPass web interface after creation (CLI sharing not supported with current setup).

---

### STEP 10: Validation

**Verify:**
- [ ] Dashboard accessible: `https://intelsol.pages.dev/[clientname]`
- [ ] Client appears in sidebar navigation
- [ ] Login works with generated password
- [ ] All 8 tabs render correctly
- [ ] ICP Profile tab shows targeting strategy
- [ ] Email sequences visible in Campaigns & Sequences tab
- [ ] Each sequence has Clay Filter and Position targeting specified
- [ ] Clay Filters CSV has correct filter count
- [ ] Positions CSV has comprehensive titles
- [ ] All CSVs ready for Google Sheets import
- [ ] **Credentials pushed to LastPass** (verify with `lpass show "Intelsol Dashboard Passwords/[ClientName]"`)

---

## Output to User

**Provide complete summary in this EXACT format:**

```
✅ CLIENT ONBOARDING COMPLETE: [ClientName]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 DASHBOARD LOGIN

Dashboard name: [ClientName]
- Username: [clientname] (lowercase)
- Password: [exact password from auth.ts]

URL: https://intelsol.pages.dev/[clientname]
Status: [status]
Assigned to: [Assignee]

📊 GOOGLE SHEETS CSVs

CLAY Filters: Leads_[ClientName]_CLAY_Filter_Prompts.csv
- Location: ~/Downloads/
- Filters: X (Tier 1: X, Tier 2: X, Tier 3: X)

Positions: Leads_[ClientName]_Positions.csv
- Location: ~/Downloads/
- Categories: X with Y total title variations

📧 EMAIL SEQUENCES CREATED
   ✓ X sequences ready for SmartLead import
   ✓ Each sequence includes targeting specification:
     - Clay Filter: [which filter]
     - Positions: [which positions]

   View in dashboard: Campaigns & Sequences tab

🎯 TARGETING SUMMARY
   Locations: [list]
   Industries: [list with tiers]
   Company Size: [range]
   Key Positions: [top 3 categories]

📋 STRATEGIC ANALYSIS
   [Summary of industry prioritization decisions]
   [Sequence strategy: why X sequences vs consolidation]
   [What was added beyond ICP and why]
   [Any exclusions or cautions]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 NEXT STEPS:
   1. Share LastPass credentials with matejgostisa@intelsol.co (manual step)
   2. Import CSVs to Google Sheets
   3. Review dashboard ICP Profile tab
   4. Review email sequences in Campaigns & Sequences tab
   5. Import sequences to SmartLead
   6. Launch first campaign
   7. Click "Update Database" to sync data

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Deployment live in 2-3 minutes at: https://intelsol.pages.dev/[clientname]
```

---

## Error Handling

**If build fails:**
- Show error
- DO NOT commit
- Fix the issue
- Rebuild before proceeding

**If ICP documentation missing:**
- Ask user to provide file path
- If still not found, ask for manual ICP details

**If assignee not valid:**
- Show error: "Assignee must be Frosina, Matej, or Filip"
- Ask again

---

## Quality Checklist

Before marking complete:

**Dashboard:**
- [ ] All 10 files created
- [ ] Client appears in navigation (Sidebar.tsx)
- [ ] Assignee badge shows correct person
- [ ] ICP Profile tab has complete targeting strategy
- [ ] Build passes without errors
- [ ] Committed and pushed to GitHub

**Clay Filter Prompts CSV:**
- [ ] One location per filter
- [ ] One industry per filter (or logical grouping)
- [ ] Priorities sequential 1, 2, 3... N
- [ ] ICP Match Prompts follow hard rules
- [ ] NO forbidden phrases (HR function visibility, etc.)
- [ ] Total filters = locations × industries

**Positions CSV (CRITICAL):**
- [ ] 50-150 titles per PRIMARY category
- [ ] Both "VP of X" and "VP X" formats
- [ ] Local language titles if needed
- [ ] Position List matches List 1-7 exactly
- [ ] **[MANDATORY] "Filters to Target" column EXPLICITLY lists which filters apply to each position**
- [ ] **[MANDATORY] Notes column maps EACH position to EACH filter it applies to with PRIMARY/SECONDARY designation**
- [ ] For every position, someone reading it can immediately answer: "When I target Filter X, should I use this position?"
- [ ] **[MANDATORY VALIDATION] Read back each row: "This position applies to [Filter A primary, Filter B secondary, Filter C primary]" - is that accurate?**

**Both CSVs:**
- [ ] Proper CSV format
- [ ] Ready for Google Sheets import
- [ ] Naming convention correct
- [ ] Dashboard content matches CSVs
- [ ] **[FINAL CHECK] Positions and Filters work together (anyone can look up a filter and know which positions to use)**

---

## Integration with Other Skills

**This skill replaces:**
- Manual dashboard creation
- Separate `/icp-google-sheets` call
- Multiple manual file updates

**Call this skill when:**
- Onboarding new IntElsol client
- User says `/client-onboarding-intelsol`

**After this skill completes:**
- User imports CSVs to Google Sheets
- User creates email sequences
- User launches first campaign

---

## Example Invocation

```
User: /client-onboarding-intelsol
Claude: I'll help you onboard a new IntElsol client. Let me gather the required information.

**Step 1/2: Client ICP Documentation**

Please provide the path to the client's ICP documentation. I'll search common locations:
- ~/Dopamine-Digital/clients/[name]/*ICP*.docx
- ~/Downloads/*ICP*.docx
- ~/Downloads/INTELSOL_*_ICP.docx

Or you can provide the file path directly.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

User: ~/Downloads/INTELSOL_NewClient_ICP.docx

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Claude: Found the ICP document. Now I need one more piece of information.

**Step 2/2: Assignee**

Who should be assigned to this client?
- Frosina
- Matej
- Filip

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

User: Matej

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Claude: Perfect! Starting client onboarding for NewClient...

📋 **Extracting ICP data from documentation...**
✅ Product/offering identified
✅ Target geographies extracted
✅ Company size criteria found
✅ Industries identified (8 total)
✅ Target positions extracted
✅ Exclusion criteria noted

🎯 **Performing strategic industry analysis...**
✅ Analyzed 8 industries for conversion potential
✅ Ranked by TIER (1 = highest conversion)
✅ Identified gaps and complementary industries
✅ Reconciled dashboard content with CSV filters

📊 **Creating client dashboard...**
✅ Created /app/newclient/page.tsx (all 8 tabs)
✅ Created /public/tasks/newclient.json
✅ Created /public/uploads/newclient/.metadata.json
✅ Created /public/sequences/newclient.json
✅ Updated /public/_redirects
✅ Updated /lib/auth.ts (password, access, assignee)
✅ Updated /app/components/Sidebar.tsx (NAVIGATION)
✅ Updated /app/components/ClientsTab.tsx
✅ Updated /app/components/StatusBadge.tsx
✅ Updated /app/admin/page.tsx

📄 **Generating Clay Filter Prompts CSV...**
✅ Created 24 filters (4 locations × 6 industries)
✅ Prioritized by conversion tier
✅ Generated ICP Match Prompts (all hard rules followed)
✅ Saved to ~/Downloads/Leads_NewClient_CLAY_Filter_Prompts.csv

📄 **Generating Positions CSV...**
✅ PRIMARY: 3 categories with 50-150 titles each
✅ SECONDARY: 2 categories with 30-50 titles each
✅ Included local language variations
✅ Saved to ~/Downloads/Leads_NewClient_Positions.csv

🔨 **Building and deploying...**
✅ Build passed without errors
✅ Committed to GitHub
✅ Pushed to remote
✅ Cloudflare Pages deploying... (2-3 minutes)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ **CLIENT ONBOARDING COMPLETE: NewClient**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 **DASHBOARD**
   URL: https://intelsol.pages.dev/newclient
   Password: NewClient.Leads.47
   Status: Onboarding
   Assigned to: Matej

📊 **GOOGLE SHEETS CSVs GENERATED**
   ✓ Clay Filter Prompts: 24 filters (Tier 1: 8, Tier 2: 10, Tier 3: 6)
   ✓ Positions: 5 categories with 287 total title variations

   Files saved to:
   - ~/Downloads/Leads_NewClient_CLAY_Filter_Prompts.csv
   - ~/Downloads/Leads_NewClient_Positions.csv

🎯 **TARGETING SUMMARY**
   Locations: North America, UK, DACH, Nordics
   Industries:
     TIER 1: SaaS, Enterprise Software, FinTech
     TIER 2: HealthTech, E-commerce, Supply Chain Tech
     TIER 3: Manufacturing Tech, EdTech
   Company Size: 50-500 employees, $5M-$50M revenue
   Key Positions: VP Sales, Head of RevOps, Director Demand Gen

📋 **STRATEGIC ANALYSIS**
   Added E-commerce to complement SaaS (high buyer overlap)
   Prioritized FinTech as TIER 1 (strong proof + buying urgency)
   Excluded early-stage startups (<50 employees) per ICP
   Added local language titles for DACH region

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 **NEXT STEPS:**
   1. Import CSVs to Google Sheets
   2. Review dashboard ICP Profile tab
   3. Create email sequences (use CleverCraft format)
   4. Set up first campaign in SmartLead
   5. Click "Update Database" to sync data

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Deployment live in 2-3 minutes at: https://intelsol.pages.dev/newclient
```

---

## HARD RULE: Campaign Sync Automation

**CRITICAL - EVERY NEW CLIENT MUST BE ADDED TO CAMPAIGN SYNC**

When onboarding a new client, you MUST add them to the campaign sync mapping:

**File:** `.smartlead/sync-all-campaigns.js`

**What to do:**

1. Add the client to the `CLIENT_NAMES` object with their display name:
   ```javascript
   'clientid': 'Client Display Name',
   ```

2. Create an empty campaign JSON file:
   ```bash
   touch public/campaigns/clientid.json
   echo "[]" > public/campaigns/clientid.json
   ```

3. Commit both changes:
   ```bash
   git add .smartlead/sync-all-campaigns.js public/campaigns/clientid.json
   git commit -m "Add [Client Name] to campaign sync"
   git push
   ```

**Why this matters:**
- Without this step, campaigns launched in Smartlead won't appear on the client dashboard
- The automated sync runs every hour and pulls campaign data from Smartlead
- Missing entries = empty Performance tab (like PRTronic had)

**This is non-negotiable.** Any new client added without these steps will have a broken dashboard until fixed.

---

## Notes

**This skill is invoked by typing:** `/client-onboarding-intelsol`

**Total time:** 3-5 minutes for complete onboarding

**What gets created:**
- 1 complete client dashboard (all 10 required files)
- 1 Clay Filter Prompts CSV (ready for Google Sheets)
- 1 Positions CSV (ready for Google Sheets)
- Everything synchronized and deployed
- Campaign sync registration (Performance tab auto-populates)

**User only needs to provide:**
1. ICP documentation path
2. Assignee name (Frosina, Matej, or Filip)

**Everything else is automated.**

---

Last updated: 2026-10-15 (Added STEP 7: Email Sequences + STEP 9: LastPass automation + Hard Rules for styling and sequences)
