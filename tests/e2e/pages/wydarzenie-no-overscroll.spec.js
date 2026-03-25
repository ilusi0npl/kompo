import { test, expect } from '@playwright/test'

test.describe('Wydarzenie page scroll', () => {
  test('wydarzenie page should not have excessive space below footer', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/wydarzenie/1')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    // Measure space between footer bottom and page bottom
    const metrics = await page.evaluate(() => {
      const footer = document.querySelector('footer')
      if (!footer) return null
      const footerRect = footer.getBoundingClientRect()
      const footerBottom = footerRect.bottom + window.scrollY
      const pageHeight = document.documentElement.scrollHeight
      return { footerBottom, pageHeight, spaceAfter: pageHeight - footerBottom }
    })

    // Max 200px below footer (margin + tolerance for scale transform)
    expect(metrics).not.toBeNull()
    expect(metrics.spaceAfter).toBeLessThan(200)
  })
})
