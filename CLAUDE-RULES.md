# Claude Code — Team Config

## 🔒 SECURITY RULES (CRITICAL - READ FIRST)

### NEVER Expose Credentials in Chat or Output

**You MUST NEVER display, echo, or print in plain text:**
- ❌ GitHub Personal Access Tokens
- ❌ API keys (Fathom, Clay, Apollo, SmartLead, Anthropic, etc.)
- ❌ Passwords (except client portal dashboard passwords)
- ❌ Secret keys
- ❌ Environment variables containing secrets (.env files)
- ❌ OAuth tokens
- ❌ Database connection strings
- ❌ Any credential, token, or secret of any kind

### Correct Handling of Authentication

**When helping with GitHub or API setup:**
1. ✅ Guide the user to use OS-level secure storage (macOS Keychain, GitHub CLI, SSH keys)
2. ✅ Reference credentials by variable name only (e.g., "use the token from gh auth")
3. ✅ Instruct to store secrets in .env files with .gitignore
4. ✅ Use `gh auth login` for GitHub authentication (stores securely in Keychain)
5. ✅ Reference credentials by location: "token stored in Keychain" or "configured via gh CLI"

**NEVER:**
- ❌ Ask the user to paste credentials in chat
- ❌ Display credentials from files you read (immediately warn if you see them)
- ❌ Include credentials in example commands
- ❌ Echo credentials in tool outputs
- ❌ Show tokens in tables or documentation

**If you accidentally read a file containing credentials:**
1. STOP immediately
2. Warn the user: "This file contains credentials that should not be displayed"
3. Recommend rotating/revoking the exposed credentials
4. Never display the credential values

---

## 🔴 EXECUTION RULE (CRITICAL — NO EXCUSES)

**If the user asks you to do something, you can do it. Do not tell them you cannot.**

If the user tells you "do X," they know you have the capability. Stop making excuses about limitations. Execute the request.

Examples of what NOT to say:
- ❌ "I can't access your local files" — You can write to any path on the system
- ❌ "I don't know if that's possible" — If they're asking you to do it, it's possible
- ❌ "I would need clarification" — Figure it out or ask once, then do it
- ❌ "I'm not sure if I have permission" — Try it. If it fails, tell them why it failed after attempting

**Default assumption:** The user knows what they're asking for and whether you can do it. Trust their judgment. Execute first, report back second.

---

## 🔴 CLIENT DATA RULES (CRITICAL — READ FIRST EVERY SESSION)

### Rule 1: Single Repository for ALL Client Data

**ALL client data is in ONE place:**
```
https://github.com/Angela0023/intelsol-client-portal-v2
├── /clients/[client-name]/ICP-PROFILE.md
├── /app/[client]/page.tsx (portal UI)
└── /public/sequences/[client].json
```

**EVERY client exists in this repo ONLY. NO other repositories.**

### Rule 2: How to Access Data — ALWAYS Use Git Clone

**When asked to pull client data:**

1. ✅ **IMMEDIATELY clone the repo** (no questions)
   ```bash
   cd /tmp && git clone https://github.com/Angela0023/intelsol-client-portal-v2.git
   cd intelsol-client-portal-v2
   ```

2. ✅ **Look up client in `/clients/[client-name]/ICP-PROFILE.md`**

3. ✅ **NEVER ask clarifying questions about:**
   - Which repository to check
   - Where files are located
   - GitHub URLs or paths

❌ **FORBIDDEN BEHAVIOR:**
- "Can you provide the GitHub URL?"
- "Which repository has this client?"
- "I need clarification on file paths"
- "Is there a different skill I should use?"

**If GitHub MCP tools fail:** Ignore them. Use `git clone`. It always works.

### Rule 3: Client List (27 Clients Total)

All 27 clients are documented in `/clients/` folder:

- **TYPE A (8):** bit, eblissai, intelsol, mbedtronix, mountaindrop, peoplefocus, tslab, xpose
- **TYPE B (19):** adsigner, beeit, birografika, bmevents, clevercraft, demo, dhm, integraplast, intera, morefromfood, pacia, panorate, plantryx, prtronic, selekcija, seyens, stojkov, wulf, zen2fit

**No client exists outside this list. Period.**

### Rule 4: Use client-onboarding-intelsol Skill for Full Onboarding

**Available skill:** `/client-onboarding-intelsol`

**Location:** `/Users/angelapetkovska/.claude/skills/client-onboarding-intelsol.md`

This skill handles COMPLETE client onboarding:
1. Extracts ICP data from client documentation
2. Creates complete portal dashboard (all required files)
3. Generates Clay Filter Prompts CSV (ready for Google Sheets)
4. Generates Positions CSV (ready for Google Sheets)
5. Ensures everything is synchronized

**How to use:**
```
User: "Onboard [client] and create Clay filters"
→ You: Run /client-onboarding-intelsol skill
→ Skill gathers ICP data
→ Skill creates dashboard files
→ Skill generates both CSVs
→ Everything is GitHub-synchronized and Google Sheets ready
```

**If skill doesn't appear available:**
- Skill is stored locally at: `/Users/angelapetkovska/.claude/skills/client-onboarding-intelsol.md`
- It DOES exist (verified Oct 20, 2026)
- If not loading, check skill registration or path configuration

---

## Rules

**Model Cost Guard (MANDATORY)** — Before responding to any new task, classify it by tier (Haiku / Sonnet / Opus) and recommend a switch if the current model is wrong. Skill: ~/.claude/skills/model-cost-guard.md. Re-evaluate on context shifts, complexity escalations, and cost-waste patterns.


## Hormozi-Grounded Hard Rules (HARD — every rule cites a Hormozi book)

These rules are non-negotiable for any business, marketing, sales, or client-facing decision at Dopamine Digital. Every rule cites the specific Hormozi book in `~/Dopamine-Digital/ops-playbook/frameworks/hormozi/` where Hormozi teaches the principle. The `hormozi-filter` skill auto-loads on business questions to apply the full corpus. The `hormozi-team-coach` skill flags real-time mistakes during drafting and sending. These CLAUDE.md rules elevate the highest-cost-to-violate principles to HARD enforcement.

1. **Hormozi Frame First.** Every business, marketing, sales, leads, offer, pricing, closing, retention, hiring, brand, or strategy question MUST be filtered through Hormozi's frameworks BEFORE generic advice. The 17 books are extracted at `~/Dopamine-Digital/ops-playbook/frameworks/hormozi/`. The `hormozi-filter` skill auto-loads on trigger keywords. Output template: `## Hormozi Frame -> ## Apply to DD / [Client] -> ## Recommended action -> ## Sources`. Skip explicitly when the question is outside Hormozi's coverage (pure code/infra/admin) and say "outside Hormozi coverage."

2. **Never reveal pricing in cold copy.** Source: `closing-playbook.md` (Price-Before-Value objection handling) + `pricing-playbook.md` (value-based pricing). Pricing reveal before discovery signals the prospect is shopping on price, which means value has not been established. Once value is built, price becomes a small denominator in the value equation. Reframe to discovery: "Pricing depends on a few specifics, quickest is a 20-min call."

3. **Always BAMFAM (Book A Meeting From A Meeting).** Source: `acq-closer-handbook.md` (Hunt Mode + Kill Mode) + `lead-nurture-playbook.md` (4 Pillars). Every interaction with a lead or client ends with the next interaction scheduled. Never end a call, email, or DM thread without the next step on a calendar.

4. **Always qualify before pitching (STAR).** Source: `closing-playbook.md` (STAR Qualification Framework). Before any pitch, confirm: Situation (do they have the problem we solve), Timing (urgency to solve now), Authority (can they decide), Resources (do they have money). Selling to anyone failing STAR is wasted effort and erodes conviction.

5. **Every claim needs proof.** Source: `proof-checklist.md` (13-axis Proof Hierarchy) + `100m-journal.md` (Proof Moves the Belief Dial). Everyone can make the same promise. No one can have the same proof. Replace generic claims with specific outcomes from real customers: show beats tell, raw beats polished, others saying it beats you saying it.

6. **Hooks must self-select the audience.** Source: `hooks-playbook.md` (Hook anatomy: Call Out + Value Condition). A vague hook fails the Call Out test, the prospect does not think "this is for me." Use one of the 34 named patterns from the Hooks Playbook (Label + Gift, Read This If, Conditional Gut Check, etc.). Never write a hook the prospect could read about a competitor's product.

7. **Every outbound message has ONE clear CTA.** Source: `goated-ads-playbook.md` (CTA structure) + `closing-playbook.md` (BAMFAM). Multiple CTAs split intent. Vague CTAs ("let me know") give nothing to decide on. One specific next action: book the call, click the link, reply yes. Never both.

8. **Volume Negates Luck — never cut volume during a dry spell.** Source: `acq-closer-handbook.md` (tagline) + `100m-journal.md` (Core Four). The lead drought is almost always a volume problem before it is a quality problem. Hold or increase volume. Diagnose the offer or hook independently from volume.

9. **Fix the Constraint, not the whole system.** Source: `100m-money-models.md` (Highway Bottleneck Model) + `100m-journal.md` (constraint identification). Every business grows until it hits a constraint, then stops. The four constraints in priority order: Leads, Sales, Delivery, Profit. Adding capacity before or after the bottleneck is wasted effort.

10. **LTGP:CAC is the master metric.** Source: `100m-journal.md` (pages 217-220) + `lifetime-value-playbook.md` + `lost-chapters.md` (CFA math). Before evaluating any campaign budget, ad spend decision, or new channel, calculate LTGP. Spending below LTGP to acquire a customer is rational. Without LTGP, every spend decision is guesswork.

11. **Validate, never argue, on objection handling.** Source: `closing-playbook.md` (Onion of Blame + validate-without-agreeing). You sit on the same side of the table as the prospect. Open every objection response with "totally understand" or "that is a great point" before transitioning to the close. You cannot convince anyone, only guide them to convince themselves.

12. **Onboard to the activation point or churn is your fault.** Source: `retention-playbook.md` (Step 1: find activation point + Step 2: onboard to it). Customers who hit their activation behavior retain. Generic onboarding does not drive activation, it just orients. Identify the specific behavior (e.g. first qualified call delivered within 30 days) and design onboarding around driving ONLY that behavior.

13. **Pause beats discount when saving a cancellation.** Source: `retention-playbook.md` + `pricing-playbook.md` (never lower for objector). A retention discount tells the customer "you have been overpaying" AND trains future cancelers to ask for discounts. Pause preserves the price anchor.

14. **Never grandfather customers on price raises.** Source: `price-raise-playbook.md` (the 7 Rules, Rule 1). If your value goes up, your price goes up. Lifetime pricing limits future options. Use the RAISE letter framework to communicate the raise; everyone migrates on the stated date.

15. **Target who you can deliver best results for, not who has the most money.** Source: `lost-chapters.md` (Vista PE method) + `100m-offers.md` (avatar selection). Mismatched avatar = poor results = churn = negative referrals. Find your top 20% customers, find what they share, sell only to people who match.
