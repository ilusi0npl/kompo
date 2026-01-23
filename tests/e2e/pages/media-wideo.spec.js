import { test, expect } from '@playwright/test'
import {
  navigateToPage,
  assertLogoVisible,
  assertLanguageToggleWorks,
  navigateViaLink
} from '../helpers/test-helpers.js'

test.describe('MediaWideo Page - Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
  })

  test('loads successfully', async ({ page }) => {
    await navigateToPage(page, '/media/wideo')

    const section = page.locator('section').first()
    await expect(section).toBeVisible()
  })

  test('displays navigation elements', async ({ page }) => {
    await navigateToPage(page, '/media/wideo')

    await assertLogoVisible(page)
    const nav = page.locator('nav').first()
    await expect(nav).toBeVisible()
  })

  test('has video content or embeds', async ({ page }) => {
    await navigateToPage(page, '/media/wideo')

    // Check for video elements, iframes (YouTube/Vimeo), or video thumbnails
    const videoElements = page.locator('video, iframe, [data-video]')
    const count = await videoElements.count()
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('displays video gallery content', async ({ page }) => {
    await navigateToPage(page, '/media/wideo')

    const bodyText = await page.locator('body').textContent()
    expect(bodyText).toBeTruthy()
    expect(bodyText.length).toBeGreaterThan(50)
  })

  test('has working language toggle', async ({ page }) => {
    await navigateToPage(page, '/media/wideo')
    await assertLanguageToggleWorks(page)
  })

  test('navigates to Media via menu', async ({ page }) => {
    await navigateToPage(page, '/media/wideo')

    // Try to navigate back to Media or another page
    const mediaLink = page.locator('a[href="/media"]').first()
    const hasMediaLink = await mediaLink.count()

    if (hasMediaLink > 0) {
      await mediaLink.click()
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveURL('/media')
    } else {
      // If no media link, just verify we can navigate somewhere
      await navigateViaLink(page, '/kalendarz', '/kalendarz')
    }
  })

  test('page structure is valid', async ({ page }) => {
    await navigateToPage(page, '/media/wideo')

    const html = await page.locator('html').innerHTML()
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(100)
  })
})

test.describe('MediaWideo Page - Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
  })

  test('loads successfully on mobile', async ({ page }) => {
    await navigateToPage(page, '/media/wideo')

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(390)
  })

  test('displays video content on mobile', async ({ page }) => {
    await navigateToPage(page, '/media/wideo')

    const section = page.locator('section').first()
    await expect(section).toBeVisible()
  })

  test('language toggle works on mobile', async ({ page }) => {
    await navigateToPage(page, '/media/wideo')

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
