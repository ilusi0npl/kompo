# Sanity CMS Cleanup - Remove Layout/Styling Fields

## Problem Summary

Current CMS contains **30 layout/styling fields** that don't belong in a CMS:
- Colors (backgroundColor, lineColor, textColor, linkColor)
- Positions (imageStyle, paragraphTops, wordPosition, taglineX)
- Asset paths (logoSrc, wordSvg)
- Layout flags (hasFooter)

**Content completeness**: 97% synchronized between production and CMS (3 upcoming events ✅, 3 archived events ✅)

## Goal

Keep ONLY content in CMS (texts, dates, images, metadata). Move all design values to code.

---

## Fields to Remove (30 total)

### bioProfile (8 fields)
❌ backgroundColor, lineColor, textColor
❌ imageStyle, paragraphTops
❌ hasFooter, logoSrc, order
✅ KEEP: name, image, paragraphs, publishedAt

### homepageSlide (10 fields)
❌ backgroundColor, textColor, lineColor
❌ wordSvg, wordPosition (wordY, wordHeight, wordWidth)
❌ taglineX, logoSrc, order
✅ KEEP: word, tagline, image, publishedAt

### event (1 field)
❌ imageStyle
✅ KEEP: title, date, performers, program, description, location, status, image, publishedAt

### kontaktPage (4 fields)
❌ title, backgroundColor, lineColor, _id (unused)
✅ KEEP: email, teamImage, publishedAt

### fundacjaPage (5 fields)
❌ title, backgroundColor, lineColor, textColor, linkColor
❌ _id (unused)
✅ KEEP: krs, regon, nip, bankAccount, email, projects, accessibilityDeclaration*, publishedAt

### composer (1 field)
❌ order (queried but not displayed)
✅ KEEP: name, year, works, category, publishedAt

### photoAlbum (1 field)
❌ order
✅ KEEP: title, photographer, thumbnail, images, publishedAt

---

## Implementation Steps

### Step 1: Update GROQ Queries (Safe - No Breaking Changes) ✅ DONE

**File**: `src/lib/sanity/queries.js`

Remove layout/styling fields from 8 queries:

```javascript
// bioProfilesQuery (lines 56-70)
// REMOVE: backgroundColor, lineColor, textColor, imageStyle,
//         paragraphTops, hasFooter, order
*[_type == "bioProfile" && defined(publishedAt)] | order(_createdAt asc) {
  _id,
  name,
  "imageUrl": image.asset->url,
  paragraphs
}

// homepageSlidesQuery (lines 112-127)
// REMOVE: backgroundColor, textColor, lineColor, wordSvgUrl,
//         wordPosition, taglineX, logoSrc, order
*[_type == "homepageSlide" && defined(publishedAt)] | order(_createdAt asc) {
  _id,
  word,
  tagline,
  "imageUrl": image.asset->url
}

// upcomingEventsQuery & archivedEventsQuery (lines 14-41)
// REMOVE: imageStyle

// kontaktPageQuery (lines 130-139)
// REMOVE: _id, title, backgroundColor, lineColor
*[_type == "kontaktPage" && defined(publishedAt)][0] {
  email,
  "teamImageUrl": teamImage.asset->url
}

// fundacjaPageQuery (lines 142-159)
// REMOVE: _id, title, backgroundColor, lineColor, textColor, linkColor

// repertuarComposersQuery & specialneComposersQuery (lines 174-193)
// REMOVE: order
```

### Step 2: Update Frontend Transform Functions ✅ DONE

**File**: `src/pages/Homepage/DesktopHomepage.jsx` (lines 23-39)

Replace `transformSanitySlides()` to merge CMS content with hardcoded design:

```javascript
function transformSanitySlides(sanitySlides) {
  return configSlides.map((configSlide, index) => {
    const sanitySlide = sanitySlides[index];
    if (!sanitySlide) return configSlide;

    return {
      ...configSlide, // All design from config (colors, SVGs, positions)
      word: sanitySlide.word,
      tagline: sanitySlide.tagline,
      image: sanitySlide.imageUrl,
    };
  });
}
```

**File**: `src/pages/Bio/DesktopBio.jsx` (lines 22-36)

Update `transformSanityProfiles()`:

```javascript
function transformSanityProfiles(sanityProfiles) {
  return desktopBioSlides.map((configSlide, index) => {
    const sanityProfile = sanityProfiles[index];
    if (!sanityProfile) return configSlide;

    return {
      ...configSlide, // All design from bio-config.js
      name: sanityProfile.name,
      image: sanityProfile.imageUrl,
      paragraphs: sanityProfile.paragraphs,
    };
  });
}
```

**File**: `src/pages/Fundacja/DesktopFundacja.jsx` (lines 47-48)

Remove CMS color usage:

```javascript
// BEFORE
const textColor = USE_SANITY && sanityData ? sanityData.textColor : TEXT_COLOR;
const linkColor = USE_SANITY && sanityData ? sanityData.linkColor : LINK_COLOR;

// AFTER (use hardcoded config values)
const textColor = TEXT_COLOR;
const linkColor = LINK_COLOR;
```

Add to `src/pages/Fundacja/fundacja-config.js`:
```javascript
export const TEXT_COLOR = '#131313';
export const LINK_COLOR = '#761FE0';
```

### Step 3: Test with Sanity Enabled ✅ DONE

```bash
# Update .env
VITE_USE_SANITY=true

# Start dev server
npm run dev

# Manual test checklist:
# ✅ Homepage: 4 slides display, correct colors/design, content from CMS
# ✅ Bio: 4 profiles display, correct colors/design, content from CMS
# ✅ Kalendarz: 3 upcoming events, 3 archived events display correctly
# ✅ Kontakt: Email and team image from CMS, orange/yellow theme
# ✅ Fundacja: Foundation data from CMS, green theme
# ✅ Repertuar: 24 composers display
# ✅ Specialne: 7 composers display
# ✅ Media: Photos and videos display
```

### Step 4: Update Sanity Schemas (Breaking - Do Last) ⏳ PENDING

**Only after frontend tested and deployed.**

**Files to update**:
- `sanity-studio/schemaTypes/bioProfile.ts` - Remove 8 fields
- `sanity-studio/schemaTypes/homepageSlide.ts` - Remove 10 fields
- `sanity-studio/schemaTypes/event.ts` - Remove imageStyle
- `sanity-studio/schemaTypes/kontaktPage.ts` - Remove 4 fields
- `sanity-studio/schemaTypes/fundacjaPage.ts` - Remove 5 fields
- `sanity-studio/schemaTypes/composer.ts` - Remove order
- `sanity-studio/schemaTypes/photoAlbum.ts` - Remove order

Example - `bioProfile.ts` (keep only 4 fields):

```typescript
fields: [
  {
    name: 'name',
    title: 'Nazwa',
    type: 'string',
    validation: (Rule) => Rule.required(),
  },
  {
    name: 'image',
    title: 'Zdjęcie',
    type: 'image',
    options: {hotspot: true},
    validation: (Rule) => Rule.required(),
  },
  {
    name: 'paragraphs',
    title: 'Paragrafy',
    type: 'array',
    of: [{type: 'text'}],
    validation: (Rule) => Rule.required().min(1),
  },
  {
    name: 'publishedAt',
    title: 'Data publikacji',
    type: 'datetime',
  },
]
```

### Step 5: Deploy Schema Changes ⏳ PENDING

```bash
cd sanity-studio
sanity deploy
```

---

## Migration Safety

**Why this is safe**:
1. Frontend code uses dual-mode architecture (`VITE_USE_SANITY` flag)
2. Fallback to hardcoded configs (`*-config.js`) always available
3. Queries updated before schemas (backward compatible)
4. Phased rollout: queries → frontend → schemas

**Rollback plan**:
- If frontend issues: Revert commits, redeploy
- If schema issues: Schemas are additive-safe to revert
- Emergency fallback: Set `VITE_USE_SANITY=false`

---

## Critical Files

**Must modify**:
- `src/lib/sanity/queries.js` - 8 queries updated (30 fields removed) ✅
- `src/pages/Homepage/DesktopHomepage.jsx` - Transform function updated ✅
- `src/pages/Bio/DesktopBio.jsx` - Transform function updated ✅
- `src/pages/Fundacja/DesktopFundacja.jsx` - Remove color usage from CMS ✅
- `src/pages/Fundacja/fundacja-config.js` - Add TEXT_COLOR, LINK_COLOR ✅
- `sanity-studio/schemaTypes/*.ts` - 7 schema files updated ⏳

**Reference (design values)**:
- `src/pages/Homepage/slides-config.js` - Homepage design (colors, SVGs, positions)
- `src/pages/Bio/bio-config.js` - Bio design (colors, imageStyle, positions)
- `src/pages/Kontakt/kontakt-config.js` - Kontakt colors
- `src/pages/Fundacja/fundacja-config.js` - Fundacja colors

---

## Verification

### Pre-cleanup audit

Run in Sanity Vision to export current content:

```groq
*[_type == "bioProfile"] { _id, name, paragraphs, "imageUrl": image.asset->url }
*[_type == "homepageSlide"] { _id, word, tagline, "imageUrl": image.asset->url }
*[_type == "event"] { _id, title, date, description, location, status }
```

### Post-cleanup verification

- Compare pre/post exports to ensure no content loss
- All image URLs still resolve
- All text content intact
- Query response times improved (fewer fields = faster)

---

## Summary

**Removing**: 30 layout/styling fields (45% reduction)
**Keeping**: 37 content fields
**Result**: Clean CMS with only editable content
**Benefit**: Faster queries, clearer separation of concerns, easier CMS editing

**Timeline**: ~17 hours total
**Risk**: LOW (dual-mode architecture provides safety)

---

## Current Status

✅ **Step 1-3 COMPLETED** - Queries, frontend, and testing done
✅ **Deployed to production** - https://kompo-pi.vercel.app/
✅ **CORS configured** - Production can access CMS
⏳ **Step 4-5 PENDING** - Schema cleanup can be done safely now
