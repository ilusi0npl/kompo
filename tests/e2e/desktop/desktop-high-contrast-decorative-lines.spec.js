import { test, expect } from '@playwright/test';

test.describe('Desktop High Contrast - Decorative Lines', () => {
  const pages = [
    { path: '/wydarzenie/1', name: 'Wydarzenie', section: 'wydarzenie' },
    { path: '/repertuar', name: 'Repertuar', section: 'repertuar' },
    { path: '/specialne', name: 'Specialne', section: 'specialne' },
    { path: '/media', name: 'Media', section: 'media' },
    { path: '/fundacja', name: 'Fundacja', section: 'fundacja' },
    { path: '/media/wideo', name: 'MediaWideo', section: 'media-wideo' },
    { path: '/kalendarz', name: 'Kalendarz', section: 'kalendarz' },
    { path: '/archiwalne', name: 'Archiwalne', section: 'archiwalne' },
    { path: '/kontakt', name: 'Kontakt', section: 'kontakt' },
  ];

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  for (const { path, name, section } of pages) {
    test(`${name} should have decorative lines in high contrast`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // Enable high contrast
      await page.evaluate(() => {
        document.body.classList.add('high-contrast');
      });
      await page.waitForTimeout(300);

      // Check for decorative lines (now in #fixed-root)
      const lines = page.locator('#fixed-root .decorative-line');
      const count = await lines.count();

      expect(count, `${name} should have 6 decorative lines`).toBe(6);

      // Verify color in high contrast
      if (count > 0) {
        const lineColor = await lines.first().evaluate(el => getComputedStyle(el).backgroundColor);
        expect(lineColor, 'Lines should be dark in high contrast').toBe('rgb(19, 19, 19)');
      }
    });
  }
});
