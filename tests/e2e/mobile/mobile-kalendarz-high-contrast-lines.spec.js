import { test, expect } from '@playwright/test';

/**
 * Test for decorative lines visibility in high contrast mode on mobile.
 *
 * Problem: In high contrast mode on /kalendarz mobile, the fixed header
 * (MobileHeader portal) is missing visible decorative lines while the
 * scrollable content section has them.
 *
 * Root cause: MobileHeader lines don't have the `decorative-line` class
 * which is required for the CSS rule to apply dark color.
 */

test.describe('Kalendarz Mobile - High Contrast Decorative Lines', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('fixed header should have decorative-line elements', async ({ page }) => {
    await page.goto('/kalendarz');
    await page.waitForLoadState('networkidle');

    // Check that fixed header has lines with decorative-line class
    const headerLines = page.locator('#mobile-header-root .decorative-line');
    const count = await headerLines.count();

    console.log(`Fixed header has ${count} decorative-line elements`);
    expect(count, 'Fixed header should have decorative-line elements').toBeGreaterThan(0);
  });

  test('fixed header decorative lines should be visible in high contrast', async ({ page }) => {
    await page.goto('/kalendarz');
    await page.waitForLoadState('networkidle');

    // Enable high contrast mode
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    });
    await page.waitForTimeout(300);

    // Check lines in fixed header portal
    const headerLines = page.locator('#mobile-header-root .decorative-line');
    const count = await headerLines.count();

    console.log(`Fixed header has ${count} decorative-line elements in high contrast`);
    expect(count, 'Fixed header should have decorative-line elements').toBeGreaterThan(0);

    // Check that lines have dark background color in high contrast
    for (let i = 0; i < count; i++) {
      const line = headerLines.nth(i);
      const bgColor = await line.evaluate(el => getComputedStyle(el).backgroundColor);

      console.log(`Header line ${i + 1} background color: ${bgColor}`);

      // Should be dark (#131313 = rgb(19, 19, 19))
      expect(bgColor, `Line ${i + 1} should have dark background in high contrast`).toBe('rgb(19, 19, 19)');
    }
  });

  test('scrollable content decorative lines should match fixed header lines', async ({ page }) => {
    await page.goto('/kalendarz');
    await page.waitForLoadState('networkidle');

    // Enable high contrast mode
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    });
    await page.waitForTimeout(300);

    // Count lines in both sections
    const headerLines = page.locator('#mobile-header-root .decorative-line');
    const contentLines = page.locator('section[data-section="kalendarz-mobile"] .decorative-line');

    const headerCount = await headerLines.count();
    const contentCount = await contentLines.count();

    console.log(`Header lines: ${headerCount}, Content lines: ${contentCount}`);

    // Both should have 3 lines (mobileLinePositions = [97, 195, 292])
    expect(headerCount, 'Fixed header should have 3 decorative lines').toBe(3);
    expect(contentCount, 'Content section should have 3 decorative lines').toBe(3);

    // Compare colors - both should be dark in high contrast
    const headerBg = await headerLines.first().evaluate(el => getComputedStyle(el).backgroundColor);
    const contentBg = await contentLines.first().evaluate(el => getComputedStyle(el).backgroundColor);

    console.log(`Header line color: ${headerBg}, Content line color: ${contentBg}`);
    expect(headerBg, 'Header and content lines should have same color').toBe(contentBg);
  });

  test('all pages with MobileHeader should have decorative lines in high contrast', async ({ page }) => {
    const pagesWithFixedHeader = [
      '/kalendarz',
      '/archiwalne',
      '/media',
      '/media/wideo',
      '/fundacja',
      '/kontakt',
    ];

    for (const pagePath of pagesWithFixedHeader) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');

      // Enable high contrast mode
      await page.evaluate(() => {
        document.body.classList.add('high-contrast');
        localStorage.setItem('highContrast', 'true');
      });
      await page.waitForTimeout(200);

      // Check for decorative lines in header
      const headerLines = page.locator('#mobile-header-root .decorative-line');
      const count = await headerLines.count();

      console.log(`${pagePath}: ${count} decorative-line elements in header`);

      // Each page should have 3 lines
      expect(count, `${pagePath} should have 3 decorative-line elements in header`).toBe(3);

      // Check color
      if (count > 0) {
        const bgColor = await headerLines.first().evaluate(el => getComputedStyle(el).backgroundColor);
        expect(bgColor, `${pagePath} header lines should be dark`).toBe('rgb(19, 19, 19)');
      }
    }
  });
});
