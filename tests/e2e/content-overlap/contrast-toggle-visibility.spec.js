// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Tests for contrast toggle visibility in high contrast mode.
 *
 * Problem: When high contrast mode is enabled, CSS filter: grayscale(1) is applied
 * to page elements. The contrast toggle icon uses yellow (#FFBD19) color when active.
 * Without proper CSS exclusions, the yellow icon becomes gray and invisible on
 * the white/gray background.
 *
 * Solution: The .controls-container class excludes the toggle and its children
 * from the grayscale filter, keeping the yellow icon visible.
 */
test.describe('Contrast Toggle Visibility in High Contrast Mode', () => {
  const pages = [
    { path: '/media', name: 'Media', screenshotName: 'media' },
    { path: '/media/wideo', name: 'MediaWideo', screenshotName: 'media-wideo' },
    { path: '/bio', name: 'Bio', screenshotName: 'bio' },
    { path: '/kalendarz', name: 'Kalendarz', screenshotName: 'kalendarz' },
  ];

  for (const { path, name, screenshotName } of pages) {
    test(`${name}: contrast toggle should be visible in high contrast mode`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // Find and click contrast toggle
      const contrastToggle = page.locator('.contrast-toggle-btn');
      await expect(contrastToggle).toBeVisible();

      // Enable high contrast
      await contrastToggle.click();
      await page.waitForTimeout(500);

      // Verify high contrast is enabled
      const bodyClass = await page.evaluate(() => document.body.className);
      expect(bodyClass).toContain('high-contrast');

      // Check that contrast toggle is still visible
      await expect(contrastToggle).toBeVisible();

      // Check opacity - should not be 0 or very low
      const opacity = await contrastToggle.evaluate(el => {
        const style = getComputedStyle(el);
        return parseFloat(style.opacity);
      });
      console.log(`${name} contrast toggle opacity:`, opacity);
      expect(opacity).toBeGreaterThan(0.5);

      // Check visibility CSS property
      const visibility = await contrastToggle.evaluate(el => {
        const style = getComputedStyle(el);
        return {
          visibility: style.visibility,
          display: style.display,
          opacity: style.opacity,
          filter: style.filter,
        };
      });
      console.log(`${name} contrast toggle styles:`, visibility);

      expect(visibility.visibility).not.toBe('hidden');
      expect(visibility.display).not.toBe('none');
    });

    test(`${name}: contrast toggle icon should have yellow color (not grayscale) in high contrast mode`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const contrastToggle = page.locator('.contrast-toggle-btn');
      await contrastToggle.click();
      await page.waitForTimeout(500);

      // Check the SVG path fill color - should be yellow/orange (NOT grayscale)
      const pathColor = await page.evaluate(() => {
        const path = document.querySelector('.contrast-toggle-btn svg path');
        if (!path) return null;
        const style = getComputedStyle(path);
        return style.fill;
      });

      console.log(`${name} path fill color:`, pathColor);

      // Parse the RGB values
      const rgbMatch = pathColor?.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      expect(rgbMatch).not.toBeNull();

      const [, r, g, b] = rgbMatch.map(Number);
      console.log(`${name} RGB values: R=${r}, G=${g}, B=${b}`);

      // The path fill should be yellow/orange-ish (high R, medium G, low B)
      // NOT grayscale (where R ≈ G ≈ B)
      // Yellow #FFBD19 = (255, 189, 25), darker yellow might be (207, 154, 24)
      expect(r).toBeGreaterThan(180); // Red should be high
      expect(g).toBeGreaterThan(100); // Green should be medium-high
      expect(b).toBeLessThan(100);    // Blue should be low

      // Verify it's NOT grayscale by checking R, G, B are not all similar
      const isGrayscale = Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && Math.abs(r - b) < 20;
      expect(isGrayscale).toBe(false);

      // Also verify the controls-container has filter: none
      const containerFilter = await page.evaluate(() => {
        const container = document.querySelector('.controls-container');
        if (!container) return 'no-container';
        return getComputedStyle(container).filter;
      });

      console.log(`${name} controls-container filter:`, containerFilter);
      expect(containerFilter).toBe('none');
    });
  }
});
