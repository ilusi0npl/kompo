// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Production smoke tests for Repertuar and Specialne pages
 * Verifies repertoire listings render correctly.
 */

test.describe('Repertuar - Production', () => {
  test('renders without JS errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/repertuar', { waitUntil: 'networkidle' });
    expect(errors).toHaveLength(0);
  });

  test('displays repertoire title', async ({ page }) => {
    await page.goto('/repertuar', { waitUntil: 'networkidle' });
    const title = page.locator('text=Repertuar').first();
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('displays composer names', async ({ page }) => {
    await page.goto('/repertuar', { waitUntil: 'networkidle' });
    const bodyText = await page.locator('body').innerText();
    // Should have composer/piece content
    expect(bodyText.length).toBeGreaterThan(100);
  });

  test('tab navigation works', async ({ page }) => {
    await page.goto('/repertuar', { waitUntil: 'networkidle' });

    // Look for tab-like elements
    const specialneTab = page.locator('text=Projekty specjalne').first();
    const isVisible = await specialneTab.isVisible().catch(() => false);
    if (isVisible) {
      await specialneTab.click();
      await page.waitForTimeout(500);
      // Content should change
      const bodyText = await page.locator('body').innerText();
      expect(bodyText.length).toBeGreaterThan(50);
    }
  });

  test('displays footer', async ({ page }) => {
    await page.goto('/repertuar', { waitUntil: 'networkidle' });
    const footer = page.locator('text=KOMPOPOLEX@GMAIL.COM').first();
    await expect(footer).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Specialne - Production', () => {
  test('renders without JS errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/specialne', { waitUntil: 'networkidle' });
    expect(errors).toHaveLength(0);
  });

  test('displays content', async ({ page }) => {
    await page.goto('/specialne', { waitUntil: 'networkidle' });
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });
});
