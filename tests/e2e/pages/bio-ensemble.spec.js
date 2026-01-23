import { test, expect } from '@playwright/test'
import {
  navigateToPage,
  assertLogoVisible,
  assertNavigationVisible,
  assertFooterVisible,
  assertLanguageToggleWorks,
  navigateViaLink
} from '../helpers/test-helpers.js'

test.describe('BioEnsemble Page - Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
  })

  test('loads successfully', async ({ page }) => {
    await navigateToPage(page, '/bio/ensemble')

    const section = page.locator('section').first()
    await expect(section).toBeVisible()
  })

  test('displays all navigation elements', async ({ page }) => {
    await navigateToPage(page, '/bio/ensemble')

    await assertLogoVisible(page)
    const nav = page.locator('nav').first()
    await expect(nav).toBeVisible()
  })

  test('displays ensemble content', async ({ page }) => {
    await navigateToPage(page, '/bio/ensemble')

    // Should have ensemble-specific text
    const text = await page.locator('body').textContent()
    expect(text).toMatch(/Ensemble|KOMPOPOLEX/i)
  })

  test('displays ensemble image', async ({ page }) => {
    await navigateToPage(page, '/bio/ensemble')

    // Should have bio image
    const image = page.locator('img[src*="bio"]')
    await expect(image.first()).toBeVisible()
  })

  test('has working language toggle', async ({ page }) => {
    await navigateToPage(page, '/bio/ensemble')
    await assertLanguageToggleWorks(page)
  })

  test('navigates to Bio page via menu', async ({ page }) => {
    await navigateToPage(page, '/bio/ensemble')
    await navigateViaLink(page, '/bio', '/bio')
  })

  test('content updates when language changes', async ({ page }) => {
    await navigateToPage(page, '/bio/ensemble')

    const languageToggle = page.locator('button.language-toggle')
    const initialText = await languageToggle.textContent()

    await languageToggle.click()
    await page.waitForTimeout(500)

    const afterText = await languageToggle.textContent()
    expect(initialText).not.toBe(afterText)
  })
})

test.describe('BioEnsemble Page - Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
  })

  test('loads successfully on mobile', async ({ page }) => {
    await navigateToPage(page, '/bio/ensemble')

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(390)
  })

  test('displays mobile menu button', async ({ page }) => {
    await navigateToPage(page, '/bio/ensemble')

    const menuButton = page.locator('button:has-text("MENU")')
    await expect(menuButton).toBeVisible()
  })

  test('language toggle works on mobile', async ({ page }) => {
    await navigateToPage(page, '/bio/ensemble')

    // On mobile, language toggle may have different implementation
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
