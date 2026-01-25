// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test that Repertuar and Specialne pages display footer correctly in ALL modes:
 * - Normal mode (default config data)
 * - Large test data mode (VITE_LARGE_TEST_DATA=true)
 * - Sanity mode (VITE_USE_SANITY=true)
 *
 * Footer should always be visible and positioned correctly after content.
 */

test.describe('Repertuar - Footer Visibility', () => {
  test('footer should be visible after scrolling to bottom', async ({ page }) => {
    await page.goto('/repertuar');
    await page.waitForLoadState('networkidle');

    // Scroll to bottom of page
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(500);

    // Find footer element
    const footer = page.locator('section[data-section="repertuar"] footer, section[data-section="repertuar"] [class*="footer"]').first();

    // If no footer found in section, look for Footer component
    const footerExists = await footer.count() > 0;

    if (!footerExists) {
      // Try alternative selector - Footer component with absolute positioning
      const altFooter = page.locator('section[data-section="repertuar"]').locator('..').locator('footer').first();
      const altExists = await altFooter.count() > 0;

      if (!altExists) {
        // Look for any footer-like element at the bottom of the section
        const sectionFooter = page.locator('section[data-section="repertuar"]').locator('div').filter({ hasText: /KOMPOPOLEX@GMAIL\.COM|FACEBOOK|INSTAGRAM/ }).first();
        expect(await sectionFooter.count(), 'Footer element should exist in Repertuar section').toBeGreaterThan(0);
        expect(await sectionFooter.isVisible(), 'Footer should be visible after scrolling').toBe(true);
        return;
      }

      expect(await altFooter.isVisible(), 'Footer should be visible after scrolling').toBe(true);
      return;
    }

    expect(await footer.isVisible(), 'Footer should be visible after scrolling').toBe(true);
  });

  test('footer should be within viewport after scrolling to bottom', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/repertuar');
    await page.waitForLoadState('networkidle');

    // Get section total height
    const sectionHeight = await page.evaluate(() => {
      const section = document.querySelector('section[data-section="repertuar"]');
      return section ? section.getBoundingClientRect().height : 0;
    });

    console.log(`Repertuar section height: ${sectionHeight}px`);

    // Scroll to the very bottom
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(500);

    // Find footer text (email or copyright)
    const footerText = page.locator('text=KOMPOPOLEX@GMAIL.COM').first();
    const footerVisible = await footerText.isVisible();

    console.log(`Footer text visible: ${footerVisible}`);

    // Get footer bounding box
    if (await footerText.count() > 0) {
      const box = await footerText.boundingBox();
      console.log(`Footer position: top=${box?.y}, height=${box?.height}`);

      // Footer should be within the rendered page (not cut off)
      expect(box, 'Footer should have valid bounding box').not.toBeNull();
      if (box) {
        expect(box.y, 'Footer top should be positive (visible)').toBeGreaterThan(0);
      }
    }

    expect(footerVisible, 'Footer should be visible after scrolling to bottom').toBe(true);
  });

  test('section height should accommodate all content including footer', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/repertuar');
    await page.waitForLoadState('networkidle');

    // Get measurements
    const measurements = await page.evaluate(() => {
      const section = document.querySelector('section[data-section="repertuar"]');
      const footerEl = section?.querySelector('div')?.querySelector('[class*="footer"], footer');
      const footerTextEl = Array.from(section?.querySelectorAll('*') || []).find(el =>
        el.textContent?.includes('KOMPOPOLEX@GMAIL.COM')
      );

      const sectionRect = section?.getBoundingClientRect();
      const footerRect = (footerTextEl )?.getBoundingClientRect();

      return {
        sectionHeight: sectionRect?.height || 0,
        sectionBottom: (sectionRect?.top || 0) + (sectionRect?.height || 0),
        footerTop: footerRect?.top || 0,
        footerBottom: (footerRect?.top || 0) + (footerRect?.height || 0),
        footerInSection: footerRect ? (footerRect.top < (sectionRect?.top || 0) + (sectionRect?.height || 0)) : false,
      };
    });

    console.log('Repertuar measurements:', measurements);

    // Footer should be inside the section bounds
    expect(
      measurements.footerInSection,
      `Footer (top: ${measurements.footerTop}) should be within section (bottom: ${measurements.sectionBottom})`
    ).toBe(true);
  });
});

test.describe('Specialne - Footer Visibility', () => {
  test('footer should be visible after scrolling to bottom', async ({ page }) => {
    await page.goto('/specialne');
    await page.waitForLoadState('networkidle');

    // Scroll to bottom
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(500);

    // Find footer text
    const footerText = page.locator('text=KOMPOPOLEX@GMAIL.COM').first();
    const footerVisible = await footerText.isVisible();

    console.log(`Specialne footer visible: ${footerVisible}`);

    expect(footerVisible, 'Footer should be visible after scrolling to bottom').toBe(true);
  });

  test('footer should be BELOW content, not overlapping', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/specialne');
    await page.waitForLoadState('networkidle');

    // Get actual content bottom and footer top
    const positions = await page.evaluate(() => {
      const section = document.querySelector('section[data-section="specialne"]');

      // Find the grid container at top: 352px
      const gridContainer = section?.querySelector('div.absolute');

      // Get all divs in the grid columns and find the one with the highest bottom
      let maxContentBottom = 0;
      const allDivs = gridContainer?.querySelectorAll('div[style*="width: 300px"]');
      allDivs?.forEach(div => {
        const rect = div.getBoundingClientRect();
        if (rect.bottom > maxContentBottom) {
          maxContentBottom = rect.bottom;
        }
      });

      // Get footnote bottom (purple text with * explanation)
      const footnote = Array.from(gridContainer?.querySelectorAll('p') || []).find(p =>
        p.textContent?.includes('*')
      );
      const footnoteBottom = footnote?.getBoundingClientRect()?.bottom || 0;

      // Get footer top
      const footer = Array.from(section?.querySelectorAll('div') || []).find(el =>
        el.textContent?.includes('KOMPOPOLEX@GMAIL.COM') && el.textContent?.includes('FACEBOOK')
      );
      const footerTop = footer?.getBoundingClientRect()?.top || 0;

      return {
        contentBottom: maxContentBottom,
        footnoteBottom: footnoteBottom,
        footerTop: footerTop,
        gap: footerTop - footnoteBottom,
        footerOverlapsContent: footerTop < maxContentBottom,
        footerOverlapsFootnote: footerTop < footnoteBottom,
      };
    });

    console.log('Specialne overlap check:', positions);

    // Footer must be BELOW all content (not overlapping)
    expect(
      positions.footerOverlapsContent,
      `Footer (top: ${positions.footerTop}) overlaps content (bottom: ${positions.contentBottom}). Overlap: ${positions.contentBottom - positions.footerTop}px`
    ).toBe(false);
  });

  test('section height should accommodate all content including footer', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/specialne');
    await page.waitForLoadState('networkidle');

    const measurements = await page.evaluate(() => {
      const section = document.querySelector('section[data-section="specialne"]');
      const footerTextEl = Array.from(section?.querySelectorAll('*') || []).find(el =>
        el.textContent?.includes('KOMPOPOLEX@GMAIL.COM')
      );

      const sectionRect = section?.getBoundingClientRect();
      const footerRect = (footerTextEl )?.getBoundingClientRect();

      return {
        sectionHeight: sectionRect?.height || 0,
        sectionBottom: (sectionRect?.top || 0) + (sectionRect?.height || 0),
        footerTop: footerRect?.top || 0,
        footerBottom: (footerRect?.top || 0) + (footerRect?.height || 0),
        footerInSection: footerRect ? (footerRect.top < (sectionRect?.top || 0) + (sectionRect?.height || 0)) : false,
      };
    });

    console.log('Specialne measurements:', measurements);

    expect(
      measurements.footerInSection,
      `Footer should be within section bounds`
    ).toBe(true);
  });
});

test.describe('Archiwalne - Footer Visibility', () => {
  test('footer should be visible after scrolling to bottom', async ({ page }) => {
    await page.goto('/archiwalne');
    await page.waitForLoadState('networkidle');

    // Scroll to bottom
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(500);

    const footerText = page.locator('text=KOMPOPOLEX@GMAIL.COM').first();
    const footerVisible = await footerText.isVisible();

    console.log(`Archiwalne footer visible: ${footerVisible}`);

    expect(footerVisible, 'Footer should be visible after scrolling to bottom').toBe(true);
  });
});

test.describe('Media - Footer Visibility (Reference)', () => {
  test('footer should be visible - this is the reference implementation', async ({ page }) => {
    await page.goto('/media');
    await page.waitForLoadState('networkidle');

    // Scroll to bottom
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(500);

    const footerText = page.locator('text=KOMPOPOLEX@GMAIL.COM').first();
    const footerVisible = await footerText.isVisible();

    console.log(`Media footer visible: ${footerVisible}`);

    // Media should always work - it's the reference implementation
    expect(footerVisible, 'Media footer should always be visible (reference)').toBe(true);
  });
});
