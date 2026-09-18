// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Regression: desktop Kalendarz used hardcoded absolute slots (532px pitch) for
 * exactly 3 events and per-event imageStyle that only exists in config data.
 * With real CMS events this caused: overlapping descriptions, stretched posters,
 * grey gap under posters, footer overlapping content, 4th+ event never rendered.
 */

test.describe('Desktop Kalendarz layout with real CMS content', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/kalendarz', { waitUntil: 'networkidle' });
    await page.locator('[data-event-card]').first().waitFor({ timeout: 15000 });
  });

  test('event cards never overlap regardless of description length', async ({ page }) => {
    const boxes = await page.locator('[data-event-card]').evaluateAll((cards) =>
      cards.map((c) => {
        const r = c.getBoundingClientRect();
        return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
      })
    );

    expect(boxes.length).toBeGreaterThan(1);
    for (let i = 1; i < boxes.length; i++) {
      expect(boxes[i].top).toBeGreaterThanOrEqual(boxes[i - 1].bottom);
    }
  });

  test('every poster fills its frame without stretching or leaving a gap', async ({ page }) => {
    const posters = await page.locator('[data-event-card] .event-poster-link img').evaluateAll((imgs) =>
      imgs.map((img) => {
        const r = img.getBoundingClientRect();
        const frame = img.parentElement.getBoundingClientRect();
        return {
          height: Math.round(r.height),
          frameHeight: Math.round(frame.height),
          objectFit: getComputedStyle(img).objectFit,
        };
      })
    );

    expect(posters.length).toBeGreaterThan(0);
    for (const p of posters) {
      expect(p.height).toBe(p.frameHeight);
      expect(p.objectFit).toBe('cover');
    }
  });

  test('footer sits below the last event card', async ({ page }) => {
    const lastCardBottom = await page.locator('[data-event-card]').last().evaluate(
      (el) => el.getBoundingClientRect().bottom + window.scrollY
    );
    const footerTop = await page.locator('footer, [data-footer]').first().evaluate(
      (el) => el.getBoundingClientRect().top + window.scrollY
    );

    expect(footerTop).toBeGreaterThanOrEqual(lastCardBottom);
  });

  test('desktop shows the same number of events as mobile', async ({ page }) => {
    const desktopCards = await page.locator('[data-event-card]').count();

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/kalendarz', { waitUntil: 'networkidle' });
    const mobileCards = await page.locator('.event-title-link').count();

    expect(desktopCards).toBe(mobileCards);
  });
});
