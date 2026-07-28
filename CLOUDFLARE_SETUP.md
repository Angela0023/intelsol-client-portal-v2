# Cloudflare R2 & KV Setup for File Uploads

This guide explains how to set up Cloudflare R2 (file storage) and KV (metadata storage) to enable client file uploads on the portal.

## Prerequisites

- Cloudflare account with Pages already set up (you have this)
- Access to Cloudflare Dashboard
- This repository deployed to Cloudflare Pages

---

## Step 1: Create R2 Bucket

### 1.1 Navigate to R2 in Cloudflare Dashboard

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **R2** in the left sidebar
3. Click **Create bucket**

### 1.2 Configure the Bucket

- **Bucket name:** `intelsol-client-documents` (or any name you prefer)
- **Location:** Choose closest to your users (e.g., Automatic)
- Click **Create bucket**

### 1.3 Configure CORS (Optional, if needed for direct uploads)

In the bucket settings:
1. Go to **Settings** tab
2. Scroll to **CORS policy**
3. Add:
```json
[
  {
    "AllowedOrigins": [
      "https://intelsol.pages.dev",
      "https://intelsol.corsyx.com"
    ],
    "AllowedMethods": [
      "GET",
      "PUT"
    ],
    "AllowedHeaders": [
      "*"
    ]
  }
]
```

---

## Step 2: Create KV Namespace

### 2.1 Navigate to Workers KV

1. In Cloudflare Dashboard, click **Workers & Pages**
2. Click **KV** in the top tabs
3. Click **Create namespace**

### 2.2 Configure the Namespace

- **Namespace name:** `DOCUMENT_METADATA`
- Click **Add**

---

## Step 3: Bind R2 and KV to Pages Project

### 3.1 Navigate to Your Pages Project

1. Click **Workers & Pages**
2. Find and click **intelsol-client-portal** (your Pages project)
3. Go to **Settings** tab
4. Scroll to **Functions** section

### 3.2 Add R2 Bucket Binding

1. Under **R2 bucket bindings**, click **Add binding**
2. Configure:
   - **Variable name:** `DOCUMENTS_BUCKET`
   - **R2 bucket:** Select `intelsol-client-documents`
3. Click **Save**

### 3.3 Add KV Namespace Binding

1. Under **KV namespace bindings**, click **Add binding**
2. Configure:
   - **Variable name:** `DOCUMENT_METADATA`
   - **KV namespace:** Select `DOCUMENT_METADATA`
3. Click **Save**

---

## Step 4: Deploy the Changes

After adding the bindings:

1. The next deployment will automatically have access to R2 and KV
2. Push your code to GitHub (if not already done)
3. Cloudflare Pages will auto-deploy

Or manually trigger a deployment:
1. Go to **Deployments** tab in your Pages project
2. Click **Retry deployment** on the latest deployment

---

## Step 5: Test the Upload Feature

### 5.1 Access the Portal

1. Go to https://intelsol.pages.dev/tslab
2. Navigate to the **Documents** tab
3. You should see:
   - "Upload Document" button
   - "No documents uploaded yet" message (initially)

### 5.2 Test Upload

1. Click **Upload Document**
2. Select a file
3. Enter a custom name in the modal
4. Click **Upload**
5. File should appear in the list with download button

### 5.3 Verify in R2

1. Go back to Cloudflare Dashboard → R2
2. Click your bucket
3. You should see: `tslab/[timestamp]-[filename]`

---

## Troubleshooting

### Error: "DOCUMENTS_BUCKET is not defined"

- **Cause:** R2 bucket binding not configured
- **Fix:** Complete Step 3.2 above

### Error: "DOCUMENT_METADATA is not defined"

- **Cause:** KV namespace binding not configured
- **Fix:** Complete Step 3.3 above

### Upload fails silently

- **Check:** Browser console for errors (F12 → Console)
- **Common causes:**
  - Bindings not configured
  - File too large (R2 has limits)
  - CORS issues (check Step 1.3)

### Files don't appear after upload

- **Check:** File list API endpoint `/api/files?clientId=tslab`
- **Verify:** R2 bucket contains files with correct prefix

---

## API Endpoints

The following endpoints are now available:

### Upload File
```
POST /api/upload
Content-Type: multipart/form-data

Body:
- file: File
- name: string (custom name)
- clientId: string (e.g., "tslab")
```

### List Files
```
GET /api/files?clientId=tslab
```

### Download File
```
GET /api/download/[filename]
```

### Delete File
```
DELETE /api/delete
Content-Type: application/json

Body:
{
  "fileName": "tslab/12345-document.pdf"
}
```

---

## Cost Information

### R2 Storage
- **Storage:** $0.015 per GB/month
- **Class A operations (writes):** $4.50 per million requests
- **Class B operations (reads):** $0.36 per million requests
- **Egress:** FREE (no data transfer fees)

### KV
- **Storage:** $0.50 per GB/month
- **Reads:** 10 million included, then $0.50 per million
- **Writes:** 1 million included, then $5.00 per million
- **Deletes:** Free

### Estimated Monthly Cost for Typical Usage
- 100 files (10 MB average): ~$0.02/month
- 1,000 downloads: ~$0.00 (free egress)
- Metadata storage: ~$0.01/month

**Total:** ~$0.03-0.10/month for typical client portal usage

---

## Security Notes

1. **Authentication:** File uploads only work for users who have logged in with the password gate
2. **File Isolation:** Each client's files are stored in separate prefixes (e.g., `tslab/`, `intelsol/`)
3. **No public listing:** Files are not publicly browsable; users must know the exact filename
4. **Deletion:** Only accessible through the portal UI (requires authentication)

---

## Next Steps

Once setup is complete:

1. ✅ Test upload/download functionality
2. ✅ Add upload feature to other client pages (copy DocumentsTab pattern)
3. ✅ Monitor R2 usage in Cloudflare Dashboard
4. ✅ Consider adding file size limits in the upload function if needed

---

Last updated: 2026-07-28
