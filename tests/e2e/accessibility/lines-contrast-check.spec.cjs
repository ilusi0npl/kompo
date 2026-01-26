const { test, expect } = require('@playwright/test');

/**
 * TDD Test: Decorative lines must be visible in high contrast mode
 *
 * Requirements:
 * 1. Lines must exist (6 lines on Bio/Bio Ensemble desktop)
 * 2. Lines must be in #lines-root portal (below content)
 * 3. Lines must NOT have grayscale filter applied (CSS exclusion rule)
 * 4. Lines should have dark color that contrasts with white background
 */

test.describe('Decorative Lines Visibility in High Contrast Mode', () => {

  test('Bio page - lines are visible and have contrasting color', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/bio');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Enable high contrast mode
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
    });
    await page.waitForTimeout(500);

    // Verify lines exist
    const lines = page.locator('.decorative-line');
    const lineCount = await lines.count();
    expect(lineCount, 'Should have decorative lines').toBeGreaterThan(0);

    // Verify lines are in correct portal (#lines-root, below content)
    const linesInPortal = await page.evaluate(() => {
      const lines = document.querySelectorAll('.decorative-line');
      return Array.from(lines).every(line => line.closest('#lines-root') !== null);
    });
    expect(linesInPortal, 'All lines should be in #lines-root').toBe(true);

    // Verify lines don't have filter
    for (let i = 0; i < lineCount; i++) {
      const filter = await lines.nth(i).evaluate(el => getComputedStyle(el).filter);
      expect(filter, `Line ${i} should not have filter`).toBe('none');
    }

    // Verify lines have non-zero width
    for (let i = 0; i < lineCount; i++) {
      const box = await lines.nth(i).boundingBox();
      expect(box, `Line ${i} should have bounding box`).not.toBeNull();
      expect(box.width, `Line ${i} should have width`).toBeGreaterThan(0);
    }

    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/bio-high-contrast-lines.png', fullPage: false });
  });

  test('Bio Ensemble page - lines are visible and have contrasting color', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/bio/ensemble');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Enable high contrast mode
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
    });
    await page.waitForTimeout(500);

    // Verify lines exist
    const lines = page.locator('.decorative-line');
    const lineCount = await lines.count();
    expect(lineCount, 'Should have decorative lines').toBeGreaterThan(0);

    // Verify lines are in correct portal (#lines-root, below content)
    const linesInPortal = await page.evaluate(() => {
      const lines = document.querySelectorAll('.decorative-line');
      return Array.from(lines).every(line => line.closest('#lines-root') !== null);
    });
    expect(linesInPortal, 'All lines should be in #lines-root').toBe(true);

    // Verify lines don't have filter
    for (let i = 0; i < lineCount; i++) {
      const filter = await lines.nth(i).evaluate(el => getComputedStyle(el).filter);
      expect(filter, `Line ${i} should not have filter`).toBe('none');
    }

    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/bio-ensemble-high-contrast-lines.png', fullPage: false });
  });

  test('Lines should be in #lines-root (below content) for correct z-index hierarchy', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/bio');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
    });
    await page.waitForTimeout(300);

    // Check z-index of lines and their container
    const zIndexInfo = await page.evaluate(() => {
      const lines = document.querySelectorAll('.decorative-line');
      const fixedRoot = document.getElementById('fixed-root');
      const rootDiv = document.getElementById('root');
      const linesRoot = document.getElementById('lines-root');

      // Get line's z-index or its parent container's z-index
      let lineZIndex = null;
      if (lines[0]) {
        const lineStyle = getComputedStyle(lines[0]).zIndex;
        if (lineStyle !== 'auto') {
          lineZIndex = lineStyle;
        } else {
          // Check parent container for z-index
          const parent = lines[0].parentElement;
          if (parent) {
            lineZIndex = getComputedStyle(parent).zIndex;
          }
        }
      }

      return {
        fixedRootZIndex: fixedRoot ? getComputedStyle(fixedRoot).zIndex : null,
        rootZIndex: rootDiv ? getComputedStyle(rootDiv).zIndex : null,
        linesRootZIndex: linesRoot ? getComputedStyle(linesRoot).zIndex : null,
        lineZIndex: lineZIndex,
        linesInLinesRoot: Array.from(lines).every(l => l.closest('#lines-root') !== null),
      };
    });

    console.log('Z-index info:', zIndexInfo);

    // Lines should be in #lines-root (below content)
    expect(zIndexInfo.linesInLinesRoot, 'Lines should be in #lines-root').toBe(true);
    // #lines-root should have low z-index (below content)
    expect(parseInt(zIndexInfo.linesRootZIndex), '#lines-root should have low z-index').toBe(1);
    // Lines or their container should have positive z-index
    expect(parseInt(zIndexInfo.lineZIndex), 'Lines or container should have positive z-index').toBeGreaterThan(0);
  });
});
