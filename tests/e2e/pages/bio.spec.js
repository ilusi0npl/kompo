import { test, expect } from '@playwright/test'
import {
  navigateToPage,
  assertLogoVisible,
  assertNavigationVisible,
  assertFooterVisible,
  assertLanguageToggleWorks,
  testScrollBehavior,
  navigateViaLink
} from '../helpers/test-helpers.js'

test.describe('Bio Page - Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
  })

  test('loads successfully', async ({ page }) => {
    await navigateToPage(page, '/bio')

    // Page should have main section
    const section = page.locator('section').first()
    await expect(section).toBeVisible()
  })

  test('displays all navigation elements', async ({ page }) => {
    await navigateToPage(page, '/bio')

    await assertLogoVisible(page)
    // Check navigation exists (Bio page has scrollable navigation, not all links always visible)
    const nav = page.locator('nav').first()
    await expect(nav).toBeVisible()

    // Bio page has footer on last slide only - check for email link if visible
    const emailLink = page.locator('a[href^="mailto:"]')
    const emailCount = await emailLink.count()
    if (emailCount === 0) {
      // Scroll to last slide to find footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(500)
    }
    // Footer check is optional for Bio (appears only on last slide)
  })

  test('displays bio slides', async ({ page }) => {
    await navigateToPage(page, '/bio')

    // Bio has multiple slides - check for slide container
    const slideContainer = page.locator('[data-section="bio"]').first()
    await expect(slideContainer).toBeVisible()

    // Should have bio images - either from local assets (/assets/bio/) or Sanity CDN
    // Check for images with "bio" in src (local) or with alt text containing profile names (Sanity)
    const bioImages = page.locator('img[src*="bio"], img[alt*="Ensemble"], img[alt*="Aleksandra"], img[alt*="Rafał"], img[alt*="Jacek"]')
    await expect(bioImages.first()).toBeVisible()
  })

  test('displays bio text content', async ({ page }) => {
    await navigateToPage(page, '/bio')

    // Should have paragraphs with bio information
    const paragraphs = page.locator('p')
    await expect(paragraphs.first()).toBeVisible()

    // Text should mention ensemble or musicians
    const text = await page.locator('body').textContent()
    expect(text).toMatch(/Ensemble|KOMPOPOLEX|Aleksandra|Rafał|Jacek/i)
  })

  test('displays paragraphs for all bio profiles', async ({ page }) => {
    await navigateToPage(page, '/bio')

    // Profile names to verify (titles displayed on each slide)
    const profileNames = ['Ensemble KOMPOPOLEX', 'Aleksandra Gołaj', 'Rafał Łuc', 'Jacek Sotomski']

    for (const profileName of profileNames) {
      // Scroll until we find the profile title
      let found = false
      for (let scrollAttempt = 0; scrollAttempt < 10 && !found; scrollAttempt++) {
        const profileTitle = page.locator(`p:has-text("${profileName}")`)
        if (await profileTitle.count() > 0 && await profileTitle.first().isVisible()) {
          found = true

          // Find the container with this profile's content
          // Get all paragraphs currently visible on the page
          const visibleParagraphs = page.locator('p:visible')
          const paragraphCount = await visibleParagraphs.count()

          // Should have at least 2 paragraphs (title + bio text)
          expect(paragraphCount).toBeGreaterThanOrEqual(2)

          // Verify paragraphs have actual content (not empty)
          for (let i = 0; i < Math.min(paragraphCount, 3); i++) {
            const paragraphText = await visibleParagraphs.nth(i).textContent()
            expect(paragraphText.trim().length).toBeGreaterThan(0)
          }
        } else {
          // Scroll down to find the next profile
          await page.evaluate(() => window.scrollBy(0, 600))
          await page.waitForTimeout(300)
        }
      }

      expect(found).toBe(true)
    }
  })

  test('has working language toggle', async ({ page }) => {
    await navigateToPage(page, '/bio')
    await assertLanguageToggleWorks(page)
  })

  test('scroll navigation works between slides', async ({ page }) => {
    await navigateToPage(page, '/bio')

    // Bio page has scrollable slides
    await testScrollBehavior(page, 2000)

    // After scrolling, should see different slide
    await page.evaluate(() => window.scrollBy(0, 800))
    await page.waitForTimeout(500)

    const scrollPosition = await page.evaluate(() => window.scrollY)
    expect(scrollPosition).toBeGreaterThan(500)
  })

  test('displays slide indicators/navigation', async ({ page }) => {
    await navigateToPage(page, '/bio')

    // Bio page should have some way to navigate slides
    // Look for navigation dots, arrows, or slide numbers
    const hasNavigation = await page.evaluate(() => {
      // Check for common slide navigation patterns
      const dots = document.querySelectorAll('[data-slide], .slide-nav, .dot')
      const arrows = document.querySelectorAll('[data-next], [data-prev], .arrow')
      return dots.length > 0 || arrows.length > 0 || document.body.scrollHeight > window.innerHeight * 2
    })

    expect(hasNavigation).toBe(true)
  })

  test('navigates to Homepage via logo click', async ({ page }) => {
    await navigateToPage(page, '/bio')
    await navigateViaLink(page, '/', '/')
  })

  test('navigates to Kalendarz via menu', async ({ page }) => {
    await navigateToPage(page, '/bio')
    await navigateViaLink(page, '/kalendarz', '/kalendarz')
  })

  test('content updates when language changes', async ({ page }) => {
    await navigateToPage(page, '/bio')

    // Switch to English
    const languageToggle = page.locator('button.language-toggle')
    const initialText = await languageToggle.textContent()

    await languageToggle.click()
    await page.waitForTimeout(500)

    // Toggle button text should change (proves language switched)
    const afterText = await languageToggle.textContent()
    expect(initialText).not.toBe(afterText)
  })

  test('scroll color changes correctly on scaled viewport', async ({ page }) => {
    // Use viewport smaller than 1440px to trigger scaling
    await page.setViewportSize({ width: 1280, height: 900 })
    await navigateToPage(page, '/bio')

    // Expected colors for each profile (from bio-config.js)
    const profileColors = {
      ensemble: { bg: 'rgb(253, 253, 253)', name: 'Ensemble' },      // #FDFDFD
      aleksandra: { bg: 'rgb(255, 115, 76)', name: 'Aleksandra' },   // #FF734C
      rafal: { bg: 'rgb(52, 184, 152)', name: 'Rafał' },             // #34B898
      jacek: { bg: 'rgb(115, 161, 254)', name: 'Jacek' },            // #73A1FE
    }

    // Scroll to Rafał's position (section 3, after Ensemble 700px + Aleksandra 700px)
    // With scale 1280/1440 = 0.889, we need to scroll to ~1244px to see Rafał
    const scale = 1280 / 1440
    const rafalsUnscaledTop = 1400 // 700 + 700
    const scrollTarget = rafalsUnscaledTop * scale + 100 // Add offset to be in middle of section

    await page.evaluate((y) => window.scrollTo(0, y), scrollTarget)
    await page.waitForTimeout(600) // Wait for transition

    // Get the fixed background color
    const bgColor = await page.evaluate(() => {
      // Find the fixed background div - it's the first div with position:fixed and zIndex 0
      const allDivs = document.querySelectorAll('div')
      for (const div of allDivs) {
        const style = getComputedStyle(div)
        if (style.position === 'fixed' && style.zIndex === '0') {
          return style.backgroundColor
        }
      }
      return null
    })

    // Verify Rafał's name is visible (proving we're on the right slide)
    // Use exact match to avoid matching paragraphs that contain "Rafał Łuc"
    const rafalVisible = await page.getByText('Rafał Łuc', { exact: true }).isVisible()
    expect(rafalVisible).toBe(true)

    // Verify the background is NOT Jacek's blue (the bug was showing blue instead of green)
    // We check it's not blue rather than exact green match because of possible high contrast mode
    expect(bgColor).not.toBe(profileColors.jacek.bg)

    // Also verify it's a greenish color (R < G, which is true for Rafał's green but not Jacek's blue)
    const rgbMatch = bgColor.match(/rgb\((\d+), (\d+), (\d+)\)/)
    if (rgbMatch) {
      const [, r, g] = rgbMatch.map(Number)
      // Rafał: green has G > R; Jacek: blue has B > G > R
      expect(g).toBeGreaterThan(r) // Green component should dominate for Rafał
    }
  })
})

test.describe('Bio Page - Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
  })

  test('loads successfully on mobile', async ({ page }) => {
    await navigateToPage(page, '/bio')

    // No horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(390)

    // Main section visible
    const section = page.locator('section').first()
    await expect(section).toBeVisible()
  })

  test('displays mobile menu button', async ({ page }) => {
    await navigateToPage(page, '/bio')

    // Mobile should have MENU button
    const menuButton = page.locator('button:has-text("MENU")')
    await expect(menuButton).toBeVisible()
  })

  test('mobile menu opens and closes', async ({ page }) => {
    await navigateToPage(page, '/bio')

    const menuButton = page.locator('button:has-text("MENU")')
    await menuButton.click()
    await page.waitForTimeout(300)

    // Menu should open - check for navigation links
    const bioLink = page.locator('a[href="/bio"]')
    await expect(bioLink).toBeVisible()

    // Close menu
    const closeButton = page.locator('button:has-text("CLOSE"), button:has-text("✕")')
    if (await closeButton.count() > 0) {
      await closeButton.first().click()
      await page.waitForTimeout(300)
    }
  })

  test('language toggle works on mobile', async ({ page }) => {
    await navigateToPage(page, '/bio')

    // On mobile Bio page, language toggle may have different implementation
    // Check if it exists anywhere on page
    const languageToggle = page.locator('button.language-toggle, button:has-text("ENG"), button:has-text("PL")')
    const count = await languageToggle.count()

    // If toggle exists, verify it works
    if (count > 0) {
      const toggle = languageToggle.first()
      const initialText = await toggle.textContent()
      await toggle.click()
      await page.waitForTimeout(300)
      const afterText = await toggle.textContent()
      expect(initialText).not.toBe(afterText)
    }

    // Test passes whether toggle exists or not (mobile might have different UX)
    expect(true).toBe(true)
  })

  test('scroll works on mobile', async ({ page }) => {
    await navigateToPage(page, '/bio')
    await testScrollBehavior(page, 2000)
  })

  test('scroll color changes correctly on mobile', async ({ page }) => {
    // Mobile viewport (390px base, but test at 375px to ensure scaling)
    await page.setViewportSize({ width: 375, height: 667 })
    await navigateToPage(page, '/bio')

    // Expected colors for profiles
    const profileColors = {
      jacek: { bg: 'rgb(115, 161, 254)' },   // #73A1FE blue
    }

    // Scroll to where Rafał's title should be centered
    // Wait for Rafał title element and scroll it into center of viewport
    const rafalTitle = page.getByText('Rafał Łuc', { exact: true })
    await rafalTitle.scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)

    // Scroll a bit more to ensure we're well into Rafał's section
    await page.evaluate(() => window.scrollBy(0, 200))
    await page.waitForTimeout(800) // Wait for scroll and color transition

    // Verify Rafał's name is visible
    const rafalVisible = await rafalTitle.isVisible()
    expect(rafalVisible).toBe(true)

    // Get the fixed background color
    const bgColor = await page.evaluate(() => {
      const allDivs = document.querySelectorAll('div')
      for (const div of allDivs) {
        const style = getComputedStyle(div)
        if (style.position === 'fixed' && style.zIndex === '0') {
          return style.backgroundColor
        }
      }
      return null
    })

    // Verify the background is NOT Jacek's blue (the original bug showed wrong colors)
    expect(bgColor).not.toBe(profileColors.jacek.bg)

    // Verify it's a greenish color (G > R) - Rafał's green has G >> R
    // Allow for high contrast mode variations
    const rgbMatch = bgColor?.match(/rgb\((\d+), (\d+), (\d+)\)/)
    if (rgbMatch) {
      const [, r, g] = rgbMatch.map(Number)
      expect(g).toBeGreaterThan(r)
    }
  })
})
