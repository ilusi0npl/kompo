// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test that vertical lines remain visible AFTER page fully loads.
 *
 * Bug: Lines appear briefly (1 second) during initial render, then disappear.
 * This test waits for page to stabilize and then checks if lines are still visible.
 */

const PAGES_TO_TEST = [
  { path: '/bio', name: 'Bio' },
  { path: '/media', name: 'Media' },
  { path: '/kalendarz', name: 'Kalendarz' },
  { path: '/repertuar', name: 'Repertuar' },
];

// Desktop line positions
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];

test.describe('Lines visible after page load', () => {
  for (const page of PAGES_TO_TEST) {
    test(`${page.name}: lines remain visible after 3 seconds`, async ({ page: browserPage }) => {
      await browserPage.setViewportSize({ width: 1440, height: 900 });

      // Go to page
      await browserPage.goto(page.path, { waitUntil: 'networkidle' });

      // Wait for initial render
      await browserPage.waitForTimeout(500);

      // Check lines exist initially
      const initialLines = await browserPage.$$('#fixed-root .decorative-line');
      console.log(`${page.name} - Initial lines count:`, initialLines.length);

      // Wait 3 seconds (longer than the 1 second the user reported)
      await browserPage.waitForTimeout(3000);

      // Check lines STILL exist after waiting
      const linesAfterWait = await browserPage.$$('#fixed-root .decorative-line');
      console.log(`${page.name} - Lines after 3s:`, linesAfterWait.length);

      // CRITICAL: Lines must still be present after page settles
      expect(linesAfterWait.length).toBeGreaterThanOrEqual(6);

      // Verify first line is actually visible (has dimensions)
      if (linesAfterWait.length > 0) {
        const firstLineBox = await linesAfterWait[0].boundingBox();
        expect(firstLineBox).not.toBeNull();
        expect(firstLineBox?.width).toBe(1);
        expect(firstLineBox?.height).toBeGreaterThan(0);

        // Check computed visibility
        const isVisible = await linesAfterWait[0].evaluate(el => {
          const style = window.getComputedStyle(el);
          return style.display !== 'none' &&
                 style.visibility !== 'hidden' &&
                 style.opacity !== '0' &&
                 el.offsetWidth > 0;
        });
        expect(isVisible).toBe(true);
      }
    });

    test(`${page.name}: lines visible after scroll`, async ({ page: browserPage }) => {
      await browserPage.setViewportSize({ width: 1440, height: 900 });
      await browserPage.goto(page.path, { waitUntil: 'networkidle' });
      await browserPage.waitForTimeout(1000);

      // Scroll down
      await browserPage.evaluate(() => window.scrollTo(0, 500));
      await browserPage.waitForTimeout(500);

      // Check lines after scroll
      const lines = await browserPage.$$('#fixed-root .decorative-line');
      expect(lines.length).toBeGreaterThanOrEqual(6);

      // Scroll back up
      await browserPage.evaluate(() => window.scrollTo(0, 0));
      await browserPage.waitForTimeout(500);

      // Lines should still be there
      const linesAfterScrollBack = await browserPage.$$('#fixed-root .decorative-line');
      expect(linesAfterScrollBack.length).toBeGreaterThanOrEqual(6);
    });
  }
});

test.describe('Lines persistence over time', () => {
  test('Bio: monitor lines for 5 seconds', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/bio', { waitUntil: 'networkidle' });

    const checkPoints = [0, 500, 1000, 2000, 3000, 4000, 5000];
    const results = [];

    for (const ms of checkPoints) {
      if (ms > 0) await page.waitForTimeout(ms - (checkPoints[checkPoints.indexOf(ms) - 1] || 0));

      const lines = await page.$$('#fixed-root .decorative-line');
      const count = lines.length;
      results.push({ ms, count });
      console.log(`At ${ms}ms: ${count} lines`);

      // Lines should never disappear
      expect(count).toBeGreaterThanOrEqual(6);
    }

    // Verify lines count stayed consistent
    const allSame = results.every(r => r.count === results[0].count);
    expect(allSame).toBe(true);
  });
});
