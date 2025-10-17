import { test, expect } from '@playwright/test';

test.describe('Theme Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should toggle between dark and light theme', async ({ page }) => {
    const html = page.locator('html');

    const initialTheme = await html.getAttribute('data-theme');

    await page.locator('#theme-toggle').click();

    const newTheme = await html.getAttribute('data-theme');
    expect(newTheme).not.toBe(initialTheme);

    await page.locator('#theme-toggle').click();

    const finalTheme = await html.getAttribute('data-theme');
    expect(finalTheme).toBe(initialTheme);
  });

  test('should persist theme preference', async ({ page }) => {
    await page.locator('#theme-toggle').click();
    const theme = await page.locator('html').getAttribute('data-theme');

    await page.reload();

    const persistedTheme = await page.locator('html').getAttribute('data-theme');
    expect(persistedTheme).toBe(theme);
  });

  test('should have working theme toggle button', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');

    await expect(themeToggle).toBeVisible();
    await expect(themeToggle).toBeEnabled();
  });
});
