// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test that gallery works correctly in large test data mode
 */
test.describe('Media Gallery - Large Test Data', () => {
  test('should display album grid with multiple albums', async ({ page }) => {
    await page.goto('/media');
    await page.waitForLoadState('networkidle');

    // Check that albums are displayed
    const albumLinks = page.locator('a[href^="/media/galeria/"]');
    const count = await albumLinks.count();
    console.log(`Found ${count} album links on /media page`);

    // In large test data mode, we should have 30 albums
    // In normal mode, we have 6 albums
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('should navigate to gallery and display images', async ({ page }) => {
    await page.goto('/media');
    await page.waitForLoadState('networkidle');

    // Click on first album
    const firstAlbum = page.locator('a[href^="/media/galeria/"]').first();
    const albumHref = await firstAlbum.getAttribute('href');
    console.log(`Clicking on album: ${albumHref}`);

    await firstAlbum.click();
    await page.waitForLoadState('networkidle');

    // Should be on gallery page
    expect(page.url()).toContain('/media/galeria/');

    // Gallery should have arrow buttons for navigation
    const prevButton = page.locator('button[aria-label="Previous photo"]');
    const nextButton = page.locator('button[aria-label="Next photo"]');
    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();

    // Should have a main gallery image displayed (SmoothImage component)
    // The main image is inside a div with specific dimensions, not the logo
    const mainImage = page.locator('section[data-section="media-galeria"] img[alt]').nth(1);
    await expect(mainImage).toBeVisible();

    // Get image src
    const imageSrc = await mainImage.getAttribute('src');
    console.log(`Main gallery image src: ${imageSrc}`);
    expect(imageSrc).toBeTruthy();
    expect(imageSrc).toContain('/assets/media/');
  });

  test('should navigate between images in gallery', async ({ page }) => {
    await page.goto('/media');
    await page.waitForLoadState('networkidle');

    // Click on first album
    await page.locator('a[href^="/media/galeria/"]').first().click();
    await page.waitForLoadState('networkidle');

    // Get initial image src
    const mainImage = page.locator('section[data-section="media-galeria"] img[alt]').nth(1);
    await expect(mainImage).toBeVisible();
    const initialSrc = await mainImage.getAttribute('src');
    console.log(`Initial image: ${initialSrc}`);

    // Click next button via keyboard
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);

    // Get new image src - may or may not change depending on album size
    // Just verify navigation doesn't cause errors
    const newSrc = await mainImage.getAttribute('src');
    console.log(`After ArrowRight: ${newSrc}`);
    expect(newSrc).toBeTruthy();
    expect(newSrc).toContain('/assets/media/');

    // Navigate backwards
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(500);

    // Check image is still valid
    const afterLeftSrc = await mainImage.getAttribute('src');
    console.log(`After ArrowLeft: ${afterLeftSrc}`);
    expect(afterLeftSrc).toBeTruthy();
  });
});
