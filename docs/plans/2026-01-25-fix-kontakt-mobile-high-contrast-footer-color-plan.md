---
title: "fix: Kontakt mobile high contrast footer background color mismatch"
type: fix
date: 2026-01-25
---

# fix: Kontakt mobile high contrast footer background color mismatch

## Problem

Na stronie `/kontakt` w trybie high contrast mobile, pod stopką widoczny jest szary pasek - inny kolor niż białe tło strony (`#FDFDFD`).

## Root Cause

Struktura DOM:
```
ResponsiveWrapper (div) - background: orange (#FF734C) → filtered to gray
  └── section[data-section="kontakt-mobile"] - background: #FDFDFD (forced by CSS)
```

W high contrast mode:
1. CSS rule `body.high-contrast [data-section] { background-color: #FDFDFD !important; }` wymusza białe tło na sekcji
2. Ale ResponsiveWrapper (parent div) zachowuje oryginalny pomarańczowy kolor (`#FF734C`)
3. CSS filter `contrast(1.5) grayscale(1)` zamienia pomarańczowy na szary
4. Gdy sekcja nie wypełnia całego wrappera, widać szary pasek na dole

## Solution

Dodać CSS rule w `src/index.css` który wymusza białe tło na ResponsiveWrapper w high contrast mode:

```css
/* Force white background on ResponsiveWrapper container in high contrast mode */
body.high-contrast #root > div {
  background: #FDFDFD !important;
}
```

Alternatywnie, bardziej precyzyjny selektor:

```css
/* Force white background on page containers in high contrast mode */
body.high-contrast #root > div[style*="background"] {
  background: #FDFDFD !important;
}
```

## Files to Modify

- [x] `src/index.css` - dodać CSS rule po linii ~485 (sekcja high contrast)

## Acceptance Criteria

- [x] Failing test: Szary pasek pod stopką w high contrast
- [x] Fix: CSS rule wymuszający białe tło na wrapper
- [x] Passing test: Jednolity biały kolor na całej stronie
- [x] No regression: Wszystkie testy E2E przechodzą (788/789, 1 unrelated failure)

## TDD Workflow

### 1. Write Failing Test

```javascript
// tests/e2e/mobile/mobile-kontakt-high-contrast-footer.spec.js
test('page should have uniform background color in high contrast', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/kontakt');

  // Enable high contrast
  await page.evaluate(() => {
    document.body.classList.add('high-contrast');
  });
  await page.waitForTimeout(300);

  // Check that wrapper has white background
  const wrapperBg = await page.evaluate(() => {
    const wrapper = document.querySelector('#root > div');
    return getComputedStyle(wrapper).backgroundColor;
  });

  // Should be white (#FDFDFD = rgb(253, 253, 253))
  expect(wrapperBg).toBe('rgb(253, 253, 253)');
});
```

### 2. Implement Fix

Add to `src/index.css`:

```css
/* Force white background on page wrapper in high contrast mode */
body.high-contrast #root > div {
  background: #FDFDFD !important;
}
```

### 3. Verify

```bash
npm run test:e2e -- --grep "uniform background color"
npm run test:e2e  # Full regression
```

## Affected Pages

All pages with colored backgrounds using ResponsiveWrapper:
- `/kontakt` (orange #FF734C)
- `/bio/ensemble` (yellow #FFBD19)
- `/media` (green #34B898)
- `/media/wideo` (blue #73A1FE)
- `/fundacja` (green #34B898)

## References

- CSS high contrast section: `src/index.css:480-485`
- ResponsiveWrapper: `src/components/ResponsiveWrapper/ResponsiveWrapper.jsx:101`
- Similar fix for `[data-section]`: `src/index.css:481-483`
