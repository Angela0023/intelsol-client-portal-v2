# eBliss AI - CLAY Filter Review (CORRECTED)

**Date:** October 7, 2026
**Analyst:** Angela Petkovska
**File Reviewed:** Leads _ eBliss AI - CLAY Filter Prompts (6).csv (1,026 lines, 54 segments)
**Campaign Performance:** 1,359 leads delivered, 0 replies (0.00% reply rate)

---

## Executive Summary

**Current State:** 54 segments correctly configured, Healthcare removed ✅

**Critical Issues Remaining:**
1. ❌ **Manufacturing (#1 priority industry) completely missing** - Need to add 6 segments
2. ⚠️ **ICP match prompt too loose** - "OR operates multiple physical locations" loophole
3. ⚠️ **Bank of America excluded** but Financial Services is #3 priority industry

**Root Cause of 0 Replies:**
- ICP match prompt allows companies with "multiple locations" instead of strict 10,000+ employees
- Retail/Hospitality campaigns especially affected (994 leads, 0 replies)
- Wrong company size = wrong buyer personas = no response

**Immediate Actions:**
1. Fix ICP match prompt (remove "multiple locations" clause)
2. Add 6 Manufacturing segments (US, Canada, DACH, Benelux, Nordics, UK)
3. Prioritize Financial Services & Airlines next (higher priority than Tech/SaaS)

---

## ✅ What's Correct

### Segments (54 total)

**Current segments by geography:**

| Geography | Industries | Count |
|-----------|-----------|-------|
| US | Retail/Hospitality, Tech/SaaS, Airlines/Logistics, Asset Mgmt, Consulting, Financial Services, Insurance, MSPs, Telecom | 9 |
| Canada | Retail/Hospitality, Tech/SaaS, Airlines/Logistics, Asset Mgmt, Consulting, Financial Services, Insurance, MSPs, Telecom | 9 |
| DACH | Retail/Hospitality, Tech/SaaS, Airlines/Logistics, Asset Mgmt, Consulting, Financial Services, Insurance, MSPs, Telecom | 9 |
| Benelux | Retail/Hospitality, Tech/SaaS, Airlines/Logistics, Asset Mgmt, Consulting, Financial Services, Insurance, MSPs, Telecom | 9 |
| Nordics | Retail/Hospitality, Tech/SaaS, Airlines/Logistics, Asset Mgmt, Consulting, Financial Services, Insurance, MSPs, Telecom | 9 |
| UK/Ireland | Retail/Hospitality, Tech/SaaS, Airlines/Logistics, Asset Mgmt, Consulting, Financial Services, Insurance, MSPs, Telecom | 9 |
| **TOTAL** | | **54** |

**Correctly removed:** Healthcare (6 segments) ✅

### Tech Stack Filters ✅

All correct per ICP:
- ServiceNow
- Nexthink
- Lakeside SysTrack
- Microsoft Intune
- Jamf
- Tanium
- BMC Helix

### Job Posting Filters ✅

All correct per ICP Tier 2 buying signals:
- Help Desk Technician
- IT Support Specialist
- L2 Support, L3 Support
- Service Desk Analyst
- IT Operations Manager
- VP of Digital Workplace
- VP of End User Computing
- Head of IT Operations

---

## ❌ Critical Missing: Manufacturing

### Issue

**Manufacturing is the #1 priority industry in ICP v6a** but is completely absent from all 54 segments.

**ICP Evidence:**
- FILTER-ANALYSIS-2026-10-07.md line 114: "Manufacturing promoted to #1 priority industry"
- ICP v6 → v6a update: Manufacturing promoted from lower rank to #1

### Required Action

**Add 6 Manufacturing segments immediately:**

1. US - Manufacturing
2. Canada - Manufacturing
3. DACH - Manufacturing
4. Benelux - Manufacturing
5. Nordics - Manufacturing
6. UK/Ireland - Manufacturing

**Filter Template:**
```
Manufacturing companies in [GEOGRAPHY] with 10,000 or more employees that are using at least one of these IT management tools: ServiceNow, Nexthink, Lakeside SysTrack, Microsoft Intune, Jamf, Tanium, or BMC Helix. Prioritize companies currently hiring for Help Desk Technician, IT Support Specialist, L2 Support, L3 Support, Service Desk Analyst, IT Operations Manager, VP of Digital Workplace, VP of End User Computing, or Head of IT Operations.
```

**Geography-specific:**
- US: "Manufacturing companies in the United States with 10,000..."
- Canada: "Manufacturing companies in Canada with 10,000..."
- DACH: "Manufacturing companies in Germany, Austria, or Switzerland with 10,000..."
- Benelux: "Manufacturing companies in Netherlands, Belgium, or Luxembourg with 10,000..."
- Nordics: "Manufacturing companies in Sweden, Norway, Denmark, or Finland with 10,000..."
- UK/Ireland: "Manufacturing companies in United Kingdom or Ireland with 10,000..."

---

## ⚠️ ICP Match Prompt Issues

### Problem 1: Too Loose on Employee Count (CRITICAL)

**Current Prompt (line 13, repeated in all 54 segments):**
```
RETURN "YES" IF ALL OF THESE ARE TRUE:
1. Company has 10,000 or more employees OR operates multiple physical locations/offices
2. Company's core business is NOT building IT infrastructure or endpoint management software
3. Company appears to be an enterprise that USES technology rather than BUILDS IT infrastructure products
4. No evidence on their website of already having complete autonomous IT operations
```

**The Problem:**

The "OR operates multiple physical locations/offices" clause creates a massive loophole:
- A 500-employee restaurant chain with 100 locations PASSES the filter
- A 2,000-employee retail chain with 50 stores PASSES the filter
- These companies are too small for eBliss AI's ICP (sweet spot: 10,000 +/- employees)

**Why This Causes 0 Replies:**

| Issue | Impact |
|-------|--------|
| Wrong company size | 1,000-5,000 employee companies don't have the budget |
| Wrong buyer personas | Single IT manager instead of VP of Digital Workplace |
| IT teams too small | No dedicated L2/L3 support roles to automate |
| Wrong value prop | Small companies don't have endpoint management complexity |

**Evidence from Current Campaigns:**
- US Retail/Hospitality: 994 leads delivered, 0 replies
- Retail naturally has "multiple locations" (restaurants, hotels, retail chains)
- Filter is letting in companies that are too small

**ICP Reference:**
- ICP v6a p.164: "Sweet spot: 10,000 +/- employees"
- ICP lowered MINIMUM from 5,000 to 3,000 endpoints (not 3,000 employees)
- Sweet spot remains 10,000+ employees

### Recommended Fix

**NEW ICP Match Prompt:**

```
RETURN "YES" IF ALL OF THESE ARE TRUE:
1. Company has 10,000 or more employees (verified via LinkedIn, company website About Us, or public records)
2. Company's core business is NOT building IT infrastructure, endpoint management software, or cybersecurity products
3. Company is primarily a technology USER, not a technology BUILDER or vendor
4. No evidence on company website of already deploying fully autonomous AI-driven IT operations or self-healing endpoints
5. Company is not in this known build-not-buy list: Netflix, Google, Alphabet, Amazon, AWS, IBM, Lockheed Martin, Meta/Facebook

Base your decision on: About Us page, Products/Services page, Careers page, recent news, and LinkedIn employee count.

Return only: YES or NO
```

**Key Changes:**
- ❌ REMOVED: "OR operates multiple physical locations/offices"
- ✅ CLARIFIED: Employee count verification sources
- ✅ REMOVED: Bank of America from exclusion list (see below)
- ✅ CLARIFIED: "technology USER vs BUILDER" language

---

### Problem 2: Bank of America Exclusion

**Current Prompt (line 8):**
```
2. Company is one of these known build-not-buy organizations: Netflix, Google, Alphabet, Amazon, AWS, IBM, Bank of America, Lockheed Martin, Meta/Facebook
```

**Issue:**

Bank of America is excluded, but **Financial Services & Banking** is the #3 priority industry per ICP.

**Two Options:**

**Option A (Recommended):** Remove "Bank of America" from exclusion list
- BofA has 200,000+ employees
- They use ServiceNow, Intune, and other tools in the buying signal list
- Large banks are ideal targets per ICP
- Financial Services is #3 priority industry

**Option B:** Keep BofA excluded with clarification
- If there's specific intelligence that BofA builds their own endpoint management tools
- Ask Matej/client if there's a documented reason for the exclusion
- Otherwise, remove it

**Recommendation:** Remove BofA from the list. If they truly build their own tools, the AI filter will catch it when analyzing their website (they'll mention building proprietary IT infrastructure).

---

## 📊 Campaign Performance Diagnosis

### Current Results

| Campaign | Leads | Sequences | Replies | Reply Rate | Launch Date |
|----------|-------|-----------|---------|------------|-------------|
| US - Technology/SaaS | 364 | 3 | 0 | 0.00% | 9/3/2026 |
| US - Retail/Hospitality | 994 | 3 | 0 | 0.00% | 9/14/2026 |
| **TOTAL** | **1,359** | **6** | **0** | **0.00%** | |

### Root Cause: Wrong Company Size

**Theory (Most Likely):**

The "multiple physical locations" loophole is letting in 1,000-5,000 employee companies:

| Segment | Vulnerable? | Why |
|---------|-------------|-----|
| Retail/Hospitality | **VERY HIGH** | Restaurant chains, hotel chains, retail stores naturally multi-location |
| Tech/SaaS | **MEDIUM** | Some SaaS companies have multiple offices but < 10,000 employees |
| Airlines/Logistics | **LOW** | Most airlines/logistics with multiple locations are already 10,000+ employees |
| Financial Services | **LOW** | Banks with multiple branches are typically 10,000+ employees |

**Evidence:**
- Retail/Hospitality: 994 leads, 0 replies = **HIGHEST VOLUME, ZERO RESPONSE**
- Tech/SaaS: 364 leads, 0 replies

**Hypothesis:**
- Filter is letting in 1,000-5,000 employee retail chains
- These companies:
  - Don't have VP of Digital Workplace (wrong buyer persona)
  - Don't have dedicated L2/L3 support teams (wrong use case)
  - Don't have budget for enterprise AI automation (wrong budget)
- Result: 994 emails sent to wrong companies = 0 replies

### Expected After Fix

**When employee count filter is tightened:**
- Total lead volume will DROP (stricter filter = fewer matches)
- Retail/Hospitality volume especially will decrease significantly
- **This is expected and healthy - quality > quantity**
- Reply rate should increase to 1-3% (industry standard for cold outbound)

---

## 🎯 Recommended Prioritization

### ICP Priority Order (v6a)

| Priority | Industry | Status | Next Action |
|----------|----------|--------|-------------|
| **#1** | **Manufacturing** | **MISSING** | **CREATE 6 segments, launch US first** |
| **#2** | Retail / Hospitality | Launched (US 9/14), 0 replies | FIX FILTER, then re-evaluate |
| **#3** | Financial Services | Not launched | **LAUNCH US THIS WEEK** (after filter fix) |
| **#4** | Technology / SaaS | Launched (US 9/3), 0 replies | HOLD, fix filter first |
| **#5** | Airlines / Logistics | Not launched | **LAUNCH US THIS WEEK** (after filter fix) |
| **#6** | Asset Management / PE | Not launched | Week 2-3 |
| **#7** | Insurance | Not launched | Week 3-4 |
| Secondary | Consulting | Not launched | Week 4+ |
| Secondary | MSPs | Not launched | Week 5+ |
| Secondary | Telecom | Not launched | Week 6+ |

### Week 1 Actions (This Week)

**Before launching ANY new campaigns:**

1. **Fix ICP match prompt** (all 54 segments)
   - Remove "OR operates multiple physical locations/offices"
   - Remove "Bank of America" from exclusion list
   - Require strict 10,000+ employees

2. **Create 6 Manufacturing segments**
   - US, Canada, DACH, Benelux, Nordics, UK/Ireland
   - Use corrected ICP match prompt

**Then launch:**

3. **US - Manufacturing** (after creating segment)
   - #1 priority industry
   - Examples: Auto manufacturers, industrial equipment, electronics
   - Strong need: Factory devices, engineering workstations, distributed plants

4. **US - Financial Services & Banking**
   - #3 priority industry
   - Natural fit: Large enterprises, complex IT, regulatory compliance
   - Examples: Regional banks (10,000+ employees), credit unions

5. **US - Airlines / Transportation / Logistics**
   - #5 priority industry
   - Clear use case: Distributed workforce, field technicians, mobile devices
   - Examples: Delta, United, FedEx, UPS

### Week 2 Actions

**Review:**
- Check reply rates from Manufacturing, Financial Services, Airlines
- If 1-3% reply rate = filters working
- If still 0% = investigate messaging/offer (not just filters)

**If filters are working (1-3% replies):**

6. Launch Canada - Manufacturing
7. Launch Canada - Financial Services
8. Launch US - Asset Management (#6 priority)

### What NOT to Do

1. ❌ Don't launch more Retail/Hospitality until filter is fixed
2. ❌ Don't launch more Tech/SaaS until filter is fixed
3. ❌ Don't launch EMEA geographies yet (validate US first)
4. ❌ Don't add Healthcare back (correctly removed)

---

## 📋 Final Segment Inventory

### Current State (54 segments)

**By Geography:**
- US: 9 industries
- Canada: 9 industries
- DACH: 9 industries
- Benelux: 9 industries
- Nordics: 9 industries
- UK/Ireland: 9 industries

**Industries present:** Retail/Hospitality, Tech/SaaS, Airlines/Logistics, Asset Management/PE, Consulting, Financial Services, Insurance, MSPs, Telecom

### Target State (60 segments)

**Add:**
- US - Manufacturing
- Canada - Manufacturing
- DACH - Manufacturing
- Benelux - Manufacturing
- Nordics - Manufacturing
- UK/Ireland - Manufacturing

**Final:** 54 current + 6 Manufacturing = **60 segments total**

---

## ✅ Action Checklist

### Immediate (Today)

- [ ] Fix ICP match prompt in ALL 54 existing segments
  - [ ] Remove "OR operates multiple physical locations/offices"
  - [ ] Remove "Bank of America" from exclusion list
  - [ ] Add employee verification language

- [ ] Create 6 Manufacturing segments
  - [ ] US - Manufacturing
  - [ ] Canada - Manufacturing
  - [ ] DACH - Manufacturing
  - [ ] Benelux - Manufacturing
  - [ ] Nordics - Manufacturing
  - [ ] UK/Ireland - Manufacturing

### This Week

- [ ] Launch US - Manufacturing (after creating)
- [ ] Launch US - Financial Services
- [ ] Launch US - Airlines / Transportation / Logistics

### Week 2 (Oct 14-21)

- [ ] Review reply rates from new campaigns
- [ ] If 1-3% replies = continue priority order
- [ ] If 0% replies = investigate messaging/offer
- [ ] Launch Canada - Manufacturing, Canada - Financial Services

### Week 3+ (If Campaigns Perform)

- [ ] Continue down ICP priority order
- [ ] Expand to DACH, Benelux, Nordics, UK/Ireland
- [ ] Monitor reply rates, adjust as needed

---

## 📈 Success Metrics

### Week 2-3 Targets

**For Manufacturing, Financial Services, Airlines campaigns:**

| Metric | Target | What It Means |
|--------|--------|---------------|
| Reply rate | 1-3% | Industry standard for cold outbound |
| Buyer persona level | VP/Director | Correct decision-makers responding |
| Qualified questions | 50%+ of replies | Questions about pricing, demos, ROI |
| Lead volume drop | 30-50% decrease | Expected from stricter filter (quality > quantity) |

**If you hit these metrics:**
- Filters are working correctly
- Continue down priority order
- Expand to secondary geographies

**If still 0% replies after filter fixes:**
- Pivot to messaging/offer analysis
- Issue is NOT filters, but email copy, value prop, or timing
- Review SmartLead sequences, subject lines, CTAs with client

---

**Analysis completed:** October 7, 2026
**Next review:** October 21, 2026 (after Manufacturing, Financial Services, Airlines campaigns run 2 weeks)
