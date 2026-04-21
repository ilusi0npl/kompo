// @ts-check
import { test, expect } from '@playwright/test';

// Regression: MobileBio must read from Sanity CMS when VITE_USE_SANITY=true.
// Before fix: mobile always used t() translation file text — diverged from desktop.
test('bio mobile shows Sanity CMS text, not stale translation file text', async ({ browser }) => {
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await mobile.newPage();

  await page.goto('/bio', { waitUntil: 'networkidle' });
  await page.waitForSelector('p', { timeout: 10000 });

  const paragraphs = await page.$$eval('p', els =>
    els.map(e => e.innerText.trim()).filter(t => t.length > 40)
  );

  // Sanity has updated ensemble text; stale config/translation has different text
  // Sanity text: "Ensemble Kompopolex to polski zespół muzyki współczesnej..."
  // Old config text (stale): starts with "Trio specjalizujące się w muzyce najnowszej, założone"
  // (Sanity also contains "Trio specjalizuje się" but not "Trio specjalizujące")
  const hasSanityText = paragraphs.some(t => t.includes('Ensemble Kompopolex to polski zesp'));
  const hasStaleConfigText = paragraphs.some(t => t.includes('Trio specjalizujące się w muzyce najnowszej'));

  expect(hasSanityText, 'Mobile should show Sanity CMS text').toBe(true);
  expect(hasStaleConfigText, 'Mobile should not show stale config-only text').toBe(false);

  await mobile.close();
});
