// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test that MobileMenu stays fixed and doesn't scroll with page content.
 * The menu should cover the viewport and not move when scrolling.
 */

test.describe('MobileMenu - Fixed Position (All Pages)', () => {
  const pages = ['/bio', '/', '/media', '/kalendarz', '/repertuar', '/fundacja', '/kontakt'];

  for (const pagePath of pages) {
    test(`menu should NOT scroll on ${pagePath}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // Open the menu
      const menuButton = page.locator('button:has-text("MENU")').first();
      await menuButton.click();
      await page.waitForTimeout(300);

      // Verify menu is open - find the nav links
      const bioLink = page.locator('.nav-link:has-text("Bio")').first();
      await expect(bioLink).toBeVisible();

      // Get initial position of menu items
      const initialBioPosition = await bioLink.boundingBox();
      expect(initialBioPosition, 'Bio link should have bounding box').not.toBeNull();

      console.log(`[${pagePath}] Initial Bio link position: top=${initialBioPosition?.y}`);

      // Scroll the page while menu is open
      await page.evaluate(() => {
        window.scrollBy(0, 500);
      });
      await page.waitForTimeout(200);

      // Get position after scroll
      const scrolledBioPosition = await bioLink.boundingBox();
      expect(scrolledBioPosition, 'Bio link should still have bounding box after scroll').not.toBeNull();

      console.log(`[${pagePath}] After scroll Bio link position: top=${scrolledBioPosition?.y}`);

      // Menu should NOT have moved - it should be fixed
      if (initialBioPosition && scrolledBioPosition) {
        const positionDiff = Math.abs(scrolledBioPosition.y - initialBioPosition.y);
        console.log(`[${pagePath}] Position difference: ${positionDiff}px`);

        expect(
          positionDiff,
          `Menu should be FIXED and NOT scroll with page on ${pagePath}. Position moved by ${positionDiff}px`
        ).toBeLessThanOrEqual(5);
      }
    });
  }
});
