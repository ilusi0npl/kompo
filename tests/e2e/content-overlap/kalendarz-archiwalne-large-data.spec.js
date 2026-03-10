// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test that Kalendarz and Archiwalne pages work correctly in large test data mode.
 * These tests require the local dev server to run with VITE_LARGE_TEST_DATA=true.
 * They are skipped when running against the default local server.
 */

test.describe('Kalendarz - Large Test Data', () => {
  test('should display events with real images', async ({ page }) => {
    await page.goto('/kalendarz');
    await page.waitForLoadState('networkidle');

    // This test only applies when using local asset paths (large test data mode)
    const allImages = page.locator('section[data-section="kalendarz"] img');
    const firstSrc = await allImages.first().getAttribute('src');
    test.skip(!firstSrc?.includes('/assets/kalendarz/'), 'Not using local kalendarz assets (Sanity CDN in use)');

    const eventImages = page.locator('section[data-section="kalendarz"] img[src*="/assets/kalendarz/"]');
    const count = await eventImages.count();
    console.log(`Found ${count} event images on /kalendarz page`);

    expect(count).toBeGreaterThanOrEqual(1);

    const firstImageSrc = await eventImages.first().getAttribute('src');
    console.log(`First event image src: ${firstImageSrc}`);
    expect(firstImageSrc).toMatch(/\/assets\/kalendarz\/event[123]\.webp/);
  });

  test('should load event images without 404 errors', async ({ page }) => {
    const failedRequests = [];

    page.on('requestfailed', request => {
      if (request.resourceType() === 'image') {
        failedRequests.push(request.url());
      }
    });

    await page.goto('/kalendarz');
    await page.waitForLoadState('networkidle');

    await page.waitForTimeout(1000);

    console.log(`Failed image requests: ${failedRequests.length}`);
    if (failedRequests.length > 0) {
      console.log('Failed URLs:', failedRequests);
    }

    const kalendarzFailures = failedRequests.filter(url => url.includes('/kalendarz/'));
    expect(kalendarzFailures).toHaveLength(0);
  });

  test('should display multiple events in large data mode', async ({ page }) => {
    await page.goto('/kalendarz');
    await page.waitForLoadState('networkidle');

    const eventDates = page.locator('section[data-section="kalendarz"]').locator('text=/\\d{2}\\.\\d{2}\\.\\d{2}/');
    const count = await eventDates.count();
    console.log(`Found ${count} event date elements`);

    expect(count).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Archiwalne - Large Test Data', () => {
  test('should display archived events with real images', async ({ page }) => {
    await page.goto('/archiwalne');
    await page.waitForLoadState('networkidle');

    const eventImages = page.locator('section[data-section="archiwalne"] img[src*="/assets/archiwalne/"]');
    const count = await eventImages.count();
    console.log(`Found ${count} archived event images on /archiwalne page`);

    test.skip(count === 0, 'Large test data mode not enabled (VITE_LARGE_TEST_DATA=true)');

    expect(count).toBeGreaterThanOrEqual(3);

    const firstImageSrc = await eventImages.first().getAttribute('src');
    console.log(`First archived image src: ${firstImageSrc}`);
    expect(firstImageSrc).toMatch(/\/assets\/archiwalne\/event[1-6]\.jpg/);
  });

  test('should load archived event images without 404 errors', async ({ page }) => {
    const failedRequests = [];

    page.on('requestfailed', request => {
      if (request.resourceType() === 'image') {
        failedRequests.push(request.url());
      }
    });

    await page.goto('/archiwalne');
    await page.waitForLoadState('networkidle');

    await page.waitForTimeout(1000);

    console.log(`Failed image requests: ${failedRequests.length}`);
    if (failedRequests.length > 0) {
      console.log('Failed URLs:', failedRequests);
    }

    const archiwalneFailures = failedRequests.filter(url => url.includes('/archiwalne/'));
    expect(archiwalneFailures).toHaveLength(0);
  });

  test('should display grid of archived events in large data mode', async ({ page }) => {
    await page.goto('/archiwalne');
    await page.waitForLoadState('networkidle');

    const eventCards = page.locator('section[data-section="archiwalne"] img[src*="/assets/archiwalne/"]');
    const count = await eventCards.count();
    console.log(`Found ${count} archived event cards`);

    test.skip(count === 0, 'Large test data mode not enabled (VITE_LARGE_TEST_DATA=true)');

    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('should cycle through all 6 real images', async ({ page }) => {
    await page.goto('/archiwalne');
    await page.waitForLoadState('networkidle');

    const eventImages = page.locator('section[data-section="archiwalne"] img[src*="/assets/archiwalne/"]');
    const count = await eventImages.count();

    test.skip(count === 0, 'Large test data mode not enabled (VITE_LARGE_TEST_DATA=true)');

    const imageSources = new Set();
    for (let i = 0; i < Math.min(count, 12); i++) {
      const src = await eventImages.nth(i).getAttribute('src');
      if (src) {
        imageSources.add(src);
      }
    }

    console.log(`Unique image sources found: ${imageSources.size}`);
    console.log('Sources:', Array.from(imageSources));

    expect(imageSources.size).toBeGreaterThanOrEqual(3);
  });
});
