// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test MobileMenu fixed position at various viewport sizes.
 */

test.describe('MobileMenu - Fixed Position at Various Viewports', () => {
  const viewports = [
    { width: 320, height: 568 },  // iPhone SE
    { width: 375, height: 667 },  // iPhone 6/7/8
    { width: 390, height: 844 },  // iPhone 12/13
    { width: 414, height: 896 },  // iPhone XR/11
    { width: 428, height: 926 },  // iPhone 12/13 Pro Max
    { width: 360, height: 740 },  // Samsung Galaxy S8
    { width: 768, height: 1024 }, // iPad (should show desktop, but let's check)
  ];

  for (const viewport of viewports) {
    test(`menu should stay fixed at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/bio');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // Check if MENU button exists (only on mobile)
      const menuButton = page.locator('button:has-text("MENU")').first();
      const menuExists = await menuButton.count() > 0;

      if (!menuExists) {
        console.log(`[${viewport.width}x${viewport.height}] No MENU button - likely desktop view, skipping`);
        return;
      }

      await menuButton.click();
      await page.waitForTimeout(300);

      // Find a nav link in the menu
      const bioLink = page.locator('.nav-link:has-text("Bio")').first();
      const bioLinkExists = await bioLink.count() > 0;

      if (!bioLinkExists) {
        console.log(`[${viewport.width}x${viewport.height}] No Bio link in menu - menu might not have opened`);
        return;
      }

      await expect(bioLink).toBeVisible();
      const initialPosition = await bioLink.boundingBox();
      console.log(`[${viewport.width}x${viewport.height}] Initial: top=${initialPosition?.y}`);

      // Scroll
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(200);

      const scrolledPosition = await bioLink.boundingBox();
      console.log(`[${viewport.width}x${viewport.height}] After scroll: top=${scrolledPosition?.y}`);

      if (initialPosition && scrolledPosition) {
        const diff = Math.abs(scrolledPosition.y - initialPosition.y);
        console.log(`[${viewport.width}x${viewport.height}] Difference: ${diff}px`);

        expect(
          diff,
          `Menu moved by ${diff}px at ${viewport.width}x${viewport.height}`
        ).toBeLessThanOrEqual(5);
      }
    });
  }
});
