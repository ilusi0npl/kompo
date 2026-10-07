import { test, expect } from '@playwright/test';

/**
 * Sanity mode: events can be published without a date.
 * Editors type a placeholder text (e.g. "Szczegóły wkrótce") instead,
 * which must be shown in place of the date and time.
 */

const DESKTOP_VIEWPORT = { width: 1440, height: 900 };
const MOBILE_VIEWPORT = { width: 390, height: 844 };

const undatedEvent = {
  _id: 'undated-event',
  titlePl: 'Koncert bez daty',
  titleEn: 'Concert without date',
  date: null,
  dateTextPl: 'Szczegóły wkrótce',
  dateTextEn: 'Details coming soon',
  locationPl: 'Wrocław',
  locationEn: 'Wroclaw',
  imageUrl: null,
  program: [],
};

const datedEvent = {
  ...undatedEvent,
  _id: 'dated-event',
  titlePl: 'Koncert z datą',
  titleEn: 'Concert with date',
  date: '2026-12-13T17:00:00Z',
  dateTextPl: null,
  dateTextEn: null,
};

async function mockEvents(page) {
  await page.route(/sanity\.io\/.*\/data\/query/, route => {
    const url = decodeURIComponent(route.request().url());
    const result = url.includes('$id') ? undatedEvent : [undatedEvent, datedEvent];
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ result }) });
  });
}

for (const [name, viewport] of [['desktop', DESKTOP_VIEWPORT], ['mobile', MOBILE_VIEWPORT]]) {
  test.describe(`Event without date (${name})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewport);
      await mockEvents(page);
    });

    test('calendar shows placeholder text instead of date', async ({ page }) => {
      await page.goto('/kalendarz', { waitUntil: 'networkidle' });

      await expect(page.getByText('Szczegóły wkrótce').first()).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Invalid Date')).toHaveCount(0);
    });

    test('event page shows placeholder text instead of date and time', async ({ page }) => {
      await page.goto('/wydarzenie/undated-event', { waitUntil: 'networkidle' });

      await expect(page.getByText('Szczegóły wkrótce').first()).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Invalid Date')).toHaveCount(0);
    });
  });
}
