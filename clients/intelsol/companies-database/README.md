# Intelsol Companies Database

This directory contains all companies searched and targeted for Intelsol lead generation campaigns.

## Structure

```
companies-database/
├── README.md                          ← You are here
├── already-targeted.csv               ← Master list of all companies already contacted
├── search-rules.md                    ← Complete search criteria and filters
└── by-country/
    ├── belgium-companies.csv
    ├── netherlands-companies.csv
    ├── germany-companies.csv
    ├── austria-companies.csv
    ├── switzerland-companies.csv
    ├── france-companies.csv
    ├── united-kingdom-companies.csv
    ├── united-states-companies.csv
    ├── sweden-companies.csv
    ├── norway-companies.csv
    ├── denmark-companies.csv
    └── finland-companies.csv
```

## File Formats

### already-targeted.csv
**Columns:**
- Company Name
- Website
- Country
- Industry
- Estimated Employees
- Date Added
- Campaign
- Status (contacted/replied/qualified/not-interested)

**Purpose:** Master deduplication list - prevents re-targeting companies

### by-country/*.csv
**Columns:**
- Company Name
- Website
- Industry
- Location (City, Country)
- Estimated Employees
- Estimated Revenue
- ICP Fit Reason
- Date Added
- Search Batch

**Purpose:** Country-specific lead lists ready for Clay enrichment

## Usage

### Adding New Companies
When new companies are found:
1. Add to appropriate `by-country/[country]-companies.csv`
2. Add to `already-targeted.csv` once contacted

### Before Each Search
1. Pull latest `already-targeted.csv`
2. Filter out any companies already in database
3. Return only new, unique companies

### Target: 100 companies per country

## Countries (12 Total)

**Primary Markets (6):**
- Belgium
- Netherlands
- Germany
- Austria
- Switzerland
- France

**Secondary Markets (6):**
- United Kingdom
- United States
- Sweden
- Norway
- Denmark
- Finland

---

**Last Updated:** 2026-07-13
