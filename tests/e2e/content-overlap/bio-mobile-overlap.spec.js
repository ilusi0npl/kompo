/**
 * Bio Page Mobile - Text Overlap Detection Tests
 *
 * Detects when text elements overlap on mobile Bio page.
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

test.describe('Bio Page Mobile - Text Overlap Detection', () => {
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/bio');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('profile names should not overlap each other on mobile', async ({ page }) => {
    const nameElements = await getTextElementsWithBoxes(
      page,
      'section[data-section="bio-mobile"] p[style*="font-size"]'
    );

    // Filter to just title elements (larger font)
    const titles = nameElements.filter(el => el.box.height > 30);
    console.log(`Found ${titles.length} profile names on mobile`);

    const overlaps = findOverlaps(titles);

    if (overlaps.length > 0) {
      console.log('OVERLAPPING NAMES DETECTED:');
      overlaps.forEach(({ element1, element2, overlapArea }) => {
        console.log(`  "${element1.text}" overlaps with "${element2.text}" (${overlapArea}px²)`);
      });
    }

    expect(overlaps.length, `Found ${overlaps.length} overlapping profile names`).toBe(0);
  });

  test('profile sections should not overlap on mobile', async ({ page }) => {
    const sections = await getTextElementsWithBoxes(page, 'section[data-color]');
    console.log(`Found ${sections.length} profile sections on mobile`);

    const overlaps = findOverlaps(sections);

    if (overlaps.length > 0) {
      console.log('OVERLAPPING SECTIONS DETECTED:');
      overlaps.forEach(({ element1, element2, overlapArea }) => {
        console.log(`  Section ${element1.index + 1} overlaps with Section ${element2.index + 1} (${overlapArea}px²)`);
      });
    }

    expect(overlaps.length, `Found ${overlaps.length} overlapping sections`).toBe(0);
  });

  test('text should not overflow outside profile sections on mobile', async ({ page }) => {
    const sections = await page.locator('section[data-color]').all();
    let overflowCount = 0;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionBox = await section.boundingBox();

      if (!sectionBox) continue;

      const textElements = await section.locator('p').all();

      for (const textEl of textElements) {
        const textBox = await textEl.boundingBox();
        if (!textBox) continue;

        const textBottom = textBox.y + textBox.height;
        const sectionBottom = sectionBox.y + sectionBox.height;

        if (textBottom > sectionBottom + 10) {
          const overflow = textBottom - sectionBottom;
          console.log(`Section ${i + 1}: Text overflows by ${overflow.toFixed(0)}px`);
          overflowCount++;
        }
      }
    }

    expect(overflowCount, `Found ${overflowCount} text elements overflowing`).toBe(0);
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
      'section[data-section="bio-mobile"] p'
    );

    console.log(`Found ${allParagraphs.length} total text elements on mobile`);

    const substantialText = allParagraphs.filter(el => el.text && el.text.length > 30);
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
        path: 'test-results/bio-mobile-text-overlap.png',
        fullPage: true
      });
    }

    expect(overlaps.length, `Found ${overlaps.length} overlapping text elements`).toBe(0);
  });
});
