// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Regression: desktop Archiwalne placed rows at a fixed 674px pitch with only
 * 120px reserved for text. Long titles or performer lists from the CMS ran under
 * the next row's posters, and showed through them on hover (poster opacity 0.9).
 */

const ROW_GAP = 80;

test.describe('Desktop Archiwalne layout with real CMS content', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/archiwalne', { waitUntil: 'networkidle' });
    await page.locator('.event-poster-link').first().waitFor({ timeout: 15000 });
  });

  test('text never runs under the next row and rows keep a constant gap', async ({ page }) => {
    const cards = await page.locator('.event-poster-link').evaluateAll((posters) =>
      posters.map((poster) => {
        const el = poster.parentElement;
        const r = el.getBoundingClientRect();
        return { top: Math.round(r.top + window.scrollY), bottom: Math.round(r.bottom + window.scrollY) };
      })
    );

    expect(cards.length).toBeGreaterThan(3);
    const rows = [];
    for (let i = 0; i < cards.length; i += 3) rows.push(cards.slice(i, i + 3));
    for (let r = 1; r < rows.length; r++) {
      const previousBottom = Math.max(...rows[r - 1].map((c) => c.bottom));
      const rowTop = Math.min(...rows[r].map((c) => c.top));
      expect(rowTop - previousBottom).toBe(ROW_GAP);
    }
  });

  test('footer sits below the last row', async ({ page }) => {
    const lastBottom = await page.locator('.event-poster-link').evaluateAll((posters) =>
      Math.max(...posters.map((p) => p.parentElement.getBoundingClientRect().bottom + window.scrollY))
    );
    const footerTop = await page.locator('footer, [data-footer]').first().evaluate(
      (el) => el.getBoundingClientRect().top + window.scrollY
    );
    expect(footerTop).toBeGreaterThan(lastBottom);
  });
});
