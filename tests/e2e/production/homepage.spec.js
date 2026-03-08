// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Production smoke tests for Homepage
 * Verifies the fullscreen slideshow landing page renders correctly.
 */

test.describe('Homepage - Production', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('renders without JS errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.reload({ waitUntil: 'networkidle' });
    expect(errors).toHaveLength(0);
  });

  test('displays logo', async ({ page }) => {
    const logo = page.locator('img[alt="Kompopolex"]').first();
    await expect(logo).toBeVisible({ timeout: 10000 });
  });

  test('slideshow images load', async ({ page }) => {
    const images = page.locator('img[src*="cdn.sanity.io"], img[src*="assets"]');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    // At least one image should be visible
    const firstVisible = images.first();
    await expect(firstVisible).toBeVisible({ timeout: 10000 });
  });

  test('navigation links exist in DOM', async ({ page }) => {
    // Homepage is fullscreen slideshow - nav links exist but may be in hidden menu
    const bioLink = page.locator('a[href="/bio"]').first();
    await expect(bioLink).toBeAttached({ timeout: 10000 });
  });
});
