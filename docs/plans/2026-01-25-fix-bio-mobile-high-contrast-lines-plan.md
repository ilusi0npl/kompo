---
title: "Fix: Bio Mobile High Contrast Missing Vertical Lines"
type: fix
date: 2026-01-25
---

# Fix: Bio Mobile High Contrast Missing Vertical Lines

## Overview

On the `/bio` page in mobile view with high contrast mode enabled, vertical decorative lines are not visible below the text content during scroll. The fixed header shows lines correctly, but the scrollable content area lacks the vertical line pattern.

## Problem Statement

**Current behavior:** In high contrast mode on mobile `/bio` page, vertical lines are only visible in the fixed header area. When scrolling, the content below the header has a white background but no vertical lines.

**Expected behavior:** Vertical lines should be visible across the entire page height, consistent with normal mode and with the fixed header in high contrast mode.

## Root Cause Analysis

After analyzing the codebase:

1. **Lines ARE rendered** in `Bio/index.jsx` via `LinesPortal` (lines 77-92)
2. Lines use `position: fixed`, `height: '100vh'`, and `z-index: 1`
3. `#root` has `z-index: 2`, meaning content stacks ABOVE lines
4. In high contrast mode, `[data-section]` elements get `background-color: #FDFDFD !important` (from recent fix)
5. **The issue:** The opaque white background on `[data-section]` elements COVERS the vertical lines that are rendered behind them

**The z-index stacking:**
```
#mobile-header-root (z-index: 100) - has its own lines, visible ✓
#fixed-root (z-index: 9999) - controls, visible ✓
#root (z-index: 2) - content with opaque white bg, covers lines ✗
#lines-root (z-index: 1) - vertical lines, HIDDEN behind #root ✗
```

## Proposed Solution

Two possible approaches:

### Option A: Render lines INSIDE scrollable content (like MobileKontakt)

Add vertical lines directly to `MobileBio.jsx` scrollable content section, similar to how `MobileKontakt.jsx` handles it (lines in both header portal AND scrollable content).

**Pros:** Lines are part of the content flow, always visible
**Cons:** Requires modifying MobileBio component

### Option B: Make scrollable content background transparent in high contrast (RECOMMENDED)

Modify CSS to NOT force white background on `[data-section]` elements on Bio page, letting the LinesPortal background show through.

**Problem:** This contradicts the recent high contrast fix that forces white backgrounds.

### Option C: Increase z-index of lines-root (NOT RECOMMENDED)

Would break the design intent where content should be above decorative elements.

### Option D: Duplicate lines in MobileBio scrollable section (RECOMMENDED)

Following the pattern from `MobileKontakt.jsx` - render vertical lines in BOTH:
1. Fixed header portal (already exists)
2. Scrollable content area (needs to be added)

This is the most robust solution as it doesn't depend on z-index stacking.

## Implementation Plan

### Files to Modify

1. `src/pages/Bio/MobileBio.jsx` - Add vertical lines to scrollable content section

### Code Changes

In `MobileBio.jsx`, add vertical lines at the beginning of the scrollable content section (around line 269):

```jsx
{/* SCROLLABLE CONTENT - All slides stacked vertically */}
<div style={{ position: 'relative' }}>
  {/* Pionowe linie w scrollable content */}
  {mobileLinePositions.map((left, index) => (
    <div
      key={`content-line-${index}`}
      className="absolute top-0 decorative-line"
      style={{
        left: `${left}px`,
        width: '1px',
        height: '100%',
        backgroundColor: currentColors.lineColor,
        transition: `background-color ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
      }}
    />
  ))}
  {mobileBioSlides.map((slide, index) => {
    // ... existing code
  })}
</div>
```

## Acceptance Criteria

- [ ] Vertical lines visible on `/bio` mobile page in high contrast mode
- [ ] Lines visible during scroll (below fixed header)
- [ ] Lines have correct dark color (`#131313`) in high contrast mode
- [ ] Lines transition colors correctly when scrolling between sections (normal mode)
- [ ] No regression on desktop Bio page
- [ ] No regression on other mobile pages

## Test Plan

### E2E Test

Create test file: `tests/e2e/mobile/mobile-bio-high-contrast-lines.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test.describe('Mobile Bio High Contrast Lines', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('Bio mobile: vertical lines should be visible in scrollable content in high contrast mode', async ({ page }) => {
    await page.goto('/bio');

    // Enable high contrast mode
    await page.click('.contrast-toggle-btn');
    await page.waitForTimeout(500);

    // Scroll down past the header
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(300);

    // Check for decorative lines in the scrollable content area
    const lines = await page.locator('[data-section="bio-mobile"] .decorative-line');
    const lineCount = await lines.count();

    expect(lineCount).toBeGreaterThanOrEqual(3); // 3 vertical lines expected

    // Verify lines are visible (not covered by content)
    for (let i = 0; i < Math.min(lineCount, 3); i++) {
      const line = lines.nth(i);
      const isVisible = await line.isVisible();
      expect(isVisible).toBe(true);

      // Verify line has dark color in high contrast
      const bgColor = await line.evaluate(el => getComputedStyle(el).backgroundColor);
      expect(bgColor).toBe('rgb(19, 19, 19)'); // #131313
    }
  });

  test('Bio mobile: lines should be visible at different scroll positions', async ({ page }) => {
    await page.goto('/bio');

    // Enable high contrast
    await page.click('.contrast-toggle-btn');
    await page.waitForTimeout(500);

    // Test at multiple scroll positions
    const scrollPositions = [0, 300, 600, 900];

    for (const scrollY of scrollPositions) {
      await page.evaluate(y => window.scrollTo(0, y), scrollY);
      await page.waitForTimeout(200);

      const lines = await page.locator('[data-section="bio-mobile"] .decorative-line');
      const visibleLines = await lines.filter({ hasNot: page.locator('[style*="display: none"]') }).count();

      expect(visibleLines).toBeGreaterThanOrEqual(3);
    }
  });
});
```

### Manual Testing

1. Open http://localhost:5173/bio on mobile viewport (390px width)
2. Click contrast toggle to enable high contrast mode
3. Scroll down through all bio sections
4. Verify vertical lines are visible throughout the entire page

## References

- Similar implementation: `src/pages/Kontakt/MobileKontakt.jsx:33-44` (lines in scrollable content)
- Lines config: `src/pages/Bio/bio-config.js:167` (mobileLinePositions)
- High contrast CSS: `src/index.css:412-418` (decorative-line dark color rule)
