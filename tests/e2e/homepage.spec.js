import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads successfully with sections visible', async ({ page }) => {
    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Check that main content is visible
    await expect(page.locator('[data-section="hero"]')).toBeVisible();
  });

  test('displays logo', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Logo should be visible - look for img with alt="Kompopolex"
    const logo = page.locator('img[alt="Kompopolex"]').first();
    await expect(logo).toBeVisible();
  });

  test('has navigation menu with Bio and Kalendarz links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for navigation element
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Check for Bio link
    const bioLink = page.locator('a[href="/bio"]');
    await expect(bioLink).toBeVisible();

    // Check for Kalendarz link
    const kalendarzLink = page.locator('a[href="/kalendarz"]');
    await expect(kalendarzLink).toBeVisible();
  });

  test('language toggle works (PL → EN)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find language toggle button - it shows "ENG" when in PL mode
    const languageToggle = page.locator('button.language-toggle');
    await expect(languageToggle).toBeVisible();

    // Should show "ENG" initially (in PL mode)
    await expect(languageToggle).toContainText('ENG');

    // Get initial tagline text (should be Polish)
    const taglineBefore = await page.locator('section[data-section="hero"] p').first().textContent();
    expect(taglineBefore).toContain('specjalizujemy się w muzyce najnowszej');

    // Click language toggle
    await languageToggle.click();

    // Wait for content to change
    await page.waitForTimeout(300);

    // Toggle should now show "PL" (in EN mode)
    await expect(languageToggle).toContainText('PL');

    // Tagline should have changed to English
    const taglineAfter = await page.locator('section[data-section="hero"] p').first().textContent();
    expect(taglineAfter).toContain('we specialize in contemporary music');
  });

  test('language persists in localStorage after reload', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Switch to English
    const languageToggle = page.locator('button.language-toggle');
    await languageToggle.click();

    // Wait for language change
    await page.waitForTimeout(300);

    // Check localStorage
    const langBefore = await page.evaluate(() => localStorage.getItem('language'));
    expect(langBefore).toBe('en');

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Language should persist
    const langAfter = await page.evaluate(() => localStorage.getItem('language'));
    expect(langAfter).toBe('en');

    // Toggle should show PL (because we're in EN mode)
    await expect(languageToggle).toContainText('PL');
  });

  test('hero section displays', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Hero section should be visible
    const heroSection = page.locator('[data-section="hero"]');
    await expect(heroSection).toBeVisible();

    // Hero should contain logo image
    const logo = heroSection.locator('img[alt="Kompopolex"]').first();
    await expect(logo).toBeVisible();

    // Hero should contain main photo
    const mainPhoto = heroSection.locator('img').nth(1); // Second image is the main photo
    await expect(mainPhoto).toBeVisible();
  });

  test('responsive on mobile viewport (390x844)', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Page should render without horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(390);

    // Logo should still be visible on mobile
    const logo = page.locator('img[alt="Kompopolex"]').first();
    await expect(logo).toBeVisible();

    // Mobile has different layout - check for mobile-specific hero section
    const heroSection = page.locator('[data-section="hero-mobile"]');
    await expect(heroSection).toBeVisible();

    // MENU button should be visible on mobile
    const menuButton = page.locator('button:has-text("MENU")');
    await expect(menuButton).toBeVisible();
  });
});
