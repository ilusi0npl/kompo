import { test, expect } from '@playwright/test';

/**
 * Test for ALL images on Kalendarz page in high contrast mode on mobile.
 * Includes event posters, icons, and any other images.
 */

test.describe('Kalendarz Page - All Images High Contrast', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('all images on page should be visible in high contrast mode', async ({ page }) => {
    await page.goto('/kalendarz');
    await page.waitForLoadState('networkidle');

    // Enable high contrast mode
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    });
    await page.waitForTimeout(500);

    // Scroll to bottom and back to trigger all lazy loading
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Find ALL images on page
    const allImages = page.locator('img');
    const count = await allImages.count();
    console.log(`Found ${count} total images on Kalendarz page`);

    const issues = [];
    const imageDetails = [];

    for (let i = 0; i < count; i++) {
      const img = allImages.nth(i);

      // Scroll to image
      await img.scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(300);

      const info = await img.evaluate((el, idx) => {
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        const parent = el.closest('[id]');
        return {
          index: idx + 1,
          src: el.src,
          alt: el.alt,
          naturalWidth: el.naturalWidth,
          naturalHeight: el.naturalHeight,
          complete: el.complete,
          opacity: style.opacity,
          visibility: style.visibility,
          display: style.display,
          filter: style.filter,
          width: rect.width,
          height: rect.height,
          top: rect.top,
          parentId: parent?.id || 'none',
        };
      }, i);

      const srcName = info.src?.split('/').pop() || 'N/A';
      imageDetails.push(info);

      console.log(`Image ${info.index}: ${srcName}, parent: ${info.parentId}, size: ${info.width}x${info.height}, opacity: ${info.opacity}, filter: ${info.filter}`);

      // Check for visibility issues (only for loaded images)
      if (info.complete && info.naturalWidth > 0) {
        if (info.width === 0 || info.height === 0) {
          issues.push(`Image ${info.index} (${srcName}): zero dimensions (${info.width}x${info.height})`);
        }
        if (info.opacity === '0') {
          issues.push(`Image ${info.index} (${srcName}): opacity is 0`);
        }
        if (info.visibility === 'hidden') {
          issues.push(`Image ${info.index} (${srcName}): visibility is hidden`);
        }
        if (info.display === 'none') {
          issues.push(`Image ${info.index} (${srcName}): display is none`);
        }
      }
    }

    if (issues.length > 0) {
      console.log('\n=== VISIBILITY ISSUES ===');
      issues.forEach(issue => console.log(`  - ${issue}`));
    }

    expect(issues, 'All images should be visible in high contrast').toHaveLength(0);
  });

  test('location icons should be visible in high contrast', async ({ page }) => {
    await page.goto('/kalendarz');
    await page.waitForLoadState('networkidle');

    // Enable high contrast
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    });
    await page.waitForTimeout(500);

    // Scroll to load all content
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Find location icons
    const locationIcons = page.locator('img[src*="place-icon"]');
    const count = await locationIcons.count();
    console.log(`Found ${count} location icons`);

    for (let i = 0; i < count; i++) {
      const icon = locationIcons.nth(i);
      await icon.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);

      const info = await icon.evaluate(el => {
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          src: el.src,
          complete: el.complete,
          naturalWidth: el.naturalWidth,
          width: rect.width,
          height: rect.height,
          opacity: style.opacity,
          visibility: style.visibility,
          filter: style.filter,
        };
      });

      console.log(`Location icon ${i + 1}: ${info.width}x${info.height}, opacity: ${info.opacity}, filter: ${info.filter}`);

      expect(info.width, `Icon ${i + 1} should have width > 0`).toBeGreaterThan(0);
      expect(info.height, `Icon ${i + 1} should have height > 0`).toBeGreaterThan(0);
      expect(parseFloat(info.opacity), `Icon ${i + 1} should have opacity > 0`).toBeGreaterThan(0);
    }
  });
});
