// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Production smoke tests for Kalendarz and Archiwalne pages
 * Verifies event listings render correctly from Sanity CMS.
 */

test.describe('Kalendarz - Production', () => {
  test('renders without JS errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/kalendarz', { waitUntil: 'networkidle' });
    expect(errors).toHaveLength(0);
  });

  test('displays page title', async ({ page }) => {
    await page.goto('/kalendarz', { waitUntil: 'networkidle' });
    const title = page.locator('text=Kalendarz').first();
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('shows events or empty state message', async ({ page }) => {
    await page.goto('/kalendarz', { waitUntil: 'networkidle' });
    // Either shows events or "no events" message
    const hasEvents = await page.locator('[data-section="kalendarz"] img[src*="cdn.sanity.io"]').count();
    const hasEmptyMsg = await page.locator('text=Brak nadchodzących').count();
    expect(hasEvents + hasEmptyMsg).toBeGreaterThan(0);
  });
});

test.describe('Archiwalne - Production', () => {
  test('renders without JS errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/archiwalne', { waitUntil: 'networkidle' });
    expect(errors).toHaveLength(0);
  });

  test('displays archived events with images', async ({ page }) => {
    await page.goto('/archiwalne', { waitUntil: 'networkidle' });
    const images = page.locator('img[src*="cdn.sanity.io"]');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
  });

  test('displays event titles', async ({ page }) => {
    await page.goto('/archiwalne', { waitUntil: 'networkidle' });
    // Should have at least one event title link
    const eventLinks = page.locator('a[href*="/wydarzenie/"]');
    const count = await eventLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('event titles do not overflow container', async ({ page }) => {
    await page.goto('/archiwalne', { waitUntil: 'networkidle' });
    // Check that no event title link overflows its parent
    const links = page.locator('a[href*="/wydarzenie/"]');
    const count = await links.count();
    for (let i = 0; i < Math.min(count, 6); i++) {
      const link = links.nth(i);
      const isVisible = await link.isVisible();
      if (!isVisible) continue;
      const box = await link.boundingBox();
      if (box) {
        // Title should not extend beyond reasonable width (1440px page)
        expect(box.width).toBeLessThan(1500);
      }
    }
  });

  test('displays footer', async ({ page }) => {
    await page.goto('/archiwalne', { waitUntil: 'networkidle' });
    const footer = page.locator('text=KOMPOPOLEX@GMAIL.COM').first();
    await expect(footer).toBeVisible({ timeout: 10000 });
  });
});
