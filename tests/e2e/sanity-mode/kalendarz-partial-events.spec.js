// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test: Calendar page should display events even when fewer than 3 are available.
 * Bug: Desktop layout required exactly 3 events, showing "no events" when only 1 or 2 exist.
 */

test.describe('Calendar page with fewer than 3 upcoming events', () => {
  test('should display available events on desktop instead of empty message', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/kalendarz', { waitUntil: 'networkidle' });

    // Should NOT show the empty events message
    const emptyMessage = page.getByText('Brak nadchodzących wydarzeń');
    await expect(emptyMessage).not.toBeVisible({ timeout: 10000 });

    // Should show at least one event title link
    const eventLinks = page.locator('.event-title-link');
    await expect(eventLinks.first()).toBeVisible({ timeout: 10000 });
  });

  test('should display available events on mobile instead of empty message', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/kalendarz', { waitUntil: 'networkidle' });

    // Should NOT show the empty events message
    const emptyMessage = page.getByText('Brak nadchodzących wydarzeń');
    await expect(emptyMessage).not.toBeVisible({ timeout: 10000 });

    // Should show at least one event title link
    const eventLinks = page.locator('.event-title-link');
    await expect(eventLinks.first()).toBeVisible({ timeout: 10000 });
  });
});
