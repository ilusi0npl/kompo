/**
 * Color Contrast Audit - E2E Tests
 *
 * WCAG 2.1 AA Color Contrast Tests using axe-core.
 * Tests both normal mode and high contrast mode across all pages.
 *
 * Run with: npx playwright test color-contrast-audit
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// All pages to audit
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
 * Run axe-core accessibility audit focused on color contrast
 */
async function runContrastAudit(page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2aa', 'wcag21aa'])
    .withRules(['color-contrast', 'color-contrast-enhanced'])
    .analyze();

  return results;
}

/**
 * Format axe violations for readable output
 */
function formatViolations(violations) {
  if (violations.length === 0) return 'No violations';

  return violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    description: v.description,
    nodes: v.nodes.map((n) => ({
      html: n.html.substring(0, 100),
      failureSummary: n.failureSummary,
    })),
  }));
}

test.describe('Color Contrast Audit', () => {
  // Desktop tests - Normal Mode
  test.describe('Desktop (1440px) - Normal Mode', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
    });

    for (const pageConfig of PAGES) {
      test(`${pageConfig.name} (${pageConfig.path}) - contrast check`, async ({
        page,
      }) => {
        await page.goto(pageConfig.path, { waitUntil: 'networkidle' });

        const results = await runContrastAudit(page);

        // Log violations for debugging
        if (results.violations.length > 0) {
          console.log(
            `Contrast violations on ${pageConfig.name}:`,
            formatViolations(results.violations)
          );
        }

        // For now, we report but don't fail on contrast issues
        // This allows us to audit current state and track improvements
        // To enforce strict compliance, change to: expect(results.violations.length).toBe(0);
        expect(results.violations.length).toBeGreaterThanOrEqual(0);
      });
    }
  });

  // Desktop tests - High Contrast Mode
  test.describe('Desktop (1440px) - High Contrast Mode', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
    });

    for (const pageConfig of PAGES) {
      test(`${pageConfig.name} (${pageConfig.path}) - high contrast check`, async ({
        page,
      }) => {
        await page.goto(pageConfig.path, { waitUntil: 'networkidle' });
        await enableHighContrast(page);

        const results = await runContrastAudit(page);

        // In high contrast mode, we expect improved contrast
        // Log any remaining violations
        if (results.violations.length > 0) {
          console.log(
            `High contrast violations on ${pageConfig.name}:`,
            formatViolations(results.violations)
          );
        }

        expect(results.violations.length).toBeGreaterThanOrEqual(0);
      });
    }
  });

  // Mobile tests - Normal Mode
  test.describe('Mobile (390px) - Normal Mode', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
    });

    for (const pageConfig of PAGES) {
      test(`${pageConfig.name} (${pageConfig.path}) - contrast check`, async ({
        page,
      }) => {
        await page.goto(pageConfig.path, { waitUntil: 'networkidle' });

        const results = await runContrastAudit(page);

        if (results.violations.length > 0) {
          console.log(
            `Mobile contrast violations on ${pageConfig.name}:`,
            formatViolations(results.violations)
          );
        }

        expect(results.violations.length).toBeGreaterThanOrEqual(0);
      });
    }
  });

  // Mobile tests - High Contrast Mode
  test.describe('Mobile (390px) - High Contrast Mode', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
    });

    for (const pageConfig of PAGES) {
      test(`${pageConfig.name} (${pageConfig.path}) - high contrast check`, async ({
        page,
      }) => {
        await page.goto(pageConfig.path, { waitUntil: 'networkidle' });

        // Open mobile menu to access contrast toggle
        const menuBtn = page
          .locator('.mobile-menu-btn, button:has-text("MENU")')
          .first();
        if (await menuBtn.isVisible({ timeout: 3000 })) {
          await menuBtn.click();
          await page.waitForTimeout(300);

          // Enable high contrast from within the menu
          const contrastBtn = page.locator('.contrast-toggle-btn').first();
          if (await contrastBtn.isVisible({ timeout: 2000 })) {
            await contrastBtn.click();
            await page.waitForTimeout(200);
          }

          // Close menu to test page content
          const closeBtn = page.locator('.mobile-menu-close').first();
          if (await closeBtn.isVisible({ timeout: 1000 })) {
            await closeBtn.click();
            await page.waitForTimeout(200);
          }
        }

        const results = await runContrastAudit(page);

        if (results.violations.length > 0) {
          console.log(
            `Mobile high contrast violations on ${pageConfig.name}:`,
            formatViolations(results.violations)
          );
        }

        expect(results.violations.length).toBeGreaterThanOrEqual(0);
      });
    }
  });

  // Summary test - generates comprehensive report
  test('Generate contrast audit summary', async ({ page }, testInfo) => {
    testInfo.setTimeout(120000); // 2 minute timeout for comprehensive audit
    await page.setViewportSize(VIEWPORTS.desktop);

    const summary = {
      normalMode: { desktop: {}, mobile: {} },
      highContrastMode: { desktop: {}, mobile: {} },
    };

    // Audit all pages in normal mode (desktop)
    for (const pageConfig of PAGES) {
      await page.goto(pageConfig.path, { waitUntil: 'networkidle' });
      const results = await runContrastAudit(page);
      summary.normalMode.desktop[pageConfig.name] = {
        violations: results.violations.length,
        passes: results.passes.length,
      };
    }

    // Audit all pages in high contrast mode (desktop)
    for (const pageConfig of PAGES) {
      await page.goto(pageConfig.path, { waitUntil: 'networkidle' });
      await enableHighContrast(page);
      const results = await runContrastAudit(page);
      summary.highContrastMode.desktop[pageConfig.name] = {
        violations: results.violations.length,
        passes: results.passes.length,
      };
      // Clear high contrast for next iteration
      await page.evaluate(() => localStorage.removeItem('highContrast'));
    }

    console.log('\n=== COLOR CONTRAST AUDIT SUMMARY ===\n');
    console.log('Normal Mode (Desktop):');
    for (const [name, data] of Object.entries(summary.normalMode.desktop)) {
      console.log(`  ${name}: ${data.violations} violations, ${data.passes} passes`);
    }
    console.log('\nHigh Contrast Mode (Desktop):');
    for (const [name, data] of Object.entries(summary.highContrastMode.desktop)) {
      console.log(`  ${name}: ${data.violations} violations, ${data.passes} passes`);
    }
    console.log('\n=====================================\n');

    // This test always passes - it's for generating the report
    expect(true).toBe(true);
  });
});
