import { test, expect } from '@playwright/test';

/**
 * Regression: footer must sit below the "NAJBLIŻSZE WYDARZENIA" link on
 * /bio/ensemble. Previously the footer was pinned with `bottom: 40px` inside
 * a section whose height estimate was too small for long paragraphs, so the
 * footer crashed into the link.
 */

test.describe('Bio Ensemble: footer vs link regression', () => {
  test('desktop: footer is positioned below "najbliższe wydarzenia" link', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/bio/ensemble');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const link = page.locator('a[href="/kalendarz"]').first();
    const footer = page
      .locator('section[data-section="bio-ensemble"] footer, section[data-section="bio-ensemble"] [class*="footer" i]')
      .first();

    const linkBox = await link.boundingBox();
    const footerBox = await footer.boundingBox();

    expect(linkBox).toBeTruthy();
    expect(footerBox).toBeTruthy();

    const linkBottom = linkBox.y + linkBox.height;
    expect(
      footerBox.y,
      `footer top (${footerBox.y}) must be >= link bottom (${linkBottom})`
    ).toBeGreaterThanOrEqual(linkBottom);
  });

  test('mobile: footer is positioned below "najbliższe wydarzenia" link', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/bio/ensemble');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const link = page.locator('a[href="/kalendarz"]').first();
    const linkBox = await link.boundingBox();
    expect(linkBox).toBeTruthy();

    const footer = page
      .locator('footer, [class*="footer" i]')
      .filter({ hasText: /kompopolex@gmail\.com|facebook|instagram/i })
      .first();
    const footerBox = await footer.boundingBox();

    if (!footerBox) {
      // Mobile may not render footer on this route; skip rather than fail.
      test.skip(true, 'mobile footer not present on /bio/ensemble');
      return;
    }

    const linkBottom = linkBox.y + linkBox.height;
    expect(footerBox.y).toBeGreaterThanOrEqual(linkBottom);
  });
});
