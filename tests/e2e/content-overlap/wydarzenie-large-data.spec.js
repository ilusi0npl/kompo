// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test that Wydarzenie (event detail) page works correctly in large test data mode
 */
test.describe('Wydarzenie - Large Test Data', () => {
  test('should load event detail page for event ID 1', async ({ page }) => {
    await page.goto('/wydarzenie/1');
    await page.waitForLoadState('networkidle');

    // Check that page loaded successfully (has wydarzenie section)
    const section = page.locator('section[data-section="wydarzenie"]');
    await expect(section).toBeVisible();

    // Check that event image is displayed with real asset
    const eventImage = page.locator('section[data-section="wydarzenie"] img[src*="/assets/kalendarz/"]');
    await expect(eventImage).toBeVisible();

    const imageSrc = await eventImage.getAttribute('src');
    console.log(`Event 1 image src: ${imageSrc}`);
    expect(imageSrc).toMatch(/\/assets\/kalendarz\/event[123]\.webp/);
  });

  test('should load event detail page for event ID 2 (special event)', async ({ page }) => {
    // Note: /wydarzenie/2 is a special route with its own static event data
    // It uses /assets/wydarzenie/poster.jpg instead of kalendarz images
    await page.goto('/wydarzenie/2');
    await page.waitForLoadState('networkidle');

    // Check that page loaded successfully
    const section = page.locator('section[data-section="wydarzenie"]');
    await expect(section).toBeVisible();

    // Check that the main event poster image is displayed
    const eventImage = page.locator('section[data-section="wydarzenie"] img[src*="poster.jpg"]');
    await expect(eventImage).toBeVisible();

    const imageSrc = await eventImage.getAttribute('src');
    console.log(`Event 2 (special) image src: ${imageSrc}`);
    expect(imageSrc).toContain('/assets/wydarzenie/poster.jpg');
  });

  test.skip('should load event detail page for event ID 10', async ({ page }) => {
    // SKIP: This test only works in large test data mode (VITE_LARGE_TEST_DATA=true)
    // Event ID 10 doesn't exist in normal mode
    await page.goto('/wydarzenie/10');
    await page.waitForLoadState('networkidle');

    // Check that page loaded successfully
    const section = page.locator('section[data-section="wydarzenie"]');
    await expect(section).toBeVisible();

    // Check for event content
    const eventImage = page.locator('section[data-section="wydarzenie"] img[src*="/assets/kalendarz/"]');
    await expect(eventImage).toBeVisible();
  });

  test('should navigate from kalendarz to wydarzenie', async ({ page }) => {
    await page.goto('/kalendarz');
    await page.waitForLoadState('networkidle');

    // Click on first event link
    const eventLink = page.locator('a[href^="/wydarzenie/"]').first();
    await expect(eventLink).toBeVisible();

    const href = await eventLink.getAttribute('href');
    console.log(`Clicking event link: ${href}`);

    await eventLink.click();
    await page.waitForLoadState('networkidle');

    // Should be on wydarzenie page
    expect(page.url()).toContain('/wydarzenie/');

    // Page should load successfully
    const section = page.locator('section[data-section="wydarzenie"]');
    await expect(section).toBeVisible();
  });

  test('should display event details with correct data', async ({ page }) => {
    await page.goto('/wydarzenie/1');
    await page.waitForLoadState('networkidle');

    // Check for date format (dd.mm.yy)
    const dateText = page.locator('text=/\\d{2}\\.\\d{2}\\.\\d{2}/').first();
    await expect(dateText).toBeVisible();

    // Check for location text
    const locationIcon = page.locator('img[src*="place-icon"]');
    await expect(locationIcon).toBeVisible();

    // Check for program section (has list items)
    const programItems = page.locator('section[data-section="wydarzenie"] li');
    const count = await programItems.count();
    console.log(`Found ${count} program items`);
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('should load images without 404 errors', async ({ page }) => {
    const failedRequests = [];

    page.on('requestfailed', request => {
      if (request.resourceType() === 'image') {
        failedRequests.push(request.url());
      }
    });

    await page.goto('/wydarzenie/5');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    console.log(`Failed image requests: ${failedRequests.length}`);
    if (failedRequests.length > 0) {
      console.log('Failed URLs:', failedRequests);
    }

    // No wydarzenie-related images should fail
    const wydarzenieFailures = failedRequests.filter(url =>
      url.includes('/kalendarz/') || url.includes('/wydarzenie/')
    );
    expect(wydarzenieFailures).toHaveLength(0);
  });
});
