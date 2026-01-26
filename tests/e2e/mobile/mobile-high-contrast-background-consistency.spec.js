import { test, expect } from '@playwright/test';

/**
 * Test: Mobile High Contrast Background Consistency
 *
 * Problem: In mobile high contrast mode, the fixed header area has white background
 * but the scrollable content area has gray background (filtered colored background).
 * Both areas should have the same white background (#FDFDFD) in high contrast mode.
 */
test.describe('Mobile High Contrast - Background Consistency', () => {
  const pages = [
    { path: '/kontakt', name: 'Kontakt' },
    { path: '/fundacja', name: 'Fundacja' },
    { path: '/media', name: 'Media' },
    { path: '/media/wideo', name: 'MediaWideo' },
    { path: '/bio/ensemble', name: 'BioEnsemble' },
  ];

  test.beforeEach(async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
  });

  for (const { path, name } of pages) {
    test(`${name} - fixed and scrollable areas should have same background in high contrast`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // Enable high contrast mode
      await page.evaluate(() => {
        document.body.classList.add('high-contrast');
      });
      await page.waitForTimeout(500);

      // Get background colors from fixed header and scrollable content
      const colors = await page.evaluate(() => {
        // Helper to get computed background color
        const getBgColor = (el) => {
          if (!el) return null;
          return getComputedStyle(el).backgroundColor;
        };

        // Fixed header area (in #mobile-header-root)
        const mobileHeaderRoot = document.getElementById('mobile-header-root');
        const fixedHeader = mobileHeaderRoot?.firstElementChild;

        // Scrollable content area (in #root)
        // Find the main content section with background color
        const mainContent = document.querySelector('[data-section]');

        // Also check ResponsiveWrapper's first child which often has background
        const root = document.getElementById('root');
        const responsiveWrapper = root?.firstElementChild;

        return {
          fixedHeaderBg: getBgColor(fixedHeader),
          mainContentBg: getBgColor(mainContent),
          responsiveWrapperBg: getBgColor(responsiveWrapper),
        };
      });

      // Expected white background in high contrast: rgb(253, 253, 253) = #FDFDFD
      const expectedWhite = 'rgb(253, 253, 253)';

      // Fixed header should be white
      expect(colors.fixedHeaderBg, `${name}: Fixed header should be white`).toBe(expectedWhite);

      // Main content should also be white (not gray from grayscale filter on colored bg)
      // This is the key assertion that should FAIL before the fix
      expect(colors.mainContentBg, `${name}: Main content should be white, not gray`).toBe(expectedWhite);
    });
  }
});
