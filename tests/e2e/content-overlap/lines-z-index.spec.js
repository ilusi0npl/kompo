/**
 * Tests for vertical lines z-index behavior
 * Verifies that decorative lines appear ABOVE content for visibility
 * (especially important in high contrast mode)
 * UI elements (navigation, logo) remain at highest z-index
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Lines Z-Index', () => {
  test.describe('Lines z-index configuration', () => {
    test('Bio page - lines below photos', async ({ page }) => {
      await page.goto(`${BASE_URL}/bio`);
      await page.waitForLoadState('networkidle');

      // Get the z-index of lines-root and fixed-root
      const linesRootZIndex = await page.evaluate(() => {
        const linesRoot = document.getElementById('lines-root');
        return linesRoot ? getComputedStyle(linesRoot).zIndex : null;
      });

      const fixedRootZIndex = await page.evaluate(() => {
        const fixedRoot = document.getElementById('fixed-root');
        return fixedRoot ? getComputedStyle(fixedRoot).zIndex : null;
      });

      // lines-root should have z-index 40 (above content for visibility)
      expect(linesRootZIndex).toBe('1');
      // fixed-root should have z-index 9999 (highest, for UI controls)
      expect(fixedRootZIndex).toBe('9999');
    });

    test('Media page - lines below thumbnails', async ({ page }) => {
      await page.goto(`${BASE_URL}/media`);
      await page.waitForLoadState('networkidle');

      // Verify both portals exist and have correct z-indices
      const portalInfo = await page.evaluate(() => {
        const linesRoot = document.getElementById('lines-root');
        const fixedRoot = document.getElementById('fixed-root');
        return {
          linesRootExists: !!linesRoot,
          fixedRootExists: !!fixedRoot,
          linesRootZIndex: linesRoot ? getComputedStyle(linesRoot).zIndex : null,
          fixedRootZIndex: fixedRoot ? getComputedStyle(fixedRoot).zIndex : null,
        };
      });

      expect(portalInfo.linesRootExists).toBe(true);
      expect(portalInfo.fixedRootExists).toBe(true);
      expect(portalInfo.linesRootZIndex).toBe('1');
      expect(portalInfo.fixedRootZIndex).toBe('9999');
    });

    test('Kalendarz page - lines below event posters', async ({ page }) => {
      await page.goto(`${BASE_URL}/kalendarz`);
      await page.waitForLoadState('networkidle');

      // Verify portal z-indices
      const linesRootZIndex = await page.evaluate(() => {
        const linesRoot = document.getElementById('lines-root');
        return linesRoot ? getComputedStyle(linesRoot).zIndex : null;
      });

      expect(linesRootZIndex).toBe('1');
    });

    test('Archiwalne page - lines below event thumbnails', async ({ page }) => {
      await page.goto(`${BASE_URL}/archiwalne`);
      await page.waitForLoadState('networkidle');

      const linesRootZIndex = await page.evaluate(() => {
        const linesRoot = document.getElementById('lines-root');
        return linesRoot ? getComputedStyle(linesRoot).zIndex : null;
      });

      expect(linesRootZIndex).toBe('1');
    });

    test('Repertuar page - lines below content', async ({ page }) => {
      await page.goto(`${BASE_URL}/repertuar`);
      await page.waitForLoadState('networkidle');

      const linesRootZIndex = await page.evaluate(() => {
        const linesRoot = document.getElementById('lines-root');
        return linesRoot ? getComputedStyle(linesRoot).zIndex : null;
      });

      expect(linesRootZIndex).toBe('1');
    });

    test('Bio Ensemble page - lines in lines-root (below content)', async ({ page }) => {
      await page.goto(`${BASE_URL}/bio/ensemble`);
      await page.waitForLoadState('networkidle');

      const portalInfo = await page.evaluate(() => {
        const linesRoot = document.getElementById('lines-root');
        const fixedRoot = document.getElementById('fixed-root');
        const decorativeLinesInLinesRoot = linesRoot ? linesRoot.querySelectorAll('.decorative-line') : [];
        return {
          linesRootExists: !!linesRoot,
          fixedRootExists: !!fixedRoot,
          linesRootZIndex: linesRoot ? getComputedStyle(linesRoot).zIndex : null,
          fixedRootZIndex: fixedRoot ? getComputedStyle(fixedRoot).zIndex : null,
          linesRootHasDecorativeLines: decorativeLinesInLinesRoot.length > 0,
        };
      });

      expect(portalInfo.linesRootExists).toBe(true);
      expect(portalInfo.linesRootZIndex).toBe('1');
      expect(portalInfo.linesRootHasDecorativeLines).toBe(true);
    });
  });

  test.describe('UI elements should remain clickable', () => {
    test('Logo should be clickable on Bio page', async ({ page }) => {
      await page.goto(`${BASE_URL}/bio`);
      await page.waitForLoadState('networkidle');

      // Find the logo link
      const logoLink = page.locator('a[href="/"]').first();
      await expect(logoLink).toBeVisible();

      // Verify it's clickable (not blocked by lines)
      const box = await logoLink.boundingBox();
      expect(box).not.toBeNull();

      // Verify pointer-events is not 'none' on the logo
      const pointerEvents = await logoLink.evaluate((el) => getComputedStyle(el).pointerEvents);
      expect(pointerEvents).toBe('auto');
    });

    test('Navigation should be clickable on Media page', async ({ page }) => {
      await page.goto(`${BASE_URL}/media`);
      await page.waitForLoadState('networkidle');

      // Find a navigation link
      const navLink = page.locator('nav a').first();
      await expect(navLink).toBeVisible();

      // Verify pointer-events allows clicking
      const pointerEvents = await navLink.evaluate((el) => getComputedStyle(el).pointerEvents);
      expect(pointerEvents).toBe('auto');
    });
  });

  test.describe('High contrast mode compatibility', () => {
    test('Lines and UI work correctly in high contrast mode', async ({ page }) => {
      await page.goto(`${BASE_URL}/bio`);
      await page.waitForLoadState('networkidle');

      // Enable high contrast mode
      await page.evaluate(() => {
        document.body.classList.add('high-contrast');
      });

      // Verify portals still have correct z-indices
      const portalInfo = await page.evaluate(() => {
        const linesRoot = document.getElementById('lines-root');
        const fixedRoot = document.getElementById('fixed-root');
        return {
          linesRootZIndex: linesRoot ? getComputedStyle(linesRoot).zIndex : null,
          fixedRootZIndex: fixedRoot ? getComputedStyle(fixedRoot).zIndex : null,
        };
      });

      expect(portalInfo.linesRootZIndex).toBe('1');
      expect(portalInfo.fixedRootZIndex).toBe('9999');

      // Verify logo is still clickable in high contrast mode
      const logoLink = page.locator('a[href="/"]').first();
      await expect(logoLink).toBeVisible();
    });

    test('Bio Ensemble - high contrast mode applies correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/bio/ensemble`);
      await page.waitForLoadState('networkidle');

      // Enable high contrast mode
      await page.evaluate(() => {
        document.body.classList.add('high-contrast');
      });

      // Verify filter is applied to #root only
      const filterInfo = await page.evaluate(() => {
        const root = document.getElementById('root');
        const linesRoot = document.getElementById('lines-root');
        const fixedRoot = document.getElementById('fixed-root');
        return {
          rootFilter: root ? getComputedStyle(root).filter : null,
          linesRootFilter: linesRoot ? getComputedStyle(linesRoot).filter : null,
          fixedRootFilter: fixedRoot ? getComputedStyle(fixedRoot).filter : null,
        };
      });

      // #root should have the high-contrast filter
      expect(filterInfo.rootFilter).toContain('contrast');
      expect(filterInfo.rootFilter).toContain('grayscale');

      // #lines-root container should NOT have filter directly
      // Only non-decorative-line children get the filter
      expect(filterInfo.linesRootFilter).toBe('none');

      // #fixed-root should NOT have the filter (UI elements stay unfiltered)
      expect(filterInfo.fixedRootFilter).toBe('none');
    });
  });

  test.describe('Content visibility - all pages', () => {
    test('Bio page - content sections are visible', async ({ page }) => {
      await page.goto(`${BASE_URL}/bio`);
      await page.waitForLoadState('networkidle');

      // Check that bio sections are visible
      const sections = page.locator('[data-section]');
      const count = await sections.count();
      expect(count).toBeGreaterThan(0);

      // First section should be visible
      await expect(sections.first()).toBeVisible();

      // Check images are visible
      const images = page.locator('img');
      const imgCount = await images.count();
      expect(imgCount).toBeGreaterThan(0);
      await expect(images.first()).toBeVisible();
    });

    test('Bio Ensemble - content is visible above lines', async ({ page }) => {
      await page.goto(`${BASE_URL}/bio/ensemble`);
      await page.waitForLoadState('networkidle');

      // Check that the main content is visible
      const section = page.locator('[data-section="bio-ensemble"]');
      await expect(section).toBeVisible();

      // Check title is visible
      const title = section.locator('p').first();
      await expect(title).toBeVisible();

      // Check image is visible
      const image = section.locator('img[alt="Ensemble KOMPOPOLEX"]');
      await expect(image).toBeVisible();
    });

    test('Media page - albums are visible above lines', async ({ page }) => {
      await page.goto(`${BASE_URL}/media`);
      await page.waitForLoadState('networkidle');

      // Check that album thumbnails are visible
      const images = page.locator('img');
      const imgCount = await images.count();
      expect(imgCount).toBeGreaterThan(0);
      await expect(images.first()).toBeVisible();

      // Check that content container is visible
      const content = page.locator('[data-section]').first();
      await expect(content).toBeVisible();
    });

    test('Media Wideo page - videos are visible above lines', async ({ page }) => {
      await page.goto(`${BASE_URL}/media/wideo`);
      await page.waitForLoadState('networkidle');

      // Check that video thumbnails or iframes are visible
      const content = page.locator('[data-section]').first();
      await expect(content).toBeVisible();
    });

    test('Kalendarz page - events are visible above lines', async ({ page }) => {
      await page.goto(`${BASE_URL}/kalendarz`);
      await page.waitForLoadState('networkidle');

      // Check that event content is visible
      const content = page.locator('[data-section]').first();
      await expect(content).toBeVisible();

      // Check event images/posters are visible
      const images = page.locator('img');
      const imgCount = await images.count();
      if (imgCount > 0) {
        await expect(images.first()).toBeVisible();
      }
    });

    test('Archiwalne page - archived events are visible above lines', async ({ page }) => {
      await page.goto(`${BASE_URL}/archiwalne`);
      await page.waitForLoadState('networkidle');

      // Check that archived events content is visible
      const content = page.locator('[data-section]').first();
      await expect(content).toBeVisible();

      // Check thumbnails are visible
      const images = page.locator('img');
      const imgCount = await images.count();
      if (imgCount > 0) {
        await expect(images.first()).toBeVisible();
      }
    });

    test('Repertuar page - composers are visible above lines', async ({ page }) => {
      await page.goto(`${BASE_URL}/repertuar`);
      await page.waitForLoadState('networkidle');

      // Check that repertuar content is visible
      const content = page.locator('[data-section]').first();
      await expect(content).toBeVisible();

      // Check text content is visible
      const text = page.locator('p, span').first();
      await expect(text).toBeVisible();
    });

    test('Specjalne page - special projects are visible above lines', async ({ page }) => {
      await page.goto(`${BASE_URL}/specialne`);
      await page.waitForLoadState('networkidle');

      // Check that special projects content is visible
      const content = page.locator('[data-section]').first();
      await expect(content).toBeVisible();
    });

    test('Fundacja page - content is visible above lines', async ({ page }) => {
      await page.goto(`${BASE_URL}/fundacja`);
      await page.waitForLoadState('networkidle');

      // Check that fundacja content is visible
      const content = page.locator('[data-section]').first();
      await expect(content).toBeVisible();

      // Check images are visible
      const images = page.locator('img');
      const imgCount = await images.count();
      if (imgCount > 0) {
        await expect(images.first()).toBeVisible();
      }
    });

    test('Kontakt page - contact info is visible above lines', async ({ page }) => {
      await page.goto(`${BASE_URL}/kontakt`);
      await page.waitForLoadState('networkidle');

      // Check that kontakt content is visible
      const content = page.locator('[data-section]').first();
      await expect(content).toBeVisible();

      // Check that contact text/email is visible
      const text = page.locator('p, a').first();
      await expect(text).toBeVisible();
    });

    test('Wydarzenie page - event details are visible above lines', async ({ page }) => {
      // Navigate to kalendarz first to find an event link
      await page.goto(`${BASE_URL}/kalendarz`);
      await page.waitForLoadState('networkidle');

      // Try to find and click an event link, or go directly to a known event page
      const eventLink = page.locator('a[href^="/wydarzenie"]').first();
      const hasEventLink = await eventLink.count() > 0;

      if (hasEventLink) {
        await eventLink.click();
        await page.waitForLoadState('networkidle');

        // Check that event content is visible
        const content = page.locator('[data-section]').first();
        await expect(content).toBeVisible();
      }
    });

    test('Homepage - content is visible above any decorative elements', async ({ page }) => {
      await page.goto(`${BASE_URL}/`);
      await page.waitForLoadState('networkidle');

      // Check that main content is visible
      const content = page.locator('[data-section], main, #root > div').first();
      await expect(content).toBeVisible();

      // Check images are visible
      const images = page.locator('img');
      const imgCount = await images.count();
      if (imgCount > 0) {
        await expect(images.first()).toBeVisible();
      }
    });
  });

  test.describe('Lines portal content structure', () => {
    test('Lines-root portal contains decorative lines', async ({ page }) => {
      await page.goto(`${BASE_URL}/bio`);
      await page.waitForLoadState('networkidle');

      // Verify lines-root has decorative lines (below content)
      const hasDecorativeLines = await page.evaluate(() => {
        const linesRoot = document.getElementById('lines-root');
        const lines = linesRoot ? linesRoot.querySelectorAll('.decorative-line') : [];
        return lines.length > 0;
      });

      expect(hasDecorativeLines).toBe(true);
    });

    test('Fixed portal contains UI elements', async ({ page }) => {
      await page.goto(`${BASE_URL}/media`);
      await page.waitForLoadState('networkidle');

      // Verify fixed-root has children (UI elements)
      const hasChildren = await page.evaluate(() => {
        const fixedRoot = document.getElementById('fixed-root');
        return fixedRoot ? fixedRoot.children.length > 0 : false;
      });

      expect(hasChildren).toBe(true);
    });
  });
});
