# Xpose Solutions - Clay Search Criteria

**Purpose:** Build initial ICP lead list (~1,000 leads for Tier 3 campaign)
**Date:** 2026-05-13

---

## Company Search Filters (Clay)

### Industry / Keywords
**Primary Keywords:**
- Cosmetic dermatology
- Aesthetic clinic
- Med spa
- Aesthetic dermatology
- Cosmetic clinic
- Injectables clinic
- Laser clinic
- Skin rejuvenation
- Botox clinic
- Filler clinic
- Aesthetic medicine
- Plastic surgery clinic (if offering non-surgical aesthetics)

**Search String Example:**
```
cosmetic dermatology OR aesthetic clinic OR med spa OR aesthetic dermatology OR skin rejuvenation OR injectables clinic OR laser clinic
```

---

### Company Size
**Employees:**
- **Minimum:** 5 employees
- **Maximum:** 15 employees
- **Sweet Spot:** 5-15 staff (indicates 2-5 providers)

**Why:** Matches "2-5 providers = 5-15 staff" from ICP

---

### Geography
**Primary Target (Focus Now):**
- ☑ United States (ALL STATES)

**Optional (Later):**
- Canada
- United Kingdom
- Australia

**Start with US ONLY** - this gives the largest addressable market

---

### B2B Filter
**Setting:** B2C (these are consumer-facing clinics, not B2B)

---

### Technology Signals (High-Priority Filters)
**IF Clay supports technology detection, filter for:**
- Google Ads
- Facebook Ads / Meta Ads
- Instagram Business
- Online booking systems (Zocdoc, Acuity, etc.)

**These are buying signals = high-priority leads**

---

### Social Media Presence
**Instagram:**
- Active account (posts in last 30 days)
- 500+ followers preferred

**Why:** Strong Instagram = cosmetic/aesthetic focus, patient engagement

---

### Website Required
**Must Have:**
- Active website with contact form
- Working domain

**Why:** We need to analyze website for "gap research"

---

### Exclusions (Do NOT Include)

❌ **Solo Practitioners:**
- Filter OUT companies with 1-4 employees

❌ **Pure Medical Dermatology:**
- Exclude keywords: "medical dermatology" ONLY, "skin cancer clinic" ONLY
- Focus on cosmetic/aesthetic

❌ **Inactive Businesses:**
- Exclude if no social media activity in 12+ months

---

## Clay Table Structure

### Required Columns (Minimum)

| Column Name | Source | Purpose |
|-------------|--------|---------|
| **Company Name** | Clay search | Company identity |
| **Website URL** | Clay search | For ICP analysis + gap research |
| **Location (City, State)** | Clay search | Geographic targeting |
| **Employee Count** | Clay search | Size qualification |
| **Industry** | Clay search | Vertical confirmation |
| **Phone Number** | Clay search | For after-hours check (Signal C) |
| **Instagram URL** | Clay/Manual | Social presence check |
| **Review Count** | Clay/Manual | Buying signal |
| **Has Online Booking?** | Manual enrichment | Buying signal |
| **Has Live Chat?** | Manual enrichment | Gap research (Signal A) |
| **Running Ads?** | Manual enrichment | Buying signal (Signal A) |
| **ICP Match (AI)** | Anthropic AI (later) | Yes/No qualifier |

---

## Step-by-Step: Building the List

### Step 1: Create Search in Clay
1. Open Clay workspace
2. Click "Find Companies"
3. Apply filters:
   - Keywords: (see above)
   - Employees: 5-15
   - Location: United States
   - Has website: Yes
4. Run search
5. Target: ~2,000-3,000 companies (will filter down)

### Step 2: Initial Filter (Manual Quick Check)
1. Remove obvious non-fits:
   - Solo practitioners
   - Pure medical dermatology
   - Hospitals/large chains
2. Keep only private practices

### Step 3: Enrich Basic Data
1. Use Clay to pull:
   - Website
   - Phone
   - Employee count
   - Location
2. Goal: Clean dataset ready for AI analysis

### Step 4: AI ICP Analysis (Tomorrow with Matej)
1. Create Anthropic AI prompt (see separate file)
2. Analyze website to determine ICP match
3. Filter to only "Yes" matches
4. Target: ~1,500 qualified companies

### Step 5: Find People (Next)
1. For each qualified company, find decision-makers
2. Target roles:
   - Practice Owner
   - Medical Director
   - Founder
   - Practice Manager (if owner not available)
3. Use Clay's "Find People" feature
4. Filter by job titles

### Step 6: Email Enrichment
1. Use Apollo enrichment (cheapest, 1 credit)
2. Get:
   - Email
   - LinkedIn URL
   - Confirm job title
3. Target: ~1,000 leads with emails

---

## Expected Output

**Final List:**
- ~1,000 qualified leads
- Cosmetic dermatology/aesthetics clinics
- US-based
- 2-5 providers (5-15 employees)
- Decision-maker contact info
- Ready for Tier 3 campaign

---

## Notes for Today's Work

**Immediate Priority:**
1. Build company list (Step 1-3)
2. Get to ~2,000-3,000 companies
3. Structure table with columns above
4. **DO NOT run AI ICP analysis yet** (tomorrow with Matej)
5. Prepare the prompt (separate task)

**Tomorrow (14:00 meeting with Matej):**
- Implement AI ICP identifier together
- Filter to qualified companies
- Move to people-finding phase

---

**Last Updated:** 2026-05-13
