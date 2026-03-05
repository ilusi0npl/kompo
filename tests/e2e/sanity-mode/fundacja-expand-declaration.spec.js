// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Fundacja - Accessibility Declaration Expand (Sanity)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fundacja');
    await page.waitForLoadState('networkidle');
  });

  test('expand button should toggle accessibility declaration content with CMS data', async ({ page }) => {
    const expandButton = page.locator('button', { hasText: /deklaracja dostępności/i });
    await expect(expandButton).toBeVisible();

    // Plus icon should be visible before expand
    const plusIcon = expandButton.locator('img[alt="Expand"]');
    await expect(plusIcon).toBeVisible();

    // Click to expand
    await expandButton.click();

    // Close icon should appear after expand
    const closeIcon = expandButton.locator('img[alt="Collapse"]');
    await expect(closeIcon).toBeVisible({ timeout: 3000 });

    // Expanded content should have paragraphs with actual text from CMS
    const expandedSection = page.locator('button:has-text("DEKLARACJA") + div, button:has-text("deklaracja") + div').first();
    await expect(expandedSection).toBeVisible({ timeout: 3000 });
    const paragraphs = expandedSection.locator('p');
    const count = await paragraphs.count();
    expect(count).toBeGreaterThan(0);

    // Verify text content is not empty
    const firstParagraph = paragraphs.first();
    const text = await firstParagraph.textContent();
    expect(text.length).toBeGreaterThan(10);

    // Click again to collapse
    await expandButton.click();

    // Plus icon should return
    await expect(plusIcon).toBeVisible({ timeout: 3000 });
  });
});
