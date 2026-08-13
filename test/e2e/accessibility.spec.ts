import { test, expect } from '@playwright/test';

test.describe('Accessibility - Suggestion combobox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#word-input').click();
  });

  test('should present the input as a combobox', async ({ page }) => {
    const input = page.locator('#word-input');

    await expect(input).toHaveAttribute('role', 'combobox');
    await expect(input).toHaveAttribute('aria-autocomplete', 'list');
    await expect(input).toHaveAttribute('aria-controls', 'word-suggestions');
  });

  test('should not be a live region', async ({ page }) => {
    // The value is rewritten on every keystroke; announcements belong to #sr-announcements
    await expect(page.locator('#word-input')).not.toHaveAttribute('aria-live', /.*/);
  });

  test('should report whether the list is open', async ({ page }) => {
    const input = page.locator('#word-input');

    await expect(input).toHaveAttribute('aria-expanded', 'false');

    await page.keyboard.type('ab');
    await expect(input).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Escape');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  test('should close the list once a completion settles the word', async ({ page }) => {
    await page.keyboard.type('aban');

    await expect(page.locator('#word-input')).toHaveAttribute('aria-expanded', 'false');
  });

  test('should name the highlighted option on the input', async ({ page }) => {
    await page.keyboard.type('ab');
    await page.waitForSelector('.suggestion-item');

    // Nothing highlighted until the user arrows into the list
    await expect(page.locator('#word-input')).not.toHaveAttribute('aria-activedescendant', /.*/);

    await page.keyboard.press('ArrowDown');

    const first = await page.locator('#word-input').getAttribute('aria-activedescendant');
    expect(first).toBe('word-suggestion-0');

    await page.keyboard.press('ArrowDown');

    const second = await page.locator('#word-input').getAttribute('aria-activedescendant');
    expect(second).toBe('word-suggestion-1');
  });

  test('should point at an option that exists and is marked selected', async ({ page }) => {
    await page.keyboard.type('ab');
    await page.waitForSelector('.suggestion-item');
    await page.keyboard.press('ArrowDown');

    const activeId = await page.locator('#word-input').getAttribute('aria-activedescendant');
    const active = page.locator(`#${activeId}`);

    await expect(active).toHaveCount(1);
    await expect(active).toHaveAttribute('aria-selected', 'true');
    await expect(active).toHaveAttribute('role', 'option');
  });

  test('should drop the pointer when the list goes away', async ({ page }) => {
    await page.keyboard.type('ab');
    await page.waitForSelector('.suggestion-item');
    await page.keyboard.press('ArrowDown');

    await page.keyboard.press('Escape');

    await expect(page.locator('#word-input')).not.toHaveAttribute('aria-activedescendant', /.*/);
  });
});

test.describe('Accessibility - Modal dialog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#learn-more-btn').focus();
    await page.locator('#learn-more-btn').click();
    await page.waitForTimeout(300);
  });

  test('should keep the focus inside the dialog', async ({ page }) => {
    const outside: string[] = [];

    for (let step = 0; step < 8; step++) {
      await page.keyboard.press('Tab');

      const escaped = await page.evaluate(() => {
        const active = document.activeElement;
        if (!active || active === document.body) return null;
        return active.closest('#learn-modal') ? null : (active.id ?? 'unknown');
      });

      if (escaped) outside.push(escaped);
    }

    expect(outside).toEqual([]);
  });

  test('should take the page behind it out of reach', async ({ page }) => {
    await expect(page.locator('#main-content')).toHaveAttribute('inert', '');
    await expect(page.locator('.footer')).toHaveAttribute('inert', '');
  });

  test('should give the page back when closed', async ({ page }) => {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);

    await expect(page.locator('#main-content')).not.toHaveAttribute('inert', /.*/);
    await expect(page.locator('.footer')).not.toHaveAttribute('inert', /.*/);
  });

  test('should return the focus to whatever opened it', async ({ page }) => {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);

    await expect(page.locator('#learn-more-btn')).toBeFocused();
  });
});

test.describe('Accessibility - Prefilled word', () => {
  test('should arrive selected so the first keystroke replaces it', async ({ page }) => {
    await page.goto('/');
    await page.locator('#index-base-toggle').click();
    await page.reload();
    await page.waitForTimeout(400);

    const selection = await page.evaluate(() => {
      const input = document.getElementById('word-input') as HTMLInputElement;
      return { value: input.value, start: input.selectionStart, end: input.selectionEnd };
    });

    expect(selection).toEqual({ value: 'abandon', start: 0, end: 7 });

    await page.keyboard.type('ab');

    await expect(page.locator('#word-input')).toHaveValue('ab');
  });

  test('should select it again when focus comes back', async ({ page }) => {
    await page.goto('/');
    await page.locator('#index-base-toggle').click();
    await page.locator('#word-input').click();
    await page.keyboard.press('Escape');
    await page.keyboard.type('able');
    await page.locator('#word-input').blur();
    await page.waitForTimeout(250);

    await page.locator('#word-input').click();
    await page.keyboard.type('cat');

    await expect(page.locator('#word-input')).toHaveValue('cat');
  });

  test('should leave a word the user is typing alone', async ({ page }) => {
    await page.goto('/');
    await page.locator('#word-input').click();
    await page.keyboard.type('aba');

    const selection = await page.evaluate(() => {
      const input = document.getElementById('word-input') as HTMLInputElement;
      return [input.selectionStart, input.selectionEnd];
    });

    expect(selection).toEqual([3, 3]);
  });
});
