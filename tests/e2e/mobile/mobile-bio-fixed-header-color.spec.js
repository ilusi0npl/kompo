// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test specifically for Bio mobile fixed header color in high contrast mode.
 *
 * BUG: Fixed header is rendered via createPortal to document.body,
 * so it's outside of #root which has the grayscale filter.
 * The content in fixed header is NOT grayscale while the rest of the page IS.
 */

test.describe('MobileBio - Fixed Header Color in High Contrast', () => {

  test('fixed header should have grayscale filter in high contrast mode', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/bio');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Disable transitions
    await page.addStyleTag({
      content: '* { transition: none !important; }'
    });

    // Enable high contrast
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
    });
    await page.waitForTimeout(500);

    // Check filters on fixed header vs scrollable content
    const filterInfo = await page.evaluate(() => {
      // Fixed header is now in #mobile-header-root
      const mobileHeaderRoot = document.getElementById('mobile-header-root');
      const fixedHeader = mobileHeaderRoot?.querySelector('div.fixed') ||
                          document.querySelector('body > div.fixed');

      const root = document.getElementById('root');
      const linesRoot = document.getElementById('lines-root');

      return {
        // Fixed header filter (should now have filter via #mobile-header-root CSS)
        fixedHeaderFilter: fixedHeader ? getComputedStyle(fixedHeader).filter : null,
        fixedHeaderExists: !!fixedHeader,
        fixedHeaderLocation: mobileHeaderRoot?.querySelector('div.fixed') ? '#mobile-header-root' : 'body',

        // Scrollable content (has filter)
        rootFilter: root ? getComputedStyle(root).filter : null,
        linesRootFilter: linesRoot ? getComputedStyle(linesRoot).filter : null,

        // Check if they match
        filtersMatch: fixedHeader && root ?
          getComputedStyle(fixedHeader).filter === getComputedStyle(root).filter : false,
      };
    });

    console.log('Filter comparison:', filterInfo);

    // EXPECTED: Both fixed header and root should have the same filter
    // ACTUAL BUG: Fixed header has 'none', root has 'contrast(1.5) grayscale(1)'
    expect(filterInfo.fixedHeaderExists, 'Fixed header should exist').toBe(true);

    // This test should FAIL because fixed header doesn't have the filter
    expect(
      filterInfo.fixedHeaderFilter,
      `Fixed header should have grayscale filter to match scrollable content. Got: ${filterInfo.fixedHeaderFilter}, expected: ${filterInfo.rootFilter}`
    ).toBe(filterInfo.rootFilter);
  });

  test('fixed header background should match page background in high contrast', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/bio');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Take screenshot BEFORE high contrast
    await page.screenshot({ path: 'test-results/bio-mobile-before-hc.png' });

    // Get colors BEFORE high contrast
    const colorsBefore = await page.evaluate(() => {
      // Find the fixed header (direct child of body with class 'fixed')
      const fixedHeaders = document.querySelectorAll('body > div.fixed');
      const fixedHeader = fixedHeaders[0];

      // Find the main content area
      const root = document.getElementById('root');
      const linesRoot = document.getElementById('lines-root');

      return {
        fixedHeaderBg: fixedHeader ? getComputedStyle(fixedHeader).backgroundColor : null,
        fixedHeaderFilter: fixedHeader ? getComputedStyle(fixedHeader).filter : null,
        rootBg: root ? getComputedStyle(root).backgroundColor : null,
        linesRootBg: linesRoot ? getComputedStyle(linesRoot).backgroundColor : null,
        // Get background of first fixed positioned background div in lines-root
        linesRootChildBg: linesRoot?.firstElementChild ? getComputedStyle(linesRoot.firstElementChild).backgroundColor : null,
        bodyBg: getComputedStyle(document.body).backgroundColor,
      };
    });

    console.log('Colors BEFORE high contrast:', colorsBefore);

    // Disable transitions
    await page.addStyleTag({
      content: '* { transition: none !important; }'
    });

    // Enable high contrast
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
    });
    await page.waitForTimeout(500);

    // Take screenshot AFTER high contrast
    await page.screenshot({ path: 'test-results/bio-mobile-after-hc.png' });

    // Get colors AFTER high contrast
    const colorsAfter = await page.evaluate(() => {
      const fixedHeaders = document.querySelectorAll('body > div.fixed');
      const fixedHeader = fixedHeaders[0];

      const root = document.getElementById('root');
      const linesRoot = document.getElementById('lines-root');

      // Get all elements with background color set
      const elementsWithBg = [];

      // Check fixed header children
      if (fixedHeader) {
        const walker = document.createTreeWalker(fixedHeader, NodeFilter.SHOW_ELEMENT);
        let node;
        while (node = walker.nextNode()) {
          const bg = getComputedStyle(node).backgroundColor;
          if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            elementsWithBg.push({
              location: 'fixedHeader',
              tag: node.tagName,
              className: node.className?.split?.(' ')?.slice(0, 2)?.join(' '),
              backgroundColor: bg,
              filter: getComputedStyle(node).filter,
            });
          }
        }
      }

      // Check lines-root children
      if (linesRoot) {
        const walker = document.createTreeWalker(linesRoot, NodeFilter.SHOW_ELEMENT);
        let node;
        while (node = walker.nextNode()) {
          const bg = getComputedStyle(node).backgroundColor;
          if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            elementsWithBg.push({
              location: 'linesRoot',
              tag: node.tagName,
              className: node.className?.split?.(' ')?.slice(0, 2)?.join(' '),
              backgroundColor: bg,
              filter: getComputedStyle(node).filter,
            });
          }
        }
      }

      return {
        fixedHeaderBg: fixedHeader ? getComputedStyle(fixedHeader).backgroundColor : null,
        fixedHeaderFilter: fixedHeader ? getComputedStyle(fixedHeader).filter : null,
        linesRootChildBg: linesRoot?.firstElementChild ? getComputedStyle(linesRoot.firstElementChild).backgroundColor : null,
        linesRootChildFilter: linesRoot?.firstElementChild ? getComputedStyle(linesRoot.firstElementChild).filter : null,
        bodyBg: getComputedStyle(document.body).backgroundColor,
        elementsWithBg: elementsWithBg.slice(0, 10),
      };
    });

    console.log('Colors AFTER high contrast:', JSON.stringify(colorsAfter, null, 2));

    // The fixed header should have same background as page in high contrast
    // Expected: rgb(253, 253, 253) or white
    const expectedWhite = 'rgb(253, 253, 253)';

    // Check if fixed header has correct background
    if (colorsAfter.fixedHeaderBg && colorsAfter.fixedHeaderBg !== 'rgba(0, 0, 0, 0)') {
      expect(
        colorsAfter.fixedHeaderBg,
        `Fixed header should have white background in high contrast`
      ).toBe(expectedWhite);
    }

    // Check if any element in fixed header has non-white background
    const coloredElements = colorsAfter.elementsWithBg.filter(el =>
      el.location === 'fixedHeader' &&
      el.backgroundColor !== expectedWhite &&
      el.backgroundColor !== 'rgb(255, 255, 255)' &&
      el.backgroundColor !== 'rgb(19, 19, 19)' // decorative lines are dark, that's OK
    );

    if (coloredElements.length > 0) {
      console.log('Colored elements in fixed header:', coloredElements);
    }

    expect(
      coloredElements.length,
      `Fixed header should not have colored backgrounds in high contrast. Found: ${JSON.stringify(coloredElements)}`
    ).toBe(0);
  });

  test('scroll down and check color consistency', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/bio');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Disable transitions
    await page.addStyleTag({
      content: '* { transition: none !important; }'
    });

    // Enable high contrast
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
    });
    await page.waitForTimeout(500);

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);

    // Take screenshot after scroll
    await page.screenshot({ path: 'test-results/bio-mobile-hc-scrolled.png' });

    // Check colors after scroll
    const colorsScrolled = await page.evaluate(() => {
      const fixedHeaders = document.querySelectorAll('body > div.fixed');
      const fixedHeader = fixedHeaders[0];

      return {
        fixedHeaderBg: fixedHeader ? getComputedStyle(fixedHeader).backgroundColor : null,
        fixedHeaderFilter: fixedHeader ? getComputedStyle(fixedHeader).filter : null,
        bodyBg: getComputedStyle(document.body).backgroundColor,
        scrollY: window.scrollY,
      };
    });

    console.log('Colors after scroll in high contrast:', colorsScrolled);

    // Fixed header background should be white even after scroll
    const expectedWhite = 'rgb(253, 253, 253)';
    if (colorsScrolled.fixedHeaderBg && colorsScrolled.fixedHeaderBg !== 'rgba(0, 0, 0, 0)') {
      expect(
        colorsScrolled.fixedHeaderBg,
        `Fixed header should have white background after scroll in high contrast`
      ).toBe(expectedWhite);
    }
  });
});
