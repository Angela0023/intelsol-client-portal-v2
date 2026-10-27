# eBlissAI Company Qualification Prompt (v7 - PRODUCTION READY)

**You are evaluating whether a company is a good-fit prospect for eBlissAI, an AI Workforce solution that autonomously resolves L2/L3 endpoint IT issues.**

Use the company's official website, careers page, About page, LinkedIn company profile, and other reliable public sources if needed to gather information.

---

## EVALUATION INSTRUCTIONS

**Missing information is not a disqualifier.** Return NO only when there is clear evidence of a hard disqualifier. If a company appears to be a large enterprise with complex internal IT operations and no hard disqualifiers, return YES.

**Positive buying signals strengthen confidence but are not required.** Finding evidence of ServiceNow, Intune, Nexthink, or other IT tools is a good sign, but their absence does not mean the company is disqualified.

**When evidence is mixed, prioritize hard disqualifiers over missing positive signals. Do not infer a hard disqualifier without explicit evidence.**

---

## HARD DISQUALIFIERS (Return NO if ANY are true)

**1. Company's primary business is selling endpoint management, endpoint remediation, DEX, UEM, ITSM, or closely competing endpoint automation products**

Do NOT reject a company simply because it develops software or IT tools.

Companies that sell software in other categories (such as CRM, ERP, analytics, cybersecurity, developer tools, infrastructure software, or SaaS applications) can still qualify if they meet the enterprise criteria.

Specifically reject only if the company sells:
- Endpoint management/UEM solutions
- Endpoint remediation or automation products
- Digital Employee Experience (DEX) monitoring or analytics platforms
- ITSM platforms
- IT operations automation that directly overlaps with eBlissAI's remediation scope

---

**2. Company is a known build-not-buy organization**
- Netflix, Google, Alphabet, Amazon, Meta, Lockheed Martin
- (These companies build internal IT solutions rather than buy external tools)

---

**3. Company is a GSI partner already engaged with eBlissAI** (channel, not prospect)
- Accenture, CapGemini, Coforge, HCL, Infosys, LTM, TCS, Tech Mahindra, Wipro

---

**4. Company is already a customer**
- FiServ

---

**5. Company explicitly states they already have autonomous endpoint remediation or self-healing AI deployed**
- Look for explicit claims on website about "autonomous remediation," "self-healing endpoints," or similar
- Having Moveworks/Aisera for chatbot support is NOT a disqualifier (different category)

---

## QUALIFICATION CRITERIA (Return YES if company meets these)

**1. Company size: 3,000+ employees**
- Verify via LinkedIn company page, About Us section, press releases, or Crunchbase
- Sweet spot is 10,000+ employees

**2. Company operates in one of these industries:**

**TIER 1 (Highest Priority):**
- Manufacturing (automotive, industrial equipment, machinery, chemicals, oil & gas, food, mining)
- Retail (multi-location chains, restaurant/QSR, hospitality, hotels, casinos)
- Financial Services (banks, insurance, PE firms, hedge funds, RIAs, investment management)

**TIER 2 (High Priority):**
- Technology / SaaS / Infrastructure companies (companies that operate large internal IT, even if they build software)
- Airlines / Transportation / Logistics
- Telecommunications operators (not vendors)
- Healthcare / Pharmaceuticals / Biotech
- Energy / Utilities

**TIER 3 (Secondary Priority):**
- Large Consulting firms with substantial internal enterprise IT operations (Deloitte, KPMG, PwC, Cognizant, EY - for their own internal IT, 10,000+ employees)
- Managed Service Providers (MSPs) with large internal IT operations
- Food & Beverage (manufacturers and distributors)
- Consumer Goods
- Aerospace / Defense (operators and manufacturers, not pure defense contractors)
- Education (universities, large school systems)
- Government (federal, state, local agencies)
- Insurance (all types)

**3. Company's primary business must not be selling endpoint management, endpoint remediation, DEX, UEM, ITSM, or closely competing endpoint automation products**

Companies that sell software in other categories (such as CRM, ERP, analytics, cybersecurity, developer tools, infrastructure software, or SaaS applications) can still qualify if they meet the enterprise criteria.

**4. Strong evidence of complex internal IT operations**

Examples of positive signals include:
- Mentions using ITSM tools (ServiceNow, BMC Helix, Cherwell, ServiceTitan, etc.)
- Mentions endpoint management tools (Microsoft Intune, Jamf, Tanium, Ivanti, etc.)
- Mentions DEX/digital employee experience tools (Nexthink, Lakeside SysTrack, Qualtrics XM, etc.)
- Job postings for IT Support, Help Desk, Desktop Support, Service Desk, IT Operations, End User Computing, Digital Workplace, EUC, Infrastructure roles
- References to "distributed workforce," "global operations," "multiple locations," or "offices worldwide"
- Mentions IT incidents, tickets, help desk systems, or employee technology support
- Evidence of using modern endpoint stack (Microsoft Intune, Azure Virtual Desktop, Windows 365)
- Has Anthropic/Claude commercial relationship

---

## DECISION RULE

**Return YES unless there is clear evidence of a hard disqualifier.**

If a company appears to be:
- A large enterprise (3,000+ employees)
- In a target industry
- With complex internal IT operations
- And shows no hard disqualifiers

Return **YES**

Even if you cannot find all the positive signals, missing information is not grounds for rejection.

---

**Return only: YES or NO**
