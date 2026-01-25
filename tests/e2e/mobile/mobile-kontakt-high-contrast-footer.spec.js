import { test, expect } from '@playwright/test';

test.describe('Mobile Kontakt - High Contrast Footer Background', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('page wrapper should have white background in high contrast mode', async ({ page }) => {
    await page.goto('/kontakt');
    await page.waitForLoadState('networkidle');

    // Enable high contrast
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
    });
    await page.waitForTimeout(300);

    // Check that wrapper (#root > div) has white background
    const wrapperBg = await page.evaluate(() => {
      const wrapper = document.querySelector('#root > div');
      return wrapper ? getComputedStyle(wrapper).backgroundColor : null;
    });

    // Should be white (#FDFDFD = rgb(253, 253, 253))
    expect(wrapperBg).toBe('rgb(253, 253, 253)');
  });

  test('all pages with colored backgrounds should have uniform white in high contrast', async ({ page }) => {
    const pagesWithColoredBackgrounds = [
      { path: '/kontakt', name: 'Kontakt' },
      { path: '/bio/ensemble', name: 'Bio Ensemble' },
      { path: '/media', name: 'Media' },
      { path: '/media/wideo', name: 'Media Wideo' },
      { path: '/fundacja', name: 'Fundacja' },
    ];

    for (const { path, name } of pagesWithColoredBackgrounds) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // Enable high contrast
      await page.evaluate(() => {
        document.body.classList.add('high-contrast');
      });
      await page.waitForTimeout(300);

      // Check wrapper background
      const wrapperBg = await page.evaluate(() => {
        const wrapper = document.querySelector('#root > div');
        return wrapper ? getComputedStyle(wrapper).backgroundColor : null;
      });

      expect(wrapperBg, `${name} page wrapper should have white background`).toBe('rgb(253, 253, 253)');
    }
  });
});
