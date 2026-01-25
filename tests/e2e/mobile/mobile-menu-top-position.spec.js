// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test that MobileMenu opens at the TOP RIGHT corner of the viewport.
 * The menu should start at top: 0, right: 0 - not in the middle of the screen.
 */

test.describe('MobileMenu - Top Right Position', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('menu should open at TOP of viewport (top ≈ 0)', async ({ page }) => {
    await page.goto('/media');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Open the menu
    const menuButton = page.locator('button:has-text("MENU")').first();
    await menuButton.click();
    await page.waitForTimeout(300);

    // Find the menu container (the white panel)
    const menuContainer = await page.evaluate(() => {
      const menuRoot = document.getElementById('mobile-menu-root');
      if (!menuRoot) return null;

      // Find the fixed div inside the portal
      const fixedDiv = menuRoot.querySelector('.fixed, [style*="position: fixed"]');
      if (!fixedDiv) return null;

      const rect = fixedDiv.getBoundingClientRect();
      return {
        top: rect.top,
        right: window.innerWidth - rect.right,
        width: rect.width,
        height: rect.height,
      };
    });

    console.log('Menu container position:', menuContainer);

    expect(menuContainer, 'Menu container should exist').not.toBeNull();

    if (menuContainer) {
      // Menu should be at TOP of viewport (top ≈ 0)
      expect(
        menuContainer.top,
        `Menu top should be 0, but is ${menuContainer.top}px - menu is NOT at top of screen!`
      ).toBeLessThanOrEqual(5);

      // Menu should be at RIGHT edge (right ≈ 0)
      expect(
        menuContainer.right,
        `Menu right should be 0, but is ${menuContainer.right}px - menu is NOT at right edge!`
      ).toBeLessThanOrEqual(5);
    }
  });

  test('close button (X) should be near top of menu', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Open the menu
    const menuButton = page.locator('button:has-text("MENU")').first();
    await menuButton.click();
    await page.waitForTimeout(300);

    // Find close button
    const closeButton = page.locator('.mobile-menu-close, button[aria-label*="Zamknij"]').first();
    await expect(closeButton).toBeVisible();

    const closeBox = await closeButton.boundingBox();
    console.log('Close button position:', closeBox);

    expect(closeBox, 'Close button should have bounding box').not.toBeNull();

    if (closeBox) {
      // Close button should be near top of viewport (within ~50px from top)
      // Based on Figma: top: 44px scaled
      expect(
        closeBox.y,
        `Close button Y should be < 100px from top, but is ${closeBox.y}px`
      ).toBeLessThan(100);
    }
  });

  test('first nav link (Bio) should be in upper portion of viewport', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Open the menu
    const menuButton = page.locator('button:has-text("MENU")').first();
    await menuButton.click();
    await page.waitForTimeout(300);

    // Find Bio link
    const bioLink = page.locator('.nav-link:has-text("Bio")').first();
    await expect(bioLink).toBeVisible();

    const bioBox = await bioLink.boundingBox();
    console.log('Bio link position:', bioBox);

    expect(bioBox, 'Bio link should have bounding box').not.toBeNull();

    if (bioBox) {
      // Bio link should be in upper half of 844px viewport (< 422px)
      // Actually based on Figma it should be around 274px (center with offset)
      expect(
        bioBox.y,
        `Bio link Y should be in upper portion (< 350px), but is ${bioBox.y}px`
      ).toBeLessThan(350);
    }
  });
});

test.describe('MobileMenu - Debug DOM Structure', () => {
  test('debug: check actual DOM structure of menu', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/media');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Open the menu
    const menuButton = page.locator('button:has-text("MENU")').first();
    await menuButton.click();
    await page.waitForTimeout(500);

    // Get detailed debug info
    const debugInfo = await page.evaluate(() => {
      const results = {
        portalRoot: null,
        menuContainer: null,
        closeButton: null,
        viewport: { width: window.innerWidth, height: window.innerHeight },
      };

      // Check portal root
      const portalRoot = document.getElementById('mobile-menu-root');
      if (portalRoot) {
        const rect = portalRoot.getBoundingClientRect();
        const style = getComputedStyle(portalRoot);
        results.portalRoot = {
          exists: true,
          childCount: portalRoot.children.length,
          position: style.position,
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          innerHTML: portalRoot.innerHTML.substring(0, 200),
        };
      }

      // Find any element with class "fixed" inside portal
      const fixedElements = document.querySelectorAll('#mobile-menu-root .fixed, #mobile-menu-root [style*="fixed"]');
      results.fixedElementsCount = fixedElements.length;

      // Find close button and its position
      const closeBtn = document.querySelector('.mobile-menu-close');
      if (closeBtn) {
        const rect = closeBtn.getBoundingClientRect();
        results.closeButton = {
          top: rect.top,
          right: window.innerWidth - rect.right,
          inPortal: !!closeBtn.closest('#mobile-menu-root'),
        };
      }

      // Find first nav-link
      const navLink = document.querySelector('.nav-link');
      if (navLink) {
        const rect = navLink.getBoundingClientRect();
        results.navLink = {
          text: navLink.textContent,
          top: rect.top,
          inPortal: !!navLink.closest('#mobile-menu-root'),
        };
      }

      return results;
    });

    console.log('Debug info:', JSON.stringify(debugInfo, null, 2));

    // Assertions
    expect(debugInfo.portalRoot?.exists, 'Portal root should exist').toBe(true);
    expect(debugInfo.portalRoot?.childCount, 'Portal should have children').toBeGreaterThan(0);
    expect(debugInfo.closeButton?.inPortal, 'Close button should be inside portal').toBe(true);
    expect(debugInfo.closeButton?.top, 'Close button should be near top').toBeLessThan(100);
  });

  test('menu should be at top even when page is scrolled BEFORE opening', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/media');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // FIRST scroll down the page
    await page.evaluate(() => {
      window.scrollTo(0, 500);
    });
    await page.waitForTimeout(300);

    // THEN open the menu
    const menuButton = page.locator('button:has-text("MENU")').first();
    await menuButton.click();
    await page.waitForTimeout(500);

    // Check menu position
    const positions = await page.evaluate(() => {
      const closeBtn = document.querySelector('.mobile-menu-close');
      const navLink = document.querySelector('.nav-link');
      const menuRoot = document.getElementById('mobile-menu-root');
      const fixedDiv = menuRoot?.querySelector('.fixed');

      return {
        scrollY: window.scrollY,
        closeButtonTop: closeBtn?.getBoundingClientRect().top,
        navLinkTop: navLink?.getBoundingClientRect().top,
        menuContainerTop: fixedDiv?.getBoundingClientRect().top,
        portalRootTop: menuRoot?.getBoundingClientRect().top,
      };
    });

    console.log('Positions after scroll then open:', positions);

    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/mobile-menu-scrolled.png', fullPage: false });

    // Menu should STILL be at top of viewport even when page was scrolled
    expect(
      positions.closeButtonTop,
      `Close button should be < 100px from top after scrolling, but is ${positions.closeButtonTop}px`
    ).toBeLessThan(100);

    expect(
      positions.menuContainerTop,
      `Menu container should be at top: 0, but is ${positions.menuContainerTop}px`
    ).toBeLessThanOrEqual(5);
  });
});
