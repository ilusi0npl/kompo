// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Production smoke tests for Bio page
 * Verifies profiles, images, and footer render correctly.
 */

test.describe('Bio - Production', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bio', { waitUntil: 'networkidle' });
  });

  test('renders without JS errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.reload({ waitUntil: 'networkidle' });
    expect(errors).toHaveLength(0);
  });

  test('displays page title', async ({ page }) => {
    const title = page.locator('text=Bio').first();
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('displays profile images', async ({ page }) => {
    const images = page.locator('img[src*="cdn.sanity.io"]');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
  });

  test('displays ensemble link or profile names', async ({ page }) => {
    // Should show at least one profile name or ensemble
    const ensemble = page.locator('text=Ensemble').first();
    await expect(ensemble).toBeVisible({ timeout: 10000 });
  });

  test('displays footer with email', async ({ page }) => {
    const footer = page.locator('text=KOMPOPOLEX@GMAIL.COM').first();
    await expect(footer).toBeVisible({ timeout: 10000 });
  });

  test('language toggle works', async ({ page }) => {
    const toggle = page.locator('text=ENG').first();
    await expect(toggle).toBeVisible({ timeout: 5000 });
    await toggle.click();
    await page.waitForTimeout(500);
    const plToggle = page.locator('text=PL').first();
    await expect(plToggle).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Bio Ensemble - Production', () => {
  test('renders ensemble page', async ({ page }) => {
    await page.goto('/bio/ensemble', { waitUntil: 'networkidle' });

    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));

    // Should have ensemble content
    const content = page.locator('text=Kompopolex').first();
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});
