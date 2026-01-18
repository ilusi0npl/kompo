# KOMPOPOLEX - Project-Specific Documentation

> **Parent Documentation:** See [CLAUDE.md](./CLAUDE.md) for generic patterns and workflows.

This document contains Kompopolex-specific implementation details, design specifications, and configuration.

---

## Project Overview

**Project Name:** Kompopolex Website
**Figma File:** [Kompopolex-www-MATYLDA](https://www.figma.com/design/16wGmQvLEJ5vSIrSzL8muo/Kompopolex-www-MATYLDA)
**Tech Stack:** React 18 + Vite + Tailwind CSS 4 + React Router v7 + Sanity CMS v3

---

## Design Specifications

### Responsive Configuration

```jsx
// src/components/ResponsiveWrapper/ResponsiveWrapper.jsx
const DESKTOP_WIDTH = 1440;  // From Figma desktop designs
const MOBILE_WIDTH = 390;    // From Figma mobile designs
const BREAKPOINT = 768;      // Switch desktop/mobile
```

### Color Palette

| Color Name | Hex | Usage |
|-----------|-----|-------|
| Background | `#FDFDFD` | Main background (Homepage, Bio1, Kalendarz) |
| Text | `#131313` | Primary text color |
| Lines | `#A0E38A` | Decorative vertical lines (Homepage) |
| Bio2 BG | `#FF734C` | Aleksandra background |
| Bio2 Line | `#FFBD19` | Aleksandra line color |
| Bio3 BG | `#34B898` | Rafał background |
| Bio3 Line | `#01936F` | Rafał line color |
| Bio4 BG | `#73A1FE` | Jacek background |
| Bio4 Line | `#3478FF` | Jacek line color |

### Typography

**Font Family:** IBM Plex Mono
**Files:** `public/fonts/ibm-plex-mono/*.woff2`
**Weights:** Regular (400), Medium (500), SemiBold (600), Bold (700)
**Definitions:** `src/index.css` (@font-face)

### Decorative Lines

**Desktop (1440px):** x-positions = 155, 375, 595, 815, 1035, 1255
**Mobile (390px):** x-positions = 97, 195, 292

**Implementation:** `src/components/BackgroundLines/BackgroundLines.jsx`

---

## Pages Implementation

### 1. Homepage

**Figma Design:**
- Desktop: [node 9-301](https://www.figma.com/design/16wGmQvLEJ5vSIrSzL8muo/Kompopolex-www-MATYLDA?node-id=9-301) - 1440 x 700 px
- Mobile: [node 71-470](https://www.figma.com/design/16wGmQvLEJ5vSIrSzL8muo/Kompopolex-www-MATYLDA?node-id=71-470) - 390 x 683 px

**Files:**
```
src/pages/Homepage/
├── index.jsx              # ResponsiveWrapper
├── DesktopHomepage.jsx    # Desktop layout (1440px)
└── MobileHomepage.jsx     # Mobile layout (390px)
```

**Assets:**
```
public/assets/
├── logo.svg               # Logo desktop
├── logo-white.svg         # Logo white variant
├── hero-photo.webp        # Hero image (174KB)
└── slides/
    ├── trio.svg
    ├── kompo.svg
    ├── polex.svg
    └── ensemble.svg

public/assets/mobile/
├── logo.svg
├── hero-photo.jpg         # Mobile hero (90KB)
└── trio.svg
```

**Features:**
- 4 rotating slides: Trio, Kompo, Polex, Ensemble
- Sanity CMS integration: `useSanityHomepageSlides()`
- Background decorative lines
- Bilingual word/tagline per slide

**Verification:**
```bash
make verify-section SECTION=hero SECTIONS_CONFIG=scripts_project/sections-config.json
```
**Last Result:** 1.59% diff ✅ PASSED (threshold ≤8%)

---

### 2. Bio

**Figma Design:**
- Bio1 (Ensemble): [node 9-449](https://www.figma.com/design/16wGmQvLEJ5vSIrSzL8muo/Kompopolex-www-MATYLDA?node-id=9-449) - 1440 x 700 px
- Bio2 (Aleksandra): [node 10-903](https://www.figma.com/design/16wGmQvLEJ5vSIrSzL8muo/Kompopolex-www-MATYLDA?node-id=10-903) - 1440 x 700 px
- Bio3 (Rafał): [node 10-611](https://www.figma.com/design/16wGmQvLEJ5vSIrSzL8muo/Kompopolex-www-MATYLDA?node-id=10-611) - 1440 x 700 px
- Bio4 (Jacek): [node 10-642](https://www.figma.com/design/16wGmQvLEJ5vSIrSzL8muo/Kompopolex-www-MATYLDA?node-id=10-642) - 1440 x 700 px

**Files:**
```
src/pages/Bio/
├── index.jsx           # ResponsiveWrapper
├── DesktopBio.jsx      # Desktop layout
└── MobileBio.jsx       # Mobile layout
```

**Assets:**
```
public/assets/bio/
├── bio1-ensemble.jpg   # Profile photo
├── bio2-aleksandra.jpg
├── bio3-rafal.jpg
├── bio4-jacek.jpg
└── bio-text.svg        # "Bio." text (49x107px)
```

**Slide Colors:**

| Slide | Background | Line Color | Text |
|-------|-----------|------------|------|
| Bio1 (Ensemble) | #FDFDFD | #A0E38A | #131313 |
| Bio2 (Aleksandra) | #FF734C | #FFBD19 | #131313 |
| Bio3 (Rafał) | #34B898 | #01936F | #131313 |
| Bio4 (Jacek) | #73A1FE | #3478FF | #131313 |

**Image Positioning (300x460px container):**

```javascript
// Bio1 - object-cover centered
imageStyle: { width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 50%' }

// Bio2 - Aleksandra
imageStyle: { width: '342.5%', height: '159.57%', left: '0.75%', top: '-28.91%' }

// Bio3 - Rafał
imageStyle: { width: '330.37%', height: '153.91%', left: '-101.18%', top: '-13.7%' }

// Bio4 - Jacek
imageStyle: { width: '301.44%', height: '140.43%', left: '-198.05%', top: '-0.22%' }
```

**Features:**
- 4 profiles with slideshow navigation
- Each profile has unique colors
- Dynamic text paragraphs with custom positioning
- Footer only on Bio4 (Jacek)
- Sanity CMS: `useSanityBioProfiles()`

**Verification Results:**

| Section | Diff | Status |
|---------|------|--------|
| bio1-ensemble | 3.77% | ✅ PASSED |
| bio2-aleksandra | 2.86% | ✅ PASSED |
| bio3-rafal | 3.55% | ✅ PASSED |
| bio4-jacek | 5.76% | ✅ PASSED |

---

### 3. Kalendarz (Events)

**Figma Design:**
- Desktop: [node 19-49](https://www.figma.com/design/16wGmQvLEJ5vSIrSzL8muo/Kompopolex-www-MATYLDA?node-id=19-49) - 1440 x 2047 px

**Files:**
```
src/pages/Kalendarz/
├── index.jsx              # ResponsiveWrapper
├── DesktopKalendarz.jsx   # Desktop layout
└── MobileKalendarz.jsx    # Mobile layout (if exists)
```

**Assets:**
```
public/assets/kalendarz/
├── event1.jpg             # Event photos
├── event2.jpg
├── event3.jpg
└── place-icon.svg         # Location icon
```

**Layout Elements:**
1. Background decorative lines (x = 155, 375, 595, 815, 1035, 1255)
2. Logo - position: left: 185px, top: 60px
3. "Kalendarz" rotated text (-90°) - position: left: 94px, top: 275px
4. Tab navigation: "Nadchodzące" / "Archiwalne" - left: 185px, top: 190px
5. Event cards: 3 events with image (330x462px), date, title, performers, description, location
6. Footer - centered at bottom
7. Menu navigation - right side, left: 1265px, top: 60px

**Sample Events:**

| Event | Title | Date | Location |
|-------|-------|------|----------|
| 1 | ENSEMBLE KOMPOPOLEX | 13.12.25 18:00 | ASP WROCŁAW |
| 2 | SPOŁECZNE KOMPONOWANIE 2025 | 20.12.25 18:00 | Akademia Muzyczna |
| 3 | MIXTUR FESTIVAL | 16.01.26 20:00 | NAU BOSTIK, BARCELONA |

**Features:**
- Tab switching: Upcoming / Archived events
- Ticket purchase button (if available)
- Partner logos display
- Sanity CMS: `useSanityEvents()` (upcoming), `useSanityEvent()` (single event detail)

**Verification:**
```bash
make verify-section SECTION=kalendarz SECTIONS_CONFIG=scripts_project/sections-config.json
```
**Last Result:** 2.82% diff ✅ PASSED

---

### 4. Archiwalne (Archived Events)

**Files:**
```
src/pages/Archiwalne/
├── index.jsx              # ResponsiveWrapper
├── DesktopArchiwalne.jsx  # Desktop layout
└── MobileArchiwalne.jsx   # Mobile layout
```

**Assets:**
```
public/assets/archiwalne/
└── [event-photos].jpg     # Various archived event photos
```

**Features:**
- Grid layout of past events
- Same event card style as Kalendarz
- Sanity CMS: Uses `archivedEventsQuery` from `src/lib/sanity/queries.js`

---

### 5. Kontakt (Contact)

**Files:**
```
src/pages/Kontakt/
├── index.jsx           # ResponsiveWrapper
├── DesktopKontakt.jsx  # Desktop layout
└── MobileKontakt.jsx   # Mobile layout
```

**Assets:**
```
public/assets/kontakt/
└── team-photo.jpg      # Team photo (11.5MB)
```

**Features:**
- Email display: KOMPOPOLEX@GMAIL.COM
- Large team photo
- Social media links (Instagram, Facebook, YouTube)
- Sanity CMS: `useSanityKontaktPage()` (singleton)

---

### 6. Fundacja (Foundation)

**Files:**
```
src/pages/Fundacja/
├── index.jsx            # ResponsiveWrapper
├── DesktopFundacja.jsx  # Desktop layout
└── MobileFundacja.jsx   # Mobile layout
```

**Assets:**
```
public/assets/fundacja/
└── [project-images].jpg  # Project photos
```

**Features:**
- Foundation data: KRS, REGON, NIP, bank account
- 3 projects with descriptions (optional links)
- Accessibility declaration (bilingual: PL/EN)
- Auto-adjusting height (no fixed height)
- Sanity CMS: `useSanityFundacjaPage()` (singleton)

---

### 7. Media (Photos)

**Files:**
```
src/pages/Media/
├── index.jsx         # ResponsiveWrapper
├── DesktopMedia.jsx  # Desktop layout
└── MobileMedia.jsx   # Mobile layout
```

**Assets:**
```
public/assets/media/
└── [album-folders]/
    ├── thumbnail.jpg
    ├── photo1.jpg
    ├── photo2.jpg
    └── photo3.jpg
```

**Features:**
- Photo album grid with thumbnails
- Click to view full album gallery
- Photographer credits
- Sanity CMS: `useSanityPhotoAlbums()`

**Sample Albums:**
- Festiwal Klang
- Nazwa wydarzenia
- Nazwa konceru

---

### 8. MediaWideo (Videos)

**Files:**
```
src/pages/MediaWideo/
├── index.jsx              # ResponsiveWrapper
├── DesktopMediaWideo.jsx  # Desktop layout
└── MobileMediaWideo.jsx   # Mobile layout
```

**Assets:**
```
public/assets/media-wideo/
└── [video-thumbnails].jpg
```

**Features:**
- YouTube video embeds
- Video thumbnails with play icon overlay
- Sanity CMS: `useSanityVideos()`

**Sample Videos:**
1. Rafał Zapała - black serial MIDI music
2. Michael Beil - Key Jane
3. Viacheslav Kyrylov - I'm the real pig blood soaked fucking homecoming queen
4. Marta Śniady - Body X Ultra: Limited Edition

---

### 9. Repertuar (Repertoire)

**Files:**
```
src/pages/Repertuar/
├── index.jsx            # ResponsiveWrapper
├── DesktopRepertuar.jsx # Desktop layout
└── MobileRepertuar.jsx  # Mobile layout
```

**Features:**
- List of 25 composers with their works
- Works displayed as list items
- Special works highlighted
- Sanity CMS: `useSanityRepertuarComposers()` (category="repertuar")

**Note:** Composer names and piece names are NOT translated (remain in original language).

---

### 10. Specialne (Special Projects)

**Files:**
```
src/pages/Specialne/
├── index.jsx              # ResponsiveWrapper
├── DesktopSpecjalne.jsx   # Desktop layout
├── MobileSpecjalne.jsx    # Mobile layout
└── specialne-config.js    # Local config (fallback)
```

**Features:**
- 7 composers for special projects
- Guest artists listed
- Similar structure to Repertuar
- Sanity CMS: `useSanitySpecjalneComposers()` (category="specialne")

---

### 11. Wydarzenie (Event Detail)

**Files:**
```
src/pages/Wydarzenie/
├── index.jsx              # ResponsiveWrapper
├── DesktopWydarzenie.jsx  # Desktop layout
└── MobileWydarzenie.jsx   # Mobile layout
```

**Features:**
- Single event detail page
- Full event information
- Image gallery
- Partner logos
- Ticket purchase button
- Sanity CMS: `useSanityEvent(id)` - fetches by document ID

---

## Sanity CMS Configuration

### Project Details

**Project ID:** `cy9ddq1w`
**Dataset:** `production`
**Studio URL:** `http://localhost:3333` (local)

### Content Schemas

| Schema | Type | Count | Hook |
|--------|------|-------|------|
| `event` | document | ~6 | `useSanityEvents()`, `useSanityEvent(id)` |
| `bioProfile` | document | 4 | `useSanityBioProfiles()` |
| `homepageSlide` | document | 4 | `useSanityHomepageSlides()` |
| `kontaktPage` | singleton | 1 | `useSanityKontaktPage()` |
| `fundacjaPage` | singleton | 1 | `useSanityFundacjaPage()` |
| `photoAlbum` | document | 3 | `useSanityPhotoAlbums()` |
| `mediaItem` | document | 4 (videos) | `useSanityVideos()` |
| `composer` | document | 32 (25 repertuar + 7 specialne) | `useSanityRepertuarComposers()`, `useSanitySpecjalneComposers()` |

### Migration Scripts

All content migrated using scripts in `scripts/`:

```bash
# Content migration (initial)
node scripts/migrate-homepage-slides.js
node scripts/migrate-bio-profiles.js
node scripts/migrate-events.js
node scripts/migrate-archived-events.js
node scripts/migrate-kontakt-page.js
node scripts/migrate-fundacja-page.js
node scripts/migrate-photo-albums.js
node scripts/migrate-videos.js
node scripts/migrate-composers.js

# i18n migration (bilingual support)
node scripts/migrate-events-i18n.js
node scripts/migrate-bio-profiles-i18n.js
node scripts/migrate-homepage-slides-i18n.js
node scripts/migrate-fundacja-page-i18n.js
node scripts/migrate-photo-albums-i18n.js
node scripts/migrate-media-items-i18n.js
```

All scripts have duplicate detection - safe to run multiple times.

### Current Status

✅ **CMS Enabled:** `VITE_USE_SANITY=true` (production)
✅ **All content migrated** to Sanity CMS
✅ **Bilingual support** (PL/EN) implemented
✅ **Null safety checks** in all hooks
✅ **Asset optimization** via Sanity CDN

---

## Verification Configuration

### Sections Config

**File:** `scripts_project/sections-config.json`

```json
{
  "figmaFileKey": "16wGmQvLEJ5vSIrSzL8muo",
  "figmaNodeId": "9-301",
  "pageWidth": 1440,
  "sections": {
    "hero": { "y": 0, "height": 700, "selector": "[data-section='hero']" },
    "kalendarz": { "y": 0, "height": 2047, "selector": "[data-section='kalendarz']" },
    "bio1-ensemble": { "y": 0, "height": 700, "selector": "[data-section='bio']" },
    "bio2-aleksandra": { "y": 0, "height": 700, "selector": "[data-section='bio']" },
    "bio3-rafal": { "y": 0, "height": 700, "selector": "[data-section='bio']" },
    "bio4-jacek": { "y": 0, "height": 700, "selector": "[data-section='bio']" }
  }
}
```

### UIMatch Config

**File:** `scripts_project/uimatch-config.json`

```json
{
  "figmaFileKey": "16wGmQvLEJ5vSIrSzL8muo",
  "defaultProfile": "component/dev",
  "defaultUrl": "http://localhost:5173",
  "outputDir": "tmp/uimatch-reports",
  "nodes": {
    "logo": {
      "id": "9-302",
      "name": "Logo",
      "selector": "[data-node-id='logo']",
      "profile": "component/strict"
    }
  }
}
```

---

## Routes Configuration

**File:** `src/App.jsx`

```jsx
<Routes>
  <Route path="/" element={<Homepage />} />
  <Route path="/bio" element={<Bio />} />
  <Route path="/bio-ensemble" element={<BioEnsemble />} />
  <Route path="/kalendarz" element={<Kalendarz />} />
  <Route path="/archiwalne" element={<Archiwalne />} />
  <Route path="/kontakt" element={<Kontakt />} />
  <Route path="/fundacja" element={<Fundacja />} />
  <Route path="/media" element={<Media />} />
  <Route path="/media/galeria/:albumId" element={<MediaGaleria />} />
  <Route path="/media/wideo" element={<MediaWideo />} />
  <Route path="/repertuar" element={<Repertuar />} />
  <Route path="/specialne" element={<Specialne />} />
  <Route path="/wydarzenie/:eventId" element={<Wydarzenie />} />
</Routes>
```

---

## Development Notes

### Key Features Implemented

1. ✅ **Pixel-perfect Figma implementation** - Scale transform approach
2. ✅ **Bilingual support** (PL/EN) - Context + translation files + Sanity fields
3. ✅ **Sanity CMS integration** - Feature-flagged with local config fallback
4. ✅ **Visual verification tools** - Sections + UIMatch
5. ✅ **Responsive design** - Desktop (1440px) + Mobile (390px) with scale transform
6. ✅ **Asset optimization** - Sanity CDN for images
7. ✅ **Null safety** - Comprehensive checks in all hooks
8. ✅ **Migration scripts** - Automated content migration with duplicate detection

### Known Issues / Considerations

- **Auto-height pages:** Fundacja page uses auto-height to prevent content cutting
- **Image positioning:** Bio profiles use complex CSS positioning from Figma
- **Font loading:** IBM Plex Mono self-hosted for consistent rendering
- **Mobile navigation:** Fixed header with scroll behavior

### Recent Changes

See git log for full history. Key commits:
- `c47f9de` - Sanity CMS integration to MobileMedia
- `f2a5ce8` - Comprehensive null safety checks across all hooks
- `98b43ed` - Full bilingual support (PL/EN)
- `71f7a9d` - Auto-height for Fundacja page
- `17a8418` - Removed 30 layout/styling fields from CMS queries, enabled CMS

---

## Documentation

**Main Guide:** [CLAUDE.md](./CLAUDE.md) - Generic patterns and workflows
**Migration Summary:** `docs/SANITY_MIGRATION_SUMMARY.md` - Full CMS migration details
**This File:** Project-specific Kompopolex implementation

---

## Quick Reference

### Start Development
```bash
npm run dev                    # Frontend (http://localhost:5173)
cd sanity-studio && npm run dev # CMS Studio (http://localhost:3333)
```

### Verify Sections
```bash
make verify-section SECTION=hero SECTIONS_CONFIG=scripts_project/sections-config.json
```

### Deploy
```bash
npm run build                  # Build frontend
npx sanity deploy              # Deploy Sanity Studio (optional)
```
