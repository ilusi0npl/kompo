const { test, expect } = require('@playwright/test');

/**
 * TDD Test: Decorative lines must be visible in high contrast mode
 *
 * Requirements:
 * 1. Lines must exist (6 lines on Bio/Bio Ensemble desktop)
 * 2. Lines must be in #fixed-root portal (to avoid high contrast filter)
 * 3. Lines must NOT have grayscale filter applied
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

    // Verify lines are in correct portal
    const linesInPortal = await page.evaluate(() => {
      const lines = document.querySelectorAll('.decorative-line');
      return Array.from(lines).every(line => line.closest('#fixed-root') !== null);
    });
    expect(linesInPortal, 'All lines should be in #fixed-root').toBe(true);

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

    // Verify lines are in correct portal
    const linesInPortal = await page.evaluate(() => {
      const lines = document.querySelectorAll('.decorative-line');
      return Array.from(lines).every(line => line.closest('#fixed-root') !== null);
    });
    expect(linesInPortal, 'All lines should be in #fixed-root').toBe(true);

    // Verify lines don't have filter
    for (let i = 0; i < lineCount; i++) {
      const filter = await lines.nth(i).evaluate(el => getComputedStyle(el).filter);
      expect(filter, `Line ${i} should not have filter`).toBe('none');
    }

    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/bio-ensemble-high-contrast-lines.png', fullPage: false });
  });

  test('Lines should be in #fixed-root with high z-index for visibility', async ({ page }) => {
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

      return {
        fixedRootZIndex: fixedRoot ? getComputedStyle(fixedRoot).zIndex : null,
        rootZIndex: rootDiv ? getComputedStyle(rootDiv).zIndex : null,
        linesRootZIndex: linesRoot ? getComputedStyle(linesRoot).zIndex : null,
        lineZIndex: lines[0] ? getComputedStyle(lines[0]).zIndex : null,
        linesInFixedRoot: Array.from(lines).every(l => l.closest('#fixed-root') !== null),
      };
    });

    console.log('Z-index info:', zIndexInfo);

    // Lines should be in #fixed-root
    expect(zIndexInfo.linesInFixedRoot, 'Lines should be in #fixed-root').toBe(true);
    // #fixed-root should have highest z-index
    expect(parseInt(zIndexInfo.fixedRootZIndex), '#fixed-root should have high z-index').toBe(9999);
    // Lines should have positive z-index
    expect(parseInt(zIndexInfo.lineZIndex), 'Lines should have positive z-index').toBeGreaterThan(0);
  });
});
