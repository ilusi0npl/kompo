# CLAUDE.md - React + Figma Development Guide

## Critical Rules

**DO NOT** without explicit request: change Sanity, commit, deploy to Vercel.
**ALWAYS** verify: desktop AND mobile versions work.
**SAVE** all Figma links for later use.

**Goal**: Pixel-perfect React from Figma. Design = source of truth.
**Process**: generate → verify → fix → repeat

---

## Tech Stack

React 18+, React Router v7, Vite, Tailwind CSS 4.x, Sanity CMS v3 (feature-flagged)

---

## Bug Fixing - Test First

**Workflow**: Bug → E2E test (must FAIL) → Fix → Test PASS → All tests PASS

**Test location**: `tests/e2e/content-overlap/` or `tests/e2e/pages/`
**Pattern**: `[feature]-[issue].spec.js`

```javascript
// Example: tests/e2e/content-overlap/media-contrast-issue.spec.js
test('Media: fixed header contrast filter', async ({ page }) => {
  await page.goto('/media');
  await page.click('.contrast-toggle-btn');
  const filter = await page.$eval('#fixed-root > *', el => getComputedStyle(el).filter);
  expect(filter).toContain('contrast');
});
```

---

## Commands

```bash
# Dev
npm install && npm run dev    # http://localhost:5173/
npm run build && npm run lint

# Make
make help                           # All commands
make verify NODE=X CONFIG=Y         # UIMatch single node
make verify-sections SECTIONS_CONFIG=Z  # Figma sections
make verify-section SECTION=hero    # Single section
```

---

## Verification Tools

### Sections Verification (Figma → Crop → Compare)

Compare page sections with Figma. Config: `scripts_project/sections-config.json`

```json
{"figmaFileKey": "KEY", "figmaNodeId": "NODE", "pageWidth": 1728,
 "sections": {"hero": {"y": 0, "height": 865, "selector": "[data-section='hero']"}}}
```

Output: `tmp/figma-sections/[timestamp]/report.html` - **ALWAYS provide to user**

### UIMatch (Single Node)

Compare individual elements. Config: `scripts_project/uimatch-config.json`

| Profile | Diff | Use |
|---------|------|-----|
| `component/strict` | ≤1% | Images, icons |
| `component/dev` | ≤8% | Full page (default) |

---

## File Structure (Essential)

```
src/
├── components/          # ResponsiveWrapper/, Footer/, LanguageToggle/, ContrastToggle/
├── pages/[Name]/        # index.jsx, Desktop[Name].jsx, Mobile[Name].jsx, [Name]FixedLayer.jsx
├── hooks/               # useSanity*.js, useTranslation.js, useScrollColorChange.js
├── context/             # LanguageContext.jsx
├── lib/sanity/          # client.js, queries.js
└── translations/        # common.js, [page].js

sanity-studio/schemaTypes/  # event.ts, bioProfile.ts, etc.
scripts/                    # verify-*.cjs, migrate-*.js
tests/e2e/                  # helpers/test-helpers.js, pages/
```

---

## Components Reference

| Component | Path | Props | Notes |
|-----------|------|-------|-------|
| ContrastToggle | ContrastToggle/ | iconColor, style, scale | localStorage, `#FFBD19` active |
| LanguageText | LanguageText/ | textColor, scale, asMenuItem | Button or menu item |
| MobileHeader | MobileHeader/ | title, textColor, navLinks, isFixed | Portal to `#mobile-header-root` |
| MobileMenu | MobileMenu/ | isOpen, onClose | Portal to `#mobile-menu-root` |
| SmoothImage | SmoothImage/ | src, alt, placeholderColor | IntersectionObserver, 2000px margin |
| SmoothSlideshow | SmoothSlideshow/ | images, interval | Crossfade variant |
| ArrowRight | ArrowRight/ | - | SVG, currentColor |

---

## Hooks Reference

| Hook | Purpose | Key Detail |
|------|---------|------------|
| useScrollColorChange | Section color at viewport center | Scale-aware: `scrollPoint = (scrollY + innerHeight/2) / scale` |
| useFixedMobileHeader | Scale for fixed elements | Returns `{ scale, MOBILE_WIDTH: 390, BREAKPOINT: 768 }` |
| useTranslation | Get translations | `const t = useTranslation(); t.nav.bio` |
| useLanguage | Language context | `{ language, setLanguage, toggleLanguage }` |

---

## Responsive Design - Scale Transform

**Concept**: Fixed width scaled via CSS transform (not full responsive).

- Desktop: 1440px base, Mobile: 390px base, Breakpoint: 768px
- Formula: `scale = viewportWidth / baseWidth`
- CSS required: `html, body { overflow-x: hidden; }`

**Page structure**:
```
pages/[Name]/
├── index.jsx              # ResponsiveWrapper usage
├── Desktop[Name].jsx      # 1440px layout
├── Mobile[Name].jsx       # 390px layout
└── [Name]FixedLayer.jsx   # Fixed elements (OUTSIDE wrapper)
```

**Fixed layers**: Render outside ResponsiveWrapper, receive `scale` prop, use `setCurrentColors` callback.

**Portals**: MobileHeader → `#mobile-header-root`, MobileMenu → `#mobile-menu-root`

---

## Testing

```bash
npm test              # Unit (watch)
npm run test:e2e      # E2E (Playwright)
npm run test:all      # All
```

**E2E helpers** (`tests/e2e/helpers/test-helpers.js`):
`navigateToPage`, `assertLogoVisible`, `assertFooterVisible`, `assertLanguageToggleWorks`, `assertMobileViewport`, `assertDesktopViewport`

---

## i18n System

**Two strategies**:

1. **UI texts** - translation files (`src/translations/`): `const t = useTranslation(); t.nav.bio`
2. **CMS content** - bilingual fields: `titlePl`/`titleEn`, hooks transform via `useLanguage()`

**Not translated**: composer names, musical pieces, proper names.

---

## Sanity CMS Integration

**Feature flag**: `VITE_USE_SANITY` (default: false)

**Env vars**: `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`, `SANITY_AUTH_TOKEN`

**Studio**: `cd sanity-studio && npm run dev` → http://localhost:3333

### GROQ Patterns

```javascript
// List with bilingual fields
*[_type == "event" && defined(publishedAt)] | order(date asc) {
  _id, titlePl, titleEn, date, "imageUrl": image.asset->url
}

// Singleton
*[_type == "kontaktPage"][0] { email, backgroundColor }
```

### Hook Pattern

```javascript
const { language } = useLanguage();
const title = language === 'pl' ? event.titlePl : event.titleEn;
```

### Sanity Hooks

| Hook | Purpose |
|------|---------|
| useSanityBioProfiles | Bio profiles |
| useSanityEvents | Events list |
| useSanityHomepageSlides | Homepage slideshow |
| useSanityPhotoAlbums | Photo albums |
| useSanityVideos | Videos |
| useSanityKontaktPage | Kontakt singleton |

### Component Pattern

```javascript
const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';
const content = USE_SANITY && data ? transformData(data) : localConfigData;
if (USE_SANITY && loading) return <Loading />;
```

### Publishing

Edit in Studio → set `publishedAt` → content appears when `VITE_USE_SANITY=true`

**Note**: Only documents with `publishedAt` are fetched.

---

## Lessons Learned / Gotchas

### High Contrast + Fixed Positioning

**Problem**: CSS `filter` breaks `position: fixed` (creates new containing block).

**Solution**: FixedPortal renders to `#fixed-root` outside filtered `#root`.

```jsx
// src/components/FixedPortal/FixedPortal.jsx
export default function FixedPortal({ children }) {
  const fixedRoot = document.getElementById('fixed-root');
  return fixedRoot ? createPortal(children, fixedRoot) : children;
}
```

```css
#fixed-root { position: fixed; top: 0; left: 0; width: 0; height: 0; z-index: 9999; pointer-events: none; overflow: visible; }
body.high-contrast #root { filter: contrast(1.5) grayscale(1); }
```

**All FixedLayer components** must use `<FixedPortal>`: Archiwalne, Bio, Fundacja, Kalendarz, Kontakt, Media, MediaWideo, Repertuar, Specjalne, Wydarzenie.

### i18n - Config vs Sanity

| Source | Flow | Handling |
|--------|------|----------|
| Config/Generator | Direct | No transformation, use `t()` |
| Sanity | Hook transform | `titlePl`/`titleEn` → `title` |

**Generator**: Use direct fields (`id`, `location`), not i18n fields.

### Footer Positioning

**Wrong**: `position: absolute; bottom: 40px` (gaps with dynamic content)
**Right**: Content flow with `marginTop: 80px, marginBottom: 40px`

### Translation Keys

Use numeric IDs (1, 2, 3) matching translation keys (`event1`, `event2`), not complex IDs.

---

## Large Test Data Mode

**Flag**: `VITE_LARGE_TEST_DATA=true npm run dev`

**Generator**: `src/test-data/large-data-generator.js`

| Page | Normal → Large |
|------|----------------|
| Bio | 4 → 10 profiles |
| Homepage | 4 → 8 slides |
| Archiwalne | 6 → 100 events |
| Kalendarz | 5 → 50 events |
| Media | 5 → 30 albums |

**Purpose**: Stress test layout/performance, not i18n. Use direct fields in generator.

**Tests**: `tests/e2e/content-overlap/` - verify no text overlap, footer visible.

---

## Assets Handling

**Problem**: Figma exports SVG as `.png` → API errors.

**Workflow**:
1. Download from Figma via `get_design_context`
2. Check type: `file public/assets/new-asset.png`
3. Fix extension if mismatch: `mv file.png file.svg`

---

## Scripts Reference

| Script | Purpose |
|--------|---------|
| verify-figma-sections.cjs | Section comparison |
| verify-uimatch.cjs | Single node comparison |
| migrate-*.js | CMS migration (duplicate detection, OpenAI translation) |
| translate-content-to-english.js | Auto-translate via OpenAI |

---

## Figma Integration

**Requirements**: `FIGMA_ACCESS_TOKEN` in `.env`, Figma desktop running.

**MCP Tools**:
- `mcp__figma__get_design_context` - design context + code
- `mcp__figma__get_screenshot` - screenshots
- `mcp__figma__get_metadata` - structure overview

**Components must have** `data-section="hero"` for verification.

---

## Quick Reference

**Verification**: `make verify-sections` → check report → fix → repeat

**High contrast**: FixedPortal + `#fixed-root` outside `#root`

**Responsive**: ResponsiveWrapper scales content, FixedLayer outside with `scale` prop

**i18n**: Translation files for UI, bilingual Sanity fields for content

**Testing**: Test-first for bugs, E2E in `tests/e2e/`

**Sanity**: Feature flag, hooks transform language, publish via Studio

---

See [KOMPOPOLEX.md](./KOMPOPOLEX.md) for project-specific: Figma links, colors, page details, assets.
