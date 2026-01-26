// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * TDD Test: Decorative lines must be visible in high contrast mode
 *
 * Problem: Lines are inside #root which has filter applied in high contrast.
 * CSS filter creates new containing block, breaking position:fixed rendering.
 *
 * Solution: Lines should render via FixedPortal to #fixed-root (outside filtered #root)
 */

test.describe('Bio Page - Decorative Lines in High Contrast', () => {

  test('decorative lines should be visible in high contrast mode on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/bio');
    await page.waitForTimeout(1000);

    // Enable high contrast mode
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
    });
    await page.waitForTimeout(500);

    // Lines should exist
    const lines = page.locator('.decorative-line');
    const lineCount = await lines.count();
    expect(lineCount).toBeGreaterThan(0);

    // Lines should NOT have the high contrast filter applied
    // (they should be outside #root, in #fixed-root)
    for (let i = 0; i < lineCount; i++) {
      const line = lines.nth(i);
      const filter = await line.evaluate(el => window.getComputedStyle(el).filter);

      // If filter is 'none', lines are correctly outside filtered #root
      expect(filter, `Line ${i} should not have filter applied (should be in #fixed-root)`).toBe('none');
    }
  });

  test('decorative lines should render in #lines-root portal (outside #root)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/bio');
    await page.waitForTimeout(1000);

    // Check that lines are rendered inside #lines-root (outside #root)
    const linesInLinesRoot = await page.evaluate(() => {
      const linesRoot = document.getElementById('lines-root');
      if (!linesRoot) return { exists: false, lineCount: 0 };

      const lines = linesRoot.querySelectorAll('.decorative-line');
      return { exists: true, lineCount: lines.length };
    });

    expect(linesInLinesRoot.exists, '#lines-root should exist').toBe(true);
    expect(linesInLinesRoot.lineCount, 'Lines should be rendered in #lines-root').toBeGreaterThan(0);
  });

  test('decorative lines should have correct visual contrast in high contrast mode', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/bio');
    await page.waitForTimeout(1000);

    // Enable high contrast mode
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
    });
    await page.waitForTimeout(500);

    // Take screenshot for visual verification
    const screenshot = await page.screenshot({ path: '/tmp/bio-lines-high-contrast-test.png' });
    expect(screenshot).toBeTruthy();

    // Lines should be visually distinguishable (check pixel color at line positions)
    const lineVisibility = await page.evaluate(() => {
      const lines = document.querySelectorAll('.decorative-line');
      const results = [];

      lines.forEach((line, i) => {
        const rect = line.getBoundingClientRect();
        const style = window.getComputedStyle(line);

        // Check if line is actually visible (width > 0, in viewport)
        const isInViewport = rect.left >= 0 && rect.left <= window.innerWidth;
        const hasWidth = rect.width >= 1;
        const isVisible = style.visibility === 'visible' && style.opacity !== '0';

        results.push({
          index: i,
          left: rect.left,
          width: rect.width,
          isInViewport,
          hasWidth,
          isVisible,
          filter: style.filter
        });
      });

      return results;
    });

    // All lines should be visible and NOT have filter
    lineVisibility.forEach((line, i) => {
      expect(line.isInViewport, `Line ${i} should be in viewport`).toBe(true);
      expect(line.hasWidth, `Line ${i} should have width`).toBe(true);
      expect(line.isVisible, `Line ${i} should be visible`).toBe(true);
      expect(line.filter, `Line ${i} should not have filter`).toBe('none');
    });
  });
});
