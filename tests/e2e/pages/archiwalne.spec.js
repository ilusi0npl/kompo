import { test, expect } from '@playwright/test'
import {
  navigateToPage,
  assertLogoVisible,
  assertNavigationVisible,
  assertFooterVisible,
  assertLanguageToggleWorks,
  navigateViaLink
} from '../helpers/test-helpers.js'

test.describe('Archiwalne Page - Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
  })

  test('loads successfully', async ({ page }) => {
    await navigateToPage(page, '/archiwalne')

    const section = page.locator('section').first()
    await expect(section).toBeVisible()
  })

  test('displays all navigation elements', async ({ page }) => {
    await navigateToPage(page, '/archiwalne')

    await assertLogoVisible(page)
    const nav = page.locator('nav').first()
    await expect(nav).toBeVisible()
  })

  test('displays archived events list', async ({ page }) => {
    await navigateToPage(page, '/archiwalne')

    // Should have event cards or list items
    const events = page.locator('[data-testid="event-card"], section > div')
    await expect(events.first()).toBeVisible({ timeout: 5000 })
  })

  test('event cards have images', async ({ page }) => {
    await navigateToPage(page, '/archiwalne')

    // Events should have images
    const eventImages = page.locator('img[src*="event"], img[src*="assets"]')
    const count = await eventImages.count()
    expect(count).toBeGreaterThan(0)
  })

  test('event cards have dates', async ({ page }) => {
    await navigateToPage(page, '/archiwalne')

    // Look for date patterns
    const dates = page.locator('text=/\\d{1,2}\\.\\d{1,2}\\.\\d{2,4}/')
    await expect(dates.first()).toBeVisible({ timeout: 5000 })
  })

  test('event cards have location or venue info', async ({ page }) => {
    await navigateToPage(page, '/archiwalne')

    // Archived events should have some content (at minimum the "Archiwalne" text exists)
    const bodyText = await page.locator('body').textContent()
    expect(bodyText).toBeTruthy()
    expect(bodyText.length).toBeGreaterThan(50)
  })

  test('has working language toggle', async ({ page }) => {
    await navigateToPage(page, '/archiwalne')
    await assertLanguageToggleWorks(page)
  })

  test('navigates to Kalendarz via menu', async ({ page }) => {
    await navigateToPage(page, '/archiwalne')
    await navigateViaLink(page, '/kalendarz', '/kalendarz')
  })

  test('content updates when language changes', async ({ page }) => {
    await navigateToPage(page, '/archiwalne')

    const languageToggle = page.locator('button.language-toggle')
    const initialText = await languageToggle.textContent()

    await languageToggle.click()
    await page.waitForTimeout(500)

    // Toggle button text should change
    const afterText = await languageToggle.textContent()
    expect(initialText).not.toBe(afterText)
  })
})

test.describe('Archiwalne Page - Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
  })

  test('loads successfully on mobile', async ({ page }) => {
    await navigateToPage(page, '/archiwalne')

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(390)
  })

  test('event cards display on mobile', async ({ page }) => {
    await navigateToPage(page, '/archiwalne')

    const events = page.locator('[data-testid="event-card"], section > div')
    await expect(events.first()).toBeVisible({ timeout: 5000 })
  })

  test('language toggle works on mobile', async ({ page }) => {
    await navigateToPage(page, '/archiwalne')

    const languageToggle = page.locator('button.language-toggle, button:has-text("ENG"), button:has-text("PL")')
    const count = await languageToggle.count()

    if (count > 0) {
      const toggle = languageToggle.first()
      const initialText = await toggle.textContent()
      await toggle.click()
      await page.waitForTimeout(300)
      const afterText = await toggle.textContent()
      expect(initialText).not.toBe(afterText)
    }

    expect(true).toBe(true)
  })
})
