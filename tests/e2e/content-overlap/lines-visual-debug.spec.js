// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test to check if lines are VISUALLY visible (not just in DOM).
 *
 * The issue: lines are in #lines-root (z-index: 1) but #root has z-index: 2,
 * so the lines might be covered by content/backgrounds in #root.
 */

test.describe('Lines Visual Visibility', () => {

  test('Bio: check if lines are visually visible using screenshots', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/bio', { waitUntil: 'networkidle' });

    // Wait 3 seconds for any state changes
    await page.waitForTimeout(3000);

    // Take a screenshot and analyze the line color at expected positions
    // The first line should be at x=155 (before scaling)
    const linePositions = [155, 375, 595, 815, 1035, 1255];

    // Check pixel colors at line positions
    const pixelCheck = await page.evaluate((positions) => {
      const results = [];

      // Create a canvas to sample colors
      const canvas = document.createElement('canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext('2d');

      // We can't directly sample screen pixels, so let's check computed styles
      // and bounding boxes of elements at those positions
      for (const x of positions) {
        const elementsAtPoint = document.elementsFromPoint(x, 450); // middle of viewport
        const topElement = elementsAtPoint[0];

        results.push({
          x,
          topElement: topElement?.tagName || 'none',
          topElementId: topElement?.id || 'no-id',
          isLine: topElement?.style?.width === '1px',
          elementStack: elementsAtPoint.slice(0, 5).map(el => ({
            tag: el.tagName,
            id: el.id,
            className: el.className?.substring?.(0, 50) || '',
            zIndex: window.getComputedStyle(el).zIndex,
            position: window.getComputedStyle(el).position,
            bgColor: window.getComputedStyle(el).backgroundColor
          }))
        });
      }

      return results;
    }, linePositions);

    console.log('=== ELEMENT STACKING AT LINE POSITIONS ===');
    for (const check of pixelCheck) {
      console.log(`\nAt x=${check.x}:`);
      console.log(`  Top element: <${check.topElement}> id="${check.topElementId}" isLine=${check.isLine}`);
      console.log('  Element stack:');
      for (const el of check.elementStack) {
        console.log(`    <${el.tag}> id="${el.id}" z-index=${el.zIndex} pos=${el.position} bg=${el.bgColor}`);
      }
    }

    // Check if lines are the top element at their positions
    const linesOnTop = pixelCheck.filter(c => c.isLine);
    console.log(`\nLines on top: ${linesOnTop.length} of ${linePositions.length}`);

    if (linesOnTop.length < linePositions.length) {
      console.log('\n!!! LINES ARE BEING COVERED BY OTHER ELEMENTS !!!');
    }
  });

  test('Bio: check z-index stacking context', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/bio', { waitUntil: 'networkidle' });

    await page.waitForTimeout(1000);

    const stackingInfo = await page.evaluate(() => {
      const linesRoot = document.getElementById('lines-root');
      const root = document.getElementById('root');
      const fixedRoot = document.getElementById('fixed-root');

      const getStackingContext = (el) => {
        if (!el) return null;
        const style = window.getComputedStyle(el);
        return {
          id: el.id,
          zIndex: style.zIndex,
          position: style.position,
          opacity: style.opacity,
          transform: style.transform,
          isolation: style.isolation,
          willChange: style.willChange,
          bgColor: style.backgroundColor,
          childCount: el.children.length
        };
      };

      // Check first line
      const firstLine = linesRoot?.querySelector('div[style*="width: 1px"]');
      const firstLineStyle = firstLine ? window.getComputedStyle(firstLine) : null;

      // Check what's in #root that might cover lines
      const rootChildren = root?.children || [];
      const rootFirstChild = rootChildren[0];
      const rootFirstChildStyle = rootFirstChild ? window.getComputedStyle(rootFirstChild) : null;

      return {
        linesRoot: getStackingContext(linesRoot),
        root: getStackingContext(root),
        fixedRoot: getStackingContext(fixedRoot),
        firstLine: {
          exists: !!firstLine,
          zIndex: firstLineStyle?.zIndex || 'none',
          position: firstLineStyle?.position || 'none',
          bgColor: firstLineStyle?.backgroundColor || 'none'
        },
        rootFirstChild: {
          tag: rootFirstChild?.tagName || 'none',
          zIndex: rootFirstChildStyle?.zIndex || 'none',
          position: rootFirstChildStyle?.position || 'none',
          bgColor: rootFirstChildStyle?.backgroundColor || 'none'
        }
      };
    });

    console.log('=== STACKING CONTEXT INFO ===');
    console.log('#lines-root:', stackingInfo.linesRoot);
    console.log('#root:', stackingInfo.root);
    console.log('#fixed-root:', stackingInfo.fixedRoot);
    console.log('First line:', stackingInfo.firstLine);
    console.log('#root first child:', stackingInfo.rootFirstChild);

    // The key issue: #root z-index 2 is above #lines-root z-index 1
    // So anything in #root will cover the lines
    const rootZIndex = parseInt(stackingInfo.root?.zIndex) || 0;
    const linesRootZIndex = parseInt(stackingInfo.linesRoot?.zIndex) || 0;

    console.log(`\nZ-index comparison:`);
    console.log(`  #lines-root: ${linesRootZIndex}`);
    console.log(`  #root: ${rootZIndex}`);

    if (rootZIndex > linesRootZIndex) {
      console.log(`  => #root is ABOVE #lines-root, lines may be covered!`);
    }
  });

  test('Bio: take screenshot to visually verify lines', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/bio', { waitUntil: 'networkidle' });

    // Take screenshot immediately
    await page.screenshot({
      path: '/tmp/bio-lines-initial.png',
      fullPage: false
    });
    console.log('Screenshot saved: /tmp/bio-lines-initial.png');

    // Wait and take another
    await page.waitForTimeout(3000);
    await page.screenshot({
      path: '/tmp/bio-lines-after-3s.png',
      fullPage: false
    });
    console.log('Screenshot saved: /tmp/bio-lines-after-3s.png');

    // Compare - if lines disappeared, the screenshots should look different
    // For now, just verify the test ran
    expect(true).toBe(true);
  });

  test('Bio: check ResponsiveWrapper background covering lines', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/bio', { waitUntil: 'domcontentloaded' });

    // Monitor the background changes in ResponsiveWrapper
    await page.evaluate(() => {
      window.bgHistory = [];

      const checkBg = () => {
        const root = document.getElementById('root');
        const firstChild = root?.children[0];
        const linesRoot = document.getElementById('lines-root');

        const computedPageBg = getComputedStyle(document.documentElement).getPropertyValue('--page-bg');

        window.bgHistory.push({
          time: Date.now(),
          pageBgVar: computedPageBg || 'not set',
          rootFirstChildBg: firstChild ? getComputedStyle(firstChild).backgroundColor : 'none',
          linesRootBg: linesRoot ? getComputedStyle(linesRoot).backgroundColor : 'none',
          bodyBg: getComputedStyle(document.body).backgroundColor
        });
      };

      setInterval(checkBg, 100);
      checkBg();
    });

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const history = await page.evaluate(() => window.bgHistory);

    console.log('=== BACKGROUND COLOR HISTORY ===');
    history.slice(0, 20).forEach(h => {
      console.log(`${h.time}: --page-bg="${h.pageBgVar}" rootChild="${h.rootFirstChildBg}"`);
    });

    // Check when --page-bg changes from unset to set
    const transition = history.find((h, i) =>
      i > 0 && h.pageBgVar !== history[0].pageBgVar
    );

    if (transition) {
      console.log(`\n--page-bg changed at ${transition.time}`);
      console.log('Before:', history[0]);
      console.log('After:', transition);
    }
  });

});
