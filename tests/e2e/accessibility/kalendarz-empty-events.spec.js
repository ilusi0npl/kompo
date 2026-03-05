import { test, expect } from '@playwright/test';

/**
 * Test that Kalendarz page handles empty/missing events gracefully.
 * Regression test for: Cannot read properties of undefined (reading '_id')
 * when Sanity returns empty events array.
 */

const DESKTOP_VIEWPORT = { width: 1440, height: 900 };
const MOBILE_VIEWPORT = { width: 390, height: 844 };

test.describe('Kalendarz page - empty events handling', () => {
  test('desktop: does not crash with JS errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.setViewportSize(DESKTOP_VIEWPORT);
    await page.goto('/kalendarz');
    await page.waitForLoadState('networkidle');

    // Page should render without "Cannot read properties of undefined" errors
    const crashErrors = errors.filter(e => e.includes('Cannot read properties of undefined'));
    expect(crashErrors).toHaveLength(0);
  });

  test('mobile: does not crash with JS errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto('/kalendarz');
    await page.waitForLoadState('networkidle');

    const crashErrors = errors.filter(e => e.includes('Cannot read properties of undefined'));
    expect(crashErrors).toHaveLength(0);
  });
});
