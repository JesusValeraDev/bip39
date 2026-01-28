import { test, expect } from '@playwright/test';

test.describe('BIP39 Word Selector', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/BIP39/);
    await expect(page.locator('h1')).toContainText('BIP39 Word Selector');
  });

  test('should display initial state correctly', async ({ page }) => {
    const boxes = page.locator('.box');
    await expect(boxes).toHaveCount(12);

    const binary = page.locator('#binary');
    await expect(binary).toHaveText('○○○○○○○○○○○○');

    const wordInput = page.locator('#word-input');
    await expect(wordInput).toBeVisible();
  });

  test('should toggle box when clicked', async ({ page }) => {
    const firstBox = page.locator('.box').first(); // 2048

    await expect(firstBox).not.toHaveClass(/active/);

    await firstBox.click();
    await expect(firstBox).toHaveClass(/active/);

    await firstBox.click();
    await expect(firstBox).not.toHaveClass(/active/);
  });

  test('should display a word', async ({ page }) => {
    await page.locator('.box').last().click(); // 1

    const binary = page.locator('#binary');
    await expect(binary).toHaveText('○○○○○○○○○○○●');

    const wordInput = page.locator('#word-input');
    await expect(wordInput).toHaveValue('abandon');

    const index = page.locator('#index');
    await expect(index).toHaveText('1');
  });

  test('should prevent out of range values with disabled boxes', async ({ page }) => {
    await page.locator('.box').first().click(); // 2048

    // Now try to click box 11 (value 1) - should be disabled
    const box1 = page.locator('.box').nth(11);
    await expect(box1).toHaveClass(/disabled/);

    const binary = page.locator('#binary');
    await expect(binary).toHaveText('●○○○○○○○○○○○');

    const wordInput = page.locator('#word-input');
    await expect(wordInput).not.toHaveClass(/error/);

    const index = page.locator('#index');
    await expect(index).toHaveText('2048');
  });

  test('should reset all boxes when reset button is clicked', async ({ page }) => {
    await page.locator('.box').nth(1).click(); // 1024
    await page.locator('.box').nth(5).click(); // 64
    await page.locator('.box').nth(11).click(); // 1

    await expect(page.locator('.box.active')).toHaveCount(3);

    await page.locator('#reset').click();

    await expect(page.locator('.box.active')).toHaveCount(0);

    const binary = page.locator('#binary');
    await expect(binary).toHaveText('○○○○○○○○○○○○');
  });
});
