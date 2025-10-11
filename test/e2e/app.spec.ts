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
    await expect(binary).toHaveText('000000000000');

    const word = page.locator('#word');
    await expect(word).toBeVisible();
  });

  test('should toggle box when clicked', async ({ page }) => {
    const firstBox = page.locator('.box').first();

    await expect(firstBox).not.toHaveClass(/active/);

    await firstBox.click();
    await expect(firstBox).toHaveClass(/active/);

    await firstBox.click();
    await expect(firstBox).not.toHaveClass(/active/);
  });

  test('should show error state for out of range values', async ({ page }) => {
    // Select boxes that exceed 2048
    await page.locator('.box').nth(0).click(); // 2048
    await page.locator('.box').nth(11).click(); // 1

    const binary = page.locator('#binary');
    await expect(binary).toHaveText('100000000001');

    const word = page.locator('#word');
    await expect(word).toHaveClass(/error/);

    const index = page.locator('#index');
    await expect(index).toHaveText('2049');
  });

  test('should display correct word for valid index', async ({ page }) => {
    // Click the last box (index 1 = "abandon")
    await page.locator('.box').nth(11).click();

    const binary = page.locator('#binary');
    await expect(binary).toHaveText('000000000001');

    const word = page.locator('#word');
    await expect(word).not.toBeEmpty();
    await expect(word).not.toHaveClass(/error/);

    const index = page.locator('#index');
    await expect(index).toHaveText('1');
  });

  test('should reset all boxes when reset button is clicked', async ({ page }) => {
    // Click some boxes
    await page.locator('.box').nth(0).click();
    await page.locator('.box').nth(5).click();
    await page.locator('.box').nth(11).click();

    await expect(page.locator('.box.active')).toHaveCount(3);
  
    await page.locator('#reset').click();

    await expect(page.locator('.box.active')).toHaveCount(0);

    const binary = page.locator('#binary');
    await expect(binary).toHaveText('000000000000');
  });
});
