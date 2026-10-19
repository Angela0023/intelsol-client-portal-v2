# Xpose Solutions - ACTUAL AI Prompt Used in Clay

**Date Used:** 2026-05-13 (with Matej on call)
**Status:** LIVE - This is the actual prompt used in production

---

## THE PROMPT (Matej's Version - Simpler & Cleaner)

```
Determine whether this clinic matches the ICP for Xpose Solutions.

A match should generally be:
- cosmetic dermatology
- aesthetics clinic
- med spa
- injectables clinic
- laser clinic
- skin rejuvenation clinic
- private practice with multiple providers

Not a match if:
- solo practitioner
- medical dermatology only
- hospital system
- no cosmetic services
- outdated clinic

Only use information visible on the website.
```

---

## Why This Version Works Better

**Simpler:**
- No complex formatting requirements
- AI can respond naturally (Yes/No)
- Faster processing

**Clearer Criteria:**
- Bullet points easy to scan
- Clear positive signals
- Clear disqualifiers

**More Flexible:**
- AI can adapt response format
- Less rigid structure
- Focuses on decision (match or not)

---

## How to Use in Clay

1. Add Anthropic AI enrichment column
2. Select model: Claude 3.5 Sonnet
3. Map input: Website URL column
4. Paste prompt above
5. Run on companies

---

## Expected Output

AI will respond with simple analysis:
- "Yes, this is a match. [Reasoning]"
- "No, this is not a match. [Reasoning]"

Then filter table to keep only "Yes" matches.

---

## Comparison to Original Prompt

**Original (my version):**
- Complex structured output
- Required specific format
- More detailed analysis

**Matej's Version (this one):**
- Simple criteria list
- Natural language response
- Faster, cleaner

**Winner:** Matej's version (simpler is better for AI tasks)

---

**Last Updated:** 2026-05-13
