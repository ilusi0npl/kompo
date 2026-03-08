// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test: Event page renders correctly when description is null/empty
 * Regression test for events without descriptions after removing placeholder data.
 */

const EVENT_ID = '62d17789-071b-4399-92a0-37b2dbceb0e9';
const EVENT_URL = `/wydarzenie/${EVENT_ID}`;

test.describe('Event page without description', () => {
  test('should render event page without crashing when description is missing', async ({ page }) => {
    // Collect all console messages for debugging
    const consoleMessages = [];
    page.on('console', (msg) => {
      consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
    });

    // Catch uncaught page errors
    const pageErrors = [];
    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
    });

    // Navigate to event page
    await page.goto(EVENT_URL, { waitUntil: 'networkidle' });

    // Debug output
    const bodyText = await page.locator('body').innerText();
    console.log('=== PAGE ERRORS ===', pageErrors);
    console.log('=== CONSOLE ERRORS ===', consoleMessages.filter(m => m.startsWith('[error]')));
    console.log('=== BODY TEXT (500) ===', bodyText.substring(0, 500));

    // Page should not have uncaught errors
    expect(pageErrors).toHaveLength(0);

    // Event title should be visible
    const title = page.locator('text=kmpplx live');
    await expect(title.first()).toBeVisible({ timeout: 10000 });

    // Program section should render with composer names
    const composer = page.locator('text=Paweł Malinowski');
    await expect(composer).toBeVisible({ timeout: 5000 });

    // Footer should be visible (page rendered completely)
    // Footer component renders as a div with email text, not a <footer> element
    const footer = page.locator('text=KOMPOPOLEX@GMAIL.COM');
    await expect(footer.first()).toBeVisible({ timeout: 5000 });
  });
});
