# Zen2Fit ICP Match Prompt - Final Version

## Summary

Updated **FINAL_Zen2Fit_Clay_Filter_Prompts.csv** with refined ICP validation prompt based on:
1. User feedback: "The only signal we really need is that the company is investing in programs or things other than the salary for their employees"
2. Research on employer certifications (Great Place to Work, Top Employers Institute, Best Places to Work, Statista Best Employers)
3. Analysis of why 0/690 companies passed validation (prompt was too strict)

## What Changed from Previous Version

### ❌ REMOVED (Too Strict)
- "Company has visible HR/People function" requirement
- Industry-specific restrictions that were too narrow
- YES/NO only format (no space for uncertainty)

### ✅ ADDED (Right Checks)

**Workforce Type Exclusions:**
- Retail store employees
- Field sales teams
- Manufacturing floor workers
- Delivery/logistics drivers
- Hospitality/restaurant staff
- Warehouse workers
- Field technicians

**Industry Exclusions:**
- Investment firms, holding companies, venture capital, private equity, asset management (not software/SaaS)
- Pure consulting firms (McKinsey, Deloitte, Big 4)
- Traditional retail (stores, e-commerce fulfillment)
- Hospitality/hotels/restaurants
- Transportation/logistics
- Real estate agencies (field sales)
- Construction
- Traditional manufacturing (not tech-enabled)
- Pure recruiting/staffing agencies

**Specific Wellness Competitor Exclusions:**
- Virgin Pulse
- Wellhub
- Gympass
- Limeade
- Similar established wellness programs

**New NO Criterion:**
- "Zero evidence of caring about employee benefits/culture/wellbeing on website or LinkedIn"

**UNSURE Scenarios with Format:**
- "UNSURE - cannot verify employee count"
- "UNSURE - unclear if tech/SaaS or services"
- "UNSURE - insufficient culture/benefits information"
- "UNSURE - mixed workforce type"
- "UNSURE - company in transition"

## The Core Buying Signal (What We're Really Looking For)

**YES = Company invests in employees beyond salary**

Evidence can be ANY of these:
1. **Employer certifications** (Great Place to Work, Top Employers, Best Employer awards, Statista Best Employers)
2. **Careers page mentions** employee benefits, perks, wellness programs, culture
3. **LinkedIn posts** about team events, employee programs, company culture
4. **Company values** mention "people-first", "employee wellbeing", "great culture", "team development"
5. **Non-salary benefits listed** (wellness programs, mental health support, learning budgets, team activities, flexible work)

## Industries We Target (Expanded from Original)

**Core Industries:**
- Tech/SaaS
- Fintech
- Software
- Digital services
- Martech
- DevTools
- InsurTech
- RegTech

**Key:** Must be desk-based workforce in 50-500 employee range (100-250 ideal)

## Files Updated

1. **FINAL_Zen2Fit_Clay_Filter_Prompts.csv** - All 40 prompts updated with refined ICP Match Prompt
2. **Zen2Fit_ICP_Match_Prompt_FINAL.txt** - Standalone prompt for reference

## Structure

- **Total prompts:** 40
- **Geography × Industry:** 15 prompts (5 locations × 3 industries)
- **Geography × Tier 1 Triggers:** 15 prompts (5 locations × 3 triggers)
- **Geography × Tier 2 Triggers:** 10 prompts (5 locations × 2 triggers)
- **All single locations only** (Slovenia, Hungary, Poland, Denmark, Norway)

## Expected Outcome

This refined prompt should **dramatically improve match rate** from 0/690 by:
1. Removing overly strict requirements (visible HR function)
2. Focusing on the ONE real signal (employee investment)
3. Excluding industries that genuinely don't fit (retail, logistics, hospitality, etc.)
4. Allowing UNSURE when information is insufficient (rather than defaulting to NO)
5. Listing specific exclusions so AI knows exactly what to filter out

## Next Steps

1. Re-run Clay validation on Denmark - Fintech search (690 companies)
2. Monitor match rate improvement
3. Adjust thresholds if needed based on results

---

**Created:** 2026-09-15
**Last Updated:** 2026-09-15
