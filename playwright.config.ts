import { defineConfig, devices } from '@playwright/test'

/**
 * DevFolio Pro — Playwright E2E Test Configuration
 *
 * Docs: https://playwright.dev/docs/test-configuration
 *
 * Run all E2E tests:    npx playwright test
 * Run with UI:          npx playwright test --ui
 * Run headed:           npx playwright test --headed
 * Single spec:          npx playwright test __tests__/e2e/signup.spec.ts
 * Debug a single test:  npx playwright test --debug
 */

export default defineConfig({
  // Directory containing E2E test files
  testDir: './__tests__/e2e',

  // Match only .spec.ts files
  testMatch: '**/*.spec.ts',

  // Fail the build on CI if you accidentally left test.only() in source
  forbidOnly: !!process.env.CI,

  // Retry failing tests on CI (network flakiness etc.)
  retries: process.env.CI ? 2 : 0,

  // Run tests in parallel (set to 1 for debugging)
  workers: process.env.CI ? 1 : undefined,

  // Reporter: HTML report always, plus a compact line reporter in the terminal
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  // Shared settings for all test projects
  use: {
    // Base URL so tests can use page.goto('/login') instead of full URLs
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',

    // Collect trace on first retry — useful for debugging CI failures
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on first retry
    video: 'on-first-retry',
  },

  // Test projects — run against the most common browser environments
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile viewports
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'] },
    },
  ],

  // Start the Next.js dev server automatically before running tests.
  // On CI, the server is typically started separately — set CI=true to skip this.
  webServer: process.env.CI
    ? undefined
    : {
        command: 'pnpm dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true, // Don't start a second server if one is already running
        timeout: 60_000,          // Allow up to 60s for the Next.js cold start
        stdout: 'pipe',
        stderr: 'pipe',
      },
})
