import { test, expect } from '@playwright/test'

const PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/bio', name: 'Bio' },
  { path: '/kalendarz', name: 'Kalendarz' },
  { path: '/archiwalne', name: 'Archiwalne' },
  { path: '/media', name: 'Media Galeria' },
  { path: '/media/wideo', name: 'Media Wideo' },
  { path: '/repertuar', name: 'Repertuar' },
  { path: '/specialne', name: 'Specialne' },
  { path: '/kontakt', name: 'Kontakt' },
  { path: '/fundacja', name: 'Fundacja' },
]

test.describe('Navigation', () => {
  test('should navigate to Bio page from Homepage', async ({ page }) => {
    await page.goto('/')

    const bioLink = page.getByRole('link', { name: /bio/i }).first()
    await bioLink.click()

    await expect(page).toHaveURL('/bio')
    await expect(page.locator('section').first()).toBeVisible()
  })

  test('should navigate to Kalendarz page', async ({ page }) => {
    await page.goto('/')

    const kalendarzeLink = page.getByRole('link', { name: /kalendarz/i }).first()
    await kalendarzeLink.click()

    await expect(page).toHaveURL('/kalendarz')
    await expect(page.locator('section')).toBeVisible()
  })

  test('should navigate to Kontakt page', async ({ page }) => {
    await page.goto('/')

    const kontaktLink = page.getByRole('link', { name: /kontakt/i }).first()
    await kontaktLink.click()

    await expect(page).toHaveURL('/kontakt')
    await expect(page.locator('section')).toBeVisible()
  })

  test('should allow browser back navigation', async ({ page }) => {
    await page.goto('/')

    // Navigate to Bio
    await page.getByRole('link', { name: /bio/i }).first().click()
    await expect(page).toHaveURL('/bio')

    // Go back
    await page.goBack()
    await expect(page).toHaveURL('/')
  })

  test('should allow browser forward navigation', async ({ page }) => {
    await page.goto('/')

    // Navigate to Bio
    await page.getByRole('link', { name: /bio/i }).first().click()
    await expect(page).toHaveURL('/bio')

    // Go back
    await page.goBack()
    await expect(page).toHaveURL('/')

    // Go forward
    await page.goForward()
    await expect(page).toHaveURL('/bio')
  })

  for (const pageInfo of PAGES) {
    test(`should load ${pageInfo.name} page without errors`, async ({ page }) => {
      const errors = []
      page.on('pageerror', error => errors.push(error.message))

      await page.goto(pageInfo.path)

      // Page should load
      await expect(page.locator('section').first()).toBeVisible({ timeout: 10000 })

      // No JavaScript errors
      expect(errors).toEqual([])
    })
  }
})
