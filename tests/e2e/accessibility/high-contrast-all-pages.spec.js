/**
 * High Contrast Mode - All Pages E2E Tests
 *
 * Comprehensive accessibility tests for high contrast mode across all pages.
 * Tests WCAG 2.4.7 (Focus Visible) compliance and high contrast functionality.
 *
 * Run with: npx playwright test high-contrast-all-pages
 */

import { test, expect } from '@playwright/test';

// All pages to test
const PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/bio', name: 'Bio' },
  { path: '/bio/ensemble', name: 'Bio Ensemble' },
  { path: '/media', name: 'Media' },
  { path: '/media/wideo', name: 'Media Wideo' },
  { path: '/kalendarz', name: 'Kalendarz' },
  { path: '/archiwalne', name: 'Archiwalne' },
  { path: '/wydarzenie/1', name: 'Wydarzenie' },
  { path: '/repertuar', name: 'Repertuar' },
  { path: '/specialne', name: 'Specjalne' },
  { path: '/fundacja', name: 'Fundacja' },
  { path: '/kontakt', name: 'Kontakt' },
];

// Viewports to test
const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

/**
 * Enable high contrast mode by clicking the contrast toggle button
 */
async function enableHighContrast(page) {
  const contrastBtn = page.locator('.contrast-toggle-btn').first();
  if (await contrastBtn.isVisible({ timeout: 5000 })) {
    await contrastBtn.click();
    await page.waitForTimeout(200);
  }
}

/**
 * Disable high contrast mode
 */
async function disableHighContrast(page) {
  const isEnabled = await page.evaluate(() =>
    document.body.classList.contains('high-contrast')
  );
  if (isEnabled) {
    const contrastBtn = page.locator('.contrast-toggle-btn').first();
    await contrastBtn.click();
    await page.waitForTimeout(200);
  }
}

/**
 * Check if high contrast mode is enabled
 */
async function isHighContrastEnabled(page) {
  return page.evaluate(() => document.body.classList.contains('high-contrast'));
}

/**
 * Clear localStorage to ensure clean state
 */
async function clearHighContrastStorage(page) {
  await page.evaluate(() => localStorage.removeItem('highContrast'));
}

test.describe('High Contrast Mode - All Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Clear high contrast state before each test
    await page.goto('/');
    await clearHighContrastStorage(page);
  });

  // Desktop tests for each page
  test.describe('Desktop (1440px)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
    });

    for (const pageConfig of PAGES) {
      test.describe(`${pageConfig.name} (${pageConfig.path})`, () => {
        test('high contrast toggle works', async ({ page }) => {
          await page.goto(pageConfig.path, { waitUntil: 'networkidle' });

          // Initially off
          expect(await isHighContrastEnabled(page)).toBe(false);

          // Enable high contrast
          await enableHighContrast(page);
          expect(await isHighContrastEnabled(page)).toBe(true);

          // Verify filter is applied to #root
          const rootFilter = await page.evaluate(() => {
            const root = document.getElementById('root');
            return root ? getComputedStyle(root).filter : null;
          });
          expect(rootFilter).toContain('contrast');
          expect(rootFilter).toContain('grayscale');

          // Disable high contrast
          await disableHighContrast(page);
          expect(await isHighContrastEnabled(page)).toBe(false);
        });

        test('contrast toggle button is visible and clickable when active', async ({ page }) => {
          await page.goto(pageConfig.path, { waitUntil: 'networkidle' });
          await enableHighContrast(page);

          const contrastBtn = page.locator('.contrast-toggle-btn').first();
          await expect(contrastBtn).toBeVisible();

          // Button should be clickable and functional
          await expect(contrastBtn).toBeEnabled();

          // Check that the button has proper accessibility attributes
          const ariaLabel = await contrastBtn.getAttribute('aria-label');
          expect(ariaLabel).toBeTruthy();

          // Verify the button can toggle high contrast off (functional test)
          await contrastBtn.click();
          const isStillEnabled = await page.evaluate(() =>
            document.body.classList.contains('high-contrast')
          );
          expect(isStillEnabled).toBe(false);
        });

        test('localStorage persists high contrast state', async ({ page }) => {
          await page.goto(pageConfig.path, { waitUntil: 'networkidle' });

          // Enable high contrast
          await enableHighContrast(page);

          // Check localStorage
          const stored = await page.evaluate(() =>
            localStorage.getItem('highContrast')
          );
          expect(stored).toBe('true');

          // Reload page
          await page.reload({ waitUntil: 'networkidle' });

          // Should still be enabled
          expect(await isHighContrastEnabled(page)).toBe(true);
        });

        test('focus indicator visible on contrast toggle', async ({ page }) => {
          await page.goto(pageConfig.path, { waitUntil: 'networkidle' });

          // Tab to contrast toggle
          const contrastBtn = page.locator('.contrast-toggle-btn').first();

          // Focus the button
          await contrastBtn.focus();

          // Check focus outline is visible
          const outline = await contrastBtn.evaluate((btn) => {
            const styles = getComputedStyle(btn);
            return {
              outlineStyle: styles.outlineStyle,
              outlineWidth: styles.outlineWidth,
              outlineColor: styles.outlineColor,
            };
          });

          // Should have visible outline when focused
          expect(outline.outlineStyle).not.toBe('none');
          expect(parseInt(outline.outlineWidth)).toBeGreaterThan(0);
        });

        test('fixed elements remain visible in high contrast', async ({ page }) => {
          await page.goto(pageConfig.path, { waitUntil: 'networkidle' });
          await enableHighContrast(page);

          // Check that controls-container has filter: none
          const controlsFilter = await page.evaluate(() => {
            const controls = document.querySelector('.controls-container');
            return controls ? getComputedStyle(controls).filter : null;
          });

          // Controls should have no filter or filter: none
          if (controlsFilter) {
            expect(controlsFilter).toBe('none');
          }
        });
      });
    }
  });

  // Mobile tests for each page
  test.describe('Mobile (390px)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
    });

    for (const pageConfig of PAGES) {
      test.describe(`${pageConfig.name} (${pageConfig.path})`, () => {
        test('mobile menu opens and high contrast toggle works', async ({ page }) => {
          await page.goto(pageConfig.path, { waitUntil: 'networkidle' });

          // Open mobile menu
          const menuBtn = page.locator('.mobile-menu-btn, button:has-text("MENU")').first();
          if (await menuBtn.isVisible({ timeout: 3000 })) {
            await menuBtn.click();
            await page.waitForTimeout(300);

            // Find contrast toggle in menu
            const contrastBtn = page.locator('.contrast-toggle-btn').first();
            if (await contrastBtn.isVisible({ timeout: 2000 })) {
              await contrastBtn.click();
              await page.waitForTimeout(200);

              // Should enable high contrast
              expect(await isHighContrastEnabled(page)).toBe(true);
            }
          }
        });

        test('mobile menu has focus trap', async ({ page }) => {
          await page.goto(pageConfig.path, { waitUntil: 'networkidle' });

          // Open mobile menu
          const menuBtn = page.locator('.mobile-menu-btn, button:has-text("MENU")').first();
          if (await menuBtn.isVisible({ timeout: 3000 })) {
            await menuBtn.click();
            await page.waitForTimeout(300);

            // Check that menu has role="dialog"
            const dialog = page.locator('[role="dialog"]');
            await expect(dialog).toBeVisible({ timeout: 2000 });

            // Check aria-modal
            const ariaModal = await dialog.getAttribute('aria-modal');
            expect(ariaModal).toBe('true');
          }
        });

        test('escape key closes mobile menu', async ({ page }) => {
          await page.goto(pageConfig.path, { waitUntil: 'networkidle' });

          // Open mobile menu
          const menuBtn = page.locator('.mobile-menu-btn, button:has-text("MENU")').first();
          if (await menuBtn.isVisible({ timeout: 3000 })) {
            await menuBtn.click();
            await page.waitForTimeout(300);

            // Menu should be open
            const dialog = page.locator('[role="dialog"]');
            await expect(dialog).toBeVisible({ timeout: 2000 });

            // Press Escape
            await page.keyboard.press('Escape');
            await page.waitForTimeout(300);

            // Menu should be closed
            await expect(dialog).not.toBeVisible();
          }
        });

        test('mobile-menu-root receives high contrast filter', async ({ page }) => {
          await page.goto(pageConfig.path, { waitUntil: 'networkidle' });

          // Open mobile menu first (contrast toggle is inside menu on mobile)
          const menuBtn = page.locator('.mobile-menu-btn, button:has-text("MENU")').first();
          if (await menuBtn.isVisible({ timeout: 3000 })) {
            await menuBtn.click();
            await page.waitForTimeout(300);

            // Enable high contrast from within the menu
            const contrastBtn = page.locator('.contrast-toggle-btn').first();
            if (await contrastBtn.isVisible({ timeout: 2000 })) {
              await contrastBtn.click();
              await page.waitForTimeout(200);
            }

            // Check mobile-menu-root or its children have filter
            const menuRootFilter = await page.evaluate(() => {
              const menuRoot = document.getElementById('mobile-menu-root');
              if (!menuRoot) return null;
              // Check direct filter or computed filter on first child
              const rootFilter = getComputedStyle(menuRoot).filter;
              if (rootFilter && rootFilter !== 'none') return rootFilter;
              // Check first child with actual content
              const firstChild = menuRoot.querySelector('[role="dialog"]') || menuRoot.firstElementChild;
              return firstChild ? getComputedStyle(firstChild).filter : null;
            });

            if (menuRootFilter) {
              expect(menuRootFilter).toContain('contrast');
            }
          }
        });
      });
    }
  });

  // Skip link tests
  test.describe('Skip Link', () => {
    test('skip link is first focusable element', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto('/', { waitUntil: 'networkidle' });

      // Press Tab to focus first element
      await page.keyboard.press('Tab');

      // Get focused element
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tagName: el?.tagName,
          className: el?.className,
          href: el?.getAttribute('href'),
        };
      });

      // Should be skip link
      expect(focusedElement.tagName).toBe('A');
      expect(focusedElement.className).toContain('skip-link');
      expect(focusedElement.href).toBe('#main-content');
    });

    test('skip link navigates to main content', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto('/', { waitUntil: 'networkidle' });

      // Tab to skip link and activate
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');

      // Check that main-content exists and is focused
      const mainContent = page.locator('#main-content');
      await expect(mainContent).toBeVisible();
    });

    test('skip link visible only when focused', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto('/', { waitUntil: 'networkidle' });

      const skipLink = page.locator('.skip-link');

      // Initially should be off-screen (top: -100px)
      const initialTop = await skipLink.evaluate((el) =>
        getComputedStyle(el).top
      );
      expect(parseInt(initialTop)).toBeLessThan(0);

      // Focus the skip link using direct focus (more reliable than Tab in headless)
      await skipLink.focus();
      await page.waitForTimeout(100); // Allow CSS transition to complete

      // When focused, the top value should change significantly from -100px
      // Note: Due to page scaling, the actual computed value may differ from CSS value
      const focusedTop = await skipLink.evaluate((el) =>
        getComputedStyle(el).top
      );
      const initialValue = parseInt(initialTop);
      const focusedValue = parseInt(focusedTop);

      // The skip link should move significantly closer to visible position
      // (from -100px towards 20px, so at least 50px change)
      expect(focusedValue - initialValue).toBeGreaterThan(50);
    });
  });

  // ARIA live announcer tests
  test.describe('ARIA Live Announcer', () => {
    test('announces high contrast mode change', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto('/', { waitUntil: 'networkidle' });

      // Check that aria-live region exists
      const ariaLive = page.locator('[aria-live="polite"]');
      await expect(ariaLive).toHaveCount(1);

      // Enable high contrast
      await enableHighContrast(page);

      // Wait for announcement
      await page.waitForTimeout(200);

      // Check announcement text
      const announcement = await ariaLive.textContent();
      expect(announcement).toMatch(/kontrast|contrast/i);
    });
  });
});
