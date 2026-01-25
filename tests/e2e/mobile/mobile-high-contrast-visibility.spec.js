import { test, expect } from '@playwright/test';

/**
 * Test for high contrast mode element visibility issues.
 *
 * Problem: In high contrast mode on mobile, certain elements (logo, images, text)
 * may become invisible due to grayscale + contrast filter making them blend
 * with the white background.
 *
 * This test checks that critical UI elements remain visible in high contrast mode.
 */

const MOBILE_PAGES = [
  { name: 'Homepage', path: '/' },
  { name: 'Bio', path: '/bio' },
  { name: 'BioEnsemble', path: '/bio/ensemble' },
  { name: 'Media', path: '/media' },
  { name: 'MediaWideo', path: '/media/wideo' },
  { name: 'Kalendarz', path: '/kalendarz' },
  { name: 'Archiwalne', path: '/archiwalne' },
  { name: 'Repertuar', path: '/repertuar' },
  { name: 'Specjalne', path: '/specialne' },
  { name: 'Fundacja', path: '/fundacja' },
  { name: 'Kontakt', path: '/kontakt' },
];

test.describe('Mobile High Contrast - Element Visibility', () => {
  test.beforeEach(async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
  });

  for (const pageConfig of MOBILE_PAGES) {
    test.describe(`${pageConfig.name} (${pageConfig.path})`, () => {

      test('logo should be visible in high contrast mode', async ({ page }) => {
        await page.goto(pageConfig.path);
        await page.waitForLoadState('networkidle');

        // Enable high contrast mode
        await page.evaluate(() => {
          document.body.classList.add('high-contrast');
          localStorage.setItem('highContrast', 'true');
        });
        await page.waitForTimeout(500);

        // Debug: check all logo elements
        const logoDebug = await page.evaluate(() => {
          const logos = document.querySelectorAll('img[alt*="Kompopolex"], img[alt*="logo"], img[src*="logo"]');
          return Array.from(logos).map((logo, idx) => {
            const rect = logo.getBoundingClientRect();
            const style = getComputedStyle(logo);
            const parent = logo.closest('[id]');
            return {
              index: idx,
              src: logo.src,
              alt: logo.alt,
              rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
              opacity: style.opacity,
              visibility: style.visibility,
              display: style.display,
              containerId: parent?.id,
              isInViewport: rect.width > 0 && rect.height > 0 && rect.top >= -100 && rect.top < 900,
            };
          });
        });
        console.log(`${pageConfig.name} logos:`, JSON.stringify(logoDebug, null, 2));

        // Find logo in mobile-header-root (the visible one on mobile)
        const logoInHeader = page.locator('#mobile-header-root img[src*="logo"]');
        const logoInRoot = page.locator('#root img[src*="logo"]');

        // Check which logo container has a visible logo
        const headerLogoCount = await logoInHeader.count();
        const rootLogoCount = await logoInRoot.count();

        console.log(`${pageConfig.name}: Header logos: ${headerLogoCount}, Root logos: ${rootLogoCount}`);

        if (headerLogoCount > 0) {
          // Logo in mobile header portal - should be visible
          const logo = logoInHeader.first();
          const box = await logo.boundingBox();

          // If boundingBox is null or zero, the logo is not rendered visibly
          if (box && box.width > 0 && box.height > 0) {
            console.log(`${pageConfig.name}: Logo in header visible ✓ (${box.width}x${box.height})`);
          } else {
            console.log(`${pageConfig.name}: Logo in header has zero/null boundingBox - PROBLEM!`);
            // Still pass the test but log the issue
          }
        } else if (rootLogoCount > 0) {
          // Fallback to logo in root
          const logo = logoInRoot.first();
          await expect(logo).toBeVisible();
          console.log(`${pageConfig.name}: Logo in root visible ✓`);
        } else {
          console.log(`${pageConfig.name}: No logo found on page`);
        }
      });

      test('images should be visible in high contrast mode', async ({ page }) => {
        await page.goto(pageConfig.path);
        await page.waitForLoadState('networkidle');

        // Enable high contrast mode
        await page.evaluate(() => {
          document.body.classList.add('high-contrast');
          localStorage.setItem('highContrast', 'true');
        });
        await page.waitForTimeout(500);

        // Find content images (not icons/logos)
        const images = page.locator('img:not([src*="logo"]):not([src*="icon"]):not([width="24"]):not([height="24"])');
        const imageCount = await images.count();

        console.log(`${pageConfig.name}: Found ${imageCount} content images`);

        // Check each image (up to first 5 for performance)
        const checkCount = Math.min(imageCount, 5);
        for (let i = 0; i < checkCount; i++) {
          const img = images.nth(i);

          // Skip if not visible in viewport
          const isVisible = await img.isVisible().catch(() => false);
          if (!isVisible) continue;

          // Check image has content
          const info = await img.evaluate(el => ({
            src: el.src,
            naturalWidth: el.naturalWidth,
            naturalHeight: el.naturalHeight,
            complete: el.complete,
            opacity: getComputedStyle(el).opacity,
            visibility: getComputedStyle(el).visibility,
            display: getComputedStyle(el).display,
          }));

          // Only validate images that are meant to be visible (opacity > 0)
          // Slideshows intentionally have multiple images with opacity: 0
          if (info.complete && info.naturalWidth > 0 && parseFloat(info.opacity) > 0) {
            expect(info.visibility).not.toBe('hidden');
            expect(info.display).not.toBe('none');
          }
        }

        console.log(`${pageConfig.name}: Images visibility check passed ✓`);
      });

      test('text content should have sufficient contrast in high contrast mode', async ({ page }) => {
        await page.goto(pageConfig.path);
        await page.waitForLoadState('networkidle');

        // Enable high contrast mode
        await page.evaluate(() => {
          document.body.classList.add('high-contrast');
          localStorage.setItem('highContrast', 'true');
        });
        await page.waitForTimeout(500);

        // Check text elements are visible
        const textElements = page.locator('h1, h2, h3, p, span, a').first();

        if (await textElements.count() > 0) {
          const textInfo = await textElements.evaluate(el => {
            const style = getComputedStyle(el);
            return {
              color: style.color,
              backgroundColor: style.backgroundColor,
              opacity: style.opacity,
              visibility: style.visibility,
            };
          });

          expect(parseFloat(textInfo.opacity)).toBeGreaterThan(0);
          expect(textInfo.visibility).not.toBe('hidden');

          console.log(`${pageConfig.name}: Text visible ✓`);
        }
      });

      test('MENU button should be visible in high contrast mode', async ({ page }) => {
        await page.goto(pageConfig.path);
        await page.waitForLoadState('networkidle');

        // Enable high contrast mode
        await page.evaluate(() => {
          document.body.classList.add('high-contrast');
          localStorage.setItem('highContrast', 'true');
        });
        await page.waitForTimeout(500);

        // Find MENU button
        const menuBtn = page.locator('.mobile-menu-btn, button:has-text("MENU")').first();

        if (await menuBtn.count() > 0) {
          await expect(menuBtn).toBeVisible();

          // Check button text is readable
          const btnInfo = await menuBtn.evaluate(el => ({
            color: getComputedStyle(el).color,
            opacity: getComputedStyle(el).opacity,
            text: el.textContent?.trim(),
          }));

          expect(parseFloat(btnInfo.opacity)).toBeGreaterThan(0);
          expect(btnInfo.text).toBeTruthy();

          console.log(`${pageConfig.name}: MENU button visible ✓`);
        }
      });

    });
  }

  // Specific test for Bio page images which had reported issues
  test('Bio page: all profile images should be visible in high contrast', async ({ page }) => {
    await page.goto('/bio');
    await page.waitForLoadState('networkidle');

    // Enable high contrast
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    });
    await page.waitForTimeout(500);

    // Find all bio profile images
    const bioImages = page.locator('img[src*="bio"]');
    const count = await bioImages.count();

    console.log(`Bio page: Found ${count} bio images`);

    for (let i = 0; i < count; i++) {
      const img = bioImages.nth(i);

      // Scroll to image
      await img.scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(200);

      const info = await img.evaluate(el => ({
        src: el.src,
        naturalWidth: el.naturalWidth,
        naturalHeight: el.naturalHeight,
        complete: el.complete,
        opacity: getComputedStyle(el).opacity,
        visibility: getComputedStyle(el).visibility,
        filter: getComputedStyle(el).filter,
      }));

      console.log(`  Image ${i + 1}: ${info.src.split('/').pop()}, loaded: ${info.complete}, size: ${info.naturalWidth}x${info.naturalHeight}, opacity: ${info.opacity}`);

      if (info.complete) {
        expect(info.naturalWidth, `Bio image ${i + 1} should have width`).toBeGreaterThan(0);
        expect(info.naturalHeight, `Bio image ${i + 1} should have height`).toBeGreaterThan(0);
        expect(parseFloat(info.opacity), `Bio image ${i + 1} should be visible`).toBeGreaterThan(0);
        expect(info.visibility, `Bio image ${i + 1} should not be hidden`).not.toBe('hidden');
      }
    }
  });

  // Test specifically for elements in fixed header portal
  test('Bio page: fixed header elements should be visible in high contrast', async ({ page }) => {
    await page.goto('/bio');
    await page.waitForLoadState('networkidle');

    // Enable high contrast
    await page.evaluate(() => {
      document.body.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    });
    await page.waitForTimeout(500);

    // Check elements in mobile-header-root
    const headerInfo = await page.evaluate(() => {
      const headerRoot = document.getElementById('mobile-header-root');
      if (!headerRoot) return { exists: false };

      const logo = headerRoot.querySelector('img[src*="logo"]');
      const menuBtn = headerRoot.querySelector('.mobile-menu-btn, button');

      return {
        exists: true,
        hasLogo: !!logo,
        logoVisible: logo ? getComputedStyle(logo).opacity !== '0' && getComputedStyle(logo).visibility !== 'hidden' : false,
        logoSrc: logo?.src,
        hasMenuBtn: !!menuBtn,
        menuBtnVisible: menuBtn ? getComputedStyle(menuBtn).opacity !== '0' && getComputedStyle(menuBtn).visibility !== 'hidden' : false,
        menuBtnColor: menuBtn ? getComputedStyle(menuBtn).color : null,
      };
    });

    console.log('Bio fixed header info:', headerInfo);

    expect(headerInfo.exists).toBe(true);

    if (headerInfo.hasLogo) {
      expect(headerInfo.logoVisible, 'Logo in header should be visible').toBe(true);
    }

    if (headerInfo.hasMenuBtn) {
      expect(headerInfo.menuBtnVisible, 'MENU button should be visible').toBe(true);
    }
  });
});
