/**
 * Bio Ensemble Page Mobile - Text Overlap Detection Tests
 *
 * Detects when text elements overlap on mobile Bio Ensemble page.
 */

import { test, expect } from '@playwright/test';

/**
 * Check if two bounding boxes overlap
 */
function boxesOverlap(box1, box2) {
  const tolerance = 2;
  return !(
    box1.x + box1.width <= box2.x + tolerance ||
    box2.x + box2.width <= box1.x + tolerance ||
    box1.y + box1.height <= box2.y + tolerance ||
    box2.y + box2.height <= box1.y + tolerance
  );
}

/**
 * Calculate overlap area between two boxes
 */
function getOverlapArea(box1, box2) {
  const xOverlap = Math.max(0, Math.min(box1.x + box1.width, box2.x + box2.width) - Math.max(box1.x, box2.x));
  const yOverlap = Math.max(0, Math.min(box1.y + box1.height, box2.y + box2.height) - Math.max(box1.y, box2.y));
  return xOverlap * yOverlap;
}

/**
 * Get all text elements with their bounding boxes
 */
async function getTextElementsWithBoxes(page, selector) {
  const elements = await page.locator(selector).all();
  const results = [];

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const box = await element.boundingBox();
    const text = await element.textContent();

    if (box && box.width > 0 && box.height > 0) {
      results.push({
        index: i,
        text: text?.substring(0, 50) + (text?.length > 50 ? '...' : ''),
        box,
      });
    }
  }

  return results;
}

/**
 * Find all overlapping pairs in a list of elements
 */
function findOverlaps(elements) {
  const overlaps = [];

  for (let i = 0; i < elements.length; i++) {
    for (let j = i + 1; j < elements.length; j++) {
      if (boxesOverlap(elements[i].box, elements[j].box)) {
        const overlapArea = getOverlapArea(elements[i].box, elements[j].box);
        if (overlapArea > 100) {
          overlaps.push({
            element1: elements[i],
            element2: elements[j],
            overlapArea,
          });
        }
      }
    }
  }

  return overlaps;
}

test.describe('Bio Ensemble Page Mobile - Text Overlap Detection', () => {
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/bio/ensemble');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('title should not overlap with image on mobile', async ({ page }) => {
    const title = await page.locator('div[data-section="bio-ensemble-mobile"] p').first().boundingBox();
    const imageContainer = await page.locator('div[data-section="bio-ensemble-mobile"] img').first().boundingBox();

    if (title && imageContainer) {
      const imageBottom = imageContainer.y + imageContainer.height;
      const titleTop = title.y;

      console.log(`Image bottom: ${imageBottom}, Title top: ${titleTop}`);

      // Title should be below the image
      const overlaps = titleTop < imageBottom - 5;
      expect(overlaps, 'Title should not overlap with image').toBe(false);
    }
  });

  test('paragraphs should not overlap each other on mobile', async ({ page }) => {
    // Scroll to make paragraphs visible
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(500);

    const paragraphs = await getTextElementsWithBoxes(
      page,
      'div[data-section="bio-ensemble-mobile"] > div p'
    );

    console.log(`Found ${paragraphs.length} paragraphs on mobile bio ensemble page`);

    const overlaps = findOverlaps(paragraphs);

    if (overlaps.length > 0) {
      console.log('OVERLAPPING PARAGRAPHS DETECTED:');
      overlaps.forEach(({ element1, element2, overlapArea }) => {
        console.log(`  "${element1.text}" overlaps with "${element2.text}" (${overlapArea}px²)`);
      });
    }

    expect(overlaps.length, `Found ${overlaps.length} overlapping paragraphs`).toBe(0);
  });

  test('content should not overflow page container on mobile', async ({ page }) => {
    const section = await page.locator('div[data-section="bio-ensemble-mobile"]').boundingBox();
    const allParagraphs = await page.locator('div[data-section="bio-ensemble-mobile"] p').all();

    let overflowCount = 0;

    for (const paragraph of allParagraphs) {
      const pBox = await paragraph.boundingBox();
      if (!pBox || !section) continue;

      // Check horizontal overflow (important for mobile)
      const pRight = pBox.x + pBox.width;
      const sectionRight = section.x + section.width;

      if (pRight > sectionRight + 10) {
        const overflow = pRight - sectionRight;
        console.log(`Paragraph overflows horizontally by ${overflow.toFixed(0)}px`);
        overflowCount++;
      }
    }

    expect(overflowCount, `Found ${overflowCount} paragraphs overflowing`).toBe(0);
  });

  test('all text elements should not overlap on mobile (comprehensive)', async ({ page }) => {
    // Scroll through entire page
    await page.evaluate(async () => {
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      const height = document.body.scrollHeight;
      const step = window.innerHeight;

      for (let y = 0; y < height; y += step) {
        window.scrollTo(0, y);
        await delay(100);
      }
      window.scrollTo(0, 0);
    });

    await page.waitForTimeout(500);

    const allParagraphs = await getTextElementsWithBoxes(
      page,
      'div[data-section="bio-ensemble-mobile"] p'
    );

    console.log(`Found ${allParagraphs.length} total text elements on mobile`);

    const substantialText = allParagraphs.filter(el => el.text && el.text.length > 20);
    console.log(`${substantialText.length} substantial text elements`);

    const overlaps = findOverlaps(substantialText);

    if (overlaps.length > 0) {
      console.log('\n=== OVERLAPPING TEXT ELEMENTS ON MOBILE ===');
      overlaps.forEach(({ element1, element2, overlapArea }) => {
        console.log(`\nOverlap (${overlapArea}px²):`);
        console.log(`  1: "${element1.text}"`);
        console.log(`  2: "${element2.text}"`);
      });

      await page.screenshot({
        path: 'test-results/bio-ensemble-mobile-text-overlap.png',
        fullPage: true
      });
    }

    expect(overlaps.length, `Found ${overlaps.length} overlapping text elements`).toBe(0);
  });
});
