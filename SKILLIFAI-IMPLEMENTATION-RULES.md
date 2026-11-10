# Skillifai Client Dashboard Implementation — HARD RULES

**Last Updated:** November 10, 2026
**Status:** Production
**Created to prevent repeated implementation errors**

---

## CRITICAL: NEVER Repeat These Mistakes

### 1. Dashboard Content Must Match ICP Exactly
- **RULE**: Every piece of content on the dashboard must come directly from `/clients/skillifai/ICP-PROFILE.md`
- **FORBIDDEN**: Hallucinating, inferring, or adding information not in the ICP
- **VALIDATION**: Before committing, manually verify each section:
  - Overview tab (What They Sell, Target Market, Best-Fit Customers)
  - ICP Profile tab (Geography, Company Size, Target Industries, Business Model, Decision Makers)
  - Filters tab (Technology & Buying Signals)
  - Prompts tab (ICP Matching Prompt)
- **Test**: Load the dashboard and compare each section word-for-word with ICP-PROFILE.md

### 2. Dashboard Tabs Must Be Standard (No Custom Tabs)
- **RULE**: Skillifai dashboard tabs MUST match the standard client tab structure
- **STANDARD TABS** (only these, in this order):
  ```
  1. Overview
  2. ICP Profile
  3. Clay Filters (internal, admin-only)
  4. AI Prompts (internal, admin-only)
  5. Campaigns & Sequences
  6. Performance
  7. Documents
  8. Tasks
  ```
- **FORBIDDEN TABS**:
  - "Buying Triggers" (custom, non-standard)
  - "Outreach & Messaging" (custom, non-standard)
  - Any other tabs not in the standard list above
- **VALIDATION**: Before committing, verify the `tabs` constant in `/app/skillifai/page.tsx` matches the standard list exactly
- **TEST**: Load the dashboard and count the tabs—there should be exactly 8

### 3. Sequences Must Go in `/public/sequences/`, Not `/clients/`
- **RULE**: Sequences file location is CRITICAL for dashboard functionality
- **CORRECT PATH**: `/public/sequences/skillifai.json`
- **WRONG PATH** (causes 404): `/clients/skillifai/sequences/skillifai.json`
- **WHY**: Dashboard loads sequences from `/public/` directory; other paths result in 404 errors
- **VALIDATION**: After creating/moving sequences file, manually navigate to the "Campaigns & Sequences" tab on the dashboard—sequences must load without error

### 4. Sequences Must Be Client-Specific (Not Generic)
- **RULE**: Sequences must reflect Skillifai's actual business model and offering
- **SKILLIFAI'S BUSINESS MODEL**:
  - Entry point: **Departmental AI training programs** (core offering)
  - Mid-level: **Broader AI adoption & implementation solutions** (expansion)
  - High-value: **Custom projects (EUR 10,000+)** (follow-on revenue)
- **SEQUENCE STRUCTURE** (must have 6 sequences total):
  - 3 Simplified qualification sequences (lead qualification stage)
  - 3 Persona-specific sequences (after qualification):
    - CEO/Director angle: Strategic adoption, team productivity, competitive advantage
    - HR/L&D angle: Team skills, adoption readiness, training programs
    - Operations angle: Process efficiency, freeing teams for strategic work
- **MESSAGING REQUIREMENTS**:
  - All sequences must mention or reference "training programs" as entry point
  - Address ICP pain points: pilots that stall, unused AI licenses, inconsistent adoption
  - Emphasize Slovenian SME context
  - Include specific outcomes (e.g., "40-60% reduction in manual tasks in 3-6 months")
  - Each persona sequence must have distinct angles and pain points
- **VALIDATION CHECKLIST**:
  - [ ] Sequences file is valid JSON (run `cat skillifai.json | python3 -m json.tool` with no errors)
  - [ ] 6 sequences present (3 simplified + 3 persona-specific)
  - [ ] Each sequence has correct structure: id, tierName, tierColor, targetPersonas, messagingAngle, emails array
  - [ ] All email bodies include `{{company_name}}` and `{{first_name}}` placeholders
  - [ ] Training programs mentioned as entry point in messaging
  - [ ] No generic AI adoption copy (must be Skillifai-specific)
  - [ ] Dashboard "Campaigns & Sequences" tab loads without 404

### 5. Never Confirm Work Is Done Without Testing
- **RULE**: Before saying "done," verify the change is actually visible/working
- **REQUIRED TESTS**:
  - Dashboard loads without errors
  - All tabs render correctly
  - All content displays as expected
  - No unused code/functions remain
  - No unused imports remain
  - All files are committed and pushed to GitHub
  - For sequences: Load "Campaigns & Sequences" tab and verify all 6 sequences appear
- **FORBIDDEN**: Saying "done" or "complete" without running these tests
- **CONSEQUENCE**: User has to point out the mistake, wasting time

### 6. Clean Up All Unused Code Before Committing
- **RULE**: Remove all unused functions, imports, and components
- **EXAMPLES OF UNUSED CODE**:
  - `MessagingTab()` function if not rendered in tab content
  - Unused icon imports (e.g., `Mail` icon imported but not used)
  - Unused component imports
  - Unused variables or state
- **VALIDATION**: Before committing, search for:
  - Functions defined but never called in the component
  - Imports that are not used anywhere
  - Unused state variables
- **PROCESS**: If you're unsure, grep for the function/import name to confirm it's used before removing

### 7. Commit Structure (One Change Per Commit)
- **RULE**: Dashboard changes and sequences changes should be separate commits
- **COMMIT 1**: Dashboard tab structure fix
- **COMMIT 2**: Sequences rewrite
- **COMMIT 3**: Code cleanup
- **WHY**: Makes it easier to track which commit fixed what, and easier to rollback if needed
- **FORMAT**: Each commit message must specify what changed and why
  ```
  Skillifai dashboard: remove non-standard tabs, fix tab structure

  - Removed "Buying Triggers" and "Outreach & Messaging" tabs
  - Restored standard tab structure matching other clients
  - Verified all content matches ICP-PROFILE.md

  Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
  ```

### 8. Document All Changes in GitHub
- **RULE**: After implementation, create a summary comment or PR description
- **CONTENTS**:
  - What was implemented
  - What was fixed
  - What was tested
  - Link to ICP-PROFILE.md for reference
  - Any open questions or pending approvals from client

---

## Quick Checklist Before Saying "Done"

```
☐ Dashboard tabs match standard structure (exactly 8 tabs)
☐ Dashboard content matches ICP-PROFILE.md word-for-word
☐ No custom/non-standard tabs present
☐ Sequences file is in /public/sequences/skillifai.json
☐ 6 sequences present (3 simplified + 3 persona-specific)
☐ Sequences reflect Skillifai's actual business model
☐ All sequences are valid JSON
☐ Dashboard "Campaigns & Sequences" tab loads without 404
☐ All sequences display in the dashboard UI
☐ No unused code/functions remain
☐ No unused imports remain
☐ All changes committed and pushed to GitHub
☐ Hard refresh tested in browser
```

---

## Reference: Skillifai Business Model

**Entry Point**: Departmental AI training programs
**Progression**: Training → Broader AI adoption & implementation → Custom EUR 10,000+ projects
**Target**: Slovenian SMEs (20–250 employees, optimal 50+)
**Industries**: Manufacturing, Logistics, Professional Services (Tier 1)
**Pain Points**: Pilots that stall, unused AI licenses, inconsistent adoption, time lost on repetitive tasks
**Decision Makers**: CEO/Director (75%), HR/L&D (25%)

---

## Reference: Standard Dashboard Tabs

```typescript
const tabs = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'icp', label: 'ICP Profile', icon: Target },
  { id: 'filters', label: 'Clay Filters', icon: Filter }, // admin-only
  { id: 'prompts', label: 'AI Prompts', icon: Code }, // admin-only
  { id: 'campaigns-sequences', label: 'Campaigns & Sequences', icon: Zap },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'documents', label: 'Documents', icon: FolderOpen },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
];
```

---

## File Locations (Reference)

```
/tmp/intelsol-client-portal-v2/
├── /app/skillifai/page.tsx                    # Dashboard component
├── /public/sequences/skillifai.json           # Sequences (CORRECT LOCATION)
├── /clients/skillifai/ICP-PROFILE.md          # ICP documentation (source of truth)
├── /clients/skillifai/skillifai-positions.csv # Positions CSV
└── /clients/skillifai/skillifai-clay-filters.csv # Clay filters CSV
```

---

## Related Files & Rules

- **ICP-PROFILE.md**: Source of truth for all dashboard content
- **lib/auth.ts**: Client credentials and assignments
- **StatusBadge.tsx**: Client status management
- **POSITIONS-LIST-HARD-RULE.md**: Position CSV format (GitHub)

---

**End of Hard Rules. Follow these exactly on next implementation.**
