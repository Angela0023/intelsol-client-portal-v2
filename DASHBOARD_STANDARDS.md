# Dashboard Standards & Rules

## Hard Rule: Last Updated Timestamp on All Data-Driven Tabs

**Effective Date:** October 21, 2026

### Rule Statement

Every tab that displays dynamic data loaded from external sources (JSON files, API responses, databases, or GitHub) **MUST** display a "Last updated" timestamp.

**Format:** `DD/MMM/YY at HH:MM CEST`

**Example:** `Last updated: 21/Oct/26 at 11:32 CEST`

### Rationale

- Provides users with clarity on data freshness
- Critical for understanding when sequences, campaigns, documents, and tasks were last modified
- Eliminates ambiguity about whether displayed information is current
- Builds trust in data accuracy across the dashboard

### Applicability

This rule applies to all data-driven tabs:

| Tab | Component | Status | Notes |
|-----|-----------|--------|-------|
| **Email Sequences** | `SequencesTab.tsx` | ✅ Implemented | Shows timestamp below title |
| **Documents** | `DocumentsTabGeneric.tsx` | ✅ Implemented | Stored in localStorage per client |
| **Tasks** | `TasksTab.tsx` | ⚠️ Pending | Should show when tasks data is loaded |
| **Campaigns (Dynamic)** | `CampaignsTabDynamic.tsx` | ⚠️ Pending | When data is loaded |
| **Performance** | `PerformanceTabDynamic.tsx` | ⚠️ Pending | When metrics are fetched |

**Static tabs** (like ICP Profile, Clay Filters, messaging guidance) do not require timestamps since they are manually curated reference content, not real-time data.

### Implementation Guidelines

#### 1. State Management
```typescript
const [lastUpdated, setLastUpdated] = useState<string | null>(null);
```

#### 2. Timestamp Formatting Function
```typescript
const formatTimestamp = (isoString: string): string => {
  const date = new Date(isoString);
  const day = date.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear().toString().slice(-2);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day}/${month}/${year} at ${hours}:${minutes} CEST`;
};
```

#### 3. Data Fetching & Timestamp Update
When fetching data from an external source (API, JSON file, etc.), immediately set the timestamp:

```typescript
const fetchData = async () => {
  try {
    const response = await fetch(`/api/data/${clientId}`);
    const data = await response.json();

    // Set data
    setData(data.items);

    // Set last updated timestamp
    if (data.lastUpdated) {
      setLastUpdated(formatTimestamp(data.lastUpdated));
    } else {
      // Fallback to current time if API doesn't provide timestamp
      setLastUpdated(formatTimestamp(new Date().toISOString()));
    }
  } catch (err) {
    setError(err.message);
  }
};
```

#### 4. Display in Header
Show the timestamp in the tab header, typically below the tab description:

```typescript
{lastUpdated && (
  <p className="text-xs text-slate-500 mt-2">
    Last updated: {lastUpdated}
  </p>
)}
```

### Timestamp Source Priority

1. **From API/Backend:** If the backend provides a `lastUpdated` field, use that
2. **From localStorage:** If the component updates data locally (e.g., DocumentsTab), store the timestamp in localStorage
3. **Current time:** Use the current system time when data is fetched/loaded

### Client-Specific Application

This rule applies **globally** to all 27 clients without exception:

- **TYPE A:** bit, eblissai, intelsol, mbedtronix, mountaindrop, peoplefocus, tslab, xpose
- **TYPE B:** adsigner, beeit, birografika, bmevents, clevercraft, demo, dhm, integraplast, intera, morefromfood, pacia, panorate, plantryx, prtronic, selekcija, seyens, stojkov, wulf, zen2fit

### Review & Audit

Every code review must check:
- [ ] New data-driven tabs include `lastUpdated` state
- [ ] Timestamp is set when data is fetched/loaded
- [ ] Timestamp is displayed in the correct format
- [ ] Timestamp updates when data is refreshed/saved

### Future Enhancements

Potential improvements for consideration:

1. **Server-side timestamp**: Have the API return `lastUpdated` in the response
2. **Auto-refresh indicator**: Show a spinner if data is being refreshed
3. **Time zone handling**: Store timezone preference per user (currently hardcoded to CEST)
4. **Relative time option**: Display "Updated 5 minutes ago" alongside absolute time

---

**Document Version:** 1.0
**Last Updated:** 21/Oct/26 at 11:32 CEST
**Owner:** Angela Petkovska
**Scope:** intelsol-client-portal-v2 repository
