// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test that verifies the grayscale filter inheritance issue.
 *
 * BUG: Parent element has grayscale filter which affects child rendering,
 * even if child has its own filter. CSS filters don't "reset" inherited effects.
 */

test.describe('MobileMenu - Contrast Toggle Grayscale Bug', () => {

  test('verify parent grayscale affects contrast toggle rendering', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Open menu and enable high contrast
    await page.locator('button:has-text("MENU")').first().click();
    await page.waitForTimeout(500);
    await page.locator('#mobile-menu-root .contrast-toggle-btn').click();
    await page.waitForTimeout(500);

    // Check the filter cascade - use proper selectors
    const filterCascade = await page.evaluate(() => {
      const menuRoot = document.getElementById('mobile-menu-root');
      const dialogDiv = menuRoot?.querySelector('[role="dialog"]');
      const nav = dialogDiv?.querySelector('nav');
      const toggle = document.querySelector('#mobile-menu-root .contrast-toggle-btn');
      const svg = toggle?.querySelector('svg');
      const path = toggle?.querySelector('path');

      const getFilter = (el) => el ? getComputedStyle(el).filter : null;
      const getClasses = (el) => el ? el.className : null;

      // Walk up from toggle to find all ancestors with filters
      const ancestors = [];
      let current = toggle?.parentElement;
      while (current && current !== menuRoot) {
        ancestors.push({
          tag: current.tagName,
          classes: current.className,
          role: current.getAttribute('role'),
          filter: getFilter(current),
        });
        current = current.parentElement;
      }

      return {
        menuRoot: getFilter(menuRoot),
        dialogDiv: { filter: getFilter(dialogDiv), classes: getClasses(dialogDiv) },
        nav: getFilter(nav),
        toggle: getFilter(toggle),
        svg: getFilter(svg),
        path: getFilter(path),
        ancestors,
      };
    });

    console.log('Filter cascade in high contrast mode:', JSON.stringify(filterCascade, null, 2));

    // Check if any ancestor of toggle has grayscale
    const hasGrayscaleAncestor = filterCascade.ancestors.some(a => a.filter && a.filter.includes('grayscale'));

    console.log('Has grayscale ancestor:', hasGrayscaleAncestor);

    // This test should PASS - no ancestor should have grayscale
    expect(
      hasGrayscaleAncestor,
      'Contrast toggle ancestors should NOT have grayscale filter (it makes toggle invisible)'
    ).toBe(false);
  });

  test('screenshot: contrast toggle should be yellow, not gray', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Open menu
    await page.locator('button:has-text("MENU")').first().click();
    await page.waitForTimeout(500);

    // Enable high contrast
    await page.locator('#mobile-menu-root .contrast-toggle-btn').click();
    await page.waitForTimeout(500);

    // Get the contrast toggle's rendered pixel color
    // We'll take a screenshot of just the toggle and analyze it
    const toggle = page.locator('#mobile-menu-root .contrast-toggle-btn');
    await toggle.screenshot({ path: 'test-results/contrast-toggle-icon-color.png' });

    // Check if the SVG has the expected yellow color
    const toggleInfo = await page.evaluate(() => {
      const toggle = document.querySelector('#mobile-menu-root .contrast-toggle-btn');
      const svg = toggle?.querySelector('svg');
      const path = toggle?.querySelector('path');

      return {
        svgColor: svg ? getComputedStyle(svg).color : null,
        pathFill: path ? getComputedStyle(path).fill : null,
        // Expected: rgb(255, 189, 25) which is #FFBD19 (yellow)
      };
    });

    console.log('Toggle icon colors:', toggleInfo);

    // The SVG should have yellow color when active
    // Yellow in RGB: rgb(255, 189, 25)
    expect(toggleInfo.svgColor).toBe('rgb(255, 189, 25)');
  });
});
