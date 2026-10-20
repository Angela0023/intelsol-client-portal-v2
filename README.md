# IntElsol Client Portal

**Live at:** https://intelsol.pages.dev

---

## 🔴 CRITICAL: Single Source of Truth

**ALL client data is in this repository ONLY.**

### Client Data Location
- **Repository:** https://github.com/Angela0023/intelsol-client-portal-v2
- **Folder:** `/clients/[client-name]/`
- **Clients:** bit, eblissai, intelsol, mbedtronix, mountaindrop, peoplefocus, tslab, xpose

### When Claude Needs to Access Client Data

1. **ALWAYS start here:** `https://github.com/Angela0023/intelsol-client-portal-v2`
2. **ALWAYS look in:** `/clients/[client-name]/`
3. **Never ask which repo** — this is the only repo with client data

### What's in `/clients/[client-name]/`
- `ICP-*.md` — ICP profiles and requirements
- `sequences/` — Email sequence definitions
- `clay-filters/` — Clay filter prompts and positions CSVs
- `*.md` files — Documentation, SOPs, call notes
- `*.csv` files — Lead lists and company data

### Portal Application
- **Sequences:** `/public/sequences/[client].json`
- **Tasks:** `/public/tasks/[client].json`
- **Campaigns:** `/public/campaigns/[client].json`
- **UI Components:** `/app/[client]/page.tsx`

---

## Setup & Deployment

**Important:** See `CLAUDE.md` for complete deployment rules and troubleshooting.
