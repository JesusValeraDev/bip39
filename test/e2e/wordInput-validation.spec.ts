import { test, expect } from '@playwright/test';

test.describe('Word Input - Validation & Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show error state for invalid word', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    
    await wordInput.fill('invalidword123');
    
    await wordInput.blur();
    
    await page.waitForTimeout(100);
    
    await expect(wordInput).toHaveClass(/error/);
  });

  test('should clear boxes when invalid word is typed', async ({ page }) => {
    const box = page.locator('.box').nth(11);
    await box.click();
    
    await expect(box).toHaveClass(/active/);
    const wordInput = page.locator('#word-input');
    await expect(wordInput).toHaveValue('abandon'); // Word #1
    
    await page.waitForTimeout(100);
    
    await wordInput.fill('notaword');
    await wordInput.blur();
    
    await expect(box).not.toHaveClass(/active/, { timeout: 2000 });
  });

  test('should remove error state when valid word is typed', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    
    await wordInput.fill('invalid');
    await wordInput.blur();
    await page.waitForTimeout(100);
    await expect(wordInput).toHaveClass(/error/);
    
    await wordInput.click();
    await wordInput.fill('abandon');
    
    const firstSuggestion = page.locator('.suggestion-item').first();
    await expect(firstSuggestion).toBeVisible({ timeout: 2000 });
    
    await firstSuggestion.dispatchEvent('mousedown');
    
    await expect(wordInput).not.toHaveClass(/error/, { timeout: 2000 });
    await expect(wordInput).toHaveValue('abandon');
  });

  test('should not show error for empty input', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    
    await wordInput.fill('test');
    await wordInput.clear();
    await wordInput.blur();
    
    await page.waitForTimeout(100);
    
    await expect(wordInput).not.toHaveClass(/error/);
  });

  test('should show toast when invalid word is typed', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    
    await wordInput.fill('notavalidword');
    await wordInput.blur();
    
    const toast = page.locator('#invalid-word-toast');
    await toast.waitFor({ state: 'attached', timeout: 1000 });
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('not in the BIP39 wordlist');
  });

  test('should auto-hide invalid word toast after 3 seconds', async ({ page }) => {
    const wordInput = page.locator('#word-input');
    
    await wordInput.fill('invalidword');
    await wordInput.blur();
    
    const toast = page.locator('#invalid-word-toast');
    await toast.waitFor({ state: 'attached', timeout: 1000 });
    await expect(toast).toBeVisible();
    
    await toast.waitFor({ state: 'detached', timeout: 4000 });
    await expect(toast).not.toBeVisible();
  });

  test('should translate invalid word toast message', async ({ page }) => {
    await page.locator('#language-toggle').click();
    await page.locator('[data-lang="spanish"]').click();
    await page.waitForTimeout(500);
    
    const wordInput = page.locator('#word-input');
    
    await wordInput.fill('notvalid');
    await wordInput.blur();
    
    const toast = page.locator('#invalid-word-toast');
    await toast.waitFor({ state: 'attached', timeout: 1000 });
    await expect(toast).toContainText('no está en la lista BIP39');
  });
});
