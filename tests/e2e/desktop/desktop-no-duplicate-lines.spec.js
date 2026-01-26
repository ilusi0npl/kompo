import { test, expect } from '@playwright/test';

/**
 * Test: Desktop pages should have correct decorative lines architecture
 *
 * Architecture:
 * - LinesPortal (#lines-root): 6 lines, full page, z-index 50 (below header background)
 * - FixedPortal (#fixed-root): 6 lines, header area only, z-index 101 (above header background)
 *
 * Total: 12 lines in DOM, but NO visual overlap because:
 * - Header area: only FixedPortal lines visible (header background covers LinesPortal)
 * - Scrollable area: only LinesPortal lines visible (FixedPortal lines stay in header)
 *
 * This test verifies:
 * 1. Exactly 12 lines total (6 LinesPortal + 6 FixedPortal)
 * 2. Exactly 6 unique positions (lines are aligned)
 * 3. No extra lines in Desktop components (which would cause visual overlap)
 */
test.describe('Desktop - Decorative Lines Architecture', () => {
  const pages = [
    { path: '/kalendarz', name: 'Kalendarz' },
    { path: '/archiwalne', name: 'Archiwalne' },
    { path: '/media', name: 'Media' },
    { path: '/media/wideo', name: 'MediaWideo' },
    { path: '/repertuar', name: 'Repertuar' },
    { path: '/specialne', name: 'Specialne' },
  ];

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  for (const { path, name } of pages) {
    test(`${name} should have correct lines architecture (12 total, 6 unique positions)`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // Count lines in each portal
      const linesByPortal = await page.evaluate(() => {
        const linesRoot = document.querySelectorAll('#lines-root .decorative-line').length;
        const fixedRoot = document.querySelectorAll('#fixed-root .decorative-line').length;
        const mainRoot = document.querySelectorAll('#root .decorative-line').length;
        const total = document.querySelectorAll('.decorative-line').length;
        return { linesRoot, fixedRoot, mainRoot, total };
      });

      // Get line positions to verify alignment
      const linePositions = await page.evaluate(() => {
        const lines = document.querySelectorAll('.decorative-line');
        return Array.from(lines).map(line => {
          const rect = line.getBoundingClientRect();
          return Math.round(rect.left);
        });
      });

      const uniquePositions = [...new Set(linePositions)];

      console.log(`${name}: LinesPortal=${linesByPortal.linesRoot}, FixedPortal=${linesByPortal.fixedRoot}, MainRoot=${linesByPortal.mainRoot}, Total=${linesByPortal.total}`);
      console.log(`  Unique positions: ${uniquePositions.join(', ')}`);

      // Should have exactly 6 lines in LinesPortal
      expect(linesByPortal.linesRoot, `${name} should have 6 lines in #lines-root`).toBe(6);

      // Should have exactly 6 lines in FixedPortal
      expect(linesByPortal.fixedRoot, `${name} should have 6 lines in #fixed-root`).toBe(6);

      // Should have NO lines in main #root (scrollable content)
      expect(linesByPortal.mainRoot, `${name} should have 0 lines in #root (no duplicates in content)`).toBe(0);

      // Should have exactly 12 total lines
      expect(linesByPortal.total, `${name} should have exactly 12 decorative lines total`).toBe(12);

      // Should have exactly 6 unique positions (lines aligned between portals)
      expect(uniquePositions.length, `${name} should have 6 unique line positions`).toBe(6);
    });
  }
});
