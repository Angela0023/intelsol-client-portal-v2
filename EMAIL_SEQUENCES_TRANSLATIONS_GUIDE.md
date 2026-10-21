# Email Sequences - Adding Language Support

## Overview
This guide explains how to add new language translations to email sequences and ensure they display correctly on client dashboards.

## The Issue (and how we fixed it)
**Problem:** Translated emails were in the JSON file but not displaying on the dashboard.

**Root Cause:** The SequencesTab component (the UI that renders email sequences) only recognized specific language keys in TypeScript. When a new language like "slovenian" was added to the JSON, the component had no rendering code for it, so it was ignored.

**Solution:** Update both the JSON data AND the component code to support the new language.

---

## Step-by-Step: Adding a New Language

### Step 1: Update the JSON File
Edit `/public/sequences/[clientname].json` and add translations to each email:

```json
{
  "emailNumber": 1,
  "type": "Initial Outreach",
  "subject": "English subject",
  "body": "English body",
  "translations": {
    "slovenian": {
      "subject": "Slovenian subject",
      "body": "Slovenian body"
    },
    "croatian": {
      "subject": "Croatian subject",
      "body": "Croatian body"
    },
    "german": {
      "subject": "German subject",
      "body": "German body"
    }
  }
}
```

### Step 2: Update SequencesTab Component
File: `/app/components/SequencesTab.tsx`

**2a. Add language key to the Email interface** (around line 12-33):

```typescript
interface Email {
  emailNumber: number;
  type: string;
  subject: string;
  body: string;
  translations?: {
    english?: { subject: string; body: string };
    serbian?: { subject: string; body: string };
    croatian?: { subject: string; body: string };
    slovenian?: { subject: string; body: string };  // ADD THIS LINE
    german?: { subject: string; body: string };
  };
}
```

**2b. Update the condition that shows the "View Translations" menu** (around line 504):

Change from:
```tsx
{!isEditing && email.translations && (email.translations.english || email.translations.serbian || email.translations.croatian || email.translations.german) && (
```

To (add your language):
```tsx
{!isEditing && email.translations && (email.translations.english || email.translations.serbian || email.translations.croatian || email.translations.slovenian || email.translations.german) && (
```

**2c. Update the summary text** (around line 508):

The summary dynamically lists available languages. Update the conditional to include your language:
```tsx
View Translations {email.translations.english && '(English)'}{(email.translations.serbian || email.translations.croatian || email.translations.slovenian) && email.translations.english ? '' : email.translations.serbian || email.translations.croatian || email.translations.slovenian ? `(${[email.translations.serbian && 'Serbian', email.translations.croatian && 'Croatian', email.translations.slovenian && 'Slovenian'].filter(Boolean).join(' & ')})` : ''}{email.translations.german && '(German)'}
```

**2d. Add the rendering section for your language** (insert after Croatian, before German):

```tsx
{/* Slovenian Translation */}
{email.translations.slovenian && (
  <div>
    <p className="text-xs font-semibold text-emerald-700 mb-2 flex items-center">
      <span className="mr-2">🇸🇮</span>
      SLOVENIAN (Slovenščina):
    </p>
    <div className="pl-5 space-y-2">
      <div>
        <p className="text-xs font-medium text-slate-600 mb-1">Subject:</p>
        <p className="text-sm bg-emerald-50 p-2 rounded border border-emerald-200 font-mono">
          {email.translations.slovenian.subject}
        </p>
      </div>
      <div>
        <p className="text-xs font-medium text-slate-600 mb-1">Body:</p>
        <div className="text-sm bg-emerald-50 p-3 rounded border border-emerald-200 font-mono whitespace-pre-wrap">
          {email.translations.slovenian.body}
        </div>
      </div>
    </div>
  </div>
)}
```

### Step 3: Commit and Push
```bash
git add app/components/SequencesTab.tsx public/sequences/[clientname].json
git commit -m "Add [language] language support to SequencesTab component and [client] sequences"
git push origin main
```

### Step 4: Test
1. Hard refresh the dashboard (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
2. Navigate to the client's sequences
3. Click "View Translations" on any email
4. Verify your language appears and displays correctly

---

## Reference: Supported Languages
Currently supported languages in SequencesTab:
- **english** - 🇬🇧 (Green)
- **serbian** - 🇷🇸 (Blue)
- **croatian** - 🇭🇷 (Red)
- **slovenian** - 🇸🇮 (Emerald)
- **german** - 🇩🇪 (Amber)

To add a new language beyond these, follow all steps above and choose an appropriate flag emoji and Tailwind color.

---

## Common Mistakes to Avoid

❌ **Only adding translations to JSON without updating the component**
- The UI won't know the language exists and won't render it

❌ **Adding language to interface but forgetting the rendering section**
- The menu will appear but the language content won't show when expanded

❌ **Not hard-refreshing the browser after deployment**
- Old cached component code will still be used

✅ **Always update both JSON data AND component code together**
✅ **Always hard-refresh browser after pushing changes**
✅ **Test by expanding "View Translations" to verify the language appears**
