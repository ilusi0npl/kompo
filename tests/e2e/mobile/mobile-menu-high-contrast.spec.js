// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test MobileMenu position when HIGH CONTRAST mode is enabled.
 *
 * BUG: In high contrast mode, #mobile-menu-root gets filter: contrast(1.5) grayscale(1)
 * which creates a new containing block, breaking position: fixed inside it.
 */

test.describe('MobileMenu - High Contrast Mode Position', () => {

  test('menu should be at top-right even with HIGH CONTRAST enabled', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/media');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // ENABLE HIGH CONTRAST MODE first
    const contrastToggle = page.locator('.contrast-toggle-btn').first();
    if (await contrastToggle.count() > 0) {
      await contrastToggle.click();
      await page.waitForTimeout(300);
    } else {
      // Try finding by aria-label
      const altToggle = page.locator('button[aria-label*="kontrast"], button[aria-label*="Contrast"]').first();
      if (await altToggle.count() > 0) {
        await altToggle.click();
        await page.waitForTimeout(300);
      }
    }

    // Verify high contrast is enabled
    const isHighContrast = await page.evaluate(() => {
      return document.body.classList.contains('high-contrast');
    });
    console.log('High contrast enabled:', isHighContrast);

    // If we couldn't enable high contrast, enable it manually via class
    if (!isHighContrast) {
      await page.evaluate(() => {
        document.body.classList.add('high-contrast');
      });
      console.log('Manually added high-contrast class');
    }

    // Take screenshot BEFORE opening menu
    await page.screenshot({
      path: 'test-results/menu-high-contrast-before.png',
      fullPage: false
    });

    // Open the menu
    const menuButton = page.locator('button:has-text("MENU")').first();
    await menuButton.click();
    await page.waitForTimeout(500);

    // Take screenshot after opening menu
    await page.screenshot({
      path: 'test-results/menu-high-contrast-after.png',
      fullPage: false
    });

    // Check menu position
    const menuPosition = await page.evaluate(() => {
      const menuRoot = document.getElementById('mobile-menu-root');
      if (!menuRoot) return { error: 'no-root' };

      // Check if filter is applied to menu root (the cause of the bug)
      const menuRootStyle = getComputedStyle(menuRoot);
      const menuRootFilter = menuRootStyle.filter;

      const menuPanel = menuRoot.querySelector('.fixed') || menuRoot.querySelector('[role="dialog"]');
      if (!menuPanel) return {
        error: 'no-panel',
        menuRootFilter,
        menuRootPosition: menuRootStyle.position,
        highContrastEnabled: document.body.classList.contains('high-contrast'),
      };

      const rect = menuPanel.getBoundingClientRect();
      const style = getComputedStyle(menuPanel);

      return {
        found: true,
        // Visual position in viewport
        visualTop: rect.top,
        visualRight: window.innerWidth - rect.right,
        // CSS values
        position: style.position,
        cssTop: style.top,
        cssRight: style.right,
        // High contrast diagnostics
        highContrastEnabled: document.body.classList.contains('high-contrast'),
        menuRootFilter,
        menuRootPosition: menuRootStyle.position,
        menuRootTop: menuRoot.getBoundingClientRect().top,
        menuRootRight: window.innerWidth - menuRoot.getBoundingClientRect().right,
        // Viewport info
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      };
    });

    console.log('Menu position in HIGH CONTRAST mode:', JSON.stringify(menuPosition, null, 2));

    expect(menuPosition.error).toBeUndefined();
    expect(menuPosition.found).toBe(true);

    // Verify high contrast is enabled
    expect(menuPosition.highContrastEnabled).toBe(true);

    // THE BUG: In high contrast mode, filter on #mobile-menu-root breaks position: fixed
    // Menu should STILL be at top: 0, right: 0 of the VIEWPORT
    expect(
      menuPosition.visualTop,
      `Menu visual top should be 0 in high contrast mode, but got ${menuPosition.visualTop}px. ` +
      `menuRootFilter: ${menuPosition.menuRootFilter}`
    ).toBeLessThanOrEqual(5);

    expect(
      menuPosition.visualRight,
      `Menu visual right should be 0 in high contrast mode, but got ${menuPosition.visualRight}px`
    ).toBeLessThanOrEqual(5);
  });

  test('CSS fix: filter only on specific elements, not containers', async ({ page }) => {
    // Verify that our CSS fix correctly applies filter only to specific elements
    // (nav links, close button, language toggle) and NOT to container elements
    // This preserves position: fixed AND keeps contrast toggle visible (no grayscale on ancestors)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/media');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Enable high contrast mode via CSS class
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
    });
    await page.waitForTimeout(100);

    // Open menu
    const menuButton = page.locator('button:has-text("MENU")').first();
    await menuButton.click();
    await page.waitForTimeout(500);

    // Verify CSS fix: filter should be applied to specific elements, not containers
    const cssCheck = await page.evaluate(() => {
      const menuRoot = document.getElementById('mobile-menu-root');
      const menuPanel = menuRoot?.querySelector('.fixed');
      const navLink = menuRoot?.querySelector('.nav-link');
      const closeBtn = menuRoot?.querySelector('.mobile-menu-close');
      const langToggle = menuRoot?.querySelector('.language-toggle');
      const contrastToggle = menuRoot?.querySelector('.contrast-toggle-btn');

      if (!menuRoot || !menuPanel) return { error: 'elements not found' };

      const getFilter = el => el ? getComputedStyle(el).filter : null;

      return {
        // Container should have NO filter (preserves position: fixed)
        menuRootFilter: getFilter(menuRoot),
        menuRootHasFilter: getFilter(menuRoot) !== 'none',
        // Menu panel should have NO filter (preserves position: fixed)
        menuPanelFilter: getFilter(menuPanel),
        menuPanelHasFilter: getFilter(menuPanel) !== 'none',
        // Specific elements SHOULD have filter for high contrast effect
        navLinkFilter: getFilter(navLink),
        navLinkHasFilter: getFilter(navLink) !== 'none',
        closeBtnFilter: getFilter(closeBtn),
        closeBtnHasFilter: getFilter(closeBtn) !== 'none',
        langToggleFilter: getFilter(langToggle),
        langToggleHasFilter: getFilter(langToggle) !== 'none',
        // Contrast toggle should have contrast ONLY (no grayscale)
        contrastToggleFilter: getFilter(contrastToggle),
        contrastToggleHasGrayscale: getFilter(contrastToggle)?.includes('grayscale'),
        // Position should work correctly
        visualTop: menuPanel.getBoundingClientRect().top,
      };
    });

    console.log('CSS fix verification:', cssCheck);

    // Containers should NOT have filter (preserves position: fixed)
    expect(
      cssCheck.menuRootHasFilter,
      `#mobile-menu-root should NOT have filter, but has: ${cssCheck.menuRootFilter}`
    ).toBe(false);

    expect(
      cssCheck.menuPanelHasFilter,
      `Menu panel should NOT have filter (preserves fixed positioning)`
    ).toBe(false);

    // Specific elements SHOULD have filter for high contrast effect
    expect(
      cssCheck.navLinkHasFilter,
      `Nav links should have filter for high contrast`
    ).toBe(true);

    expect(
      cssCheck.closeBtnHasFilter,
      `Close button should have filter for high contrast`
    ).toBe(true);

    expect(
      cssCheck.langToggleHasFilter,
      `Language toggle should have filter for high contrast`
    ).toBe(true);

    // Contrast toggle should NOT have grayscale (keeps yellow visible)
    expect(
      cssCheck.contrastToggleHasGrayscale,
      `Contrast toggle should NOT have grayscale (keeps icon visible)`
    ).toBeFalsy();

    // Menu should be at correct position
    expect(
      cssCheck.visualTop,
      `Menu should be at top: 0, but is at ${cssCheck.visualTop}px`
    ).toBeLessThanOrEqual(5);
  });
});
