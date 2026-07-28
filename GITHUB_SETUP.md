# GitHub-Based File Upload Setup

This portal uses **GitHub** for file storage - completely free, no credit card needed!

## How It Works

- Clients upload files via the Documents tab
- Files are automatically committed to this GitHub repository
- Files stored in `public/uploads/{clientId}/`
- Fully version-controlled with Git history
- No backend costs, no storage limits (up to 5 GB free)

---

## One-Time Setup (5 minutes)

### Step 1: Create GitHub Personal Access Token

You need to create a token that allows the portal to commit files to this repository.

1. **Go to GitHub Settings**
   - Navigate to: https://github.com/settings/tokens
   - Or: GitHub profile → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Generate New Token (Classic)**
   - Click **Generate new token** → **Generate new token (classic)**
   - Note: "Token for intelsol-client-portal uploads"

3. **Configure Token Permissions**
   Select **only** these scopes:
   - ✅ **repo** (Full control of private repositories)
     - This includes: repo:status, repo_deployment, public_repo, repo:invite, security_events

   **Note:** This gives access to commit files to your repositories. Keep this token secure!

4. **Generate and Copy Token**
   - Click **Generate token** at the bottom
   - **IMPORTANT:** Copy the token immediately (you won't see it again!)
   - Format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### Step 2: Add Token to Cloudflare Pages

Now add the token as an environment variable in Cloudflare Pages.

1. **Go to Cloudflare Dashboard**
   - Navigate to: https://dash.cloudflare.com
   - Click **Workers & Pages**
   - Find and click **intelsol-client-portal**

2. **Add Environment Variable**
   - Go to **Settings** tab
   - Scroll to **Environment variables** section
   - Click **Add variables**

3. **Configure Variable**
   - **Variable name:** `GITHUB_TOKEN`
   - **Value:** Paste your token (starts with `ghp_`)
   - **Environment:** Select **Production** (and Preview if you want)
   - Click **Save**

---

### Step 3: Redeploy

After adding the environment variable, trigger a new deployment:

1. Go to **Deployments** tab
2. Click **Retry deployment** on the latest deployment
3. Wait for deployment to complete (~1-2 minutes)

---

### Step 4: Test Upload

1. Visit: https://intelsol.pages.dev/tslab
2. Go to **Documents** tab
3. Click **Upload Document**
4. Select a file and give it a name
5. Click **Upload**
6. File should appear in the list!

**Verify on GitHub:**
- Go to: https://github.com/Angela0023/intelsol-client-portal/tree/main/public/uploads/tslab
- You should see your uploaded file!

---

## How Uploads Work

### Upload Flow

1. Client clicks "Upload Document"
2. Selects file → Modal pops up for custom name
3. Clicks "Upload"
4. File is base64 encoded
5. API commits file to GitHub via GitHub API
6. Metadata saved to `.metadata.json`
7. File appears in list immediately
8. Download button links directly to file

### File Storage

```
public/uploads/
├── tslab/
│   ├── .metadata.json              ← Tracks all files
│   ├── 1722176400000-report.pdf    ← Uploaded file
│   └── 1722180000000-invoice.xlsx  ← Another file
└── intelsol/
    ├── .metadata.json
    └── [files]
```

### Metadata Format

`.metadata.json` contains an array of file objects:

```json
[
  {
    "originalName": "Q2-Report.pdf",
    "customName": "Q2 Financial Report",
    "fileName": "1722176400000-Q2_Financial_Report.pdf",
    "filePath": "public/uploads/tslab/1722176400000-Q2_Financial_Report.pdf",
    "clientId": "tslab",
    "size": 245760,
    "type": "application/pdf",
    "uploadedAt": "2026-07-28T18:30:00.000Z"
  }
]
```

---

## API Endpoints

### Upload File
```
POST /api/upload
Content-Type: multipart/form-data

Body:
- file: File
- name: string (custom display name)
- clientId: string (e.g., "tslab")

Response:
{
  "success": true,
  "fileName": "1722176400000-report.pdf",
  "metadata": { ... }
}
```

### List Files
```
GET /api/files?clientId=tslab

Response:
{
  "success": true,
  "files": [ ... ]
}
```

### Delete File
```
DELETE /api/delete
Content-Type: application/json

Body:
{
  "fileName": "1722176400000-report.pdf",
  "clientId": "tslab"
}

Response:
{
  "success": true,
  "message": "File deleted successfully"
}
```

---

## Troubleshooting

### Error: "GitHub token not configured"

**Cause:** `GITHUB_TOKEN` environment variable not set in Cloudflare Pages

**Fix:**
1. Complete Step 2 above
2. Redeploy (Step 3)

### Error: "GitHub API error: Bad credentials"

**Cause:** Invalid or expired token

**Fix:**
1. Generate a new token (Step 1)
2. Update `GITHUB_TOKEN` in Cloudflare Pages (Step 2)
3. Redeploy

### Error: "Failed to fetch metadata"

**Cause:** `.metadata.json` file doesn't exist or is corrupted

**Fix:**
1. Go to: `public/uploads/{clientId}/`
2. Create/fix `.metadata.json` with: `[]`
3. Commit to GitHub

### Uploads are slow

**Expected:** GitHub API uploads take 2-5 seconds (slower than R2)

**Why:** We're making 2 API calls (file + metadata commit)

**Normal for:**
- Files under 10 MB
- Occasional uploads (not hundreds per day)

### File doesn't appear after upload

**Check:**
1. Browser console for errors (F12 → Console)
2. GitHub repo for the file: `public/uploads/{clientId}/`
3. Cloudflare deployment logs

---

## Limits & Costs

### GitHub Free Tier

- ✅ **5 GB** repository storage (plenty for documents)
- ✅ **100 MB** max file size (enough for most docs/PDFs)
- ✅ **Unlimited** downloads (free bandwidth)
- ✅ **60 API requests/hour** (unauthenticated)
- ✅ **5,000 API requests/hour** (with token)

### Cost: $0.00 Forever

No credit card, no billing, completely free!

---

## Security

1. **Token Security:**
   - Token stored as Cloudflare environment variable (encrypted)
   - Never exposed to client browsers
   - Only accessible by Pages Functions

2. **Access Control:**
   - Only authenticated users (password gate) can upload
   - Files isolated by client directory
   - No cross-client access

3. **Audit Trail:**
   - Every upload creates a Git commit
   - Full history in GitHub
   - Can see who uploaded what and when

4. **File Validation:**
   - File size limits (100 MB max)
   - Filename sanitization
   - No executable files (.exe, .sh, etc.) - configure if needed

---

## Adding Upload to Other Clients

To add file upload to another client page (e.g., Intelsol):

1. **Create metadata file:**
   ```bash
   mkdir -p public/uploads/intelsol
   echo "[]" > public/uploads/intelsol/.metadata.json
   git add public/uploads/intelsol
   git commit -m "Add: Intelsol uploads directory"
   git push
   ```

2. **Add to client page:**
   ```tsx
   import FileUpload from '../components/FileUpload';
   import FileList from '../components/FileList';

   function DocumentsTab() {
     const [refreshTrigger, setRefreshTrigger] = useState(0);

     return (
       <ContentSection title="Documents">
         <FileUpload
           clientId="intelsol"
           onUploadComplete={() => setRefreshTrigger(prev => prev + 1)}
         />
         <FileList clientId="intelsol" refreshTrigger={refreshTrigger} />
       </ContentSection>
     );
   }
   ```

Done!

---

## Maintenance

### Checking Uploaded Files

**Via GitHub:**
- Go to: https://github.com/Angela0023/intelsol-client-portal/tree/main/public/uploads
- Browse by client folder

**Via Git:**
```bash
cd /path/to/intelsol-client-portal
git pull
ls -lh public/uploads/tslab/
```

### Manually Deleting Files

**Option 1: Via Portal** (Recommended)
- Go to Documents tab
- Click delete button

**Option 2: Via GitHub**
- Delete file in web interface
- Update `.metadata.json` to remove entry
- Commit both changes

**Option 3: Via Git**
```bash
rm public/uploads/tslab/FILENAME
# Edit .metadata.json to remove entry
git add .
git commit -m "Remove file"
git push
```

---

Last updated: 2026-07-28
