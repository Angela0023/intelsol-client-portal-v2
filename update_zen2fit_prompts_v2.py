#!/usr/bin/env python3
"""
Update Zen2Fit Clay Filter Prompts with FINAL refined ICP Match Prompt.
Includes proper industry exclusions and clearer criteria.
"""

import csv

# Define the FINAL ICP Match Prompt
FINAL_ICP_PROMPT = '''Determine if this company is a good fit for Zen2Fit, a corporate wellness SaaS platform for employees.

Return ONLY "YES", "NO", or "UNSURE - [reason]"

RETURN "YES" IF ALL OF THESE ARE TRUE:
1. Company's workforce is predominantly desk-based (office workers, knowledge workers, remote workers, software engineers, not retail branches, field sales, or manufacturing floor workers)
2. Company is in tech/SaaS/fintech/software/digital services/martech/devtools/insurtech/regtech
3. Company shows they invest in employee culture/benefits/wellbeing beyond salary - look for ANY of these signals:
   - Mentions employee benefits, perks, wellness programs, or culture on careers page
   - Posts about team events, employee programs, company culture on LinkedIn
   - Has employer certifications (Great Place to Work, Top Employers, Best Employer awards, Statista Best Employers)
   - Company values/mission mention "people-first", "employee wellbeing", "great culture", "team development"
   - Lists non-salary benefits (wellness programs, mental health support, learning budgets, team activities, flexible work)

RETURN "NO" IF ANY OF THESE ARE TRUE:
1. Company has under 50 employees OR over 500 employees
2. Workforce is predominantly non-desk based:
   - Retail store employees
   - Field sales teams
   - Manufacturing floor workers
   - Delivery/logistics drivers
   - Hospitality/restaurant staff
   - Warehouse workers
   - Field technicians
3. Already has a comprehensive wellness platform (Virgin Pulse, Wellhub, Gympass, Limeade, or similar established program mentioned on website)
4. Is a direct competitor in corporate wellness/EAP/employee benefits space
5. Is an investment firm, holding company, venture capital, private equity, or asset management firm (not software/SaaS)
6. Is a pure consulting firm (professional services billed by the hour - McKinsey, Deloitte, Big 4 consulting)
7. Is in industries that don't fit:
   - Traditional retail (stores, e-commerce fulfillment)
   - Hospitality/hotels/restaurants
   - Transportation/logistics
   - Real estate agencies (field sales)
   - Construction
   - Traditional manufacturing (not tech-enabled)
   - Pure recruiting/staffing agencies
8. Zero evidence of caring about employee benefits/culture/wellbeing on website or LinkedIn

RETURN "UNSURE - [reason]" IF:
1. Cannot determine employee count - say "UNSURE - cannot verify employee count"
2. Cannot determine if they're a software company vs services/consulting - say "UNSURE - unclear if tech/SaaS or services"
3. Cannot find enough information about culture/benefits investment - say "UNSURE - insufficient culture/benefits information"
4. Industry is borderline (e.g., tech-enabled but also has significant non-desk workforce) - say "UNSURE - mixed workforce type"
5. Company appears to be in transition or restructuring - say "UNSURE - company in transition"

Format examples:
- "YES"
- "NO"
- "UNSURE - cannot verify employee count"
- "UNSURE - insufficient culture/benefits information"'''

# Geography and industry combinations
geographies = ["Slovenia", "Hungary", "Poland", "Denmark", "Norway"]

industries = [
    ("Tech/SaaS", "Tech / SaaS / Software", "Tech, SaaS, Software, and IT-enabled companies"),
    ("Fintech", "Fintech", "Fintech, financial technology, and IT-enabled companies"),
    ("Martech/DevTools", "Martech / Dev Tools / B2B SaaS", "Martech, Dev Tools, B2B SaaS, and IT-enabled companies")
]

tier1_triggers = [
    ("New HR Leader", "Companies who hired a new HR Director, Head of People, CHRO, or People & Culture Lead in the past 3-6 months"),
    ("Rapid Growth", "Companies with 20%+ headcount growth in the past 12 months (rapid scaling teams)"),
    ("Recent Funding", "Companies who raised Series A/B/C funding in the past 12 months")
]

tier2_triggers = [
    ("Hybrid/Remote", "Companies with hybrid or fully remote workforce (distributed teams across multiple cities/countries)"),
    ("Employer Branding", "Companies actively posting about employer branding, team culture, or employee experience on LinkedIn in the past 30 days")
]

# Generate all 40 prompts
prompts = []

# Geography x Industry (15 prompts)
for geo in geographies:
    for industry_short, industry_display, industry_desc in industries:
        title = f"{geo} - {industry_short}"
        prompt = f"{industry_desc} in {geo} with 100-250 employees (priority) or 50-500 employees (secondary). Focus on companies with predominantly white-collar desk-based workforce."
        prompts.append({
            "Title": title,
            "PROMPT": prompt,
            "Industry": industry_display,
            "Location": geo,
            "Date targeted": "",
            "Company List": "",
            "ICP Match Prompt": FINAL_ICP_PROMPT
        })

# Geography x Tier 1 Triggers (15 prompts)
for geo in geographies:
    for trigger_name, trigger_desc in tier1_triggers:
        title = f"{geo} - {trigger_name}"
        prompt = f"{trigger_desc} in {geo}. Focus on Tech/SaaS/Fintech companies with 100-250 employees (priority) or 50-500 employees (secondary)."
        prompts.append({
            "Title": title,
            "PROMPT": prompt,
            "Industry": "Tech / SaaS / Fintech (All)",
            "Location": geo,
            "Date targeted": "",
            "Company List": "",
            "ICP Match Prompt": FINAL_ICP_PROMPT
        })

# Geography x Tier 2 Triggers (10 prompts)
for geo in geographies:
    for trigger_name, trigger_desc in tier2_triggers:
        title = f"{geo} - {trigger_name}"
        prompt = f"{trigger_desc} in {geo}. Focus on Tech/SaaS/Fintech companies with 100-250 employees (priority) or 50-500 employees (secondary)."
        prompts.append({
            "Title": title,
            "PROMPT": prompt,
            "Industry": "Tech / SaaS / Fintech (All)",
            "Location": geo,
            "Date targeted": "",
            "Company List": "",
            "ICP Match Prompt": FINAL_ICP_PROMPT
        })

# Write to CSV
output_file = "/Users/angelapetkovska/intelsol-client-portal/FINAL_Zen2Fit_Clay_Filter_Prompts.csv"

with open(output_file, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=["Title", "PROMPT", "Industry", "Location", "Date targeted", "Company List", "ICP Match Prompt"])
    writer.writeheader()
    writer.writerows(prompts)

print(f"✅ Generated {len(prompts)} prompts")
print(f"✅ Saved to: {output_file}")
print("\nKey refinements:")
print("✅ Removed employee count from YES criteria (stays in NO criteria)")
print("✅ Added explicit workforce type exclusions (retail, field sales, manufacturing, logistics, hospitality)")
print("✅ Added industry exclusions (investment firms, consulting, retail, hospitality, transportation, construction)")
print("✅ Added specific wellness competitor exclusions (Virgin Pulse, Wellhub, Gympass)")
print("✅ Added 'zero evidence of culture/benefits' as NO criteria")
print("✅ Added detailed UNSURE scenarios with reason format")
print("✅ Includes employer certifications as primary buying signal")
