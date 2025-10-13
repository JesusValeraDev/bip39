import { test, expect } from '@playwright/test';

test.describe('Learn More Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have a Learn More button', async ({ page }) => {
    const learnButton = page.locator('#learn-more-btn');
    await expect(learnButton).toBeVisible();
    await expect(learnButton).toHaveAttribute('aria-label', 'Learn about BIP39');
  });

  test('should open modal when Learn More button is clicked', async ({ page }) => {
    const learnButton = page.locator('#learn-more-btn');
    const modal = page.locator('#learn-modal');
    
    // Modal should be hidden initially
    await expect(modal).toHaveAttribute('hidden');
    
    // Click Learn More button
    await learnButton.click();
    
    // Modal should be visible
    await expect(modal).not.toHaveAttribute('hidden');
    await expect(modal).toHaveAttribute('aria-hidden', 'false');
  });

  test('should display modal content correctly', async ({ page }) => {
    await page.locator('#learn-more-btn').click();
    
    // Check modal title
    const modalTitle = page.locator('#modal-title');
    await expect(modalTitle).toHaveText('What is BIP39?');
    
    // Check steps are visible
    await expect(page.locator('.step-number:text("1")')).toBeVisible();
    await expect(page.locator('.step-number:text("2")')).toBeVisible();
    await expect(page.locator('.step-number:text("3")')).toBeVisible();
    await expect(page.locator('.step-number:text("4")')).toBeVisible();
    
    // Check key content exists
    await expect(page.locator('text=12 Words = Seed Phrase')).toBeVisible();
    await expect(page.locator('text=Private Keys → Bitcoin Addresses')).toBeVisible();
  });

  test('should close modal when close button is clicked', async ({ page }) => {
    await page.locator('#learn-more-btn').click();
    
    const modal = page.locator('#learn-modal');
    await expect(modal).not.toHaveAttribute('hidden');
    
    // Click close button
    await page.locator('#modal-close').click();
    
    // Modal should be hidden
    await expect(modal).toHaveAttribute('hidden');
  });

  test('should close modal when clicking overlay', async ({ page }) => {
    await page.locator('#learn-more-btn').click();
    
    const modal = page.locator('#learn-modal');
    await expect(modal).not.toHaveAttribute('hidden');
    
    // Click overlay (click at coordinates outside the modal content)
    const overlay = page.locator('.modal-overlay');
    await overlay.click({ position: { x: 10, y: 10 } });
    
    // Modal should be hidden
    await expect(modal).toHaveAttribute('hidden');
  });

  test('should close modal when pressing Escape key', async ({ page }) => {
    await page.locator('#learn-more-btn').click();
    
    const modal = page.locator('#learn-modal');
    await expect(modal).not.toHaveAttribute('hidden');
    
    // Press Escape
    await page.keyboard.press('Escape');
    
    // Modal should be hidden
    await expect(modal).toHaveAttribute('hidden');
  });

  test('should have BIP39 specification link', async ({ page }) => {
    await page.locator('#learn-more-btn').click();
    
    const specLink = page.locator('#modal-why-link');
    await expect(specLink).toBeVisible();
    await expect(specLink).toHaveAttribute('href', 'https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki');
    await expect(specLink).toHaveAttribute('target', '_blank');
    await expect(specLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('should display visual examples in steps', async ({ page }) => {
    await page.locator('#learn-more-btn').click();
    
    // Check Step 1: word grid example
    await expect(page.locator('.word-grid-example')).toBeVisible();
    await expect(page.locator('.word-example')).toHaveCount(12);
    
    // Check Step 2: binary conversion
    await expect(page.locator('.binary-conversion')).toBeVisible();
    await expect(page.locator('.conversion-item')).toHaveCount(2);
    
    // Check Step 3: key derivation
    await expect(page.locator('.key-derivation')).toBeVisible();
    
    // Check Step 4: address generation
    await expect(page.locator('.address-generation')).toBeVisible();
  });

  test('should display security warning section', async ({ page }) => {
    await page.locator('#learn-more-btn').click();
    
    // Check warning section
    const warningSection = page.locator('.modal-section.highlight');
    await expect(warningSection).toBeVisible();
    
    // Check warning items
    await expect(page.locator('#modal-warning-item1')).toContainText('paper');
    await expect(page.locator('#modal-warning-item2')).toContainText('hardware wallet');
    await expect(page.locator('#modal-warning-item3')).toContainText('Never store digitally');
    await expect(page.locator('#modal-warning-item4')).toContainText('Never share');
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    await page.locator('#learn-more-btn').click();
    
    const modal = page.locator('#learn-modal');
    await expect(modal).toHaveAttribute('role', 'dialog');
    await expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
    await expect(modal).toHaveAttribute('aria-modal', 'true');
  });

  test('should translate modal content when language changes', async ({ page }) => {
    // Open modal in English
    await page.locator('#learn-more-btn').click();
    let modalTitle = await page.locator('#modal-title').textContent();
    expect(modalTitle).toBe('What is BIP39?');
    
    // Close modal
    await page.locator('#modal-close').click();
    
    // Change to Spanish
    await page.locator('#language-toggle').click();
    await page.locator('[data-lang="spanish"]').click();
    
    // Open modal again
    await page.locator('#learn-more-btn').click();
    modalTitle = await page.locator('#modal-title').textContent();
    expect(modalTitle).toBe('¿Qué es BIP39?');
  });

  test('should be scrollable on small screens', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.locator('#learn-more-btn').click();
    
    const modalContent = page.locator('.modal-content');
    await expect(modalContent).toBeVisible();
    
    // Check if content is scrollable (has overflow)
    const hasScroll = await modalContent.evaluate(el => el.scrollHeight > el.clientHeight);
    expect(hasScroll).toBe(true);
  });
});
