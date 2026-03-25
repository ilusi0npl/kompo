import { test, expect } from '@playwright/test'

test.describe('Footer interactions', () => {
  test('clicking email should copy it to clipboard', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    await page.goto('/kontakt')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(300)

    // Find and click the email element
    const emailEl = page.locator('footer span[role="button"]').first()
    await expect(emailEl).toBeVisible()
    await expect(emailEl).toContainText('KOMPOPOLEX@GMAIL.COM')

    await emailEl.click()

    // Verify feedback text appears
    await expect(emailEl).toContainText('SKOPIOWANO!')

    // Verify clipboard content
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboardText).toBe('kompopolex@gmail.com')
  })
})
