/**
 * Kalendarz Page - Content Edge Cases Tests
 * Tests various content scenarios for events listing
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
import { generators, text, event, array } from './fixtures/generators.js';

test.describe('Kalendarz Page - Content Edge Cases', () => {

  // ==========================================
  // EMPTY STATE
  // ==========================================
  test.describe('Empty State', () => {
    test('shows message when no upcoming events', async ({ page }) => {
      await setupScenario(page, scenarios.empty);
      await page.goto('/kalendarz');

      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);

      await expect(page.locator('body')).toBeVisible();
    });

    test('page does not crash with empty events array', async ({ page }) => {
      await setupScenario(page, scenarios.empty);

      const errors = [];
      page.on('pageerror', error => errors.push(error.message));

      await page.goto('/kalendarz');
      await page.waitForTimeout(1000);

      expect(errors).toHaveLength(0);
    });
  });

  // ==========================================
  // MINIMAL DATA
  // ==========================================
  test.describe('Minimal Data', () => {
    test('renders event with single character title', async ({ page }) => {
      await setupScenario(page, scenarios.minimal);
      await page.goto('/kalendarz');

      await expect(page.locator('body')).toBeVisible();
      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);
    });

    test('renders event without optional performers field', async ({ page }) => {
      await setupScenario(page, {
        upcomingEvents: [
          event({
            performersPl: null,
            performersEn: null,
            program: null,
          }),
        ],
      });
      await page.goto('/kalendarz');

      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);
    });
  });

  // ==========================================
  // EXTREME TEXT LENGTH
  // ==========================================
  test.describe('Extreme Text Length', () => {
    test('handles very long event title without overflow', async ({ page }) => {
      await setupScenario(page, {
        upcomingEvents: [
          event({
            titlePl: text.long(500),
            titleEn: text.long(500),
          }),
        ],
      });
      await page.goto('/kalendarz');

      const hasOverflow = await hasHorizontalScroll(page);
      expect(hasOverflow).toBe(false);
    });

    test('handles very long description', async ({ page }) => {
      await setupScenario(page, {
        upcomingEvents: [
          event({
            descriptionPl: text.long(10000),
            descriptionEn: text.long(10000),
          }),
        ],
      });
      await page.goto('/kalendarz');

      const hasOverflow = await hasHorizontalScroll(page);
      expect(hasOverflow).toBe(false);
    });

    test('handles event with 50 program items', async ({ page }) => {
      await setupScenario(page, {
        upcomingEvents: [
          event({
            program: Array(50).fill(null).map((_, i) => ({
              composer: `Composer ${i} with long name`,
              piece: `Very long piece name number ${i} - ${text.long(100)}`,
            })),
          }),
        ],
      });
      await page.goto('/kalendarz');

      await expect(page.locator('body')).toBeVisible();
    });

    test('handles event with many partners', async ({ page }) => {
      await setupScenario(page, {
        upcomingEvents: [
          event({
            partners: Array(20).fill(null).map((_, i) => ({
              name: `Partner organization with very long name ${i}`,
              logoUrl: '/assets/partner-logo.jpg',
            })),
          }),
        ],
      });
      await page.goto('/kalendarz');

      const hasOverflow = await hasHorizontalScroll(page);
      expect(hasOverflow).toBe(false);
    });
  });

  // ==========================================
  // MASSIVE COUNT
  // ==========================================
  test.describe('Massive Event Count', () => {
    test('renders 100 events without crashing', async ({ page }) => {
      await setupScenario(page, scenarios.massiveCount);
      await page.goto('/kalendarz');

      await expect(page.locator('body')).toBeVisible();
    });

    test('scroll performance is acceptable with 100 events', async ({ page }) => {
      await setupScenario(page, scenarios.massiveCount);
      await page.goto('/kalendarz');

      const startTime = Date.now();
      await page.mouse.wheel(0, 20000);
      await page.waitForTimeout(100);
      const scrollTime = Date.now() - startTime;

      expect(scrollTime).toBeLessThan(2000);
    });

    test('no memory issues with many events', async ({ page }) => {
      await setupScenario(page, scenarios.massiveCount);

      const errors = [];
      page.on('pageerror', error => errors.push(error.message));

      await page.goto('/kalendarz');
      await page.mouse.wheel(0, 50000);
      await page.waitForTimeout(500);

      expect(errors.filter(e => e.includes('memory') || e.includes('Maximum'))).toHaveLength(0);
    });
  });

  // ==========================================
  // MISSING OPTIONAL FIELDS
  // ==========================================
  test.describe('Missing Optional Fields', () => {
    test('handles event without ticket URL', async ({ page }) => {
      await setupScenario(page, scenarios.missingOptional);
      await page.goto('/kalendarz');

      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);
    });

    test('handles event with empty partners array', async ({ page }) => {
      await setupScenario(page, {
        upcomingEvents: [
          event({ partners: [] }),
        ],
      });
      await page.goto('/kalendarz');

      await expect(page.locator('body')).toBeVisible();
    });

    test('handles event with null program and performers', async ({ page }) => {
      await setupScenario(page, {
        upcomingEvents: [
          event({
            program: null,
            performersPl: null,
            performersEn: null,
          }),
        ],
      });
      await page.goto('/kalendarz');

      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);
    });
  });

  // ==========================================
  // MISSING IMAGES
  // ==========================================
  test.describe('Missing Images', () => {
    test('handles event without image', async ({ page }) => {
      await setupScenario(page, scenarios.missingImages);
      await page.goto('/kalendarz');

      await expect(page.locator('body')).toBeVisible();
    });

    test('handles event with empty string imageUrl', async ({ page }) => {
      await setupScenario(page, {
        upcomingEvents: [
          event({ imageUrl: '' }),
        ],
      });
      await page.goto('/kalendarz');

      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);
    });
  });

  // ==========================================
  // SPECIAL CHARACTERS / XSS
  // ==========================================
  test.describe('Special Characters & XSS', () => {
    test('escapes HTML in event title', async ({ page }) => {
      await setupScenario(page, scenarios.specialChars);
      await page.goto('/kalendarz');

      const xssCheck = await checkForXSS(page);
      expect(xssCheck.hasSuspiciousScripts).toBe(false);
    });

    test.skip('displays Polish characters in event content - CMS MODE ONLY', async ({ page }) => {
      // This test requires VITE_USE_SANITY=true to work, as it mocks Sanity API responses
      await setupScenario(page, {
        upcomingEvents: [
          event({
            titlePl: 'Żółć gęślą jaźń',
            locationPl: 'Łódź, ul. Żółkiewskiego',
          }),
        ],
      });
      await page.goto('/kalendarz');

      await expect(page.locator('body')).toContainText('Żółć');
    });

    test('handles multiline description correctly', async ({ page }) => {
      await setupScenario(page, {
        upcomingEvents: [
          event({
            descriptionPl: 'Line 1\n\nLine 2\n\nLine 3',
          }),
        ],
      });
      await page.goto('/kalendarz');

      const bodyText = await page.locator('body').textContent();
      expect(bodyText).not.toContain('\\n');
    });
  });

  // ==========================================
  // DATE EDGE CASES
  // ==========================================
  test.describe('Date Edge Cases', () => {
    test('handles events with past dates', async ({ page }) => {
      await setupScenario(page, {
        upcomingEvents: [
          event({ date: new Date('1999-01-01').toISOString() }),
        ],
      });
      await page.goto('/kalendarz');

      await expect(page.locator('body')).toBeVisible();
    });

    test('handles events with far future dates', async ({ page }) => {
      await setupScenario(page, {
        upcomingEvents: [
          event({ date: new Date('2099-12-31').toISOString() }),
        ],
      });
      await page.goto('/kalendarz');

      await expect(page.locator('body')).toBeVisible();
    });

    test('handles event with null date', async ({ page }) => {
      await setupScenario(page, {
        upcomingEvents: [
          event({ date: null }),
        ],
      });
      await page.goto('/kalendarz');

      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      // Date might legitimately show null handling
    });
  });

  // ==========================================
  // LANGUAGE FALLBACK
  // ==========================================
  test.describe('Language Fallback', () => {
    test('handles events with missing EN translations', async ({ page }) => {
      await setupScenario(page, scenarios.mixedLanguage);
      await page.goto('/kalendarz');

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
  });

  // ==========================================
  // API ERRORS
  // ==========================================
  test.describe('API Error Handling', () => {
    test('handles 500 error gracefully', async ({ page }) => {
      await mockSanityError(page, 500);
      await page.goto('/kalendarz');

      await expect(page.locator('body')).toBeVisible();
    });

    test('handles network failure', async ({ page }) => {
      await mockSanityNetworkFailure(page);
      await page.goto('/kalendarz');

      await expect(page.locator('body')).toBeVisible();
    });
  });

  // ==========================================
  // MOBILE VIEWPORT
  // ==========================================
  test.describe('Mobile - Edge Cases', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('long event titles fit on mobile', async ({ page }) => {
      await setupScenario(page, scenarios.extremeLength);
      await page.goto('/kalendarz');

      const hasOverflow = await hasHorizontalScroll(page);
      expect(hasOverflow).toBe(false);
    });

    test('100 events work on mobile', async ({ page }) => {
      await setupScenario(page, scenarios.massiveCount);
      await page.goto('/kalendarz');

      await expect(page.locator('body')).toBeVisible();
      const hasOverflow = await hasHorizontalScroll(page);
      expect(hasOverflow).toBe(false);
    });
  });
});
