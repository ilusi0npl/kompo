/**
 * Media Page - Content Edge Cases Tests
 * Tests various content scenarios for photo albums and videos
 */

import { test, expect } from '@playwright/test';
import {
  setupScenario,
  mockSanityError,
  assertNoUndefinedNull,
  hasHorizontalScroll,
  checkForXSS,
} from '../helpers/sanity-mock-helper.js';
import { scenarios } from './fixtures/scenarios.js';
import { generators, text, photoAlbum, video, array } from './fixtures/generators.js';

test.describe('Media Page - Content Edge Cases', () => {

  // ==========================================
  // EMPTY STATE
  // ==========================================
  test.describe('Empty State', () => {
    test('shows graceful UI when no albums exist', async ({ page }) => {
      await setupScenario(page, scenarios.empty);
      await page.goto('/media');

      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);
    });

    test('shows graceful UI when no videos exist', async ({ page }) => {
      await setupScenario(page, scenarios.empty);
      await page.goto('/media/wideo');

      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);
    });
  });

  // ==========================================
  // MINIMAL DATA
  // ==========================================
  test.describe('Minimal Data', () => {
    test('renders album with single photo', async ({ page }) => {
      await setupScenario(page, {
        photoAlbums: [
          photoAlbum({
            imageUrls: ['/assets/single.jpg'],
          }),
        ],
      });
      await page.goto('/media');

      await expect(page.locator('body')).toBeVisible();
    });

    test('renders video with minimal info', async ({ page }) => {
      await setupScenario(page, scenarios.minimal);
      await page.goto('/media/wideo');

      await expect(page.locator('body')).toBeVisible();
    });
  });

  // ==========================================
  // EXTREME TEXT LENGTH
  // ==========================================
  test.describe('Extreme Text Length', () => {
    test('handles very long album title', async ({ page }) => {
      await setupScenario(page, {
        photoAlbums: [
          photoAlbum({
            titlePl: text.long(500),
            titleEn: text.long(500),
          }),
        ],
      });
      await page.goto('/media');

      const hasOverflow = await hasHorizontalScroll(page);
      expect(hasOverflow).toBe(false);
    });

    test('handles very long photographer name', async ({ page }) => {
      await setupScenario(page, {
        photoAlbums: [
          photoAlbum({
            photographer: text.long(200),
          }),
        ],
      });
      await page.goto('/media');

      const hasOverflow = await hasHorizontalScroll(page);
      expect(hasOverflow).toBe(false);
    });

    test('handles very long video description', async ({ page }) => {
      await setupScenario(page, {
        videos: [
          video({
            descriptionPl: text.long(5000),
            descriptionEn: text.long(5000),
          }),
        ],
      });
      await page.goto('/media/wideo');

      const hasOverflow = await hasHorizontalScroll(page);
      expect(hasOverflow).toBe(false);
    });
  });

  // ==========================================
  // MASSIVE COUNT
  // ==========================================
  test.describe('Massive Count', () => {
    test('renders album with 200 photos', async ({ page }) => {
      await setupScenario(page, {
        photoAlbums: [
          photoAlbum({
            imageUrls: Array(200).fill('/assets/photo.jpg'),
          }),
        ],
      });
      await page.goto('/media');

      await expect(page.locator('body')).toBeVisible();
    });

    test('renders 30 albums without crashing', async ({ page }) => {
      await setupScenario(page, scenarios.massiveCount);
      await page.goto('/media');

      await expect(page.locator('body')).toBeVisible();
    });

    test('renders 50 videos without crashing', async ({ page }) => {
      await setupScenario(page, scenarios.massiveCount);
      await page.goto('/media/wideo');

      await expect(page.locator('body')).toBeVisible();
    });

    test('scroll performance with many albums', async ({ page }) => {
      await setupScenario(page, scenarios.massiveCount);
      await page.goto('/media');

      const startTime = Date.now();
      await page.mouse.wheel(0, 10000);
      await page.waitForTimeout(100);
      const scrollTime = Date.now() - startTime;

      expect(scrollTime).toBeLessThan(2000);
    });
  });

  // ==========================================
  // MISSING OPTIONAL FIELDS
  // ==========================================
  test.describe('Missing Optional Fields', () => {
    test('handles album without EN title', async ({ page }) => {
      await setupScenario(page, scenarios.missingOptional);
      await page.goto('/media');

      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);
    });

    test('handles video without description', async ({ page }) => {
      await setupScenario(page, {
        videos: [
          video({
            descriptionPl: null,
            descriptionEn: null,
          }),
        ],
      });
      await page.goto('/media/wideo');

      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);
    });

    test('handles video without thumbnail', async ({ page }) => {
      await setupScenario(page, scenarios.missingOptional);
      await page.goto('/media/wideo');

      await expect(page.locator('body')).toBeVisible();
    });
  });

  // ==========================================
  // MISSING IMAGES
  // ==========================================
  test.describe('Missing Images', () => {
    test('handles album with null thumbnail', async ({ page }) => {
      await setupScenario(page, scenarios.missingImages);
      await page.goto('/media');

      await expect(page.locator('body')).toBeVisible();
    });

    test('handles album with empty imageUrls', async ({ page }) => {
      await setupScenario(page, {
        photoAlbums: [
          photoAlbum({
            imageUrls: [],
          }),
        ],
      });
      await page.goto('/media');

      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);
    });

    test('handles album with null values in imageUrls array', async ({ page }) => {
      await setupScenario(page, {
        photoAlbums: [
          photoAlbum({
            imageUrls: [null, undefined, '', '/assets/valid.jpg'],
          }),
        ],
      });
      await page.goto('/media');

      await expect(page.locator('body')).toBeVisible();
    });
  });

  // ==========================================
  // SPECIAL CHARACTERS / XSS
  // ==========================================
  test.describe('Special Characters & XSS', () => {
    test('escapes HTML in album title', async ({ page }) => {
      await setupScenario(page, scenarios.specialChars);
      await page.goto('/media');

      const xssCheck = await checkForXSS(page);
      expect(xssCheck.hasSuspiciousScripts).toBe(false);
    });

    test('escapes HTML in photographer name', async ({ page }) => {
      await setupScenario(page, {
        photoAlbums: [
          photoAlbum({
            photographer: '<script>alert("xss")</script>',
          }),
        ],
      });
      await page.goto('/media');

      const xssCheck = await checkForXSS(page);
      expect(xssCheck.hasSuspiciousScripts).toBe(false);
    });

    test.skip('displays Polish characters correctly - CMS MODE ONLY', async ({ page }) => {
      // This test requires VITE_USE_SANITY=true to work, as it mocks Sanity API responses
      await setupScenario(page, {
        photoAlbums: [
          photoAlbum({
            titlePl: 'Żółć gęślą jaźń',
            photographer: 'Łukasz Żółkiewski',
          }),
        ],
      });
      await page.goto('/media');

      await expect(page.locator('body')).toContainText('Żółć');
    });
  });

  // ==========================================
  // LANGUAGE FALLBACK
  // ==========================================
  test.describe('Language Fallback', () => {
    test('handles albums with missing EN titles', async ({ page }) => {
      await setupScenario(page, scenarios.mixedLanguage);
      await page.goto('/media');

      const langButton = page.locator('text=ENG').first();
      if (await langButton.isVisible()) {
        await langButton.click();
        await page.waitForTimeout(500);
      }

      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);
    });
  });

  // ==========================================
  // API ERRORS
  // ==========================================
  test.describe('API Error Handling', () => {
    test('handles 500 error on photos page', async ({ page }) => {
      await mockSanityError(page, 500);
      await page.goto('/media');

      await expect(page.locator('body')).toBeVisible();
    });

    test('handles 500 error on videos page', async ({ page }) => {
      await mockSanityError(page, 500);
      await page.goto('/media/wideo');

      await expect(page.locator('body')).toBeVisible();
    });
  });

  // ==========================================
  // MOBILE VIEWPORT
  // ==========================================
  test.describe('Mobile - Edge Cases', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('long album titles fit on mobile', async ({ page }) => {
      await setupScenario(page, scenarios.extremeLength);
      await page.goto('/media');

      const hasOverflow = await hasHorizontalScroll(page);
      expect(hasOverflow).toBe(false);
    });

    test('many albums work on mobile', async ({ page }) => {
      await setupScenario(page, scenarios.massiveCount);
      await page.goto('/media');

      await expect(page.locator('body')).toBeVisible();
      const hasOverflow = await hasHorizontalScroll(page);
      expect(hasOverflow).toBe(false);
    });

    test('videos page works on mobile', async ({ page }) => {
      await setupScenario(page, scenarios.massiveCount);
      await page.goto('/media/wideo');

      await expect(page.locator('body')).toBeVisible();
      const hasOverflow = await hasHorizontalScroll(page);
      expect(hasOverflow).toBe(false);
    });
  });
});
