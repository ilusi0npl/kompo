// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Ultimate debug test for lines disappearing after 1 second.
 *
 * This test:
 * 1. Monitors #lines-root and BioFixedLayer rendering
 * 2. Tracks React state changes
 * 3. Watches for isMobile state flips
 * 4. Monitors currentColors for undefined values
 * 5. Logs everything happening over 15 seconds
 */

test.describe('Ultimate Lines Debug', () => {

  test('Bio: comprehensive debug for 15 seconds', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // Enable verbose console logging
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('[LINE-DEBUG]') || text.includes('[REACT-DEBUG]')) {
        console.log(`BROWSER: ${text}`);
      }
    });

    // Navigate
    await page.goto('/bio', { waitUntil: 'domcontentloaded' });

    // Inject comprehensive monitoring
    await page.evaluate(() => {
      window.lineDebug = {
        timeline: [],
        stateChanges: [],
        domMutations: [],
        resizeEvents: [],
        errors: [],
        startTime: Date.now()
      };

      const log = (category, data) => {
        const entry = {
          time: Date.now() - window.lineDebug.startTime,
          category,
          ...data
        };
        window.lineDebug.timeline.push(entry);
        console.log(`[LINE-DEBUG] [${entry.time}ms] ${category}:`, JSON.stringify(data));
      };

      // Monitor #lines-root
      const linesRoot = document.getElementById('fixed-root');
      if (linesRoot) {
        log('INIT', {
          linesRootExists: true,
          childCount: linesRoot.children.length,
          innerHTML: linesRoot.innerHTML.substring(0, 500)
        });

        // Mutation observer on lines-root
        const observer = new MutationObserver((mutations) => {
          mutations.forEach(mutation => {
            log('MUTATION', {
              type: mutation.type,
              target: mutation.target.nodeName,
              targetId: mutation.target.id,
              addedNodes: mutation.addedNodes.length,
              removedNodes: mutation.removedNodes.length,
              childCount: linesRoot.children.length
            });

            if (mutation.removedNodes.length > 0) {
              log('NODES_REMOVED', {
                count: mutation.removedNodes.length,
                nodes: Array.from(mutation.removedNodes).map(n => ({
                  nodeName: n.nodeName,
                  id: n.id,
                  style: n.style ? n.style.cssText.substring(0, 100) : 'none'
                }))
              });
            }
          });
        });

        observer.observe(linesRoot, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['style', 'class']
        });
      } else {
        log('ERROR', { message: 'lines-root not found' });
      }

      // Monitor #fixed-root
      const fixedRoot = document.getElementById('fixed-root');
      if (fixedRoot) {
        const fixedObserver = new MutationObserver((mutations) => {
          mutations.forEach(mutation => {
            if (mutation.removedNodes.length > 0) {
              log('FIXED_MUTATION', {
                type: mutation.type,
                removedNodes: mutation.removedNodes.length
              });
            }
          });
        });
        fixedObserver.observe(fixedRoot, { childList: true, subtree: true });
      }

      // Monitor window resize events
      window.addEventListener('resize', () => {
        log('RESIZE', {
          width: window.innerWidth,
          height: window.innerHeight,
          isMobileBreakpoint: window.innerWidth <= 768
        });
      });

      // Periodic line check
      const checkLines = () => {
        const linesRoot = document.getElementById('fixed-root');
        const lines = linesRoot?.querySelectorAll('.decorative-line') || [];
        const linesWith100vh = linesRoot?.querySelectorAll('div[style*="height: 100vh"]') || [];

        // Check line colors
        const lineColors = Array.from(lines).map(line => {
          const style = window.getComputedStyle(line);
          return {
            bgColor: style.backgroundColor,
            display: style.display,
            visibility: style.visibility,
            opacity: style.opacity,
            position: style.position
          };
        });

        // Check if any line has transparent background
        const transparentLines = lineColors.filter(l =>
          l.bgColor === 'transparent' ||
          l.bgColor === 'rgba(0, 0, 0, 0)' ||
          l.bgColor === ''
        );

        log('CHECK', {
          lineCount: lines.length,
          lines100vh: linesWith100vh.length,
          transparentCount: transparentLines.length,
          linesRootChildren: linesRoot?.children.length || 0,
          firstLineColor: lineColors[0]?.bgColor || 'none'
        });

        return lines.length;
      };

      // Check every 200ms
      window.lineCheckInterval = setInterval(checkLines, 200);

      // Initial check
      checkLines();

      // Monitor errors
      window.addEventListener('error', (e) => {
        log('JS_ERROR', { message: e.message, filename: e.filename, lineno: e.lineno });
      });
    });

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Wait 15 seconds while monitoring
    console.log('Monitoring for 15 seconds...');
    await page.waitForTimeout(15000);

    // Get debugging data
    const debugData = await page.evaluate(() => {
      clearInterval(window.lineCheckInterval);
      return window.lineDebug;
    });

    // Analyze the timeline
    console.log('\n=== TIMELINE ANALYSIS ===');
    console.log(`Total events: ${debugData.timeline.length}`);

    // Find when lines first appeared
    const firstLines = debugData.timeline.find(e => e.category === 'CHECK' && e.lineCount > 0);
    console.log(`First lines appeared: ${firstLines ? `${firstLines.time}ms with ${firstLines.lineCount} lines` : 'never'}`);

    // Find when lines disappeared (if they did)
    const lineChecks = debugData.timeline.filter(e => e.category === 'CHECK');
    let linesDisappeared = false;
    let disappearTime = null;
    let lineCountHistory = lineChecks.map(c => ({ time: c.time, count: c.lineCount }));

    for (let i = 1; i < lineChecks.length; i++) {
      if (lineChecks[i].lineCount === 0 && lineChecks[i-1].lineCount > 0) {
        linesDisappeared = true;
        disappearTime = lineChecks[i].time;
        console.log(`\n!!! LINES DISAPPEARED at ${disappearTime}ms !!!`);
        console.log('Before:', lineChecks[i-1]);
        console.log('After:', lineChecks[i]);
        break;
      }
      if (lineChecks[i].lineCount < lineChecks[i-1].lineCount) {
        console.log(`Line count dropped from ${lineChecks[i-1].lineCount} to ${lineChecks[i].lineCount} at ${lineChecks[i].time}ms`);
      }
    }

    // Check for transparent lines
    const transparentEvents = debugData.timeline.filter(e =>
      e.category === 'CHECK' && e.transparentCount > 0
    );
    if (transparentEvents.length > 0) {
      console.log(`\n!!! TRANSPARENT LINES DETECTED at ${transparentEvents[0].time}ms !!!`);
    }

    // Check for DOM mutations that removed nodes
    const removals = debugData.timeline.filter(e => e.category === 'NODES_REMOVED');
    if (removals.length > 0) {
      console.log(`\nNodes were removed ${removals.length} times`);
      removals.forEach(r => console.log(`  At ${r.time}ms: ${r.count} nodes removed`));
    }

    // Check for resize events
    const resizes = debugData.timeline.filter(e => e.category === 'RESIZE');
    if (resizes.length > 0) {
      console.log(`\nResize events: ${resizes.length}`);
      resizes.forEach(r => console.log(`  At ${r.time}ms: ${r.width}x${r.height}`));
    }

    // Check for errors
    const errors = debugData.timeline.filter(e => e.category === 'JS_ERROR');
    if (errors.length > 0) {
      console.log(`\nJavaScript errors:`);
      errors.forEach(e => console.log(`  ${e.message}`));
    }

    // Print last 20 check events
    console.log('\n=== LAST 20 LINE CHECKS ===');
    lineChecks.slice(-20).forEach(c => {
      console.log(`${c.time}ms: ${c.lineCount} lines, ${c.transparentCount} transparent, firstColor: ${c.firstLineColor}`);
    });

    // Final assertion
    const finalCheck = lineChecks[lineChecks.length - 1];
    console.log(`\nFinal state: ${finalCheck.lineCount} lines`);

    if (linesDisappeared) {
      console.log(`\n*** FAILURE: Lines disappeared at ${disappearTime}ms ***`);
    }

    expect(finalCheck.lineCount).toBeGreaterThanOrEqual(6);
  });

  test('Bio: check portal mounting and unmounting', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // Track portal render cycles
    page.on('console', msg => {
      if (msg.text().includes('PORTAL')) {
        console.log(`BROWSER: ${msg.text()}`);
      }
    });

    await page.goto('/bio', { waitUntil: 'domcontentloaded' });

    // Monitor portal content changes
    await page.evaluate(() => {
      window.portalHistory = [];

      const recordState = () => {
        const linesRoot = document.getElementById('fixed-root');
        const fixedRoot = document.getElementById('fixed-root');

        window.portalHistory.push({
          time: Date.now(),
          linesRootChildren: linesRoot?.children.length || 0,
          linesRootHTML: linesRoot?.innerHTML.length || 0,
          fixedRootChildren: fixedRoot?.children.length || 0,
          hasLinesDiv: !!(linesRoot?.querySelector('div[style*="width: 1px"]'))
        });

        console.log(`PORTAL-CHECK: lines=${linesRoot?.children.length || 0}, fixed=${fixedRoot?.children.length || 0}, hasLines=${!!(linesRoot?.querySelector('div[style*="width: 1px"]'))}`);
      };

      // Check every 100ms
      setInterval(recordState, 100);
      recordState();
    });

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    const history = await page.evaluate(() => window.portalHistory);

    // Check if portal content ever disappeared
    const contentDisappeared = history.some((h, i) =>
      i > 0 && h.linesRootChildren === 0 && history[i-1].linesRootChildren > 0
    );

    const linesDisappeared = history.some((h, i) =>
      i > 0 && !h.hasLinesDiv && history[i-1].hasLinesDiv
    );

    console.log(`Portal content disappeared: ${contentDisappeared}`);
    console.log(`Lines div disappeared: ${linesDisappeared}`);

    if (linesDisappeared) {
      const disappearIndex = history.findIndex((h, i) =>
        i > 0 && !h.hasLinesDiv && history[i-1].hasLinesDiv
      );
      console.log(`Lines disappeared at index ${disappearIndex}`);
      console.log('Before:', history[disappearIndex - 1]);
      console.log('After:', history[disappearIndex]);
    }

    const finalState = history[history.length - 1];
    expect(finalState.hasLinesDiv).toBe(true);
  });

  test('Bio: monitor isMobile state', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.goto('/bio', { waitUntil: 'domcontentloaded' });

    // Check viewport and expected isMobile state over time
    await page.evaluate(() => {
      window.viewportHistory = [];

      const check = () => {
        const width = window.innerWidth;
        const isMobile = width <= 768;

        // Check if BioFixedLayer is rendered (has the Bio text SVG)
        const hasBioFixedLayer = !!document.querySelector('#fixed-root svg path[d*="45.4401"]');

        // Check desktop lines in lines-root
        const linesRoot = document.getElementById('fixed-root');
        const desktopLines = linesRoot?.querySelectorAll('div[style*="width: 1px"][style*="height: 100vh"]') || [];

        window.viewportHistory.push({
          time: Date.now(),
          width,
          isMobile,
          hasBioFixedLayer,
          desktopLineCount: desktopLines.length
        });
      };

      setInterval(check, 200);
      check();
    });

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    const history = await page.evaluate(() => window.viewportHistory);

    console.log('=== VIEWPORT/MOBILE STATE HISTORY ===');
    history.forEach(h => {
      console.log(`${h.time}: width=${h.width}, isMobile=${h.isMobile}, fixedLayer=${h.hasBioFixedLayer}, lines=${h.desktopLineCount}`);
    });

    // Check if isMobile ever became true
    const mobileEvents = history.filter(h => h.isMobile);
    if (mobileEvents.length > 0) {
      console.log(`\n!!! isMobile became true ${mobileEvents.length} times !!!`);
    }

    // Check if BioFixedLayer ever unmounted
    const unmountEvents = history.filter((h, i) =>
      i > 0 && !h.hasBioFixedLayer && history[i-1].hasBioFixedLayer
    );
    if (unmountEvents.length > 0) {
      console.log(`\n!!! BioFixedLayer unmounted ${unmountEvents.length} times !!!`);
    }

    const final = history[history.length - 1];
    expect(final.isMobile).toBe(false);
    expect(final.desktopLineCount).toBeGreaterThanOrEqual(6);
  });

  test('Bio: check React double render in StrictMode', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.goto('/bio', { waitUntil: 'domcontentloaded' });

    // Track React mounting/unmounting
    await page.evaluate(() => {
      window.mountEvents = [];

      // Track when children are added/removed from portal roots
      const linesRoot = document.getElementById('fixed-root');
      const fixedRoot = document.getElementById('fixed-root');

      const createObserver = (root, name) => {
        if (!root) return;

        const observer = new MutationObserver((mutations) => {
          mutations.forEach(m => {
            if (m.addedNodes.length > 0) {
              window.mountEvents.push({
                time: Date.now(),
                type: 'MOUNT',
                root: name,
                count: m.addedNodes.length
              });
            }
            if (m.removedNodes.length > 0) {
              window.mountEvents.push({
                time: Date.now(),
                type: 'UNMOUNT',
                root: name,
                count: m.removedNodes.length
              });
            }
          });
        });

        observer.observe(root, { childList: true });
      };

      createObserver(linesRoot, 'lines-root');
      createObserver(fixedRoot, 'fixed-root');
    });

    // Wait a bit for StrictMode double-mount to complete
    await page.waitForTimeout(3000);

    const events = await page.evaluate(() => window.mountEvents);

    console.log('=== MOUNT/UNMOUNT EVENTS ===');
    events.forEach(e => {
      console.log(`${e.time}: ${e.type} in ${e.root} (${e.count} nodes)`);
    });

    // Check for unmount after initial mount (StrictMode behavior)
    const linesUnmounts = events.filter(e => e.root === 'lines-root' && e.type === 'UNMOUNT');
    console.log(`\nTotal lines-root unmount events: ${linesUnmounts.length}`);

    // In StrictMode, we expect mount -> unmount -> mount
    // After that, there should be no more unmounts

    // Final check - lines should be there
    const lines = await page.$$('#fixed-root .decorative-line');
    expect(lines.length).toBeGreaterThanOrEqual(6);
  });

});
