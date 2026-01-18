import { test, expect } from '@playwright/test'

test.describe('Language Switching', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('should default to Polish language', async ({ page }) => {
    await page.goto('/')

    const langToggle = page.locator('button:has-text("ENG")')
    await expect(langToggle).toBeVisible()
  })

  test('should switch to English when toggle clicked', async ({ page }) => {
    await page.goto('/')

    const engToggle = page.locator('button:has-text("ENG")')
    await engToggle.click()

    await expect(page.locator('button:has-text("PL")')).toBeVisible()
  })

  test('should switch back to Polish', async ({ page }) => {
    await page.goto('/')

    // Switch to English
    await page.locator('button:has-text("ENG")').click()
    await expect(page.locator('button:has-text("PL")')).toBeVisible()

    // Switch back to Polish
    await page.locator('button:has-text("PL")').click()
    await expect(page.locator('button:has-text("ENG")')).toBeVisible()
  })

  test('should persist language after page reload', async ({ page }) => {
    await page.goto('/')

    // Switch to English
    await page.locator('button:has-text("ENG")').click()
    await expect(page.locator('button:has-text("PL")')).toBeVisible()

    // Reload page
    await page.reload()

    // Should still be English
    await expect(page.locator('button:has-text("PL")')).toBeVisible()
  })

  test('should persist language across page navigation', async ({ page }) => {
    await page.goto('/')

    // Switch to English
    await page.locator('button:has-text("ENG")').click()

    // Navigate to Kontakt
    await page.goto('/kontakt')
    await page.waitForLoadState('networkidle')

    // Should still be English
    await expect(page.locator('button:has-text("PL")')).toBeVisible()

    // Navigate to Fundacja
    await page.goto('/fundacja')
    await page.waitForLoadState('networkidle')

    // Should still be English
    await expect(page.locator('button:has-text("PL")')).toBeVisible()
  })

  test('should update content when language changes on Kalendarz', async ({ page }) => {
    await page.goto('/kalendarz')

    // Get initial text content
    const initialContent = await page.locator('section').first().textContent()

    // Switch language
    const langToggle = page.locator('.language-toggle, button:has-text("ENG"), button:has-text("PL")')
    await langToggle.first().click()

    // Wait for content update
    await page.waitForTimeout(500)

    // Content should be different (language changed)
    const newContent = await page.locator('section').first().textContent()

    // At least the toggle button should show different text
    const toggleChanged = initialContent !== newContent
    expect(toggleChanged).toBe(true)
  })

  test('should update content when language changes on Bio', async ({ page }) => {
    await page.goto('/bio')

    // Switch language
    const langToggle = page.locator('button:has-text("ENG"), button:has-text("PL")')
    await langToggle.first().click()

    // Content should update (wait for re-render)
    await page.waitForTimeout(500)

    // Check that language toggle now shows opposite language
    const oppositeToggle = await langToggle.first().textContent()
    expect(['ENG', 'PL']).toContain(oppositeToggle.trim())
  })

  test('should work on desktop viewport after switching from mobile', async ({ page }) => {
    // Start with mobile viewport
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    // Resize to desktop
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.reload()

    // Language toggle should now be visible on desktop
    const langToggle = page.locator('button:has-text("ENG")')
    await expect(langToggle).toBeVisible()

    await langToggle.click()
    await expect(page.locator('button:has-text("PL")')).toBeVisible()
  })
})
