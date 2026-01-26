// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test suite to verify vertical decorative lines are visible on all pages
 * at different viewport widths.
 *
 * Issue: Lines with width: `${1 * scale}px` become subpixel (<1px) at
 * smaller viewports, making them invisible.
 *
 * Fix: Lines should have fixed width: '1px' regardless of scale.
 */

// Pages with header background use FixedPortal lines (header covers LinesPortal)
// Pages without header background use LinesPortal lines (visible everywhere)
const PAGES_WITH_LINES = [
  { path: '/bio', name: 'Bio', portal: '#lines-root' },
  { path: '/media', name: 'Media', portal: '#fixed-root' },
  { path: '/media/wideo', name: 'MediaWideo', portal: '#fixed-root' },
  { path: '/kalendarz', name: 'Kalendarz', portal: '#fixed-root' },
  { path: '/archiwalne', name: 'Archiwalne', portal: '#fixed-root' },
  { path: '/repertuar', name: 'Repertuar', portal: '#fixed-root' },
  { path: '/specialne', name: 'Specjalne', portal: '#fixed-root' },
  { path: '/fundacja', name: 'Fundacja', portal: '#lines-root' },  // No header background
  { path: '/kontakt', name: 'Kontakt', portal: '#lines-root' },    // No header background
];

// Line positions from FixedLayer components
const LINE_POSITIONS = [155, 375, 595, 815, 1035, 1255];

// Test at different viewport widths to ensure lines remain visible
const VIEWPORTS = [
  { width: 1440, height: 900, name: 'full-width' },
  { width: 1280, height: 800, name: 'laptop' },
  { width: 1024, height: 768, name: 'small-desktop' },
  { width: 900, height: 700, name: 'narrow' },
];

test.describe('Vertical lines visibility', () => {
  for (const pageConfig of PAGES_WITH_LINES) {
    test.describe(`${pageConfig.name} page`, () => {
      for (const viewport of VIEWPORTS) {
        test(`lines visible at ${viewport.name} (${viewport.width}px)`, async ({ page: browserPage }) => {
          await browserPage.setViewportSize({ width: viewport.width, height: viewport.height });
          await browserPage.goto(pageConfig.path, { waitUntil: 'networkidle' });

          // Wait for page to render
          await browserPage.waitForTimeout(500);

          // Check that portal exists and has children
          const linesRoot = browserPage.locator(pageConfig.portal);
          await expect(linesRoot).toBeAttached();

          // Get all line elements from the appropriate portal
          const lineElements = browserPage.locator(`${pageConfig.portal} .decorative-line`);

          // We expect at least 6 lines (the LINE_POSITIONS array has 6 positions)
          const count = await lineElements.count();
          expect(count).toBeGreaterThanOrEqual(6);

          // Check that each line has computed width of exactly 1px
          const firstLine = lineElements.first();
          const computedWidth = await firstLine.evaluate((el) => {
            return window.getComputedStyle(el).width;
          });
          expect(computedWidth).toBe('1px');

          // Verify lines are positioned correctly (left positions should match LINE_POSITIONS * scale)
          const scale = viewport.width / 1440;
          for (let i = 0; i < Math.min(6, count); i++) {
            const line = lineElements.nth(i);
            const left = await line.evaluate((el) => {
              return parseFloat(window.getComputedStyle(el).left);
            });

            // Check that position roughly matches expected (with some tolerance for rounding)
            const expectedLeft = LINE_POSITIONS[i] * scale;
            expect(left).toBeCloseTo(expectedLeft, 0);
          }
        });
      }
    });
  }
});

test.describe('Vertical lines width consistency', () => {
  test('lines width should be 1px not scaled', async ({ page }) => {
    // Test at a viewport where scale would make subpixel lines
    await page.setViewportSize({ width: 800, height: 600 });
    await page.goto('/bio', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // At 800px viewport, scale = 800/1440 ≈ 0.556
    // If lines use `${1 * scale}px`, they would be ~0.556px (invisible)
    // With fixed '1px', they should remain 1px

    // Bio page uses #lines-root for decorative lines
    const lineElements = page.locator('#lines-root .decorative-line');
    const count = await lineElements.count();

    // If count is 0, lines are using scaled width (broken)
    expect(count).toBeGreaterThanOrEqual(6);

    // Verify first line has exactly 1px width
    const firstLine = lineElements.first();
    const box = await firstLine.boundingBox();

    // Width should be exactly 1px, not some fraction
    expect(box).not.toBeNull();
    expect(box?.width).toBe(1);
  });
});
