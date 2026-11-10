import { test, expect } from '@playwright/test'
import { navigateToPage } from '../helpers/test-helpers.js'

const SACRUM = '/media/recenzje/sacrum-profanum-2020'

test.describe('Media Recenzje - Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
  })

  test('reviews tab on Media page opens reviews list', async ({ page }) => {
    await navigateToPage(page, '/media')
    await page.locator('a[href="/media/recenzje"]').first().click()
    await expect(page).toHaveURL('/media/recenzje')
  })

  test('reviews tab is reachable from the video tab', async ({ page }) => {
    await navigateToPage(page, '/media/wideo')
    await expect(page.locator('a[href="/media/recenzje"]').first()).toBeVisible()
  })

  test('list shows one tile per reviewed event with review count', async ({ page }) => {
    await navigateToPage(page, '/media/recenzje')
    const tile = page.locator(`a[href="${SACRUM}"]`)
    await expect(tile).toBeVisible()
    await expect(tile).toContainText('2 recenzje')
    await expect(page.locator('a[href^="/media/recenzje/"]')).toHaveCount(3)
  })

  test('event page shows every review with a link to its source', async ({ page }) => {
    await navigateToPage(page, '/media/recenzje')
    await page.locator(`a[href="${SACRUM}"]`).click()
    await expect(page).toHaveURL(SACRUM)
    await expect(page.locator('a[href="https://ruchmuzyczny.pl/article/507"]')).toBeVisible()
    await expect(page.locator('a[href="https://www.dwutygodnik.com/artykul/9279-komponowanie-na-internet.html"]')).toBeVisible()
    await expect(page.getByText('Kompopolex: 10/10.')).toBeVisible()
  })

  test('English version translates the excerpt but keeps the source title', async ({ page }) => {
    await navigateToPage(page, SACRUM)
    await page.locator('button.language-toggle').first().click()
    await expect(page.getByText('Can corsair dragées carry us')).toBeVisible()
    await expect(page.locator('a[href="https://ruchmuzyczny.pl/article/507"]')).toContainText('SACRUM PROFANUM 2020 (relacje)')
  })

  test('unknown event redirects to the reviews list', async ({ page }) => {
    await navigateToPage(page, '/media/recenzje/nie-istnieje')
    await expect(page).toHaveURL('/media/recenzje')
  })
})

test.describe('Media Recenzje - Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
  })

  test('reviews tab is in the mobile Media header', async ({ page }) => {
    await navigateToPage(page, '/media')
    await page.locator('#mobile-header-root a[href="/media/recenzje"], a[href="/media/recenzje"]').first().click()
    await expect(page).toHaveURL('/media/recenzje')
  })

  test('event page fits the screen and links to sources', async ({ page }) => {
    await navigateToPage(page, SACRUM)
    await expect(page.locator('a[href="https://ruchmuzyczny.pl/article/507"]')).toBeVisible()
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(390)
  })
})
