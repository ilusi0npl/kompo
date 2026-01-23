/**
 * Shared E2E test utilities for Kompopolex
 */
import { expect } from '@playwright/test'

/**
 * Check if navigation menu is visible with all main links
 */
export async function assertNavigationVisible(page) {
  const nav = page.locator('nav').first()
  await expect(nav).toBeVisible()

  // Main navigation links
  const expectedLinks = ['/bio', '/kalendarz', '/repertuar', '/specialne', '/kontakt', '/fundacja']

  for (const href of expectedLinks) {
    const link = page.locator(`a[href="${href}"]`)
    await expect(link).toBeVisible()
  }
}

/**
 * Check if logo is visible
 */
export async function assertLogoVisible(page) {
  const logo = page.locator('img[alt="Kompopolex"]').first()
  await expect(logo).toBeVisible()
}

/**
 * Check if footer is visible with email
 */
export async function assertFooterVisible(page) {
  const footer = page.locator('footer, [role="contentinfo"]').first()
  await expect(footer).toBeVisible()

  const emailLink = page.locator('a[href^="mailto:"]')
  await expect(emailLink).toBeVisible()
}

/**
 * Check if language toggle works
 */
export async function assertLanguageToggleWorks(page) {
  const languageToggle = page.locator('button.language-toggle')
  await expect(languageToggle).toBeVisible()

  // Should show "ENG" initially (in PL mode)
  await expect(languageToggle).toContainText('ENG')

  // Click to switch to English
  await languageToggle.click()
  await page.waitForTimeout(300)

  // Should now show "PL" (in EN mode)
  await expect(languageToggle).toContainText('PL')

  // Switch back to Polish
  await languageToggle.click()
  await page.waitForTimeout(300)

  await expect(languageToggle).toContainText('ENG')
}

/**
 * Navigate to a page and wait for it to load
 */
export async function navigateToPage(page, path) {
  await page.goto(path)
  await page.waitForLoadState('networkidle')

  // Wait a bit for animations/transitions
  await page.waitForTimeout(500)
}

/**
 * Check mobile viewport rendering
 */
export async function assertMobileViewport(page) {
  await page.setViewportSize({ width: 390, height: 844 })

  // Check no horizontal scroll
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
  expect(bodyWidth).toBeLessThanOrEqual(390)
}

/**
 * Check desktop viewport rendering
 */
export async function assertDesktopViewport(page) {
  await page.setViewportSize({ width: 1440, height: 900 })

  // Page should render at expected width
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
  expect(bodyWidth).toBeGreaterThanOrEqual(1440)
}

/**
 * Test scroll functionality
 */
export async function testScrollBehavior(page, expectedScrollHeight = 1000) {
  // Get initial scroll position
  const initialScroll = await page.evaluate(() => window.scrollY)
  expect(initialScroll).toBe(0)

  // Scroll down
  await page.evaluate(() => window.scrollBy(0, 500))
  await page.waitForTimeout(300)

  // Check scroll happened
  const afterScroll = await page.evaluate(() => window.scrollY)
  expect(afterScroll).toBeGreaterThan(0)

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)

  const finalScroll = await page.evaluate(() => window.scrollY)
  expect(finalScroll).toBe(0)
}

/**
 * Navigate from one page to another via clicking link
 */
export async function navigateViaLink(page, linkHref, expectedUrl) {
  const link = page.locator(`a[href="${linkHref}"]`).first()
  // Scroll to make link visible if needed (helps with nav links on long pages)
  await link.scrollIntoViewIfNeeded({ timeout: 10000 })
  await expect(link).toBeVisible({ timeout: 10000 })
  await link.click()
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(500)
  await expect(page).toHaveURL(expectedUrl)
}
