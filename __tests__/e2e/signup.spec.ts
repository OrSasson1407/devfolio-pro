import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('login page renders correctly with GitHub sign-in button', async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login')

    // Verify the page title or main heading
    const heading = page.getByRole('heading', { name: /Sign in to DevFolio Pro/i })
    await expect(heading).toBeVisible()

    // Verify the GitHub OAuth button exists
    const githubButton = page.getByRole('button', { name: /Continue with GitHub/i })
    await expect(githubButton).toBeVisible()
    
    // Note: We don't click and complete the full OAuth flow here to avoid 
    // triggering GitHub's bot detection. We just verify the UI is wired up.
  })
})