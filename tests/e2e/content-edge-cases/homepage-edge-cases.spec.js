/**
 * Homepage - Content Edge Cases Tests
 * Tests various content scenarios for homepage slideshow
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
import { generators, text, slide, array } from './fixtures/generators.js';

test.describe('Homepage - Content Edge Cases', () => {

  // ==========================================
  // EMPTY STATE
  // ==========================================
  test.describe('Empty State', () => {
    test('shows graceful UI when no slides exist', async ({ page }) => {
      await setupScenario(page, scenarios.empty);
      await page.goto('/');

      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);

      await expect(page.locator('body')).toBeVisible();
    });

    test('page does not crash with empty slides array', async ({ page }) => {
      await setupScenario(page, scenarios.empty);

      const errors = [];
      page.on('pageerror', error => errors.push(error.message));

      await page.goto('/');
      await page.waitForTimeout(1000);

      expect(errors).toHaveLength(0);
    });
  });

  // ==========================================
  // MINIMAL DATA
  // ==========================================
  test.describe('Minimal Data', () => {
    test('renders single slide correctly', async ({ page }) => {
      await setupScenario(page, scenarios.minimal);
      await page.goto('/');

      await expect(page.locator('body')).toBeVisible();
      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);
    });

    test('renders slide with single character word', async ({ page }) => {
      await setupScenario(page, {
        slides: [
          slide({
            wordPl: 'K',
            wordEn: 'K',
            taglinePl: 'T',
            taglineEn: 'T',
          }),
        ],
      });
      await page.goto('/');

      await expect(page.locator('body')).toBeVisible();
    });
  });

  // ==========================================
  // EXTREME TEXT LENGTH
  // ==========================================
  test.describe('Extreme Text Length', () => {
    test('handles very long word without overflow', async ({ page }) => {
      await setupScenario(page, {
        slides: [
          slide({
            wordPl: text.long(100),
            wordEn: text.long(100),
          }),
        ],
      });
      await page.goto('/');

      const hasOverflow = await hasHorizontalScroll(page);
      expect(hasOverflow).toBe(false);
    });

    test('handles very long tagline', async ({ page }) => {
      await setupScenario(page, {
        slides: [
          slide({
            taglinePl: text.long(500),
            taglineEn: text.long(500),
          }),
        ],
      });
      await page.goto('/');

      const hasOverflow = await hasHorizontalScroll(page);
      expect(hasOverflow).toBe(false);
    });

    test('extreme length scenario loads correctly', async ({ page }) => {
      await setupScenario(page, scenarios.extremeLength);
      await page.goto('/');

      await expect(page.locator('body')).toBeVisible();
      const hasOverflow = await hasHorizontalScroll(page);
      expect(hasOverflow).toBe(false);
    });
  });

  // ==========================================
  // MASSIVE COUNT
  // ==========================================
  test.describe('Massive Slide Count', () => {
    test('renders 30 slides without crashing', async ({ page }) => {
      await setupScenario(page, scenarios.massiveCount);
      await page.goto('/');

      await expect(page.locator('body')).toBeVisible();
    });

    test('slideshow transitions work with many slides', async ({ page }) => {
      await setupScenario(page, {
        slides: array(slide, 10),
      });
      await page.goto('/');

      // Wait for potential slideshow transition
      await page.waitForTimeout(3000);

      // Page should still be functional
      await expect(page.locator('body')).toBeVisible();
    });

    test('no memory issues with many slides', async ({ page }) => {
      await setupScenario(page, scenarios.massiveCount);

      const errors = [];
      page.on('pageerror', error => errors.push(error.message));

      await page.goto('/');
      await page.waitForTimeout(5000); // Let slideshow run

      expect(errors.filter(e => e.includes('memory'))).toHaveLength(0);
    });
  });

  // ==========================================
  // MISSING OPTIONAL FIELDS
  // ==========================================
  test.describe('Missing Optional Fields', () => {
    test('handles slide without tagline', async ({ page }) => {
      await setupScenario(page, {
        slides: [
          slide({
            taglinePl: null,
            taglineEn: null,
          }),
        ],
      });
      await page.goto('/');

      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);
    });

    test('handles slide with empty string tagline', async ({ page }) => {
      await setupScenario(page, {
        slides: [
          slide({
            taglinePl: '',
            taglineEn: '',
          }),
        ],
      });
      await page.goto('/');

      await expect(page.locator('body')).toBeVisible();
    });
  });

  // ==========================================
  // MISSING IMAGES
  // ==========================================
  test.describe('Missing Images', () => {
    test('handles slide without image', async ({ page }) => {
      await setupScenario(page, scenarios.missingImages);
      await page.goto('/');

      await expect(page.locator('body')).toBeVisible();
    });

    test('handles slide with null imageUrl', async ({ page }) => {
      await setupScenario(page, {
        slides: [
          slide({ imageUrl: null }),
        ],
      });
      await page.goto('/');

      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);
    });

    test('handles slide with empty string imageUrl', async ({ page }) => {
      await setupScenario(page, {
        slides: [
          slide({ imageUrl: '' }),
        ],
      });
      await page.goto('/');

      await expect(page.locator('body')).toBeVisible();
    });
  });

  // ==========================================
  // SPECIAL CHARACTERS / XSS
  // ==========================================
  test.describe('Special Characters & XSS', () => {
    test('escapes HTML in word', async ({ page }) => {
      await setupScenario(page, scenarios.specialChars);
      await page.goto('/');

      const xssCheck = await checkForXSS(page);
      expect(xssCheck.hasSuspiciousScripts).toBe(false);
    });

    test('escapes HTML in tagline', async ({ page }) => {
      await setupScenario(page, {
        slides: [
          slide({
            taglinePl: '<script>alert("xss")</script>',
            taglineEn: '<img src=x onerror=alert(1)>',
          }),
        ],
      });
      await page.goto('/');

      const xssCheck = await checkForXSS(page);
      expect(xssCheck.hasSuspiciousScripts).toBe(false);
    });

    test.skip('displays Polish characters correctly - CMS MODE ONLY', async ({ page }) => {
      // This test requires VITE_USE_SANITY=true to work, as it mocks Sanity API responses
      await setupScenario(page, {
        slides: [
          slide({
            wordPl: 'Żółć',
            taglinePl: 'Zażółć gęślą jaźń',
          }),
        ],
      });
      await page.goto('/');

      await expect(page.locator('body')).toContainText('Żółć');
    });
  });

  // ==========================================
  // LANGUAGE FALLBACK
  // ==========================================
  test.describe('Language Fallback', () => {
    test('handles slides with missing EN translations', async ({ page }) => {
      await setupScenario(page, scenarios.mixedLanguage);
      await page.goto('/');

      const langButton = page.locator('text=ENG').first();
      if (await langButton.isVisible()) {
        await langButton.click();
        await page.waitForTimeout(500);
      }

      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);
    });

    test('handles slide with empty EN word', async ({ page }) => {
      await setupScenario(page, {
        slides: [
          slide({
            wordPl: 'Trio',
            wordEn: '',
          }),
        ],
      });
      await page.goto('/');

      const langButton = page.locator('text=ENG').first();
      if (await langButton.isVisible()) {
        await langButton.click();
        await page.waitForTimeout(500);
      }

      await expect(page.locator('body')).toBeVisible();
    });
  });

  // ==========================================
  // API ERRORS
  // ==========================================
  test.describe('API Error Handling', () => {
    test('handles 500 error gracefully', async ({ page }) => {
      await mockSanityError(page, 500);
      await page.goto('/');

      await expect(page.locator('body')).toBeVisible();
    });

    test('handles 404 error', async ({ page }) => {
      await mockSanityError(page, 404);
      await page.goto('/');

      await expect(page.locator('body')).toBeVisible();
    });
  });

  // ==========================================
  // MOBILE VIEWPORT
  // ==========================================
  test.describe('Mobile - Edge Cases', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('long word fits on mobile', async ({ page }) => {
      await setupScenario(page, scenarios.extremeLength);
      await page.goto('/');

      const hasOverflow = await hasHorizontalScroll(page);
      expect(hasOverflow).toBe(false);
    });

    test('slideshow works on mobile', async ({ page }) => {
      await setupScenario(page, {
        slides: array(slide, 5),
      });
      await page.goto('/');

      await page.waitForTimeout(3000);
      await expect(page.locator('body')).toBeVisible();
    });

    test('special characters display correctly on mobile', async ({ page }) => {
      await setupScenario(page, scenarios.specialChars);
      await page.goto('/');

      const xssCheck = await checkForXSS(page);
      expect(xssCheck.hasSuspiciousScripts).toBe(false);
    });
  });
});
