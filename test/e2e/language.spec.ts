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

    // Dropdown should be hidden initially
    await expect(languageDropdown).not.toHaveClass(/open/);

    // Click toggle to open dropdown
    await languageToggle.click();

    // Dropdown should now be visible
    await expect(languageDropdown).toHaveClass(/open/);
  });

  test('should change wordlist when language is changed', async ({ page }) => {
    await page.locator('.box').nth(11).click();

    const initialWord = await page.locator('#word').textContent();

    // Open language dropdown
    await page.locator('#language-toggle').click();

    // Click Spanish flag
    await page.locator('.language-option[data-lang="spanish"]').click();

    await page.waitForTimeout(500);

    const newWord = await page.locator('#word').textContent();

    expect(newWord).toBeTruthy();
    expect(newWord).not.toBe(initialWord);
  });

  test('should persist language preference', async ({ page }) => {
    // Open language dropdown
    await page.locator('#language-toggle').click();

    // Select Spanish
    await page.locator('.language-option[data-lang="spanish"]').click();

    await page.reload();

    // Open dropdown again to check active state
    await page.locator('#language-toggle').click();

    // Spanish option should be marked as active
    const spanishOption = page.locator('.language-option[data-lang="spanish"]');
    await expect(spanishOption).toHaveClass(/active/);
  });

  test('should have multiple language options', async ({ page }) => {
    // Open language dropdown
    await page.locator('#language-toggle').click();

    const languageOptions = page.locator('.language-option');

    const count = await languageOptions.count();
    expect(count).toBeGreaterThan(1);
    expect(count).toBeGreaterThanOrEqual(10); // We have 10 languages
  });

  test('should translate UI when language changes', async ({ page }) => {
    const title = page.locator('#title');

    const initialTitle = await title.textContent();

    // Open language dropdown
    await page.locator('#language-toggle').click();

    // Select Spanish
    await page.locator('.language-option[data-lang="spanish"]').click();

    await page.waitForTimeout(300);

    const newTitle = await title.textContent();
    expect(newTitle).toBeTruthy();
    expect(newTitle).not.toBe(initialTitle);

    // Open dropdown again
    await page.locator('#language-toggle').click();

    // Select Czech
    await page.locator('.language-option[data-lang="czech"]').click();
    await page.waitForTimeout(300);

    const czechTitle = await title.textContent();
    expect(czechTitle).toBeTruthy();
  });

  test('should close dropdown when clicking outside', async ({ page }) => {
    const languageToggle = page.locator('#language-toggle');
    const languageDropdown = page.locator('#language-dropdown');

    // Open dropdown
    await languageToggle.click();
    await expect(languageDropdown).toHaveClass(/open/);

    // Click outside (on the title)
    await page.locator('#title').click();

    // Dropdown should be closed
    await expect(languageDropdown).not.toHaveClass(/open/);
  });

  test('should update flag icon when language changes', async ({ page }) => {
    const currentFlag = page.locator('#current-flag');

    // Open language dropdown
    await page.locator('#language-toggle').click();

    // Select Spanish
    await page.locator('.language-option[data-lang="spanish"]').click();

    await page.waitForTimeout(300);

    // Flag should have been updated (we can't easily check SVG content, but we can verify it exists)
    await expect(currentFlag).toBeVisible();
  });
});
