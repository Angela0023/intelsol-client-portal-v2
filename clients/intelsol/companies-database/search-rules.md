# Intelsol Company Search Rules

**Last Updated:** 2026-07-13 (includes Matej's update for physical/industrial B2B products)

---

## ICP Matching Criteria

### ✅ MUST MATCH (All Required)

**1. Business Model:**
- B2B company (sells to other businesses, NOT consumers)

**2. Product/Service Type (ONE of the following):**
- Service company (IT services, consulting, professional services)
- SaaS product
- Physical/industrial products sold B2B (manufacturing, industrial equipment, wholesale, machinery, medical equipment, automation)

**3. Company Size:**
- 20-200 employees
- Sweet spot: 50-100 employees
- Large enough to have budget, small enough for quick decisions

**4. Deal Value:**
- High-ticket offers ($20K+ per deal)
- Annual revenue: $10M - $100M

**5. Sales Process:**
- Active sales process required
- Need to prospect and acquire new clients
- NOT passive/distributor-only models

**6. Website:**
- Has a clear value proposition on website
- Website is functional (not outdated or broken)

**7. Geography:**
- Located in target markets (see below)
- English or local language website with business presence in target market

---

## ❌ EXCLUDE (Deal Breakers)

- B2C companies (selling to consumers)
- eCommerce selling low-ticket consumer goods
- Under 20 employees or over 200 employees
- Recruitment/staffing agencies
- Companies selling only through distributors (no direct sales)
- Commodity/low-margin businesses
- Website is outdated or broken
- Already has large in-house SDR/sales team (unlikely to outsource)
- Non-English/non-local website with no market presence in target geography

---

## Target Industries

### Professional Services (Primary):
- IT Services and IT Consulting
- Software Development
- Technology, Information and Internet
- Management Consulting
- Business Consulting Services

### B2B SaaS:
- Enterprise software platforms
- B2B software applications
- Industry-specific SaaS solutions

### Manufacturing - High-Ticket B2B (Secondary):

**INCLUDE these 8 manufacturing categories:**
1. Automation Machinery Manufacturing
2. Industrial Machinery Manufacturing
3. Commercial and Service Industry Machinery Manufacturing
4. Medical Equipment Manufacturing
5. Measuring and Control Instrument Manufacturing
6. Computer Hardware Manufacturing
7. Communications Equipment Manufacturing
8. Renewable Energy Equipment Manufacturing

**Pattern:** Manufacturing companies that sell expensive equipment/systems directly to businesses and need active prospecting.

**EXCLUDE from manufacturing:**
- Consumer goods manufacturers
- Commodity materials
- Component manufacturers selling only to OEMs
- Low-ticket products

---

## Geographic Markets

### Primary Markets (Priority 1):
- **Belgium** - Brussels, Antwerp, Ghent, Liège
- **Netherlands** - Amsterdam, Rotterdam, Utrecht, Eindhoven
- **Germany** - Berlin, Munich, Hamburg, Frankfurt, Cologne, Stuttgart
- **Austria** - Vienna, Graz, Linz
- **Switzerland** - Zurich, Geneva, Basel, Bern, Lausanne
- **France** - Paris, Lyon, Marseille, Toulouse

### Secondary Markets (Priority 2):
- **United Kingdom** - London, Manchester, Birmingham, Edinburgh
- **United States** - (all major tech/business hubs)
- **Sweden** - Stockholm, Gothenburg, Malmö
- **Norway** - Oslo, Bergen, Stavanger
- **Denmark** - Copenhagen, Aarhus
- **Finland** - Helsinki, Espoo, Tampere

---

## Search Strategy per Country

### Target: 100 companies per country

**Distribution by Industry (suggested):**
- 40% - IT Services & Consulting
- 30% - B2B SaaS
- 20% - Industrial/Manufacturing (high-ticket B2B)
- 10% - Management/Business Consulting

**Distribution by Company Size:**
- 30% - 20-50 employees
- 50% - 51-100 employees (sweet spot)
- 20% - 101-200 employees

---

## Search Tools & Sources

### Web Search Strategy:
1. Use multiple search queries combining:
   - Industry keywords
   - Company size indicators
   - Geographic location
   - B2B signals

2. Sources:
   - Company directories (TechBehemoths, Clutch, Europages, etc.)
   - Industry associations
   - LinkedIn company search
   - Business databases
   - Trade publications

3. Validation:
   - Verify company website exists and is active
   - Check employee count via LinkedIn or company site
   - Confirm B2B business model from website content
   - Validate geographic presence

---

## Deduplication Rules

**Before adding any company:**
1. Check `already-targeted.csv` - exclude if present
2. Check domain variations (www, subdomain, etc.)
3. Verify company name (handle name variations, acquisitions)
4. Check for parent/subsidiary relationships

**Duplicate Indicators:**
- Same domain (exact or subdomain match)
- Same company name + same city
- Known subsidiary of already-targeted company

---

## Output Format

**Each company record must include:**
- Company Name
- Website (domain only, no http/https/www)
- Industry (specific category)
- Location (City, Country)
- Estimated Employees (range or specific number)
- Estimated Revenue (range)
- ICP Fit Reason (why they match - 1 sentence)
- Date Added (YYYY-MM-DD)
- Search Batch (identifier for this search)

**CSV Format:**
```
Company Name,Website,Industry,Location,Estimated Employees,Estimated Revenue,ICP Fit Reason,Date Added,Search Batch
Example Corp,example.com,IT Consulting,"Brussels, Belgium",85,"$15M-$40M","IT consulting firm serving enterprise B2B clients",2026-07-13,batch-001
```

---

## Quality Standards

**Each company must:**
- Have a functional website with clear B2B value proposition
- Show evidence of active business (recent news, hiring, etc.)
- Match ALL required ICP criteria
- Not be in `already-targeted.csv`
- Be verifiable through public sources

**Reject if:**
- Website is broken, under construction, or parked domain
- No clear indication of B2B business model
- Insufficient information to verify employee count or revenue
- Company is obviously B2C
- Listed as "out of business" or acquired

---

## Notes

- **Geographic preference:** Focus on major business cities within each country
- **Language:** Companies can have local language websites as long as they operate in target market
- **Revenue estimation:** Use public data, funding rounds, employee count estimates, or industry averages
- **Update frequency:** Re-validate companies every 6 months (check if still in business, size changes, etc.)

---

**Source:** Based on Intelsol ICP documentation + Matej's June 2026 updates
**Maintained by:** Angela Petkovska (Operations Manager)
