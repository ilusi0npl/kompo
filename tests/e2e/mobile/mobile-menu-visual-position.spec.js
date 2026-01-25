// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Strict test: MobileMenu panel must start at TOP of viewport (top: 0).
 * The white menu background should touch the top edge of the screen.
 */

test.describe('MobileMenu - Visual Top Position (STRICT)', () => {

  test('menu white panel must start at TOP of viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/media');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Scroll down first (simulating user behavior)
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(200);

    // Open menu
    await page.locator('button:has-text("MENU")').first().click();
    await page.waitForTimeout(500);

    // Get the ACTUAL visual position of the menu container (the white panel)
    const menuPosition = await page.evaluate(() => {
      // Find the menu container - it should have fixed position and white background
      const menuRoot = document.getElementById('mobile-menu-root');
      const menuPanel = menuRoot?.querySelector('[role="dialog"]');

      if (!menuPanel) {
        // Try finding by class
        const fixedEl = menuRoot?.querySelector('.fixed');
        if (fixedEl) {
          const rect = fixedEl.getBoundingClientRect();
          const style = getComputedStyle(fixedEl);
          return {
            found: true,
            selector: '.fixed',
            top: rect.top,
            right: window.innerWidth - rect.right,
            height: rect.height,
            position: style.position,
            cssTop: style.top,
            cssRight: style.right,
            transformMatrix: style.transform,
          };
        }
        return { found: false };
      }

      const rect = menuPanel.getBoundingClientRect();
      const style = getComputedStyle(menuPanel);
      return {
        found: true,
        selector: '[role="dialog"]',
        top: rect.top,
        right: window.innerWidth - rect.right,
        height: rect.height,
        position: style.position,
        cssTop: style.top,
        cssRight: style.right,
        transformMatrix: style.transform,
      };
    });

    console.log('Menu visual position:', menuPosition);

    // Take screenshot
    await page.screenshot({ path: 'test-results/menu-visual-check.png' });

    expect(menuPosition.found, 'Menu panel should exist').toBe(true);

    // STRICT: Menu panel MUST be at viewport top (within 2px tolerance)
    expect(
      menuPosition.top,
      `Menu panel visual top MUST be 0 (or very close). Actual: ${menuPosition.top}px. ` +
      `If this is > 5px, menu is NOT at top of screen!`
    ).toBeLessThanOrEqual(2);

    // Menu should be at right edge
    expect(
      menuPosition.right,
      `Menu panel visual right MUST be 0. Actual: ${menuPosition.right}px`
    ).toBeLessThanOrEqual(2);
  });

  test('menu must cover the header area when open', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Get header position BEFORE opening menu
    const headerPos = await page.evaluate(() => {
      const menuBtn = document.querySelector('button');
      return menuBtn ? menuBtn.getBoundingClientRect().top : null;
    });
    console.log('Header MENU button top before opening:', headerPos);

    // Open menu
    await page.locator('button:has-text("MENU")').first().click();
    await page.waitForTimeout(500);

    // The menu close button should be ABOVE or AT the same level as where the MENU button was
    // Because the menu should cover from top: 0
    const closePos = await page.evaluate(() => {
      const closeBtn = document.querySelector('.mobile-menu-close');
      return closeBtn ? closeBtn.getBoundingClientRect().top : null;
    });
    console.log('Close button top after opening:', closePos);

    // Close button (at ~44px) should be above the original MENU button position
    // This proves the menu starts from top: 0 and covers the header
    expect(closePos, 'Close button should exist').not.toBeNull();
    expect(
      closePos,
      `Close button (${closePos}px) should be in upper area of viewport`
    ).toBeLessThan(100);
  });
});
