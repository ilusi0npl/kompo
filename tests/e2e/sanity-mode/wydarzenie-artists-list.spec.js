// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test: Artists with newlines in Sanity should render as separate lines, not inline.
 * Bug: performers entered on separate lines appear concatenated in a single row.
 */

const EVENT_ID = '794bdc68-5956-46af-8117-e53fac50db15';
const EVENT_URL = `/wydarzenie/${EVENT_ID}`;

test.describe('Event page artists displayed as list', () => {
  test('should render each artist on a separate line (desktop)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(EVENT_URL, { waitUntil: 'networkidle' });

    // Find the artists section
    const artistsLabel = page.locator('text=ARTYŚCI').first();
    await expect(artistsLabel).toBeVisible({ timeout: 10000 });

    // The artists text container should preserve newlines (whiteSpace: pre-wrap or rendered as list)
    // Get the element that contains artist names
    const artistsContainer = page.locator('text=Ensemble Kompopolex').first();
    await expect(artistsContainer).toBeVisible({ timeout: 5000 });

    // All artists should NOT appear in a single run of text
    const artistsText = await artistsContainer.innerText();

    // If performers are on separate lines, innerText will contain newline characters
    expect(artistsText).toContain('\n');
  });

  test('should render each artist on a separate line (mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(EVENT_URL, { waitUntil: 'networkidle' });

    const artistsLabel = page.locator('text=ARTYŚCI').first();
    await expect(artistsLabel).toBeVisible({ timeout: 10000 });

    const artistsContainer = page.locator('text=Ensemble Kompopolex').first();
    await expect(artistsContainer).toBeVisible({ timeout: 5000 });

    const artistsText = await artistsContainer.innerText();
    expect(artistsText).toContain('\n');
  });
});
