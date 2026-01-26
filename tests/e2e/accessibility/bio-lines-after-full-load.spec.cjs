// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * TDD Test: Verify decorative lines are visible AFTER full page load
 *
 * User reported lines not visible on /bio and /bio/ensemble in high contrast mode.
 * This test waits for complete page load before checking.
 */

test.describe('Bio Pages - Lines After Full Load', () => {

  test('Bio page - decorative lines visible after full load in high contrast', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // Navigate and wait for full load
    await page.goto('/bio');
    await page.waitForLoadState('networkidle');

    // Wait for images to load
    await page.waitForFunction(() => {
      const images = document.querySelectorAll('img');
      return Array.from(images).every(img => img.complete);
    });

    // Wait additional time for React to settle
    await page.waitForTimeout(2000);

    // Enable high contrast
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
    });

    // Wait for CSS transition to complete (lines have 1s transition)
    await page.waitForTimeout(1500);

    // Take screenshot BEFORE checking
    await page.screenshot({ path: 'test-results/bio-full-load-before-check.png' });

    // Now check for lines
    const linesInfo = await page.evaluate(() => {
      const lines = document.querySelectorAll('.decorative-line');
      const linesRoot = document.getElementById('lines-root');

      return {
        totalLines: lines.length,
        linesRootExists: !!linesRoot,
        linesRootChildCount: linesRoot ? linesRoot.children.length : 0,
        lineDetails: Array.from(lines).map((line, i) => {
          const rect = line.getBoundingClientRect();
          const style = getComputedStyle(line);
          return {
            index: i,
            left: Math.round(rect.left),
            width: rect.width,
            height: rect.height,
            backgroundColor: style.backgroundColor,
            filter: style.filter,
            visibility: style.visibility,
            display: style.display,
            opacity: style.opacity,
          };
        }),
      };
    });

    console.log('=== BIO PAGE - FULL LOAD CHECK ===');
    console.log('Lines root exists:', linesInfo.linesRootExists);
    console.log('Lines root children:', linesInfo.linesRootChildCount);
    console.log('Total .decorative-line elements:', linesInfo.totalLines);
    console.log('Line details:');
    linesInfo.lineDetails.forEach(l => {
      console.log(`  Line ${l.index}: left=${l.left}px, w=${l.width}, h=${l.height}, bg=${l.backgroundColor}, filter=${l.filter}, visibility=${l.visibility}`);
    });

    // Assertions
    expect(linesInfo.totalLines, 'Bio page should have decorative lines').toBeGreaterThan(0);

    for (const line of linesInfo.lineDetails) {
      expect(line.width, `Line ${line.index} should have width`).toBeGreaterThan(0);
      expect(line.height, `Line ${line.index} should have height`).toBeGreaterThan(0);
      expect(line.filter, `Line ${line.index} should NOT have grayscale filter`).toBe('none');
      expect(line.visibility, `Line ${line.index} should be visible`).toBe('visible');
      expect(line.opacity, `Line ${line.index} should have opacity`).not.toBe('0');
    }
  });

  test('Bio Ensemble page - decorative lines visible after full load in high contrast', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // Navigate and wait for full load
    await page.goto('/bio/ensemble');
    await page.waitForLoadState('networkidle');

    // Wait for images to load
    await page.waitForFunction(() => {
      const images = document.querySelectorAll('img');
      return Array.from(images).every(img => img.complete);
    });

    // Wait additional time for React to settle
    await page.waitForTimeout(2000);

    // Enable high contrast
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
    });

    // Wait for CSS transition to complete
    await page.waitForTimeout(1500);

    // Take screenshot
    await page.screenshot({ path: 'test-results/bio-ensemble-full-load.png' });

    // Check for lines
    const linesInfo = await page.evaluate(() => {
      const lines = document.querySelectorAll('.decorative-line');
      return {
        totalLines: lines.length,
        lineDetails: Array.from(lines).map((line, i) => {
          const rect = line.getBoundingClientRect();
          const style = getComputedStyle(line);
          return {
            index: i,
            width: rect.width,
            height: rect.height,
            backgroundColor: style.backgroundColor,
            filter: style.filter,
          };
        }),
      };
    });

    console.log('=== BIO ENSEMBLE - FULL LOAD CHECK ===');
    console.log('Total lines:', linesInfo.totalLines);
    linesInfo.lineDetails.forEach(l => {
      console.log(`  Line ${l.index}: w=${l.width}, h=${l.height}, bg=${l.backgroundColor}, filter=${l.filter}`);
    });

    expect(linesInfo.totalLines, 'Bio Ensemble should have decorative lines').toBeGreaterThan(0);

    for (const line of linesInfo.lineDetails) {
      expect(line.width, `Line ${line.index} should have width`).toBeGreaterThan(0);
      expect(line.filter, `Line ${line.index} should NOT have filter`).toBe('none');
    }
  });

});
