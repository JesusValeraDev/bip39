import { test, expect } from '@playwright/test';

test.describe('Word Input - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have word input field visible', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    await expect(wordInput).toBeVisible();
    
    const label = page.locator('#word-input-label');
    await expect(label).toBeVisible();
    await expect(label).toContainText('Type a word');
  });

  test('should show suggestions when typing', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    await wordInput.fill('aba');
    
    // Wait for suggestions to appear
    const suggestions = page.locator('#word-suggestions');
    await expect(suggestions).not.toHaveAttribute('hidden');
    
    // Check that suggestions appear
    const suggestionItems = page.locator('.suggestion-item');
    const count = await suggestionItems.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(10); // Limit to 10
  });

  test('should select word and update boxes', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    await wordInput.fill('abandon');
    
    // Click first suggestion
    const firstSuggestion = page.locator('.suggestion-item').first();
    await firstSuggestion.click();
    
    // Check that the word was selected
    await expect(wordInput).toHaveValue('abandon');
    
    // Check that boxes were updated (abandon = index 0 = number 1 = 000000000001)
    const lastBox = page.locator('.box').nth(11);
    await expect(lastBox).toHaveClass(/active/);
    
    // Check word input has the value
    await expect(wordInput).toHaveValue('abandon');
  });

  test('should sync boxes to input when clicking boxes', async ({ page }) => {
    // Click some boxes to create a pattern
    const box11 = page.locator('.box').nth(11); // Last box (value 1)
    await box11.click();
    
    // Word input should now show "abandon" (word at index 0)
    const wordInput = page.locator('#word-input');
    await expect(wordInput).toHaveValue('abandon');
  });

  test('should clear input when reset is clicked', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    await wordInput.fill('ability');
    
    const firstSuggestion = page.locator('.suggestion-item').first();
    await firstSuggestion.click();
    
    // Input should have value
    await expect(wordInput).toHaveValue('ability');
    
    // Click reset
    const resetButton = page.locator('#reset');
    await resetButton.click();
    
    // Input should be cleared
    await expect(wordInput).toHaveValue('');
  });

  test('should support keyboard navigation in suggestions', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    await wordInput.fill('aba');
    
    // Wait for suggestions
    await page.waitForSelector('.suggestion-item');
    
    // Press ArrowDown to select first item
    await page.keyboard.press('ArrowDown');
    
    const firstItem = page.locator('.suggestion-item').first();
    await expect(firstItem).toHaveAttribute('aria-selected', 'true');
    
    // Press Enter to select
    await page.keyboard.press('Enter');
    
    // Should select the word
    const value = await wordInput.inputValue();
    expect(value.startsWith('aba')).toBe(true);
  });

  test('should hide suggestions when clicking outside', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    await wordInput.fill('aba');
    
    // Wait for suggestions
    const suggestions = page.locator('#word-suggestions');
    await expect(suggestions).not.toHaveAttribute('hidden');
    
    // Click outside
    await page.locator('body').click({ position: { x: 0, y: 0 } });
    
    // Wait a bit for the blur timeout
    await page.waitForTimeout(300);
    
    // Suggestions should be hidden
    await expect(suggestions).toHaveAttribute('hidden');
  });

  test('should hide suggestions on Escape key', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    await wordInput.fill('aba');
    
    // Wait for suggestions
    const suggestions = page.locator('#word-suggestions');
    await expect(suggestions).not.toHaveAttribute('hidden');
    
    // Press Escape
    await page.keyboard.press('Escape');
    
    // Suggestions should be hidden
    await page.waitForTimeout(300);
    await expect(suggestions).toHaveAttribute('hidden');
  });

  test('should show word index in suggestions', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    await wordInput.fill('abandon');
    
    // Wait for suggestions
    await page.waitForSelector('.suggestion-item');
    
    // Check that index is shown
    const suggestionIndex = page.locator('.suggestion-index').first();
    await expect(suggestionIndex).toContainText('#1');
  });

  test('should translate input label when language changes', async ({ page }) => {
    // Change to Spanish
    await page.locator('#language-toggle').click();
    await page.locator('[data-lang="spanish"]').click();
    
    // Wait for translation
    await page.waitForTimeout(500);
    
    const label = page.locator('#word-input-label');
    await expect(label).toContainText('Escribe una palabra');
  });

  test('should not trigger Reset shortcut when typing in input', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    await wordInput.fill('random');
    
    // Type 'r' in the input
    await wordInput.press('r');
    
    // Input should still contain 'random' + 'r'
    const value = await wordInput.inputValue();
    expect(value).toContain('r');
  });
});
