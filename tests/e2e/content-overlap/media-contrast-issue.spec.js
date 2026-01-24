// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Tests for high contrast mode on Media and MediaWideo pages.
 * Issue: Upper part of page doesn't change contrast when toggle is clicked.
 */

test.describe('Media pages - High Contrast Mode', () => {

  test('Media: entire page should have contrast filter applied', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/media', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Check initial state - no filter on #root
    const initialFilter = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root ? getComputedStyle(root).filter : 'none';
    });
    console.log('Initial #root filter:', initialFilter);

    // Click contrast toggle
    const contrastToggle = await page.$('[class*="contrast"], button[aria-label*="contrast"], .contrast-toggle-btn');
    if (!contrastToggle) {
      // Try finding by the eye icon or other selectors
      const toggle = await page.$('button:has(svg), [onclick*="contrast"]');
      if (toggle) await toggle.click();
    } else {
      await contrastToggle.click();
    }
    await page.waitForTimeout(500);

    // Check that body has high-contrast class
    const hasHighContrast = await page.evaluate(() => {
      return document.body.classList.contains('high-contrast');
    });
    console.log('Body has high-contrast class:', hasHighContrast);
    expect(hasHighContrast).toBe(true);

    // Check filter on #root after enabling high contrast
    const rootFilter = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root ? getComputedStyle(root).filter : 'none';
    });
    console.log('#root filter after high contrast:', rootFilter);
    expect(rootFilter).toContain('contrast');

    // Check various elements at different Y positions to ensure filter is applied
    const elementsToCheck = await page.evaluate(() => {
      const results = [];
      const yPositions = [100, 300, 500, 700]; // Different vertical positions

      for (const y of yPositions) {
        const elements = document.elementsFromPoint(720, y); // Center of page
        const topElement = elements[0];
        if (topElement) {
          // Walk up the DOM to find if any ancestor has the filter
          let el = topElement;
          let hasFilteredAncestor = false;
          let filterValue = 'none';

          while (el && el !== document.body) {
            const style = getComputedStyle(el);
            if (style.filter && style.filter !== 'none') {
              hasFilteredAncestor = true;
              filterValue = style.filter;
              break;
            }
            el = el.parentElement;
          }

          // Check if element is inside #root (which should have filter)
          const isInRoot = topElement.closest('#root') !== null;
          const isInFixedRoot = topElement.closest('#fixed-root') !== null;
          const isInLinesRoot = topElement.closest('#lines-root') !== null;

          results.push({
            y,
            tagName: topElement.tagName,
            id: topElement.id || 'no-id',
            className: topElement.className?.toString?.()?.substring(0, 50) || '',
            isInRoot,
            isInFixedRoot,
            isInLinesRoot,
            hasFilteredAncestor,
            filterValue,
          });
        }
      }
      return results;
    });

    console.log('Elements at different Y positions:');
    for (const el of elementsToCheck) {
      console.log(`  Y=${el.y}: <${el.tagName}> id="${el.id}" inRoot=${el.isInRoot} inFixed=${el.isInFixedRoot} filtered=${el.hasFilteredAncestor}`);
    }

    // Elements in #root should be affected by the filter
    // Elements in #fixed-root should NOT be affected (they're outside filter)
    // But ALL visible content should have SOME element with filter applied

    // The issue is if content at top of page is NOT in #root
    const topElements = elementsToCheck.filter(e => e.y <= 300);
    const topElementsWithoutFilter = topElements.filter(e => !e.isInRoot && !e.hasFilteredAncestor);

    if (topElementsWithoutFilter.length > 0) {
      console.log('!!! ISSUE DETECTED: Top elements without filter:', topElementsWithoutFilter);
    }

    // At least the main content area should be filtered
    const hasFilteredContent = elementsToCheck.some(e => e.isInRoot || e.hasFilteredAncestor);
    expect(hasFilteredContent).toBe(true);
  });

  test('MediaWideo: entire page should have contrast filter applied', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/media/wideo', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Click contrast toggle
    const contrastToggle = await page.$('[class*="contrast"], button[aria-label*="contrast"], .contrast-toggle-btn');
    if (contrastToggle) {
      await contrastToggle.click();
    }
    await page.waitForTimeout(500);

    // Check that body has high-contrast class
    const hasHighContrast = await page.evaluate(() => {
      return document.body.classList.contains('high-contrast');
    });
    expect(hasHighContrast).toBe(true);

    // Check DOM structure - what's rendering outside #root?
    const domStructure = await page.evaluate(() => {
      const body = document.body;
      const children = Array.from(body.children);

      return children.map(child => ({
        id: child.id,
        tagName: child.tagName,
        zIndex: getComputedStyle(child).zIndex,
        position: getComputedStyle(child).position,
        filter: getComputedStyle(child).filter,
        childCount: child.children.length,
        hasContent: child.innerHTML.length > 100,
      }));
    });

    console.log('Body children:', JSON.stringify(domStructure, null, 2));

    // Check if there's content rendering outside #root that should be filtered
    const outsideRoot = domStructure.filter(el =>
      el.id !== 'root' &&
      el.hasContent &&
      el.filter === 'none'
    );

    if (outsideRoot.length > 0) {
      console.log('!!! Elements with content outside #root without filter:', outsideRoot);
    }
  });

  test('Media: fixed header/tabs should be in #fixed-root (unfiltered)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/media', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Check structure of fixed elements
    const fixedStructure = await page.evaluate(() => {
      const fixedRoot = document.getElementById('fixed-root');
      const linesRoot = document.getElementById('lines-root');
      const root = document.getElementById('root');

      const getChildInfo = (parent) => {
        if (!parent) return [];
        return Array.from(parent.children).map(child => ({
          tagName: child.tagName,
          className: child.className?.toString?.()?.substring(0, 80) || '',
          position: getComputedStyle(child).position,
          zIndex: getComputedStyle(child).zIndex,
          top: getComputedStyle(child).top,
          height: child.offsetHeight,
        }));
      };

      return {
        fixedRoot: {
          exists: !!fixedRoot,
          filter: fixedRoot ? getComputedStyle(fixedRoot).filter : 'N/A',
          children: getChildInfo(fixedRoot),
        },
        linesRoot: {
          exists: !!linesRoot,
          filter: linesRoot ? getComputedStyle(linesRoot).filter : 'N/A',
          children: getChildInfo(linesRoot),
        },
        root: {
          exists: !!root,
          filter: root ? getComputedStyle(root).filter : 'N/A',
          childCount: root?.children.length || 0,
        },
      };
    });

    console.log('Fixed structure:', JSON.stringify(fixedStructure, null, 2));

    // Verify structure exists
    expect(fixedStructure.fixedRoot.exists).toBe(true);
    expect(fixedStructure.linesRoot.exists).toBe(true);
    expect(fixedStructure.root.exists).toBe(true);
  });

  test('Media: background color should change with high contrast', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/media', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Get background colors before contrast
    const beforeColors = await page.evaluate(() => {
      const getBackgrounds = () => {
        const results = {};
        const selectors = ['body', '#root', '#lines-root', '#fixed-root'];

        for (const sel of selectors) {
          const el = document.querySelector(sel);
          if (el) {
            results[sel] = {
              backgroundColor: getComputedStyle(el).backgroundColor,
              filter: getComputedStyle(el).filter,
            };
          }
        }

        // Also check first child of root
        const root = document.getElementById('root');
        if (root?.firstElementChild) {
          results['#root > first-child'] = {
            backgroundColor: getComputedStyle(root.firstElementChild).backgroundColor,
            filter: getComputedStyle(root.firstElementChild).filter,
          };
        }

        return results;
      };
      return getBackgrounds();
    });

    console.log('Before high contrast:', JSON.stringify(beforeColors, null, 2));

    // Enable high contrast
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
    });
    await page.waitForTimeout(100);

    // Get colors after contrast
    const afterColors = await page.evaluate(() => {
      const getBackgrounds = () => {
        const results = {};
        const selectors = ['body', '#root', '#lines-root', '#fixed-root'];

        for (const sel of selectors) {
          const el = document.querySelector(sel);
          if (el) {
            results[sel] = {
              backgroundColor: getComputedStyle(el).backgroundColor,
              filter: getComputedStyle(el).filter,
            };
          }
        }

        const root = document.getElementById('root');
        if (root?.firstElementChild) {
          results['#root > first-child'] = {
            backgroundColor: getComputedStyle(root.firstElementChild).backgroundColor,
            filter: getComputedStyle(root.firstElementChild).filter,
          };
        }

        return results;
      };
      return getBackgrounds();
    });

    console.log('After high contrast:', JSON.stringify(afterColors, null, 2));

    // #root should have filter applied after high contrast
    expect(afterColors['#root'].filter).toContain('contrast');
  });

  test('Media: LinesPortal content should be affected by contrast', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/media', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Enable high contrast
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
    });
    await page.waitForTimeout(100);

    // Check #lines-root filter after contrast
    const linesRootAfter = await page.evaluate(() => {
      const linesRoot = document.getElementById('lines-root');
      return {
        filter: linesRoot ? getComputedStyle(linesRoot).filter : 'none',
      };
    });

    console.log('#lines-root after high contrast:', linesRootAfter);
    expect(linesRootAfter.filter).toContain('contrast');
  });

  test('Media: fixed header elements inside #fixed-root should have filter applied', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/media', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Enable high contrast
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
    });
    await page.waitForTimeout(100);

    // Check filter on #fixed-root children
    const fixedChildFilters = await page.evaluate(() => {
      const fixedRoot = document.getElementById('fixed-root');
      if (!fixedRoot) return { hasChildren: false };

      const firstChild = fixedRoot.firstElementChild;
      if (!firstChild) return { hasChildren: false };

      return {
        hasChildren: true,
        firstChildFilter: getComputedStyle(firstChild).filter,
        firstChildBg: getComputedStyle(firstChild).backgroundColor,
      };
    });

    console.log('#fixed-root first child:', fixedChildFilters);

    // The first child (header with background) should have filter applied
    expect(fixedChildFilters.hasChildren).toBe(true);
    expect(fixedChildFilters.firstChildFilter).toContain('contrast');
  });

  test('MediaWideo: fixed header elements inside #fixed-root should have filter applied', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/media/wideo', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Enable high contrast
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
    });
    await page.waitForTimeout(100);

    // Check filter on #fixed-root children
    const fixedChildFilters = await page.evaluate(() => {
      const fixedRoot = document.getElementById('fixed-root');
      if (!fixedRoot) return { hasChildren: false };

      const firstChild = fixedRoot.firstElementChild;
      if (!firstChild) return { hasChildren: false };

      return {
        hasChildren: true,
        firstChildFilter: getComputedStyle(firstChild).filter,
        firstChildBg: getComputedStyle(firstChild).backgroundColor,
      };
    });

    console.log('#fixed-root first child (wideo):', fixedChildFilters);

    // The first child (header with background) should have filter applied
    expect(fixedChildFilters.hasChildren).toBe(true);
    expect(fixedChildFilters.firstChildFilter).toContain('contrast');
  });

});
