import { test, expect } from '@playwright/test';

test.describe('Toast Notification Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show toast when using keyboard on disabled box', async ({ page }) => {
    const box1024 = page.locator('.box').nth(1);
    await box1024.click();

    const box2048 = page.locator('.box').first();
    await box2048.focus();

    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');

    const toast = page.locator('#toast-notification');
    await toast.waitFor({ state: 'attached', timeout: 5000 });
    await expect(toast).toBeVisible();
  });

  test('should auto-hide toast after 3 seconds', async ({ page }) => {
    const box1024 = page.locator('.box').nth(1);
    await box1024.click();

    const box2048 = page.locator('.box').first();

    await box2048.click({ force: true });
    await box2048.click({ force: true });

    const toast = page.locator('#toast-notification');
    await toast.waitFor({ state: 'attached', timeout: 5000 });
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Cannot select this number');

    await toast.waitFor({ state: 'detached', timeout: 4000 });
    await expect(toast).not.toBeVisible();
  });

  test('should be centered and visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const box1024 = page.locator('.box').nth(1);
    await box1024.click();

    const box2048 = page.locator('.box').first();

    await box2048.click({ force: true });
    await box2048.click({ force: true });

    const toast = page.locator('#toast-notification');
    await toast.waitFor({ state: 'attached', timeout: 5000 });
    await expect(toast).toBeVisible();

    const boundingBox = await toast.boundingBox();
    const viewportSize = page.viewportSize();

    if (boundingBox && viewportSize) {
      const centerX = boundingBox.x + boundingBox.width / 2;
      const viewportCenterX = viewportSize.width / 2;
      const horizontalDiff = Math.abs(centerX - viewportCenterX);

      expect(horizontalDiff).toBeLessThan(20);
    }
  });
});
