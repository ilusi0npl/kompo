import { test, expect } from '@playwright/test';

/**
 * E2E tests for Fundacja page description rendering and mobile/desktop parity.
 *
 * These tests verify that:
 * 1. The description section renders substantial content (not just a short sentence)
 * 2. Both desktop and mobile viewports show the description
 * 3. Mobile uses Sanity data (parity with desktop)
 */

const FUNDACJA_URL = '/fundacja';
const DESKTOP_VIEWPORT = { width: 1440, height: 900 };
const MOBILE_VIEWPORT = { width: 390, height: 844 };

test.describe('Fundacja page - description rendering', () => {
  test('desktop: description section is visible and contains substantial content', async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
    await page.goto(FUNDACJA_URL);
    await page.waitForLoadState('networkidle');

    // Find the description container by data-testid
    const description = page.locator('[data-testid="fundacja-description"]');
    await expect(description).toBeVisible();

    // Verify the description has substantial content (more than a short sentence)
    const text = await description.textContent();
    expect(text.length).toBeGreaterThan(100);
  });

  test('mobile: description section is visible and contains substantial content', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto(FUNDACJA_URL);
    await page.waitForLoadState('networkidle');

    const description = page.locator('[data-testid="fundacja-description"]');
    await expect(description).toBeVisible();

    const text = await description.textContent();
    expect(text.length).toBeGreaterThan(100);
  });

  test('mobile uses Sanity data for registration info (parity with desktop)', async ({ page }) => {
    // Desktop
    await page.setViewportSize(DESKTOP_VIEWPORT);
    await page.goto(FUNDACJA_URL);
    await page.waitForLoadState('networkidle');

    const desktopKrs = await page.locator('text=KRS:').first().textContent();

    // Mobile
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto(FUNDACJA_URL);
    await page.waitForLoadState('networkidle');

    const mobileKrs = await page.locator('text=KRS:').first().textContent();

    // Both should show the same KRS number
    expect(desktopKrs).toBe(mobileKrs);
  });
});
