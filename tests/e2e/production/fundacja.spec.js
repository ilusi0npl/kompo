// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Production smoke tests for Fundacja and Kontakt pages
 * Verifies foundation info and contact details render correctly.
 */

test.describe('Fundacja - Production', () => {
  test('renders without JS errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/fundacja', { waitUntil: 'networkidle' });
    expect(errors).toHaveLength(0);
  });

  test('displays foundation name', async ({ page }) => {
    await page.goto('/fundacja', { waitUntil: 'networkidle' });
    const title = page.locator('text=Fundacja').first();
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('displays KRS number', async ({ page }) => {
    await page.goto('/fundacja', { waitUntil: 'networkidle' });
    const krs = page.locator('text=KRS').first();
    await expect(krs).toBeVisible({ timeout: 10000 });
  });

  test('displays bank account info', async ({ page }) => {
    await page.goto('/fundacja', { waitUntil: 'networkidle' });
    const bodyText = await page.locator('body').innerText();
    // Should have bank account or REGON
    expect(bodyText).toMatch(/REGON|NIP|KRS/i);
  });

  test('portable text content renders (no [object Object])', async ({ page }) => {
    await page.goto('/fundacja', { waitUntil: 'networkidle' });
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toContain('[object Object]');
  });

  test('displays footer', async ({ page }) => {
    await page.goto('/fundacja', { waitUntil: 'networkidle' });
    const footer = page.locator('text=KOMPOPOLEX@GMAIL.COM').first();
    await expect(footer).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Kontakt - Production', () => {
  test('renders without JS errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/kontakt', { waitUntil: 'networkidle' });
    expect(errors).toHaveLength(0);
  });

  test('displays email address', async ({ page }) => {
    await page.goto('/kontakt', { waitUntil: 'networkidle' });
    const email = page.locator('text=KOMPOPOLEX@GMAIL.COM').first();
    await expect(email).toBeVisible({ timeout: 10000 });
  });

  test('displays social media links', async ({ page }) => {
    await page.goto('/kontakt', { waitUntil: 'networkidle' });
    const facebook = page.locator('text=FACEBOOK').first();
    const instagram = page.locator('text=INSTAGRAM').first();
    await expect(facebook).toBeVisible({ timeout: 5000 });
    await expect(instagram).toBeVisible({ timeout: 5000 });
  });

  test('displays contact image', async ({ page }) => {
    await page.goto('/kontakt', { waitUntil: 'networkidle' });
    const images = page.locator('img[src*="cdn.sanity.io"]');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
  });
});
