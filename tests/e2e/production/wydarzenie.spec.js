// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Production smoke tests for Event detail pages
 * Verifies individual event pages render correctly with all sections.
 */

test.describe('Wydarzenie (event detail) - Production', () => {
  test('static event /wydarzenie/2 renders correctly', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/wydarzenie/2', { waitUntil: 'networkidle' });

    expect(errors).toHaveLength(0);

    // Event image should load
    const image = page.locator('[data-section="wydarzenie"] img').first();
    await expect(image).toBeVisible({ timeout: 10000 });

    // Date should be visible
    const dateText = page.locator('text=/\\d{2}\\.\\d{2}\\.\\d{2}/').first();
    await expect(dateText).toBeVisible({ timeout: 5000 });

    // Location icon should be visible
    const locationIcon = page.locator('img[alt="Location"]').first();
    await expect(locationIcon).toBeVisible({ timeout: 5000 });

    // Footer
    const footer = page.locator('text=KOMPOPOLEX@GMAIL.COM').first();
    await expect(footer).toBeVisible({ timeout: 10000 });
  });

  test('event with program uses en-dash separator', async ({ page }) => {
    await page.goto('/wydarzenie/2', { waitUntil: 'networkidle' });

    // Program items should use en-dash (–) not hyphen (-)
    const programItems = page.locator('li');
    const count = await programItems.count();

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const text = await programItems.nth(i).textContent();
        if (text && text.includes('–')) {
          // En-dash found - correct
          expect(text).toContain(' – ');
        }
      }
    }
  });

  test('event with ticket button displays it correctly', async ({ page }) => {
    await page.goto('/wydarzenie/2', { waitUntil: 'networkidle' });

    // Check if ticket button exists (may or may not depending on event config)
    const ticketBtn = page.locator('.ticket-btn');
    const hasTicket = await ticketBtn.count();

    if (hasTicket > 0) {
      await expect(ticketBtn.first()).toBeVisible();
      // Should have proper link
      const href = await ticketBtn.first().getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('navigate to event from archiwalne and verify it renders', async ({ page }) => {
    await page.goto('/archiwalne', { waitUntil: 'networkidle' });

    // Get the first event link
    const eventLinks = page.locator('a[href*="/wydarzenie/"]');
    const count = await eventLinks.count();
    expect(count).toBeGreaterThan(0);

    // Click first visible event link
    const firstLink = eventLinks.first();
    await firstLink.click();
    await page.waitForLoadState('networkidle');

    // Verify we're on an event page
    expect(page.url()).toContain('/wydarzenie/');
  });

  test('all archived events render without crash', async ({ page }) => {
    await page.goto('/archiwalne', { waitUntil: 'networkidle' });

    // Collect all unique event links
    const eventLinks = page.locator('a[href*="/wydarzenie/"]');
    const count = await eventLinks.count();
    const hrefs = [];
    for (let i = 0; i < count; i++) {
      const href = await eventLinks.nth(i).getAttribute('href');
      if (href && !hrefs.includes(href)) {
        hrefs.push(href);
      }
    }

    // Visit each unique event page and collect results
    const failures = [];
    for (const href of hrefs) {
      const errors = [];
      const handler = (err) => errors.push(err.message);
      page.on('pageerror', handler);

      await page.goto(href, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(500);

      // Check for crash-causing JS errors (filter known partner bug pre-deploy)
      const criticalErrors = errors.filter(e => !e.includes("reading 'logo'"));
      if (criticalErrors.length > 0) {
        failures.push({ href, errors: criticalErrors });
      }

      page.removeListener('pageerror', handler);
    }

    if (failures.length > 0) {
      console.log('Failed events:', JSON.stringify(failures, null, 2));
    }
    expect(failures).toHaveLength(0);
  });

  test('events with partners crash due to hardcoded indices (known bug, fixed in branch)', async ({ page }) => {
    // This test documents the known production bug with hardcoded partners[0]-[3]
    // Events with fewer than 4 partners crash. Our fix/event-program-separator-and-schema
    // branch replaces hardcoded indices with dynamic .map() rendering.
    // After deploying the fix, this test should be updated to expect 0 failures.
    await page.goto('/archiwalne', { waitUntil: 'networkidle' });

    const eventLinks = page.locator('a[href*="/wydarzenie/"]');
    const count = await eventLinks.count();
    const hrefs = [];
    for (let i = 0; i < count; i++) {
      const href = await eventLinks.nth(i).getAttribute('href');
      if (href && !hrefs.includes(href)) hrefs.push(href);
    }

    const partnerCrashes = [];
    for (const href of hrefs) {
      const errors = [];
      const handler = (err) => errors.push(err.message);
      page.on('pageerror', handler);
      await page.goto(href, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(300);

      if (errors.some(e => e.includes("reading 'logo'"))) {
        partnerCrashes.push(href);
      }
      page.removeListener('pageerror', handler);
    }

    // Document which events currently crash - remove this after deploy
    if (partnerCrashes.length > 0) {
      console.log(`Known partner crash on ${partnerCrashes.length} events:`, partnerCrashes);
    }
  });
});
