import { test, expect } from '@playwright/test';

/**
 * Sanity mode tests: Verify pages handle empty/missing CMS data gracefully.
 *
 * These tests run against VITE_USE_SANITY=true (port 5174).
 * They mock Sanity API responses to simulate edge cases that only
 * occur in production (empty arrays, missing fields, API errors).
 *
 * Regression context: Kalendarz crashed with "Cannot read properties of
 * undefined (reading '_id')" when Sanity returned an empty events array.
 */

const DESKTOP_VIEWPORT = { width: 1440, height: 900 };
const MOBILE_VIEWPORT = { width: 390, height: 844 };

// Mock Sanity API to return empty results
async function mockEmptySanityResponse(page) {
  await page.route('**/api/**/query/**', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ result: [] }),
    });
  });
  // Also handle POST queries
  await page.route('**/api/**/query', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ result: [] }),
    });
  });
}

// Mock Sanity API to return null singleton
async function mockNullSingletonResponse(page) {
  await page.route('**/api/**/query/**', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ result: null }),
    });
  });
  await page.route('**/api/**/query', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ result: null }),
    });
  });
}

// Collect JS errors during page load
function collectErrors(page) {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  return errors;
}

test.describe('Sanity Mode: Empty data resilience', () => {

  test.describe('Kalendarz page', () => {
    test('desktop: handles empty events array without crash', async ({ page }) => {
      const errors = collectErrors(page);
      await mockEmptySanityResponse(page);

      await page.setViewportSize(DESKTOP_VIEWPORT);
      await page.goto('/kalendarz');
      await page.waitForLoadState('networkidle');

      expect(errors.filter(e => e.includes('Cannot read properties'))).toHaveLength(0);
      expect(errors.filter(e => e.includes('is not a function'))).toHaveLength(0);
    });

    test('mobile: handles empty events array without crash', async ({ page }) => {
      const errors = collectErrors(page);
      await mockEmptySanityResponse(page);

      await page.setViewportSize(MOBILE_VIEWPORT);
      await page.goto('/kalendarz');
      await page.waitForLoadState('networkidle');

      expect(errors.filter(e => e.includes('Cannot read properties'))).toHaveLength(0);
    });
  });

  test.describe('Archiwalne page', () => {
    test('desktop: handles empty archived events without crash', async ({ page }) => {
      const errors = collectErrors(page);
      await mockEmptySanityResponse(page);

      await page.setViewportSize(DESKTOP_VIEWPORT);
      await page.goto('/archiwalne');
      await page.waitForLoadState('networkidle');

      expect(errors.filter(e => e.includes('Cannot read properties'))).toHaveLength(0);
    });
  });

  test.describe('Wydarzenie detail page', () => {
    test('desktop: handles missing event without crash', async ({ page }) => {
      const errors = collectErrors(page);
      await mockNullSingletonResponse(page);

      await page.setViewportSize(DESKTOP_VIEWPORT);
      await page.goto('/wydarzenie/nonexistent-id');
      await page.waitForLoadState('networkidle');

      expect(errors.filter(e => e.includes('Cannot read properties'))).toHaveLength(0);
    });

    test('mobile: handles missing event without crash', async ({ page }) => {
      const errors = collectErrors(page);
      await mockNullSingletonResponse(page);

      await page.setViewportSize(MOBILE_VIEWPORT);
      await page.goto('/wydarzenie/nonexistent-id');
      await page.waitForLoadState('networkidle');

      expect(errors.filter(e => e.includes('Cannot read properties'))).toHaveLength(0);
    });
  });

  test.describe('Fundacja page', () => {
    test('desktop: handles null fundacja data without crash', async ({ page }) => {
      const errors = collectErrors(page);
      await mockNullSingletonResponse(page);

      await page.setViewportSize(DESKTOP_VIEWPORT);
      await page.goto('/fundacja');
      await page.waitForLoadState('networkidle');

      expect(errors.filter(e => e.includes('Cannot read properties'))).toHaveLength(0);
    });

    test('mobile: handles null fundacja data without crash', async ({ page }) => {
      const errors = collectErrors(page);
      await mockNullSingletonResponse(page);

      await page.setViewportSize(MOBILE_VIEWPORT);
      await page.goto('/fundacja');
      await page.waitForLoadState('networkidle');

      expect(errors.filter(e => e.includes('Cannot read properties'))).toHaveLength(0);
    });
  });

  test.describe('Repertuar page', () => {
    test('desktop: handles empty composers without crash', async ({ page }) => {
      const errors = collectErrors(page);
      await mockEmptySanityResponse(page);

      await page.setViewportSize(DESKTOP_VIEWPORT);
      await page.goto('/repertuar');
      await page.waitForLoadState('networkidle');

      expect(errors.filter(e => e.includes('Cannot read properties'))).toHaveLength(0);
    });
  });

  test.describe('Bio page', () => {
    test('desktop: handles empty bio profiles without crash', async ({ page }) => {
      const errors = collectErrors(page);
      await mockEmptySanityResponse(page);

      await page.setViewportSize(DESKTOP_VIEWPORT);
      await page.goto('/bio');
      await page.waitForLoadState('networkidle');

      expect(errors.filter(e => e.includes('Cannot read properties'))).toHaveLength(0);
    });
  });
});
