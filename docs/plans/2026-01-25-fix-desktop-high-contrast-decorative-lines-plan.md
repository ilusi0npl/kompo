---
title: "fix: Desktop high contrast missing decorative lines"
type: fix
date: 2026-01-25
---

# fix: Desktop high contrast missing decorative lines

## Problem

Na kilku stronach desktop brakuje pionowych linii dekoracyjnych w trybie high contrast:
- `/wydarzenie/1` (DesktopWydarzenie.jsx)
- `/repertuar` (DesktopRepertuar.jsx)
- `/specialne` (DesktopSpecjalne.jsx)
- `/media` (DesktopMedia.jsx)
- `/fundacja` (DesktopFundacja.jsx)

## Root Cause

Te strony **w ogóle nie mają** zaimplementowanych linii dekoracyjnych w wersji desktop. Porównanie:

| Strona | Desktop Lines | Mobile Lines |
|--------|--------------|--------------|
| Homepage | ✅ | ✅ |
| MediaGaleria | ✅ | ✅ |
| Wydarzenie2 | ✅ | ✅ |
| **Wydarzenie** | ❌ | ✅ |
| **Repertuar** | ❌ | ✅ |
| **Specialne** | ❌ | ✅ |
| **Media** | ❌ | ✅ |
| **Fundacja** | ❌ | ✅ |

Mobile wersje tych stron mają linie (w MobileXxx.jsx lub XxxFixedLayer.jsx), ale desktop nie.

## Solution

Dodać linie dekoracyjne do każdej strony desktop używając wzorca z DesktopWydarzenie2.jsx:

```jsx
// Pozycje linii pionowych z Figma
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#A0E38A'; // lub inny kolor strony

// W JSX - po otwarciu <section>:
{/* Pionowe linie dekoracyjne */}
{LINE_POSITIONS.map((x) => (
  <div
    key={x}
    className="absolute top-0 decorative-line"
    style={{
      left: `${x}px`,
      width: '1px',
      height: '100%',
      backgroundColor: LINE_COLOR,
    }}
  />
))}
```

**Klasa `decorative-line`** jest kluczowa - CSS rule w `src/index.css` wymusza ciemny kolor w high contrast:
```css
body.high-contrast .decorative-line {
  background-color: #131313 !important;
}
```

## Files to Modify

- [x] `src/pages/Wydarzenie/DesktopWydarzenie.jsx` - dodać linie (LINE_COLOR = `#A0E38A`)
- [x] `src/pages/Repertuar/DesktopRepertuar.jsx` - dodać linie (LINE_COLOR = `#A0E38A`)
- [x] `src/pages/Specialne/DesktopSpecjalne.jsx` - dodać linie (LINE_COLOR = `#A0E38A`)
- [x] `src/pages/Media/DesktopMedia.jsx` - dodać linie (LINE_COLOR = `#01936F`)
- [x] `src/pages/Fundacja/DesktopFundacja.jsx` - dodać linie (LINE_COLOR = `#01936F`)

## Page-Specific Line Colors

Kolory linii dla każdej strony (zgodne z mobile versions):
- Wydarzenie: `#A0E38A` (light green)
- Repertuar: `#A0E38A` (light green)
- Specialne: `#A0E38A` (light green)
- Media: `#01936F` (dark green)
- Fundacja: `#01936F` (dark green)

## Acceptance Criteria

- [x] Failing tests: Desktop pages have no decorative lines in high contrast
- [x] Fix: Add decorative lines with `decorative-line` class to all 5 pages
- [x] Passing tests: Lines visible as dark (#131313) in high contrast
- [x] No regression: All E2E tests pass (793/794, 1 unrelated failure)

## TDD Workflow

### 1. Write Failing Test

```javascript
// tests/e2e/desktop/desktop-high-contrast-decorative-lines.spec.js
import { test, expect } from '@playwright/test';

test.describe('Desktop High Contrast - Decorative Lines', () => {
  const pages = [
    { path: '/wydarzenie/1', name: 'Wydarzenie', section: 'wydarzenie' },
    { path: '/repertuar', name: 'Repertuar', section: 'repertuar' },
    { path: '/specialne', name: 'Specialne', section: 'specjalne' },
    { path: '/media', name: 'Media', section: 'media' },
    { path: '/fundacja', name: 'Fundacja', section: 'fundacja' },
  ];

  for (const { path, name, section } of pages) {
    test(`${name} should have decorative lines in high contrast`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // Enable high contrast
      await page.evaluate(() => {
        document.body.classList.add('high-contrast');
      });
      await page.waitForTimeout(300);

      // Check for decorative lines
      const lines = page.locator(`section[data-section="${section}"] .decorative-line`);
      const count = await lines.count();

      expect(count, `${name} should have 6 decorative lines`).toBe(6);

      // Verify color in high contrast
      if (count > 0) {
        const lineColor = await lines.first().evaluate(el => getComputedStyle(el).backgroundColor);
        expect(lineColor, 'Lines should be dark in high contrast').toBe('rgb(19, 19, 19)');
      }
    });
  }
});
```

### 2. Implement Fix

Add to each Desktop file after opening `<section>` tag:

```jsx
// At top of file
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];
const LINE_COLOR = '#A0E38A'; // or #01936F for Media/Fundacja

// Inside <section>, at the beginning:
{/* Pionowe linie dekoracyjne */}
{LINE_POSITIONS.map((x) => (
  <div
    key={x}
    className="absolute top-0 decorative-line"
    style={{
      left: `${x}px`,
      width: '1px',
      height: '100%',
      backgroundColor: LINE_COLOR,
    }}
  />
))}
```

### 3. Verify

```bash
npm run test:e2e -- tests/e2e/desktop/desktop-high-contrast-decorative-lines.spec.js
npm run test:e2e  # Full regression
```

## Implementation Order

1. DesktopWydarzenie.jsx (simplest - similar to Wydarzenie2)
2. DesktopRepertuar.jsx
3. DesktopSpecjalne.jsx
4. DesktopMedia.jsx
5. DesktopFundacja.jsx

## References

- Working pattern: `src/pages/Wydarzenie2/DesktopWydarzenie2.jsx:31-43`
- CSS high contrast rule: `src/index.css:412-418`
- Mobile implementation examples: `src/pages/*/Mobile*.jsx`
- Similar fix (mobile header lines): `src/components/MobileHeader/MobileHeader.jsx:62`
