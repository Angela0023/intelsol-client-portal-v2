# Intelsol - Updated ICP Verification Prompt

**Last Updated:** 2026-07-15 (Added US market; includes physical/industrial B2B products)

---

## Prompt for AI Filtering

Determine whether this company matches the ICP for Intelsol lead generation services.

**A match should be:**
- **B2B company** (sells to other businesses, NOT consumers)
- Offers one of the following:
  - **Service company** (IT services, consulting, professional services)
  - **SaaS product**
  - **Physical/industrial products sold B2B** (manufacturing, industrial equipment, wholesale, machinery, medical equipment, automation, etc.)
- **20-200 employees** (sweet spot: 50-100 employees)
- **High-ticket offers** - Products/services valued at $20K+ per deal
- **Active sales process** - Need to prospect and acquire new clients (not just passive/distributor model)
- Has a clear value proposition on their website
- Could benefit from outbound email campaigns to grow their pipeline
- **Geographic focus:** United States (primary); Belgium, Netherlands, Germany, Austria, Switzerland, France (primary EU); UK, Nordics, other EU (secondary)

**Not a match if:**
- B2C company (sells to consumers)
- eCommerce selling low-ticket consumer goods
- Under 20 employees or over 200 employees
- Recruitment/staffing agencies
- Companies selling only through distributors (no direct sales)
- Commodity/low-margin businesses
- Website is outdated or broken
- Already has a large in-house SDR/sales team (unlikely to outsource)
- Non-English website with no US/EU market presence

**Only use information visible on the domain.**

---

## Key Changes from Previous Version

### What Changed:
Added **"Physical/industrial products sold B2B"** to the match criteria

### What This Includes:
- Manufacturing companies (industrial machinery, automation equipment)
- Medical equipment manufacturers (B2B medical devices)
- Industrial automation & control systems
- CNC machinery and industrial equipment
- Measuring and control instruments
- Commercial and industrial machinery
- Renewable energy equipment
- Any company selling physical products to other businesses (not consumers)

### What This Excludes:
- B2C eCommerce (consumer products)
- Retail/consumer goods
- Commodity materials
- Component manufacturers selling only to OEMs (no direct sales process)

---

## Example Companies That Now Match

**Previously Excluded, Now Included:**
- HACO (Belgium) - CNC machinery manufacturer, 77 employees, B2B metal working equipment
- IPTE Factory Automation (Belgium) - Manufacturing automation systems, 100-200 employees
- Trafag (Switzerland) - Industrial sensors and measuring devices, 84 employees, B2B
- Intrion (Belgium) - Industrial machinery solutions, 120 employees

**Still Included:**
- 3D-ICT (Belgium) - IT consulting, 150 employees
- Kidan (Switzerland) - IT consulting, 30-60 employees
- Usercentrics (Germany) - Legal tech SaaS, 100-250 employees

---

## Industry Categories Now Covered

1. **Professional Services**
   - IT Services & Consulting
   - Management Consulting
   - Business Consulting

2. **SaaS Products**
   - Enterprise SaaS
   - B2B software platforms
   - Industry-specific SaaS

3. **Physical/Industrial B2B Products** *(NEW)*
   - Industrial automation & machinery
   - Manufacturing equipment
   - Medical equipment (B2B)
   - Measuring & control instruments
   - CNC machinery
   - Commercial equipment

---

## Updated Filter Logic

```
IF company is B2B
  AND (sells services OR sells SaaS OR sells industrial/physical products to businesses)
  AND has 20-200 employees
  AND sells high-ticket ($20K+)
  AND needs active sales process
  AND located in target EU markets
THEN → Perfect fit for Intelsol
```

---

**Source:** Matej's update: "please add B2B companies that sell physical/industrial products to other businesses as a match (not just service/SaaS)"
