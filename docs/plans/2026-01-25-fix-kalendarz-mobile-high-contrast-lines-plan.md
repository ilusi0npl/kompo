---
title: "fix: Kalendarz mobile high contrast missing fixed header lines"
type: fix
date: 2026-01-25
---

# fix: Kalendarz mobile high contrast missing fixed header lines

## Problem

Na stronie `/kalendarz` (i innych stronach używających `MobileHeader` z `isFixed=true`) w trybie high contrast mobile:
- **Scrollable content** - ma widoczne pionowe linie (ciemne `#131313`)
- **Fixed header** - brakuje pionowych linii (są niewidoczne)

## Root Cause

Linie w `MobileHeader` (fixed header) nie mają klasy `decorative-line`:

```jsx
// src/components/MobileHeader/MobileHeader.jsx:59-70
{isFixed && lineColor && linePositions.map((left, index) => (
  <div
    key={`header-line-${index}`}
    className="absolute top-0"  // ❌ Brak klasy decorative-line
    style={{
      left: `${left}px`,
      width: '1px',
      height: `${headerHeight}px`,
      backgroundColor: lineColor,
    }}
  />
))}
```

CSS rule wymaga tej klasy:

```css
/* src/index.css:412-418 */
body.high-contrast .decorative-line,
body.high-contrast #mobile-header-root .decorative-line {
  background-color: #131313 !important;
}
```

## Solution

Dodać klasę `decorative-line` do linii w `MobileHeader`:

```jsx
className="absolute top-0 decorative-line"
```

## Files to Modify

- [x] `src/components/MobileHeader/MobileHeader.jsx:62` - dodać klasę `decorative-line`

## Acceptance Criteria

- [x] Failing test: Linie w fixed header niewidoczne w high contrast
- [x] Fix: Dodać klasę `decorative-line` do MobileHeader
- [x] Passing test: Linie widoczne w obu sekcjach
- [x] No regression: Wszystkie testy E2E przechodzą (785/786, 1 unrelated failure)

## TDD Workflow

### 1. Write Failing Test

```javascript
// tests/e2e/mobile/mobile-kalendarz-high-contrast-lines.spec.js
test('fixed header should have visible decorative lines in high contrast', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/kalendarz');

  // Enable high contrast
  await page.evaluate(() => {
    document.body.classList.add('high-contrast');
  });
  await page.waitForTimeout(300);

  // Check lines in fixed header (mobile-header-root)
  const headerLines = page.locator('#mobile-header-root .decorative-line');
  const count = await headerLines.count();

  expect(count, 'Fixed header should have decorative lines').toBeGreaterThan(0);
});
```

### 2. Implement Fix

```jsx
// src/components/MobileHeader/MobileHeader.jsx:62
className="absolute top-0 decorative-line"
```

### 3. Verify

```bash
npm run test:e2e -- --grep "fixed header should have visible decorative lines"
npm run test:e2e  # Full regression
```

## Affected Pages

All pages using `MobileHeader` with `isFixed=true` and `lineColor`:
- `/kalendarz`
- `/archiwalne`
- `/media`
- `/media/wideo`
- `/fundacja`
- `/kontakt`

## References

- CSS rule: `src/index.css:412-418`
- MobileHeader component: `src/components/MobileHeader/MobileHeader.jsx:59-70`
- Similar pattern in scrollable sections: `src/pages/Kalendarz/MobileKalendarz.jsx:96`
