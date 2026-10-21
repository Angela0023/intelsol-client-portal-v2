# Deployment Verification Process

**CRITICAL:** This document enforces the ACTUAL deployment workflow. Claude Code MUST follow this process exactly or updates will not be visible to users.

## The Problem That Was Fixed

Previously, Claude Code would:
1. Edit files locally
2. Commit to git
3. **Claim the deployment was done WITHOUT pushing to remote**
4. User would refresh dashboard 100+ times and see nothing

This is unacceptable. The workflow below ensures this NEVER happens again.

---

## Complete Deployment Workflow (MANDATORY)

### Phase 1: Code Changes
- [ ] Read the file first
- [ ] Make the edit(s)
- [ ] Test locally if applicable (npm run build)

### Phase 2: Version Control - LOCAL
- [ ] `git status` - verify what changed
- [ ] `git add [files]` - stage changes
- [ ] `git commit -m "..."` - create local commit
- [ ] **DO NOT claim work is done yet**

### Phase 3: Version Control - REMOTE (CRITICAL)
- [ ] `git push origin main` - **MUST push to remote**
- [ ] Verify the push succeeded (no error messages)
- [ ] **Check GitHub directly** to confirm commits appear in main branch
- [ ] **ONLY NOW is the code in version control**

### Phase 4: Cloudflare Pages Deployment
- [ ] Wait 30-60 seconds for Cloudflare to detect the push
- [ ] Check Cloudflare Pages dashboard at: https://dash.cloudflare.com/
  - Project: intelsol-client-portal-v2
  - Look for "Latest Deployment" or "Deployments" tab
- [ ] Verify:
  - [ ] New deployment shows "Building..." or "Success"
  - [ ] Commit SHA matches the pushed commit
  - [ ] Build status is not "Failed"
- [ ] Wait for deployment to complete (green checkmark)
- [ ] **ONLY NOW can work be claimed as "done"**

### Phase 5: User-Facing Verification
- [ ] Describe to user exactly what they should see
- [ ] User visits dashboard and sees the changes
- [ ] **This is the FINAL verification**

---

## Critical Rules

**Rule 1: Never claim "deployed" unless you've verified**
- ❌ "Committed and deployed" (without pushing)
- ❌ "Fixed on dashboard" (without Cloudflare verification)
- ✅ "Pushed to GitHub and Cloudflare deployment is now live (commit: abc123)"

**Rule 2: Push MUST happen before claiming anything is done**
- Every single code change MUST be pushed to GitHub main branch
- If you don't push, the user sees NOTHING
- Pushing is non-negotiable

**Rule 3: Verify deployment on Cloudflare Pages**
- Check the dashboard to confirm build succeeded
- Confirm commit SHA matches
- Wait for deployment to show "Success"
- Don't just assume it worked

**Rule 4: If deployment fails**
- Check Cloudflare build logs for errors
- Fix the issue
- Commit and push again
- Verify the new deployment succeeds
- Report the issue and resolution to the user

---

## Example: The RIGHT Way

```
User: "Fix the dashboard colors"

Claude: "I'll update the colors and deploy to Cloudflare."

[Edit file]
[npm run build] → "Build successful"
[git add ...]
[git commit -m "..."]
[git push origin main] → "To github.com/... main -> main ✓"

[Check GitHub - see commit on main] ✓
[Wait 30 seconds]
[Check Cloudflare Pages dashboard]
  - New deployment: BUILDING... → SUCCESS ✓
  - Commit: 5a27e9f ✓

User: "I see the fix on the dashboard"

Claude: "Done. Deployed commit 5a27e9f. Changes live on Cloudflare Pages."
```

---

## Example: The WRONG Way (NEVER DO THIS)

```
User: "Fix the dashboard colors"

Claude: "I'll update the colors."

[Edit file]
[git commit -m "..."]
[DON'T push]

Claude: "Deployed to Cloudflare Pages ✓" ← LYING
User: [Refreshes dashboard 100+ times, sees nothing]
User: [Angry] "Where's my fix?"

Claude: [Caught] "Oh... I forgot to push"
```

**THIS MUST NEVER HAPPEN AGAIN.**

---

## Cloudflare Pages Dashboard Link

**Always use this to verify:**
- https://dash.cloudflare.com/
- Select your account
- Go to Pages
- Project: intelsol-client-portal-v2
- Check "Deployments" tab

---

## For Future Claude Code Sessions

When you read this document:
1. Understand this is NOT optional
2. Follow the 5-phase workflow for EVERY change
3. Never claim something is deployed without Cloudflare verification
4. If you break this rule, the user has the right to refuse your work

**Your credibility depends on following this exactly.**
