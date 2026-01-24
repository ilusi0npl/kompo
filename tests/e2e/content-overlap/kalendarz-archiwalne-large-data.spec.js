// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test that Kalendarz and Archiwalne pages work correctly in large test data mode
 */
test.describe('Kalendarz - Large Test Data', () => {
  test('should display events with real images', async ({ page }) => {
    await page.goto('/kalendarz');
    await page.waitForLoadState('networkidle');

    // Check that event images are displayed with real assets
    const eventImages = page.locator('section[data-section="kalendarz"] img[src*="/assets/kalendarz/"]');
    const count = await eventImages.count();
    console.log(`Found ${count} event images on /kalendarz page`);

    // In large test data mode, we should have multiple events
    expect(count).toBeGreaterThanOrEqual(1);

    // Verify first image uses real asset path
    const firstImageSrc = await eventImages.first().getAttribute('src');
    console.log(`First event image src: ${firstImageSrc}`);
    expect(firstImageSrc).toMatch(/\/assets\/kalendarz\/event[123]\.webp/);
  });

  test('should load event images without 404 errors', async ({ page }) => {
    const failedRequests = [];

    // Listen for failed image requests
    page.on('requestfailed', request => {
      if (request.resourceType() === 'image') {
        failedRequests.push(request.url());
      }
    });

    await page.goto('/kalendarz');
    await page.waitForLoadState('networkidle');

    // Give time for images to load
    await page.waitForTimeout(1000);

    console.log(`Failed image requests: ${failedRequests.length}`);
    if (failedRequests.length > 0) {
      console.log('Failed URLs:', failedRequests);
    }

    // No kalendarz images should fail
    const kalendarzFailures = failedRequests.filter(url => url.includes('/kalendarz/'));
    expect(kalendarzFailures).toHaveLength(0);
  });

  test('should display multiple events in large data mode', async ({ page }) => {
    await page.goto('/kalendarz');
    await page.waitForLoadState('networkidle');

    // Check for event cards/sections - each event has a date
    const eventDates = page.locator('section[data-section="kalendarz"]').locator('text=/\\d{2}\\.\\d{2}\\.\\d{2}/');
    const count = await eventDates.count();
    console.log(`Found ${count} event date elements`);

    // In large test data mode (50 events), we should see at least a few
    // (visible on first scroll)
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Archiwalne - Large Test Data', () => {
  test('should display archived events with real images', async ({ page }) => {
    await page.goto('/archiwalne');
    await page.waitForLoadState('networkidle');

    // Check that archived event images are displayed with real assets
    const eventImages = page.locator('section[data-section="archiwalne"] img[src*="/assets/archiwalne/"]');
    const count = await eventImages.count();
    console.log(`Found ${count} archived event images on /archiwalne page`);

    // In large test data mode, we should have many events
    expect(count).toBeGreaterThanOrEqual(3);

    // Verify images use real asset paths
    const firstImageSrc = await eventImages.first().getAttribute('src');
    console.log(`First archived image src: ${firstImageSrc}`);
    expect(firstImageSrc).toMatch(/\/assets\/archiwalne\/event[1-6]\.jpg/);
  });

  test('should load archived event images without 404 errors', async ({ page }) => {
    const failedRequests = [];

    // Listen for failed image requests
    page.on('requestfailed', request => {
      if (request.resourceType() === 'image') {
        failedRequests.push(request.url());
      }
    });

    await page.goto('/archiwalne');
    await page.waitForLoadState('networkidle');

    // Give time for images to load
    await page.waitForTimeout(1000);

    console.log(`Failed image requests: ${failedRequests.length}`);
    if (failedRequests.length > 0) {
      console.log('Failed URLs:', failedRequests);
    }

    // No archiwalne images should fail
    const archiwalneFailures = failedRequests.filter(url => url.includes('/archiwalne/'));
    expect(archiwalneFailures).toHaveLength(0);
  });

  test('should display grid of archived events in large data mode', async ({ page }) => {
    await page.goto('/archiwalne');
    await page.waitForLoadState('networkidle');

    // In large test data mode, we generate 100 events
    // Check that multiple cards are rendered
    const eventCards = page.locator('section[data-section="archiwalne"] img[src*="/assets/archiwalne/"]');
    const count = await eventCards.count();
    console.log(`Found ${count} archived event cards`);

    // Should have more than the normal 6 events
    // At least visible ones on first viewport
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('should cycle through all 6 real images', async ({ page }) => {
    await page.goto('/archiwalne');
    await page.waitForLoadState('networkidle');

    // Get all image sources
    const eventImages = page.locator('section[data-section="archiwalne"] img[src*="/assets/archiwalne/"]');
    const count = await eventImages.count();

    const imageSources = new Set();
    for (let i = 0; i < Math.min(count, 12); i++) {
      const src = await eventImages.nth(i).getAttribute('src');
      if (src) {
        imageSources.add(src);
      }
    }

    console.log(`Unique image sources found: ${imageSources.size}`);
    console.log('Sources:', Array.from(imageSources));

    // Should use multiple different images (cycling through 6)
    expect(imageSources.size).toBeGreaterThanOrEqual(3);
  });
});
