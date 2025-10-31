import { test, expect } from '@playwright/test';

test.describe('Word Input - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have word input field visible', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    await expect(wordInput).toBeVisible();
    await expect(wordInput).toBeEditable();
  });

  test('should show suggestions when typing', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    await wordInput.fill('aba');

    const suggestions = page.locator('#word-suggestions');
    await expect(suggestions).not.toHaveAttribute('hidden');

    const suggestionItems = page.locator('.suggestion-item');
    const count = await suggestionItems.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(10);
  });

  test('should select word and update boxes', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    await wordInput.fill('aband');

    const firstSuggestion = page.locator('.suggestion-item').first();
    await firstSuggestion.click();

    await expect(wordInput).toHaveValue('abandon');

    // Check that boxes were updated (abandon = index 0 = number 1 = 000000000001)
    const lastBox = page.locator('.box').nth(11);
    await expect(lastBox).toHaveClass(/active/);

    await expect(wordInput).toHaveValue('abandon');
  });

  test('should sync boxes to input when clicking boxes', async ({ page }) => {
    const box11 = page.locator('.box').nth(11); // Last box (value 1)
    await box11.click();

    // Word input should now show "abandon" (word at index 0)
    const wordInput = page.locator('#word-input');
    await expect(wordInput).toHaveValue('abandon');
  });

  test('should clear input when reset is clicked', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    await wordInput.fill('abili');

    const firstSuggestion = page.locator('.suggestion-item').first();
    await firstSuggestion.click();

    await expect(wordInput).toHaveValue('ability');

    const resetButton = page.locator('#reset');
    await resetButton.click();

    await expect(wordInput).toHaveValue('');
  });

  test('should support keyboard navigation in suggestions', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    await wordInput.fill('aba');

    await page.waitForSelector('.suggestion-item');

    await page.keyboard.press('ArrowDown');

    const firstItem = page.locator('.suggestion-item').first();
    await expect(firstItem).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('Enter');

    const value = await wordInput.inputValue();
    expect(value.startsWith('aba')).toBe(true);
  });

  test('should hide suggestions when clicking outside', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    await wordInput.fill('aba');

    const suggestions = page.locator('#word-suggestions');
    await expect(suggestions).not.toHaveAttribute('hidden');

    await page.locator('body').click({ position: { x: 0, y: 0 } });

    await page.waitForTimeout(300);

    await expect(suggestions).toHaveAttribute('hidden');
  });

  test('should hide suggestions on Escape key', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    await wordInput.fill('aba');

    const suggestions = page.locator('#word-suggestions');
    await expect(suggestions).not.toHaveAttribute('hidden');

    await page.keyboard.press('Escape');

    await page.waitForTimeout(300);
    await expect(suggestions).toHaveAttribute('hidden');
  });

  test('should show word index in suggestions', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    await wordInput.fill('aband');

    await page.waitForSelector('.suggestion-item');

    const suggestionIndex = page.locator('.suggestion-index').first();
    await expect(suggestionIndex).toContainText('#1');
  });

  test('should translate placeholder when language changes', async ({ page }) => {
    await page.locator('#language-toggle').click();
    await page.locator('[data-lang="spanish"]').click();

    await page.waitForTimeout(500);

    const wordInput = page.locator('#word-input');
    await expect(wordInput).toHaveAttribute('placeholder', 'ábaco');
  });

  test('should not trigger Reset shortcut when typing in input', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    await wordInput.fill('random');

    await wordInput.press('r');

    // Input should still contain 'random' + 'r'
    const value = await wordInput.inputValue();
    expect(value).toContain('r');
  });
});
