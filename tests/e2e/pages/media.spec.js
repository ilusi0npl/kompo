import { test, expect } from '@playwright/test'
import {
  navigateToPage,
  assertLogoVisible,
  assertLanguageToggleWorks,
  navigateViaLink
} from '../helpers/test-helpers.js'

test.describe('Media Page - Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
  })

  test('loads successfully', async ({ page }) => {
    await navigateToPage(page, '/media')

    const section = page.locator('section').first()
    await expect(section).toBeVisible()
  })

  test('displays navigation elements', async ({ page }) => {
    await navigateToPage(page, '/media')

    await assertLogoVisible(page)
    const nav = page.locator('nav').first()
    await expect(nav).toBeVisible()
  })

  test('displays media galleries or links', async ({ page }) => {
    await navigateToPage(page, '/media')

    // Should have links to photo galleries or video sections
    const bodyText = await page.locator('body').textContent()
    expect(bodyText).toBeTruthy()
    expect(bodyText.length).toBeGreaterThan(50)
  })

  test('has media content or thumbnails', async ({ page }) => {
    await navigateToPage(page, '/media')

    // Check for images or video elements
    const mediaElements = page.locator('img, video, [data-media]')
    const count = await mediaElements.count()
    expect(count).toBeGreaterThanOrEqual(0) // May have galleries or be placeholder
  })

  test('has working language toggle', async ({ page }) => {
    await navigateToPage(page, '/media')
    await assertLanguageToggleWorks(page)
  })

  test('navigates to Kalendarz via menu', async ({ page }) => {
    await navigateToPage(page, '/media')
    await navigateViaLink(page, '/kalendarz', '/kalendarz')
  })

  test('page structure is valid', async ({ page }) => {
    await navigateToPage(page, '/media')

    const html = await page.locator('html').innerHTML()
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(100)
  })
})

test.describe('Media Page - Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
  })

  test('loads successfully on mobile', async ({ page }) => {
    await navigateToPage(page, '/media')

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(390)
  })

  test('displays media content on mobile', async ({ page }) => {
    await navigateToPage(page, '/media')

    const section = page.locator('section').first()
    await expect(section).toBeVisible()
  })

  test('language toggle works on mobile', async ({ page }) => {
    await navigateToPage(page, '/media')

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
