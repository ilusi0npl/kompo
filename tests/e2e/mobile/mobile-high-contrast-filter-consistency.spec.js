// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Comprehensive test for high contrast mode on ALL mobile pages.
 *
 * BUG: Fixed header has different filter/colors than scrollable content in high contrast mode.
 *
 * This test checks:
 * 1. Fixed elements have grayscale filter applied (same as scrollable content)
 * 2. Background colors are consistent (white #FDFDFD in high contrast)
 * 3. Decorative lines have dark color (#131313) in high contrast
 */

const ALL_MOBILE_PAGES = [
  { name: 'Homepage', path: '/' },
  { name: 'Bio', path: '/bio' },
  { name: 'BioEnsemble', path: '/bio/ensemble' },
  { name: 'Media', path: '/media' },
  { name: 'MediaWideo', path: '/media/wideo' },
  { name: 'MediaGaleria', path: '/media/galeria/album-1' },
  { name: 'Kalendarz', path: '/kalendarz' },
  { name: 'Archiwalne', path: '/archiwalne' },
  { name: 'Repertuar', path: '/repertuar' },
  { name: 'Specialne', path: '/specialne' },
  { name: 'Fundacja', path: '/fundacja' },
  { name: 'Kontakt', path: '/kontakt' },
];

// Expected values in high contrast mode
const EXPECTED_FILTER = 'contrast(1.5) grayscale(1)';
const EXPECTED_WHITE_BG = 'rgb(253, 253, 253)';
const EXPECTED_DARK_LINE = 'rgb(19, 19, 19)';

test.describe('Mobile High Contrast - Filter & Color Consistency', () => {

  for (const page of ALL_MOBILE_PAGES) {
    test(`${page.name}: fixed header filter should match scrollable content filter`, async ({ page: playwrightPage }) => {
      await playwrightPage.setViewportSize({ width: 390, height: 844 });
      await playwrightPage.goto(page.path);
      await playwrightPage.waitForLoadState('networkidle');
      await playwrightPage.waitForTimeout(500);

      // Disable CSS transitions to avoid timing issues
      await playwrightPage.addStyleTag({
        content: '* { transition: none !important; animation: none !important; }'
      });

      // Enable high contrast mode
      await playwrightPage.evaluate(() => {
        document.body.classList.add('high-contrast');
        localStorage.setItem('highContrast', 'true');
      });
      await playwrightPage.waitForTimeout(300);

      // Get filter values from different parts of the page
      const filterInfo = await playwrightPage.evaluate(() => {
        const results = {
          bodyHasHighContrast: document.body.classList.contains('high-contrast'),
          filters: {},
          backgrounds: {},
          fixedElements: [],
        };

        // Check #root (main scrollable content)
        const root = document.getElementById('root');
        if (root) {
          results.filters.root = getComputedStyle(root).filter;
          results.backgrounds.root = getComputedStyle(root).backgroundColor;
        }

        // Check #lines-root
        const linesRoot = document.getElementById('lines-root');
        if (linesRoot) {
          results.filters.linesRoot = getComputedStyle(linesRoot).filter;
          results.backgrounds.linesRoot = getComputedStyle(linesRoot).backgroundColor;
        }

        // Check #mobile-header-root
        const mobileHeaderRoot = document.getElementById('mobile-header-root');
        if (mobileHeaderRoot) {
          results.filters.mobileHeaderRoot = getComputedStyle(mobileHeaderRoot).filter;

          // Check first child of mobile-header-root (the actual fixed header)
          const headerChild = mobileHeaderRoot.firstElementChild;
          if (headerChild) {
            results.filters.mobileHeaderChild = getComputedStyle(headerChild).filter;
            results.backgrounds.mobileHeaderChild = getComputedStyle(headerChild).backgroundColor;
          }
        }

        // Find ALL fixed positioned elements
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
          const style = getComputedStyle(el);
          if (style.position === 'fixed') {
            const bg = style.backgroundColor;
            const filter = style.filter;

            // Skip transparent elements
            if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') continue;

            results.fixedElements.push({
              tag: el.tagName,
              id: el.id || null,
              className: el.className?.toString?.()?.split?.(' ')?.slice(0, 2)?.join(' ') || null,
              parentId: el.parentElement?.id || null,
              backgroundColor: bg,
              filter: filter,
            });
          }
        }

        return results;
      });

      console.log(`${page.name} filter info:`, JSON.stringify(filterInfo, null, 2));

      // Verify high contrast mode is active
      expect(filterInfo.bodyHasHighContrast, 'High contrast mode should be active').toBe(true);

      // Get the expected filter (from #root which should always have it)
      const expectedFilter = filterInfo.filters.root || EXPECTED_FILTER;

      // Check that all fixed elements with background have the grayscale filter
      for (const el of filterInfo.fixedElements) {
        // Skip elements that are inside #mobile-header-root (they inherit filter)
        // We specifically check parent containers
        const hasGrayscaleFilter = el.filter?.includes('grayscale');
        const hasContrastFilter = el.filter?.includes('contrast');

        expect(
          hasGrayscaleFilter || hasContrastFilter,
          `Fixed element (${el.tag}${el.id ? '#' + el.id : ''}${el.className ? '.' + el.className.replace(' ', '.') : ''}) should have grayscale/contrast filter. Got filter: "${el.filter}", bg: "${el.backgroundColor}"`
        ).toBe(true);
      }

      // Check mobile header child specifically
      if (filterInfo.filters.mobileHeaderChild) {
        const headerFilter = filterInfo.filters.mobileHeaderChild;
        expect(
          headerFilter.includes('grayscale') && headerFilter.includes('contrast'),
          `Mobile header should have grayscale+contrast filter. Got: "${headerFilter}"`
        ).toBe(true);
      }
    });

    test(`${page.name}: fixed header background should be white in high contrast`, async ({ page: playwrightPage }) => {
      await playwrightPage.setViewportSize({ width: 390, height: 844 });
      await playwrightPage.goto(page.path);
      await playwrightPage.waitForLoadState('networkidle');
      await playwrightPage.waitForTimeout(500);

      // Disable transitions
      await playwrightPage.addStyleTag({
        content: '* { transition: none !important; }'
      });

      // Enable high contrast
      await playwrightPage.evaluate(() => {
        document.body.classList.add('high-contrast');
      });
      await playwrightPage.waitForTimeout(300);

      // Check backgrounds
      const bgInfo = await playwrightPage.evaluate(() => {
        const results = {
          bodyBg: getComputedStyle(document.body).backgroundColor,
          htmlBg: getComputedStyle(document.documentElement).backgroundColor,
          fixedBackgrounds: [],
        };

        // Check #mobile-header-root children
        const mobileHeaderRoot = document.getElementById('mobile-header-root');
        if (mobileHeaderRoot && mobileHeaderRoot.firstElementChild) {
          const header = mobileHeaderRoot.firstElementChild;
          results.fixedBackgrounds.push({
            location: '#mobile-header-root child',
            backgroundColor: getComputedStyle(header).backgroundColor,
          });
        }

        // Check any other fixed elements with colored backgrounds
        const allFixed = document.querySelectorAll('.fixed, [style*="position: fixed"]');
        for (const el of allFixed) {
          const bg = getComputedStyle(el).backgroundColor;
          // Skip transparent
          if (bg === 'rgba(0, 0, 0, 0)') continue;

          results.fixedBackgrounds.push({
            location: `${el.tagName}${el.className ? '.' + el.className.toString().split(' ')[0] : ''}`,
            backgroundColor: bg,
          });
        }

        return results;
      });

      console.log(`${page.name} backgrounds:`, JSON.stringify(bgInfo, null, 2));

      // Body should have white background
      const bodyIsWhite = bgInfo.bodyBg === EXPECTED_WHITE_BG || bgInfo.htmlBg === EXPECTED_WHITE_BG;
      expect(bodyIsWhite, `Body/HTML should have white background. Got body: ${bgInfo.bodyBg}, html: ${bgInfo.htmlBg}`).toBe(true);

      // Fixed elements should also have white background (or be grayscaled to look white)
      // Exception: decorative-line elements should be dark (#131313) for contrast
      for (const fixed of bgInfo.fixedBackgrounds) {
        // Skip decorative lines - they should be dark, not white
        if (fixed.location.includes('decorative-line')) {
          continue;
        }

        // In high contrast, colored backgrounds should become white via CSS override
        // OR the grayscale filter should make them appear gray/white
        const isWhite = fixed.backgroundColor === EXPECTED_WHITE_BG ||
                       fixed.backgroundColor === 'rgb(255, 255, 255)';

        // If not white, it's a bug - the CSS should force white backgrounds
        expect(
          isWhite,
          `Fixed element at ${fixed.location} should have white background in high contrast. Got: ${fixed.backgroundColor}`
        ).toBe(true);
      }
    });
  }

  test('Decorative lines should be dark in high contrast mode', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/bio'); // Use /bio as it has decorative lines
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
    await page.waitForTimeout(300);

    // Check decorative lines
    const linesInfo = await page.evaluate(() => {
      const lines = document.querySelectorAll('.decorative-line');
      return Array.from(lines).map(line => ({
        backgroundColor: getComputedStyle(line).backgroundColor,
        visible: line.getBoundingClientRect().width > 0,
      }));
    });

    console.log('Decorative lines:', linesInfo);

    expect(linesInfo.length, 'Should have decorative lines').toBeGreaterThan(0);

    // At least some lines should be dark (#131313 = rgb(19, 19, 19))
    const darkLines = linesInfo.filter(l => l.backgroundColor === EXPECTED_DARK_LINE);
    expect(
      darkLines.length,
      `Decorative lines should be dark in high contrast. Found colors: ${linesInfo.map(l => l.backgroundColor).join(', ')}`
    ).toBeGreaterThan(0);
  });

  // Test that scrollable content also has consistent colors with fixed header
  for (const page of ALL_MOBILE_PAGES) {
    test(`${page.name}: scrollable content should match fixed header style in high contrast`, async ({ page: playwrightPage }) => {
      await playwrightPage.setViewportSize({ width: 390, height: 844 });
      await playwrightPage.goto(page.path);
      await playwrightPage.waitForLoadState('networkidle');
      await playwrightPage.waitForTimeout(500);

      // Disable transitions
      await playwrightPage.addStyleTag({
        content: '* { transition: none !important; }'
      });

      // Enable high contrast
      await playwrightPage.evaluate(() => {
        document.body.classList.add('high-contrast');
      });
      await playwrightPage.waitForTimeout(300);

      // Check consistency between fixed and scrollable parts
      const consistency = await playwrightPage.evaluate(() => {
        // Find the fixed header
        const mobileHeaderRoot = document.getElementById('mobile-header-root');
        const fixedHeader = mobileHeaderRoot?.firstElementChild;

        // Find scrollable content with backgrounds
        const root = document.getElementById('root');
        const sections = document.querySelectorAll('[data-section]');
        const scrollableElements = [];

        // Check sections for background colors
        sections.forEach(section => {
          const bg = getComputedStyle(section).backgroundColor;
          if (bg !== 'rgba(0, 0, 0, 0)') {
            scrollableElements.push({
              section: section.getAttribute('data-section'),
              backgroundColor: bg,
              filter: getComputedStyle(section).filter,
            });
          }
        });

        // Get fixed header info
        const fixedInfo = fixedHeader ? {
          backgroundColor: getComputedStyle(fixedHeader).backgroundColor,
          filter: getComputedStyle(fixedHeader).filter,
        } : null;

        return {
          fixed: fixedInfo,
          scrollable: scrollableElements,
          rootBg: root ? getComputedStyle(root).backgroundColor : null,
          bodyBg: getComputedStyle(document.body).backgroundColor,
        };
      });

      console.log(`${page.name} consistency:`, JSON.stringify(consistency, null, 2));

      // If there's a fixed header and scrollable content with background
      if (consistency.fixed && consistency.scrollable.length > 0) {
        // Fixed header should be white
        expect(
          consistency.fixed.backgroundColor,
          `Fixed header should be white (#FDFDFD)`
        ).toBe(EXPECTED_WHITE_BG);

        // Scrollable sections should also effectively be white (via body background)
        // OR have filter applied that makes them grayscale
        for (const section of consistency.scrollable) {
          const isWhite = section.backgroundColor === EXPECTED_WHITE_BG ||
                         section.backgroundColor === 'rgb(255, 255, 255)';
          const hasFilter = section.filter?.includes('grayscale');

          // In high contrast: colored backgrounds should become grayscale
          // The visual appearance should be consistent
          expect(
            isWhite || hasFilter,
            `Scrollable section "${section.section}" should be white or have grayscale filter. Got bg: ${section.backgroundColor}, filter: ${section.filter}`
          ).toBe(true);
        }
      }
    });
  }

  // Screenshot test for visual verification
  test('Visual comparison: take screenshots of all pages in high contrast', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    for (const pageInfo of ALL_MOBILE_PAGES) {
      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(300);

      // Enable high contrast
      await page.evaluate(() => {
        document.body.classList.add('high-contrast');
      });
      await page.waitForTimeout(300);

      // Take screenshot
      await page.screenshot({
        path: `test-results/hc-mobile-${pageInfo.name.toLowerCase()}.png`,
        fullPage: false, // Just viewport to see header vs content
      });
    }
  });
});
