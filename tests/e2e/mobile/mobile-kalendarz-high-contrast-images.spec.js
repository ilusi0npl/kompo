import { test, expect } from '@playwright/test';

/**
 * Test for Kalendarz page image visibility in high contrast mode on mobile.
 *
 * Problem: One or more images disappear on /kalendarz page in high contrast mobile mode.
 * Uses SmoothImage component with lazy loading.
 */

test.describe('Kalendarz Page - High Contrast Image Visibility', () => {
  test.beforeEach(async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('all event images should be visible WITHOUT high contrast', async ({ page }) => {
    await page.goto('/kalendarz');
    await page.waitForLoadState('networkidle');

    // Find all event images
    const eventImages = page.locator('section[data-section="kalendarz-mobile"] .event-poster-link img');
    const count = await eventImages.count();
    console.log(`Kalendarz page has ${count} event images (no high contrast)`);

    expect(count, 'Should have at least 1 event image').toBeGreaterThan(0);

    const issues = [];

    for (let i = 0; i < count; i++) {
      const img = eventImages.nth(i);

      // Scroll to image
      await img.scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(500);

      const info = await img.evaluate((el, idx) => {
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          index: idx + 1,
          src: el.src,
          naturalWidth: el.naturalWidth,
          naturalHeight: el.naturalHeight,
          complete: el.complete,
          opacity: style.opacity,
          visibility: style.visibility,
          display: style.display,
          width: rect.width,
          height: rect.height,
        };
      }, i);

      console.log(`Event ${info.index}: ${info.src.split('/').pop()}, loaded: ${info.complete}, size: ${info.naturalWidth}x${info.naturalHeight}, opacity: ${info.opacity}`);

      if (info.complete && info.naturalWidth > 0) {
        if (info.width === 0 || info.height === 0 || info.opacity === '0' || info.visibility === 'hidden') {
          issues.push(`Event ${info.index}: width=${info.width}, height=${info.height}, opacity=${info.opacity}, visibility=${info.visibility}`);
        }
      }
    }

    expect(issues, 'All images should be visible').toHaveLength(0);
  });

  test('all event images should be visible IN HIGH CONTRAST mode', async ({ page }) => {
    await page.goto('/kalendarz');
    await page.waitForLoadState('networkidle');

    // Enable high contrast mode
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    });
    await page.waitForTimeout(500);

    // Scroll down to trigger lazy loading for all images
    await page.evaluate(() => window.scrollTo(0, 5000));
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Find all event images - look for SmoothImage containers first
    const eventContainers = page.locator('section[data-section="kalendarz-mobile"] .event-poster-link');
    const containerCount = await eventContainers.count();
    console.log(`Kalendarz page has ${containerCount} event containers (high contrast)`);

    const issues = [];

    for (let i = 0; i < containerCount; i++) {
      const container = eventContainers.nth(i);

      // Scroll to container
      await container.scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(500);

      // Check if image exists inside container
      const img = container.locator('img');
      const imgCount = await img.count();

      if (imgCount === 0) {
        issues.push(`Event ${i + 1}: NO <img> element rendered (SmoothImage isInView=false)`);
        continue;
      }

      const info = await img.evaluate((el, idx) => {
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          index: idx + 1,
          src: el.src,
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
        };
      }, i);

      console.log(`Event ${i + 1} (high contrast): ${info.src?.split('/').pop() || 'N/A'}, loaded: ${info.complete}, size: ${info.naturalWidth}x${info.naturalHeight}, opacity: ${info.opacity}, filter: ${info.filter}`);

      if (info.complete && info.naturalWidth > 0) {
        if (info.width === 0 || info.height === 0 || info.opacity === '0' || info.visibility === 'hidden') {
          issues.push(`Event ${i + 1}: width=${info.width}, height=${info.height}, opacity=${info.opacity}, visibility=${info.visibility}`);
        }
      }
    }

    if (issues.length > 0) {
      console.log('Issues found:');
      issues.forEach(issue => console.log(`  - ${issue}`));
    }

    expect(issues, 'All event images should be visible in high contrast').toHaveLength(0);
  });

  test('each individual event image visible after scroll in high contrast', async ({ page }) => {
    await page.goto('/kalendarz');
    await page.waitForLoadState('networkidle');

    // Enable high contrast mode
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    });
    await page.waitForTimeout(500);

    // Get number of events
    const eventContainers = page.locator('section[data-section="kalendarz-mobile"] .event-poster-link');
    const count = await eventContainers.count();
    console.log(`Testing ${count} events individually`);

    for (let i = 0; i < count; i++) {
      const container = eventContainers.nth(i);

      // Scroll to container
      await container.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800); // Wait for IntersectionObserver and image load

      // Check image
      const img = container.locator('img');
      const imgExists = await img.count() > 0;

      if (!imgExists) {
        throw new Error(`Event ${i + 1}: Image not rendered after scrolling into view`);
      }

      const box = await img.boundingBox();
      if (!box || box.width === 0 || box.height === 0) {
        throw new Error(`Event ${i + 1}: Image has zero bounding box`);
      }

      console.log(`Event ${i + 1}: ✓ visible (${box.width}x${box.height})`);
    }
  });
});
