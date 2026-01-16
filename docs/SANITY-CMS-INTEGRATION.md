# Sanity CMS Integration - Kompopolex

## Overview

**Date**: 2026-01-16
**Status**: ✅ **Integration Complete** - Feature flag enabled for gradual rollout
**CMS**: Sanity v3
**Project ID**: `cy9ddq1w`
**Dataset**: `production`

---

## What's Integrated

### ✅ Kalendarz (Events)
- **Schema**: `event.ts`
- **Content**: 3 events migrated
- **Hook**: `useSanityEvents(status)`
- **Component**: `DesktopKalendarz.jsx`
- **Verification**: ✅ 0.00% pixel difference (perfect match)

### ✅ Bio Profiles
- **Schema**: `bioProfile.ts`
- **Content**: 4 profiles migrated
- **Hook**: `useSanityBioProfiles()`
- **Component**: `DesktopBio.jsx`
- **Verification**: ⚠️ Pending image replacement (profiles 2-4 use duplicates)

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Sanity Studio                       │
│         (Content Management Interface)               │
│  https://kompopolex-studio-*.vercel.app             │
└────────────────┬────────────────────────────────────┘
                 │
                 │ (Content API)
                 │
┌────────────────▼────────────────────────────────────┐
│              Sanity CMS (Cloud)                      │
│    Project: cy9ddq1w | Dataset: production          │
│                                                       │
│  Schemas:                                            │
│  ├─ Event (title, date, location, image, etc.)     │
│  ├─ BioProfile (name, colors, image, paragraphs)   │
│  └─ Media (future)                                  │
└────────────────┬────────────────────────────────────┘
                 │
                 │ (GROQ Queries)
                 │
┌────────────────▼────────────────────────────────────┐
│          Frontend (React + Vite)                     │
│                                                       │
│  Feature Flag: VITE_USE_SANITY                      │
│  ├─ true  → Fetch from Sanity CMS                  │
│  └─ false → Use local config files (default)       │
│                                                       │
│  Hooks:                                              │
│  ├─ useSanityEvents(status)                        │
│  └─ useSanityBioProfiles()                         │
│                                                       │
│  Components:                                         │
│  ├─ DesktopKalendarz.jsx                           │
│  └─ DesktopBio.jsx                                 │
└─────────────────────────────────────────────────────┘
```

---

## Feature Flag

### Environment Variable

```bash
# .env
VITE_USE_SANITY=false  # Default: use local configs
VITE_USE_SANITY=true   # Enable Sanity CMS
```

### How It Works

**When `VITE_USE_SANITY=false`** (Current Default):
- ✅ Uses local config files (`kalendarz-config.js`, `bio-config.js`)
- ✅ No API calls to Sanity
- ✅ Production-ready, pixel-perfect
- ✅ Works offline

**When `VITE_USE_SANITY=true`**:
- ✅ Fetches content from Sanity CMS
- ✅ Loading states displayed
- ✅ Error handling implemented
- ⚠️ Bio profiles show duplicate images (profiles 2-4)

### Testing Locally

```bash
# Test with Sanity OFF (default)
npm run dev

# Test with Sanity ON
# 1. Set VITE_USE_SANITY=true in .env
# 2. Restart dev server
npm run dev
```

---

## Sanity Studio

### Access

**URL**: https://kompopolex-studio-ggdfw5rmh-ilusi0npls-projects.vercel.app

**Login**: Uses your Sanity account (OAuth)

### Managing Content

#### Events
1. Navigate to "Wydarzenia" (Events)
2. Create/Edit/Delete events
3. Upload images
4. Set status: "upcoming" or "archived"
5. Publish changes

#### Bio Profiles
1. Navigate to "Profile Bio"
2. Edit existing profiles (4 total)
3. Upload images (⚠️ profiles 2-4 need replacement)
4. Adjust colors, text, positioning
5. Publish changes

---

## Schemas

### Event Schema

**File**: `sanity-studio/schemaTypes/event.ts`

```typescript
{
  name: 'event',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', required },
    { name: 'date', type: 'datetime', required },
    { name: 'location', type: 'string', required },
    { name: 'description', type: 'text', required },
    { name: 'performers', type: 'string' },
    { name: 'program', type: 'array', of: [{ type: 'string' }] },
    { name: 'image', type: 'image', required },
    { name: 'imageStyle', type: 'object' },
    { name: 'status', type: 'string', options: ['upcoming', 'archived'] },
    { name: 'publishedAt', type: 'datetime' }
  ]
}
```

### BioProfile Schema

**File**: `sanity-studio/schemaTypes/bioProfile.ts`

```typescript
{
  name: 'bioProfile',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', required },
    { name: 'order', type: 'number', required },
    { name: 'backgroundColor', type: 'color', required },
    { name: 'lineColor', type: 'color', required },
    { name: 'textColor', type: 'color', required },
    { name: 'image', type: 'image', required },
    { name: 'imageStyle', type: 'object' },
    { name: 'paragraphs', type: 'array', of: [{ type: 'text' }] },
    { name: 'paragraphTops', type: 'array', of: [{ type: 'number' }] },
    { name: 'hasFooter', type: 'boolean' },
    { name: 'publishedAt', type: 'datetime' }
  ]
}
```

---

## GROQ Queries

**File**: `src/lib/sanity/queries.js`

### Upcoming Events
```groq
*[_type == "event" && status == "upcoming" && defined(publishedAt)]
| order(date asc) {
  _id,
  title,
  date,
  performers,
  program,
  description,
  location,
  "imageUrl": image.asset->url,
  imageStyle
}
```

### Bio Profiles
```groq
*[_type == "bioProfile" && defined(publishedAt)]
| order(order asc) {
  _id,
  name,
  order,
  "backgroundColor": backgroundColor.hex,
  "lineColor": lineColor.hex,
  "textColor": textColor.hex,
  "imageUrl": image.asset->url,
  imageStyle,
  paragraphs,
  paragraphTops,
  hasFooter
}
```

---

## Migration Scripts

### Migrate Events

**Script**: `scripts/migrate-events.js`

```bash
node scripts/migrate-events.js
```

**What it does**:
- Reads event data from `kalendarz-config.js`
- Uploads images to Sanity CDN
- Creates event documents in Sanity
- Prevents duplicates (checks by title)
- Handles errors per-event (continues if one fails)

**Output**: 3 events created in Sanity

### Migrate Bio Profiles

**Script**: `scripts/migrate-bio-profiles.js`

```bash
node scripts/migrate-bio-profiles.js
```

**What it does**:
- Reads profile data from `bio-config.js`
- Uploads images to Sanity CDN
- Creates bioProfile documents in Sanity
- Converts hex colors to Sanity color format
- Prevents duplicates (checks by name)

**Output**: 4 profiles created in Sanity

⚠️ **Known Issue**: Profiles 2-4 use identical source images (placeholders)

### Verification Scripts

**Events**: `scripts/verify-migration.js`
**Bio**: `scripts/verify-bio-migration.js`

```bash
node scripts/verify-migration.js
node scripts/verify-bio-migration.js
```

Fetches data from Sanity and displays for manual verification.

---

## React Hooks

### useSanityEvents

**File**: `src/hooks/useSanityEvents.js`

```javascript
import { useSanityEvents } from '../../hooks/useSanityEvents'

const { events, loading, error } = useSanityEvents('upcoming')
// or
const { events, loading, error } = useSanityEvents('archived')
```

**Returns**:
- `events`: Array of event objects
- `loading`: Boolean (true while fetching)
- `error`: Error object if fetch fails

### useSanityBioProfiles

**File**: `src/hooks/useSanityBioProfiles.js`

```javascript
import { useSanityBioProfiles } from '../../hooks/useSanityBioProfiles'

const { profiles, loading, error } = useSanityBioProfiles()
```

**Returns**:
- `profiles`: Array of profile objects (ordered by `order` field)
- `loading`: Boolean (true while fetching)
- `error`: Error object if fetch fails

---

## Frontend Integration

### DesktopKalendarz.jsx

**Changes**:
1. Added feature flag check (`USE_SANITY`)
2. Integrated `useSanityEvents('upcoming')` hook
3. Conditional data source (Sanity vs config)
4. Loading state UI
5. Error state UI
6. Date formatting helper (`formatEventDate`)
7. Image URL compatibility (`event.image || event.imageUrl`)

**Data Flow**:
```
VITE_USE_SANITY=false → kalendarz-config.js → events array
VITE_USE_SANITY=true  → Sanity CMS → useSanityEvents() → events array
```

### DesktopBio.jsx

**Changes**:
1. Added feature flag check (`USE_SANITY`)
2. Integrated `useSanityBioProfiles()` hook
3. Data transformation (`transformSanityProfiles`)
4. Conditional data source (Sanity vs config)
5. Loading state UI
6. Error state UI
7. Bypasses translations when using Sanity (uses direct text)

**Data Flow**:
```
VITE_USE_SANITY=false → bio-config.js → slides array → i18n translations
VITE_USE_SANITY=true  → Sanity CMS → useSanityBioProfiles() → slides array → direct text
```

---

## Verification Reports

### Events (Kalendarz)

**Report**: `docs/sanity-content-review-2026-01-16.md`

**Result**: ✅ **PASS** - 100% data integrity
- All 3 events migrated correctly
- All fields match production config
- Images uploaded to CDN
- Polish characters preserved
- Visual verification: 0.00% pixel difference

### Bio Profiles

**Report**: `docs/sanity-bio-review-2026-01-16.md`

**Result**: ⚠️ **PARTIAL** - 100% data integrity, duplicate images

- All 4 profiles migrated correctly
- All text, colors, positioning match
- Images uploaded to CDN
- ⚠️ **Known Issue**: Profiles 2-4 use identical placeholder images

**Verification Notes**: `docs/bio-verification-notes-2026-01-16.md`

---

## Known Issues

### 1. Duplicate Bio Images (Profiles 2-4)

**Issue**: `bio2-aleksandra`, `bio3-rafal`, `bio4-jacek` use identical source images

**Evidence**:
```bash
$ md5sum public/assets/bio/bio{2,3,4}-*.jpg
ebe85f802958856a86186713280b29d5  bio2-aleksandra.jpg
ebe85f802958856a86186713280b29d5  bio3-rafal.jpg
ebe85f802958856a86186713280b29d5  bio4-jacek.jpg
```

**Impact**: Frontend displays same image for 3 different people

**Severity**: Medium (functionality works, visual only)

**Fix**:
1. Get real individual photos
2. Replace source files
3. Delete old profiles in Sanity Studio
4. Re-run: `node scripts/migrate-bio-profiles.js`

---

## Production Deployment

### Prerequisites

- [x] ✅ Sanity Studio deployed
- [x] ✅ Schemas deployed
- [x] ✅ Content migrated (events + bio profiles)
- [x] ✅ Frontend integration complete
- [x] ✅ Feature flag implemented
- [x] ✅ Visual verification (Kalendarz: perfect)
- [ ] ⏳ Visual verification (Bio: pending image fix)

### Deployment Steps

#### Option A: Gradual Rollout (Recommended)

1. **Deploy with flag OFF** (current state):
   ```bash
   # .env
   VITE_USE_SANITY=false
   ```
   Deploy to Vercel → Uses local configs

2. **Test Sanity in staging**:
   - Create staging environment with `VITE_USE_SANITY=true`
   - Verify all pages load correctly
   - Check images, text, colors

3. **Fix Bio images**:
   - Replace placeholder images (profiles 2-4)
   - Re-migrate bio profiles
   - Verify visually

4. **Enable flag in production**:
   ```bash
   # Vercel Environment Variables
   VITE_USE_SANITY=true
   ```
   Redeploy → Now uses Sanity CMS

5. **Remove old configs** (after 100% verification):
   - Delete `kalendarz-config.js`
   - Delete `bio-config.js`
   - Remove feature flag code
   - Remove translation files (if using Sanity text directly)

#### Option B: Immediate Cutover (Not Recommended)

1. Set `VITE_USE_SANITY=true` in production immediately
2. Accept duplicate Bio images temporarily
3. Fix images in Sanity Studio after deployment

---

## Environment Variables

### Required for Frontend

```bash
# .env
VITE_SANITY_PROJECT_ID=cy9ddq1w
VITE_SANITY_DATASET=production
VITE_USE_SANITY=false  # Feature flag
```

### Required for Scripts

```bash
# .env
SANITY_AUTH_TOKEN=sk...  # Token with write access
```

**⚠️ Security**: Never commit `.env` to git. Use `.env.example` for documentation.

---

## File Structure

```
kompo/
├── sanity-studio/               # Sanity Studio app
│   ├── sanity.config.ts        # Studio config
│   ├── schemaTypes/            # Content schemas
│   │   ├── event.ts           # Event schema
│   │   ├── bioProfile.ts      # Bio profile schema
│   │   └── media.ts           # Media schema (unused)
│   └── package.json
│
├── src/
│   ├── lib/sanity/
│   │   ├── client.js          # Sanity client config
│   │   └── queries.js         # GROQ queries
│   │
│   ├── hooks/
│   │   ├── useSanityEvents.js        # Events hook
│   │   └── useSanityBioProfiles.js   # Bio profiles hook
│   │
│   └── pages/
│       ├── Kalendarz/
│       │   ├── DesktopKalendarz.jsx  # Integrated
│       │   └── kalendarz-config.js   # Old config (fallback)
│       │
│       └── Bio/
│           ├── DesktopBio.jsx        # Integrated
│           └── bio-config.js         # Old config (fallback)
│
├── scripts/
│   ├── migrate-events.js          # Migrate events to Sanity
│   ├── migrate-bio-profiles.js    # Migrate profiles to Sanity
│   ├── verify-migration.js        # Verify events
│   └── verify-bio-migration.js    # Verify profiles
│
├── docs/
│   ├── SANITY-CMS-INTEGRATION.md      # This file
│   ├── MIGRATION.md                   # Migration guide
│   ├── sanity-content-review-2026-01-16.md        # Events review
│   ├── sanity-bio-review-2026-01-16.md            # Bio review
│   └── bio-verification-notes-2026-01-16.md       # Bio notes
│
└── .env
    VITE_SANITY_PROJECT_ID=cy9ddq1w
    VITE_SANITY_DATASET=production
    VITE_USE_SANITY=false
    SANITY_AUTH_TOKEN=sk...
```

---

## Maintenance

### Adding New Events

**Via Sanity Studio**:
1. Go to Studio → "Wydarzenia"
2. Click "Create new Event"
3. Fill in fields
4. Upload image
5. Set status: "upcoming"
6. Publish

**Changes appear immediately** when `VITE_USE_SANITY=true`

### Editing Bio Profiles

**Via Sanity Studio**:
1. Go to Studio → "Profile Bio"
2. Click on profile to edit
3. Modify text, colors, or image
4. Publish changes

**Changes appear immediately** when `VITE_USE_SANITY=true`

### Updating Schemas

1. Edit schema file: `sanity-studio/schemaTypes/*.ts`
2. Deploy Studio:
   ```bash
   cd sanity-studio
   npm run deploy
   ```
3. Update frontend queries if needed

---

## Troubleshooting

### "Failed to fetch events/profiles"

**Cause**: Sanity client cannot connect

**Fixes**:
- Check internet connection
- Verify `VITE_SANITY_PROJECT_ID` is correct
- Check Sanity project is active (not deleted)
- Verify CORS settings in Sanity project

### Images not loading

**Cause**: CDN URL incorrect or blocked

**Fixes**:
- Check image uploaded to Sanity Studio
- Verify image URL in query: `image.asset->url`
- Check browser console for CORS errors

### Changes not appearing

**Cause**: Using cached data or flag is OFF

**Fixes**:
- Hard refresh browser (Ctrl+Shift+R)
- Check `VITE_USE_SANITY=true` in .env
- Restart dev server
- Check `publishedAt` field is set in Sanity

---

## Future Work

### Phase 1: Current Integration ✅
- [x] Event schema and migration
- [x] Bio profile schema and migration
- [x] Frontend hooks
- [x] Component integration
- [x] Feature flag
- [x] Visual verification (Kalendarz)

### Phase 2: Image Fixes ⏳
- [ ] Get real photos for profiles 2-4
- [ ] Re-migrate bio profiles
- [ ] Full visual verification (Bio)

### Phase 3: Production Cutover
- [ ] Deploy with Sanity ON
- [ ] Monitor for issues
- [ ] Remove feature flag
- [ ] Delete old config files

### Phase 4: Additional Features
- [ ] Media items (gallery)
- [ ] Archive page for past events
- [ ] Preview/draft mode
- [ ] Scheduled publishing
- [ ] Multi-language content
- [ ] SEO fields (meta descriptions, etc.)

---

## Support

### Documentation
- This file: `docs/SANITY-CMS-INTEGRATION.md`
- Sanity docs: https://www.sanity.io/docs
- GROQ docs: https://www.sanity.io/docs/groq

### Issues
- Check verification reports in `docs/`
- Review migration logs
- Test with feature flag OFF/ON
- Check browser console for errors

### Contact
- Sanity Support: https://www.sanity.io/support
- Project maintainer: [Your contact]

---

**Document Version**: 1.0
**Last Updated**: 2026-01-16
**Author**: Claude Sonnet 4.5
