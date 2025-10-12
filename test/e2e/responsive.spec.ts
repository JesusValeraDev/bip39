import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('should display correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');

    const grid = page.locator('.grid');
    await expect(grid).toBeVisible();

    const boxes = page.locator('.box');
    await expect(boxes).toHaveCount(12);

    const resetButton = page.locator('#reset');
    await expect(resetButton).toBeVisible();
  });

  test('should display correctly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto('/');

    await expect(page.locator('.grid')).toBeVisible();
    await expect(page.locator('.word-display')).toBeVisible();
    await expect(page.locator('#reset')).toBeVisible();
  });

  test('should display correctly on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    await expect(page.locator('.grid')).toBeVisible();
    await expect(page.locator('.word-display')).toBeVisible();
    await expect(page.locator('#reset')).toBeVisible();
  });

  test('should have clickable boxes on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const firstBox = page.locator('.box').first();
    await firstBox.click();

    await expect(firstBox).toHaveClass(/active/);
  });

  test('should adapt grid layout on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const grid = page.locator('.grid');

    const gridDisplay = await grid.evaluate(el => 
      window.getComputedStyle(el).display
    );

    expect(gridDisplay).toBe('grid');
  });

  test('should display privacy warning on mobile', async ({ page }) => {
    // iPhone SE dimensions
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const privacyWarning = page.locator('.privacy-warning');
    await expect(privacyWarning).toBeVisible();
    
    // Check privacy warning content is visible
    const warningTitle = page.locator('.warning-title');
    await expect(warningTitle).toContainText('Privacy Protected');
    
    const privacyText = page.locator('#privacy-text');
    await expect(privacyText).toBeVisible();
  });
});
