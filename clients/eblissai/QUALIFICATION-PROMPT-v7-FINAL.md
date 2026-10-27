# eBlissAI Company Qualification Prompt (v7 - Final)

**Purpose:** Determine if a company is a good-fit prospect for eBlissAI's Autonomous Execution Layer
**Based On:** ICP Questionnaire v6a (Sept 9, 2026) + Client Approval Feedback
**Last Updated:** October 27, 2026
**Owner:** Angela Petkovska / INTELSOL

---

## THE PROMPT

Return ONLY **"YES"** or **"NO"**

---

### RETURN "NO" IF ANY OF THESE ARE TRUE:

**1. Company's PRIMARY BUSINESS is building and selling technology products**
   - Check company domain to verify their core business
   - Examples: servicenow.com, bmc.com, microsoft.com, apple.com, oracle.com, sap.com, salesforce.com, adobe.com, intel.com, cisco.com, dell.com, hp.com, vmware.com, ibm.com
   - **Exception:** If company USES these tools internally for their own IT operations (not selling them) → continue evaluating
   - **Note:** Software companies with 5,000+ employees AND demonstrable internal IT operations CAN qualify (see: PTC, Pega, Dynatrace, etc.)

**2. Company is a direct competitor**
   - Check domain: nanoheal.com, tanium.com, nexthink.com, lakeside.com, controlup.com, consoleconnect.com, ivanti.com, riverbed.com
   - **Exception:** If company USES Tanium/Nexthink/Lakeside/Ivanti for their own IT = POSITIVE signal, not disqualification

**3. Company is a known build-not-buy organization**
   - Netflix, Google, Alphabet, Amazon, AWS, Meta/Facebook, Lockheed Martin
   - These companies build their own internal IT solutions rather than buy external tools

**4. Company already has fully autonomous self-healing AI endpoints deployed**
   - Evidence: Website explicitly states autonomous remediation or self-healing endpoints are live
   - Signal: If they've already solved this problem, they're not a prospect

**5. Company is a GSI partner already engaged with eBlissAI**
   - Accenture, CapGemini, Coforge, HCL, InfoSys, LTM, TCS, Tech Mahindra, Wipro
   - These are partnership channels, not end-customer targets

**6. Company is FiServ (existing direct customer)**
   - Already engaged

---

### RETURN "YES" IF ALL OF THESE ARE TRUE:

**1. Company has 3,000+ employees (or strong evidence of 3,000+ endpoints)**
   - Verify via: LinkedIn company page, About Us page, press releases, job postings, Crunchbase
   - **Sweet spot:** 10,000 +/- employees (but 3,000 is hard minimum)

**2. Company operates in one of these industries:**

   **TIER 1 (HIGHEST PRIORITY):**
   - Manufacturing (automotive, industrial equipment, machinery, chemicals, food, oil & gas, mining)
   - Retail (multi-location chains, restaurant/QSR chains, hospitality, hotels, casinos)
   - Financial Services (diversified banks, insurance, PE firms, hedge funds, RIAs, investment management)

   **TIER 2 (HIGH PRIORITY):**
   - Technology / SaaS / Infrastructure (companies operating large internal IT, even if they build software)
   - Airlines / Transportation / Logistics
   - Telecommunications operators (not vendors)
   - Healthcare / Pharmaceuticals / Biotech
   - Energy / Utilities

   **TIER 3 (SECONDARY PRIORITY):**
   - Large Consulting / SI firms (Deloitte, KPMG, PwC, Cognizant, EY - for their OWN internal IT operations, 10,000+ employees)
   - Managed Service Providers (MSPs) with large internal IT operations
   - Food & Beverage (manufacturers and distributors)
   - Consumer Goods
   - Aerospace / Defense (operators and manufacturers, not defense contractors without large IT)
   - Education (universities, large school systems)
   - Government (federal, state, local agencies)
   - Insurance (depository and alternative risk carriers)

**3. Company's core business is OPERATING in their industry, NOT primarily selling IT technology**
   - ✓ Manufacturers that make physical products (even if they also use/sell software)
   - ✓ Retailers that sell consumer goods
   - ✓ Banks/Insurance that provide financial services
   - ✓ Airlines/Logistics that move people or goods
   - ✓ Healthcare systems that operate hospitals
   - ✓ Consulting firms that provide professional services (with large internal IT)
   - ✓ Universities that operate educational institutions
   - ✓ Telecom/Cable operators that provide connectivity
   - ✓ Software companies IF they have 5,000+ employees AND operate significant internal IT (see Exception in RETURN NO section)
   - ✗ Pure software/IT vendors (unless exception applies)

**4. Website shows evidence of complex IT operations (find AT LEAST ONE of these):**
   - ✓ Mentions using ITSM tools (ServiceNow, BMC Helix, Cherwell, ServiceTitan, etc.) — **STRONG POSITIVE**
   - ✓ Mentions endpoint management tools (Microsoft Intune, Jamf, Tanium, Ivanti, etc.) — **STRONG POSITIVE**
   - ✓ Mentions DEX/employee experience tools (Nexthink, Lakeside SysTrack, Qualtrics XM, etc.) — **VERY STRONG POSITIVE**
   - ✓ Job postings for: IT Support, Help Desk, Desktop Support, Service Desk, IT Operations, End User Computing, Digital Workplace, EUC, Infrastructure roles
   - ✓ Mentions distributed workforce, multiple locations, global operations
   - ✓ References IT incidents, tickets, help desk systems, or employee technology support
   - ✓ Uses Microsoft Intune, Azure Virtual Desktop, Windows 365 (signals modern endpoint stack)
   - ✓ Mentions Anthropic/Claude commercial relationship — **NATURAL EXTENSION SALE**

**5. No evidence company has already solved this with autonomous self-healing AI**
   - Confirm they don't have Moveworks, Aisera, or similar already deployed for endpoint automation
   - Note: Having Moveworks/Aisera for chatbot support is POSITIVE signal, not blocker (different category)

---

## INDUSTRY REFERENCE TABLE

| Industry | Include? | Notes |
|----------|----------|-------|
| Manufacturing (all types) | ✓ YES | Tier 1 priority |
| Retail (multi-location chains) | ✓ YES | Tier 1 priority |
| Financial Services | ✓ YES | Banks, insurance, PE, hedge funds, RIAs; Tier 1 |
| Technology / SaaS | ✓ YES (with size check) | IF 5,000+ employees AND internal IT; Tier 2 |
| Airlines / Transportation | ✓ YES | Tier 2 priority |
| Telecom Operators | ✓ YES | NOT vendors; Tier 2 |
| Healthcare / Pharma / Biotech | ✓ YES | Tier 2 priority |
| Energy / Utilities | ✓ YES | Tier 2 priority |
| Consulting / SI (Big 4, mid-market) | ✓ YES (Deloitte, KPMG, PwC, Cognizant, EY for internal IT) | Tier 3; must be 10K+ employees |
| MSPs | ✓ YES | IF they have large internal IT; Tier 3 |
| Food & Beverage | ✓ YES | Manufacturers, distributors; Tier 3 |
| Consumer Goods | ✓ YES | Tier 3 |
| Aerospace / Defense | ✓ YES (operators/manufacturers) | NOT pure defense contractors; Tier 3 |
| Education | ✓ YES | Universities, large school systems; Tier 3 |
| Government | ✓ YES | Federal, state, local agencies; Tier 3 |
| Insurance | ✓ YES | All types; Tier 3 |
| IT Infrastructure / Cloud Vendors | ✗ NO | Build-not-buy core business |
| ITSM / Endpoint Software Vendors | ✗ NO | Direct competitors or build-not-buy |
| Cybersecurity Vendors | ✗ NO | NOT a fit for endpoint remediation |

---

## HOW TO USE THIS PROMPT

1. **Review company domain** — Determine if it's a software/IT vendor (return NO)
2. **Verify company size** — 3,000+ employees minimum (check LinkedIn)
3. **Identify industry** — Is it in Tier 1, 2, or 3?
4. **Search website for signals** — ITSM, DEX, UEM tools, job postings, IT operations
5. **Check for conflicts** — Build-not-buy culture, existing autonomous AI, GSI partnership
6. **Return YES or NO** — Only if all five "YES" conditions are true

---

## COMMON EDGE CASES

| Scenario | Decision | Why |
|----------|----------|-----|
| Software company with 5,000+ employees | EVALUATE | May pass if Tier 3 applies (internal IT evidence required) |
| Uses Tanium/Nexthink internally | YES, continue | Positive signal of IT maturity |
| Has Moveworks for chatbot support | YES, continue | Different category; not endpoint automation |
| University/School system | EVALUATE | Tier 3; check size (3,000+ staff) and IT complexity |
| Government agency | EVALUATE | Tier 3; check IT operations evidence |
| Insurance company | YES | Explicit in Tier 3 |
| Consulting firm (Deloitte, KPMG, etc.) | EVALUATE | YES if 10,000+ employees; NO if smaller |
| Pure DevOps / Cloud-native software co. | NO | Build-not-buy culture likely |
| Company using Copilot / Claude internally | YES, continue | Positive signal; natural extension sale opportunity |

---

## EXAMPLES: APPROVED GOOD CLIENTS (150+ in database)

**Manufacturing:** Standex, Graco, Teradyne, Entegris, Dorman Products, Armstrong, Scotts Miracle-Gro, Winebago, Belden, G-III, Stoneridge, Vermeer, Swagelok, Allegro Micro, Hypertherm, Timex, Conair, Boston Beer, Craneco, Pitch Bowes

**Healthcare / Pharma / Biotech:** Dana-Farber, Vertex, Haemonetics, Alnylam, Moderna, Insulet, Hologic, Enovis, Incyte, InterSystems, Sheppard Pratt, Kennedy Krieger, Multiple health systems, Akron Children's, Aultman

**Financial Services:** Eastern Bank, Jefferies, BBH, DE Shaw, Interactive Brokers, DTCC, Equitable, Trow Price, FirstHorizon, Credit Acceptance, Commerce Bank, Wesbanco, Fannie Mae, Freddie Mac, Carlyle, Genworth, Berkley, Amica, AFICA, PRA Group, CinFin, Atlantic Union, Kemper

**Retail / Hospitality:** LLBean, Stewart Leonard's, Ocean State Job Lot, Hasbro, Papa Johns, CoStar, Costar Group

**Insurance:** Blue Cross MA, Blue Cross NC, Plymouth Rock, GDI, NJCOURTS, NJM, Horizonblue, PHLY, PAHC, Beneva, Laurentian, BCBSal, Definitive Financial

**Telecom / Tech:** Ciena, Rapid7, ZiffDavis, IAC, PTC, Pega, Progress, Dynatrace, Appian, Alarm, Blackbaud, PayLocity, DesCart, Bottomline, HubSpot, IAC

**Energy / Utilities:** Avangrid, CMS Energy, Emera, Irving Oil, Tronox

**Transportation / Logistics:** Hyster-Yale, Descartes, MDA Space, Magellan Aero, Russelmetals, ATS Automation

**Education:** Tufts, URI, UMaine, UDel, WVU, App State, UNB, Prince Edward Island

**Other:** Casella Waste, FM Global, Kroll, Evolent, Nordson, IDEX, Graco

---

## VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| v6a | Sept 9, 2026 | ICP baseline: 3,000+ endpoints, autonomous execution layer, mid/large enterprises |
| v6.5 | Oct 10, 2026 | Added software company exception; clarified Build vs Use distinction |
| v7 (Final) | Oct 27, 2026 | Client approval; consolidated with good-client examples; industry tiers clarified |

---

## HOW TO APPLY AT SCALE

**For bulk company screening:**
1. Create a spreadsheet with company domains
2. For each company, visit website + LinkedIn
3. Apply this prompt systematically (build → size → industry → signals)
4. Mark as YES / NO / EVALUATE (if borderline)
5. Only EVALUATE cases need manual review

**For API / Automation:**
- This prompt is suitable for Claude API, language models, or web scraping + ML classification
- Recommend human review for EVALUATE cases before outreach

**For continuous updates:**
- As you identify new good/bad-fit customers, add to Good Clients table
- Update version number when changing qualification logic

---

**To use this in practice:** Copy the "THE PROMPT" section and use with your company data.
