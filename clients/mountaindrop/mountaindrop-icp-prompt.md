# Mountaindrop ICP Filtering Prompt

**Client:** Mountaindrop
**Purpose:** AI-powered company filtering in Clay to identify multi-brand supplement retailers

---

## Prompt (Use in Clay/Anthropic AI Column)

```
Determine if [COMPANY_NAME] is a good fit for Mountaindrop, a premium Himalayan & Altai Shilajit resin and adaptogen-based wellness brand seeking B2B retail partners.

Return ONLY "YES" or "NO" based on these criteria:

RETURN "NO" IF ANY OF THESE ARE TRUE:

1. Company is a Shilajit producer or brand (direct competitor)

2. Company is a supplement manufacturer or private label production company

3. Company sells exclusively their own private-label products (no third-party brands)

4. Company is not selling to end customers (B2B wholesaler only)

5. Company has no evidence of selling supplements

RETURN "YES" IF ALL OF THESE ARE TRUE:

1. Company is a multi-brand supplement/sports nutrition retailer (physical store and/or webshop)

2. Company sells to end customers (B2C business model)

3. Company's product catalog includes multiple third-party supplement brands

4. No evidence they are already distributing Mountaindrop products

Base your decision on information found on the company website, product catalog, About Us page, and brand portfolio.

Return only: YES or NO
```

---

## Usage Instructions

1. **In Clay:** Create an "Enrich Company" column using Anthropic AI
2. **Input:** Company website URL
3. **Prompt:** Paste the prompt above
4. **Variable:** Replace `[COMPANY_NAME]` with `{{company_name}}` or leave as-is
5. **Output:** Filter table to only show "YES" results
6. **Next Step:** Find people at qualified companies

---

## Target Markets (Reference)

- **Primary:** Croatia, Serbia
- **Secondary:** Germany, Austria, Switzerland (DACH)
- **Expansion:** Wider EU

---

## Expected Results

- **Input:** 100-200 companies from Clay search
- **After AI filter:** 40-80 qualified multi-brand retailers
- **Final leads:** 60-120 decision-makers (owners, purchasing managers, category managers)

---

**Last Updated:** 2026-09-25
