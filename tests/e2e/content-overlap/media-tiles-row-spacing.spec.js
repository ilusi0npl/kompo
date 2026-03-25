import { test, expect } from '@playwright/test'

test.describe('Media tiles row spacing', () => {
  test('media tiles should have at least 40px gap between rows', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/media')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    // Get all tile wrappers and group by row
    const boxes = await page.evaluate(() => {
      const tiles = document.querySelectorAll('.flex.flex-col.absolute')
      return Array.from(tiles).map(t => {
        const rect = t.getBoundingClientRect()
        return { y: rect.top + window.scrollY, height: rect.height }
      })
    })

    if (boxes.length <= 3) return // Only 1 row

    // Group by row (tiles within 50px Y are same row)
    const rows = []
    for (const box of boxes) {
      const row = rows.find(r => Math.abs(r[0].y - box.y) < 50)
      if (row) row.push(box)
      else rows.push([box])
    }

    // Check gap between consecutive rows
    for (let r = 0; r < rows.length - 1; r++) {
      const currentRowBottom = Math.max(...rows[r].map(b => b.y + b.height))
      const nextRowTop = Math.min(...rows[r + 1].map(b => b.y))
      const gap = nextRowTop - currentRowBottom
      expect(gap).toBeGreaterThanOrEqual(38) // 40px with 2px tolerance
    }
  })
})
