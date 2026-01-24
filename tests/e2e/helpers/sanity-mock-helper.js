/**
 * Sanity API Mock Helper for Playwright E2E Tests
 * Intercepts Sanity API requests and returns mock data
 */

// Sanity API URL patterns
const SANITY_API_PATTERN = /https:\/\/.*\.api\.sanity\.io\/.*\/data\/query/;
const SANITY_CDN_PATTERN = /https:\/\/cdn\.sanity\.io/;

/**
 * Mock Sanity API responses with provided data
 * @param {import('@playwright/test').Page} page - Playwright page
 * @param {Object} mockData - Mock data to return for different queries
 * @param {Object} options - Additional options
 */
export async function mockSanityResponses(page, mockData, options = {}) {
  const { delay = 0, logRequests = false } = options;

  await page.route(SANITY_API_PATTERN, async (route) => {
    const url = route.request().url();
    const decodedUrl = decodeURIComponent(url);

    if (logRequests) {
      console.log('[Sanity Mock] Intercepted:', decodedUrl.slice(0, 200));
    }

    // Add optional delay to simulate network latency
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Determine which data to return based on query content
    let result = determineResult(decodedUrl, mockData);

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ result }),
    });
  });

  // Optionally mock CDN requests for images
  if (mockData.mockImages !== false) {
    await page.route(SANITY_CDN_PATTERN, async (route) => {
      // Return a placeholder image or let it pass through
      if (options.blockImages) {
        await route.fulfill({
          status: 200,
          contentType: 'image/png',
          body: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'),
        });
      } else {
        await route.continue();
      }
    });
  }
}

/**
 * Determine which mock data to return based on query
 */
function determineResult(query, mockData) {
  // Events
  if (query.includes('_type == "event"') || query.includes("_type == 'event'")) {
    if (query.includes('status == "upcoming"') || query.includes("status == 'upcoming'")) {
      return mockData.upcomingEvents || mockData.events || [];
    }
    if (query.includes('status == "archived"') || query.includes("status == 'archived'")) {
      return mockData.archivedEvents || [];
    }
    // Single event query (by ID)
    if (query.includes('_id ==')) {
      const events = mockData.events || mockData.upcomingEvents || [];
      return events[0] || null;
    }
    return mockData.events || [];
  }

  // Bio Profiles
  if (query.includes('_type == "bioProfile"') || query.includes("_type == 'bioProfile'")) {
    return mockData.bioProfiles || [];
  }

  // Homepage Slides
  if (query.includes('_type == "homepageSlide"') || query.includes("_type == 'homepageSlide'")) {
    return mockData.slides || [];
  }

  // Photo Albums
  if (query.includes('_type == "photoAlbum"') || query.includes("_type == 'photoAlbum'")) {
    return mockData.photoAlbums || [];
  }

  // Videos / Media
  if (query.includes('_type == "media"') || query.includes("_type == 'media'")) {
    if (query.includes('type == "video"') || query.includes("type == 'video'")) {
      return mockData.videos || [];
    }
    return mockData.media || mockData.videos || [];
  }

  // Fundacja Page (singleton)
  if (query.includes('_type == "fundacjaPage"') || query.includes("_type == 'fundacjaPage'")) {
    return mockData.fundacjaPage || null;
  }

  // Kontakt Page (singleton)
  if (query.includes('_type == "kontaktPage"') || query.includes("_type == 'kontaktPage'")) {
    return mockData.kontaktPage || null;
  }

  // Composers
  if (query.includes('_type == "composer"') || query.includes("_type == 'composer'")) {
    if (query.includes('category == "repertuar"') || query.includes("category == 'repertuar'")) {
      return (mockData.composers || []).filter(c => c.category === 'repertuar');
    }
    if (query.includes('category == "specialne"') || query.includes("category == 'specialne'")) {
      return (mockData.composers || []).filter(c => c.category === 'specialne');
    }
    return mockData.composers || [];
  }

  // Default: return empty array
  console.warn('[Sanity Mock] Unknown query pattern, returning empty array');
  return [];
}

/**
 * Mock Sanity API to return an error
 * @param {import('@playwright/test').Page} page - Playwright page
 * @param {number} statusCode - HTTP status code to return
 * @param {string} errorMessage - Error message
 */
export async function mockSanityError(page, statusCode = 500, errorMessage = 'Internal Server Error') {
  await page.route(SANITY_API_PATTERN, async (route) => {
    await route.fulfill({
      status: statusCode,
      contentType: 'application/json',
      body: JSON.stringify({
        error: {
          description: errorMessage,
          type: 'serverError',
        },
      }),
    });
  });
}

/**
 * Mock Sanity API with slow response (for timeout testing)
 * @param {import('@playwright/test').Page} page - Playwright page
 * @param {number} delayMs - Delay in milliseconds
 * @param {Object} mockData - Data to eventually return
 */
export async function mockSanitySlowResponse(page, delayMs = 5000, mockData = {}) {
  await page.route(SANITY_API_PATTERN, async (route) => {
    await new Promise(resolve => setTimeout(resolve, delayMs));

    const url = route.request().url();
    const decodedUrl = decodeURIComponent(url);
    const result = determineResult(decodedUrl, mockData);

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ result }),
    });
  });
}

/**
 * Mock Sanity API to abort requests (network failure simulation)
 * @param {import('@playwright/test').Page} page - Playwright page
 */
export async function mockSanityNetworkFailure(page) {
  await page.route(SANITY_API_PATTERN, async (route) => {
    await route.abort('failed');
  });
}

/**
 * Setup a complete test scenario with mock data
 * @param {import('@playwright/test').Page} page - Playwright page
 * @param {Object} scenario - Scenario from scenarios.js
 * @param {Object} options - Additional options
 */
export async function setupScenario(page, scenario, options = {}) {
  const {
    enableSanity = true,
    delay = 0,
    logRequests = false,
    blockImages = false,
  } = options;

  // Force Sanity mode if needed (inject into page context)
  if (enableSanity) {
    await page.addInitScript(() => {
      // Override environment variable check
      window.__VITE_USE_SANITY__ = 'true';
    });
  }

  await mockSanityResponses(page, scenario, { delay, logRequests, blockImages });
}

/**
 * Helper to verify no undefined/null text is displayed
 * @param {import('@playwright/test').Page} page - Playwright page
 */
export async function assertNoUndefinedNull(page) {
  const bodyText = await page.locator('body').textContent();

  // Check for literal "undefined" or "null" strings (case-insensitive)
  const hasUndefined = /\bundefined\b/i.test(bodyText);
  const hasNull = /\bnull\b/i.test(bodyText);

  return {
    hasUndefined,
    hasNull,
    issues: [
      hasUndefined && 'Found "undefined" in page content',
      hasNull && 'Found "null" in page content',
    ].filter(Boolean),
  };
}

/**
 * Helper to check for horizontal scroll (overflow)
 * @param {import('@playwright/test').Page} page - Playwright page
 */
export async function hasHorizontalScroll(page) {
  return await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
}

/**
 * Helper to check for broken images
 * @param {import('@playwright/test').Page} page - Playwright page
 */
export async function getBrokenImages(page) {
  return await page.locator('img').evaluateAll(imgs => {
    return imgs
      .filter(img => !img.complete || img.naturalWidth === 0)
      .map(img => ({
        src: img.src,
        alt: img.alt,
      }));
  });
}

/**
 * Helper to check for XSS - scripts that shouldn't be there
 * @param {import('@playwright/test').Page} page - Playwright page
 */
export async function checkForXSS(page) {
  return await page.evaluate(() => {
    // Check for inline scripts that contain alert/document.cookie
    const suspiciousScripts = Array.from(document.querySelectorAll('script:not([src])'))
      .filter(script => {
        const content = script.textContent || '';
        return content.includes('alert(') ||
               content.includes('document.cookie') ||
               content.includes('onerror=');
      });

    // Check for event handlers in HTML
    const elementsWithHandlers = document.querySelectorAll('[onclick], [onerror], [onload], [onmouseover]');

    return {
      hasSuspiciousScripts: suspiciousScripts.length > 0,
      hasEventHandlers: elementsWithHandlers.length > 0,
      scriptCount: suspiciousScripts.length,
      handlerCount: elementsWithHandlers.length,
    };
  });
}

export default {
  mockSanityResponses,
  mockSanityError,
  mockSanitySlowResponse,
  mockSanityNetworkFailure,
  setupScenario,
  assertNoUndefinedNull,
  hasHorizontalScroll,
  getBrokenImages,
  checkForXSS,
};
