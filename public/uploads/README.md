# Uploads Directory

This directory stores client-uploaded files.

## Structure

```
uploads/
├── tslab/              ← TSLab client files
│   ├── .metadata.json  ← File metadata (names, dates, etc.)
│   └── [files]         ← Uploaded files
├── intelsol/           ← Intelsol client files
│   ├── .metadata.json
│   └── [files]
└── [other-clients]/    ← Other client directories
```

## How It Works

- Files are uploaded via the Documents tab on each client page
- Files are committed directly to this GitHub repository
- Metadata is tracked in `.metadata.json` for each client
- Files are served directly from `/uploads/{clientId}/{filename}`

## File Naming

Files are automatically renamed on upload:
- Format: `{timestamp}-{custom-name}.{extension}`
- Example: `1722176400000-quarterly-report.pdf`

This ensures:
- No filename conflicts
- Chronological sorting
- Original custom name preserved in metadata

## Security

- Only authenticated users (password gate) can upload
- Files are isolated by client directory
- Each upload creates a Git commit (full audit trail)

---

**Note:** Do not manually edit `.metadata.json` files - they are managed by the upload system.
