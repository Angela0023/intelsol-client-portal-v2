# Critical Rules and Learnings - Client Onboarding Skill

**Last Updated:** October 21, 2026
**Sessions:** ASKIT, DukeGroup
**Status:** FINAL - Ready for next client onboarding

---

## Three Critical Rules That Prevent Disasters

### Rule 1: DEPLOYMENT VERIFICATION IS MANDATORY

**The Problem:** Claude was claiming deployments were complete without pushing code to GitHub, causing users to refresh dashboards 100+ times with no changes appearing.

**The Solution:** Follow this 7-step process EVERY TIME:

1. Edit code and test locally (`npm run build`)
2. Commit locally (`git commit`)
3. **Push to GitHub** (`git push origin main`) - **THIS IS CRITICAL**
4. Verify on GitHub - confirm commits appear on main branch
5. Wait 30-60 seconds for Cloudflare to detect the push
6. Check Cloudflare Pages dashboard at https://dash.cloudflare.com/
   - Go to Pages > intelsol-client-portal-v2
   - Click Deployments tab
   - Verify latest deployment build status
   - Confirm commit SHA matches what you pushed
7. **ONLY THEN** claim the work is done

**Rule:** If you haven't verified on Cloudflare Pages dashboard with your own eyes, you have NOT deployed.

**What this prevents:**
- User refreshing dashboard 100+ times with no changes
- Claiming work is done when it isn't
- User confusion and frustration
- Wasted debugging time

---

### Rule 2: SEQUENCE NAMING AND COLOR DIFFERENTIATION (DUKEGROUP LESSON)

**The Problem:** DukeGroup sequences had no visible names and all showed the same color, making the dashboard look broken.

**Root Cause:** The SequencesTab component wasn't recognizing the color names used in the JSON data, and sequence names were in the wrong field.

**The Solution:** When creating sequences, ALWAYS:

1. **Use `tierName` field for sequence names**
   ```json
   "tierName": "SEQUENCE A: Slovenia Hotel Leadership"  // ✅ RIGHT
   "name": "SI LEAD"  // ❌ WRONG - this won't display
   ```

2. **Always include `tierColor` field**
   ```json
   "tierColor": "emerald"  // ✅ RIGHT
   // Omitting this defaults to blue ❌
   ```

3. **Differentiate colors between sequences**
   ```json
   Sequence A: "tierColor": "emerald"
   Sequence B: "tierColor": "orange"
   Sequence C: "tierColor": "cyan"
   Sequence D: "tierColor": "yellow"
   // NOT all "emerald" ❌
   ```

4. **Ensure colors are supported in SequencesTab component**
   - Supported: blue, green, amber, purple, indigo, emerald, orange, cyan, yellow
   - If you need a different color, update `/app/components/SequencesTab.tsx` tierColors object first

5. **Verify sequences display correctly**
   - Visual check: Sequence names visible? ✓
   - Visual check: Each sequence different color? ✓
   - If not, you need to update the component colors

**What this prevents:**
- Sequences appearing unnamed or all one color
- Dashboard looking broken
- User confusion about multiple sequences

---

### Rule 3: FILTER-TO-POSITION MAPPING (ASKIT LESSON)

**The Problem:** ASKIT Positions CSV was generic and didn't tell anyone which positions applied to which filters. Users couldn't answer: "If I target Filter X, which positions should I reach?"

**The Solution:** Positions CSV must explicitly map each position to which Clay Filters it applies.

**Required Format:**

```csv
Position,Filters to Target,EN Titles,Notes
CEO,"ALL FILTERS","CEO, President, MD, ...","PRIMARY decision maker across all segments. Target in ALL FIVE filters."
CFO,"B2B Services (primary), Market Leaders (secondary)","CFO, Finance Director,...","TIER 2 stakeholder. Critical for B2B Services (margin optimization). Target in: B2B Services (primary), Market Leaders (secondary)."
COO,"Manufacturing (primary), Logistics (primary), Complex Enterprise (primary), B2B Services (secondary)","COO, Operations Director,...","TIER 2 stakeholder. Primary for Manufacturing (production systems), Logistics (supply chain). Target in: Manufacturing (primary), Logistics (primary)..."
```

**Key Points:**

1. **"Filters to Target" column** - Must explicitly list which filters this position applies to
2. **Notes column** - THE BRIDGE between filters and positions
   - Format: `"TIER [1/2] decision maker for [what]. Primary for [Filter A], [Filter B]. Secondary for [Filter C]. Target in: [Filter A (primary)], [Filter B (primary)], [Filter C (secondary)]."`
3. **Anyone reading it must know** - "When I target Filter X, do I use this position? PRIMARY or SECONDARY?"

**Why this matters:**
- Without mapping, users can't efficiently target specific filters
- Positions become "generic" and useless
- Different industries have different key decision makers (Manufacturing ≠ B2B Services)
- This ensures the Positions CSV actually helps strategy

**What this prevents:**
- Creating positions that can't be used
- Users not knowing which positions to target for each filter
- Generic, unhelpful CSVs that waste time

---

## How These Lessons Were Learned

### ASKIT Session (Issues Found)

1. **Issue:** Positions CSV was completely generic (all positions for all filters)
2. **User's Feedback:** "This is not how it should work... This is all written in the skill. If it's not, then just write it because this is not acceptable. I cannot continue correcting you every time you perform this skill."
3. **Resolution:** Completely rewrote ASKIT Positions CSV with explicit filter-to-position mapping
4. **Documentation:** Updated skill with CRITICAL MISTAKES section
5. **Lesson:** The skill was missing critical requirements that MUST be enforced

### DukeGroup Session (Issues Found)

1. **Issue:** Sequences had no visible names and all showed same color
2. **Root Cause:** Wrong field name (name vs tierName) and missing color definitions in component
3. **User's Feedback:** "The last issues that I mentioned are still not done on the dashboard. The sequence names are missing, and the color is still the same for all four sequences."
4. **Resolution:**
   - Fixed `/app/components/SequencesTab.tsx` to support emerald, orange, cyan, yellow colors
   - Updated sequences to use proper `tierName` format with different `tierColor` values
5. **Lesson:** Need to verify dashboard visually displays all changes correctly

### Deployment Process (Critical Issue)

1. **Issue:** Claude claimed deployments were complete without pushing to GitHub
2. **User's Feedback:** "Yeah, now do whatever you have to do. Update whatever you need to update, but this should not ever happen again... Do not lie to me and say that something is done, and then I refresh the dashboard a hundred times like I'm crazy, and nothing is done because you didn't push it."
3. **Resolution:** Created DEPLOYMENT_VERIFICATION_PROCESS.md documenting the complete workflow
4. **Lesson:** MUST verify on Cloudflare Pages dashboard before claiming work is done

---

## Implementation Checklist for Next Client

When you use `/client-onboarding-intelsol` for the next client, verify these BEFORE declaring onboarding complete:

### Deployment Verification
- [ ] Code is pushed to GitHub (`git push origin main` succeeded)
- [ ] Commits appear on GitHub main branch
- [ ] Cloudflare Pages deployment is building or succeeded
- [ ] Build status shows green checkmark, not red X

### Sequences Quality Check
- [ ] Sequences JSON uses `tierName` field (not `name`)
- [ ] Each sequence has explicit `tierColor` field
- [ ] Each sequence has different color from others
- [ ] Dashboard Campaigns & Sequences tab shows sequence names
- [ ] Dashboard sequences show different colors

### Positions CSV Quality Check
- [ ] "Filters to Target" column exists and explicitly lists filters
- [ ] Notes column maps position to each applicable filter
- [ ] Notes column includes PRIMARY/SECONDARY designation
- [ ] Anyone reading a position row can immediately answer: "When I target Filter X, should I use this position?"
- [ ] CSV matches the Selekcija/MoreFromFood/PRTronic format (proven working)

### Dashboard Completeness
- [ ] All 10 files created
- [ ] Client appears in navigation
- [ ] Build passes (no TypeScript errors)
- [ ] Committed and pushed to GitHub
- [ ] Verified on Cloudflare Pages dashboard

---

## Files Updated With These Lessons

1. **SKILL_client-onboarding-intelsol.md** - Skill documentation updated with all 3 critical rules
2. **DEPLOYMENT_VERIFICATION_PROCESS.md** - Complete deployment workflow documentation
3. **LESSONS_LEARNED.md** - Detailed analysis of filter-to-position mapping requirement
4. **CRITICAL_RULES_AND_LEARNINGS.md** - This file

---

## Key Insights

**Lesson 1: Claim Nothing Without Verification**
- Don't claim work is deployed without checking Cloudflare
- Don't claim dashboard works without visual verification
- Don't claim CSVs are correct without reviewing them

**Lesson 2: Different Buyers = Different Positions**
- Not all positions apply to all filters
- Manufacturing decision makers ≠ B2B Services decision makers
- Positions CSV MUST show which filters each position applies to

**Lesson 3: Component Features Must Match Data**
- If you use a color, the component must support it
- If you use a field, the component must render it
- If the dashboard is broken, the component needs updating first

---

## Ready for Next Client

This documentation is COMPLETE. The next client onboarding should proceed without any backward-and-forward corrections if:

1. ✓ These three rules are followed exactly
2. ✓ Dashboard is visually verified on Cloudflare
3. ✓ Positions CSV explicitly maps positions to filters
4. ✓ Sequences have different visible names and colors

**GO FORTH AND ONBOARD PERFECTLY.**
