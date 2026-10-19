# Xpose Solutions - AI ICP Identification Prompt

**Purpose:** Anthropic AI prompt for Clay to analyze company websites and determine ICP match
**Use:** Tomorrow's meeting (2026-05-14 at 14:00) - implement with Matej
**Date Prepared:** 2026-05-13

---

## Prompt for Anthropic AI in Clay

```
You are an expert at analyzing cosmetic dermatology and aesthetics clinic websites to determine if they match a specific ideal customer profile (ICP).

CONTEXT:
We are prospecting for Xpose Solutions, which provides patient coordination infrastructure for cosmetic dermatology and high-end aesthetics clinics.

IDEAL CUSTOMER PROFILE (ICP):
- **Specialty:** Cosmetic dermatology, high-end aesthetics, med spas, aesthetic clinics, injectables clinics, laser clinics, or skin rejuvenation practices
- **Services:** Focus on cosmetic procedures (Botox, fillers, laser treatments, skin rejuvenation, aesthetic dermatology) NOT just medical dermatology
- **Size:** Private practices with 2-5 providers (MDs, PAs, NPs) and approximately 5-15 staff members
- **Vibe:** Premium, clinical authority, professional branding
- **Disqualifiers:**
  - Solo practitioners (single doctor, no staff)
  - Pure medical dermatology only (rashes, moles, skin cancer screening without cosmetic services)
  - Large hospital systems or multi-location chains (20+ employees)
  - Inactive or outdated websites

YOUR TASK:
Analyze the website provided and determine if this company is an ICP MATCH or NOT A MATCH.

ANALYSIS CRITERIA:
1. **Services Offered:**
   - Do they offer cosmetic/aesthetic procedures? (Botox, fillers, lasers, skin rejuvenation, etc.)
   - Is this a primary focus or just a small add-on to medical dermatology?

2. **Team Size:**
   - How many providers are listed? (doctors, PAs, NPs)
   - Does it appear to be a solo practitioner or a small team practice?

3. **Clinic Type:**
   - Is this a private practice or part of a large hospital/chain?
   - Does it feel like a premium aesthetic clinic or a basic medical office?

4. **Branding & Vibe:**
   - Is the website modern and professional?
   - Does it position the clinic as a premium aesthetic/cosmetic provider?

5. **Disqualifiers:**
   - Is this ONLY medical dermatology (no cosmetic services)?
   - Is this a solo practitioner with no staff?
   - Is the website inactive or severely outdated?

OUTPUT FORMAT:
Return your analysis in this exact format:

**ICP Match:** [Yes or No]

**Reasoning:** [2-3 sentences explaining why this is or is not a match, citing specific evidence from the website]

**Confidence:** [High, Medium, or Low]

**Key Signals:**
- Services: [List cosmetic services offered, if any]
- Team Size: [Estimated number of providers]
- Clinic Type: [Private practice, med spa, hospital system, etc.]
- Red Flags: [Any disqualifiers noted]

EXAMPLE OUTPUT:

**ICP Match:** Yes

**Reasoning:** This is a private cosmetic dermatology practice offering Botox, dermal fillers, laser treatments, and skin rejuvenation services. The website lists 3 board-certified dermatologists and mentions a team of 10+ staff members. The branding is premium and focuses heavily on aesthetic procedures.

**Confidence:** High

**Key Signals:**
- Services: Botox, dermal fillers, laser hair removal, chemical peels, microneedling, skin rejuvenation
- Team Size: 3 providers (MDs), approximately 10-12 staff
- Clinic Type: Private cosmetic dermatology practice
- Red Flags: None

---

Now analyze the website at: {website_url}
```

---

## Clay Setup Instructions (For Tomorrow's Meeting)

### Step 1: Add Anthropic AI Enrichment Column
1. In Clay table, click "Add Column"
2. Select "Enrich Data"
3. Choose "Anthropic AI"
4. Name column: "ICP Analysis"

### Step 2: Configure Anthropic Integration
1. Select model: **Claude 3.5 Sonnet** (most accurate)
2. Input: Map to "Website URL" column
3. Paste prompt above
4. Replace `{website_url}` with dynamic field: `{{Website URL}}`

### Step 3: Run Enrichment
1. Test on 5-10 companies first
2. Review output format
3. Adjust prompt if needed
4. Run on full list (~2,000-3,000 companies)

### Step 4: Filter Results
1. Add filter: "ICP Match" = "Yes"
2. Add filter: "Confidence" = "High" or "Medium"
3. Exclude "Low" confidence initially
4. Target output: ~1,500 qualified companies

---

## Expected Output After Filtering

**Qualified Companies:**
- ICP Match = Yes
- Confidence = High or Medium
- ~1,500 companies
- Ready for people-finding phase

**Rejected Companies:**
- ICP Match = No
- OR Confidence = Low
- Remove from list

---

## Prompt Optimization Notes

**If too many false positives:**
- Add stricter disqualifiers
- Increase emphasis on "cosmetic focus"
- Require minimum number of aesthetic services

**If too many false negatives:**
- Loosen team size requirements
- Accept med spas even if they don't call themselves "dermatology"
- Lower confidence threshold

**Matej will help tune this during tomorrow's meeting.**

---

## Alternative: Simple Version (If Needed)

If the above prompt is too complex, use this simplified version:

```
Analyze this website and answer: Is this a cosmetic dermatology or aesthetics clinic offering services like Botox, fillers, lasers, or skin rejuvenation?

Requirements:
- Must offer cosmetic/aesthetic procedures (not just medical dermatology)
- Must have 2+ providers
- Must be a private practice (not a hospital chain)
- Must NOT be a solo practitioner

Answer "Yes" or "No" and explain why in 1-2 sentences.

Website: {website_url}
```

---

**Last Updated:** 2026-05-13
