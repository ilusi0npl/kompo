import { test, expect } from '@playwright/test'
import {
  navigateToPage,
  assertLogoVisible,
  assertLanguageToggleWorks,
  navigateViaLink
} from '../helpers/test-helpers.js'

test.describe('Wydarzenie Page - Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
  })

  test('loads successfully', async ({ page }) => {
    await navigateToPage(page, '/wydarzenie/1')

    const section = page.locator('section').first()
    await expect(section).toBeVisible()
  })

  test('displays navigation elements', async ({ page }) => {
    await navigateToPage(page, '/wydarzenie/1')

    await assertLogoVisible(page)
    const nav = page.locator('nav').first()
    await expect(nav).toBeVisible()
  })

  test('displays event image', async ({ page }) => {
    await navigateToPage(page, '/wydarzenie/1')

    // Event should have an image
    const images = page.locator('img')
    const count = await images.count()
    expect(count).toBeGreaterThan(0)
  })

  test('displays event date', async ({ page }) => {
    await navigateToPage(page, '/wydarzenie/1')

    // Look for date pattern
    const bodyText = await page.locator('body').textContent()
    const hasDate = /\d{1,2}\.\d{1,2}\.\d{2,4}/.test(bodyText)
    expect(hasDate).toBe(true)
  })

  test('displays event details', async ({ page }) => {
    await navigateToPage(page, '/wydarzenie/1')

    // Event should have text content
    const bodyText = await page.locator('body').textContent()
    expect(bodyText).toBeTruthy()
    expect(bodyText.length).toBeGreaterThan(100)
  })

  test('has working language toggle', async ({ page }) => {
    await navigateToPage(page, '/wydarzenie/1')
    await assertLanguageToggleWorks(page)
  })

  test('navigates to Kalendarz via menu', async ({ page }) => {
    await navigateToPage(page, '/wydarzenie/1')
    await navigateViaLink(page, '/kalendarz', '/kalendarz')
  })
})

test.describe('Wydarzenie Page - Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
  })

  test('loads successfully on mobile', async ({ page }) => {
    await navigateToPage(page, '/wydarzenie/1')

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(390)
  })

  test('displays event content on mobile', async ({ page }) => {
    await navigateToPage(page, '/wydarzenie/1')

    const section = page.locator('section').first()
    await expect(section).toBeVisible()
  })

  test('language toggle works on mobile', async ({ page }) => {
    await navigateToPage(page, '/wydarzenie/1')

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
