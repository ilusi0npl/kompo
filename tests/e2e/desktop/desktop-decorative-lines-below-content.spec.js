import { test, expect } from '@playwright/test';

test.describe('Desktop - Decorative Lines Below Content', () => {
  const pages = [
    { path: '/bio', name: 'Bio' },
    { path: '/bio/ensemble', name: 'BioEnsemble' },
  ];

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  for (const { path, name } of pages) {
    test(`${name} decorative lines should be in #lines-root`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // Verify lines are in #lines-root (z-index 1) - BELOW content
      // Bio uses LinesPortal for lines below content, same as other pages
      const linesInLinesRoot = page.locator('#lines-root .decorative-line');
      const linesInFixedRoot = page.locator('#fixed-root .decorative-line');

      const linesRootCount = await linesInLinesRoot.count();
      const fixedRootCount = await linesInFixedRoot.count();

      // Lines should be in #lines-root
      expect(linesRootCount, `${name} should have 6 lines in #lines-root`).toBe(6);

      // Lines should NOT be in #fixed-root
      expect(fixedRootCount, `${name} should have 0 lines in #fixed-root`).toBe(0);
    });

    test(`${name} decorative lines should be below content but above background`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // Get z-index hierarchy
      const zIndexInfo = await page.evaluate(() => {
        const linesRoot = document.getElementById('lines-root');
        const root = document.getElementById('root');
        const fixedRoot = document.getElementById('fixed-root');

        return {
          linesRootZIndex: linesRoot ? getComputedStyle(linesRoot).zIndex : null,
          rootZIndex: root ? getComputedStyle(root).zIndex : null,
          fixedRootZIndex: fixedRoot ? getComputedStyle(fixedRoot).zIndex : null,
        };
      });

      // Z-index hierarchy: #lines-root (1) < #root (2) < #fixed-root (9999)
      // Lines are BELOW content (#root)
      const linesZ = parseInt(zIndexInfo.linesRootZIndex) || 0;
      const rootZ = parseInt(zIndexInfo.rootZIndex) || 0;
      const fixedZ = parseInt(zIndexInfo.fixedRootZIndex) || 0;

      expect(linesZ, 'lines-root should be below root (content)').toBeLessThan(rootZ);
      expect(rootZ, 'root should be below fixed-root').toBeLessThan(fixedZ);
    });
  }
});
