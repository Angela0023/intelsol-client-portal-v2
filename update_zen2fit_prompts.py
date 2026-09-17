#!/usr/bin/env python3
"""
Update Zen2Fit Clay Filter Prompts with simplified ICP Match Prompt.
Focus on ONE real signal: company invests in employees beyond salary.
"""

import csv

# Define the simplified ICP Match Prompt
SIMPLIFIED_ICP_PROMPT = '''Review this company's website and public information to determine if they are a good fit for Zen2Fit, a corporate wellness SaaS platform.

Return ONLY "YES", "NO", or "UNSURE" based on these criteria:

RETURN "NO" IF ANY OF THESE ARE TRUE:
1. Company has under 50 employees
2. Company's workforce is predominantly non-desk/field-based (manufacturing floor workers, retail staff, delivery drivers, field technicians)
3. Company website shows they already have a comprehensive wellness platform or program
4. Company is a direct competitor in corporate wellness/EAP/employee benefits space

RETURN "YES" IF ALL OF THESE ARE TRUE:
1. Company has 50-500 employees (100-250 is ideal sweet spot)
2. Company's workforce is predominantly white-collar desk-based (office workers, knowledge workers, remote workers)
3. Company is in tech/SaaS/fintech/software/digital services industry
4. Company shows they invest in employee culture/benefits/wellbeing beyond salary - look for ANY of these signals:
   - Has employer certifications: Great Place to Work, Top Employers Institute, Best Places to Work, Statista Best Employers, or similar awards
   - Careers page mentions employee benefits, perks, wellness programs, learning & development, or team culture
   - LinkedIn posts about team events, employee programs, company culture, or wellbeing initiatives
   - Company values/mission mention "people-first", "employee wellbeing", "great culture", "team development"
   - Lists non-salary benefits like wellness programs, mental health support, team activities, learning budgets, flexible work

RETURN "UNSURE" IF:
- You cannot find enough information on the website or LinkedIn to verify criteria #4 (employee investment signals)
- The company's industry is unclear or borderline (e.g., tech-enabled but also has significant non-desk workforce)
- Employee count is not clearly stated and cannot be estimated from LinkedIn


Return only: YES, NO, or UNSURE'''

# Geography and industry combinations
geographies = ["Slovenia", "Hungary", "Poland", "Denmark", "Norway"]

industries = [
    ("Tech/SaaS", "Tech / SaaS / Software", "Tech, SaaS, Software, and IT-enabled companies"),
    ("Fintech", "Fintech", "Fintech, , and IT-enabled companies"),
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
            "ICP Match Prompt": SIMPLIFIED_ICP_PROMPT
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
            "ICP Match Prompt": SIMPLIFIED_ICP_PROMPT
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
            "ICP Match Prompt": SIMPLIFIED_ICP_PROMPT
        })

# Write to CSV
output_file = "/Users/angelapetkovska/intelsol-client-portal/FINAL_Zen2Fit_Clay_Filter_Prompts.csv"

with open(output_file, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=["Title", "PROMPT", "Industry", "Location", "Date targeted", "Company List", "ICP Match Prompt"])
    writer.writeheader()
    writer.writerows(prompts)

print(f"✅ Generated {len(prompts)} prompts")
print(f"✅ Saved to: {output_file}")
print("\nKey changes:")
print("- Removed 'visible HR function' requirement")
print("- Added employer certifications as primary signal")
print("- Added multiple employee investment signals (benefits, culture, LinkedIn activity)")
print("- Added 'UNSURE' option when information is insufficient")
print("- Simplified to focus on ONE real buying signal: investment in employees beyond salary")
