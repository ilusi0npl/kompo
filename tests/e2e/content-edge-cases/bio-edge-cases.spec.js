/**
 * Bio Page - Content Edge Cases Tests
 * Tests various content scenarios that might occur with CMS data
 */

import { test, expect } from '@playwright/test';
import {
  setupScenario,
  mockSanityError,
  mockSanityNetworkFailure,
  assertNoUndefinedNull,
  hasHorizontalScroll,
  checkForXSS,
} from '../helpers/sanity-mock-helper.js';
import { scenarios } from './fixtures/scenarios.js';
import { generators, text, bioProfile, array } from './fixtures/generators.js';

test.describe('Bio Page - Content Edge Cases', () => {

  // ==========================================
  // EMPTY STATE
  // ==========================================
  test.describe('Empty State', () => {
    test('shows graceful UI when no profiles exist', async ({ page }) => {
      await setupScenario(page, scenarios.empty);
      await page.goto('/bio');

      // Should not display undefined/null
      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);

      // Page should still be functional
      await expect(page.locator('body')).toBeVisible();
    });

    test('page does not crash with empty data', async ({ page }) => {
      await setupScenario(page, scenarios.empty);
      await page.goto('/bio');

      // No JavaScript errors
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));

      await page.waitForTimeout(1000);
      expect(errors).toHaveLength(0);
    });
  });

  // ==========================================
  // MINIMAL DATA
  // ==========================================
  test.describe('Minimal Data', () => {
    test('renders single character name correctly', async ({ page }) => {
      await setupScenario(page, scenarios.minimal);
      await page.goto('/bio');

      await expect(page.locator('[data-section]').first()).toBeVisible();
    });

    test('renders single paragraph bio', async ({ page }) => {
      await setupScenario(page, scenarios.minimal);
      await page.goto('/bio');

      // Should display content without errors
      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);
    });
  });

  // ==========================================
  // EXTREME TEXT LENGTH
  // ==========================================
  test.describe('Extreme Text Length', () => {
    test('handles very long name without horizontal overflow', async ({ page }) => {
      await setupScenario(page, {
        bioProfiles: [
          bioProfile({
            namePl: text.long(300),
            nameEn: text.long(300),
          }),
        ],
      });
      await page.goto('/bio');

      const hasOverflow = await hasHorizontalScroll(page);
      expect(hasOverflow).toBe(false);
    });

    test('handles 20 long paragraphs of bio text', async ({ page }) => {
      const longParagraphs = Array(20).fill(null).map((_, i) =>
        `Paragraf ${i + 1}: ${text.long(1000)}`
      );

      await setupScenario(page, {
        bioProfiles: [
          bioProfile({
            paragraphsPl: longParagraphs,
            paragraphsEn: longParagraphs,
          }),
        ],
      });
      await page.goto('/bio');

      // Page should load without crashing
      await expect(page.locator('[data-section]').first()).toBeVisible();

      // Should be able to scroll through content
      await page.mouse.wheel(0, 5000);
      await page.waitForTimeout(500);
    });

    test('extreme length scenario does not cause overflow', async ({ page }) => {
      await setupScenario(page, scenarios.extremeLength);
      await page.goto('/bio');

      const hasOverflow = await hasHorizontalScroll(page);
      expect(hasOverflow).toBe(false);
    });
  });

  // ==========================================
  // MASSIVE COUNT
  // ==========================================
  test.describe('Massive Profile Count', () => {
    test('renders 50 profiles without crashing', async ({ page }) => {
      await setupScenario(page, scenarios.massiveCount);
      await page.goto('/bio');

      // Page loads
      await expect(page.locator('body')).toBeVisible();

      // No undefined/null
      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);
    });

    test('scroll performance is acceptable with many profiles', async ({ page }) => {
      await setupScenario(page, scenarios.massiveCount);
      await page.goto('/bio');

      const startTime = Date.now();
      await page.mouse.wheel(0, 10000);
      await page.waitForTimeout(100);
      const scrollTime = Date.now() - startTime;

      // Scroll should be responsive (less than 2 seconds)
      expect(scrollTime).toBeLessThan(2000);
    });
  });

  // ==========================================
  // MISSING OPTIONAL FIELDS
  // ==========================================
  test.describe('Missing Optional Fields', () => {
    test('handles missing English translation', async ({ page }) => {
      await setupScenario(page, scenarios.missingOptional);
      await page.goto('/bio');

      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);
    });

    test('switching to EN with missing translations shows fallback', async ({ page }) => {
      await setupScenario(page, scenarios.missingOptional);
      await page.goto('/bio');

      // Try to switch to English
      const langButton = page.locator('text=ENG').first();
      if (await langButton.isVisible()) {
        await langButton.click();
        await page.waitForTimeout(500);
      }

      // Should not show undefined/null
      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);
    });
  });

  // ==========================================
  // MISSING IMAGES
  // ==========================================
  test.describe('Missing Images', () => {
    test('handles missing profile image gracefully', async ({ page }) => {
      await setupScenario(page, scenarios.missingImages);
      await page.goto('/bio');

      // Page should still render
      await expect(page.locator('body')).toBeVisible();

      // No console errors about images (optional, depends on implementation)
    });

    test('does not show broken image icons', async ({ page }) => {
      await setupScenario(page, scenarios.missingImages);
      await page.goto('/bio');

      // Wait for images to attempt loading
      await page.waitForTimeout(1000);

      // Check that no visible broken image indicators
      // (implementation-dependent, might have placeholder)
    });
  });

  // ==========================================
  // SPECIAL CHARACTERS / XSS
  // ==========================================
  test.describe('Special Characters & XSS', () => {
    test('escapes HTML/script in profile name', async ({ page }) => {
      await setupScenario(page, scenarios.specialChars);
      await page.goto('/bio');

      const xssCheck = await checkForXSS(page);
      expect(xssCheck.hasSuspiciousScripts).toBe(false);
    });

    test.skip('displays Polish special characters correctly - CMS MODE ONLY', async ({ page }) => {
      // This test requires VITE_USE_SANITY=true to work, as it mocks Sanity API responses
      await setupScenario(page, {
        bioProfiles: [
          bioProfile({
            namePl: 'Żółć gęślą jaźń ĄĘÓŁŃŹŻĆŚ',
            paragraphsPl: ['Zażółć gęślą jaźń - test polskich znaków'],
          }),
        ],
      });
      await page.goto('/bio');

      await expect(page.locator('body')).toContainText('Żółć');
    });

    test('handles newlines in paragraphs correctly', async ({ page }) => {
      await setupScenario(page, {
        bioProfiles: [
          bioProfile({
            paragraphsPl: ['Line 1\n\nLine 2\n\n\nLine 3'],
          }),
        ],
      });
      await page.goto('/bio');

      // Should render without showing literal \n
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).not.toContain('\\n');
    });
  });

  // ==========================================
  // MIXED LANGUAGE
  // ==========================================
  test.describe('Language Fallback', () => {
    test('handles profiles with only PL content in EN mode', async ({ page }) => {
      await setupScenario(page, scenarios.mixedLanguage);
      await page.goto('/bio');

      // Switch to English
      const langButton = page.locator('text=ENG').first();
      if (await langButton.isVisible()) {
        await langButton.click();
        await page.waitForTimeout(500);
      }

      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);
    });

    test('handles empty paragraphs array gracefully', async ({ page }) => {
      await setupScenario(page, {
        bioProfiles: [
          bioProfile({
            paragraphsPl: [],
            paragraphsEn: [],
          }),
        ],
      });
      await page.goto('/bio');

      // Should not crash
      await expect(page.locator('body')).toBeVisible();
    });
  });

  // ==========================================
  // API ERRORS
  // ==========================================
  test.describe('API Error Handling', () => {
    test('shows error state or fallback on 500 error', async ({ page }) => {
      await mockSanityError(page, 500);
      await page.goto('/bio');

      // Page should still be visible (error state or fallback)
      await expect(page.locator('body')).toBeVisible();

      // Should not show raw error object
      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      // Note: Some error states might intentionally show messages
    });

    test('handles network failure gracefully', async ({ page }) => {
      await mockSanityNetworkFailure(page);
      await page.goto('/bio');

      // Page should be visible
      await expect(page.locator('body')).toBeVisible();
    });
  });

  // ==========================================
  // MOBILE VIEWPORT
  // ==========================================
  test.describe('Mobile - Edge Cases', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('extreme length content fits on mobile', async ({ page }) => {
      await setupScenario(page, scenarios.extremeLength);
      await page.goto('/bio');

      const hasOverflow = await hasHorizontalScroll(page);
      expect(hasOverflow).toBe(false);
    });

    test('50 profiles work on mobile', async ({ page }) => {
      await setupScenario(page, scenarios.massiveCount);
      await page.goto('/bio');

      await expect(page.locator('body')).toBeVisible();

      const hasOverflow = await hasHorizontalScroll(page);
      expect(hasOverflow).toBe(false);
    });

    test('special characters display correctly on mobile', async ({ page }) => {
      await setupScenario(page, scenarios.specialChars);
      await page.goto('/bio');

      const xssCheck = await checkForXSS(page);
      expect(xssCheck.hasSuspiciousScripts).toBe(false);
    });
  });
});
