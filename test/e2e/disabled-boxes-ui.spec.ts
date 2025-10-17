import { test, expect } from '@playwright/test';

test.describe('Disabled Boxes - UI Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.grid');
  });

  test('should not allow clicking disabled 2048 box', async ({ page }) => {
    const boxes = page.locator('.box');
    const box2048 = boxes.nth(0);
    const box1024 = boxes.nth(1);
    const indexDisplay = page.locator('#index');

    await box1024.click();
    await expect(indexDisplay).toHaveText('1024');

    await box2048.click({ force: true });

    await expect(indexDisplay).toHaveText('1024');
    await expect(box2048).not.toHaveClass(/active/);
  });

  test('should not allow clicking other disabled boxes when 2048 is active', async ({ page }) => {
    const boxes = page.locator('.box');
    const box2048 = boxes.nth(0);
    const box1024 = boxes.nth(1);
    const wordDisplay = page.locator('#word-input');

    await box2048.click();
    
    await expect(wordDisplay).not.toHaveClass(/error/);
    
    await box1024.click({ force: true });
    
    await expect(box1024).not.toHaveClass(/active/);
    await expect(box2048).toHaveClass(/active/);
  });

  test('should enable all boxes after reset', async ({ page }) => {
    const boxes = page.locator('.box');
    const resetButton = page.locator('#reset');

    await boxes.nth(0).click();
    
    await expect(boxes.nth(1)).toHaveClass(/disabled/);
    
    await resetButton.click();
    
    for (let i = 0; i < 12; i++) {
      await expect(boxes.nth(i)).not.toHaveClass(/disabled/);
    }
  });

  test('should not allow keyboard navigation to trigger disabled boxes', async ({ page }) => {
    const boxes = page.locator('.box');
    const box2048 = boxes.nth(0);
    const box1024 = boxes.nth(1);

    await box1024.click();
    
    await box2048.focus();
    await page.keyboard.press('Enter');
    
    await expect(box2048).not.toHaveClass(/active/);
    await expect(box1024).toHaveClass(/active/); // 1024 should still be active
  });

  test('should allow keyboard navigation through enabled boxes only', async ({ page }) => {
    const boxes = page.locator('.box');

    await boxes.nth(0).click();
    
    await boxes.nth(0).focus();
    await page.keyboard.press('ArrowRight');

    await page.keyboard.press('Enter');
    
    await expect(boxes.nth(1)).not.toHaveClass(/active/);
  });

  test('should have visual disabled state (disabled class)', async ({ page }) => {
    const boxes = page.locator('.box');
    const box2048 = boxes.nth(0);
    const box1024 = boxes.nth(1);

    await box1024.click();
    
    await expect(box2048).toHaveClass(/disabled/);
    
    await expect(box2048).toHaveAttribute('aria-disabled', 'true');
  });

  test('should show not-allowed cursor on disabled boxes', async ({ page }) => {
    const box2048 = page.locator('.box').nth(0);
    const box1024 = page.locator('.box').nth(1);

    await box1024.click();
    
    await expect(box2048).toHaveClass(/disabled/);
    
    const cursor = await box2048.evaluate((el) => 
      window.getComputedStyle(el).cursor
    );
    
    expect(cursor).toBe('not-allowed');
  });
});
