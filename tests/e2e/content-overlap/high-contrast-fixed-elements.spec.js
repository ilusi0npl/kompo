/**
 * High Contrast Mode + Fixed Elements Tests
 *
 * Verifies that high contrast mode doesn't break fixed positioning.
 * CSS filter on body creates new containing block, which breaks position: fixed.
 * Solution: Apply filter to #root only, render fixed elements to #fixed-root portal.
 *
 * Run with: VITE_LARGE_TEST_DATA=true npx playwright test high-contrast-fixed-elements
 */

import { test, expect } from '@playwright/test';

/**
 * Enable high contrast mode by clicking the contrast toggle button
 */
async function enableHighContrast(page) {
  const contrastBtn = page.locator('.contrast-toggle-btn, [aria-label*="contrast"], button:has(svg)').first();
  if (await contrastBtn.isVisible()) {
    await contrastBtn.click();
    await page.waitForTimeout(100);
  }
}

/**
 * Check if high contrast mode is enabled
 */
async function isHighContrastEnabled(page) {
  return page.evaluate(() => document.body.classList.contains('high-contrast'));
}

/**
 * Get scroll position of an element relative to viewport
 */
async function getElementViewportPosition(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { top: rect.top, left: rect.left };
  }, selector);
}

/**
 * Scroll the page by given amount
 */
async function scrollPage(page, amount) {
  await page.evaluate((scrollAmount) => {
    window.scrollBy(0, scrollAmount);
  }, amount);
  await page.waitForTimeout(100);
}

test.describe('High Contrast Mode - Fixed Elements', () => {

  test.describe('Desktop - Fixed elements stay in place', () => {

    test('Repertuar page - menu stays fixed after scroll in high contrast', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/repertuar', { waitUntil: 'networkidle' });

      // Enable high contrast
      await enableHighContrast(page);
      expect(await isHighContrastEnabled(page)).toBe(true);

      // Get initial position of navigation
      const navSelector = 'nav';
      const initialPos = await getElementViewportPosition(page, navSelector);

      // Scroll down significantly
      await scrollPage(page, 500);

      // Get position after scroll - should be same (fixed)
      const afterScrollPos = await getElementViewportPosition(page, navSelector);

      // Navigation should stay in approximately same viewport position
      if (initialPos && afterScrollPos) {
        expect(Math.abs(afterScrollPos.top - initialPos.top)).toBeLessThan(50);
      }
    });

    test('Bio page - navigation stays fixed after scroll in high contrast', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/bio', { waitUntil: 'networkidle' });

      // Enable high contrast
      await enableHighContrast(page);
      expect(await isHighContrastEnabled(page)).toBe(true);

      // Get initial position of navigation (more reliable than logo which changes per section)
      const navSelector = '#fixed-root nav, nav.bio-nav-link, nav';
      const initialPos = await getElementViewportPosition(page, navSelector);

      // Scroll down
      await scrollPage(page, 400);

      // Get position after scroll
      const afterScrollPos = await getElementViewportPosition(page, navSelector);

      // Navigation should stay in approximately same viewport position
      if (initialPos && afterScrollPos) {
        expect(Math.abs(afterScrollPos.top - initialPos.top)).toBeLessThan(50);
      }
    });

    test('Kalendarz page - fixed header stays in place in high contrast', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/kalendarz', { waitUntil: 'networkidle' });

      // Enable high contrast
      await enableHighContrast(page);

      // Get fixed header position
      const headerSelector = '[style*="position: fixed"], [style*="position:fixed"]';
      const initialPos = await getElementViewportPosition(page, headerSelector);

      // Scroll down
      await scrollPage(page, 600);

      // Get position after scroll
      const afterScrollPos = await getElementViewportPosition(page, headerSelector);

      // Header should stay fixed
      if (initialPos && afterScrollPos) {
        expect(Math.abs(afterScrollPos.top - initialPos.top)).toBeLessThan(50);
      }
    });

    test('Media page - tabs stay fixed in high contrast', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/media', { waitUntil: 'networkidle' });

      // Enable high contrast
      await enableHighContrast(page);

      // Get initial position of tabs (Zdjęcia/Wideo)
      const tabSelector = '.filter-tab, [class*="tab"]';
      const initialPos = await getElementViewportPosition(page, tabSelector);

      // Scroll down
      await scrollPage(page, 300);

      // Get position after scroll
      const afterScrollPos = await getElementViewportPosition(page, tabSelector);

      // Tabs should stay in approximately same viewport position (they're in fixed header)
      if (initialPos && afterScrollPos) {
        expect(Math.abs(afterScrollPos.top - initialPos.top)).toBeLessThan(50);
      }
    });

    test('Fundacja page - fixed elements work in high contrast', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/fundacja', { waitUntil: 'networkidle' });

      await enableHighContrast(page);
      expect(await isHighContrastEnabled(page)).toBe(true);

      const navSelector = 'nav';
      const initialPos = await getElementViewportPosition(page, navSelector);

      await scrollPage(page, 500);

      const afterScrollPos = await getElementViewportPosition(page, navSelector);

      if (initialPos && afterScrollPos) {
        expect(Math.abs(afterScrollPos.top - initialPos.top)).toBeLessThan(50);
      }
    });

  });

  test.describe('High contrast filter application', () => {

    test('filter is applied to #root, not body', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/repertuar', { waitUntil: 'networkidle' });

      await enableHighContrast(page);

      // Check that filter is on #root
      const rootFilter = await page.evaluate(() => {
        const root = document.getElementById('root');
        return root ? getComputedStyle(root).filter : 'none';
      });

      // Check that body has no filter
      const bodyFilter = await page.evaluate(() => {
        return getComputedStyle(document.body).filter;
      });

      // #root should have the contrast filter
      expect(rootFilter).toContain('contrast');
      expect(rootFilter).toContain('grayscale');

      // body should have no filter (or none)
      expect(bodyFilter === 'none' || !bodyFilter.includes('contrast')).toBe(true);
    });

    test('#fixed-root exists and is separate from #root', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/bio', { waitUntil: 'networkidle' });

      const portalsExist = await page.evaluate(() => {
        const root = document.getElementById('root');
        const fixedRoot = document.getElementById('fixed-root');
        return {
          rootExists: !!root,
          fixedRootExists: !!fixedRoot,
          areSeparate: root !== fixedRoot && root?.parentElement === fixedRoot?.parentElement
        };
      });

      expect(portalsExist.rootExists).toBe(true);
      expect(portalsExist.fixedRootExists).toBe(true);
      expect(portalsExist.areSeparate).toBe(true);
    });

    test('fixed elements render in #fixed-root portal', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/kalendarz', { waitUntil: 'networkidle' });

      // Check that fixed elements are inside #fixed-root
      const fixedInPortal = await page.evaluate(() => {
        const fixedRoot = document.getElementById('fixed-root');
        if (!fixedRoot) return false;

        // Check if there are elements with position: fixed inside fixed-root
        const fixedElements = fixedRoot.querySelectorAll('[style*="position: fixed"], [style*="position:fixed"]');
        return fixedElements.length > 0;
      });

      expect(fixedInPortal).toBe(true);
    });

  });

  test.describe('High contrast toggle interaction', () => {

    test('can toggle high contrast on and off', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/bio', { waitUntil: 'networkidle' });

      // Initially off
      expect(await isHighContrastEnabled(page)).toBe(false);

      // Toggle on
      await enableHighContrast(page);
      expect(await isHighContrastEnabled(page)).toBe(true);

      // Toggle off
      await enableHighContrast(page);
      expect(await isHighContrastEnabled(page)).toBe(false);
    });

    test('contrast toggle button remains clickable in high contrast mode', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/repertuar', { waitUntil: 'networkidle' });

      // Enable high contrast
      await enableHighContrast(page);
      expect(await isHighContrastEnabled(page)).toBe(true);

      // Scroll down to ensure we're testing fixed behavior
      await scrollPage(page, 300);

      // Button should still be clickable
      const contrastBtn = page.locator('.contrast-toggle-btn, [aria-label*="contrast"], button:has(svg)').first();
      await expect(contrastBtn).toBeVisible();

      // Click to toggle off
      await contrastBtn.click();
      await page.waitForTimeout(100);

      expect(await isHighContrastEnabled(page)).toBe(false);
    });

  });

  test.describe('Mobile - High contrast with fixed elements', () => {

    test('mobile menu stays accessible in high contrast', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/bio', { waitUntil: 'networkidle' });

      // Find and click menu button
      const menuBtn = page.getByText('MENU', { exact: true });
      if (await menuBtn.isVisible()) {
        await menuBtn.click();
        await page.waitForTimeout(300);

        // Menu portal should exist (mobile-menu-root)
        const menuPortal = page.locator('#mobile-menu-root');
        await expect(menuPortal).toBeAttached();

        // Check if menu has navigation links visible
        const menuNav = page.locator('#mobile-menu-root nav, #mobile-menu-root a[href="/bio"]');
        const hasMenu = await menuNav.first().isVisible().catch(() => false);

        if (hasMenu) {
          // Enable high contrast from menu if possible
          const contrastToggle = page.locator('#mobile-menu-root .contrast-toggle-btn, .contrast-toggle-btn').first();
          if (await contrastToggle.isVisible()) {
            await contrastToggle.click();
            await page.waitForTimeout(100);

            // Menu should still have navigation visible
            await expect(menuNav.first()).toBeVisible();
          }
        }
      }
    });

    test('mobile header stays fixed in high contrast after scroll', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/kalendarz', { waitUntil: 'networkidle' });

      // Enable high contrast via menu
      const menuBtn = page.getByText('MENU', { exact: true });
      if (await menuBtn.isVisible()) {
        await menuBtn.click();
        await page.waitForTimeout(300);

        const contrastToggle = page.locator('.contrast-toggle-btn').first();
        if (await contrastToggle.isVisible()) {
          await contrastToggle.click();
          await page.waitForTimeout(100);
        }

        // Close menu
        const closeBtn = page.locator('[aria-label*="close"], button:has-text("×"), button:has-text("X")');
        if (await closeBtn.first().isVisible()) {
          await closeBtn.first().click();
        } else {
          // Click outside to close
          await page.mouse.click(10, 10);
        }
        await page.waitForTimeout(200);
      }

      // Get header position
      const headerSelector = 'header, [class*="header"]';
      const initialPos = await getElementViewportPosition(page, headerSelector);

      // Scroll down
      await scrollPage(page, 400);

      // Get position after scroll
      const afterScrollPos = await getElementViewportPosition(page, headerSelector);

      // Header should stay in approximately same viewport position
      if (initialPos && afterScrollPos) {
        expect(Math.abs(afterScrollPos.top - initialPos.top)).toBeLessThan(100);
      }
    });

  });

});
