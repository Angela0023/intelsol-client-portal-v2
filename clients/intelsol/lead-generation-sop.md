# Intel Solve — Lead Generation SOP

> **Access Level:** Admin Only
> **Last Updated:** 2026-07-21
> **Client:** Intel Solve
> **Process Owner:** Angela Petkovska

---

## Process Overview

This SOP covers the complete lead generation workflow for Intel Solve, from initial lead sourcing through email enrichment, verification, personalization, and campaign setup.

**Total Steps:** 30
**Tools Used:** Sales Navigator, Expandi, Million Verifier, Bounce Ban, Prospeo, Apollo, Clay, SmartLead

**Workflow Summary:**
1. Source leads from Sales Navigator
2. Enrich emails via waterfall (Expandi → Prospeo → Apollo)
3. Verify all emails (Million Verifier + Bounce Ban)
4. Split verified leads 50-50 for personalization testing
5. Run personalization via Clay (Template V1 and V2)
6. Launch campaigns (2 personalized + 1 unpersonalized)

---

## Phase 1: Lead Sourcing & Initial Enrichment

### Step 1: Search for Leads on Sales Navigator

**Tool:** LinkedIn Sales Navigator

**Filters to Use:**
- Refer to: http://intelsol.corsyx.com/intelsol
- Navigate to "Clay Filters" section for complete filter list

**Output:** Raw lead list from Sales Navigator

---

### Step 2: Enrich with Email Addresses (Expandi)

**Tool:** Expandi

**Action:** Upload lead list to Expandi and run email enrichment

**Output:** Lead list with Expandi-enriched email addresses

---

### Step 3: Verify Emails (Million Verifier)

**Tool:** Million Verifier

**Action:** Run all Expandi-enriched emails through Million Verifier

**Output:** Emails categorized as:
- Valid (green)
- Risky (yellow)
- Bad (red)

---

### Step 4: Remove Bad Emails

**Action:** Delete all emails flagged as "bad" by Million Verifier

**Update:** Google Sheet - mark removed emails

---

### Step 5: Check Risky Emails (Bounce Ban)

**Tool:** Bounce Ban

**Action:** Run all "risky" emails from Million Verifier through Bounce Ban for secondary verification

**Output:** Emails categorized as valid or bad

---

### Step 6: Remove Bad Emails from Bounce Ban

**Action:** Delete all emails flagged as "bad" by Bounce Ban

**Update:** Google Sheet - mark removed emails

---

### Step 7: Mark Verified Expandi Emails

**Action:** Mark all remaining Expandi emails as "verified" in Google Sheet

**Label:** "Expandi Verified"

---

### Step 8: Split Lead List

**Action:** Create two separate lists:

| List Name | Contains |
|-----------|----------|
| **Expandi Leads** | All leads WITH verified email addresses |
| **No Emails** | All leads WITHOUT email addresses |

**Note:** The "No Emails" list will be enriched in Phase 2

---

## Phase 2: Secondary Email Enrichment (Prospeo)

### Step 9: Run No-Email Leads on Prospeo

**Tool:** Prospeo

**Action:** Upload "No Emails" list to Prospeo for email enrichment

**Output:** Lead list with Prospeo-enriched email addresses

---

### Step 10: Verify Prospeo Emails (Million Verifier)

**Tool:** Million Verifier

**Action:** Run all Prospeo-enriched emails through Million Verifier

**Output:** Emails categorized as valid, risky, or bad

---

### Step 11: Remove Bad Emails

**Action:** Delete all emails flagged as "bad" by Million Verifier

**Update:** Google Sheet - mark removed emails

---

### Step 12: Check Risky Emails (Bounce Ban)

**Tool:** Bounce Ban

**Action:** Run all "risky" emails from Million Verifier through Bounce Ban

**Output:** Emails categorized as valid or bad

---

### Step 13: Remove Bad Emails from Bounce Ban

**Action:** Delete all emails flagged as "bad" by Bounce Ban

**Update:** Google Sheet - mark removed emails

---

### Step 14: Mark Verified Prospeo Emails

**Action:** Mark all remaining Prospeo emails as "verified" in Google Sheet

**Label:** "Prospeo Verified"

---

### Step 15: Merge Prospeo Leads into Main List

**Action:** Add all verified Prospeo leads to the "Expandi Leads" list

**Result:** Single master list of all verified leads so far

---

## Phase 3: Tertiary Email Enrichment (Apollo)

### Step 16: Run Remaining No-Email Leads on Apollo

**Tool:** Apollo

**Action:** Use Apollo's enrichment feature to find email addresses for remaining leads without emails

**Output:** Lead list with Apollo-enriched email addresses

---

### Step 17: Verify Apollo Emails (Million Verifier)

**Tool:** Million Verifier

**Action:** Run all Apollo-enriched emails through Million Verifier

**Output:** Emails categorized as valid, risky, or bad

---

### Step 18: Remove Bad Emails

**Action:** Delete all emails flagged as "bad" by Million Verifier

**Update:** Google Sheet - mark removed emails

---

### Step 19: Check Risky Emails (Bounce Ban)

**Tool:** Bounce Ban

**Action:** Run all "risky" emails from Million Verifier through Bounce Ban

**Output:** Emails categorized as valid or bad

---

### Step 20: Remove Bad Emails from Bounce Ban

**Action:** Delete all emails flagged as "bad" by Bounce Ban

**Update:** Google Sheet - mark removed emails

---

### Step 21: Mark Verified Apollo Emails

**Action:** Mark all remaining Apollo emails as "verified" in Google Sheet

**Label:** "Apollo Verified"

---

### Step 22: Merge Apollo Leads into Main List

**Action:** Add all verified Apollo leads to the "Expandi Leads" list

**Result:** Complete master list of all verified leads

---

### Step 23: Archive Remaining No-Email Leads

**Action:** Keep all remaining leads without email addresses in the "No Emails" Google Sheet for future processing

**Note:** These leads can be revisited with new enrichment tools or methods

---

## Phase 4: Personalization Setup (Clay)

### Step 24: Split Verified Lead List 50-50

**Action:** Divide the "Expandi Leads" list into two equal halves

**Purpose:** A/B test two personalization templates (V1 vs V2)

**Output:**
- List A (50% of leads)
- List B (50% of leads)

---

### Step 25: Copy Clay Personalization Templates

**Tool:** Clay

**Action:** Make a copy of:
- Personalization Template V1
- Personalization Template V2

**Result:** Two separate Clay workspaces for testing

---

### Step 26: Import Leads to Clay Templates

**Action:**
- Import List A (50% of leads) → Personalization Template V1
- Import List B (50% of leads) → Personalization Template V2

**Result:** Two Clay tables, each with half of verified leads

---

### Step 27: Run Apify Website Scrape

**Tool:** Clay (Apify integration)

**Action:** In both V1 and V2 templates, run the column called "Run Apify Website Scrape"

**Purpose:** Extract website content for personalization

**Wait for:** Column to complete before proceeding

---

### Step 28: Run Personalization Sentence Column

**Tool:** Clay (AI personalization)

**Action:** Once "Run Apify Website Scrape" completes, run the "Personalization Sentence" column in both V1 and V2

**Output:** Each lead gets a personalization sentence OR "NO_SIGNAL" if no personalization data available

**Repeat:** Complete this step in BOTH V1 and V2 templates

---

## Phase 5: Campaign Segmentation & Launch

### Step 29: Extract Personalized Leads

**Action:** In both V1 and V2 templates, filter leads where:
- `Personalisation_Sentece` column **is NOT empty**
- `Personalisation_Sentece` column **does NOT contain** "NO_SIGNAL"

**Result:** These are your **personalized leads**

**Export:**
1. Download personalized leads from V1 as CSV
2. Download personalized leads from V2 as CSV

**Campaign Setup:**
- Create **Campaign 1:** Personalized V1 leads (in SmartLead)
- Create **Campaign 2:** Personalized V2 leads (in SmartLead)

**Note:** Keep V1 and V2 personalized campaigns separate for A/B testing

---

### Step 30: Extract Non-Personalized Leads & Launch

**Action:** In both V1 and V2 templates, filter leads where:
- `Personalisation_Sentece` column **IS empty**
- OR `Personalisation_Sentece` column **CONTAINS** "NO_SIGNAL"

**Result:** These are your **non-personalized leads**

**Combine:**
1. Merge non-personalized leads from V1 and V2 into ONE list

**Campaign Setup:**
- Create **Campaign 3:** Non-personalized leads (combined V1 + V2) (in SmartLead)

---

## Final Deliverables

At the end of this process, you will have:

| Campaign | Lead Source | Personalization | Status |
|----------|-------------|-----------------|--------|
| Campaign 1 | Template V1 | Yes (personalized) | Ready to launch |
| Campaign 2 | Template V2 | Yes (personalized) | Ready to launch |
| Campaign 3 | V1 + V2 combined | No (generic) | Ready to launch |

**Total Campaigns:** 3
**Total Verified Leads:** All leads from "Expandi Leads" list
**Archived Leads:** "No Emails" list (for future enrichment attempts)

---

## Quality Control Checkpoints

Before launching campaigns, verify:

1. ✅ All emails have been verified through Million Verifier AND Bounce Ban
2. ✅ "Bad" emails have been removed at each verification stage
3. ✅ Personalized leads are split correctly between V1 and V2
4. ✅ Non-personalized leads from V1 and V2 are combined into one campaign
5. ✅ All Google Sheets are updated with verification labels
6. ✅ "No Emails" list is archived for future use
7. ✅ Campaign variables are correctly mapped in SmartLead

---

## Tool Reference

| Tool | Purpose | Used In Steps |
|------|---------|---------------|
| Sales Navigator | Lead sourcing | 1 |
| Expandi | Email enrichment (primary) | 2 |
| Million Verifier | Email verification | 3, 10, 17 |
| Bounce Ban | Secondary verification (risky emails) | 5, 12, 19 |
| Prospeo | Email enrichment (secondary) | 9 |
| Apollo | Email enrichment (tertiary) | 16 |
| Clay | Personalization (Apify + AI) | 25-28 |
| SmartLead | Campaign management & sending | 29-30 |

---

## Support Resources

- **ICP Documentation:** http://intelsol.corsyx.com/intelsol
- **Clay Filters:** http://intelsol.corsyx.com/intelsol (Clay Filters section)
- **GitHub Repo:** `Angela0023/client-matej-lead-gen`
- **Client Folder:** `Clients/intelsol/`

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-07-21 | Initial SOP creation | Angela Petkovska |

---

**End of SOP**
