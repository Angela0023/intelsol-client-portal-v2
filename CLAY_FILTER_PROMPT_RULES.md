# Hard Rules for Clay Filter Prompt Creation

**VALIDATED FRAMEWORK - October 2026**

These 13 rules are distilled from the Intrix CRM ICP project and have been tested against real company data. They are non-negotiable for accurate lead qualification.

---

## **RULE 1: Always Specialize by Business Model Type**

**Do NOT use one generic prompt for all filters.**

- If your ICP targets 3 different business model types (e.g., distributors, manufacturers, integrators), create 3 separate, specialized prompts
- Each prompt must have DIFFERENT RETURN YES and RETURN NO criteria
- Each prompt must have business-model-specific verification checklists
- Failing this rule causes both false positives AND false negatives

---

## **RULE 2: Make Technical/Professional Product Focus a HARD Requirement**

**"B2B" alone is not enough. Always require the technical/industrial/professional qualifier.**

- ❌ WRONG: "B2B distributor" (too vague - accepts consumer wholesalers)
- ✅ CORRECT: "B2B distributor of technical/industrial/professional products"
- This single change eliminated most false positives
- List explicit product categories in your PROMPT section AND ICP Match Prompt

---

## **RULE 3: Invert the Burden of Proof - Missing Data ≠ Non-Fit**

**Add an "Important" section to every prompt that addresses false negatives.**

- Include explicit statements like: "Do not return NO only because [information] cannot be verified publicly"
- State: "Missing public information is not proof that the company lacks [required capability]"
- Phrase: "Return NO only when there is evidence of non-fit, not simply because information is unavailable"
- Without this section, you reject legitimate prospects with poor web presence (false negatives)

---

## **RULE 4: Use Publicly Verifiable Signals**

**What you can verify from public sources, not internal/unverifiable processes:**

**✓ Publicly Verifiable (use these):**
- Website language: "Request a quote," "Technical support," "Solutions for [industry]"
- LinkedIn employee roles: Sales Director, Account Manager, Sales Engineer
- Company description: B2B focus, professional customers, commercial relationships
- Site structure: Dealer/reseller section, partner programs, quotation request forms
- Company registry/industry directory: Business classification, employee count, industry category
- Published case studies, testimonials, customer references

**✗ Internal/Unverifiable (avoid requiring these):**
- "Uses Salesforce/Dynamics" (unverifiable without insider knowledge)
- "Has documented CRM processes" (SMEs rarely publish this)
- "Exact employee count" (many don't disclose)
- "Has [internal team]" (can't verify without calling them)

The point: Use sources that are publicly accessible (website, LinkedIn, registry, industry directories) - not internal knowledge or assumptions.

---

## **RULE 5: Allow Overlapping Business Models When In-Scope**

**Prompts should actively reject business models that are OUTSIDE the ICP, but should allow companies that legitimately operate in multiple relevant business models.**

- If your ICP targets Distributors AND Manufacturers, a company doing both = YES
- If your ICP targets only Distributors, a pure Manufacturer = NO
- If your ICP targets Distributors/Manufacturers/Integrators, a company doing all three = YES
- What gets rejected: Companies operating in business models NOT in the ICP (e.g., pure retail consumer sales when you target B2B)
- The key: Know what's IN your ICP and what's OUT, then allow combinations of IN-scope models

---

## **RULE 6: Maintain Consistency Across Segments/Countries**

**If you create the same filter type for multiple countries/regions, use identical logic.**

- ✅ CORRECT: Row 2 (Croatia Distributor) and Row 5 (Serbia Distributor) have same RETURN YES/NO/Important sections
- ❌ WRONG: Different evaluation criteria between countries for the same business model type
- Only the country reference should differ, not the evaluation logic
- Test this by comparing prompt text across segments - should be 99% identical except geography

---

## **RULE 7: Structure Prompts with Mandatory ICP Qualification Criteria**

**Each prompt must have clear, separated sections with all mandatory ICP qualification criteria:**

1. **RETURN YES if:** (Include each mandatory ICP criterion)
   - Examples: Business model type, product/service focus, sales structure, geographic location, mandatory roles, observable B2B signals, sales process evidence
   - Only include criteria that are actually mandatory in the ICP (roles, industries, geographic location, business model, etc.)

2. **RETURN NO if:** (Include clear rejections of non-fit criteria)
   - What disqualifies a company based on mandatory ICP requirements

3. **Important:** (4-5 statements addressing false negatives)
   - Burden-of-proof inversion statements
   - "Missing data ≠ non-fit" clarifications

4. **For verification, check:** (Checklist of observable signals)
   - Must align with business model type and mandatory ICP criteria

---

## **RULE 8: Test Prompts Against Real Companies BEFORE Deployment**

**Iterate prompts by testing against 10+ real company websites.**

- Evaluate competitors, adjacent markets, edge cases
- Identify false positives (wrong companies marked YES) and false negatives (right companies marked NO)
- False positives = your YES criteria too broad (usually missing "technical" qualifier)
- False negatives = your NO criteria too strict or your Important section insufficient
- Keep iterating until you achieve 10/10 accuracy on test set

---

## **RULE 9: Create 3 Specialized Prompts, Not 6**

**If you have multiple countries/segments of the same business model type:**

- Create 1 prompt per business model type (e.g., 1 Distributor prompt, 1 Manufacturer prompt, 1 Integrator prompt)
- Replicate that prompt across all country/segment variations
- Only modify the geographic reference
- This ensures consistency and reduces maintenance burden

---

## **RULE 10: Verification Checklists Must Match Business Model**

**Generic checklists don't work. Each business model type needs specific checks.**

Example:
- **Distributor checklist:** Check for dealer networks, reseller programs, quotation requests, repeat customer language
- **Manufacturer checklist:** Check for "manufactured by us," own sales team, product specs, case studies
- **Integrator checklist:** Check for "system design," "implementation," "technical services," project language

Don't use the same 5-point checklist for all business model types.

---

## **RULE 11: Always Read the Full ICP Document First**

**Don't create prompts from assumptions.**

- Read the complete ICP profile to understand:
  - What business models are actually in scope
  - What mandatory qualification criteria apply
  - What geographic restrictions exist
  - What observable signals matter
  - What roles are mandatory
- Skipping this leads to generic, inaccurate prompts

---

## **RULE 12: Consistency First, Then Tailoring**

**Work in this sequence:**

1. Create base specialized prompts (one per business model type)
2. Verify consistency across all filter pairs (same logic within type)
3. THEN add country-specific language/search terms
4. Don't mix tailoring with creation or you'll create inconsistencies

---

## **RULE 13: Require Evidence-Based Decisions**

**The prompt should instruct the AI to qualify companies using positive and negative evidence, not assumptions.**

- RETURN YES when there is sufficient positive evidence that the company matches the ICP
- RETURN NO when there is evidence that the company does NOT match the ICP
- Do not infer YES or NO solely from missing information
- Do not infer YES from weak indicators such as company name, broad industry label, or vague "B2B" description
- Do not return NO just because specific details cannot be publicly verified
- The explanation should reference only observable/verifiable evidence from website, LinkedIn, registry, or other reliable public sources

This principle underpins all the prompt improvements we made during iteration.

---

## Testing & Validation

These rules were validated through the Intrix CRM project:
- Tested against 10 real company websites
- Achieved 10/10 accuracy on test set
- Refined through iterative feedback and testing
- Eliminated false positives (Kenty, Dream Point, Ribilio)
- Resolved false negatives (var.hr, eurotrade.hr)

---

## Integration with Client Onboarding Skill

These rules are integrated into the `/client-onboarding-intelsol` skill. When creating Clay Filter prompts for a new client, follow these 13 rules to ensure accuracy and consistency.

---

**Last Updated:** October 26, 2026
**Framework Origin:** Intrix CRM ICP Project
**Testing Status:** Validated & Production Ready
