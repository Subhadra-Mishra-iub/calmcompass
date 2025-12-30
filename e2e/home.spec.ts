import { test, expect } from '@playwright/test';

test('home page loads and shows signup/login links', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('text=CalmCompass')).toBeVisible();
  await expect(page.locator('text=Get Started')).toBeVisible();
  await expect(page.locator('text=Sign In')).toBeVisible();
});

test('can navigate to signup page', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Get Started');
  await expect(page).toHaveURL(/.*signup/);
  await expect(page.locator('text=Create Account')).toBeVisible();
});

test('can navigate to login page', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Sign In');
  await expect(page).toHaveURL(/.*login/);
  await expect(page.locator('text=Sign In')).toBeVisible();
});




