#!/usr/bin/env python3
"""
Clean Intelsol company lists:
1. Remove huge enterprises
2. Remove already-targeted companies
3. Remove companies with 200+ employees
4. Report what needs to be replaced
"""

import csv
import os
from pathlib import Path

# Define paths
BASE_DIR = Path("/Users/angelapetkovska/Desktop/Claude Clients/Claude Matej/Clients/intelsol/companies-database")
BY_COUNTRY_DIR = BASE_DIR / "by-country"
ALREADY_TARGETED = BASE_DIR / "already-targeted.csv"

# Huge enterprises to exclude (Big 4, Big Tech, major consultancies)
HUGE_ENTERPRISES = {
    'accenture', 'ibm', 'deloitte', 'kpmg', 'pwc', 'ey', 'capgemini', 'cognizant',
    'tcs', 'wipro', 'infosys', 'thoughtworks', 'bcg', 'mckinsey', 'bain', 'microsoft',
    'google', 'amazon', 'apple', 'facebook', 'meta', 'salesforce', 'oracle', 'sap',
    'adobe', 'atlassian', 'slack', 'stripe', 'figma', 'notion', 'hubspot', 'zendesk',
    'intercom', 'asana', 'docusign', 'servicenow', 'workday', 'uipath', 'siemens',
    'bosch', 'ge', 'schneider', 'honeywell', 'emerson', 'abb', 'rockwell'
}

def normalize_domain(domain):
    """Normalize domain for comparison"""
    if not domain:
        return ""
    domain = domain.lower().strip()
    # Remove common prefixes
    for prefix in ['http://', 'https://', 'www.']:
        if domain.startswith(prefix):
            domain = domain[len(prefix):]
    # Remove trailing slash
    domain = domain.rstrip('/')
    return domain

def is_huge_enterprise(company_name, website):
    """Check if company is a huge enterprise"""
    name_lower = company_name.lower()
    domain_lower = normalize_domain(website)

    for enterprise in HUGE_ENTERPRISES:
        if enterprise in name_lower or enterprise in domain_lower:
            return True
    return False

def parse_employee_count(employee_str):
    """Parse employee count from various formats"""
    if not employee_str:
        return 0

    # Remove commas and + signs
    employee_str = str(employee_str).replace(',', '').replace('+', '')

    # Handle ranges like "150-200" or "50M-100M" (take max)
    if '-' in employee_str:
        parts = employee_str.split('-')
        try:
            return int(''.join(filter(str.isdigit, parts[-1])))
        except:
            return 0

    # Extract first number found
    try:
        return int(''.join(filter(str.isdigit, employee_str)))
    except:
        return 0

def load_already_targeted():
    """Load already-targeted domains"""
    targeted = set()
    try:
        with open(ALREADY_TARGETED, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                domain = normalize_domain(row.get('Website', ''))
                if domain:
                    targeted.add(domain)
    except Exception as e:
        print(f"Error loading already-targeted: {e}")
    return targeted

def clean_country_file(country_file, already_targeted):
    """Clean a single country file"""
    country_name = country_file.stem.replace('-companies', '').replace('-', ' ').title()
    print(f"\n{'='*60}")
    print(f"Processing: {country_name}")
    print(f"{'='*60}")

    companies = []
    removed = {
        'huge_enterprise': [],
        'already_targeted': [],
        'too_many_employees': [],
        'no_employee_data': []
    }

    # Read existing companies
    with open(country_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            companies.append(row)

    print(f"Original count: {len(companies)} companies")

    # Filter companies
    clean_companies = []
    for company in companies:
        name = company.get('Company Name', '')
        website = company.get('Website', '')
        employees_str = company.get('Estimated Employees', '')

        # Check 1: Huge enterprise
        if is_huge_enterprise(name, website):
            removed['huge_enterprise'].append((name, website, 'Huge global enterprise'))
            continue

        # Check 2: Already targeted
        domain = normalize_domain(website)
        if domain in already_targeted:
            removed['already_targeted'].append((name, website, 'Already in targeted database'))
            continue

        # Check 3: Employee count
        employee_count = parse_employee_count(employees_str)
        if employee_count == 0:
            # Keep if no data (we'll assume it's in range)
            pass
        elif employee_count > 200:
            removed['too_many_employees'].append((name, website, f'{employee_count} employees'))
            continue

        clean_companies.append(company)

    # Write cleaned file
    with open(country_file, 'w', encoding='utf-8', newline='') as f:
        if clean_companies:
            writer = csv.DictWriter(f, fieldnames=clean_companies[0].keys())
            writer.writeheader()
            writer.writerows(clean_companies)

    # Report
    print(f"\nCleaned count: {len(clean_companies)} companies")
    print(f"Need to add: {100 - len(clean_companies)} companies to reach 100")

    print(f"\n--- Removal Summary ---")
    print(f"Huge enterprises removed: {len(removed['huge_enterprise'])}")
    if removed['huge_enterprise']:
        for name, domain, reason in removed['huge_enterprise'][:5]:
            print(f"  - {name} ({domain}): {reason}")
        if len(removed['huge_enterprise']) > 5:
            print(f"  ... and {len(removed['huge_enterprise']) - 5} more")

    print(f"\nAlready targeted removed: {len(removed['already_targeted'])}")
    if removed['already_targeted']:
        for name, domain, reason in removed['already_targeted'][:5]:
            print(f"  - {name} ({domain}): {reason}")
        if len(removed['already_targeted']) > 5:
            print(f"  ... and {len(removed['already_targeted']) - 5} more")

    print(f"\nToo many employees removed: {len(removed['too_many_employees'])}")
    if removed['too_many_employees']:
        for name, domain, reason in removed['too_many_employees'][:5]:
            print(f"  - {name} ({domain}): {reason}")
        if len(removed['too_many_employees']) > 5:
            print(f"  ... and {len(removed['too_many_employees']) - 5} more")

    return {
        'original': len(companies),
        'cleaned': len(clean_companies),
        'need': max(0, 100 - len(clean_companies)),
        'removed': removed
    }

def main():
    print("="*60)
    print("INTELSOL COMPANY DATABASE CLEANING")
    print("="*60)

    # Load already-targeted domains
    print("\nLoading already-targeted database...")
    already_targeted = load_already_targeted()
    print(f"Loaded {len(already_targeted)} already-targeted domains")

    # Get all country files
    country_files = sorted(BY_COUNTRY_DIR.glob("*-companies.csv"))

    # Process each country
    results = {}
    for country_file in country_files:
        result = clean_country_file(country_file, already_targeted)
        results[country_file.stem] = result

    # Final summary
    print("\n" + "="*60)
    print("FINAL SUMMARY")
    print("="*60)

    total_original = sum(r['original'] for r in results.values())
    total_cleaned = sum(r['cleaned'] for r in results.values())
    total_need = sum(r['need'] for r in results.values())

    print(f"\nTotal companies across all countries:")
    print(f"  Original: {total_original}")
    print(f"  After cleaning: {total_cleaned}")
    print(f"  Need to add: {total_need}")

    print(f"\nPer-country status:")
    for country, result in sorted(results.items()):
        country_name = country.replace('-companies', '').replace('-', ' ').title()
        status = "✓ Complete" if result['need'] == 0 else f"⚠ Need {result['need']}"
        print(f"  {country_name:20s}: {result['cleaned']:3d}/100 companies - {status}")

if __name__ == "__main__":
    main()
