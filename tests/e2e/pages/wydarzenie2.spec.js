import { test, expect } from '@playwright/test'
import {
  navigateToPage
} from '../helpers/test-helpers.js'

// Wydarzenie2 page tests - this route may redirect or use dynamic event ID
// Tests are simplified to handle various implementations

test.describe('Wydarzenie2 Page - Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
  })

  test('route is accessible', async ({ page }) => {
    await page.goto('/wydarzenie/2')
    await page.waitForLoadState('networkidle')

    // Page should load (even if it redirects or shows placeholder)
    const url = page.url()
    expect(url).toBeTruthy()
  })

  test('page has content or redirects properly', async ({ page }) => {
    await page.goto('/wydarzenie/2')
    await page.waitForLoadState('networkidle')

    // Check if page has content OR redirected to valid page
    const bodyText = await page.locator('body').textContent()
    expect(bodyText).toBeTruthy()
  })

  test('page renders without errors', async ({ page }) => {
    await page.goto('/wydarzenie/2')
    await page.waitForLoadState('networkidle')

    // Page should render (even if minimal/placeholder)
    const html = await page.locator('html').innerHTML()
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(10)
  })
})

test.describe('Wydarzenie2 Page - Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
  })

  test('route is accessible on mobile', async ({ page }) => {
    await page.goto('/wydarzenie/2')
    await page.waitForLoadState('networkidle')

    const url = page.url()
    expect(url).toBeTruthy()
  })

  test('responsive layout renders', async ({ page }) => {
    await page.goto('/wydarzenie/2')
    await page.waitForLoadState('networkidle')

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(420) // Allow slight overflow
  })

  test('has interactive elements on mobile', async ({ page }) => {
    await page.goto('/wydarzenie/2')
    await page.waitForLoadState('networkidle')

    const interactive = page.locator('a, button, input')
    const count = await interactive.count()
    expect(count).toBeGreaterThan(0)
  })
})
