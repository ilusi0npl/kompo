/**
 * Bio Ensemble Page Desktop - Text Overlap Detection Tests
 *
 * Detects when text elements overlap on desktop Bio Ensemble page.
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

test.describe('Bio Ensemble Page Desktop - Text Overlap Detection', () => {
  test.beforeEach(async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/bio/ensemble');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for image to load
  });

  test('title should not overlap with image', async ({ page }) => {
    const title = await page.locator('section[data-section="bio-ensemble"] > p').first().boundingBox();
    const imageContainer = await page.locator('section[data-section="bio-ensemble"] > div').first().boundingBox();

    if (title && imageContainer) {
      const titleBottom = title.y + title.height;
      const imageTop = imageContainer.y;

      console.log(`Title: y=${title.y}, height=${title.height}, bottom=${titleBottom}`);
      console.log(`Image: y=${imageTop}, height=${imageContainer.height}`);

      // Title should end before image starts (with small tolerance)
      const overlaps = titleBottom > imageTop + 5;
      expect(overlaps, 'Title should not overlap with image').toBe(false);
    }
  });

  test('paragraphs should not overlap each other', async ({ page }) => {
    const paragraphs = await getTextElementsWithBoxes(
      page,
      'section[data-section="bio-ensemble"] > div:last-of-type p'
    );

    console.log(`Found ${paragraphs.length} paragraphs on bio ensemble page`);

    const overlaps = findOverlaps(paragraphs);

    if (overlaps.length > 0) {
      console.log('OVERLAPPING PARAGRAPHS DETECTED:');
      overlaps.forEach(({ element1, element2, overlapArea }) => {
        console.log(`  "${element1.text}" overlaps with "${element2.text}" (${overlapArea}px²)`);
      });
    }

    expect(overlaps.length, `Found ${overlaps.length} overlapping paragraphs`).toBe(0);
  });

  test('content should not overflow page container', async ({ page }) => {
    const section = await page.locator('section[data-section="bio-ensemble"]').boundingBox();
    const allParagraphs = await page.locator('section[data-section="bio-ensemble"] p').all();

    let overflowCount = 0;

    for (const paragraph of allParagraphs) {
      const pBox = await paragraph.boundingBox();
      if (!pBox || !section) continue;

      const pBottom = pBox.y + pBox.height;
      const sectionBottom = section.y + section.height;

      if (pBottom > sectionBottom + 10) {
        const overflow = pBottom - sectionBottom;
        console.log(`Paragraph overflows by ${overflow.toFixed(0)}px`);
        overflowCount++;
      }
    }

    expect(overflowCount, `Found ${overflowCount} paragraphs overflowing`).toBe(0);
  });

  test('footer should not overlap with content', async ({ page }) => {
    // Footer is the last direct div child of the section
    const allDivs = await page.locator('section[data-section="bio-ensemble"] > div').all();
    if (allDivs.length < 3) {
      console.log('Not enough divs to check footer overlap');
      return;
    }

    const contentDiv = await allDivs[1].boundingBox(); // Content div (paragraphs)
    const footer = await allDivs[allDivs.length - 1].boundingBox(); // Last div is footer

    if (footer && contentDiv) {
      const contentBottom = contentDiv.y + contentDiv.height;
      const footerTop = footer.y;

      console.log(`Content bottom: ${contentBottom}, Footer top: ${footerTop}`);

      // Allow some gap, but content should end before footer starts
      const overlaps = contentBottom > footerTop + 5;
      expect(overlaps, 'Content should not overlap with footer').toBe(false);
    }
  });

  test('all text elements should not overlap (comprehensive)', async ({ page }) => {
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
      'section[data-section="bio-ensemble"] p'
    );

    console.log(`Found ${allParagraphs.length} total text elements`);

    const substantialText = allParagraphs.filter(el => el.text && el.text.length > 20);
    console.log(`${substantialText.length} substantial text elements`);

    const overlaps = findOverlaps(substantialText);

    if (overlaps.length > 0) {
      console.log('\n=== OVERLAPPING TEXT ELEMENTS ===');
      overlaps.forEach(({ element1, element2, overlapArea }) => {
        console.log(`\nOverlap (${overlapArea}px²):`);
        console.log(`  1: "${element1.text}"`);
        console.log(`  2: "${element2.text}"`);
      });

      await page.screenshot({
        path: 'test-results/bio-ensemble-text-overlap.png',
        fullPage: true
      });
    }

    expect(overlaps.length, `Found ${overlaps.length} overlapping text elements`).toBe(0);
  });
});
