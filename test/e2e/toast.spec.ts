import { test, expect } from '@playwright/test';

test.describe('Toast Notification Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show toast when clicking disabled box twice', async ({ page }) => {
    // Select a box to disable the 2048 box
    const box1024 = page.locator('.box').nth(1);
    await box1024.click();
    
    const box2048 = page.locator('.box').first();
    
    // Click disabled box twice (use force since it's aria-disabled)
    await box2048.click({ force: true });
    await box2048.click({ force: true });
    
    // Wait for toast to appear (it's created dynamically)
    const toast = page.locator('#toast-notification');
    await toast.waitFor({ state: 'attached', timeout: 5000 });
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Cannot select this number');
  });

  test('should show toast when using keyboard on disabled box', async ({ page }) => {
    // Select a box to disable the 2048 box
    const box1024 = page.locator('.box').nth(1);
    await box1024.click();
    
    const box2048 = page.locator('.box').first();
    await box2048.focus();
    
    // Press Enter twice
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    
    // Wait for toast to appear
    const toast = page.locator('#toast-notification');
    await toast.waitFor({ state: 'attached', timeout: 5000 });
    await expect(toast).toBeVisible();
  });

  test('should auto-hide toast after 3 seconds', async ({ page }) => {
    // Select a box to disable the 2048 box
    const box1024 = page.locator('.box').nth(1);
    await box1024.click();
    
    const box2048 = page.locator('.box').first();
    
    // Click disabled box twice (use force since it's aria-disabled)
    await box2048.click({ force: true });
    await box2048.click({ force: true });
    
    // Wait for toast to appear
    const toast = page.locator('#toast-notification');
    await toast.waitFor({ state: 'attached', timeout: 5000 });
    await expect(toast).toBeVisible();
    
    // Wait for toast to disappear (3s + 0.3s animation)
    await toast.waitFor({ state: 'detached', timeout: 4000 });
    await expect(toast).not.toBeVisible();
  });

  test('should translate toast message when language changes', async ({ page }) => {
    // Change to Spanish
    await page.locator('#language-toggle').click();
    await page.locator('[data-lang="spanish"]').click();
    
    // Wait for language to be applied
    await page.waitForTimeout(500);
    
    // Select a box to disable the 2048 box
    const box1024 = page.locator('.box').nth(1);
    await box1024.click();
    
    const box2048 = page.locator('.box').first();
    
    // Click disabled box twice (use force since it's aria-disabled)
    await box2048.click({ force: true });
    await box2048.click({ force: true });
    
    // Wait for toast and check Spanish text
    const toast = page.locator('#toast-notification');
    await toast.waitFor({ state: 'attached', timeout: 5000 });
    await expect(toast).toContainText('No se puede seleccionar');
  });

  test('should be centered and visible on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Select a box to disable the 2048 box
    const box1024 = page.locator('.box').nth(1);
    await box1024.click();
    
    const box2048 = page.locator('.box').first();
    
    // Click disabled box twice (use force since it's aria-disabled)
    await box2048.click({ force: true });
    await box2048.click({ force: true });
    
    // Wait for toast and check positioning
    const toast = page.locator('#toast-notification');
    await toast.waitFor({ state: 'attached', timeout: 5000 });
    await expect(toast).toBeVisible();
    
    const boundingBox = await toast.boundingBox();
    const viewportSize = page.viewportSize();
    
    if (boundingBox && viewportSize) {
      // Toast should be horizontally centered (approximately)
      const centerX = boundingBox.x + boundingBox.width / 2;
      const viewportCenterX = viewportSize.width / 2;
      const horizontalDiff = Math.abs(centerX - viewportCenterX);
      
      // Allow 20px tolerance for mobile
      expect(horizontalDiff).toBeLessThan(20);
    }
  });
});
