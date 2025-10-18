import { test, expect } from '@playwright/test';

test.describe('Modal Focus Management', () => {
  test('should move focus to modal when opened', async ({ page }) => {
    await page.goto('/');

    await page.click('#learn-more-btn');

    await page.waitForSelector('#learn-modal[aria-hidden="false"]');
    await page.waitForTimeout(150);

    // Check that focus is inside the modal
    const focusedElement = await page.evaluate(() => {
      const activeElement = document.activeElement;
      const modal = document.getElementById('learn-modal');
      return modal?.contains(activeElement);
    });

    expect(focusedElement).toBe(true);
  });

  test('should focus on close button when modal opens', async ({ page }) => {
    await page.goto('/');

    await page.click('#learn-more-btn');
    await page.waitForTimeout(150);

    // The first focusable element should be the close button
    const focusedElementId = await page.evaluate(() => document.activeElement?.id);

    // Should focus on a button inside modal (close button is first)
    expect(focusedElementId).toBe('modal-close');
  });

  test('should allow keyboard navigation within modal', async ({ page }) => {
    await page.goto('/');

    await page.click('#learn-more-btn');
    await page.waitForTimeout(150);

    // Tab should move focus within modal
    await page.keyboard.press('Tab');

    const focusedElement = await page.evaluate(() => {
      const activeElement = document.activeElement;
      const modal = document.getElementById('learn-modal');
      return modal?.contains(activeElement);
    });

    expect(focusedElement).toBe(true);
  });

  test('should close modal with Escape key from focused element', async ({ page }) => {
    await page.goto('/');

    await page.click('#learn-more-btn');
    await page.waitForTimeout(150);

    // Press Escape
    await page.keyboard.press('Escape');

    // Modal should close
    await page.waitForSelector('#learn-modal[aria-hidden="true"]');

    const isHidden = await page.getAttribute('#learn-modal', 'aria-hidden');
    expect(isHidden).toBe('true');
  });
});
