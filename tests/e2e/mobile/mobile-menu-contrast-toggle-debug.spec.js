// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Debug test to investigate why contrast toggle disappears.
 */

test.describe('MobileMenu - Contrast Toggle Debug', () => {

  test('debug: full menu item positions', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Open mobile menu
    await page.locator('button:has-text("MENU")').first().click();
    await page.waitForTimeout(500);

    // Get all menu item positions
    const menuInfo = await page.evaluate(() => {
      const menuRoot = document.getElementById('mobile-menu-root');
      if (!menuRoot) return { error: 'no menu root' };

      const menuPanel = menuRoot.querySelector('.fixed');
      if (!menuPanel) return { error: 'no menu panel' };

      const panelRect = menuPanel.getBoundingClientRect();
      const panelStyle = getComputedStyle(menuPanel);

      // Get all nav links
      const navLinks = Array.from(menuPanel.querySelectorAll('.nav-link')).map((el, i) => {
        const rect = el.getBoundingClientRect();
        return {
          index: i,
          text: el.textContent,
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height,
        };
      });

      // Get language toggle
      const langToggle = menuPanel.querySelector('.language-toggle, button[style*="text-align"]');
      const langRect = langToggle?.getBoundingClientRect();

      // Get contrast toggle
      const contrastToggle = menuPanel.querySelector('.contrast-toggle-btn');
      const contrastRect = contrastToggle?.getBoundingClientRect();
      const contrastStyle = contrastToggle ? getComputedStyle(contrastToggle) : null;

      return {
        menuPanel: {
          top: panelRect.top,
          bottom: panelRect.bottom,
          height: panelRect.height,
          overflow: panelStyle.overflow,
        },
        navLinks,
        languageToggle: langRect ? {
          top: langRect.top,
          bottom: langRect.bottom,
          height: langRect.height,
        } : null,
        contrastToggle: contrastRect ? {
          exists: true,
          top: contrastRect.top,
          bottom: contrastRect.bottom,
          height: contrastRect.height,
          withinPanel: contrastRect.bottom <= panelRect.bottom,
          overflowsPanel: contrastRect.bottom > panelRect.bottom,
          display: contrastStyle?.display,
          visibility: contrastStyle?.visibility,
          opacity: contrastStyle?.opacity,
        } : { exists: false },
      };
    });

    console.log('Menu item positions:', JSON.stringify(menuInfo, null, 2));

    // Check if contrast toggle overflows the panel
    if (menuInfo.contrastToggle?.exists) {
      if (menuInfo.contrastToggle.overflowsPanel) {
        console.log('BUG: Contrast toggle overflows panel!');
        console.log(`  Toggle bottom: ${menuInfo.contrastToggle.bottom}`);
        console.log(`  Panel bottom: ${menuInfo.menuPanel.bottom}`);
      }
    }

    expect(menuInfo.contrastToggle?.exists).toBe(true);
  });

  test('debug: contrast toggle visibility after clicking', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Open mobile menu
    await page.locator('button:has-text("MENU")').first().click();
    await page.waitForTimeout(500);

    // Find and click contrast toggle
    const toggle = page.locator('#mobile-menu-root .contrast-toggle-btn');

    // Check BEFORE clicking
    const beforeInfo = await page.evaluate(() => {
      const btn = document.querySelector('#mobile-menu-root .contrast-toggle-btn');
      if (!btn) return { found: false };
      const rect = btn.getBoundingClientRect();
      const style = getComputedStyle(btn);
      const svg = btn.querySelector('svg');
      const svgStyle = svg ? getComputedStyle(svg) : null;
      return {
        found: true,
        rect: { top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height },
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        filter: style.filter,
        svgColor: svgStyle?.color,
        highContrast: document.body.classList.contains('high-contrast'),
      };
    });
    console.log('BEFORE click:', JSON.stringify(beforeInfo, null, 2));

    // Click the toggle
    await toggle.click();
    await page.waitForTimeout(500);

    // Take full page screenshot
    await page.screenshot({ path: 'test-results/contrast-toggle-debug-after-click.png', fullPage: false });

    // Check AFTER clicking
    const afterInfo = await page.evaluate(() => {
      const btn = document.querySelector('#mobile-menu-root .contrast-toggle-btn');
      if (!btn) return { found: false };
      const rect = btn.getBoundingClientRect();
      const style = getComputedStyle(btn);
      const svg = btn.querySelector('svg');
      const svgStyle = svg ? getComputedStyle(svg) : null;
      return {
        found: true,
        rect: { top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height },
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        filter: style.filter,
        svgColor: svgStyle?.color,
        highContrast: document.body.classList.contains('high-contrast'),
      };
    });
    console.log('AFTER click:', JSON.stringify(afterInfo, null, 2));

    // The toggle should still be visible and have good size
    expect(afterInfo.found).toBe(true);
    expect(afterInfo.display).not.toBe('none');
    expect(afterInfo.visibility).not.toBe('hidden');
    expect(afterInfo.rect.width).toBeGreaterThan(0);
    expect(afterInfo.rect.height).toBeGreaterThan(0);
  });

  test('debug: is toggle cut off by overflow?', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Open mobile menu
    await page.locator('button:has-text("MENU")').first().click();
    await page.waitForTimeout(500);

    // Enable high contrast
    await page.locator('#mobile-menu-root .contrast-toggle-btn').click();
    await page.waitForTimeout(300);

    // Check overflow situation
    const overflowCheck = await page.evaluate(() => {
      const menuRoot = document.getElementById('mobile-menu-root');
      const panel = menuRoot?.querySelector('.fixed');
      const toggle = menuRoot?.querySelector('.contrast-toggle-btn');

      if (!panel || !toggle) return { error: 'elements not found' };

      const panelRect = panel.getBoundingClientRect();
      const panelStyle = getComputedStyle(panel);
      const toggleRect = toggle.getBoundingClientRect();

      // Check if toggle is within the visible area of the panel
      const isWithinPanel =
        toggleRect.top >= panelRect.top &&
        toggleRect.bottom <= panelRect.bottom &&
        toggleRect.left >= panelRect.left &&
        toggleRect.right <= panelRect.right;

      return {
        panelBounds: {
          top: panelRect.top,
          bottom: panelRect.bottom,
          left: panelRect.left,
          right: panelRect.right,
          overflow: panelStyle.overflow,
          overflowY: panelStyle.overflowY,
        },
        toggleBounds: {
          top: toggleRect.top,
          bottom: toggleRect.bottom,
          left: toggleRect.left,
          right: toggleRect.right,
        },
        isWithinPanel,
        overflowsBottom: toggleRect.bottom > panelRect.bottom,
        overflowAmount: toggleRect.bottom - panelRect.bottom,
      };
    });

    console.log('Overflow check:', JSON.stringify(overflowCheck, null, 2));

    // Toggle should be within panel bounds
    if (overflowCheck.overflowsBottom) {
      console.log(`BUG: Toggle overflows by ${overflowCheck.overflowAmount}px`);
    }

    expect(overflowCheck.isWithinPanel, 'Toggle should be within panel bounds').toBe(true);
  });
});
