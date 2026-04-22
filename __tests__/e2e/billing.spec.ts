import { test, expect } from '@playwright/test'

test.describe('Billing Flow', () => {
  test('billing page redirects if not logged in', async ({ page }) => {
    await page.goto('/dashboard/billing')
    await expect(page).toHaveURL(/.*\/login.*/)
  })

  test('billing UI displays free and pro plans (auth required)', async ({ page }) => {
    // Skip if not testing with a logged-in state
    test.skip(true, 'Requires active session injection')

    await page.goto('/dashboard/billing')

    const freePlan = page.getByText(/Current Plan/i)
    await expect(freePlan).toBeVisible()

    const upgradeBtn = page.getByRole('button', { name: /upgrade to pro/i })
    await expect(upgradeBtn).toBeVisible()
  })
})