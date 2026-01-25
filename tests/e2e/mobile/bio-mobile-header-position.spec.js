// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test that the mobile header on /bio page stays fixed when scrolling.
 * The MENU button should maintain its position relative to the viewport.
 */

test.describe('Bio Mobile - Header Position on Scroll', () => {
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('MENU button should stay fixed when scrolling', async ({ page }) => {
    await page.goto('/bio');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500); // Wait for any animations

    // Get initial MENU button position
    const menuButton = page.locator('button:has-text("MENU")').first();
    await expect(menuButton).toBeVisible();

    const initialPosition = await menuButton.boundingBox();
    expect(initialPosition, 'MENU button should have bounding box').not.toBeNull();

    console.log(`Initial MENU position: top=${initialPosition?.y}, left=${initialPosition?.x}`);

    // Scroll down 500px
    await page.evaluate(() => {
      window.scrollTo(0, 500);
    });
    await page.waitForTimeout(300); // Wait for scroll to settle

    // Get MENU button position after scroll
    const scrolledPosition = await menuButton.boundingBox();
    expect(scrolledPosition, 'MENU button should still have bounding box after scroll').not.toBeNull();

    console.log(`After scroll MENU position: top=${scrolledPosition?.y}, left=${scrolledPosition?.x}`);

    // MENU button should stay at the same viewport position (fixed header)
    // Allow 2px tolerance for sub-pixel rendering differences
    if (initialPosition && scrolledPosition) {
      const topDiff = Math.abs(scrolledPosition.y - initialPosition.y);
      const leftDiff = Math.abs(scrolledPosition.x - initialPosition.x);

      console.log(`Position difference: top=${topDiff}px, left=${leftDiff}px`);

      expect(
        topDiff,
        `MENU button top position should stay fixed (initial: ${initialPosition.y}, after scroll: ${scrolledPosition.y})`
      ).toBeLessThanOrEqual(2);

      expect(
        leftDiff,
        `MENU button left position should stay fixed (initial: ${initialPosition.x}, after scroll: ${scrolledPosition.x})`
      ).toBeLessThanOrEqual(2);
    }
  });

  test('MENU button should stay fixed when scrolling to bottom', async ({ page }) => {
    await page.goto('/bio');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const menuButton = page.locator('button:has-text("MENU")').first();
    await expect(menuButton).toBeVisible();

    const initialPosition = await menuButton.boundingBox();
    expect(initialPosition, 'MENU button should have bounding box').not.toBeNull();

    console.log(`Initial MENU position: top=${initialPosition?.y}, left=${initialPosition?.x}`);

    // Scroll to bottom of page
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(500);

    const scrolledPosition = await menuButton.boundingBox();
    expect(scrolledPosition, 'MENU button should still have bounding box after scroll').not.toBeNull();

    console.log(`After full scroll MENU position: top=${scrolledPosition?.y}, left=${scrolledPosition?.x}`);

    if (initialPosition && scrolledPosition) {
      const topDiff = Math.abs(scrolledPosition.y - initialPosition.y);
      const leftDiff = Math.abs(scrolledPosition.x - initialPosition.x);

      console.log(`Position difference: top=${topDiff}px, left=${leftDiff}px`);

      expect(
        topDiff,
        `MENU button top should stay fixed when scrolling to bottom`
      ).toBeLessThanOrEqual(2);

      expect(
        leftDiff,
        `MENU button left should stay fixed when scrolling to bottom`
      ).toBeLessThanOrEqual(2);
    }
  });

  test('header background should stay at top when scrolling', async ({ page }) => {
    await page.goto('/bio');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Get initial header position (the fixed div containing MENU)
    const initialHeaderTop = await page.evaluate(() => {
      const menuButton = document.querySelector('button');
      if (!menuButton) return null;

      // Find the fixed parent container
      let parent = menuButton.parentElement;
      while (parent && getComputedStyle(parent).position !== 'fixed') {
        parent = parent.parentElement;
      }
      return parent ? parent.getBoundingClientRect().top : null;
    });

    console.log(`Initial header top: ${initialHeaderTop}px`);

    // Scroll down
    await page.evaluate(() => {
      window.scrollTo(0, 1000);
    });
    await page.waitForTimeout(300);

    const scrolledHeaderTop = await page.evaluate(() => {
      const menuButton = document.querySelector('button');
      if (!menuButton) return null;

      let parent = menuButton.parentElement;
      while (parent && getComputedStyle(parent).position !== 'fixed') {
        parent = parent.parentElement;
      }
      return parent ? parent.getBoundingClientRect().top : null;
    });

    console.log(`Scrolled header top: ${scrolledHeaderTop}px`);

    // Fixed header should always be at top: 0 (or close to it)
    expect(initialHeaderTop, 'Header should have initial top position').not.toBeNull();
    expect(scrolledHeaderTop, 'Header should have top position after scroll').not.toBeNull();

    if (initialHeaderTop !== null && scrolledHeaderTop !== null) {
      // Header should stay at the same position (at top of viewport)
      expect(
        Math.abs(scrolledHeaderTop - initialHeaderTop),
        'Header should maintain fixed position at top'
      ).toBeLessThanOrEqual(2);

      // Header should be at top of viewport
      expect(
        scrolledHeaderTop,
        'Header should be at top of viewport (position ≈ 0)'
      ).toBeLessThanOrEqual(5);
    }
  });
});

test.describe('Bio Mobile - Menu Position on Scroll', () => {
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('opened MobileMenu should stay fixed when page scrolls', async ({ page }) => {
    await page.goto('/bio');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Open the menu
    const menuButton = page.locator('button:has-text("MENU")').first();
    await menuButton.click();
    await page.waitForTimeout(300);

    // Find the close button in the menu - it indicates menu is open
    const closeButton = page.locator('.mobile-menu-close, button[aria-label*="Zamknij"]').first();
    await expect(closeButton).toBeVisible();

    const initialClosePosition = await closeButton.boundingBox();
    console.log(`Initial close button position: top=${initialClosePosition?.y}, left=${initialClosePosition?.x}`);

    // Try to scroll (this shouldn't affect the fixed menu overlay)
    await page.evaluate(() => {
      window.scrollTo(0, 500);
    });
    await page.waitForTimeout(300);

    const scrolledClosePosition = await closeButton.boundingBox();
    console.log(`After scroll close button position: top=${scrolledClosePosition?.y}, left=${scrolledClosePosition?.x}`);

    if (initialClosePosition && scrolledClosePosition) {
      const topDiff = Math.abs(scrolledClosePosition.y - initialClosePosition.y);
      expect(
        topDiff,
        `Menu close button should stay fixed during scroll`
      ).toBeLessThanOrEqual(2);
    }
  });

  test('menu items should stay fixed when page scrolls with menu open', async ({ page }) => {
    await page.goto('/bio');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Open the menu
    const menuButton = page.locator('button:has-text("MENU")').first();
    await menuButton.click();
    await page.waitForTimeout(300);

    // Get first nav link position
    const firstNavLink = page.locator('.nav-link').first();
    await expect(firstNavLink).toBeVisible();

    const initialPosition = await firstNavLink.boundingBox();
    console.log(`Initial nav link position: top=${initialPosition?.y}`);

    // Scroll the page
    await page.evaluate(() => {
      window.scrollTo(0, 1000);
    });
    await page.waitForTimeout(300);

    const scrolledPosition = await firstNavLink.boundingBox();
    console.log(`After scroll nav link position: top=${scrolledPosition?.y}`);

    if (initialPosition && scrolledPosition) {
      const topDiff = Math.abs(scrolledPosition.y - initialPosition.y);
      expect(
        topDiff,
        `Nav links in menu should stay fixed during scroll`
      ).toBeLessThanOrEqual(2);
    }
  });
});

test.describe('Bio Mobile - High Contrast Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('MENU button should stay fixed in high contrast mode', async ({ page }) => {
    await page.goto('/bio');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Get initial MENU position
    const menuButton = page.locator('button:has-text("MENU")').first();
    const initialPosition = await menuButton.boundingBox();
    console.log(`Initial MENU position (normal mode): top=${initialPosition?.y}`);

    // Enable high contrast mode
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    });
    await page.waitForTimeout(300);

    // Get MENU position after enabling high contrast
    const highContrastPosition = await menuButton.boundingBox();
    console.log(`MENU position (high contrast mode): top=${highContrastPosition?.y}`);

    // Scroll down
    await page.evaluate(() => {
      window.scrollTo(0, 500);
    });
    await page.waitForTimeout(300);

    // Get MENU position after scroll in high contrast mode
    const scrolledPosition = await menuButton.boundingBox();
    console.log(`MENU position after scroll (high contrast): top=${scrolledPosition?.y}`);

    if (initialPosition && highContrastPosition && scrolledPosition) {
      // Position should not change significantly when enabling high contrast
      expect(
        Math.abs(highContrastPosition.y - initialPosition.y),
        `MENU should stay at same position when high contrast is enabled`
      ).toBeLessThanOrEqual(5);

      // Position should stay fixed during scroll in high contrast mode
      expect(
        Math.abs(scrolledPosition.y - highContrastPosition.y),
        `MENU should stay fixed during scroll in high contrast mode`
      ).toBeLessThanOrEqual(5);
    }
  });
});

test.describe('Bio Mobile - Header Transform Scale', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('header should have consistent scale at different scroll positions', async ({ page }) => {
    await page.goto('/bio');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Get the header element and its transform
    const getHeaderTransform = async () => {
      return await page.evaluate(() => {
        // Find the fixed header container (parent of MENU button)
        const menuButton = document.querySelector('button');
        if (!menuButton) return null;

        let parent = menuButton.parentElement;
        while (parent && getComputedStyle(parent).position !== 'fixed') {
          parent = parent.parentElement;
        }

        if (!parent) return null;

        const style = getComputedStyle(parent);
        return {
          transform: style.transform,
          width: parent.getBoundingClientRect().width,
          height: parent.getBoundingClientRect().height,
        };
      });
    };

    const initialTransform = await getHeaderTransform();
    console.log('Initial header transform:', initialTransform);

    // Scroll to multiple positions and check transform stays consistent
    const scrollPositions = [200, 500, 1000, 2000];

    for (const scrollY of scrollPositions) {
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await page.waitForTimeout(100);

      const transformAtScroll = await getHeaderTransform();
      console.log(`Transform at scroll ${scrollY}:`, transformAtScroll);

      if (initialTransform && transformAtScroll) {
        // Width and height should stay the same
        expect(
          Math.abs(transformAtScroll.width - initialTransform.width),
          `Header width should be consistent at scroll ${scrollY}`
        ).toBeLessThanOrEqual(1);

        expect(
          Math.abs(transformAtScroll.height - initialTransform.height),
          `Header height should be consistent at scroll ${scrollY}`
        ).toBeLessThanOrEqual(1);
      }
    }
  });
});
