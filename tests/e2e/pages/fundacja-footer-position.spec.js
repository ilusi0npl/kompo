import { test, expect } from '@playwright/test'

test.describe('Fundacja footer position', () => {
  test('footer should be below all content after expanding declaration', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/fundacja')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    // Expand accessibility declaration
    const expandBtn = page.locator('button:has(img[src*="plus-icon"])').first()
    await expandBtn.click()
    await page.waitForTimeout(300)

    // Footer must not overlap content — check 50ms after click (before any setTimeout fix)
    const metrics = await page.evaluate(() => {
      const footer = document.querySelector('footer')
      if (!footer) return null
      const footerRect = footer.getBoundingClientRect()

      const contentDiv = footer.closest('section')?.querySelector('.absolute.flex.flex-col')
      if (!contentDiv) return null
      const contentRect = contentDiv.getBoundingClientRect()

      return {
        footerTop: Math.round(footerRect.top + window.scrollY),
        contentBottom: Math.round(contentRect.bottom + window.scrollY),
        overlap: footerRect.top < contentRect.bottom,
      }
    })

    expect(metrics).not.toBeNull()
    expect(metrics.overlap).toBe(false)
  })

  test('footer should be visible at page bottom with Sanity data', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/fundacja')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(300)

    const footer = page.locator('footer').first()
    await expect(footer).toBeVisible()

    // Footer should have a valid top position (not 'auto' or 0)
    const footerTop = await page.evaluate(() => {
      const f = document.querySelector('footer')
      return f ? parseFloat(f.style.top) || 0 : 0
    })
    expect(footerTop).toBeGreaterThan(100)
  })

  test('page should not have excessive empty space below footer', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/fundacja')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    const metrics = await page.evaluate(() => {
      const footer = document.querySelector('footer')
      if (!footer) return null
      const footerRect = footer.getBoundingClientRect()
      const footerBottom = footerRect.bottom + window.scrollY
      const pageHeight = document.documentElement.scrollHeight
      return { footerBottom: Math.round(footerBottom), pageHeight, spaceAfter: Math.round(pageHeight - footerBottom) }
    })

    expect(metrics).not.toBeNull()
    // Max 200px below footer (margin + tolerance for scale transform)
    expect(metrics.spaceAfter).toBeLessThan(200)
  })
})
