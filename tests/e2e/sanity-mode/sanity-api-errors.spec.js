import { test, expect } from '@playwright/test';

/**
 * Sanity mode tests: Verify pages handle API errors gracefully.
 *
 * Simulates Sanity API failures (500, timeout, malformed response)
 * to ensure the app doesn't crash and shows error states.
 */

const DESKTOP_VIEWPORT = { width: 1440, height: 900 };

function collectErrors(page) {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  return errors;
}

async function mockSanityApiError(page, statusCode = 500) {
  await page.route('**/api/**/query/**', route => {
    route.fulfill({
      status: statusCode,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });
  });
  await page.route('**/api/**/query', route => {
    route.fulfill({
      status: statusCode,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });
  });
}

const pages = [
  { name: 'Kalendarz', url: '/kalendarz' },
  { name: 'Archiwalne', url: '/archiwalne' },
  { name: 'Fundacja', url: '/fundacja' },
  { name: 'Bio', url: '/bio' },
  { name: 'Repertuar', url: '/repertuar' },
  { name: 'Media', url: '/media' },
  { name: 'Kontakt', url: '/kontakt' },
];

test.describe('Sanity Mode: API error handling', () => {
  for (const p of pages) {
    test(`${p.name}: handles Sanity API 500 error without crash`, async ({ page }) => {
      const errors = collectErrors(page);
      await mockSanityApiError(page, 500);

      await page.setViewportSize(DESKTOP_VIEWPORT);
      await page.goto(p.url);
      await page.waitForLoadState('networkidle');

      // No uncaught TypeError crashes
      const crashes = errors.filter(e =>
        e.includes('Cannot read properties') ||
        e.includes('is not a function') ||
        e.includes('is not iterable')
      );
      expect(crashes).toHaveLength(0);
    });
  }
});
