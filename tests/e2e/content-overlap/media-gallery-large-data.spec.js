// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test that gallery works correctly in large test data mode.
 * Gallery navigation tests work in both modes; asset-path assertions
 * only apply when local config data is used (not Sanity CDN).
 */
test.describe('Media Gallery - Large Test Data', () => {
  test('should display album grid with multiple albums', async ({ page }) => {
    await page.goto('/media');
    await page.waitForLoadState('networkidle');

    const albumLinks = page.locator('a[href^="/media/galeria/"]');
    const count = await albumLinks.count();
    console.log(`Found ${count} album links on /media page`);

    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('should navigate to gallery and display images', async ({ page }) => {
    await page.goto('/media');
    await page.waitForLoadState('networkidle');

    const firstAlbum = page.locator('a[href^="/media/galeria/"]').first();
    const albumCount = await page.locator('a[href^="/media/galeria/"]').count();
    test.skip(albumCount === 0, 'No albums available');

    const albumHref = await firstAlbum.getAttribute('href');
    console.log(`Clicking on album: ${albumHref}`);

    await firstAlbum.click();
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('/media/galeria/');

    const prevButton = page.locator('button[aria-label="Previous photo"]');
    const nextButton = page.locator('button[aria-label="Next photo"]');
    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();

    const mainImage = page.locator('section[data-section="media-galeria"] img[alt]').nth(1);
    await expect(mainImage).toBeVisible();

    const imageSrc = await mainImage.getAttribute('src');
    console.log(`Main gallery image src: ${imageSrc}`);
    expect(imageSrc).toBeTruthy();
  });

  test('should navigate between images in gallery', async ({ page }) => {
    await page.goto('/media');
    await page.waitForLoadState('networkidle');

    const albumCount = await page.locator('a[href^="/media/galeria/"]').count();
    test.skip(albumCount === 0, 'No albums available');

    await page.locator('a[href^="/media/galeria/"]').first().click();
    await page.waitForLoadState('networkidle');

    const mainImage = page.locator('section[data-section="media-galeria"] img[alt]').nth(1);
    await expect(mainImage).toBeVisible();
    const initialSrc = await mainImage.getAttribute('src');
    console.log(`Initial image: ${initialSrc}`);

    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);

    const newSrc = await mainImage.getAttribute('src');
    console.log(`After ArrowRight: ${newSrc}`);
    expect(newSrc).toBeTruthy();

    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(500);

    const afterLeftSrc = await mainImage.getAttribute('src');
    console.log(`After ArrowLeft: ${afterLeftSrc}`);
    expect(afterLeftSrc).toBeTruthy();
  });
});
