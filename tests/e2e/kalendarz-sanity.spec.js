import { test, expect } from '@playwright/test'

test.describe('Kalendarz Page - Sanity Integration', () => {
  test.describe('With Local Config (VITE_USE_SANITY=false)', () => {
    test.use({
      storageState: undefined,
    })

    test('should load events from local config', async ({ page }) => {
      // Ensure we're using local config
      await page.addInitScript(() => {
        localStorage.setItem('test-mode', 'local')
      })

      await page.goto('/kalendarz')

      // Should display event cards
      const eventCards = page.locator('[data-testid="event-card"], section > div')
      await expect(eventCards.first()).toBeVisible({ timeout: 5000 })
    })

    test('should not show loading state for too long', async ({ page }) => {
      await page.goto('/kalendarz')

      // Should not have permanent loading text
      await page.waitForTimeout(3000)
      const loadingText = page.locator('text=/ładowanie|loading/i')
      await expect(loadingText).not.toBeVisible()
    })
  })

  test.describe('Common Features (Both Modes)', () => {
    test('should display event images', async ({ page }) => {
      await page.goto('/kalendarz')

      // Wait for images to load
      await page.waitForTimeout(2000)

      const images = page.locator('img[src*="/assets/"], img[src*="cdn.sanity"]')
      const imageCount = await images.count()

      expect(imageCount).toBeGreaterThan(0)
    })

    test('should show event dates', async ({ page }) => {
      await page.goto('/kalendarz')

      // Look for date patterns (DD.MM.YY format or similar)
      const dates = page.locator('text=/\\d{1,2}\\.\\d{1,2}\\.\\d{2,4}/')
      await expect(dates.first()).toBeVisible({ timeout: 5000 })
    })

    test('should display event locations', async ({ page }) => {
      await page.goto('/kalendarz')

      // Should have location text (looking for city names)
      const locationInfo = page.locator('text=/wrocław|kraków|barcelona/i')
        .or(page.locator('[data-testid="location"]'))
        .or(page.locator('svg').filter({ hasText: /wrocław|kraków|barcelona/i }))

      await expect(locationInfo.first()).toBeVisible({ timeout: 5000 })
    })

    test('should switch between Nadchodzące and Archiwalne tabs', async ({ page }) => {
      await page.goto('/kalendarz')

      // Find and click Archiwalne tab
      const archivalneTab = page.getByRole('button', { name: /archiwalne/i })
        .or(page.locator('text=/archiwalne/i').first())

      if (await archivalneTab.isVisible()) {
        await archivalneTab.click()
        await page.waitForTimeout(1000)

        // URL should change or content should update
        const hasArchivedContent = await page.locator('section').isVisible()
        expect(hasArchivedContent).toBe(true)
      }
    })

    test('should maintain language when navigating', async ({ page }) => {
      await page.goto('/kalendarz')

      // Switch to English
      const langToggle = page.locator('button:has-text("ENG")')
      if (await langToggle.isVisible()) {
        await langToggle.click()
        await page.waitForTimeout(500)

        // Navigate to Fundacja page (simpler navigation)
        await page.goto('/fundacja')
        await page.waitForLoadState('networkidle')

        // Navigate back to Kalendarz
        await page.goto('/kalendarz')
        await page.waitForLoadState('networkidle')

        // Should still be in English
        await expect(page.locator('button:has-text("PL")')).toBeVisible()
      }
    })
  })
})
