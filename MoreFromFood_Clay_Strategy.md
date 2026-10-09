# MoreFromFood - Clay Filter Strategy

## Overview
This document outlines the Clay filtering strategy for MoreFromFood's Austrian food manufacturing market targeting.

---

## Market Segmentation (12 Segments)

### 1. Product-Based Segments (6 segments)
Target specific food manufacturing verticals with unique characteristics:

#### **Meat Processing**
- **Why:** Strict HACCP requirements, temperature controls, high contamination risk
- **Keywords:** Fleischverarbeitung, Fleischproduktion, Fleischerei
- **Key signals:** Multiple shifts, retail chain supply, export certifications

#### **Dairy Manufacturing**
- **Why:** Complex traceability, strict temperature monitoring, frequent quality checks
- **Keywords:** Molkerei, Milchverarbeitung, Käseherstellung
- **Key signals:** Multi-site operations, IFS/BRCGS certification

#### **Industrial Bakery**
- **Why:** Production scale, multi-site operations, retail supply chains
- **Keywords:** Bäckerei, Backwarenproduktion, Backwarenindustrie
- **Key signals:** Industrial scale (NOT artisan bakeries), retail partnerships

#### **Beverage Manufacturing**
- **Why:** Batch tracking, quality consistency, bottling line controls
- **Keywords:** Getränkeproduktion, Getränkeherstellung, Saftproduktion
- **Key signals:** Production facilities, bottling operations

#### **Prepared Meals**
- **Why:** Complex recipes, multiple ingredient tracking, shelf-life management
- **Keywords:** Fertiggerichte, Convenience Food, Fertigmahlzeiten
- **Key signals:** Retail partnerships, meal kit production

#### **Confectionery**
- **Why:** Recipe consistency, allergen tracking, quality control
- **Keywords:** Süßwarenindustrie, Schokoladenherstellung
- **Key signals:** Export activity, retail brand supply

---

### 2. Business Model Segments (3 segments)

#### **General Food Manufacturing (Mixed)**
- **Purpose:** Catch manufacturers not fitting specific verticals
- **Keywords:** Lebensmittelproduktion, Lebensmittelindustrie
- **Use:** Broad net for diverse food manufacturers

#### **Private Label Manufacturers**
- **Purpose:** Contract manufacturers are IDEAL fits (demanding clients, quality focus)
- **Keywords:** Lohnhersteller, Private Label, Auftragsfertigung
- **Why prioritize:** Multiple clients = diverse HACCP needs, high compliance pressure

#### **Certified Food Manufacturers**
- **Purpose:** Target companies already quality-focused (easier sell)
- **Keywords:** IFS zertifiziert, BRCGS zertifiziert, FSSC 22000, ISO 22000
- **Why prioritize:** Proven quality investment, active compliance programs

---

### 3. Behavioral Segments (3 segments)

#### **Export-Active Manufacturers**
- **Purpose:** International sales = higher quality standards
- **Keywords:** Export, International, Auslandsgeschäft
- **Why prioritize:** Must maintain documentation for multiple jurisdictions

#### **Multi-Site Manufacturers**
- **Purpose:** Centralized HACCP management across facilities
- **Keywords:** Produktionsstandorte, Werke, Standorte
- **Why prioritize:** Pain point = coordinating quality across sites

#### **Retail Chain Suppliers**
- **Purpose:** Demanding customers = stringent documentation requirements
- **Keywords:** Handelsmarke, Eigenmarke, Supermarkt
- **Why prioritize:** Audit pressure from retail partners

---

## Company Size Targeting

### Primary Range: 50-500 employees
- **Sweet spot:** Established quality processes, budget for software
- **Decision-making:** Quality Manager or Production Manager can champion
- **Filter:** `Employee Count: 50-500`

### Secondary Range: 20-49 employees
- **Conditions:** ONLY if production complexity evident
- **Complexity signals:**
  - Multiple production sites
  - Export markets mentioned
  - IFS/BRCGS/FSSC certifications listed
  - Retail chain partnerships
  - Job postings for Quality Manager
- **Filter:** `Employee Count: 20-49` + complexity signals

### Above 500 employees
- **Approach:** Selective account research
- **Process:**
  1. Identify specific operating plant
  2. Find quality sponsor at plant level
  3. Understand group purchasing authority
  4. Separate site-level from group headcount
- **Filter:** `Employee Count: >500` + manual qualification

---

## Clay Table Setup

### Column 1: Basic Filters
```
Location: Austria (HQ Country)
Employee Count: 50-500 (primary) OR 20-49 with signals
Industry Keywords: [Segment-specific German terms]
```

### Column 2: Enrichment
```
- Company website scrape
- LinkedIn company page
- Google search for certifications
- News mentions (expansion, new facilities)
```

### Column 3: ICP Match Prompt
```
Use the segment-specific ICP Match Prompt from CSV
Returns: YES or NO
```

### Column 4: Contact Discovery
```
Job Titles (German + English):
- Qualitätsleiter / Quality Manager
- Qualitätsmanager / Food Safety Manager
- Lebensmittelsicherheitsbeauftragter
- Produktionsleiter / Production Manager
- Betriebsleiter / Plant Manager
- Werksleiter / Operations Manager
```

### Column 5: Signal Detection
```
- Recent job postings (quality/production roles)
- Expansion announcements
- New certification projects
- New retail partnerships
- Production facility openings
```

---

## ICP Match Validation Rules

### MUST EXCLUDE (Return "NO"):
1. ❌ **Retailers only** - Food stores, supermarkets, specialty shops without production
2. ❌ **Restaurants/Catering** - Food service without manufacturing operations
3. ❌ **Brokers/Distributors** - No own production facilities
4. ❌ **Software/Consulting** - Service providers, not food manufacturers
5. ❌ **Small operations** - Under 20 employees without complexity signals
6. ❌ **Already using digital HACCP** - Explicitly mentioned comprehensive system

### MUST INCLUDE (Return "YES"):
1. ✅ **Actual production** - Own manufacturing facilities in Austria
2. ✅ **Right size** - 50-500 employees OR 20-49 with complexity
3. ✅ **Quality evidence** - Certifications, quality roles, compliance mentions
4. ✅ **Would benefit** - Clear use case for digital HACCP/quality control
5. ✅ **Located in Austria** - Production facilities (not just HQ) in Austria

---

## Persona Targeting Priority

### PRIMARY (Target First):

**1. Quality / Food Safety Manager**
- German titles: Qualitätsleiter, Qualitätsmanager, Lebensmittelsicherheitsbeauftragter
- Why: Process champion, validates HACCP and evidence needs
- Messaging: Easier access to records, faster audit prep, centralized compliance

**2. QA / QC Manager**
- German titles: QA Manager, QC Manager, Qualitätskontrolle
- Why: Daily workflow owner, knows practical gaps
- Messaging: Digital workspace for checks, deviation flagging, organized records

**3. Production / Plant Manager**
- German titles: Produktionsleiter, Betriebsleiter, Werksleiter
- Why: Operational sponsor for rollout
- Messaging: Shift visibility, clearer handovers, real-time status

### SECONDARY (Supporting Decision):

**4. Operations Director / Managing Director**
- German titles: Betriebsleiter, Geschäftsführer
- Why: Budget and priorities (smaller companies)
- Messaging: Multi-site oversight, compliance status, reduced admin workload

**5. IT / Procurement**
- German titles: IT Manager, Einkaufsleiter
- Why: Technical and commercial review (larger companies)
- Messaging: Multi-site deployment, integration, data security, commercial terms

---

## Buying Signals (Tier Priority)

### TIER 1 - Strongest Signals (Pursue Immediately):
- 🔥 **Active HACCP digitalization project** - Explicit mention on website/LinkedIn
- 🔥 **New facility opening** - Defined timeline = urgent need
- 🔥 **New certification project** - IFS/BRCGS implementation underway

**Action:** Immediate personalized outreach referencing the project

---

### TIER 2 - Moderate Signals (Qualified Outreach):
- 📈 **Capacity expansion** - New production lines, increased output
- 📈 **New retail customers** - Additional compliance requirements
- 📈 **Export expansion** - New international markets
- 📈 **Quality role hiring** - Posting for Quality Manager, Food Safety Manager

**Action:** Reach out with relevant case study or insight

---

### TIER 3 - Structural Fit (Standard Outreach):
- ✔️ **Manufacturing operations** - Confirmed production facilities
- ✔️ **Quality ownership** - Evidence of quality roles/processes
- ✔️ **Certifications** - IFS, BRCGS, FSSC 22000, ISO 22000
- ✔️ **Sufficient scale** - 50+ employees or multi-site

**Action:** Standard value-based outreach sequence

---

## Clay Workflow Recommendations

### Workflow 1: Vertical Segmentation
1. Create 6 separate tables (one per food vertical)
2. Run product-specific keyword searches
3. Apply segment-specific ICP Match prompts
4. Export qualified leads by vertical
5. Assign to different sequences based on vertical pain points

**Advantage:** Highly targeted messaging per food type

---

### Workflow 2: Behavioral Targeting
1. Create 3 tables (Export, Multi-Site, Retail Supply)
2. Search for behavioral signals
3. Apply behavioral ICP Match prompts
4. Tag leads with behavioral attributes
5. Prioritize based on signal strength

**Advantage:** Focus on high-intent accounts

---

### Workflow 3: Certification-First
1. Start with "Certified Food Manufacturers" table
2. Search for IFS, BRCGS, FSSC certifications
3. Apply certification ICP Match prompt
4. Enrich with vertical classification
5. Prioritize by certification recency

**Advantage:** Quality-proven companies, easier conversations

---

## Recommended Starting Segments

### Week 1-2: High Intent
1. **Certified Food Manufacturers** - Already quality-invested
2. **Multi-Site Manufacturers** - Clear pain point (coordination)
3. **Private Label Manufacturers** - Demanding clients = urgency

### Week 3-4: Vertical Deep Dives
4. **Meat Processing** - Strictest HACCP requirements
5. **Dairy Manufacturing** - Complex traceability needs
6. **Prepared Meals** - Multi-ingredient tracking

### Week 5-6: Broader Market
7. **Export-Active** - International compliance needs
8. **Retail Chain Suppliers** - Audit pressure
9. **General Food Manufacturing** - Catch remaining opportunities

### Week 7+: Vertical Expansion
10. **Industrial Bakery**
11. **Beverage Manufacturing**
12. **Confectionery**

---

## Success Metrics to Track

### Lead Quality Metrics:
- **ICP Match Rate:** Target >60% "YES" from AI prompt
- **Manufacturing Verification:** >90% have actual production facilities
- **Size Alignment:** >80% in 50-500 employee range
- **Certification Rate:** >40% with quality certifications

### Contact Quality Metrics:
- **Primary Persona Rate:** >70% Quality/QA/Production roles
- **Email Deliverability:** >95% valid work emails
- **LinkedIn Connection Rate:** >30% accept within 7 days

### Engagement Metrics:
- **Response Rate:** Target >15% (quality-focused audience)
- **Meeting Booking Rate:** Target >3% of outreach
- **Qualification Rate:** Target >50% of meetings → qualified opportunity

---

## Clay + SmartLead Integration

### Step 1: Clay Table
1. Apply filters (geography, size, keywords)
2. Run ICP Match prompt
3. Filter to "YES" only
4. Enrich with contacts (primary personas)
5. Export to CSV

### Step 2: SmartLead Import
1. Create campaign per segment
2. Upload CSV from Clay
3. Tag with: Segment name, Vertical, Company size tier
4. Assign to sequence matched to persona + vertical

### Step 3: Feedback Loop
1. Track response rate by segment
2. Note objections/questions by vertical
3. Feed insights back to Clay filters
4. Refine ICP Match prompts based on actual qualification

---

## Key Success Factors

### 1. Manufacturing Verification is CRITICAL
- Do NOT assume "food company" = "food manufacturer"
- Verify production facilities on website
- Check for plant/factory mentions, production images
- Confirm NOT just retailer, distributor, or broker

### 2. Size + Complexity Validation
- 50-500 = automatic qualify
- 20-49 = MUST have complexity signals (export, multi-site, certifications)
- >500 = manual research required

### 3. Quality Evidence Matters
- Look for certification logos (IFS, BRCGS, FSSC, ISO 22000)
- Check for quality/food safety job postings
- Review "About Us" for quality commitment language
- Note retail partnerships (indicates audit pressure)

### 4. Avoid Generic Food Services
- Restaurants (even chains) - NOT manufacturers
- Caterers - NOT manufacturers
- Food retailers - NOT manufacturers (unless also produce)
- Meal delivery services - NOT manufacturers (unless own kitchen)

---

## German Search Term Cheat Sheet

### Production Terms:
- Produktion = Production
- Herstellung = Manufacturing
- Verarbeitung = Processing
- Werk = Plant/Factory
- Betrieb = Operations/Facility

### Quality Terms:
- Qualität = Quality
- Sicherheit = Safety
- Zertifizierung = Certification
- Kontrolle = Control
- Lebensmittelsicherheit = Food Safety

### Food Verticals:
- Fleisch = Meat
- Milch = Milk
- Bäckerei = Bakery
- Getränke = Beverages
- Süßwaren = Confectionery
- Fertiggerichte = Ready meals

---

## Next Steps

1. ✅ Import `MoreFromFood_Clay_Filters.csv` into Clay
2. ✅ Set up first 3 tables (Certified, Multi-Site, Private Label)
3. ✅ Run initial searches with size filters (50-500 employees)
4. ✅ Apply ICP Match prompts to validate manufacturing
5. ✅ Enrich qualified companies with primary persona contacts
6. ✅ Export first 100 leads per segment
7. ✅ Create SmartLead sequences (one per segment)
8. ✅ Launch first campaigns and track metrics
9. ✅ Iterate based on response data

---

**Last Updated:** 2026-10-09
**Market:** Austria (German language)
**Target:** Food Manufacturing (50-500 employees)
