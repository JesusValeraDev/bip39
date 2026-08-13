import { test, expect } from '@playwright/test';
import { existsSync, statSync } from 'fs';
import { resolve } from 'path';

const OFFLINE_FILE = resolve('dist/bip39-offline.html');

test.describe('Offline Download - Button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should offer the page as a download', async ({ page }) => {
    const button = page.locator('#download-offline');

    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute('download', 'bip39-offline.html');
    await expect(button).toHaveAttribute('href', 'bip39-offline.html');
  });

  test('should translate its label', async ({ page }) => {
    const button = page.locator('#download-offline');

    await expect(button).toHaveAttribute('aria-label', 'Download to use offline');

    await page.locator('#language-toggle').click();
    await page.locator('[data-lang="spanish"]').click();
    await page.waitForTimeout(500);

    await expect(button).toHaveAttribute('aria-label', 'Descargar para usar sin conexión');
  });
});

// The file itself is built by the global setup, so it is ready before any worker
test.describe('Offline Download - The downloaded page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`file://${OFFLINE_FILE}`);
  });

  test('should be a single file', () => {
    expect(existsSync(OFFLINE_FILE)).toBe(true);

    // Everything inlined, so comfortably larger than the bare markup
    expect(statSync(OFFLINE_FILE).size).toBeGreaterThan(200 * 1024);
  });

  test('should ask the network for nothing', async ({ page }) => {
    const offSiteRequests: string[] = [];
    const failedRequests: string[] = [];

    page.on('request', request => {
      if (!request.url().startsWith('file://')) offSiteRequests.push(request.url());
    });
    page.on('requestfailed', request => failedRequests.push(request.url()));

    await page.reload();
    await page.locator('#language-toggle').click();
    await page.locator('[data-lang="french"]').click();
    await page.waitForTimeout(500);

    expect(offSiteRequests).toEqual([]);
    expect(failedRequests).toEqual([]);
  });

  test('should raise no errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));

    await page.reload();
    await page.waitForTimeout(500);

    expect(errors).toEqual([]);
  });

  test('should resolve words from the embedded wordlist', async ({ page }) => {
    await page.locator('#word-input').click();
    await page.keyboard.type('aban');

    await expect(page.locator('#word-input')).toHaveValue('abandon');
    await expect(page.locator('#index')).toHaveText('1');
  });

  test('should carry every language', async ({ page }) => {
    const embedded = await page.evaluate(
      () => Object.keys((window as { __BIP39_WORDLISTS__?: Record<string, string> }).__BIP39_WORDLISTS__ ?? {}).length
    );

    expect(embedded).toBe(10);
  });

  test('should switch language without the network', async ({ page }) => {
    await page.locator('#language-toggle').click();
    await page.locator('[data-lang="spanish"]').click();
    await page.waitForTimeout(500);

    await page.locator('#word-input').click();
    await page.keyboard.type('abac');

    await expect(page.locator('#word-input')).toHaveValue('ábaco'.normalize('NFD'));
    await expect(page.locator('#info-text')).toContainText('Elige una palabra');
  });

  test('should render icons from the inlined sprite', async ({ page }) => {
    const themeIcon = await page.locator('#theme-toggle svg').first().boundingBox();
    const flagIcon = await page.locator('#current-flag').boundingBox();

    expect(themeIcon?.width).toBeGreaterThan(0);
    expect(flagIcon?.width).toBeGreaterThan(0);
  });

  test('should keep the boxes and the index base working', async ({ page }) => {
    await page.locator('.box').last().click();
    await expect(page.locator('#index')).toHaveText('1');

    await page.locator('#index-base-toggle').click();
    await expect(page.locator('#index')).toHaveText('0');
  });

  test('should open the modal', async ({ page }) => {
    await page.locator('#learn-more-btn').click();

    await expect(page.locator('#learn-modal')).toBeVisible();
    await expect(page.locator('#modal-title')).not.toBeEmpty();
  });

  test('should not offer to download itself', async ({ page }) => {
    await expect(page.locator('#download-offline')).toHaveCount(0);
  });
});
