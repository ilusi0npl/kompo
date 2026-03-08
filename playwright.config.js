import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration for Kompopolex E2E tests
 *
 * Two modes:
 * - "local": VITE_USE_SANITY=false (default, uses config data)
 * - "sanity": VITE_USE_SANITY=true (uses Sanity CMS, port 5174)
 *
 * Run specific mode: npx playwright test --project=local
 * Run all: npx playwright test
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'tmp/playwright-report' }],
    ['list'],
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'local',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:5173',
      },
      testIgnore: [/sanity-mode\//, /production\//],
    },
    {
      name: 'sanity',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:5174',
      },
      testMatch: /sanity-mode\//,
    },
    {
      name: 'production',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://kompo-pi.vercel.app',
      },
      testMatch: /production\//,
    },
  ],

  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: 'VITE_USE_SANITY=true npx vite --port 5174',
      url: 'http://localhost:5174',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
})
