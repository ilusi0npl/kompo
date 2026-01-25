// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test mobile menu item alignment.
 * All menu items (nav links, language toggle, contrast toggle) should be
 * left-aligned at the same position.
 */

test.describe('Mobile Menu - Item Alignment', () => {
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('language toggle should align with nav items', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open mobile menu - click on MENU button
    const menuButton = page.locator('.mobile-menu-btn, button:has-text("MENU")').first();
    await menuButton.click();
    await page.waitForTimeout(300); // Wait for menu animation

    // Get all nav links positions
    const navLinks = page.locator('.nav-link');
    const navLinkCount = await navLinks.count();

    expect(navLinkCount, 'Should have nav links in menu').toBeGreaterThan(0);

    // Get the left position of first nav link
    const firstNavLink = navLinks.first();
    const navLinkBox = await firstNavLink.boundingBox();
    expect(navLinkBox, 'Nav link should have bounding box').not.toBeNull();

    // Get language toggle position
    const languageToggle = page.locator('.language-toggle');
    const langToggleBox = await languageToggle.boundingBox();
    expect(langToggleBox, 'Language toggle should have bounding box').not.toBeNull();

    // Language toggle should have the same left position as nav links
    // Allow 2px tolerance for rendering differences
    if (navLinkBox && langToggleBox) {
      console.log(`Nav link left: ${navLinkBox.x}px`);
      console.log(`Language toggle left: ${langToggleBox.x}px`);
      console.log(`Difference: ${Math.abs(navLinkBox.x - langToggleBox.x)}px`);

      expect(
        Math.abs(navLinkBox.x - langToggleBox.x),
        `Language toggle left (${langToggleBox.x}px) should match nav link left (${navLinkBox.x}px)`
      ).toBeLessThanOrEqual(2);
    }
  });

  test('contrast toggle should align with nav items', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open mobile menu
    const menuButton = page.locator('.mobile-menu-btn, button:has-text("MENU")').first();
    await menuButton.click();
    await page.waitForTimeout(300);

    // Get first nav link position
    const firstNavLink = page.locator('.nav-link').first();
    const navLinkBox = await firstNavLink.boundingBox();
    expect(navLinkBox, 'Nav link should have bounding box').not.toBeNull();

    // Get contrast toggle position
    const contrastToggle = page.locator('.contrast-toggle-btn');
    const contrastBox = await contrastToggle.boundingBox();
    expect(contrastBox, 'Contrast toggle should have bounding box').not.toBeNull();

    // Contrast toggle should have the same left position as nav links
    if (navLinkBox && contrastBox) {
      console.log(`Nav link left: ${navLinkBox.x}px`);
      console.log(`Contrast toggle left: ${contrastBox.x}px`);
      console.log(`Difference: ${Math.abs(navLinkBox.x - contrastBox.x)}px`);

      expect(
        Math.abs(navLinkBox.x - contrastBox.x),
        `Contrast toggle left (${contrastBox.x}px) should match nav link left (${navLinkBox.x}px)`
      ).toBeLessThanOrEqual(2);
    }
  });

  test('all menu items should have consistent left alignment', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open mobile menu
    const menuButton = page.locator('.mobile-menu-btn, button:has-text("MENU")').first();
    await menuButton.click();
    await page.waitForTimeout(300);

    // Get positions of all items in the menu nav
    const positions = await page.evaluate(() => {
      const menu = document.querySelector('#mobile-menu-root');
      if (!menu) return null;

      const nav = menu.querySelector('nav');
      if (!nav) return null;

      const items = nav.querySelectorAll('a, button');
      const results = [];

      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const text = item.textContent?.trim() || item.getAttribute('aria-label') || `item-${index}`;
        results.push({
          text: text.substring(0, 20),
          left: rect.left,
          width: rect.width,
        });
      });

      return results;
    });

    expect(positions, 'Should get menu item positions').not.toBeNull();
    expect(positions?.length, 'Should have menu items').toBeGreaterThan(0);

    if (positions && positions.length > 1) {
      const referenceLeft = positions[0].left;
      console.log('Menu item positions:', positions);

      // All items should have the same left position (within 2px tolerance)
      for (const item of positions) {
        expect(
          Math.abs(item.left - referenceLeft),
          `"${item.text}" left (${item.left}px) should match reference (${referenceLeft}px)`
        ).toBeLessThanOrEqual(2);
      }
    }
  });

  test('menu items should have left-aligned text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open mobile menu
    const menuButton = page.locator('.mobile-menu-btn, button:has-text("MENU")').first();
    await menuButton.click();
    await page.waitForTimeout(300);

    // Check text-align property of menu items
    const textAlignments = await page.evaluate(() => {
      const menu = document.querySelector('#mobile-menu-root');
      if (!menu) return null;

      const nav = menu.querySelector('nav');
      if (!nav) return null;

      const items = nav.querySelectorAll('a, button');
      const results = [];

      items.forEach((item, index) => {
        const style = getComputedStyle(item);
        const text = item.textContent?.trim() || item.getAttribute('aria-label') || `item-${index}`;
        results.push({
          text: text.substring(0, 20),
          textAlign: style.textAlign,
          display: style.display,
          tagName: item.tagName,
        });
      });

      return results;
    });

    console.log('Text alignments:', textAlignments);

    expect(textAlignments, 'Should get menu item alignments').not.toBeNull();

    // All items should have left text alignment (not center)
    if (textAlignments) {
      for (const item of textAlignments) {
        // Skip contrast toggle (it's an icon button, not text - identified by aria-label containing "kontrast" or "contrast")
        // The aria-label text is truncated to 20 chars, so check for partial matches
        if (item.text.toLowerCase().includes('kontrast') ||
            item.text.toLowerCase().includes('contrast') ||
            item.text.toLowerCase().includes('tryb wysok') ||
            item.text.toLowerCase().includes('high contrast')) continue;

        expect(
          item.textAlign,
          `"${item.text}" should have text-align: start or left, but has ${item.textAlign}`
        ).toMatch(/^(start|left)$/);
      }
    }
  });
});
