# Critical Lessons Learned - Client Onboarding Process

## Issue: ASKIT Clay Filters & Positions CSV (October 2026)

### The Problem

When onboarding ASKIT client, the generated Clay Filters and Positions CSVs didn't work together properly:

1. **Clay Filters CSV** ✅ Was correct format (detailed industry descriptions, comprehensive ICP Match Prompts)
2. **Positions CSV** ❌ Was generic and didn't map positions to filters
   - No clarity on which positions apply to which filters
   - No indication of PRIMARY vs SECONDARY for different filters
   - Made it impossible for anyone using the CSVs to know correct position targeting strategy

### What Was Wrong

**Wrong Positions CSV:**
```
Position,EN Titles,SL Titles,Notes
CEO,"CEO, President, MD,...","Izvršni direktor, Direktor,...","Strategic decision maker"
CFO,"CFO, Finance Director,...","Direktor financ,...","Finance leader"
COO,"COO, Operations Director,...","Direktor operacij,...","Operations leader"
```

**Problem:** Anyone using this would ask: "For the Manufacturing filter, should I use all these positions? Or just COO? Is CFO relevant?" **There's no answer.**

### The Correct Approach

**Right Positions CSV:**
```
SEQUENCE,Title,Filters to Target,Position List EN,Position List SL,Notes
Tier 1,CEO,"ALL FILTERS","CEO, President, MD,...","Izvršni direktor, Direktor,...","PRIMARY decision maker across all filters. Target in ALL FIVE filters - CEO is present in every organization."
Tier 2,COO,"Manufacturing (primary), Logistics (primary), Complex Enterprise (primary), B2B Services (secondary)","COO, Operations Director,...","Direktor operacij,...","TIER 2 stakeholder... Primary for Manufacturing (production systems), Logistics (supply chain)... Target in: Manufacturing (primary), Logistics (primary), Complex Enterprise (primary), B2B Services (secondary)."
Tier 2,CFO,"B2B Services (primary), Market Leaders (secondary), Complex Enterprise (secondary)","CFO, Finance Director,...","Direktor financ,...","TIER 2 stakeholder focused on business value... Critical for B2B Services (margin optimization)... Target in: B2B Services (primary), Market Leaders (secondary), Complex Enterprise (secondary)."
```

**Solution:** The "Filters to Target" column + Notes make it crystal clear:
- When targeting Manufacturing → use CEO + COO + CIO
- When targeting B2B Services → use CEO + CFO + COO
- When targeting Market Leaders → use CEO + HR/L&D + CFO

### Root Cause

**The skill documentation didn't enforce the critical rule:**

> The Notes column is not just a description. It's **THE BRIDGE** between Clay Filters and Positions. It MUST explicitly state which filters each position applies to and mark them as PRIMARY or SECONDARY.

### The Fix Applied

1. **Updated `/client-onboarding-intelsol` skill** with:
   - New "CRITICAL MISTAKES TO AVOID" section at the top
   - Explicit examples of WRONG vs RIGHT Positions CSV format
   - Added to Quality Checklist: **[MANDATORY] Positions CSV must explicitly map to filters**

2. **Created ASKIT Corrections:**
   - Clay Filters CSV: 5 filters with detailed industry descriptions (matches PRTronic format)
   - Positions CSV: 5 positions with explicit filter-to-position mapping
   - Created reference guides on Desktop showing the filter-position relationships

3. **Added Reference Template:**
   - Pushed `PRTronic_CLAY_Filters_Example.csv` to repo as template

### Key Rules for Future Onboarding

**RULE 1: No Generic Positions CSV**
❌ NEVER: Create a Positions CSV where every position applies equally to every filter
✅ ALWAYS: Map each position to the specific filters it applies to

**RULE 2: The "Filters to Target" Column is Not Optional**
❌ NEVER: Put filter mapping only in Notes (or skip it entirely)
✅ ALWAYS: Use a dedicated "Filters to Target" column listing which filters apply

**RULE 3: Mark PRIMARY vs SECONDARY**
❌ NEVER: Just list filters without indicating importance
✅ ALWAYS: Specify "Manufacturing (primary), Logistics (primary), B2B Services (secondary)"

**RULE 4: The Notes Column is THE BRIDGE**
❌ NEVER: Use Notes as just a description ("Operations leader")
✅ ALWAYS: Use Notes to map: "Target in: Manufacturing (primary), Logistics (primary), Complex Enterprise (primary), B2B Services (secondary)."

**RULE 5: Validate by Reading Backwards**
Before finishing, pick each filter and ask: "What positions should I use for this filter?"
- Manufacturing → Should answer: CEO + COO + CIO
- Market Leaders → Should answer: CEO + HR/L&D + CFO
If the Positions CSV doesn't immediately show this, it's not done.

### Why This Matters

**Business Impact:**
- **Without proper mapping:** User gets 2 CSVs but can't use them together effectively
- **With proper mapping:** User looks at Manufacturing filter, reads Positions CSV, knows exactly which roles to target

**Quality Impact:**
- Bad CSVs = user frustration and wasted effort
- Good CSVs = seamless integration and clear targeting strategy

### Files Updated

1. `/Users/angelapetkovska/.claude/skills/client-onboarding-intelsol.md`
   - Added "CRITICAL MISTAKES TO AVOID" section
   - Enhanced Quality Checklist with mandatory Positions CSV validation
   - Updated STEP 5 with filter-positions relationship concept

2. Repository template added:
   - `/public/examples/PRTronic_CLAY_Filters_Example.csv` - reference format

### Going Forward

Every time the `/client-onboarding-intelsol` skill is invoked:
1. Read the "CRITICAL MISTAKES" section
2. When creating Positions CSV, refer to ASKIT as example
3. Before finalizing, verify the "Filters to Target" column explicitly maps every position
4. Run the MANDATORY VALIDATION: Read back each position and confirm the filter mapping is accurate

---

**Lesson Summary:** Clay Filters and Positions CSVs are not independent documents. They must work together as a unified system. The Positions CSV's Notes column is the critical bridge that makes this relationship explicit and usable.
