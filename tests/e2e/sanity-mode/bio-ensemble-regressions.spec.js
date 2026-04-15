import { test, expect } from '@playwright/test';

/**
 * Bio Ensemble regressions against Sanity-backed data.
 *
 * 1. Profile lookup must fall back to the first profile when no document has
 *    slug="ensemble" (previously showed "Ensemble profile not found").
 * 2. Footer must never overlap the "najbliższe wydarzenia" link, even with
 *    long paragraphs (previously: absolute bottom positioning collided with
 *    dynamic content).
 */

const DESKTOP_VIEWPORT = { width: 1440, height: 900 };
const MOBILE_VIEWPORT = { width: 390, height: 844 };

const LONG_PARAGRAPH =
  'Od 2022 roku Ensemble Kompopolex współpracuje z realizatorem dźwięku Marcinem ' +
  'Myszyńskim, który odpowiada za spójność i wysoką jakość brzmienia zespołu ' +
  'podczas koncertów i nagrań studyjnych. '.repeat(6);

function buildProfile({ slug, paragraphs }) {
  return {
    _id: 'bioProfile-ensemble',
    slug,
    namePl: 'Ensemble KOMPOPOLEX',
    nameEn: 'Ensemble KOMPOPOLEX',
    imageUrl: '/assets/bio/bio-ensemble-large.webp',
    paragraphs: paragraphs.map(text => ({
      textPl: text,
      textEn: text,
      display: 'both',
    })),
    paragraphsPl: paragraphs,
    paragraphsEn: paragraphs,
    publishedAt: '2024-01-01T00:00:00Z',
  };
}

async function mockBioProfilesSanity(page, profile) {
  const handler = route => {
    const url = route.request().url();
    // Only intercept bioProfile queries; let everything else through
    if (url.includes('bioProfile')) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ result: [profile] }),
      });
      return;
    }
    route.continue();
  };
  await page.route('**/api/**/query/**', handler);
  await page.route('**/api/**/query', handler);
}

test.describe('Bio Ensemble: Sanity regressions', () => {
  test('desktop: falls back to first profile when slug is missing', async ({ page }) => {
    await mockBioProfilesSanity(
      page,
      buildProfile({ slug: null, paragraphs: ['Krótki tekst ensemble.'] })
    );

    await page.setViewportSize(DESKTOP_VIEWPORT);
    await page.goto('/bio/ensemble');
    await page.waitForLoadState('networkidle');

    const body = await page.textContent('body');
    expect(body, 'must not show not-found error').not.toContain('Ensemble profile not found');
    expect(body, 'must not show generic error').not.toContain('Error loading content');

    const section = page.locator('section[data-section="bio-ensemble"]');
    await expect(section).toBeVisible();
  });

  test('mobile: falls back to first profile when slug is missing', async ({ page }) => {
    await mockBioProfilesSanity(
      page,
      buildProfile({ slug: '', paragraphs: ['Krótki tekst ensemble.'] })
    );

    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto('/bio/ensemble');
    await page.waitForLoadState('networkidle');

    const body = await page.textContent('body');
    expect(body).not.toContain('Ensemble profile not found');
    expect(body).not.toContain('Error loading content');
  });

  test('desktop: footer does not overlap "najbliższe wydarzenia" link with long content', async ({ page }) => {
    await mockBioProfilesSanity(
      page,
      buildProfile({
        slug: 'ensemble',
        paragraphs: [LONG_PARAGRAPH, LONG_PARAGRAPH, LONG_PARAGRAPH, LONG_PARAGRAPH],
      })
    );

    await page.setViewportSize(DESKTOP_VIEWPORT);
    await page.goto('/bio/ensemble');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const link = page.locator('a[href="/kalendarz"]').first();
    const footer = page.locator('section[data-section="bio-ensemble"] footer, section[data-section="bio-ensemble"] [class*="footer" i]').first();

    const linkBox = await link.boundingBox();
    const footerBox = await footer.boundingBox();

    expect(linkBox, 'link bounding box').toBeTruthy();
    expect(footerBox, 'footer bounding box').toBeTruthy();

    const linkBottom = linkBox.y + linkBox.height;
    const footerTop = footerBox.y;

    expect(
      footerTop,
      `footer (top=${footerTop}) must sit below link (bottom=${linkBottom})`
    ).toBeGreaterThanOrEqual(linkBottom);
  });
});
