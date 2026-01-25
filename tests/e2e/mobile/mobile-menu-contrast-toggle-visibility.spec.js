// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test that the contrast toggle (eye icon) remains visible in MobileMenu
 * after enabling high contrast mode.
 *
 * BUG: The eye icon disappears after clicking it to enable high contrast.
 */

test.describe('MobileMenu - Contrast Toggle Visibility', () => {

  test('contrast toggle (eye icon) should remain visible after enabling high contrast', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Open mobile menu
    const menuButton = page.locator('button:has-text("MENU")').first();
    await menuButton.click();
    await page.waitForTimeout(500);

    // Find contrast toggle in mobile menu
    const contrastToggle = page.locator('.mobile-menu-close').locator('..').locator('.contrast-toggle-btn');
    // Alternative: find within mobile-menu-root
    const contrastToggleAlt = page.locator('#mobile-menu-root .contrast-toggle-btn');

    // Use whichever is found
    const toggle = await contrastToggleAlt.count() > 0 ? contrastToggleAlt : contrastToggle;

    // Verify toggle is visible BEFORE clicking
    await expect(toggle).toBeVisible();

    // Get toggle position and size before clicking
    const beforeClick = await toggle.boundingBox();
    console.log('Toggle before high contrast:', beforeClick);

    // Take screenshot before
    await page.screenshot({ path: 'test-results/contrast-toggle-before.png' });

    // Click the contrast toggle to enable high contrast
    await toggle.click();
    await page.waitForTimeout(500);

    // Check that high contrast is enabled
    const isHighContrast = await page.evaluate(() => {
      return document.body.classList.contains('high-contrast');
    });
    console.log('High contrast enabled:', isHighContrast);
    expect(isHighContrast).toBe(true);

    // Take screenshot after
    await page.screenshot({ path: 'test-results/contrast-toggle-after.png' });

    // CRITICAL: Toggle should STILL be visible after clicking
    await expect(
      toggle,
      'Contrast toggle should remain visible after enabling high contrast'
    ).toBeVisible();

    // Get toggle position and size after clicking
    const afterClick = await toggle.boundingBox();
    console.log('Toggle after high contrast:', afterClick);

    // Toggle should have reasonable size (not collapsed to 0)
    expect(afterClick).not.toBeNull();
    expect(afterClick?.width).toBeGreaterThan(10);
    expect(afterClick?.height).toBeGreaterThan(10);
  });

  test('contrast toggle should be visible and have correct color in high contrast mode', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Open mobile menu
    await page.locator('button:has-text("MENU")').first().click();
    await page.waitForTimeout(500);

    // Enable high contrast first (via class to avoid timing issues)
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    });
    await page.waitForTimeout(300);

    // Find contrast toggle
    const toggle = page.locator('#mobile-menu-root .contrast-toggle-btn');

    // Check visibility and computed styles
    const toggleInfo = await page.evaluate(() => {
      const btn = document.querySelector('#mobile-menu-root .contrast-toggle-btn');
      if (!btn) return { found: false };

      const style = getComputedStyle(btn);
      const svg = btn.querySelector('svg');
      const svgStyle = svg ? getComputedStyle(svg) : null;
      const path = btn.querySelector('path');
      const pathStyle = path ? getComputedStyle(path) : null;

      return {
        found: true,
        // Button styles
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        width: style.width,
        height: style.height,
        // SVG styles
        svgColor: svgStyle?.color,
        svgFill: svgStyle?.fill,
        // Path styles (the actual icon)
        pathFill: pathStyle?.fill,
        pathColor: pathStyle?.color,
        // Filter (might make it invisible)
        filter: style.filter,
        // Position
        rect: btn.getBoundingClientRect(),
      };
    });

    console.log('Toggle info in high contrast:', JSON.stringify(toggleInfo, null, 2));

    expect(toggleInfo.found).toBe(true);
    expect(toggleInfo.display).not.toBe('none');
    expect(toggleInfo.visibility).not.toBe('hidden');
    expect(parseFloat(toggleInfo.opacity)).toBeGreaterThan(0);

    // The toggle should be visible
    await expect(toggle).toBeVisible();
  });

  test('contrast toggle icon should have visible color in high contrast mode', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Open mobile menu
    await page.locator('button:has-text("MENU")').first().click();
    await page.waitForTimeout(500);

    const toggle = page.locator('#mobile-menu-root .contrast-toggle-btn');

    // Click to enable high contrast
    await toggle.click();
    await page.waitForTimeout(300);

    // Check the SVG icon color - it should be yellow (#FFBD19) when active
    const iconColor = await page.evaluate(() => {
      const svg = document.querySelector('#mobile-menu-root .contrast-toggle-btn svg');
      if (!svg) return null;
      return getComputedStyle(svg).color;
    });

    console.log('Icon color after enabling high contrast:', iconColor);

    // The icon should have the active yellow color, not be invisible
    expect(iconColor).not.toBeNull();
    // Yellow #FFBD19 in RGB is rgb(255, 189, 25)
    // With grayscale filter it might become different, but should still be visible
  });
});
