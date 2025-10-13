import { test, expect } from '@playwright/test';

test.describe('Disabled Boxes Logic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.grid');
  });

  test.describe('2048 Box Disable Logic', () => {
    test('should disable 2048 box when any other box is clicked', async ({ page }) => {
      // Get all boxes
      const boxes = page.locator('.box');
      const box2048 = boxes.nth(0); // First box is 2048
      const box1024 = boxes.nth(1); // Second box is 1024

      // Initially, 2048 should be enabled
      await expect(box2048).not.toBeDisabled();

      // Click 1024
      await box1024.click();

      // Now 2048 should be disabled
      await expect(box2048).toBeDisabled();
      await expect(box2048).toHaveClass(/disabled/);
      await expect(box2048).toHaveAttribute('aria-disabled', 'true');
    });

    test('should keep 2048 disabled when multiple other boxes are active', async ({ page }) => {
      const boxes = page.locator('.box');
      const box2048 = boxes.nth(0);
      const box1024 = boxes.nth(1);
      const box512 = boxes.nth(2);

      // Click multiple boxes
      await box1024.click();
      await box512.click();

      // 2048 should be disabled
      await expect(box2048).toBeDisabled();
      await expect(box2048).toHaveClass(/disabled/);
    });

    test('should enable 2048 when all other boxes are deactivated', async ({ page }) => {
      const boxes = page.locator('.box');
      const box2048 = boxes.nth(0);
      const box1024 = boxes.nth(1);

      // Click 1024
      await box1024.click();
      await expect(box2048).toBeDisabled();

      // Deactivate 1024
      await box1024.click();

      // 2048 should be enabled again
      await expect(box2048).not.toBeDisabled();
      await expect(box2048).not.toHaveClass(/disabled/);
      await expect(box2048).toHaveAttribute('aria-disabled', 'false');
    });

    test('should not allow clicking disabled 2048 box', async ({ page }) => {
      const boxes = page.locator('.box');
      const box2048 = boxes.nth(0);
      const box1024 = boxes.nth(1);
      const indexDisplay = page.locator('#index');

      // Click 1024 first
      await box1024.click();
      await expect(indexDisplay).toHaveText('1024');

      // Try to click disabled 2048 (should not work)
      await box2048.click({ force: true }); // Force click to bypass Playwright's actionability checks

      // Index should not change (still 1024, not out of range)
      await expect(indexDisplay).toHaveText('1024');
      
      // 2048 should still not be active
      await expect(box2048).not.toHaveClass(/active/);
    });
  });

  test.describe('Other Boxes Disable Logic', () => {
    test('should disable all other boxes when 2048 is clicked', async ({ page }) => {
      const boxes = page.locator('.box');
      const box2048 = boxes.nth(0);

      // Click 2048
      await box2048.click();

      // All other boxes (1-11) should be disabled
      for (let i = 1; i < 12; i++) {
        const box = boxes.nth(i);
        await expect(box).toBeDisabled();
        await expect(box).toHaveClass(/disabled/);
        await expect(box).toHaveAttribute('aria-disabled', 'true');
      }
    });

    test('should enable all other boxes when 2048 is deactivated', async ({ page }) => {
      const boxes = page.locator('.box');
      const box2048 = boxes.nth(0);

      // Click 2048 to activate
      await box2048.click();

      // Click 2048 again to deactivate
      await box2048.click();

      // All boxes should be enabled
      for (let i = 1; i < 12; i++) {
        const box = boxes.nth(i);
        await expect(box).not.toBeDisabled();
        await expect(box).not.toHaveClass(/disabled/);
        await expect(box).toHaveAttribute('aria-disabled', 'false');
      }
    });

    test('should not allow clicking other disabled boxes when 2048 is active', async ({ page }) => {
      const boxes = page.locator('.box');
      const box2048 = boxes.nth(0);
      const box1024 = boxes.nth(1);
      const wordDisplay = page.locator('#word-input');

      // Click 2048
      await box2048.click();
      
      // Word should show index 2048
      await expect(page.locator('#index')).toHaveText('2048');

      // Try to click disabled 1024 (should not work)
      await box1024.click({ force: true });

      // Index should still be 2048
      await expect(page.locator('#index')).toHaveText('2048');
      
      // 1024 should not be active
      await expect(box1024).not.toHaveClass(/active/);
    });
  });

  test.describe('Word Display with Disabled Logic', () => {
    test('should display correct word when 2048 is selected', async ({ page }) => {
      const boxes = page.locator('.box');
      const box2048 = boxes.nth(0);
      const wordDisplay = page.locator('#word-input');
      const indexDisplay = page.locator('#index');

      // Click 2048
      await box2048.click();

      // Should show word at index 2048
      await expect(indexDisplay).toHaveText('2048');
      await expect(wordDisplay).not.toHaveClass(/error/);
      // Word should be populated (wait for async sync)
      await page.waitForTimeout(100);
      const wordValue = await wordDisplay.inputValue();
      expect(wordValue).toBeTruthy();
    });

    test('should never show out of range when using disabled logic', async ({ page }) => {
      const boxes = page.locator('.box');
      const wordDisplay = page.locator('#word-input');

      // Try various combinations - should never be out of range
      await boxes.nth(0).click(); // 2048
      await expect(wordDisplay).not.toHaveClass(/error/);

      // Reset
      await page.locator('#reset').click();

      // Try clicking multiple boxes (not 2048)
      await boxes.nth(1).click(); // 1024
      await boxes.nth(2).click(); // 512
      await boxes.nth(11).click(); // 1
      await expect(wordDisplay).not.toHaveClass(/error/);
    });
  });

  test.describe('Reset Button with Disabled Logic', () => {
    test('should enable all boxes after reset', async ({ page }) => {
      const boxes = page.locator('.box');
      const resetButton = page.locator('#reset');

      // Click 2048 (disables other boxes)
      await boxes.nth(0).click();

      // Reset
      await resetButton.click();

      // All boxes should be enabled
      for (let i = 0; i < 12; i++) {
        const box = boxes.nth(i);
        await expect(box).not.toBeDisabled();
        await expect(box).not.toHaveClass(/disabled/);
        await expect(box).toHaveAttribute('aria-disabled', 'false');
      }
    });

    test('should enable 2048 after resetting other active boxes', async ({ page }) => {
      const boxes = page.locator('.box');
      const box2048 = boxes.nth(0);
      const resetButton = page.locator('#reset');

      // Click some other boxes (disables 2048)
      await boxes.nth(1).click();
      await boxes.nth(5).click();
      await expect(box2048).toBeDisabled();

      // Reset
      await resetButton.click();

      // 2048 should be enabled
      await expect(box2048).not.toBeDisabled();
      await expect(box2048).not.toHaveClass(/disabled/);
    });
  });

  test.describe('Keyboard Navigation with Disabled Logic', () => {
    test('should not allow keyboard navigation to trigger disabled boxes', async ({ page }) => {
      const boxes = page.locator('.box');
      const box2048 = boxes.nth(0);
      const box1024 = boxes.nth(1);

      // Click 1024 to disable 2048
      await box1024.click();
      await expect(box2048).toBeDisabled();

      // Focus 2048
      await box2048.focus();

      // Try to activate with Enter
      await page.keyboard.press('Enter');

      // 2048 should not be active
      await expect(box2048).not.toHaveClass(/active/);

      // Try to activate with Space
      await page.keyboard.press('Space');

      // 2048 should still not be active
      await expect(box2048).not.toHaveClass(/active/);
    });

    test('should allow keyboard navigation through enabled boxes only', async ({ page }) => {
      const boxes = page.locator('.box');
      const box2048 = boxes.nth(0);

      // Click 2048 (disables all other boxes)
      await box2048.click();

      // Focus should work on 2048 (enabled)
      await box2048.focus();
      await expect(box2048).toBeFocused();

      // But other boxes should not respond to keyboard
      const box1024 = boxes.nth(1);
      await box1024.focus();
      await page.keyboard.press('Space');

      // 1024 should not be active
      await expect(box1024).not.toHaveClass(/active/);
    });
  });

  test.describe('Visual Feedback', () => {
    test('should have visual disabled state (disabled class)', async ({ page }) => {
      const boxes = page.locator('.box');
      const box2048 = boxes.nth(0);
      const box1024 = boxes.nth(1);

      // Click 1024
      await box1024.click();

      // 2048 should have disabled class
      await expect(box2048).toHaveClass(/disabled/);
      await expect(box2048).toBeDisabled();
      
      // Verify CSS class is applied (which includes opacity: 0.4)
      const hasDisabledClass = await box2048.evaluate((el) => {
        return el.classList.contains('disabled');
      });
      expect(hasDisabledClass).toBe(true);
    });

    test('should show not-allowed cursor on disabled boxes', async ({ page }) => {
      const boxes = page.locator('.box');
      const box2048 = boxes.nth(0);
      const box1024 = boxes.nth(1);

      // Click 1024
      await box1024.click();

      // 2048 should have cursor: not-allowed
      const cursor = await box2048.evaluate((el) => {
        return window.getComputedStyle(el).cursor;
      });
      expect(cursor).toBe('not-allowed');
    });
  });
});
