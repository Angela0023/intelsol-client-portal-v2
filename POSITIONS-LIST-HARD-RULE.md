# POSITIONS LIST — HARD RULE FORMAT

**When creating a positions list for ANY client, use this format EXACTLY.**

---

## Column Structure (11 columns total)

```
Title | Type | Position List | List 1 | List 2 | List 3 | List 4 | List 5 | List 6 | List 7 | Notes
```

1. **Title** — Category name (e.g., "Primary Decision Makers", "Secondary Contacts", "Influencers")
2. **Type** — Leave empty (reserved)
3. **Position List** — Comma-separated job title variants (ALL variants in one cell)
4. **List 1-7** — Leave empty (reserved for list-specific targeting)
5. **Notes** — Instructions about targeting, priority order, or conditions

---

## Rules

1. **Do NOT create separate rows for each position.** Group related positions into ONE row with comma-separated titles.

2. **Comma-separate all job title variants in Position List column.** Example:
   ```
   Owner, CEO, Managing Director, Founder, President
   ```
   NOT:
   ```
   Owner
   CEO
   Managing Director
   ```

3. **Notes column must address:**
   - Are all positions targetable across all company sizes? YES or NO
   - Are all positions targetable across all ICP segments? YES or NO
   - If NO to either: specify the rules/restrictions
   - Priority contact order (if applicable)
   - When to use secondary contacts (if applicable)

4. **Keep it simple.** If all positions can be targeted regardless of size/segment:
   ```
   "Target all positions across all company sizes and all segments. [Any specific priority]"
   ```

5. **Always quote Title and Position List** (when they contain commas or special characters).

---

## Template

```csv
Title,Type,Position List,List 1,List 2,List 3,List 4,List 5,List 6,List 7,Notes
"Primary Decision Makers",,"[Comma-separated titles]",,,,,,,,Target all positions across [company sizes] and [segments]. Start with [priority]. [Other rules].
"Secondary Contacts",,"[Comma-separated titles]",,,,,,,,Contact if [condition]. Useful for [reason].
```

---

## Example: Integraplast

```csv
Title,Type,Position List,List 1,List 2,List 3,List 4,List 5,List 6,List 7,Notes
"Primary Decision Makers",,"Owner, CEO, Managing Director, Founder, President, Production Director, Plant Manager, Technical Director, Head of Production, Engineering Manager, Process Manager, Manufacturing Manager, Head of Engineering",,,,,,,,Target all positions across all company sizes (10-500) and all segments. Start with Owner/CEO or Production Director. Engineering Manager is primary champion for technical evaluation.
"Secondary Contacts",,"Procurement Manager, Purchasing Manager, Head of Purchasing, Maintenance Manager, Automation Manager, Automation Engineer, Head of Maintenance",,,,,,,,Contact if primary decision makers don't respond. Both roles useful for supplier qualification and operational fit assessment.
```

---

## File Naming Convention

```
{ClientName}-positions.csv
```

Examples:
- `integraplast-positions.csv`
- `pacia-positions.csv`
- `zen2fit-positions.csv`

---

## Storage Location

All positions lists must be stored in:
```
/clients/{client-name}/
```

Example:
```
/clients/integraplast/integraplast-positions.csv
```

---

## Critical Notes

- **This is a HARD RULE.** Never deviate from this format.
- If you don't know the positions, get them from the client's ICP PROFILE in the ICP documentation.
- If there are NO special targeting rules, state: "Target all positions across all company sizes and all segments."
- Push the file to GitHub immediately after creation.
- The file must follow the exact CSV format (no deviations).

---

**Last Updated:** November 5, 2026
**Status:** HARD RULE — No exceptions
