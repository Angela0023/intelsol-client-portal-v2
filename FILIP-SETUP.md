# Filip - IntElsol Client Portal Setup Guide

## 🎯 Your First Task

**Add Seyens email sequences to the portal**

Seyens is a science communication training company. They need their email sequences added to the portal so they can be viewed and managed through the Campaigns & Sequences tab.

---

## 🚨 CRITICAL: Verify You Have Repository Access FIRST

Before starting, verify you can access the repository:

1. **Go to this URL in your browser:**
   ```
   https://github.com/Angela0023/intelsol-client-portal-v2
   ```

2. **What you should see:**
   - ✅ The repository page loads
   - ✅ You can see the code, files, and commit history
   - ✅ You have a "Code" button (green button to clone)

3. **If you see a 404 error or "Repository not found":**
   - **STOP** - You haven't been added as a collaborator yet
   - **Contact Angela** - Ask her to add your GitHub username as a collaborator
   - **Wait for the invitation email** - You'll receive an email from GitHub
   - **Accept the invitation** - Click the link in the email to accept
   - **Then come back to this guide**

---

## 📋 Step-by-Step Setup (Do this ONCE)

### Step 1: Authenticate with GitHub

```bash
# Login to GitHub using gh CLI (this stores credentials in macOS Keychain)
gh auth login

# When prompted, choose:
# - GitHub.com (not Enterprise)
# - HTTPS (not SSH)
# - Yes to authenticate Git with GitHub credentials
# - Login with a web browser (easiest)
```

### Step 2: Verify Authentication

```bash
# This should show your GitHub username
gh auth status

# Expected output:
# ✓ Logged in to github.com as YOUR_USERNAME
```

### Step 3: Clone the Repository

```bash
# Go to your desktop or preferred workspace
cd ~/Desktop

# Clone the repository
git clone https://github.com/Angela0023/intelsol-client-portal-v2.git

# Go into the project folder
cd intelsol-client-portal-v2
```

### Step 4: Install Dependencies

```bash
# Install all required packages
npm install

# This may take 2-3 minutes
```

### Step 5: Verify Setup

```bash
# Build the project to make sure everything works
npm run build

# Expected output:
# ✓ Compiled successfully
# (many lines of output)
# No errors
```

### Step 6: Start Claude Code in This Folder

```bash
# Make sure you're in the project folder
pwd
# Should show: /Users/YOUR_USERNAME/Desktop/intelsol-client-portal-v2

# Open Claude Code in this folder
# (You can use Cmd+Space, type "claude", and open Claude Code)
```

---

## 🔧 How to Work on Tasks

### Your Workflow:

1. **Read the task** - Check what needs to be done
2. **Make changes** - Edit the files
3. **Test locally** - Run `npm run build` to verify no errors
4. **Commit changes** - Save your work to git
5. **Push to GitHub** - Sends changes to the repository
6. **Verify deployment** - Check https://intelsol.pages.dev after 2-3 minutes

### Git Commands You'll Use:

```bash
# Check what files you changed
git status

# See what changed in detail
git diff

# Stage all changes
git add .

# Commit with a message
git commit -m "Add: Seyens email sequences"

# Push to GitHub
git push

# If push fails, pull first then push
git pull --rebase
git push
```

---

## 🎯 Your First Task: Add Seyens Email Sequences

### What You Need to Do:

1. **Create the sequences file:**
   - File location: `/public/sequences/seyens.json`
   - Start with empty array: `[]`
   - You'll populate it with actual sequences

2. **File should look like this:**
   ```json
   [
     {
       "id": "tier-1-senior-scientists",
       "tierName": "TIER 1: Senior Scientists & Lab Heads",
       "tierColor": "blue",
       "targetPersonas": "R&D Directors, Lab Managers, Senior Scientists at biotech/pharma companies with 50-500 employees",
       "messagingAngle": "Visual communication training that helps scientists present research findings more effectively to stakeholders and investors",
       "emails": [
         {
           "emailNumber": 1,
           "type": "Initial Outreach",
           "subject": "Subject line here",
           "body": "Email body here"
         },
         {
           "emailNumber": 2,
           "type": "Follow-Up 1",
           "subject": "Subject line here",
           "body": "Email body here"
         },
         {
           "emailNumber": 3,
           "type": "Follow-Up 2",
           "subject": "Subject line here",
           "body": "Email body here"
         }
       ]
     }
   ]
   ```

3. **Get the actual sequences:**
   - Ask Angela for the Seyens email sequences
   - Or check the Seyens campaign documentation
   - Each sequence needs 3 emails (Initial + 2 follow-ups)

4. **CRITICAL RULE: Only use standard ASCII characters**
   - ✅ Use regular hyphens: `-` (not em dashes: —)
   - ✅ Use regular quotes: `"` (not smart quotes: " ")
   - ✅ Use regular apostrophes: `'` (not smart apostrophes: ')
   - ❌ NO Unicode special characters (they break in email clients)

5. **Test and deploy:**
   ```bash
   # Build to verify no errors
   npm run build

   # Commit and push
   git add public/sequences/seyens.json
   git commit -m "Add: Seyens email sequences"
   git push
   ```

6. **Verify it worked:**
   - Wait 2-3 minutes for Cloudflare Pages to deploy
   - Go to: https://intelsol.pages.dev/seyens
   - Login with password (ask Angela)
   - Click "Campaigns & Sequences" tab
   - You should see the sequences you added

---

## ❌ Common Problems & Solutions

### Problem: "Repository not found" or 404

**Solution:** You haven't been added as a collaborator. Contact Angela.

### Problem: "Permission denied" when pushing

**Solution:**
```bash
# Re-authenticate with GitHub
gh auth login

# Then try pushing again
git push
```

### Problem: "Updates were rejected" when pushing

**Solution:**
```bash
# Pull remote changes first
git pull --rebase

# Then push
git push
```

### Problem: Build fails with errors

**Solution:**
```bash
# Check the error message carefully
# Most common: JSON syntax error (missing comma, extra comma, unclosed quote)
# Fix the error, then run build again
npm run build
```

### Problem: Changes don't appear on live site

**Solution:**
1. Wait 3-5 minutes (deployment takes time)
2. Hard refresh browser: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
3. Check Cloudflare Pages deployment: https://dash.cloudflare.com
4. Verify your commit is in GitHub: https://github.com/Angela0023/intelsol-client-portal-v2/commits/main

---

## 📞 When to Ask for Help

**Ask Angela if:**
- You can't access the repository (404 error)
- You need the Seyens email sequences content
- You need the Seyens login password
- Build fails and you don't understand the error
- Push fails after trying the solutions above

**Ask Claude if:**
- You're not sure how to format the JSON
- You need help with git commands
- You want to verify your changes before pushing
- You need to debug an error message

---

## ✅ Verification Checklist

Before saying "I'm done":

- [ ] Created `/public/sequences/seyens.json` file
- [ ] File contains valid JSON (no syntax errors)
- [ ] Each sequence has 3 emails with subject and body
- [ ] No Unicode characters (em dashes, smart quotes, etc.)
- [ ] Build succeeds locally: `npm run build`
- [ ] Changes committed to git
- [ ] Changes pushed to GitHub
- [ ] Verified on live site: https://intelsol.pages.dev/seyens
- [ ] Sequences appear in "Campaigns & Sequences" tab

---

## 🎓 Important Context

**Repository:** Angela0023/intelsol-client-portal-v2

**GitHub Account:** This repo is under Angela's personal account (Angela0023), NOT the Dopamine Digital organization.

**Authentication:** Use `gh auth login` to authenticate. This stores your credentials in macOS Keychain securely.

**Deployment:** Every push to GitHub automatically deploys to Cloudflare Pages in 2-3 minutes. No manual deployment needed.

**Client:** Seyens = Science communication training for R&D teams at biotech/pharma companies

---

Last updated: 2026-10-15
