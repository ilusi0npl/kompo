/**
 * Wydarzenie (Event Detail) Page - Content Edge Cases Tests
 * Tests various content scenarios for single event view
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
import { generators, text, event } from './fixtures/generators.js';

test.describe('Wydarzenie (Event Detail) Page - Content Edge Cases', () => {

  // Helper to create scenario with specific event
  const eventScenario = (eventData) => ({
    events: [eventData],
    upcomingEvents: [eventData],
  });

  // ==========================================
  // EMPTY/MISSING EVENT
  // ==========================================
  test.describe('Missing Event', () => {
    test('handles non-existent event ID gracefully', async ({ page }) => {
      await setupScenario(page, scenarios.empty);
      await page.goto('/wydarzenie/non-existent-id');

      // Should show error state or redirect, not crash
      await expect(page.locator('body')).toBeVisible();
    });

    test('page does not crash when event not found', async ({ page }) => {
      await setupScenario(page, scenarios.empty);

      const errors = [];
      page.on('pageerror', error => errors.push(error.message));

      await page.goto('/wydarzenie/missing-event');
      await page.waitForTimeout(1000);

      // No critical errors
      expect(errors.filter(e => !e.includes('404'))).toHaveLength(0);
    });
  });

  // ==========================================
  // MINIMAL DATA
  // ==========================================
  test.describe('Minimal Data', () => {
    test('renders event with minimal required fields', async ({ page }) => {
      await setupScenario(page, eventScenario(
        event({
          _id: 'minimal-event',
          titlePl: 'A',
          titleEn: 'A',
          descriptionPl: 'B',
          descriptionEn: 'B',
          locationPl: 'C',
          locationEn: 'C',
          performersPl: null,
          performersEn: null,
          program: null,
          partners: [],
          ticketUrl: null,
        })
      ));
      await page.goto('/wydarzenie/minimal-event');

      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);
    });
  });

  // ==========================================
  // EXTREME TEXT LENGTH
  // ==========================================
  test.describe('Extreme Text Length', () => {
    test('handles very long title without overflow', async ({ page }) => {
      await setupScenario(page, eventScenario(
        event({
          _id: 'long-title-event',
          titlePl: text.long(500),
          titleEn: text.long(500),
        })
      ));
      await page.goto('/wydarzenie/long-title-event');

      const hasOverflow = await hasHorizontalScroll(page);
      expect(hasOverflow).toBe(false);
    });

    test('handles very long description', async ({ page }) => {
      await setupScenario(page, eventScenario(
        event({
          _id: 'long-desc-event',
          descriptionPl: text.long(10000),
          descriptionEn: text.long(10000),
        })
      ));
      await page.goto('/wydarzenie/long-desc-event');

      const hasOverflow = await hasHorizontalScroll(page);
      expect(hasOverflow).toBe(false);
    });

    test('handles very long location', async ({ page }) => {
      await setupScenario(page, eventScenario(
        event({
          _id: 'long-location-event',
          locationPl: text.long(300),
          locationEn: text.long(300),
        })
      ));
      await page.goto('/wydarzenie/long-location-event');

      const hasOverflow = await hasHorizontalScroll(page);
      expect(hasOverflow).toBe(false);
    });

    test('handles very long performers list', async ({ page }) => {
      await setupScenario(page, eventScenario(
        event({
          _id: 'long-performers-event',
          performersPl: text.withNewlines(30),
          performersEn: text.withNewlines(30),
        })
      ));
      await page.goto('/wydarzenie/long-performers-event');

      await expect(page.locator('body')).toBeVisible();
    });

    test('handles 50 program items', async ({ page }) => {
      await setupScenario(page, eventScenario(
        event({
          _id: 'many-program-event',
          program: Array(50).fill(null).map((_, i) => ({
            composer: `Composer ${i} - ${text.long(50)}`,
            piece: `Piece ${i} - ${text.long(100)}`,
          })),
        })
      ));
      await page.goto('/wydarzenie/many-program-event');

      await expect(page.locator('body')).toBeVisible();
      const hasOverflow = await hasHorizontalScroll(page);
      expect(hasOverflow).toBe(false);
    });

    test('handles many partners', async ({ page }) => {
      await setupScenario(page, eventScenario(
        event({
          _id: 'many-partners-event',
          partners: Array(20).fill(null).map((_, i) => ({
            name: `Partner Organization With Very Long Name ${i}`,
            logoUrl: '/assets/partner-logo.jpg',
          })),
        })
      ));
      await page.goto('/wydarzenie/many-partners-event');

      await expect(page.locator('body')).toBeVisible();
    });
  });

  // ==========================================
  // MISSING OPTIONAL FIELDS
  // ==========================================
  test.describe('Missing Optional Fields', () => {
    test('handles event without performers', async ({ page }) => {
      await setupScenario(page, eventScenario(
        event({
          _id: 'no-performers-event',
          performersPl: null,
          performersEn: null,
        })
      ));
      await page.goto('/wydarzenie/no-performers-event');

      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);
    });

    test('handles event without program', async ({ page }) => {
      await setupScenario(page, eventScenario(
        event({
          _id: 'no-program-event',
          program: null,
        })
      ));
      await page.goto('/wydarzenie/no-program-event');

      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);
    });

    test('handles event with empty program array', async ({ page }) => {
      await setupScenario(page, eventScenario(
        event({
          _id: 'empty-program-event',
          program: [],
        })
      ));
      await page.goto('/wydarzenie/empty-program-event');

      await expect(page.locator('body')).toBeVisible();
    });

    test('handles event without ticket URL', async ({ page }) => {
      await setupScenario(page, eventScenario(
        event({
          _id: 'no-ticket-event',
          ticketUrl: null,
          showTicketButton: false,
        })
      ));
      await page.goto('/wydarzenie/no-ticket-event');

      await expect(page.locator('body')).toBeVisible();
    });

    test('handles event without partners', async ({ page }) => {
      await setupScenario(page, eventScenario(
        event({
          _id: 'no-partners-event',
          partners: [],
        })
      ));
      await page.goto('/wydarzenie/no-partners-event');

      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);
    });
  });

  // ==========================================
  // MISSING IMAGES
  // ==========================================
  test.describe('Missing Images', () => {
    test('handles event without main image', async ({ page }) => {
      await setupScenario(page, eventScenario(
        event({
          _id: 'no-image-event',
          imageUrl: null,
        })
      ));
      await page.goto('/wydarzenie/no-image-event');

      await expect(page.locator('body')).toBeVisible();
    });

    test('handles event with empty imageUrl', async ({ page }) => {
      await setupScenario(page, eventScenario(
        event({
          _id: 'empty-image-event',
          imageUrl: '',
        })
      ));
      await page.goto('/wydarzenie/empty-image-event');

      const { hasUndefined, hasNull } = await assertNoUndefinedNull(page);
      expect(hasUndefined).toBe(false);
      expect(hasNull).toBe(false);
    });

    test('handles partners with missing logos', async ({ page }) => {
      await setupScenario(page, eventScenario(
        event({
          _id: 'no-logo-partners-event',
          partners: [
            { name: 'Partner 1', logoUrl: null },
            { name: 'Partner 2', logoUrl: '' },
          ],
        })
      ));
      await page.goto('/wydarzenie/no-logo-partners-event');

      await expect(page.locator('body')).toBeVisible();
    });
  });

  // ==========================================
  // SPECIAL CHARACTERS / XSS
  // ==========================================
  test.describe('Special Characters & XSS', () => {
    test('escapes HTML in title', async ({ page }) => {
      await setupScenario(page, eventScenario(
        event({
          _id: 'xss-title-event',
          titlePl: '<script>alert("xss")</script>',
          titleEn: '<img src=x onerror=alert(1)>',
        })
      ));
      await page.goto('/wydarzenie/xss-title-event');

      const xssCheck = await checkForXSS(page);
      expect(xssCheck.hasSuspiciousScripts).toBe(false);
    });

    test('escapes HTML in description', async ({ page }) => {
      await setupScenario(page, eventScenario(
        event({
          _id: 'xss-desc-event',
          descriptionPl: '<script>document.cookie</script>',
          descriptionEn: '<iframe src="evil.com"></iframe>',
        })
      ));
      await page.goto('/wydarzenie/xss-desc-event');

      const xssCheck = await checkForXSS(page);
      expect(xssCheck.hasSuspiciousScripts).toBe(false);
    });

    test.skip('displays Polish characters correctly - CMS MODE ONLY', async ({ page }) => {
      // This test requires VITE_USE_SANITY=true to work, as it mocks Sanity API responses
      await setupScenario(page, eventScenario(
        event({
          _id: 'polish-event',
          titlePl: 'Żółć gęślą jaźń',
          locationPl: 'Łódź, ul. Żółkiewskiego 15',
          descriptionPl: 'Zażółć gęślą jaźń ĄĘÓŁŃŹŻĆŚ',
        })
      ));
      await page.goto('/wydarzenie/polish-event');

      await expect(page.locator('body')).toContainText('Żółć');
    });

    test('handles multiline content correctly', async ({ page }) => {
      await setupScenario(page, eventScenario(
        event({
          _id: 'multiline-event',
          descriptionPl: 'Line 1\n\nLine 2\n\n\nLine 3',
          performersPl: 'Artist 1\nArtist 2\nArtist 3',
        })
      ));
      await page.goto('/wydarzenie/multiline-event');

      const bodyText = await page.locator('body').textContent();
      expect(bodyText).not.toContain('\\n');
    });
  });

  // ==========================================
  // DATE EDGE CASES
  // ==========================================
  test.describe('Date Edge Cases', () => {
    test('handles event with past date', async ({ page }) => {
      await setupScenario(page, eventScenario(
        event({
          _id: 'past-event',
          date: new Date('1999-01-01T20:00:00').toISOString(),
        })
      ));
      await page.goto('/wydarzenie/past-event');

      await expect(page.locator('body')).toBeVisible();
    });

    test('handles event with far future date', async ({ page }) => {
      await setupScenario(page, eventScenario(
        event({
          _id: 'future-event',
          date: new Date('2099-12-31T23:59:59').toISOString(),
        })
      ));
      await page.goto('/wydarzenie/future-event');

      await expect(page.locator('body')).toBeVisible();
    });

    test('handles event with null date', async ({ page }) => {
      await setupScenario(page, eventScenario(
        event({
          _id: 'no-date-event',
          date: null,
        })
      ));
      await page.goto('/wydarzenie/no-date-event');

      // Should handle gracefully, not show "Invalid Date"
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).not.toContain('Invalid Date');
    });
  });

  // ==========================================
  // LANGUAGE FALLBACK
  // ==========================================
  test.describe('Language Fallback', () => {
    test('handles event with missing EN translations', async ({ page }) => {
      await setupScenario(page, eventScenario(
        event({
          _id: 'pl-only-event',
          titleEn: null,
          descriptionEn: null,
          locationEn: null,
          performersEn: null,
        })
      ));
      await page.goto('/wydarzenie/pl-only-event');

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
      await page.goto('/wydarzenie/test-event');

      await expect(page.locator('body')).toBeVisible();
    });

    test('handles 404 for event not found', async ({ page }) => {
      await mockSanityError(page, 404);
      await page.goto('/wydarzenie/not-found-event');

      await expect(page.locator('body')).toBeVisible();
    });
  });

  // ==========================================
  // MOBILE VIEWPORT
  // ==========================================
  test.describe('Mobile - Edge Cases', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('long content fits on mobile', async ({ page }) => {
      await setupScenario(page, eventScenario(
        event({
          _id: 'mobile-long-event',
          titlePl: text.long(200),
          descriptionPl: text.long(5000),
        })
      ));
      await page.goto('/wydarzenie/mobile-long-event');

      const hasOverflow = await hasHorizontalScroll(page);
      expect(hasOverflow).toBe(false);
    });

    test('many program items fit on mobile', async ({ page }) => {
      await setupScenario(page, eventScenario(
        event({
          _id: 'mobile-program-event',
          program: Array(20).fill(null).map((_, i) => ({
            composer: `Composer ${i}`,
            piece: `Piece ${i}`,
          })),
        })
      ));
      await page.goto('/wydarzenie/mobile-program-event');

      await expect(page.locator('body')).toBeVisible();
      const hasOverflow = await hasHorizontalScroll(page);
      expect(hasOverflow).toBe(false);
    });

    test.skip('special characters display correctly on mobile - CMS MODE ONLY', async ({ page }) => {
      // This test requires VITE_USE_SANITY=true to work, as it mocks Sanity API responses
      await setupScenario(page, eventScenario(
        event({
          _id: 'mobile-polish-event',
          titlePl: 'Żółć gęślą jaźń',
        })
      ));
      await page.goto('/wydarzenie/mobile-polish-event');

      await expect(page.locator('body')).toContainText('Żółć');
    });
  });
});
