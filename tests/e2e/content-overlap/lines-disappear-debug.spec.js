// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Aggressive tests to find why lines disappear after 1 second.
 * Testing various scenarios that might trigger the bug.
 */

test.describe('Lines disappear investigation', () => {

  test('Bio: continuous DOM monitoring for 10 seconds', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.goto('/bio', { waitUntil: 'domcontentloaded' });

    // Inject monitoring script
    await page.evaluate(() => {
      window.lineHistory = [];
      window.mutationLog = [];

      const checkLines = () => {
        const linesRoot = document.getElementById('fixed-root');
        const lines = linesRoot?.querySelectorAll('div[style*="width: 1px"]') || [];
        const children = linesRoot?.children.length || 0;
        window.lineHistory.push({
          time: Date.now(),
          lines: lines.length,
          children,
          linesRootExists: !!linesRoot,
          linesRootHTML: linesRoot?.innerHTML?.substring(0, 200) || 'none'
        });
      };

      // Check every 100ms
      setInterval(checkLines, 100);
      checkLines(); // Initial check

      // Also watch for mutations
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(m => {
          window.mutationLog.push({
            time: Date.now(),
            type: m.type,
            target: m.target.nodeName,
            targetId: m.target.id || 'no-id',
            addedNodes: m.addedNodes.length,
            removedNodes: m.removedNodes.length
          });
        });
      });

      const linesRoot = document.getElementById('fixed-root');
      if (linesRoot) {
        observer.observe(linesRoot, { childList: true, subtree: true, attributes: true });
      }
      observer.observe(document.body, { childList: true, subtree: true });
    });

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Wait 10 seconds while monitoring
    await page.waitForTimeout(10000);

    // Get the monitoring data
    const lineHistory = await page.evaluate(() => window.lineHistory || []);
    const mutationLog = await page.evaluate(() => window.mutationLog || []);

    console.log('=== LINE HISTORY (last 20 entries) ===');
    if (lineHistory.length > 0) {
      lineHistory.slice(-20).forEach(entry => {
        console.log(`${entry.time}: lines=${entry.lines}, children=${entry.children}, exists=${entry.linesRootExists}`);
      });
    }

    console.log('\n=== MUTATIONS AFFECTING LINES-ROOT ===');
    const linesMutations = mutationLog.filter(m => m.targetId === 'lines-root' || m.removedNodes > 0);
    linesMutations.slice(-20).forEach(m => {
      console.log(`${m.time}: ${m.type} on ${m.target}#${m.targetId}, +${m.addedNodes}/-${m.removedNodes}`);
    });

    // Check if lines ever disappeared
    const linesDisappeared = lineHistory.some(h => h.lines === 0 && h.linesRootExists);
    const linesDropped = lineHistory.some((h, i) => i > 0 && h.lines < lineHistory[i-1].lines);

    if (linesDisappeared) {
      console.log('\n!!! LINES DISAPPEARED AT SOME POINT !!!');
      const disappearIndex = lineHistory.findIndex(h => h.lines === 0);
      if (disappearIndex > 0) {
        console.log('Before:', lineHistory[disappearIndex - 1]);
      }
      console.log('Disappeared:', lineHistory[disappearIndex]);
    }

    if (linesDropped) {
      console.log('\n!!! LINES COUNT DROPPED !!!');
    }

    // Final check - lines should still be there
    const finalLines = await page.$$('#lines-root .decorative-line');
    expect(finalLines.length).toBeGreaterThanOrEqual(6);
  });

  test('Bio: test with mouse movement', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/bio', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Initial check
    let lines = await page.$$('#lines-root .decorative-line');
    console.log('Initial lines:', lines.length);
    expect(lines.length).toBeGreaterThanOrEqual(6);

    // Move mouse around
    for (let i = 0; i < 10; i++) {
      await page.mouse.move(100 + i * 100, 100 + i * 50);
      await page.waitForTimeout(200);

      lines = await page.$$('#lines-root .decorative-line');
      console.log(`After mouse move ${i}:`, lines.length);
      expect(lines.length).toBeGreaterThanOrEqual(6);
    }
  });

  test('Bio: test with clicking', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/bio', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Click around the page
    const clickPositions = [
      { x: 200, y: 200 },
      { x: 500, y: 300 },
      { x: 800, y: 400 },
      { x: 1000, y: 500 },
    ];

    for (const pos of clickPositions) {
      await page.mouse.click(pos.x, pos.y);
      await page.waitForTimeout(500);

      const lines = await page.$$('#lines-root .decorative-line');
      console.log(`After click at (${pos.x}, ${pos.y}):`, lines.length);
      expect(lines.length).toBeGreaterThanOrEqual(6);
    }
  });

  test('Bio: test with scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/bio', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Scroll in steps
    for (let y = 0; y <= 2000; y += 200) {
      await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
      await page.waitForTimeout(300);

      const lines = await page.$$('#lines-root .decorative-line');
      console.log(`After scroll to ${y}:`, lines.length);
      expect(lines.length).toBeGreaterThanOrEqual(6);
    }
  });

  test('Bio: test with window resize', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/bio', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const sizes = [
      { width: 1440, height: 900 },
      { width: 1200, height: 800 },
      { width: 1000, height: 700 },
      { width: 900, height: 600 },
      { width: 1440, height: 900 }, // back to original
    ];

    for (const size of sizes) {
      await page.setViewportSize(size);
      await page.waitForTimeout(500);

      const lines = await page.$$('#lines-root .decorative-line');
      console.log(`At ${size.width}x${size.height}:`, lines.length);

      // At desktop widths (>768) we should have 6 lines
      if (size.width > 768) {
        expect(lines.length).toBeGreaterThanOrEqual(6);
      }
    }
  });

  test('Bio: check lines visibility over time', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/bio', { waitUntil: 'networkidle' });

    // Monitor lines visibility at different time points
    const checkPoints = [0, 500, 1000, 1500, 2000, 3000];
    const results = [];

    for (const ms of checkPoints) {
      if (ms > 0) {
        await page.waitForTimeout(ms - (results.length > 0 ? checkPoints[results.length - 1] : 0));
      }

      const lines = await page.$$('#lines-root .decorative-line');
      results.push({ ms, count: lines.length });
      console.log(`At ${ms}ms: ${lines.length} lines`);
    }

    // Lines should be present at all check points
    results.forEach(r => {
      expect(r.count).toBeGreaterThanOrEqual(6);
    });
  });

  test('Bio: force re-render by triggering state changes', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/bio', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Trigger language toggle (if exists)
    const langToggle = await page.$('[class*="language"], [class*="lang"], button:has-text("EN"), button:has-text("PL")');
    if (langToggle) {
      await langToggle.click();
      await page.waitForTimeout(1000);

      const lines = await page.$$('#lines-root .decorative-line');
      console.log('After language toggle:', lines.length);
      expect(lines.length).toBeGreaterThanOrEqual(6);
    }

    // Trigger contrast toggle (if exists)
    const contrastToggle = await page.$('[class*="contrast"], button[aria-label*="contrast"]');
    if (contrastToggle) {
      await contrastToggle.click();
      await page.waitForTimeout(1000);

      const lines = await page.$$('#lines-root .decorative-line');
      console.log('After contrast toggle:', lines.length);
      expect(lines.length).toBeGreaterThanOrEqual(6);
    }
  });

  test('Bio: check portal rendering', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/bio', { waitUntil: 'networkidle' });

    // Check portal structure
    const portalInfo = await page.evaluate(() => {
      const linesRoot = document.getElementById('fixed-root');
      const fixedRoot = document.getElementById('fixed-root');
      const root = document.getElementById('root');

      return {
        linesRoot: {
          exists: !!linesRoot,
          children: linesRoot?.children.length || 0,
          innerHTML: linesRoot?.innerHTML?.substring(0, 500) || 'empty',
          style: linesRoot?.getAttribute('style') || 'none',
          computedZIndex: linesRoot ? getComputedStyle(linesRoot).zIndex : 'N/A'
        },
        fixedRoot: {
          exists: !!fixedRoot,
          children: fixedRoot?.children.length || 0,
          computedZIndex: fixedRoot ? getComputedStyle(fixedRoot).zIndex : 'N/A'
        },
        root: {
          exists: !!root,
          children: root?.children.length || 0,
          computedZIndex: root ? getComputedStyle(root).zIndex : 'N/A'
        }
      };
    });

    console.log('Portal info:', JSON.stringify(portalInfo, null, 2));

    // Wait and check again
    await page.waitForTimeout(3000);

    const portalInfoAfter = await page.evaluate(() => {
      const linesRoot = document.getElementById('fixed-root');
      return {
        children: linesRoot?.children.length || 0,
        innerHTML: linesRoot?.innerHTML?.substring(0, 500) || 'empty'
      };
    });

    console.log('Portal info after 3s:', JSON.stringify(portalInfoAfter, null, 2));

    expect(portalInfoAfter.children).toBeGreaterThan(0);
  });

});
