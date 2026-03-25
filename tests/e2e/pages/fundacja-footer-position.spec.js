import { test, expect } from '@playwright/test'

test.describe('Fundacja footer position', () => {
  test('footer should not overlap content when declaration is expanded', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/fundacja')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    // Expand accessibility declaration
    const expandBtn = page.locator('button:has(img[src*="plus-icon"])').first()
    await expandBtn.click()
    // Only wait 50ms — less than the setTimeout(100) that currently "fixes" the layout
    // This catches the flash of broken layout the client sees
    await page.waitForTimeout(50)

    // Measure footer position vs content bottom
    const metrics = await page.evaluate(() => {
      const footer = document.querySelector('footer')
      if (!footer) return null
      const footerRect = footer.getBoundingClientRect()

      // Find the last content element before footer
      const contentDiv = footer.previousElementSibling || footer.parentElement
      const allContent = contentDiv ? contentDiv.querySelectorAll('p, div, button, a') : []
      let maxBottom = 0
      allContent.forEach(el => {
        const rect = el.getBoundingClientRect()
        if (rect.bottom > maxBottom && rect.height > 0) {
          maxBottom = rect.bottom
        }
      })

      return {
        footerTop: footerRect.top + window.scrollY,
        contentBottom: maxBottom + window.scrollY,
        overlap: maxBottom > footerRect.top,
      }
    })

    // Footer must not overlap content
    expect(metrics.overlap).toBe(false)
  })
})
