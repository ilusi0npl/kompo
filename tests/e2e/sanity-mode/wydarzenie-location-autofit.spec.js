// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test: Long location names should auto-fit on a single line by shrinking font size.
 * Feature: Location text dynamically shrinks to prevent line wrapping.
 *
 * Verification: We check that the element height is approximately one line
 * (fontSize * lineHeight). If text wraps, the height will be a multiple of that.
 */

// Event with long location: "Aula ASP  im. E. Gepperta we Wrocławiu"
const LONG_LOCATION_EVENT_ID = 'VE6hR9TiWS4BEmHxKILk5B';
const LONG_LOCATION_URL = `/wydarzenie/${LONG_LOCATION_EVENT_ID}`;

// Event with short location: "Centrum Sztuki WRO" (short enough for both desktop and mobile uppercase)
const SHORT_LOCATION_EVENT_ID = '568e8fea-f33d-4815-90aa-61555fb5a553';
const SHORT_LOCATION_URL = `/wydarzenie/${SHORT_LOCATION_EVENT_ID}`;

/**
 * Measures whether a location element renders on a single line.
 * Returns { height, singleLineHeight, fontSize, isSingleLine }
 */
async function measureLocationLine(locationEl) {
  return locationEl.evaluate((el) => {
    const style = window.getComputedStyle(el);
    const fontSize = parseFloat(style.fontSize);
    const lineHeightRaw = parseFloat(style.lineHeight);
    // lineHeight can be a number (multiplier) or px value
    const lineHeight = isNaN(lineHeightRaw) ? fontSize * 1.5 : lineHeightRaw;
    const height = el.getBoundingClientRect().height;
    return {
      height,
      singleLineHeight: lineHeight,
      fontSize,
      // Single line if height does not exceed ~1.3x one line
      isSingleLine: height <= lineHeight * 1.3,
    };
  });
}

test.describe('Event location auto-fit font size', () => {
  test('desktop: long location fits on a single line', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(LONG_LOCATION_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const pinIcon = page.locator('img[alt="Location"]');
    await expect(pinIcon).toBeVisible({ timeout: 10000 });

    const locationEl = pinIcon.locator('..').locator('p');
    await expect(locationEl).toBeVisible();

    const metrics = await measureLocationLine(locationEl);
    expect(metrics.isSingleLine).toBe(true);
  });

  test('desktop: short location keeps original 32px font size', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(SHORT_LOCATION_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const pinIcon = page.locator('img[alt="Location"]');
    await expect(pinIcon).toBeVisible({ timeout: 10000 });

    const locationEl = pinIcon.locator('..').locator('p');
    await expect(locationEl).toBeVisible();

    const fontSize = await locationEl.evaluate(
      (el) => parseFloat(window.getComputedStyle(el).fontSize)
    );
    expect(fontSize).toBe(32);
  });

  test('mobile: long location fits on a single line', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(LONG_LOCATION_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const pinIcon = page.locator('img[alt="Location"]');
    await expect(pinIcon).toBeVisible({ timeout: 10000 });

    const locationEl = pinIcon.locator('..').locator('..').locator('p');
    await expect(locationEl).toBeVisible();

    const metrics = await measureLocationLine(locationEl);
    expect(metrics.isSingleLine).toBe(true);
  });

  test('mobile: short location keeps original 24px font size', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(SHORT_LOCATION_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const pinIcon = page.locator('img[alt="Location"]');
    await expect(pinIcon).toBeVisible({ timeout: 10000 });

    const locationEl = pinIcon.locator('..').locator('..').locator('p');
    await expect(locationEl).toBeVisible();

    const fontSize = await locationEl.evaluate(
      (el) => parseFloat(window.getComputedStyle(el).fontSize)
    );
    expect(fontSize).toBe(24);
  });
});
