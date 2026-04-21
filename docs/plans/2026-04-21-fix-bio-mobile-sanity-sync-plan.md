---
title: "fix: Bio mobile shows stale translation text instead of Sanity CMS content"
type: fix
date: 2026-04-21
brainstorm: docs/brainstorms/2026-04-21-bio-mobile-sanity-sync-brainstorm.md
---

# fix: Bio mobile shows stale translation text instead of Sanity CMS content

## Overview

On production (`VITE_USE_SANITY=true`) the `/bio` page shows different paragraph text on desktop vs mobile. Desktop reads from Sanity CMS via `useSanityBioProfiles`; mobile reads from hardcoded translation files (`src/translations/bio.js`). Result: two different editorial versions of every bio profile visible depending on device.

**Confirmed by Playwright diff on https://kompo-pi.vercel.app:**
- Desktop ensemble: *"Ensemble Kompopolex to polski zespół muzyki współczesnej, założony w 2017 roku..."*
- Mobile ensemble: *"Trio specjalizujące się w muzyce najnowszej, założone w 2017 roku..."*

## Root Cause

`MobileBio.jsx` was never updated when Sanity CMS was integrated. It always reads from `t('bio.slides.*.paragraphs')`. `DesktopBio.jsx` was updated to use `useSanityBioProfiles()` but `MobileBio.jsx` was left behind.

## Solution

Add `useSanityBioProfiles` integration to `MobileBio.jsx` — mirror the exact pattern used in `DesktopBio.jsx`. Reference implementation also exists in `MobileBioEnsemble.jsx`.

No new abstractions. No new files. One component fixed.

---

## TDD Plan

### Phase 1 — Red: Write failing E2E test

**File**: `tests/e2e/production/bio-mobile-sanity.spec.js`

Test must FAIL before any code change.

```javascript
// tests/e2e/production/bio-mobile-sanity.spec.js
import { test, expect } from '@playwright/test';

test.describe('Bio mobile: paragraphs match Sanity CMS content', () => {
  test('ensemble paragraph contains Sanity text (not stale translation)', async ({ browser }) => {
    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await mobile.newPage();
    await page.goto('/bio', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // This text is from Sanity CMS (desktop shows it). Before fix, mobile shows old translation.
    const sanityText = 'Ensemble Kompopolex to polski zespół muzyki współczesnej';
    const staleText = 'Trio specjalizujące się w muzyce najnowszej';

    const bodyText = await page.evaluate(() => document.body.innerText);

    expect(bodyText).toContain(sanityText);   // FAILS before fix
    expect(bodyText).not.toContain(staleText); // FAILS before fix
    await mobile.close();
  });

  test('desktop and mobile ensemble text match', async ({ browser }) => {
    const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });

    const desktopPage = await desktop.newPage();
    const mobilePage = await mobile.newPage();

    await desktopPage.goto('/bio', { waitUntil: 'networkidle' });
    await mobilePage.goto('/bio', { waitUntil: 'networkidle' });
    await Promise.all([
      desktopPage.waitForTimeout(2000),
      mobilePage.waitForTimeout(2000),
    ]);

    const desktopParagraphs = await desktopPage.$$eval('p', els =>
      els.map(e => e.innerText.trim()).filter(t => t.length > 40)
    );
    const mobileParagraphs = await mobilePage.$$eval('p', els =>
      els.map(e => e.innerText.trim()).filter(t => t.length > 40)
    );

    // After fix, both should contain identical texts
    const desktopSet = new Set(desktopParagraphs);
    const mobileOnly = mobileParagraphs.filter(t => !desktopSet.has(t));
    expect(mobileOnly, 'Mobile-only paragraphs (should be empty after fix)').toHaveLength(0);

    await desktop.close();
    await mobile.close();
  });
});
```

Run: `npx playwright test tests/e2e/production/bio-mobile-sanity.spec.js --project=production` — confirm it FAILS.

---

### Phase 2 — Green: Implement fix in MobileBio.jsx

**File**: `src/pages/Bio/MobileBio.jsx`

#### Step 2.1 — Add imports (after line 14)

```javascript
import { useSanityBioProfiles } from '../../hooks/useSanityBioProfiles';
```

#### Step 2.2 — Add module-level constants (after `slideTranslationKeys`, ~line 18)

```javascript
const USE_SANITY = import.meta.env.VITE_USE_SANITY === 'true';

// Merges Sanity CMS content with hardcoded design values from mobileBioSlides config.
// Preserves: backgroundColor, lineColor, textColor, hasFooter, id — all Figma-derived.
// Overrides: name, image (imageUrl), paragraphs (mainParagraphs).
function transformSanityProfiles(sanityProfiles) {
  return mobileBioSlides.map((configSlide, index) => {
    const sanityProfile = sanityProfiles[index];
    if (!sanityProfile) return configSlide;
    return {
      ...configSlide,
      name: sanityProfile.name || configSlide.name,
      image: sanityProfile.imageUrl || configSlide.image,
      paragraphs: sanityProfile.mainParagraphs || configSlide.paragraphs,
    };
  });
}
```

#### Step 2.3 — Call hook inside component (first line of `MobileBio`, before any other hooks)

At the very start of the `MobileBio` function body (before `useState` calls), add:

```javascript
const { profiles: sanityProfiles, loading, error } = useSanityBioProfiles();

const slides = USE_SANITY && sanityProfiles && sanityProfiles.length > 0
  ? transformSanityProfiles(sanityProfiles)
  : mobileBioSlides;
```

**Rule**: hook must be called unconditionally. `slides` must be computed before `useScrollColorChange`.

#### Step 2.4 — Update useScrollColorChange (line ~99)

```javascript
// Before:
const currentColors = useScrollColorChange(sectionsRef, mobileBioSlides);

// After:
const currentColors = useScrollColorChange(sectionsRef, slides);
```

#### Step 2.5 — Update image preload useEffect (line ~132)

```javascript
// Before:
mobileBioSlides.forEach((slide, index) => {

// After:
slides.forEach((slide, index) => {
```

#### Step 2.6 — Update totalHeight calculation (line ~153)

```javascript
// Before:
const totalHeight = mobileBioSlides.reduce((sum, slide, index) => {

// After:
const totalHeight = slides.reduce((sum, slide, index) => {
```

#### Step 2.7 — Add loading/error guards (after all hooks, before `return`)

```javascript
if (USE_SANITY && loading) {
  return (
    <section style={{ width: `${MOBILE_WIDTH}px`, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1a1a1a' }}>
        {t('common.loading.profiles')}
      </p>
    </section>
  );
}

if (USE_SANITY && error) {
  return (
    <section style={{ width: `${MOBILE_WIDTH}px`, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1a1a1a' }}>
        {t('common.loading.error') || 'Błąd ładowania profili'}
      </p>
    </section>
  );
}
```

#### Step 2.8 — Update render loop (line ~293)

```javascript
// Before:
{mobileBioSlides.map((slide, index) => {
  const translationKey = slideTranslationKeys[index];
  const paragraphs = isLargeTestMode
    ? slide.paragraphs
    : t(`bio.slides.${translationKey}.paragraphs`);
  const slideName = isLargeTestMode
    ? slide.name
    : t(`bio.slides.${translationKey}.name`);

// After:
{slides.map((slide, index) => {
  const translationKey = slideTranslationKeys[index];
  const paragraphs = USE_SANITY || isLargeTestMode
    ? slide.paragraphs
    : t(`bio.slides.${translationKey}.paragraphs`);
  const slideName = USE_SANITY || isLargeTestMode
    ? slide.name
    : t(`bio.slides.${translationKey}.name`);
```

Note: `mobileImageStyles[index]` stays unchanged — it holds Figma crop data, not CMS content.

---

### Phase 3 — Verify

```bash
# 1. Confirm new test passes against production
npx playwright test tests/e2e/production/bio-mobile-sanity.spec.js --project=production

# 2. Run full test suite — no regressions
npm run test:e2e

# 3. Manual: start local dev with Sanity and verify mobile bio
VITE_USE_SANITY=true npx vite --port 5174
# Open http://localhost:5174/bio at 390px width — check ensemble text matches desktop
```

---

## Acceptance Criteria

- [x] Mobile `/bio` shows same paragraph text as desktop when `VITE_USE_SANITY=true`
- [x] Fallback to `t()` still works when `VITE_USE_SANITY=false` (local dev unchanged)
- [x] Loading state renders without crash on mobile (returns null)
- [x] `mobileImageStyles` crop offsets are untouched (image composition unchanged)
- [x] E2E test `bio-mobile-sanity-sync.spec.js` passes (sanity-mode project)
- [x] All existing `npm run test:e2e` tests still pass (33 local + 30 sanity)

## Files Changed

| File | Change |
|------|--------|
| `src/pages/Bio/MobileBio.jsx` | Add Sanity hook, transformSanityProfiles, slides var, loading/error guards |
| `tests/e2e/production/bio-mobile-sanity.spec.js` | New — TDD regression test (written first) |
| `tests/e2e/production/bio-text-compare.spec.js` | Temporary diagnostic — delete after fix verified |

## Gotchas

- `mobileBioSlides[].id` is a **number** (1,2,3,4); `desktopBioSlides[].id` is a string (`'bio1'`). `transformSanityProfiles` must iterate by index, not by id matching.
- `useSanityBioProfiles` returns `mainParagraphs` as `string[]` — use this, not `paragraphs` (which is `{text, display}[]`).
- Hook must be called **unconditionally** (React rules). `slides` is computed from hook result — NOT inside a conditional.
- `useScrollColorChange` takes `slides` as its second argument for color-per-section logic — it must receive the Sanity-merged version, not raw config.

## References

- `src/pages/Bio/DesktopBio.jsx:29–58` — transformSanityProfiles pattern to mirror
- `src/pages/BioEnsemble/MobileBioEnsemble.jsx:63–75` — mobile Sanity hook usage example
- `src/hooks/useSanityBioProfiles.js` — hook contract (`mainParagraphs`, `imageUrl`, `name`)
- `src/pages/Bio/bio-config.js:107–167` — mobileBioSlides structure
- `docs/brainstorms/2026-04-21-bio-mobile-sanity-sync-brainstorm.md` — decision rationale
