// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Production cross-page integration tests
 * Verifies navigation, global elements, and data consistency.
 */

const ALL_PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/bio', name: 'Bio' },
  { path: '/bio/ensemble', name: 'Bio Ensemble' },
  { path: '/media', name: 'Media Zdjecia' },
  { path: '/media/wideo', name: 'Media Wideo' },
  { path: '/kalendarz', name: 'Kalendarz' },
  { path: '/archiwalne', name: 'Archiwalne' },
  { path: '/repertuar', name: 'Repertuar' },
  { path: '/specialne', name: 'Specialne' },
  { path: '/fundacja', name: 'Fundacja' },
  { path: '/kontakt', name: 'Kontakt' },
  { path: '/wydarzenie/2', name: 'Wydarzenie 2' },
];

test.describe('Cross-page: No JS errors on any page', () => {
  for (const { path, name } of ALL_PAGES) {
    test(`${name} (${path}) - no JS errors`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', (err) => errors.push(err.message));
      await page.goto(path, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(1000);

      if (errors.length > 0) {
        console.log(`JS errors on ${path}:`, errors);
      }
      expect(errors).toHaveLength(0);
    });
  }
});

test.describe('Cross-page: No [object Object] on any page', () => {
  for (const { path, name } of ALL_PAGES) {
    test(`${name} (${path}) - no [object Object]`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'networkidle', timeout: 15000 });
      const bodyText = await page.locator('body').innerText();
      expect(bodyText).not.toContain('[object Object]');
    });
  }
});

test.describe('Cross-page: No broken images', () => {
  for (const { path, name } of ALL_PAGES) {
    test(`${name} (${path}) - no broken images`, async ({ page }) => {
      const brokenImages = [];

      // Intercept image responses
      page.on('response', (response) => {
        const url = response.url();
        if (
          response.status() >= 400 &&
          (url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.svg') || url.endsWith('.webp') || url.includes('cdn.sanity.io'))
        ) {
          brokenImages.push({ url, status: response.status() });
        }
      });

      await page.goto(path, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(1000);

      if (brokenImages.length > 0) {
        console.log(`Broken images on ${path}:`, brokenImages);
      }
      expect(brokenImages).toHaveLength(0);
    });
  }
});

test.describe('Cross-page: Logo visible on pages with header', () => {
  const PAGES_WITH_LOGO = [
    '/bio', '/media', '/media/wideo', '/kalendarz', '/archiwalne',
    '/repertuar', '/specialne', '/fundacja', '/kontakt', '/wydarzenie/2',
  ];

  for (const path of PAGES_WITH_LOGO) {
    test(`${path} - logo visible`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'networkidle', timeout: 15000 });
      const logo = page.locator('img[alt="Kompopolex"]').first();
      await expect(logo).toBeVisible({ timeout: 10000 });
    });
  }
});

test.describe('Cross-page: Navigation flow', () => {
  test('can navigate through main pages via menu', async ({ page }) => {
    await page.goto('/bio', { waitUntil: 'networkidle' });

    // Navigate to Kalendarz
    const kalLink = page.locator('a[href="/kalendarz"]').first();
    await kalLink.click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/kalendarz');

    // Navigate to Kontakt
    const konLink = page.locator('a[href="/kontakt"]').first();
    await konLink.click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/kontakt');

    // Navigate to Fundacja
    const funLink = page.locator('a[href="/fundacja"]').first();
    await funLink.click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/fundacja');
  });

  test('language toggle persists across pages', async ({ page }) => {
    await page.goto('/bio', { waitUntil: 'networkidle' });

    // Switch to English
    const engToggle = page.locator('text=ENG').first();
    await expect(engToggle).toBeVisible({ timeout: 5000 });
    await engToggle.click();
    await page.waitForTimeout(500);

    // Verify it switched
    const plToggle = page.locator('text=PL').first();
    await expect(plToggle).toBeVisible({ timeout: 5000 });

    // Navigate to another page
    const konLink = page.locator('a[href="/kontakt"]').first();
    await konLink.click();
    await page.waitForLoadState('networkidle');

    // Language should persist (PL toggle visible = we're in EN mode)
    const plToggleAfterNav = page.locator('text=PL').first();
    await expect(plToggleAfterNav).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Cross-page: Mobile responsive', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  const MOBILE_PAGES = [
    '/bio', '/archiwalne', '/kontakt', '/fundacja',
  ];

  for (const path of MOBILE_PAGES) {
    test(`${path} - renders on mobile without JS errors`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', (err) => errors.push(err.message));
      await page.goto(path, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(1000);

      expect(errors).toHaveLength(0);

      // MENU button should be visible on mobile
      const menu = page.locator('text=MENU').first();
      await expect(menu).toBeVisible({ timeout: 10000 });
    });
  }

  test('/kalendarz - renders on mobile', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/kalendarz', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);
    expect(errors).toHaveLength(0);
    // Kalendarz may show empty state without MENU header on mobile
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(0);
  });
});
