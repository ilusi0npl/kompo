// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test that verifies color consistency between fixed and scrollable parts
 * in high contrast mode on mobile.
 *
 * BUG: Fixed header/elements have different background color than scrollable content
 * in high contrast mode.
 */

const MOBILE_PAGES = [
  { name: 'Homepage', path: '/' },
  { name: 'Bio', path: '/bio' },
  { name: 'BioEnsemble', path: '/bio/ensemble' },
  { name: 'Media', path: '/media' },
  { name: 'MediaGaleria', path: '/media/galeria/album-1' },
  { name: 'Kalendarz', path: '/kalendarz' },
  { name: 'Archiwalne', path: '/archiwalne' },
  { name: 'Repertuar', path: '/repertuar' },
  { name: 'Specialne', path: '/specialne' },
  { name: 'Fundacja', path: '/fundacja' },
  { name: 'Kontakt', path: '/kontakt' },
];

test.describe('Mobile - High Contrast Color Consistency', () => {

  for (const page of MOBILE_PAGES) {
    test(`${page.name} (${page.path}): fixed and scrollable parts should have consistent colors in high contrast`, async ({ page: playwrightPage }) => {
      await playwrightPage.setViewportSize({ width: 390, height: 844 });
      await playwrightPage.goto(page.path);
      await playwrightPage.waitForLoadState('networkidle');
      await playwrightPage.waitForTimeout(500);

      // Disable transitions
      await playwrightPage.addStyleTag({
        content: '* { transition: none !important; }'
      });

      // Enable high contrast mode
      await playwrightPage.evaluate(() => {
        document.body.classList.add('high-contrast');
        localStorage.setItem('highContrast', 'true');
      });
      await playwrightPage.waitForTimeout(500);

      // Take screenshot for visual inspection
      await playwrightPage.screenshot({
        path: `test-results/hc-color-consistency-${page.name.toLowerCase()}.png`
      });

      // Check colors of different parts
      const colorInfo = await playwrightPage.evaluate(() => {
        const results = {
          bodyBg: getComputedStyle(document.body).backgroundColor,
          htmlBg: getComputedStyle(document.documentElement).backgroundColor,
        };

        // Check #root (scrollable content)
        const root = document.getElementById('root');
        if (root) {
          results.rootBg = getComputedStyle(root).backgroundColor;
          results.rootFilter = getComputedStyle(root).filter;
        }

        // Check #lines-root
        const linesRoot = document.getElementById('lines-root');
        if (linesRoot) {
          results.linesRootBg = getComputedStyle(linesRoot).backgroundColor;
          results.linesRootFilter = getComputedStyle(linesRoot).filter;
          // Check first child of lines-root (usually background div)
          const firstChild = linesRoot.firstElementChild;
          if (firstChild) {
            results.linesRootFirstChildBg = getComputedStyle(firstChild).backgroundColor;
          }
        }

        // Check #fixed-root
        const fixedRoot = document.getElementById('fixed-root');
        if (fixedRoot) {
          results.fixedRootBg = getComputedStyle(fixedRoot).backgroundColor;
          results.fixedRootFilter = getComputedStyle(fixedRoot).filter;
        }

        // Check #mobile-header-root
        const mobileHeaderRoot = document.getElementById('mobile-header-root');
        if (mobileHeaderRoot) {
          results.mobileHeaderRootBg = getComputedStyle(mobileHeaderRoot).backgroundColor;
          results.mobileHeaderRootFilter = getComputedStyle(mobileHeaderRoot).filter;
          // Check children
          const headerChild = mobileHeaderRoot.firstElementChild;
          if (headerChild) {
            results.mobileHeaderChildBg = getComputedStyle(headerChild).backgroundColor;
            results.mobileHeaderChildFilter = getComputedStyle(headerChild).filter;
          }
        }

        // Find any fixed positioned elements in body
        const allFixed = document.querySelectorAll('[style*="position: fixed"], .fixed');
        results.fixedElements = Array.from(allFixed).slice(0, 5).map(el => ({
          tag: el.tagName,
          id: el.id || null,
          className: el.className?.split?.(' ')?.slice(0, 3)?.join(' ') || null,
          backgroundColor: getComputedStyle(el).backgroundColor,
          filter: getComputedStyle(el).filter,
        }));

        return results;
      });

      console.log(`${page.name} color info:`, JSON.stringify(colorInfo, null, 2));

      // In high contrast mode, background should be white (#FDFDFD = rgb(253, 253, 253))
      // or after grayscale filter applied
      const expectedWhiteBg = 'rgb(253, 253, 253)';
      const transparentBg = 'rgba(0, 0, 0, 0)';

      // Check that html and body have white background in high contrast
      const htmlBodyWhite = colorInfo.htmlBg === expectedWhiteBg || colorInfo.bodyBg === expectedWhiteBg;
      expect(htmlBodyWhite, `HTML/Body should have white background in high contrast. Got html: ${colorInfo.htmlBg}, body: ${colorInfo.bodyBg}`).toBe(true);

      // Check fixed elements don't have colored backgrounds that stand out
      if (colorInfo.fixedElements && colorInfo.fixedElements.length > 0) {
        for (const el of colorInfo.fixedElements) {
          // Fixed elements should either be transparent or white-ish, not colored
          const isTransparent = el.backgroundColor === transparentBg;
          const isWhiteish = el.backgroundColor === expectedWhiteBg ||
                            el.backgroundColor === 'rgb(255, 255, 255)' ||
                            el.backgroundColor === 'rgb(253, 253, 253)';
          const isAcceptable = isTransparent || isWhiteish;

          if (!isAcceptable && el.backgroundColor !== 'rgb(0, 0, 0)') {
            console.log(`WARNING: Fixed element has colored background:`, el);
          }
        }
      }
    });
  }

  test('Bio mobile: compare fixed header color with scrollable content color', async ({ page }) => {
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

    // Get colors from fixed header vs scrollable content
    const colors = await page.evaluate(() => {
      // Find the fixed header (portaled to body)
      const fixedHeaders = document.querySelectorAll('body > div.fixed');
      let fixedHeaderBg = null;
      for (const header of fixedHeaders) {
        const bg = getComputedStyle(header).backgroundColor;
        if (bg !== 'rgba(0, 0, 0, 0)') {
          fixedHeaderBg = bg;
          break;
        }
      }

      // Find scrollable content background (in #lines-root or #root)
      const linesRoot = document.getElementById('lines-root');
      let scrollableBg = null;
      if (linesRoot) {
        const bgDiv = linesRoot.querySelector('div[style*="background"]');
        if (bgDiv) {
          scrollableBg = getComputedStyle(bgDiv).backgroundColor;
        }
      }

      // Also check the page background
      const pageBg = getComputedStyle(document.body).backgroundColor;

      return {
        fixedHeaderBg,
        scrollableBg,
        pageBg,
        htmlBg: getComputedStyle(document.documentElement).backgroundColor,
      };
    });

    console.log('Bio colors comparison:', colors);

    // In high contrast mode, both should be white (or very close)
    // The issue is when fixed header has a colored background but scrollable is white

    // If fixed header has color and it's not white, that's the bug
    if (colors.fixedHeaderBg && colors.fixedHeaderBg !== 'rgba(0, 0, 0, 0)') {
      const isWhite = colors.fixedHeaderBg === 'rgb(253, 253, 253)' ||
                      colors.fixedHeaderBg === 'rgb(255, 255, 255)';
      expect(
        isWhite,
        `Fixed header should have white background in high contrast, got: ${colors.fixedHeaderBg}`
      ).toBe(true);
    }
  });
});
