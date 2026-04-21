// @ts-check
import { test, expect } from '@playwright/test';

// Regression test: mobile /bio must show Sanity CMS text, not stale translation file content.
// Root cause: MobileBio.jsx was reading from t() instead of useSanityBioProfiles hook.
test('bio mobile shows Sanity CMS text (not stale config text)', async ({ browser }) => {
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await mobile.newPage();

  await page.goto('/bio', { waitUntil: 'networkidle' });
  // Wait for Sanity data to render — look for a paragraph that only Sanity has
  await page.waitForSelector('p', { timeout: 10000 });

  const bodyText = await page.evaluate(() => document.body.innerText);

  // Sanity text (desktop shows this) — must be on mobile after fix
  expect(bodyText).toContain('Ensemble Kompopolex to polski zespół muzyki współczesnej');
  // Stale config text — must NOT appear after fix
  expect(bodyText).not.toContain('Trio specjalizujące się w muzyce najnowszej');

  await mobile.close();
});
