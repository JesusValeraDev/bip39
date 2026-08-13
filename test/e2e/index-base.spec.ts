import { test, expect } from '@playwright/test';

test.describe('Index Base Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should start 1-based', async ({ page }) => {
    await expect(page.locator('#index-base-value')).toHaveText('#1');
    await expect(page.locator('#index-base-toggle')).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('#index-max')).toHaveText('2048');
    await expect(page.locator('#info-text')).toContainText('1-2048');
    await expect(page.locator('#index')).toHaveText('-');
  });

  test('should make the empty pattern the first word when 0-based', async ({ page }) => {
    await page.locator('#index-base-toggle').click();

    await expect(page.locator('#binary')).toHaveText('○○○○○○○○○○○○');
    await expect(page.locator('#index')).toHaveText('0');
    await expect(page.locator('#word-input')).toHaveValue('abandon');
  });

  test('should read the pattern as the index itself when 0-based', async ({ page }) => {
    await page.locator('#index-base-toggle').click();

    // 0001 -> ability
    await page.locator('.box').last().click();
    await expect(page.locator('#index')).toHaveText('1');
    await expect(page.locator('#word-input')).toHaveValue('ability');

    // 0010 -> able
    await page.locator('.box').last().click();
    await page.locator('.box').nth(10).click();
    await expect(page.locator('#binary')).toHaveText('○○○○○○○○○○●○');
    await expect(page.locator('#index')).toHaveText('2');
    await expect(page.locator('#word-input')).toHaveValue('able');
  });

  test('should shift the range and the max when toggled', async ({ page }) => {
    await page.locator('#index-base-toggle').click();

    await expect(page.locator('#index-base-value')).toHaveText('#0');
    await expect(page.locator('#index-base-toggle')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#index-max')).toHaveText('2047');
    await expect(page.locator('#info-text')).toContainText('0-2047');
  });

  test('should reach the last word at 2047 without the 2048 box', async ({ page }) => {
    await page.locator('#index-base-toggle').click();

    const boxes = page.locator('.box');
    for (let index = 1; index < 12; index++) {
      await boxes.nth(index).click();
    }

    await expect(page.locator('#binary')).toHaveText('○●●●●●●●●●●●');
    await expect(page.locator('#index')).toHaveText('2047');
    await expect(page.locator('#word-input')).toHaveValue('zoo');
  });

  test('should keep the 2048 box disabled when 0-based', async ({ page }) => {
    await page.locator('#index-base-toggle').click();

    const box2048 = page.locator('.box').first();
    await expect(box2048).toHaveClass(/disabled/);
    await expect(box2048).toHaveAttribute('aria-disabled', 'true');

    await box2048.click({ force: true });
    await expect(box2048).not.toHaveClass(/active/);
  });

  test('should keep the selected word when toggling', async ({ page }) => {
    await page.locator('#word-input').fill('able');
    await page.locator('#word-input').blur();

    await expect(page.locator('#index')).toHaveText('3');
    await expect(page.locator('#binary')).toHaveText('○○○○○○○○○○●●');

    await page.locator('#index-base-toggle').click();

    await expect(page.locator('#word-input')).toHaveValue('able');
    await expect(page.locator('#index')).toHaveText('2');
    await expect(page.locator('#binary')).toHaveText('○○○○○○○○○○●○');
  });

  test('should carry the last word across the toggle', async ({ page }) => {
    await page.locator('.box').first().click(); // 2048 -> zoo, 1-based
    await expect(page.locator('#word-input')).toHaveValue('zoo');

    await page.locator('#index-base-toggle').click();

    await expect(page.locator('#index')).toHaveText('2047');
    await expect(page.locator('#word-input')).toHaveValue('zoo');
  });

  test('should toggle back to 1-based', async ({ page }) => {
    await page.locator('#index-base-toggle').click();
    await expect(page.locator('#index')).toHaveText('0');

    await page.locator('#index-base-toggle').click();

    await expect(page.locator('#index')).toHaveText('1');
    await expect(page.locator('#word-input')).toHaveValue('abandon');
    await expect(page.locator('#index-base-value')).toHaveText('#1');
  });

  test('should shift the index shown in suggestions', async ({ page }) => {
    await page.locator('#index-base-toggle').click();

    await page.locator('#word-input').fill('aba');
    await page.waitForSelector('.suggestion-item');

    await expect(page.locator('.suggestion-index').first()).toContainText('#0');
  });

  test('should survive a reload', async ({ page }) => {
    await page.locator('#index-base-toggle').click();
    await page.reload();

    await expect(page.locator('#index-base-value')).toHaveText('#0');
    await expect(page.locator('#index-max')).toHaveText('2047');
    await expect(page.locator('#index')).toHaveText('0');
    await expect(page.locator('#word-input')).toHaveValue('abandon');
  });

  test('should keep the range translated after a language change', async ({ page }) => {
    await page.locator('#index-base-toggle').click();

    await page.locator('#language-toggle').click();
    await page.locator('[data-lang="spanish"]').click();
    await page.waitForTimeout(500);

    await expect(page.locator('#info-text')).toContainText('0-2047');
    await expect(page.locator('#index-base-value')).toHaveText('#0');
  });
});

test.describe('Index Base Toggle - Typing over the first word', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#index-base-toggle').click();
    await page.locator('#word-input').click();
  });

  test('should empty the input on Escape so a word can be typed', async ({ page }) => {
    await expect(page.locator('#word-input')).toHaveValue('abandon');

    await page.keyboard.press('Escape');

    await expect(page.locator('#word-input')).toHaveValue('');
    // The boxes still name the first word; only the field is free
    await expect(page.locator('#index')).toHaveText('0');
  });

  test('should take a typed word rather than appending to the first one', async ({ page }) => {
    await page.keyboard.press('Escape');
    await page.keyboard.type('able');

    await expect(page.locator('#word-input')).toHaveValue('able');
    await expect(page.locator('#index')).toHaveText('2');
  });

  test('should fill the first word back in when focus leaves', async ({ page }) => {
    await page.keyboard.press('Escape');
    await expect(page.locator('#word-input')).toHaveValue('');

    await page.locator('#word-input').blur();

    await expect(page.locator('#word-input')).toHaveValue('abandon');
    await expect(page.locator('#index')).toHaveText('0');
  });

  test('should fill the first word back in when the typed word does not exist', async ({ page }) => {
    await page.keyboard.press('Escape');
    await page.keyboard.type('zzz');
    await expect(page.locator('#word-input')).toHaveValue('zzz');

    await page.locator('#word-input').blur();
    await page.waitForTimeout(300);

    await expect(page.locator('#word-input')).toHaveValue('abandon');
    await expect(page.locator('#word-input')).not.toHaveClass(/error/);
  });

  test('should still follow the boxes after the input was emptied', async ({ page }) => {
    await page.keyboard.press('Escape');

    await page.locator('.box').last().click();

    await expect(page.locator('#word-input')).toHaveValue('ability');
    await expect(page.locator('#index')).toHaveText('1');
  });

  test('should leave 1-based numbering empty on Escape', async ({ page }) => {
    await page.locator('#index-base-toggle').click();
    await page.locator('#word-input').click();

    await page.keyboard.press('Escape');
    await page.locator('#word-input').blur();

    await expect(page.locator('#word-input')).toHaveValue('');
    await expect(page.locator('#index')).toHaveText('-');
  });
});
