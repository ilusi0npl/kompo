// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test MobileMenu position at NON-390px viewports where scale != 1.
 * This catches the bug where menu appears in the middle instead of top-right.
 */

test.describe('MobileMenu - Scaled Viewport Position', () => {
  // Test at viewport widths where scale != 1
  const scaledViewports = [
    { width: 320, height: 568, scale: 320 / 390 },  // scale = 0.82
    { width: 375, height: 667, scale: 375 / 390 },  // scale = 0.96
    { width: 414, height: 896, scale: 414 / 390 },  // scale = 1.06
    { width: 428, height: 926, scale: 428 / 390 },  // scale = 1.10
    { width: 600, height: 900, scale: 600 / 390 },  // scale = 1.54 (larger)
  ];

  for (const viewport of scaledViewports) {
    test(`menu at top-right at ${viewport.width}px (scale=${viewport.scale.toFixed(2)})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/media');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // Check if MENU button exists (only on mobile <768px)
      const menuButton = page.locator('button:has-text("MENU")').first();
      const menuExists = await menuButton.count() > 0;

      if (!menuExists) {
        console.log(`[${viewport.width}px] No MENU button - likely desktop view, skipping`);
        return;
      }

      // Open menu
      await menuButton.click();
      await page.waitForTimeout(500);

      // Take screenshot BEFORE checking position
      await page.screenshot({
        path: `test-results/menu-scaled-${viewport.width}px.png`,
        fullPage: false
      });

      // Get menu position
      const menuPosition = await page.evaluate(() => {
        const menuRoot = document.getElementById('mobile-menu-root');
        if (!menuRoot) return { error: 'no-root' };

        // Find the fixed menu panel
        const menuPanel = menuRoot.querySelector('.fixed') ||
                          menuRoot.querySelector('[role="dialog"]') ||
                          menuRoot.firstElementChild;

        if (!menuPanel) return { error: 'no-panel', rootHTML: menuRoot.innerHTML.substring(0, 100) };

        const rect = menuPanel.getBoundingClientRect();
        const style = getComputedStyle(menuPanel);

        return {
          found: true,
          // Visual position in viewport
          visualTop: rect.top,
          visualRight: window.innerWidth - rect.right,
          visualBottom: rect.bottom,
          visualLeft: rect.left,
          // CSS values
          position: style.position,
          cssTop: style.top,
          cssRight: style.right,
          // Viewport info
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          // Panel dimensions
          panelWidth: rect.width,
          panelHeight: rect.height,
        };
      });

      console.log(`[${viewport.width}px] Menu position:`, JSON.stringify(menuPosition, null, 2));

      expect(menuPosition.error).toBeUndefined();
      expect(menuPosition.found).toBe(true);

      // CRITICAL: Menu must be at TOP of viewport (visual top = 0)
      expect(
        menuPosition.visualTop,
        `Menu visual top at ${viewport.width}px should be 0, got ${menuPosition.visualTop}px`
      ).toBeLessThanOrEqual(5);

      // CRITICAL: Menu must be at RIGHT edge of viewport
      expect(
        menuPosition.visualRight,
        `Menu visual right at ${viewport.width}px should be 0, got ${menuPosition.visualRight}px`
      ).toBeLessThanOrEqual(5);

      // Position should be fixed
      expect(menuPosition.position).toBe('fixed');
    });
  }

  test('menu position is independent of scroll at scaled viewport', async ({ page }) => {
    // Use 414px width (iPhone XR) where scale = 1.06
    await page.setViewportSize({ width: 414, height: 896 });
    await page.goto('/media');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Scroll down first
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);

    // Open menu
    const menuButton = page.locator('button:has-text("MENU")').first();
    await menuButton.click();
    await page.waitForTimeout(500);

    // Get position
    const menuPosition = await page.evaluate(() => {
      const menuRoot = document.getElementById('mobile-menu-root');
      const menuPanel = menuRoot?.querySelector('.fixed') || menuRoot?.querySelector('[role="dialog"]');

      if (!menuPanel) return { found: false };

      const rect = menuPanel.getBoundingClientRect();
      return {
        found: true,
        visualTop: rect.top,
        visualRight: window.innerWidth - rect.right,
        scrollY: window.scrollY,
      };
    });

    console.log('Position after scroll at 414px:', menuPosition);

    expect(menuPosition.found).toBe(true);

    // Even after scrolling, menu should still be at top of VIEWPORT
    expect(
      menuPosition.visualTop,
      `Menu should stay at top (visualTop=0) after scroll, got ${menuPosition.visualTop}px`
    ).toBeLessThanOrEqual(5);
  });

  test('compare menu position in ResponsiveWrapper vs direct', async ({ page }) => {
    // This test checks if the issue is related to ResponsiveWrapper transform
    await page.setViewportSize({ width: 414, height: 896 });
    await page.goto('/');  // Homepage uses direct MobileHomepage (not MobileHeader)
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Open menu
    const menuButton = page.locator('button:has-text("MENU")').first();
    if (await menuButton.count() > 0) {
      await menuButton.click();
      await page.waitForTimeout(500);

      const homepageMenuPos = await page.evaluate(() => {
        const menuRoot = document.getElementById('mobile-menu-root');
        const menuPanel = menuRoot?.querySelector('.fixed');
        if (!menuPanel) return null;
        const rect = menuPanel.getBoundingClientRect();
        return { top: rect.top, right: window.innerWidth - rect.right };
      });

      console.log('Homepage menu position:', homepageMenuPos);

      // Close menu
      await page.locator('.mobile-menu-close').click();
      await page.waitForTimeout(300);
    }

    // Now navigate to /media which uses MobileHeader
    await page.goto('/media');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const mediaMenuBtn = page.locator('button:has-text("MENU")').first();
    if (await mediaMenuBtn.count() > 0) {
      await mediaMenuBtn.click();
      await page.waitForTimeout(500);

      const mediaMenuPos = await page.evaluate(() => {
        const menuRoot = document.getElementById('mobile-menu-root');
        const menuPanel = menuRoot?.querySelector('.fixed');
        if (!menuPanel) return null;
        const rect = menuPanel.getBoundingClientRect();
        return { top: rect.top, right: window.innerWidth - rect.right };
      });

      console.log('Media menu position:', mediaMenuPos);

      // Both should be at top-right
      expect(mediaMenuPos?.top).toBeLessThanOrEqual(5);
      expect(mediaMenuPos?.right).toBeLessThanOrEqual(5);
    }
  });
});
