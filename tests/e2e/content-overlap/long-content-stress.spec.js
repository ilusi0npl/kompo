/**
 * Long Content Stress Tests - NON-CMS MODE
 *
 * These tests inject long content directly into the DOM to simulate
 * what would happen if CMS contained very long text. Tests verify that
 * layouts handle extreme content gracefully without overlaps.
 */

import { test, expect } from '@playwright/test';

/**
 * Check if two bounding boxes overlap
 */
function doBoxesOverlap(box1, box2, threshold = 5) {
  if (!box1 || !box2) return false;
  return !(
    box1.x + box1.width <= box2.x + threshold ||
    box2.x + box2.width <= box1.x + threshold ||
    box1.y + box1.height <= box2.y + threshold ||
    box2.y + box2.height <= box1.y + threshold
  );
}

/**
 * Generate long text
 */
function generateLongText(words = 100) {
  const lorem = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua';
  return Array(Math.ceil(words / 10)).fill(lorem).join(' ').split(' ').slice(0, words).join(' ');
}

/**
 * Check for horizontal scroll
 */
async function hasHorizontalScroll(page) {
  return page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
}

test.describe('Long Content Stress Tests - Non-CMS Mode', () => {

  test.describe('Bio Page - Long Content', () => {
    test('handles very long name without layout break', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/bio', { waitUntil: 'networkidle' });

      // Inject very long name into first profile
      await page.evaluate(() => {
        const nameEl = document.querySelector('h1, h2, [class*="name"]');
        if (nameEl) {
          nameEl.textContent = 'Aleksandra Maria Katarzyna Joanna Elżbieta Konstancja Gołaj-Kowalska-Nowak-Wiśniewska';
        }
      });

      // Wait for reflow
      await page.waitForTimeout(100);

      expect(await hasHorizontalScroll(page)).toBe(false);
    });

    test('handles 20 long paragraphs without overlap', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/bio', { waitUntil: 'networkidle' });

      // Find first bio section with paragraphs
      const section = page.locator('[data-section]').first();
      await section.scrollIntoViewIfNeeded();

      // Inject many long paragraphs
      await page.evaluate((longText) => {
        const sections = document.querySelectorAll('[data-section]');
        if (sections[1]) { // Use second section (first profile)
          const container = sections[1].querySelector('div') || sections[1];
          const paragraphs = container.querySelectorAll('p');

          // Add more paragraphs if needed
          for (let i = paragraphs.length; i < 20; i++) {
            const p = document.createElement('p');
            p.textContent = longText;
            p.style.marginBottom = '16px';
            container.appendChild(p);
          }

          // Make existing paragraphs longer
          paragraphs.forEach(p => {
            p.textContent = longText;
          });
        }
      }, generateLongText(150));

      await page.waitForTimeout(200);

      expect(await hasHorizontalScroll(page)).toBe(false);

      // Check paragraphs don't overlap
      const paragraphs = page.locator('[data-section]').nth(1).locator('p');
      const count = await paragraphs.count();

      if (count >= 2) {
        for (let i = 0; i < count - 1; i++) {
          const box1 = await paragraphs.nth(i).boundingBox();
          const box2 = await paragraphs.nth(i + 1).boundingBox();
          if (box1 && box2 && box1.height > 0 && box2.height > 0) {
            expect(
              doBoxesOverlap(box1, box2),
              `Paragraphs ${i} and ${i + 1} overlap after content injection`
            ).toBe(false);
          }
        }
      }
    });

    test('mobile handles long bio content', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/bio', { waitUntil: 'networkidle' });

      // Inject long content
      await page.evaluate((longText) => {
        document.querySelectorAll('p').forEach(p => {
          p.textContent = longText;
        });
      }, generateLongText(200));

      await page.waitForTimeout(100);

      expect(await hasHorizontalScroll(page)).toBe(false);
    });
  });

  test.describe('Kalendarz Page - Long Content', () => {
    test('handles very long event title', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/kalendarz', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const titles = document.querySelectorAll('h1, h2, h3, [class*="title"]');
        titles.forEach(t => {
          t.textContent = 'Niezwykły Koncert Muzyki Współczesnej z Udziałem Wybitnych Artystów Polskich i Zagranicznych w Ramach Międzynarodowego Festiwalu';
        });
      });

      await page.waitForTimeout(100);

      expect(await hasHorizontalScroll(page)).toBe(false);
    });

    test('handles very long event description', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/kalendarz', { waitUntil: 'networkidle' });

      await page.evaluate((longText) => {
        const descriptions = document.querySelectorAll('p, [class*="description"]');
        descriptions.forEach(d => {
          d.textContent = longText;
        });
      }, generateLongText(300));

      await page.waitForTimeout(100);

      expect(await hasHorizontalScroll(page)).toBe(false);
    });

    test('handles long performers list', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/kalendarz', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const performers = document.querySelectorAll('[class*="performer"], [class*="artist"]');
        const longPerformers = 'Aleksandra Gołaj, Rafał Łuc, Jacek Sotomski, Maria Kowalska, Jan Nowak, ' +
          'Katarzyna Wiśniewska, Piotr Zieliński, Anna Wójcik, Tomasz Kamiński, Ewa Lewandowska, ' +
          'Michał Szymański, Agnieszka Dąbrowska, Krzysztof Kozłowski, Małgorzata Jankowska';
        performers.forEach(p => {
          p.textContent = longPerformers;
        });
      });

      await page.waitForTimeout(100);

      expect(await hasHorizontalScroll(page)).toBe(false);
    });

    test('mobile handles long event content', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/kalendarz', { waitUntil: 'networkidle' });

      await page.evaluate((longText) => {
        document.querySelectorAll('h1, h2, h3').forEach(h => {
          h.textContent = 'Bardzo Długi Tytuł Koncertu Muzyki Współczesnej';
        });
        document.querySelectorAll('p').forEach(p => {
          p.textContent = longText;
        });
      }, generateLongText(200));

      await page.waitForTimeout(100);

      expect(await hasHorizontalScroll(page)).toBe(false);
    });
  });

  test.describe('Wydarzenie Page - Long Content', () => {
    test('handles long program list (20+ items)', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/wydarzenie', { waitUntil: 'networkidle' });

      // Find program section and add many items
      await page.evaluate(() => {
        const programSection = document.querySelector('[class*="program"]') ||
          document.querySelector('ul, ol') ||
          document.body;

        if (programSection) {
          for (let i = 0; i < 20; i++) {
            const item = document.createElement('div');
            item.innerHTML = `<strong>Kompozytor ${i + 1} (1950-2020)</strong> - Bardzo Długa Nazwa Utworu Muzycznego Nr ${i + 1} na Orkiestrę i Solistów`;
            item.style.marginBottom = '8px';
            programSection.appendChild(item);
          }
        }
      });

      await page.waitForTimeout(100);

      expect(await hasHorizontalScroll(page)).toBe(false);
    });

    test('handles very long location text', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/wydarzenie', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const locationEls = document.querySelectorAll('[class*="location"], address');
        const longLocation = 'Akademia Sztuk Pięknych im. Eugeniusza Gepperta we Wrocławiu, ' +
          'Wydział Malarstwa i Rzeźby, Sala Koncertowa im. Witolda Lutosławskiego, ' +
          'Plac Polski 3/4, 50-156 Wrocław, Polska';
        locationEls.forEach(l => {
          l.textContent = longLocation;
        });
      });

      await page.waitForTimeout(100);

      expect(await hasHorizontalScroll(page)).toBe(false);
    });

    test('mobile handles long event details', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/wydarzenie', { waitUntil: 'networkidle' });

      await page.evaluate((longText) => {
        document.querySelectorAll('p').forEach(p => {
          p.textContent = longText;
        });
      }, generateLongText(150));

      await page.waitForTimeout(100);

      expect(await hasHorizontalScroll(page)).toBe(false);
    });
  });

  test.describe('Homepage - Long Content', () => {
    test('handles very long tagline', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const taglines = document.querySelectorAll('[class*="tagline"], p, span');
        const longTagline = 'Ensemble muzyki współczesnej założony we Wrocławiu przez absolwentów Akademii Muzycznej specjalizujący się w wykonaniach utworów kompozytorów polskich i zagranicznych XXI wieku';
        taglines.forEach(t => {
          if (t.textContent && t.textContent.length < 200) {
            t.textContent = longTagline;
          }
        });
      });

      await page.waitForTimeout(100);

      expect(await hasHorizontalScroll(page)).toBe(false);
    });

    test('mobile handles long tagline', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const taglines = document.querySelectorAll('[class*="tagline"], p');
        const longTagline = 'Ensemble muzyki współczesnej założony we Wrocławiu przez absolwentów Akademii Muzycznej';
        taglines.forEach(t => {
          if (t.textContent && t.textContent.length < 200) {
            t.textContent = longTagline;
          }
        });
      });

      await page.waitForTimeout(100);

      expect(await hasHorizontalScroll(page)).toBe(false);
    });
  });

  test.describe('Fundacja Page - Long Content', () => {
    test('handles very long project descriptions', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/fundacja', { waitUntil: 'networkidle' });

      await page.evaluate((longText) => {
        document.querySelectorAll('p').forEach(p => {
          p.textContent = longText;
        });
      }, generateLongText(300));

      await page.waitForTimeout(100);

      expect(await hasHorizontalScroll(page)).toBe(false);
    });

    test('handles very long accessibility declaration', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/fundacja', { waitUntil: 'networkidle' });

      await page.evaluate((longText) => {
        // Add many paragraphs to simulate long accessibility declaration
        const main = document.querySelector('main') || document.body;
        for (let i = 0; i < 10; i++) {
          const p = document.createElement('p');
          p.textContent = longText;
          p.style.marginBottom = '16px';
          main.appendChild(p);
        }
      }, generateLongText(200));

      await page.waitForTimeout(100);

      expect(await hasHorizontalScroll(page)).toBe(false);
    });

    test('mobile handles long fundacja content', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/fundacja', { waitUntil: 'networkidle' });

      await page.evaluate((longText) => {
        document.querySelectorAll('p').forEach(p => {
          p.textContent = longText;
        });
      }, generateLongText(200));

      await page.waitForTimeout(100);

      expect(await hasHorizontalScroll(page)).toBe(false);
    });
  });

  test.describe('Repertuar Page - Long Content', () => {
    test('handles 100+ composer entries', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/repertuar', { waitUntil: 'networkidle' });

      // Add many composer entries
      await page.evaluate(() => {
        const container = document.querySelector('main') || document.body;
        for (let i = 0; i < 100; i++) {
          const entry = document.createElement('div');
          entry.innerHTML = `
            <h3>Kompozytor Testowy ${i + 1} (${1900 + i})</h3>
            <ul>
              <li>Utwór pierwszy na orkiestrę</li>
              <li>Utwór drugi na kwartet smyczkowy</li>
              <li>Utwór trzeci na fortepian solo</li>
            </ul>
          `;
          entry.style.marginBottom = '24px';
          container.appendChild(entry);
        }
      });

      await page.waitForTimeout(200);

      expect(await hasHorizontalScroll(page)).toBe(false);
    });

    test('handles very long work titles', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/repertuar', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const items = document.querySelectorAll('li, [class*="work"]');
        const longTitle = 'Koncert na fortepian i orkiestrę symfoniczną nr 3 "Памяти великого мастера" z dedykacją dla Międzynarodowego Festiwalu Muzyki Współczesnej';
        items.forEach(item => {
          item.textContent = longTitle;
        });
      });

      await page.waitForTimeout(100);

      expect(await hasHorizontalScroll(page)).toBe(false);
    });

    test('mobile handles many composers', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/repertuar', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const container = document.querySelector('main') || document.body;
        for (let i = 0; i < 50; i++) {
          const entry = document.createElement('div');
          entry.innerHTML = `<strong>Kompozytor ${i + 1}</strong> - Utwór testowy`;
          entry.style.marginBottom = '12px';
          container.appendChild(entry);
        }
      });

      await page.waitForTimeout(100);

      expect(await hasHorizontalScroll(page)).toBe(false);
    });
  });

  test.describe('Media Page - Long Content', () => {
    test('handles very long album titles', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/media', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const titles = document.querySelectorAll('[class*="title"], h2, h3');
        const longTitle = 'Galeria Zdjęć z Koncertu Inauguracyjnego Sezonu Artystycznego 2024/2025 w Filharmonii Wrocławskiej';
        titles.forEach(t => {
          t.textContent = longTitle;
        });
      });

      await page.waitForTimeout(100);

      expect(await hasHorizontalScroll(page)).toBe(false);
    });

    test('mobile handles long album titles', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/media', { waitUntil: 'networkidle' });

      await page.evaluate(() => {
        const titles = document.querySelectorAll('[class*="title"], h2, h3');
        const longTitle = 'Galeria Zdjęć z Koncertu Inauguracyjnego Sezonu 2024/2025';
        titles.forEach(t => {
          t.textContent = longTitle;
        });
      });

      await page.waitForTimeout(100);

      expect(await hasHorizontalScroll(page)).toBe(false);
    });
  });
});
