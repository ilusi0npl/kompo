# Event Migration to Sanity CMS

## Overview

This document describes the automated migration of existing hardcoded events from `src/pages/Kalendarz/kalendarz-config.js` to Sanity CMS.

## Migration Script

Location: `scripts/migrate-events.js`

### What it does

1. Reads 3 existing events from the hardcoded config
2. Uploads event images to Sanity Assets API
3. Creates event documents in Sanity with proper schema structure
4. Sets `publishedAt` to current datetime
5. Links images to event documents via references

### Requirements

- Node.js (ES modules support)
- `@sanity/client` package (already installed)
- `SANITY_AUTH_TOKEN` environment variable

## How to Run

### Step 1: Generate Sanity Auth Token

1. Visit: https://www.sanity.io/manage/personal/tokens
2. Click "Create new token"
3. Name: `Kompopolex Migration Script`
4. Permissions: **Editor** (required for creating documents and uploading assets)
5. Copy the token

### Step 2: Set Environment Variable

```bash
export SANITY_AUTH_TOKEN=your_token_here
```

### Step 3: Run Migration

```bash
node scripts/migrate-events.js
```

### Expected Output

```
🚀 Starting event migration to Sanity CMS

Project: cy9ddq1w
Dataset: production
Events to migrate: 3

[1/3] Processing: ENSEMBLE KOMPOPOLEX
  → Uploading image: event1.jpg
  ✓ Image uploaded: image-abc123...
  → Creating event document: ENSEMBLE KOMPOPOLEX
  ✓ Event created: draft.event-xyz456...

[2/3] Processing: SPOŁECZNE KOMPONOWANIE 2025
  → Uploading image: event2.jpg
  ✓ Image uploaded: image-def789...
  → Creating event document: SPOŁECZNE KOMPONOWANIE 2025
  ✓ Event created: draft.event-uvw789...

[3/3] Processing: MIXTUR FESTIVAL
  → Uploading image: event3.jpg
  ✓ Image uploaded: image-ghi012...
  → Creating event document: MIXTUR FESTIVAL
  ✓ Event created: draft.event-rst012...

✅ Migration completed successfully!

Migrated events:
  • ENSEMBLE KOMPOPOLEX (draft.event-xyz456...)
  • SPOŁECZNE KOMPONOWANIE 2025 (draft.event-uvw789...)
  • MIXTUR FESTIVAL (draft.event-rst012...)

📊 Summary:
  Total events: 3
  Images uploaded: 3

🔍 Verify in Sanity Studio:
  1. Open: http://localhost:3333
  2. Navigate to "Event" in left sidebar
  3. Or use Vision with query: *[_type == "event"] | order(date asc)
```

## Verification

### Option 1: Sanity Studio GUI

1. Start Studio: `cd sanity-studio && npm run dev`
2. Open: http://localhost:3333
3. Click "Event" in left sidebar
4. You should see 3 published events

### Option 2: Sanity Vision (GROQ Query)

1. Open Vision tool in Studio
2. Run query:

```groq
*[_type == "event"] | order(date asc) {
  _id,
  title,
  date,
  performers,
  program,
  location,
  status,
  publishedAt,
  "imageUrl": image.asset->url
}
```

### Option 3: CLI Query

```bash
cd sanity-studio
npx sanity documents query '*[_type == "event"]'
```

## Migrated Events

### Event 1: ENSEMBLE KOMPOPOLEX

- **Date**: 2025-12-13T18:00:00
- **Performers**: Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski
- **Location**: ASP WROCŁAW, PL. POLSKI 3/4
- **Image**: event1.jpg (object-fit: cover, object-position: 50% 50%)
- **Status**: Nadchodzące

### Event 2: SPOŁECZNE KOMPONOWANIE 2025

- **Date**: 2025-12-20T18:00:00
- **Performers**: Julia Łabowska, Karolina Kułaga, Oleś Kulczewicz, Szymon Kępczyński, Tymoteusz Lasik
- **Location**: Akademia Muzyczna im. K. Lipińskiego we Wrocławiu
- **Image**: event2.jpg (absolute positioning: width 209.97%, left -33.17%)
- **Status**: Nadchodzące

### Event 3: MIXTUR FESTIVAL

- **Date**: 2026-01-16T20:00:00
- **Program** (6 pieces):
  1. La Monte Young - Composition #10
  2. Marta Śniady - Body X Ultra
  3. Martin A. Hirsti-Kvam - Memory Box #2
  4. Jennifer Walshe - EVERYTHING YOU OWN HAS BEEN TAKEN TO A DEPOT SOMEWHERE
  5. Rafał Ryterski - Breathe
  6. La Monte Young - Composition #13
- **Location**: Nau Bostik, Barcelona
- **Image**: event3.jpg (object-fit: cover, object-position: 50% 50%)
- **Status**: Nadchodzące

## Troubleshooting

### Error: SANITY_AUTH_TOKEN is required

Make sure you've exported the token:
```bash
export SANITY_AUTH_TOKEN=your_token_here
```

### Error: Image not found

Check that images exist:
```bash
ls -lh public/assets/kalendarz/event*.jpg
```

### Error: Permission denied

Ensure your token has **Editor** permissions, not just **Viewer**.

### Script runs but events don't appear in Studio

1. Check if documents were created:
   ```bash
   cd sanity-studio
   npx sanity documents query '*[_type == "event"]'
   ```

2. Ensure `publishedAt` is set (the script does this automatically)

3. Refresh Studio browser window

## Next Steps

After successful migration:

1. **Verify all 3 events in Studio** - Check images, text, dates
2. **Document migration** in `cms-migration-log.md`
3. **Update React components** to fetch from Sanity (Task 11)
4. **Commit changes** with message: "feat: migrate existing events to Sanity CMS"

## Script Details

### Dependencies

```javascript
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
```

### Client Configuration

```javascript
const client = createClient({
  projectId: 'cy9ddq1w',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-01-16',
  token: process.env.SANITY_AUTH_TOKEN,
});
```

### Key Functions

- `uploadImage(imagePath)` - Uploads image file to Sanity Assets
- `createEvent(eventData, imageAsset)` - Creates event document with image reference
- `migrate()` - Main orchestration function

### Document Structure

```javascript
{
  _type: 'event',
  title: string,
  date: datetime (ISO 8601),
  performers: string | undefined,
  program: array | undefined,
  description: text,
  location: text,
  image: {
    _type: 'image',
    asset: { _ref: imageAssetId }
  },
  imageStyle: object,
  status: 'Nadchodzące',
  publishedAt: datetime (ISO 8601)
}
```

## References

- Sanity Client API: https://www.sanity.io/docs/js-client
- Assets API: https://www.sanity.io/docs/http-api-assets
- Image Schema: https://www.sanity.io/docs/image-type
