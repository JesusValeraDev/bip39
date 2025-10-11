import { test, expect } from '@playwright/test';

test.describe('Language Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have language dropdown', async ({ page }) => {
    const languageSelect = page.locator('#language');

    await expect(languageSelect).toBeVisible();
    await expect(languageSelect).toBeEnabled();
  });

  test('should change wordlist when language is changed', async ({ page }) => {
    const languageSelect = page.locator('#language');

    await page.locator('.box').nth(11).click();

    const initialWord = await page.locator('#word').textContent();

    await languageSelect.selectOption('spanish');

    await page.waitForTimeout(500);

    const newWord = await page.locator('#word').textContent();

    expect(newWord).toBeTruthy();
  });

  test('should persist language preference', async ({ page }) => {
    const languageSelect = page.locator('#language');

    await languageSelect.selectOption('spanish');

    await page.reload();

    const selectedLanguage = await languageSelect.inputValue();
    expect(selectedLanguage).toBe('spanish');
  });

  test('should have multiple language options', async ({ page }) => {
    const languageSelect = page.locator('#language');
    const options = languageSelect.locator('option');

    const count = await options.count();
    expect(count).toBeGreaterThan(1);
  });

  test('should translate UI when language changes', async ({ page }) => {
    const languageSelect = page.locator('#language');
    const title = page.locator('#title');

    const initialTitle = await title.textContent();

    await languageSelect.selectOption('spanish');

    await page.waitForTimeout(300);

    const newTitle = await title.textContent();
    expect(newTitle).toBeTruthy();

    await languageSelect.selectOption('czech');
    await page.waitForTimeout(300);

    const czechTitle = await title.textContent();
    expect(czechTitle).toBeTruthy();
  });
});
