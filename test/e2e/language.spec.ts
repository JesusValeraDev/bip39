import { test, expect } from '@playwright/test';

test.describe('Language Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have language toggle button', async ({ page }) => {
    const languageToggle = page.locator('#language-toggle');

    await expect(languageToggle).toBeVisible();
    await expect(languageToggle).toBeEnabled();
  });

  test('should open language dropdown when toggle is clicked', async ({ page }) => {
    const languageToggle = page.locator('#language-toggle');
    const languageDropdown = page.locator('#language-dropdown');

    await expect(languageDropdown).not.toHaveClass(/open/);

    await languageToggle.click();

    await expect(languageDropdown).toHaveClass(/open/);
  });

  test('should change wordlist when language is changed', async ({ page }) => {
    await page.locator('.box').nth(11).click();

    const initialWord = await page.locator('#word-input').inputValue();

    await page.locator('#language-toggle').click();

    await page.locator('.language-option[data-lang="spanish"]').click();

    await page.waitForTimeout(500);

    const newWord = await page.locator('#word-input').inputValue();

    expect(newWord).toBeTruthy();
    expect(newWord).not.toBe(initialWord);
  });

  test('should persist language preference', async ({ page }) => {
    await page.locator('#language-toggle').click();

    await page.locator('.language-option[data-lang="spanish"]').click();

    await page.reload();

    await page.locator('#language-toggle').click();

    const spanishOption = page.locator('.language-option[data-lang="spanish"]');
    await expect(spanishOption).toHaveClass(/active/);
  });

  test('should have multiple language options', async ({ page }) => {
    await page.locator('#language-toggle').click();

    const languageOptions = page.locator('.language-option');

    const count = await languageOptions.count();
    expect(count).toBeGreaterThan(1);
    expect(count).toBeGreaterThanOrEqual(10); // We have 10 languages
  });

  test('should translate UI when language changes', async ({ page }) => {
    const title = page.locator('#title');

    const initialTitle = await title.textContent();

    await page.locator('#language-toggle').click();

    await page.locator('.language-option[data-lang="spanish"]').click();

    await page.waitForTimeout(300);

    const newTitle = await title.textContent();
    expect(newTitle).toBeTruthy();
    expect(newTitle).not.toBe(initialTitle);

    await page.locator('#language-toggle').click();

    await page.locator('.language-option[data-lang="czech"]').click();
    await page.waitForTimeout(300);

    const czechTitle = await title.textContent();
    expect(czechTitle).toBeTruthy();
  });

  test('should close dropdown when clicking outside', async ({ page }) => {
    const languageToggle = page.locator('#language-toggle');
    const languageDropdown = page.locator('#language-dropdown');

    await languageToggle.click();
    await expect(languageDropdown).toHaveClass(/open/);

    await page.locator('#title').click();

    await expect(languageDropdown).not.toHaveClass(/open/);
  });

  test('should update flag icon when language changes', async ({ page }) => {
    const currentFlag = page.locator('#current-flag');

    await page.locator('#language-toggle').click();

    await page.locator('.language-option[data-lang="spanish"]').click();

    await page.waitForTimeout(300);

    await expect(currentFlag).toBeVisible();
  });
});
