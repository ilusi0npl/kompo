// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Fundacja - Accessibility Declaration Expand', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fundacja');
    await page.waitForLoadState('networkidle');
  });

  test('expand button should toggle accessibility declaration content', async ({ page }) => {
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

    // Expanded content should have paragraphs (sibling div after button)
    // Use the button + next sibling pattern
    const expandedSection = page.locator('button:has-text("DEKLARACJA") + div, button:has-text("deklaracja") + div').first();
    await expect(expandedSection).toBeVisible({ timeout: 3000 });
    const paragraphs = expandedSection.locator('p');
    const count = await paragraphs.count();
    expect(count).toBeGreaterThan(0);

    // Click again to collapse
    await expandButton.click();

    // Plus icon should return
    await expect(plusIcon).toBeVisible({ timeout: 3000 });
  });
});
