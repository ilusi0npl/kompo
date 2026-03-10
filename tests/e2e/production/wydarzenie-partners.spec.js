// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Bug fix test: Event page should NOT show hardcoded fallback partners
 * when the Sanity CMS partners field is empty.
 *
 * Bug: https://kompo-pi.vercel.app/wydarzenie/791c6bef-bf3e-4a38-a3d9-d865e6203026
 * shows 4 hardcoded partner logos (Wrocław, ZAIKS, Recepcja, Polmic)
 * even though the partners field in Sanity is empty ("No items").
 */

const EVENT_ID = '791c6bef-bf3e-4a38-a3d9-d865e6203026';
const EVENT_URL = `/wydarzenie/${EVENT_ID}`;

// These are the hardcoded fallback partners that should NOT appear
const HARDCODED_PARTNER_LOGOS = [
  'partner-wroclaw.png',
  'partner-zaiks.png',
  'partner-recepcja.png',
  'partner-polmic.png',
];

test.describe('Event partners - empty field should show no partners', () => {
  test('should NOT display hardcoded fallback partners when CMS field is empty (desktop)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(EVENT_URL, { waitUntil: 'networkidle' });

    // Event page should load
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(0);

    // Check that no hardcoded partner logos are rendered
    for (const logo of HARDCODED_PARTNER_LOGOS) {
      const partnerImg = page.locator(`img[src*="${logo}"]`);
      await expect(partnerImg).toHaveCount(0);
    }
  });

  test('should NOT display hardcoded fallback partners when CMS field is empty (mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(EVENT_URL, { waitUntil: 'networkidle' });

    // Event page should load
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(0);

    // Check that no hardcoded partner logos are rendered
    for (const logo of HARDCODED_PARTNER_LOGOS) {
      const partnerImg = page.locator(`img[src*="${logo}"]`);
      await expect(partnerImg).toHaveCount(0);
    }
  });
});
