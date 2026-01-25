// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test that verifies vertical decorative lines are visible on /bio mobile
 * in high contrast mode when scrolling.
 *
 * BUG: Vertical lines disappear in high contrast mode on mobile.
 */

test.describe('MobileBio - Vertical Lines High Contrast', () => {

  test('vertical lines should be visible in high contrast mode', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/bio');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Disable transitions to avoid timing issues
    await page.addStyleTag({
      content: '* { transition: none !important; }'
    });

    // Enable high contrast mode
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    });
    await page.waitForTimeout(500); // Wait for CSS to fully apply

    // Take screenshot before scrolling
    await page.screenshot({ path: 'test-results/bio-mobile-lines-hc-before-scroll.png' });

    // Check for decorative lines in the page
    const linesInfo = await page.evaluate(() => {
      const lines = document.querySelectorAll('.decorative-line');
      const lineData = Array.from(lines).map(line => {
        const style = getComputedStyle(line);
        const rect = line.getBoundingClientRect();
        return {
          tagName: line.tagName,
          className: line.className,
          parentId: line.parentElement?.id || 'none',
          parentClassName: line.parentElement?.className || 'none',
          backgroundColor: style.backgroundColor,
          width: rect.width,
          height: rect.height,
          visible: rect.width > 0 && rect.height > 0,
          opacity: style.opacity,
          filter: style.filter,
        };
      });

      return {
        lineCount: lines.length,
        lines: lineData,
        highContrast: document.body.classList.contains('high-contrast'),
      };
    });

    console.log('Lines info in high contrast:', JSON.stringify(linesInfo, null, 2));

    // Should have decorative lines
    expect(linesInfo.lineCount, 'Should have decorative lines on page').toBeGreaterThan(0);

    // Lines should be visible (have dimensions)
    const visibleLines = linesInfo.lines.filter(l => l.visible);
    expect(visibleLines.length, 'Some lines should be visible').toBeGreaterThan(0);

    // In high contrast, lines should be dark (#131313)
    // rgb(19, 19, 19) is #131313
    const darkLines = linesInfo.lines.filter(l =>
      l.backgroundColor === 'rgb(19, 19, 19)' || l.backgroundColor === '#131313'
    );
    expect(
      darkLines.length,
      `Lines should have dark background in high contrast mode. Got: ${linesInfo.lines.map(l => l.backgroundColor).join(', ')}`
    ).toBeGreaterThan(0);
  });

  test('vertical lines should remain visible when scrolling in high contrast', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/bio');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Enable high contrast mode
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    });
    await page.waitForTimeout(300);

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);

    // Take screenshot after scrolling
    await page.screenshot({ path: 'test-results/bio-mobile-lines-hc-after-scroll.png' });

    // Check lines are still visible after scroll
    const linesAfterScroll = await page.evaluate(() => {
      const lines = document.querySelectorAll('.decorative-line');
      const viewportHeight = window.innerHeight;

      return Array.from(lines).map(line => {
        const rect = line.getBoundingClientRect();
        const style = getComputedStyle(line);
        return {
          top: rect.top,
          height: rect.height,
          inViewport: rect.top < viewportHeight && rect.bottom > 0,
          backgroundColor: style.backgroundColor,
          opacity: style.opacity,
        };
      });
    });

    console.log('Lines after scroll:', JSON.stringify(linesAfterScroll, null, 2));

    // At least some lines should be in viewport after scroll
    const linesInViewport = linesAfterScroll.filter(l => l.inViewport);
    expect(
      linesInViewport.length,
      'Lines should be visible in viewport after scrolling'
    ).toBeGreaterThan(0);
  });

  test('debug: check where lines are rendered and their styles', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/bio');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Check lines BEFORE high contrast
    const linesBefore = await page.evaluate(() => {
      const lines = document.querySelectorAll('.decorative-line');
      return {
        count: lines.length,
        locations: Array.from(lines).map(line => {
          let parent = line.parentElement;
          const path = [];
          while (parent && parent !== document.body) {
            path.push(parent.id || parent.className?.split(' ')[0] || parent.tagName);
            parent = parent.parentElement;
          }
          return path.reverse().join(' > ');
        }),
      };
    });

    console.log('Lines BEFORE high contrast:', JSON.stringify(linesBefore, null, 2));

    // Enable high contrast
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
    });
    await page.waitForTimeout(300);

    // Check lines AFTER high contrast
    const linesAfter = await page.evaluate(() => {
      const lines = document.querySelectorAll('.decorative-line');
      return Array.from(lines).map(line => {
        const style = getComputedStyle(line);
        const rect = line.getBoundingClientRect();

        // Walk up to check for filters on ancestors
        let parent = line.parentElement;
        const ancestorFilters = [];
        while (parent) {
          const pStyle = getComputedStyle(parent);
          if (pStyle.filter !== 'none') {
            ancestorFilters.push({
              tag: parent.tagName,
              id: parent.id,
              filter: pStyle.filter,
            });
          }
          parent = parent.parentElement;
        }

        return {
          backgroundColor: style.backgroundColor,
          width: rect.width,
          height: rect.height,
          left: rect.left,
          opacity: style.opacity,
          filter: style.filter,
          ancestorFilters,
        };
      });
    });

    console.log('Lines AFTER high contrast:', JSON.stringify(linesAfter, null, 2));

    // Lines should exist
    expect(linesBefore.count, 'Should have lines on page').toBeGreaterThan(0);
  });
});
