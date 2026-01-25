import { test, expect } from '@playwright/test';

/**
 * Test for 6th album image visibility on Media page in high contrast mode.
 *
 * Problem: The 6th album image (a:nth-child(6)) disappears in high contrast mode
 * on mobile viewport at /media page.
 *
 * Selector: #main-content > div > div > section > div.flex.flex-col > a:nth-child(6)
 */

test.describe('Media Page - 6th Image High Contrast Visibility', () => {
  test.beforeEach(async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('6th album link should be visible without high contrast', async ({ page }) => {
    await page.goto('/media');
    await page.waitForLoadState('networkidle');

    // Find 6th album link
    const sixthAlbum = page.locator('section[data-section="media-mobile"] div.flex.flex-col > a').nth(5);

    // Check if it exists
    const count = await page.locator('section[data-section="media-mobile"] div.flex.flex-col > a').count();
    console.log(`Media page has ${count} album links`);

    if (count >= 6) {
      // Scroll to element
      await sixthAlbum.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      // Check visibility
      await expect(sixthAlbum).toBeVisible();

      // Check bounding box
      const box = await sixthAlbum.boundingBox();
      expect(box, '6th album should have non-null bounding box').not.toBeNull();
      expect(box.width, '6th album should have width > 0').toBeGreaterThan(0);
      expect(box.height, '6th album should have height > 0').toBeGreaterThan(0);

      console.log(`6th album visible: ${box.width}x${box.height} at (${box.x}, ${box.y})`);
    } else {
      console.log('Skipping test - less than 6 albums on page');
    }
  });

  test('6th album link should be visible IN HIGH CONTRAST mode', async ({ page }) => {
    await page.goto('/media');
    await page.waitForLoadState('networkidle');

    // Enable high contrast mode
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    });
    await page.waitForTimeout(500);

    // Find 6th album link
    const sixthAlbum = page.locator('section[data-section="media-mobile"] div.flex.flex-col > a').nth(5);

    const count = await page.locator('section[data-section="media-mobile"] div.flex.flex-col > a').count();
    console.log(`Media page has ${count} album links in high contrast`);

    if (count >= 6) {
      // Scroll to element
      await sixthAlbum.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      // Get element info before assertion
      const info = await sixthAlbum.evaluate(el => {
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          opacity: style.opacity,
          visibility: style.visibility,
          display: style.display,
          filter: style.filter,
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
        };
      });
      console.log('6th album in high contrast:', JSON.stringify(info, null, 2));

      // Check visibility
      await expect(sixthAlbum).toBeVisible();

      // Check bounding box
      const box = await sixthAlbum.boundingBox();
      expect(box, '6th album should have non-null bounding box in high contrast').not.toBeNull();
      expect(box.width, '6th album should have width > 0 in high contrast').toBeGreaterThan(0);
      expect(box.height, '6th album should have height > 0 in high contrast').toBeGreaterThan(0);

      console.log(`6th album visible in high contrast: ${box.width}x${box.height}`);
    } else {
      console.log('Skipping test - less than 6 albums on page');
    }
  });

  test('6th album IMAGE element should be visible in high contrast after scroll', async ({ page }) => {
    await page.goto('/media');
    await page.waitForLoadState('networkidle');

    // Enable high contrast mode
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    });
    await page.waitForTimeout(500);

    // Scroll down to load lazy images
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(1000);

    // Find 6th album link and its image
    const sixthAlbum = page.locator('section[data-section="media-mobile"] div.flex.flex-col > a').nth(5);
    const sixthImage = sixthAlbum.locator('img');

    // Scroll to element
    await sixthAlbum.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Get detailed image info
    const imgInfo = await sixthImage.evaluate(img => {
      const style = getComputedStyle(img);
      const rect = img.getBoundingClientRect();
      return {
        exists: !!img,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        complete: img.complete,
        src: img.src,
        opacity: style.opacity,
        visibility: style.visibility,
        display: style.display,
        width: rect.width,
        height: rect.height,
      };
    });

    console.log('6th album IMAGE details:', JSON.stringify(imgInfo, null, 2));

    // Assertions for the image itself
    expect(parseFloat(imgInfo.opacity), 'Image opacity should be > 0').toBeGreaterThan(0);
    expect(imgInfo.visibility, 'Image should not be hidden').not.toBe('hidden');
    expect(imgInfo.display, 'Image should not be display:none').not.toBe('none');
    expect(imgInfo.width, 'Image width should be > 0').toBeGreaterThan(0);
    expect(imgInfo.height, 'Image height should be > 0').toBeGreaterThan(0);
  });

  test('all album images should be visible in high contrast mode', async ({ page }) => {
    await page.goto('/media');
    await page.waitForLoadState('networkidle');

    // Enable high contrast mode
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    });
    await page.waitForTimeout(500);

    // Find all album links
    const albumLinks = page.locator('section[data-section="media-mobile"] div.flex.flex-col > a');
    const count = await albumLinks.count();
    console.log(`Testing ${count} album links`);

    const issues = [];

    for (let i = 0; i < count; i++) {
      const album = albumLinks.nth(i);

      // Scroll to album
      await album.scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(100);

      const info = await album.evaluate((el, idx) => {
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        const img = el.querySelector('img');
        const imgStyle = img ? getComputedStyle(img) : null;

        return {
          index: idx + 1,
          opacity: style.opacity,
          visibility: style.visibility,
          display: style.display,
          width: rect.width,
          height: rect.height,
          imgOpacity: imgStyle?.opacity,
          imgVisibility: imgStyle?.visibility,
          imgDisplay: imgStyle?.display,
        };
      }, i);

      // Check for visibility issues
      if (info.width === 0 || info.height === 0 ||
          info.opacity === '0' || info.visibility === 'hidden' || info.display === 'none') {
        issues.push(`Album ${info.index}: width=${info.width}, height=${info.height}, opacity=${info.opacity}, visibility=${info.visibility}`);
      }

      // Check image inside
      if (info.imgOpacity === '0' || info.imgVisibility === 'hidden' || info.imgDisplay === 'none') {
        issues.push(`Album ${info.index} image: opacity=${info.imgOpacity}, visibility=${info.imgVisibility}`);
      }
    }

    if (issues.length > 0) {
      console.log('Visibility issues found:');
      issues.forEach(issue => console.log(`  - ${issue}`));
    }

    expect(issues, 'All albums should be visible in high contrast').toHaveLength(0);
  });
});
