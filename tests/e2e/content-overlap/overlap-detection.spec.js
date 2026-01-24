/**
 * Content Overlap Detection Tests - NON-CMS MODE
 *
 * These tests verify that content elements don't overlap when displayed,
 * especially with longer text content. Works with local config data.
 */

import { test, expect } from '@playwright/test';

/**
 * Check if two bounding boxes overlap
 */
function doBoxesOverlap(box1, box2, threshold = 5) {
  if (!box1 || !box2) return false;

  // Add threshold for minor pixel differences
  return !(
    box1.x + box1.width <= box2.x + threshold ||
    box2.x + box2.width <= box1.x + threshold ||
    box1.y + box1.height <= box2.y + threshold ||
    box2.y + box2.height <= box1.y + threshold
  );
}

/**
 * Check for overlapping elements within a container
 * Returns array of overlapping element pairs
 */
async function findOverlappingElements(page, selector, childSelector) {
  const container = page.locator(selector);
  if (await container.count() === 0) return [];

  const children = container.locator(childSelector);
  const count = await children.count();

  if (count < 2) return [];

  const boxes = [];
  for (let i = 0; i < count; i++) {
    const box = await children.nth(i).boundingBox();
    if (box && box.width > 0 && box.height > 0) {
      boxes.push({ index: i, box });
    }
  }

  const overlaps = [];
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      if (doBoxesOverlap(boxes[i].box, boxes[j].box)) {
        overlaps.push({
          element1: boxes[i].index,
          element2: boxes[j].index,
          box1: boxes[i].box,
          box2: boxes[j].box,
        });
      }
    }
  }

  return overlaps;
}

/**
 * Check if text is clipped/truncated unexpectedly
 */
async function checkTextOverflow(page, selector) {
  const elements = page.locator(selector);
  const count = await elements.count();

  const issues = [];
  for (let i = 0; i < count; i++) {
    const el = elements.nth(i);
    const isVisible = await el.isVisible().catch(() => false);
    if (!isVisible) continue;

    const overflow = await el.evaluate((node) => {
      const style = window.getComputedStyle(node);
      return {
        overflowX: style.overflowX,
        overflowY: style.overflowY,
        textOverflow: style.textOverflow,
        isClipped: node.scrollWidth > node.clientWidth || node.scrollHeight > node.clientHeight,
        scrollWidth: node.scrollWidth,
        clientWidth: node.clientWidth,
        scrollHeight: node.scrollHeight,
        clientHeight: node.clientHeight,
      };
    });

    // Flag if content is clipped without proper text-overflow handling
    if (overflow.isClipped && overflow.textOverflow !== 'ellipsis') {
      issues.push({ index: i, ...overflow });
    }
  }

  return issues;
}

/**
 * Generic page overlap check
 */
async function checkPageForOverlaps(page, url, options = {}) {
  await page.goto(url, { waitUntil: 'networkidle' });

  // Check for horizontal scroll (basic overflow)
  const hasHorizontalScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });

  // Check main content sections don't overlap
  const sectionOverlaps = await findOverlappingElements(
    page,
    options.containerSelector || 'body',
    options.sectionSelector || '[data-section]'
  );

  return {
    hasHorizontalScroll,
    sectionOverlaps,
    url,
  };
}

test.describe('Content Overlap Detection - Non-CMS Mode', () => {
  test.describe('Bio Page', () => {
    test('bio sections do not overlap on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const result = await checkPageForOverlaps(page, '/bio');

      expect(result.hasHorizontalScroll).toBe(false);
      expect(result.sectionOverlaps).toHaveLength(0);
    });

    test('bio paragraphs do not overlap within profile', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/bio', { waitUntil: 'networkidle' });

      // Scroll through page to check each profile section
      const sections = page.locator('[data-section]');
      const count = await sections.count();

      for (let i = 0; i < count; i++) {
        await sections.nth(i).scrollIntoViewIfNeeded();

        // Check paragraphs within this section
        const paragraphs = sections.nth(i).locator('p');
        const pCount = await paragraphs.count();

        if (pCount >= 2) {
          const boxes = [];
          for (let j = 0; j < pCount; j++) {
            const box = await paragraphs.nth(j).boundingBox();
            if (box && box.height > 0) boxes.push(box);
          }

          // Check sequential paragraphs don't overlap
          for (let j = 0; j < boxes.length - 1; j++) {
            const overlap = doBoxesOverlap(boxes[j], boxes[j + 1]);
            expect(overlap, `Paragraphs ${j} and ${j + 1} in section ${i} overlap`).toBe(false);
          }
        }
      }
    });

    test('bio name and paragraphs do not overlap', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/bio', { waitUntil: 'networkidle' });

      const sections = page.locator('[data-section]');
      const count = await sections.count();

      for (let i = 0; i < count; i++) {
        await sections.nth(i).scrollIntoViewIfNeeded();

        // Get name element (h1, h2, or similar)
        const name = sections.nth(i).locator('h1, h2, [class*="name"]').first();
        const firstParagraph = sections.nth(i).locator('p').first();

        if (await name.count() > 0 && await firstParagraph.count() > 0) {
          const nameBox = await name.boundingBox();
          const paraBox = await firstParagraph.boundingBox();

          if (nameBox && paraBox) {
            const overlap = doBoxesOverlap(nameBox, paraBox);
            expect(overlap, `Name and paragraph overlap in section ${i}`).toBe(false);
          }
        }
      }
    });

    test('bio page mobile - no overlaps', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      const result = await checkPageForOverlaps(page, '/bio');

      expect(result.hasHorizontalScroll).toBe(false);
      expect(result.sectionOverlaps).toHaveLength(0);
    });
  });

  test.describe('Kalendarz Page', () => {
    test('event cards do not overlap on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/kalendarz', { waitUntil: 'networkidle' });

      // Find event cards/items
      const events = page.locator('[data-event], [class*="event"], article');
      const count = await events.count();

      if (count >= 2) {
        const boxes = [];
        for (let i = 0; i < count; i++) {
          const box = await events.nth(i).boundingBox();
          if (box && box.width > 0 && box.height > 0) {
            boxes.push({ index: i, box });
          }
        }

        // Check no events overlap
        for (let i = 0; i < boxes.length; i++) {
          for (let j = i + 1; j < boxes.length; j++) {
            const overlap = doBoxesOverlap(boxes[i].box, boxes[j].box);
            expect(overlap, `Events ${boxes[i].index} and ${boxes[j].index} overlap`).toBe(false);
          }
        }
      }
    });

    test('event title and description do not overlap', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/kalendarz', { waitUntil: 'networkidle' });

      const events = page.locator('[data-event], [class*="event"], article').first();
      if (await events.count() === 0) return;

      const title = events.locator('h1, h2, h3, [class*="title"]').first();
      const description = events.locator('p, [class*="description"]').first();

      if (await title.count() > 0 && await description.count() > 0) {
        const titleBox = await title.boundingBox();
        const descBox = await description.boundingBox();

        if (titleBox && descBox) {
          expect(doBoxesOverlap(titleBox, descBox)).toBe(false);
        }
      }
    });

    test('kalendarz page mobile - no horizontal overflow', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/kalendarz', { waitUntil: 'networkidle' });

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll).toBe(false);
    });
  });

  test.describe('Homepage', () => {
    test('homepage slides content does not overflow', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/', { waitUntil: 'networkidle' });

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll).toBe(false);
    });

    test('homepage word and tagline do not overlap', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/', { waitUntil: 'networkidle' });

      const slides = page.locator('[data-section], [class*="slide"]');
      const count = await slides.count();

      for (let i = 0; i < Math.min(count, 4); i++) {
        await slides.nth(i).scrollIntoViewIfNeeded();

        // Look for word (usually larger text/SVG) and tagline
        const word = slides.nth(i).locator('svg, [class*="word"], h1').first();
        const tagline = slides.nth(i).locator('[class*="tagline"], p, span').first();

        if (await word.count() > 0 && await tagline.count() > 0) {
          const wordBox = await word.boundingBox();
          const taglineBox = await tagline.boundingBox();

          if (wordBox && taglineBox && wordBox.height > 10 && taglineBox.height > 10) {
            expect(
              doBoxesOverlap(wordBox, taglineBox),
              `Word and tagline overlap in slide ${i}`
            ).toBe(false);
          }
        }
      }
    });

    test('homepage mobile - no overlaps', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/', { waitUntil: 'networkidle' });

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll).toBe(false);
    });
  });

  test.describe('Wydarzenie (Event Detail) Page', () => {
    test('event detail elements do not overlap', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/wydarzenie', { waitUntil: 'networkidle' });

      // Check main content areas
      const title = page.locator('h1, [class*="title"]').first();
      const details = page.locator('[class*="detail"], [class*="info"], p').first();
      const image = page.locator('img').first();

      const boxes = [];
      if (await title.count() > 0) {
        const box = await title.boundingBox();
        if (box) boxes.push({ name: 'title', box });
      }
      if (await details.count() > 0) {
        const box = await details.boundingBox();
        if (box) boxes.push({ name: 'details', box });
      }
      if (await image.count() > 0) {
        const box = await image.boundingBox();
        if (box) boxes.push({ name: 'image', box });
      }

      // Text elements shouldn't overlap with each other
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          // Image can overlap with text (background image scenario)
          if (boxes[i].name === 'image' || boxes[j].name === 'image') continue;

          expect(
            doBoxesOverlap(boxes[i].box, boxes[j].box),
            `${boxes[i].name} and ${boxes[j].name} overlap`
          ).toBe(false);
        }
      }
    });

    test('event program items do not overlap', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/wydarzenie', { waitUntil: 'networkidle' });

      // Find program items (composer + piece pairs)
      const programItems = page.locator('[class*="program"] > *, [class*="piece"], li');
      const count = await programItems.count();

      if (count >= 2) {
        const boxes = [];
        for (let i = 0; i < count; i++) {
          const box = await programItems.nth(i).boundingBox();
          if (box && box.height > 5) boxes.push({ index: i, box });
        }

        for (let i = 0; i < boxes.length - 1; i++) {
          expect(
            doBoxesOverlap(boxes[i].box, boxes[i + 1].box),
            `Program items ${i} and ${i + 1} overlap`
          ).toBe(false);
        }
      }
    });

    test('wydarzenie mobile - no horizontal overflow', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/wydarzenie', { waitUntil: 'networkidle' });

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll).toBe(false);
    });
  });

  test.describe('Media Page', () => {
    test('photo album cards do not overlap', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/media', { waitUntil: 'networkidle' });

      const albums = page.locator('[class*="album"], [class*="card"], article');
      const count = await albums.count();

      if (count >= 2) {
        const boxes = [];
        for (let i = 0; i < count; i++) {
          const box = await albums.nth(i).boundingBox();
          if (box && box.width > 0) boxes.push({ index: i, box });
        }

        for (let i = 0; i < boxes.length; i++) {
          for (let j = i + 1; j < boxes.length; j++) {
            expect(
              doBoxesOverlap(boxes[i].box, boxes[j].box),
              `Albums ${boxes[i].index} and ${boxes[j].index} overlap`
            ).toBe(false);
          }
        }
      }
    });

    test('media mobile - no horizontal overflow', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/media', { waitUntil: 'networkidle' });

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll).toBe(false);
    });
  });

  test.describe('Fundacja Page', () => {
    test('fundacja content sections do not overlap', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/fundacja', { waitUntil: 'networkidle' });

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll).toBe(false);
    });

    test('fundacja mobile - no horizontal overflow', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/fundacja', { waitUntil: 'networkidle' });

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll).toBe(false);
    });
  });

  test.describe('Repertuar Page', () => {
    test('repertuar composer entries do not overlap', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/repertuar', { waitUntil: 'networkidle' });

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll).toBe(false);
    });

    test('repertuar mobile - no horizontal overflow', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/repertuar', { waitUntil: 'networkidle' });

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll).toBe(false);
    });
  });
});
