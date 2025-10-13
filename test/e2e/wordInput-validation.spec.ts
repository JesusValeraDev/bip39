import { test, expect } from '@playwright/test';

test.describe('Word Input - Validation & Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show error state for invalid word', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    
    // Type an invalid word
    await wordInput.fill('invalidword123');
    
    // Blur the input to trigger validation
    await wordInput.blur();
    
    // Wait a bit for validation
    await page.waitForTimeout(100);
    
    // Input should have error class
    await expect(wordInput).toHaveClass(/error/);
  });

  test('should clear boxes when invalid word is typed', async ({ page }) => {
    // First select some boxes
    const box = page.locator('.box').nth(11);
    await box.click();
    
    // Verify box is active
    await expect(box).toHaveClass(/active/);
    const wordInput = page.locator('#word-input');
    await expect(wordInput).toHaveValue('abandon'); // Word #1
    
    // Wait a bit for async sync to complete
    await page.waitForTimeout(100);
    
    // Now type invalid word
    await wordInput.fill('notaword');
    await wordInput.blur();
    
    // Box should be deactivated - wait for it to not have active class
    await expect(box).not.toHaveClass(/active/, { timeout: 2000 });
  });

  test('should remove error state when valid word is typed', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    
    // Type invalid word first
    await wordInput.fill('invalid');
    await wordInput.blur();
    await page.waitForTimeout(100);
    await expect(wordInput).toHaveClass(/error/);
    
    // Now type valid word and validate by blur
    await wordInput.click();
    await wordInput.fill('abandon');
    
    // Wait for suggestions to appear and be visible
    const firstSuggestion = page.locator('.suggestion-item').first();
    await expect(firstSuggestion).toBeVisible({ timeout: 2000 });
    
    // Click suggestion using mousedown to prevent racing with blur
    await firstSuggestion.dispatchEvent('mousedown');
    
    // Wait for the word to be selected and error to be removed
    await expect(wordInput).not.toHaveClass(/error/, { timeout: 2000 });
    await expect(wordInput).toHaveValue('abandon');
  });

  test('should not show error for empty input', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    
    // Type something then clear it
    await wordInput.fill('test');
    await wordInput.clear();
    await wordInput.blur();
    
    // Wait for validation
    await page.waitForTimeout(100);
    
    // Should not have error class
    await expect(wordInput).not.toHaveClass(/error/);
  });

  test('should show toast when invalid word is typed', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    
    // Type invalid word
    await wordInput.fill('notavalidword');
    await wordInput.blur();
    
    // Wait for toast to appear
    const toast = page.locator('#invalid-word-toast');
    await toast.waitFor({ state: 'attached', timeout: 1000 });
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('not in the BIP39 wordlist');
  });

  test('should auto-hide invalid word toast after 3 seconds', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    
    // Type invalid word
    await wordInput.fill('invalidword');
    await wordInput.blur();
    
    // Wait for toast
    const toast = page.locator('#invalid-word-toast');
    await toast.waitFor({ state: 'attached', timeout: 1000 });
    await expect(toast).toBeVisible();
    
    // Wait for toast to disappear
    await toast.waitFor({ state: 'detached', timeout: 4000 });
    await expect(toast).not.toBeVisible();
  });

  test('should translate invalid word toast message', async ({ page }) => {
    // Change to Spanish
    await page.locator('#language-toggle').click();
    await page.locator('[data-lang="spanish"]').click();
    await page.waitForTimeout(500);
    
    const wordInput = page.locator('#word-input');
    
    // Type invalid word
    await wordInput.fill('notvalid');
    await wordInput.blur();
    
    // Toast should be in Spanish
    const toast = page.locator('#invalid-word-toast');
    await toast.waitFor({ state: 'attached', timeout: 1000 });
    await expect(toast).toContainText('no está en la lista BIP39');
  });
});
