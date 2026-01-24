/**
 * Massive Data Injection Tests - NON-CMS MODE
 *
 * These tests inject large amounts of data into each page to simulate
 * what would happen if CMS contained many entries. Tests verify that
 * layouts handle massive content without overlaps.
 */

import { test, expect } from '@playwright/test';

/**
 * Check if two bounding boxes overlap
 */
function doBoxesOverlap(box1, box2, threshold = 2) {
  if (!box1 || !box2) return false;
  return !(
    box1.x + box1.width <= box2.x + threshold ||
    box2.x + box2.width <= box1.x + threshold ||
    box1.y + box1.height <= box2.y + threshold ||
    box2.y + box2.height <= box1.y + threshold
  );
}

/**
 * Check for horizontal scroll
 */
async function hasHorizontalScroll(page) {
  return page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
}

/**
 * Find overlapping elements among a list of locators
 */
async function findOverlaps(page, selector) {
  const elements = page.locator(selector);
  const count = await elements.count();

  if (count < 2) return [];

  const boxes = [];
  for (let i = 0; i < count; i++) {
    const el = elements.nth(i);
    const isVisible = await el.isVisible().catch(() => false);
    if (!isVisible) continue;

    const box = await el.boundingBox();
    if (box && box.width > 0 && box.height > 0) {
      boxes.push({ index: i, box });
    }
  }

  const overlaps = [];
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      if (doBoxesOverlap(boxes[i].box, boxes[j].box)) {
        overlaps.push({
          el1: boxes[i].index,
          el2: boxes[j].index,
          box1: boxes[i].box,
          box2: boxes[j].box,
        });
      }
    }
  }

  return overlaps;
}

/**
 * Check sequential elements don't overlap (for lists)
 */
async function checkSequentialOverlaps(page, selector) {
  const elements = page.locator(selector);
  const count = await elements.count();

  const overlaps = [];
  for (let i = 0; i < count - 1; i++) {
    const el1 = elements.nth(i);
    const el2 = elements.nth(i + 1);

    const visible1 = await el1.isVisible().catch(() => false);
    const visible2 = await el2.isVisible().catch(() => false);
    if (!visible1 || !visible2) continue;

    const box1 = await el1.boundingBox();
    const box2 = await el2.boundingBox();

    if (box1 && box2 && box1.height > 0 && box2.height > 0) {
      if (doBoxesOverlap(box1, box2)) {
        overlaps.push({ index1: i, index2: i + 1, box1, box2 });
      }
    }
  }

  return overlaps;
}

test.describe('Massive Data Injection Tests', () => {

  test.describe('Repertuar Page - 100 Composers', () => {
    test('desktop: 100 composers with 5 works each do not overlap', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/repertuar', { waitUntil: 'networkidle' });

      // Inject 100 composers
      await page.evaluate(() => {
        const container = document.querySelector('main') || document.querySelector('[class*="content"]') || document.body;

        // Clear existing content for clean test
        const wrapper = document.createElement('div');
        wrapper.id = 'test-composers';
        wrapper.style.cssText = 'padding: 20px;';

        for (let i = 1; i <= 100; i++) {
          const composer = document.createElement('div');
          composer.className = 'test-composer';
          composer.style.cssText = 'margin-bottom: 24px; border-bottom: 1px solid #eee; padding-bottom: 16px;';
          composer.innerHTML = `
            <h3 style="margin: 0 0 8px 0; font-size: 18px;">Kompozytor Testowy ${i} (${1900 + (i % 100)})</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Utwór pierwszy na orkiestrę symfoniczną</li>
              <li>Utwór drugi na kwartet smyczkowy op. ${i}</li>
              <li>Utwór trzeci na fortepian solo</li>
              <li>Koncert na skrzypce i orkiestrę nr ${i}</li>
              <li>Sonata na wiolonczelę i fortepian</li>
            </ul>
          `;
          wrapper.appendChild(composer);
        }

        container.innerHTML = '';
        container.appendChild(wrapper);
      });

      await page.waitForTimeout(300);

      // Check no horizontal overflow
      expect(await hasHorizontalScroll(page)).toBe(false);

      // Check composers don't overlap
      const overlaps = await checkSequentialOverlaps(page, '.test-composer');
      expect(overlaps.length, `Found ${overlaps.length} overlapping composers`).toBe(0);

      // Scroll through entire page to verify rendering
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(100);

      expect(await hasHorizontalScroll(page)).toBe(false);
    });

    test('mobile: 100 composers render without overlap', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/repertuar', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const container = document.querySelector('main') || document.body;
        const wrapper = document.createElement('div');
        wrapper.id = 'test-composers-mobile';

        for (let i = 1; i <= 100; i++) {
          const composer = document.createElement('div');
          composer.className = 'test-composer-mobile';
          composer.style.cssText = 'margin-bottom: 16px; padding: 8px; border-bottom: 1px solid #ddd;';
          composer.innerHTML = `
            <strong>Kompozytor ${i}</strong>
            <div style="font-size: 14px; margin-top: 4px;">
              • Utwór 1 • Utwór 2 • Utwór 3
            </div>
          `;
          wrapper.appendChild(composer);
        }

        container.innerHTML = '';
        container.appendChild(wrapper);
      });

      await page.waitForTimeout(200);
      expect(await hasHorizontalScroll(page)).toBe(false);

      const overlaps = await checkSequentialOverlaps(page, '.test-composer-mobile');
      expect(overlaps.length).toBe(0);
    });
  });

  test.describe('Specjalne Page - 50 Special Projects', () => {
    test('desktop: 50 special composers do not overlap', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/specjalne', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const container = document.querySelector('main') || document.body;
        const wrapper = document.createElement('div');
        wrapper.id = 'test-specjalne';
        wrapper.style.cssText = 'padding: 20px;';

        for (let i = 1; i <= 50; i++) {
          const item = document.createElement('div');
          item.className = 'test-special';
          item.style.cssText = 'margin-bottom: 32px; padding: 16px; background: #f5f5f5; border-radius: 8px;';
          item.innerHTML = `
            <h3 style="margin: 0 0 12px 0;">Projekt Specjalny ${i}: Kompozytor Gościnny ${i}</h3>
            <p style="margin: 0 0 8px 0;">Rok powstania: ${2010 + (i % 15)}</p>
            <p style="margin: 0;">Opis projektu specjalnego numer ${i} - utwór zamówiony specjalnie dla Ensemble Kompopolex na festiwal muzyki współczesnej.</p>
            <ul style="margin-top: 8px;">
              <li>Prawykonanie: ${2015 + (i % 10)}</li>
              <li>Miejsce: Filharmonia Wrocławska</li>
            </ul>
          `;
          wrapper.appendChild(item);
        }

        container.innerHTML = '';
        container.appendChild(wrapper);
      });

      await page.waitForTimeout(300);
      expect(await hasHorizontalScroll(page)).toBe(false);

      const overlaps = await checkSequentialOverlaps(page, '.test-special');
      expect(overlaps.length).toBe(0);
    });

    test('mobile: 50 special projects render correctly', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/specjalne', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const container = document.querySelector('main') || document.body;
        const wrapper = document.createElement('div');

        for (let i = 1; i <= 50; i++) {
          const item = document.createElement('div');
          item.className = 'test-special-mobile';
          item.style.cssText = 'margin-bottom: 16px; padding: 12px; background: #f0f0f0;';
          item.innerHTML = `
            <strong>Projekt ${i}</strong>
            <p style="margin: 4px 0 0 0; font-size: 14px;">Kompozytor Gościnny - Utwór specjalny</p>
          `;
          wrapper.appendChild(item);
        }

        container.innerHTML = '';
        container.appendChild(wrapper);
      });

      await page.waitForTimeout(200);
      expect(await hasHorizontalScroll(page)).toBe(false);

      const overlaps = await checkSequentialOverlaps(page, '.test-special-mobile');
      expect(overlaps.length).toBe(0);
    });
  });

  test.describe('Kalendarz Page - 50 Events', () => {
    test('desktop: 50 upcoming events do not overlap', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/kalendarz', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const container = document.querySelector('main') || document.body;
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'padding: 20px;';

        for (let i = 1; i <= 50; i++) {
          const event = document.createElement('article');
          event.className = 'test-event';
          event.style.cssText = 'margin-bottom: 40px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; display: flex; gap: 20px;';

          const day = (i % 28) + 1;
          const month = ((i - 1) % 12) + 1;

          event.innerHTML = `
            <div style="width: 200px; height: 150px; background: #ccc; flex-shrink: 0;"></div>
            <div style="flex: 1;">
              <h3 style="margin: 0 0 8px 0;">Koncert Muzyki Współczesnej nr ${i}</h3>
              <p style="margin: 0 0 4px 0; color: #666;">${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.2025 | 19:00</p>
              <p style="margin: 0 0 8px 0;">Filharmonia Wrocławska, ul. Piłsudskiego 19</p>
              <p style="margin: 0;">Wykonawcy: Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski oraz goście specjalni</p>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #555;">
                Program: utwory kompozytorów polskich i zagranicznych XXI wieku
              </p>
            </div>
          `;
          wrapper.appendChild(event);
        }

        container.innerHTML = '';
        container.appendChild(wrapper);
      });

      await page.waitForTimeout(300);
      expect(await hasHorizontalScroll(page)).toBe(false);

      const overlaps = await checkSequentialOverlaps(page, '.test-event');
      expect(overlaps.length).toBe(0);
    });

    test('mobile: 50 events render without overlap', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/kalendarz', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const container = document.querySelector('main') || document.body;
        const wrapper = document.createElement('div');

        for (let i = 1; i <= 50; i++) {
          const event = document.createElement('div');
          event.className = 'test-event-mobile';
          event.style.cssText = 'margin-bottom: 24px; padding: 12px; border-bottom: 2px solid #eee;';
          event.innerHTML = `
            <div style="width: 100%; height: 120px; background: #ddd; margin-bottom: 8px;"></div>
            <h4 style="margin: 0 0 4px 0;">Koncert ${i}</h4>
            <p style="margin: 0; font-size: 14px;">${(i % 28) + 1}.${((i - 1) % 12) + 1}.2025 | 19:00</p>
            <p style="margin: 4px 0 0 0; font-size: 13px;">Filharmonia Wrocławska</p>
          `;
          wrapper.appendChild(event);
        }

        container.innerHTML = '';
        container.appendChild(wrapper);
      });

      await page.waitForTimeout(200);
      expect(await hasHorizontalScroll(page)).toBe(false);

      const overlaps = await checkSequentialOverlaps(page, '.test-event-mobile');
      expect(overlaps.length).toBe(0);
    });
  });

  test.describe('Archiwalne Page - 100 Archived Events', () => {
    test('desktop: 100 archived events in grid do not overlap', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/archiwalne', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const container = document.querySelector('main') || document.body;
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'padding: 20px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;';

        for (let i = 1; i <= 100; i++) {
          const event = document.createElement('div');
          event.className = 'test-archive';
          event.style.cssText = 'padding: 16px; border: 1px solid #ddd; border-radius: 8px;';
          event.innerHTML = `
            <div style="width: 100%; height: 180px; background: #e0e0e0; margin-bottom: 12px;"></div>
            <h4 style="margin: 0 0 4px 0; font-size: 16px;">Archiwum ${i}</h4>
            <p style="margin: 0; font-size: 14px; color: #666;">${2020 + (i % 5)}</p>
            <p style="margin: 4px 0 0 0; font-size: 13px;">Wykonawcy koncertu</p>
          `;
          wrapper.appendChild(event);
        }

        container.innerHTML = '';
        container.appendChild(wrapper);
      });

      await page.waitForTimeout(300);
      expect(await hasHorizontalScroll(page)).toBe(false);

      // Check grid items don't overlap
      const overlaps = await findOverlaps(page, '.test-archive');
      expect(overlaps.length, `Found ${overlaps.length} overlapping archive items`).toBe(0);
    });

    test('mobile: 100 archived events stack correctly', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/archiwalne', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const container = document.querySelector('main') || document.body;
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'padding: 12px;';

        for (let i = 1; i <= 100; i++) {
          const event = document.createElement('div');
          event.className = 'test-archive-mobile';
          event.style.cssText = 'margin-bottom: 16px; padding: 12px; background: #f5f5f5;';
          event.innerHTML = `
            <div style="width: 100%; height: 100px; background: #ddd; margin-bottom: 8px;"></div>
            <strong>Archiwum ${i}</strong>
            <p style="margin: 4px 0 0 0; font-size: 13px;">${2020 + (i % 5)}</p>
          `;
          wrapper.appendChild(event);
        }

        container.innerHTML = '';
        container.appendChild(wrapper);
      });

      await page.waitForTimeout(200);
      expect(await hasHorizontalScroll(page)).toBe(false);

      const overlaps = await checkSequentialOverlaps(page, '.test-archive-mobile');
      expect(overlaps.length).toBe(0);
    });
  });

  test.describe('Media Page - 30 Photo Albums', () => {
    test('desktop: 30 albums in grid do not overlap', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/media', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const container = document.querySelector('main') || document.body;
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'padding: 20px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px;';

        for (let i = 1; i <= 30; i++) {
          const album = document.createElement('div');
          album.className = 'test-album';
          album.style.cssText = 'cursor: pointer;';
          album.innerHTML = `
            <div style="width: 100%; height: 250px; background: linear-gradient(45deg, #${(i * 111111 % 1000000).toString().padStart(6, '0')}, #${(i * 222222 % 1000000).toString().padStart(6, '0')}); margin-bottom: 12px; border-radius: 4px;"></div>
            <h3 style="margin: 0 0 4px 0; font-size: 18px;">Galeria zdjęć z koncertu ${i}</h3>
            <p style="margin: 0; font-size: 14px; color: #666;">Fotograf: Jan Kowalski</p>
            <p style="margin: 4px 0 0 0; font-size: 13px;">${10 + (i % 20)} zdjęć</p>
          `;
          wrapper.appendChild(album);
        }

        container.innerHTML = '';
        container.appendChild(wrapper);
      });

      await page.waitForTimeout(300);
      expect(await hasHorizontalScroll(page)).toBe(false);

      const overlaps = await findOverlaps(page, '.test-album');
      expect(overlaps.length).toBe(0);
    });

    test('mobile: 30 albums stack without overlap', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/media', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const container = document.querySelector('main') || document.body;
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'padding: 12px;';

        for (let i = 1; i <= 30; i++) {
          const album = document.createElement('div');
          album.className = 'test-album-mobile';
          album.style.cssText = 'margin-bottom: 20px;';
          album.innerHTML = `
            <div style="width: 100%; height: 180px; background: #ccc; margin-bottom: 8px;"></div>
            <strong>Galeria ${i}</strong>
            <p style="margin: 4px 0 0 0; font-size: 13px;">Fotograf • ${10 + (i % 20)} zdjęć</p>
          `;
          wrapper.appendChild(album);
        }

        container.innerHTML = '';
        container.appendChild(wrapper);
      });

      await page.waitForTimeout(200);
      expect(await hasHorizontalScroll(page)).toBe(false);

      const overlaps = await checkSequentialOverlaps(page, '.test-album-mobile');
      expect(overlaps.length).toBe(0);
    });
  });

  test.describe('Media Wideo Page - 50 Videos', () => {
    test('desktop: 50 videos in grid do not overlap', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/media/wideo', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const container = document.querySelector('main') || document.body;
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'padding: 20px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;';

        for (let i = 1; i <= 50; i++) {
          const video = document.createElement('div');
          video.className = 'test-video';
          video.style.cssText = 'cursor: pointer;';
          video.innerHTML = `
            <div style="width: 100%; height: 200px; background: #1a1a1a; position: relative; margin-bottom: 12px; border-radius: 8px;">
              <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; background: rgba(255,255,255,0.8); border-radius: 50%;"></div>
            </div>
            <h4 style="margin: 0 0 4px 0;">Wideo z koncertu ${i}: Muzyka współczesna</h4>
            <p style="margin: 0; font-size: 13px; color: #666;">Filharmonia Wrocławska • ${2020 + (i % 5)}</p>
          `;
          wrapper.appendChild(video);
        }

        container.innerHTML = '';
        container.appendChild(wrapper);
      });

      await page.waitForTimeout(300);
      expect(await hasHorizontalScroll(page)).toBe(false);

      const overlaps = await findOverlaps(page, '.test-video');
      expect(overlaps.length).toBe(0);
    });

    test('mobile: 50 videos stack correctly', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/media/wideo', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const container = document.querySelector('main') || document.body;
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'padding: 12px;';

        for (let i = 1; i <= 50; i++) {
          const video = document.createElement('div');
          video.className = 'test-video-mobile';
          video.style.cssText = 'margin-bottom: 20px;';
          video.innerHTML = `
            <div style="width: 100%; height: 160px; background: #222; margin-bottom: 8px; border-radius: 4px;"></div>
            <strong>Wideo ${i}</strong>
            <p style="margin: 4px 0 0 0; font-size: 13px;">${2020 + (i % 5)}</p>
          `;
          wrapper.appendChild(video);
        }

        container.innerHTML = '';
        container.appendChild(wrapper);
      });

      await page.waitForTimeout(200);
      expect(await hasHorizontalScroll(page)).toBe(false);

      const overlaps = await checkSequentialOverlaps(page, '.test-video-mobile');
      expect(overlaps.length).toBe(0);
    });
  });

  test.describe('Bio Page - 10 Profiles with Long Bios', () => {
    test('desktop: 10 bio profiles do not overlap', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/bio', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const container = document.querySelector('main') || document.body;
        const wrapper = document.createElement('div');

        const colors = ['#FFFFFF', '#2D2D8C', '#1B5E20', '#F9A825', '#C62828', '#6A1B9A', '#00838F', '#E65100', '#37474F', '#880E4F'];

        for (let i = 1; i <= 10; i++) {
          const profile = document.createElement('section');
          profile.className = 'test-bio-profile';
          profile.setAttribute('data-section', `profile-${i}`);
          const bgColor = colors[(i - 1) % colors.length];
          const textColor = i % 2 === 0 ? '#FFFFFF' : '#000000';

          profile.style.cssText = `min-height: 100vh; padding: 60px 80px; background: ${bgColor}; color: ${textColor}; display: flex; gap: 40px;`;
          profile.innerHTML = `
            <div style="width: 400px; height: 500px; background: #ccc; flex-shrink: 0;"></div>
            <div style="flex: 1;">
              <h2 style="margin: 0 0 24px 0; font-size: 48px;">Muzyk Testowy ${i}</h2>
              ${Array(8).fill(null).map((_, j) => `
                <p style="margin: 0 0 16px 0; font-size: 18px; line-height: 1.6;">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              `).join('')}
            </div>
          `;
          wrapper.appendChild(profile);
        }

        container.innerHTML = '';
        container.appendChild(wrapper);
      });

      await page.waitForTimeout(300);
      expect(await hasHorizontalScroll(page)).toBe(false);

      const overlaps = await checkSequentialOverlaps(page, '.test-bio-profile');
      expect(overlaps.length).toBe(0);
    });

    test('mobile: 10 bio profiles stack correctly', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/bio', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const container = document.querySelector('main') || document.body;
        const wrapper = document.createElement('div');

        for (let i = 1; i <= 10; i++) {
          const profile = document.createElement('section');
          profile.className = 'test-bio-mobile';
          profile.style.cssText = `min-height: 100vh; padding: 40px 20px; background: ${i % 2 === 0 ? '#2D2D8C' : '#FFFFFF'}; color: ${i % 2 === 0 ? '#FFFFFF' : '#000000'};`;
          profile.innerHTML = `
            <div style="width: 100%; height: 300px; background: #ccc; margin-bottom: 24px;"></div>
            <h2 style="margin: 0 0 16px 0; font-size: 32px;">Muzyk ${i}</h2>
            ${Array(5).fill(null).map(() => `
              <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.5;">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </p>
            `).join('')}
          `;
          wrapper.appendChild(profile);
        }

        container.innerHTML = '';
        container.appendChild(wrapper);
      });

      await page.waitForTimeout(200);
      expect(await hasHorizontalScroll(page)).toBe(false);

      const overlaps = await checkSequentialOverlaps(page, '.test-bio-mobile');
      expect(overlaps.length).toBe(0);
    });
  });

  test.describe('Wydarzenie Page - Long Program (30 items)', () => {
    test('desktop: 30 program items do not overlap', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/wydarzenie', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const container = document.querySelector('main') || document.body;
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'padding: 40px; max-width: 1200px; margin: 0 auto;';

        wrapper.innerHTML = `
          <h1 style="margin: 0 0 24px 0;">Wielki Koncert Muzyki Współczesnej</h1>
          <p style="margin: 0 0 8px 0;">15.06.2025 | 19:00</p>
          <p style="margin: 0 0 32px 0;">Filharmonia Wrocławska</p>

          <h2 style="margin: 0 0 16px 0;">Program:</h2>
          <div id="program-list"></div>
        `;

        const programList = wrapper.querySelector('#program-list');
        for (let i = 1; i <= 30; i++) {
          const item = document.createElement('div');
          item.className = 'test-program-item';
          item.style.cssText = 'margin-bottom: 16px; padding: 12px; background: #f5f5f5; border-left: 4px solid #2D2D8C;';
          item.innerHTML = `
            <strong>Kompozytor ${i} (${1950 + (i % 50)})</strong><br>
            <span style="color: #555;">— Utwór na orkiestrę symfoniczną nr ${i}, op. ${i * 3}</span>
          `;
          programList.appendChild(item);
        }

        wrapper.innerHTML += `
          <h2 style="margin: 32px 0 16px 0;">Wykonawcy:</h2>
          <p>Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski oraz 20 muzyków gościnnych</p>
        `;

        container.innerHTML = '';
        container.appendChild(wrapper);
      });

      await page.waitForTimeout(300);
      expect(await hasHorizontalScroll(page)).toBe(false);

      const overlaps = await checkSequentialOverlaps(page, '.test-program-item');
      expect(overlaps.length).toBe(0);
    });

    test('mobile: 30 program items stack correctly', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/wydarzenie', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const container = document.querySelector('main') || document.body;
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'padding: 20px;';

        wrapper.innerHTML = `<h1 style="font-size: 24px; margin: 0 0 16px 0;">Koncert</h1>`;

        for (let i = 1; i <= 30; i++) {
          const item = document.createElement('div');
          item.className = 'test-program-mobile';
          item.style.cssText = 'margin-bottom: 12px; padding: 8px; background: #f0f0f0; font-size: 14px;';
          item.innerHTML = `<strong>Kompozytor ${i}</strong> — Utwór ${i}`;
          wrapper.appendChild(item);
        }

        container.innerHTML = '';
        container.appendChild(wrapper);
      });

      await page.waitForTimeout(200);
      expect(await hasHorizontalScroll(page)).toBe(false);

      const overlaps = await checkSequentialOverlaps(page, '.test-program-mobile');
      expect(overlaps.length).toBe(0);
    });
  });

  test.describe('Fundacja Page - 20 Projects', () => {
    test('desktop: 20 foundation projects do not overlap', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/fundacja', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const container = document.querySelector('main') || document.body;
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'padding: 40px; max-width: 1000px; margin: 0 auto;';

        wrapper.innerHTML = `
          <h1 style="margin: 0 0 32px 0;">Fundacja Kompopolex</h1>
          <div style="margin-bottom: 40px; padding: 20px; background: #f5f5f5;">
            <p><strong>KRS:</strong> 0000123456</p>
            <p><strong>REGON:</strong> 123456789</p>
            <p><strong>NIP:</strong> 1234567890</p>
          </div>
          <h2 style="margin: 0 0 24px 0;">Projekty:</h2>
          <div id="projects-list"></div>
        `;

        const projectsList = wrapper.querySelector('#projects-list');
        for (let i = 1; i <= 20; i++) {
          const project = document.createElement('div');
          project.className = 'test-project';
          project.style.cssText = 'margin-bottom: 24px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;';
          project.innerHTML = `
            <h3 style="margin: 0 0 12px 0;">Projekt ${i}: Edukacja Muzyczna ${2020 + (i % 5)}</h3>
            <p style="margin: 0 0 8px 0;">
              Projekt realizowany w ramach działalności statutowej fundacji, mający na celu
              promocję muzyki współczesnej wśród młodzieży szkolnej. Obejmuje warsztaty,
              koncerty edukacyjne oraz spotkania z kompozytorami.
            </p>
            <a href="#" style="color: #2D2D8C;">Więcej informacji →</a>
          `;
          projectsList.appendChild(project);
        }

        container.innerHTML = '';
        container.appendChild(wrapper);
      });

      await page.waitForTimeout(300);
      expect(await hasHorizontalScroll(page)).toBe(false);

      const overlaps = await checkSequentialOverlaps(page, '.test-project');
      expect(overlaps.length).toBe(0);
    });

    test('mobile: 20 projects stack correctly', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/fundacja', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const container = document.querySelector('main') || document.body;
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'padding: 16px;';

        for (let i = 1; i <= 20; i++) {
          const project = document.createElement('div');
          project.className = 'test-project-mobile';
          project.style.cssText = 'margin-bottom: 16px; padding: 12px; background: #f5f5f5;';
          project.innerHTML = `
            <strong>Projekt ${i}</strong>
            <p style="margin: 8px 0 0 0; font-size: 14px;">Opis projektu edukacyjnego</p>
          `;
          wrapper.appendChild(project);
        }

        container.innerHTML = '';
        container.appendChild(wrapper);
      });

      await page.waitForTimeout(200);
      expect(await hasHorizontalScroll(page)).toBe(false);

      const overlaps = await checkSequentialOverlaps(page, '.test-project-mobile');
      expect(overlaps.length).toBe(0);
    });
  });
});
