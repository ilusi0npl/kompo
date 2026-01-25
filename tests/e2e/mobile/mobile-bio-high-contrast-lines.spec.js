import { test, expect } from '@playwright/test';

/**
 * Test for Bio mobile high contrast vertical lines visibility issue.
 *
 * Problem: In high contrast mode on mobile /bio page, vertical decorative lines
 * are only visible in the fixed header. The scrollable content area lacks lines.
 *
 * Expected: Vertical lines should be visible throughout the entire page height.
 */
test.describe('Mobile Bio High Contrast - Vertical Lines Visibility', () => {
  test.beforeEach(async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('Bio mobile: vertical lines should exist in scrollable content section', async ({ page }) => {
    await page.goto('/bio');
    await page.waitForLoadState('networkidle');

    // Get the scrollable content container (inside data-section="bio-mobile")
    const bioSection = page.locator('[data-section="bio-mobile"]');
    await expect(bioSection).toBeVisible();

    // Find decorative lines WITHIN the scrollable content (not in fixed header portal)
    // The scrollable content is the div with position: relative inside bio-mobile section
    const scrollableContent = bioSection.locator('> div[style*="position"]').first();
    const linesInContent = scrollableContent.locator('.decorative-line');

    const lineCount = await linesInContent.count();
    console.log(`Found ${lineCount} decorative lines in scrollable content`);

    // Should have 3 vertical lines (mobileLinePositions = [97, 195, 292])
    expect(lineCount).toBeGreaterThanOrEqual(3);
  });

  test('Bio mobile: lines in scrollable content should be visible in high contrast mode', async ({ page }) => {
    await page.goto('/bio');
    await page.waitForLoadState('networkidle');

    // Enable high contrast mode via JS (same as other high contrast tests)
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    });
    await page.waitForTimeout(500);

    // Verify high contrast is active
    const bodyHasClass = await page.evaluate(() => document.body.classList.contains('high-contrast'));
    expect(bodyHasClass).toBe(true);

    // Scroll down past the fixed header (281px)
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(300);

    // Get lines in the scrollable content area
    const bioSection = page.locator('[data-section="bio-mobile"]');
    const scrollableContent = bioSection.locator('> div[style*="position"]').first();
    const linesInContent = scrollableContent.locator('.decorative-line');

    const lineCount = await linesInContent.count();
    console.log(`Lines in scrollable content: ${lineCount}`);

    // Must have lines in scrollable content for them to be visible when scrolling
    expect(lineCount).toBeGreaterThanOrEqual(3);

    // Verify lines have correct dark color in high contrast mode
    if (lineCount > 0) {
      const firstLine = linesInContent.first();
      const bgColor = await firstLine.evaluate(el => getComputedStyle(el).backgroundColor);
      console.log(`Line background color: ${bgColor}`);

      // Should be dark (#131313 = rgb(19, 19, 19))
      expect(bgColor).toBe('rgb(19, 19, 19)');
    }
  });

  test('Bio mobile: lines should span full content height', async ({ page }) => {
    await page.goto('/bio');
    await page.waitForLoadState('networkidle');

    const bioSection = page.locator('[data-section="bio-mobile"]');
    const scrollableContent = bioSection.locator('> div[style*="position"]').first();
    const linesInContent = scrollableContent.locator('.decorative-line');

    const lineCount = await linesInContent.count();
    expect(lineCount).toBeGreaterThanOrEqual(3);

    if (lineCount > 0) {
      const firstLine = linesInContent.first();
      const height = await firstLine.evaluate(el => el.style.height || getComputedStyle(el).height);
      console.log(`Line height: ${height}`);

      // Height should be 100% (full content height)
      expect(height).toBe('100%');
    }
  });

  test('Bio mobile: lines visible at different scroll positions in high contrast', async ({ page }) => {
    await page.goto('/bio');
    await page.waitForLoadState('networkidle');

    // Enable high contrast via JS
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    });
    await page.waitForTimeout(500);

    // Test at multiple scroll positions
    const scrollPositions = [0, 400, 800, 1200];

    for (const scrollY of scrollPositions) {
      await page.evaluate(y => window.scrollTo(0, y), scrollY);
      await page.waitForTimeout(200);

      // Take screenshot for debugging
      // await page.screenshot({ path: `test-results/bio-scroll-${scrollY}.png` });

      // Lines should exist in DOM at every scroll position
      const bioSection = page.locator('[data-section="bio-mobile"]');
      const scrollableContent = bioSection.locator('> div[style*="position"]').first();
      const linesInContent = scrollableContent.locator('.decorative-line');

      const count = await linesInContent.count();
      console.log(`Scroll ${scrollY}px: ${count} lines in scrollable content`);

      expect(count).toBeGreaterThanOrEqual(3);
    }
  });
});
