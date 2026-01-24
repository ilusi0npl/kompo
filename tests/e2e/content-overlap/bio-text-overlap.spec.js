/**
 * Bio Page Text Overlap Detection Tests
 *
 * Detects when text elements overlap each other on the Bio page.
 * Useful for testing with large amounts of data (VITE_LARGE_TEST_DATA=true)
 */

import { test, expect } from '@playwright/test';

/**
 * Check if two bounding boxes overlap
 */
function boxesOverlap(box1, box2) {
  // Add small tolerance (2px) to avoid false positives from rounding
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
        // Only report significant overlaps (more than 100 square pixels)
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

test.describe('Bio Page - Text Overlap Detection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bio');
    await page.waitForLoadState('networkidle');
    // Wait for images and content to load
    await page.waitForTimeout(1000);
  });

  test('profile names should not overlap each other', async ({ page }) => {
    // Get all profile name elements (h1/h2 or large text with name styling)
    const nameElements = await getTextElementsWithBoxes(
      page,
      'section[data-color] p[style*="font-size: 40px"], section[data-color] p[style*="fontSize"]'
    );

    console.log(`Found ${nameElements.length} profile names`);

    const overlaps = findOverlaps(nameElements);

    if (overlaps.length > 0) {
      console.log('OVERLAPPING NAMES DETECTED:');
      overlaps.forEach(({ element1, element2, overlapArea }) => {
        console.log(`  "${element1.text}" overlaps with "${element2.text}" (${overlapArea}px²)`);
        console.log(`    Box1: x=${element1.box.x.toFixed(0)}, y=${element1.box.y.toFixed(0)}, w=${element1.box.width.toFixed(0)}, h=${element1.box.height.toFixed(0)}`);
        console.log(`    Box2: x=${element2.box.x.toFixed(0)}, y=${element2.box.y.toFixed(0)}, w=${element2.box.width.toFixed(0)}, h=${element2.box.height.toFixed(0)}`);
      });
    }

    expect(overlaps.length, `Found ${overlaps.length} overlapping profile names`).toBe(0);
  });

  test('paragraphs within same profile should not overlap', async ({ page }) => {
    // Get all profile sections
    const sections = await page.locator('section[data-color]').all();
    console.log(`Found ${sections.length} profile sections`);

    let totalOverlaps = 0;

    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
      const section = sections[sectionIndex];

      // Get all paragraph elements within this section
      const paragraphs = await section.locator('p[style*="font-size: 16px"], p[style*="fontSize"]').all();
      const paragraphBoxes = [];

      for (let i = 0; i < paragraphs.length; i++) {
        const box = await paragraphs[i].boundingBox();
        const text = await paragraphs[i].textContent();

        if (box && box.width > 0 && box.height > 0 && text && text.length > 20) {
          paragraphBoxes.push({
            index: i,
            text: text.substring(0, 40) + '...',
            box,
          });
        }
      }

      const overlaps = findOverlaps(paragraphBoxes);

      if (overlaps.length > 0) {
        console.log(`Section ${sectionIndex + 1}: ${overlaps.length} overlapping paragraphs`);
        overlaps.forEach(({ element1, element2, overlapArea }) => {
          console.log(`  "${element1.text}" overlaps with "${element2.text}" (${overlapArea}px²)`);
        });
        totalOverlaps += overlaps.length;
      }
    }

    expect(totalOverlaps, `Found ${totalOverlaps} overlapping paragraphs`).toBe(0);
  });

  test('profile sections should not overlap each other', async ({ page }) => {
    const sections = await getTextElementsWithBoxes(page, 'section[data-color]');
    console.log(`Found ${sections.length} profile sections`);

    const overlaps = findOverlaps(sections);

    if (overlaps.length > 0) {
      console.log('OVERLAPPING SECTIONS DETECTED:');
      overlaps.forEach(({ element1, element2, overlapArea }) => {
        console.log(`  Section ${element1.index + 1} overlaps with Section ${element2.index + 1} (${overlapArea}px²)`);
        console.log(`    Box1: y=${element1.box.y.toFixed(0)}, h=${element1.box.height.toFixed(0)}`);
        console.log(`    Box2: y=${element2.box.y.toFixed(0)}, h=${element2.box.height.toFixed(0)}`);
      });
    }

    expect(overlaps.length, `Found ${overlaps.length} overlapping sections`).toBe(0);
  });

  test('text should not overflow outside profile sections', async ({ page }) => {
    const sections = await page.locator('section[data-color]').all();
    let overflowCount = 0;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionBox = await section.boundingBox();

      if (!sectionBox) continue;

      // Get all text elements in this section
      const textElements = await section.locator('p').all();

      for (const textEl of textElements) {
        const textBox = await textEl.boundingBox();
        if (!textBox) continue;

        // Check if text extends below section boundary
        const textBottom = textBox.y + textBox.height;
        const sectionBottom = sectionBox.y + sectionBox.height;

        if (textBottom > sectionBottom + 10) { // 10px tolerance
          const overflow = textBottom - sectionBottom;
          console.log(`Section ${i + 1}: Text overflows by ${overflow.toFixed(0)}px`);
          overflowCount++;
        }
      }
    }

    expect(overflowCount, `Found ${overflowCount} text elements overflowing their sections`).toBe(0);
  });

  test('all text elements on page should not overlap (comprehensive)', async ({ page }) => {
    // Scroll through the entire page to ensure all content is rendered
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

    // Get ALL paragraph elements on the page
    const allParagraphs = await getTextElementsWithBoxes(page, 'section[data-section="bio"] p, section[data-section="bio-mobile"] p');

    console.log(`Found ${allParagraphs.length} total text elements`);

    // Filter to only substantial text (paragraphs, not short labels)
    const substantialText = allParagraphs.filter(el => el.text && el.text.length > 30);
    console.log(`${substantialText.length} substantial text elements`);

    const overlaps = findOverlaps(substantialText);

    if (overlaps.length > 0) {
      console.log('\n=== OVERLAPPING TEXT ELEMENTS ===');
      overlaps.forEach(({ element1, element2, overlapArea }) => {
        console.log(`\nOverlap (${overlapArea}px²):`);
        console.log(`  1: "${element1.text}"`);
        console.log(`     y=${element1.box.y.toFixed(0)}, h=${element1.box.height.toFixed(0)}`);
        console.log(`  2: "${element2.text}"`);
        console.log(`     y=${element2.box.y.toFixed(0)}, h=${element2.box.height.toFixed(0)}`);
      });

      // Take screenshot for debugging
      await page.screenshot({
        path: 'test-results/bio-text-overlap.png',
        fullPage: true
      });
      console.log('\nScreenshot saved to test-results/bio-text-overlap.png');
    }

    expect(overlaps.length, `Found ${overlaps.length} overlapping text elements`).toBe(0);
  });
});
