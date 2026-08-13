import { test, expect, type Page } from '@playwright/test';

const readInput = (page: Page) =>
  page.evaluate(() => {
    const input = document.getElementById('word-input') as HTMLInputElement;
    return { value: input.value, selectionStart: input.selectionStart, selectionEnd: input.selectionEnd };
  });

test.describe('Word Input - Autocomplete', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#word-input').click();
  });

  test('should complete the word once four characters are typed', async ({ page }) => {
    await page.keyboard.type('aban');

    expect(await readInput(page)).toEqual({ value: 'abandon', selectionStart: 4, selectionEnd: 7 });
    await expect(page.locator('#index')).toHaveText('1');
  });

  test('should hold off below four characters', async ({ page }) => {
    await page.keyboard.type('aba');

    expect(await readInput(page)).toEqual({ value: 'aba', selectionStart: 3, selectionEnd: 3 });
  });

  test('should advance the caret when the next character matches', async ({ page }) => {
    await page.keyboard.type('aban');
    await page.keyboard.type('d');

    expect(await readInput(page)).toEqual({ value: 'abandon', selectionStart: 5, selectionEnd: 7 });

    await page.keyboard.type('o');

    expect(await readInput(page)).toEqual({ value: 'abandon', selectionStart: 6, selectionEnd: 7 });
  });

  test('should type over the completion when the next character differs', async ({ page }) => {
    await page.keyboard.type('aban');
    await page.keyboard.type('x');

    expect(await readInput(page)).toEqual({ value: 'abanx', selectionStart: 5, selectionEnd: 5 });
  });

  test('should complete a three-character word on an exact hit', async ({ page }) => {
    await page.keyboard.type('cat');

    // Nothing to select: the word is already whole
    expect(await readInput(page)).toEqual({ value: 'cat', selectionStart: 3, selectionEnd: 3 });
    await expect(page.locator('#index')).toHaveText('287');
  });

  test('should still offer the longer words sharing a three-character word', async ({ page }) => {
    await page.keyboard.type('cat');

    await expect(page.locator('#word-suggestions')).not.toHaveAttribute('hidden');
    await expect(page.locator('.suggestion-word').first()).toHaveText('cat');

    await page.keyboard.type('a');

    expect(await readInput(page)).toEqual({ value: 'catalog', selectionStart: 4, selectionEnd: 7 });
  });

  test('should not complete while deleting', async ({ page }) => {
    await page.keyboard.type('aban');
    await page.keyboard.press('Backspace');

    // The selected completion goes first
    expect(await readInput(page)).toEqual({ value: 'aban', selectionStart: 4, selectionEnd: 4 });

    await page.keyboard.press('Backspace');

    expect(await readInput(page)).toEqual({ value: 'aba', selectionStart: 3, selectionEnd: 3 });
  });

  test('should set the boxes from the completed word', async ({ page }) => {
    await page.keyboard.type('abou');

    await expect(page.locator('#word-input')).toHaveValue('about');
    await expect(page.locator('#index')).toHaveText('4');
    await expect(page.locator('#binary')).toHaveText('○○○○○○○○○●○○');
  });
});

test.describe('Word Input - Enter and Escape', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#word-input').click();
  });

  test('should autofill the first suggestion on Enter', async ({ page }) => {
    await page.keyboard.type('ab');
    await page.waitForSelector('.suggestion-item');

    await page.keyboard.press('Enter');

    await expect(page.locator('#word-input')).toHaveValue('abandon');
    await expect(page.locator('#index')).toHaveText('1');
  });

  test('should keep the focus after Enter', async ({ page }) => {
    await page.keyboard.type('ab');
    await page.keyboard.press('Enter');

    await expect(page.locator('#word-input')).toBeFocused();
    expect(await readInput(page)).toEqual({ value: 'abandon', selectionStart: 7, selectionEnd: 7 });
  });

  test('should honour an explicit pick over the first suggestion', async ({ page }) => {
    await page.keyboard.type('ab');
    await page.waitForSelector('.suggestion-item');

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    await expect(page.locator('#word-input')).toHaveValue('ability');
  });

  test('should reset the input on Escape', async ({ page }) => {
    await page.keyboard.type('aban');
    await expect(page.locator('#index')).toHaveText('1');

    await page.keyboard.press('Escape');

    await expect(page.locator('#word-input')).toHaveValue('');
    await expect(page.locator('#index')).toHaveText('-');
    await expect(page.locator('#binary')).toHaveText('○○○○○○○○○○○○');
  });

  test('should keep the focus after Escape', async ({ page }) => {
    await page.keyboard.type('aban');
    await page.keyboard.press('Escape');

    await expect(page.locator('#word-input')).toBeFocused();

    await page.keyboard.type('abou');

    await expect(page.locator('#word-input')).toHaveValue('about');
  });

  test('should reset on Escape with no suggestions open', async ({ page }) => {
    await page.keyboard.type('aban');
    await expect(page.locator('#word-suggestions')).toHaveAttribute('hidden');

    await page.keyboard.press('Escape');

    await expect(page.locator('#word-input')).toHaveValue('');
    await expect(page.locator('#index')).toHaveText('-');
  });

  test('should clear an invalid word on Escape', async ({ page }) => {
    await page.keyboard.type('zzzz');
    await expect(page.locator('#word-input')).toHaveValue('zzzz');

    await page.keyboard.press('Escape');

    await expect(page.locator('#word-input')).toHaveValue('');
    await expect(page.locator('#word-input')).not.toHaveClass(/error/);
  });
});

test.describe('Word Input - Invalid input clears the selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#word-input').click();
  });

  test('should drop the selection once the input names no word', async ({ page }) => {
    await page.keyboard.type('aban');
    await expect(page.locator('#index')).toHaveText('1');

    await page.keyboard.type('x');

    await expect(page.locator('#index')).toHaveText('-');
    await expect(page.locator('#binary')).toHaveText('○○○○○○○○○○○○');
    await expect(page.locator('#word-input')).toHaveValue('abanx');
  });

  test('should keep what was typed rather than resyncing from the boxes', async ({ page }) => {
    await page.keyboard.type('abanxyz');

    await expect(page.locator('#word-input')).toHaveValue('abanxyz');
    await expect(page.locator('#index')).toHaveText('-');
  });

  test('should keep the selection while the input is still a prefix', async ({ page }) => {
    await page.keyboard.type('aban');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');

    await expect(page.locator('#word-input')).toHaveValue('aba');
    await expect(page.locator('#index')).toHaveText('1');
  });
});

test.describe('Word Input - Accented wordlists', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#language-toggle').click();
    await page.locator('[data-lang="spanish"]').click();
    await page.waitForTimeout(500);
    await page.locator('#word-input').click();
  });

  test('should complete a decomposed word from composed typing', async ({ page }) => {
    await page.keyboard.type('ábac'.normalize('NFC'));

    await expect(page.locator('#word-input')).toHaveValue('ábaco'.normalize('NFD'));
    await expect(page.locator('#index')).toHaveText('1');
  });

  test('should count an accent as one character, not two', async ({ page }) => {
    await page.keyboard.type('ába'.normalize('NFC'));

    // Three characters is below the threshold, even though it is four code points
    await expect(page.locator('#index')).toHaveText('-');
  });

  test('should accept a composed accented word on blur', async ({ page }) => {
    await page.keyboard.type('ábaco'.normalize('NFC'));
    await page.locator('#word-input').blur();

    await expect(page.locator('#word-input')).not.toHaveClass(/error/);
    await expect(page.locator('#index')).toHaveText('1');
  });
});

test.describe('Word Input - Accent-insensitive typing', () => {
  test('should complete a Spanish word typed without its accent', async ({ page }) => {
    await page.goto('/');
    await page.locator('#language-toggle').click();
    await page.locator('[data-lang="spanish"]').click();
    await page.waitForTimeout(500);
    await page.locator('#word-input').click();

    await page.keyboard.type('abac');

    await expect(page.locator('#word-input')).toHaveValue('ábaco'.normalize('NFD'));
    await expect(page.locator('#index')).toHaveText('1');
  });

  test('should accept a Spanish word typed flat on blur', async ({ page }) => {
    await page.goto('/');
    await page.locator('#language-toggle').click();
    await page.locator('[data-lang="spanish"]').click();
    await page.waitForTimeout(500);
    await page.locator('#word-input').click();

    await page.keyboard.type('abaco');
    await page.locator('#word-input').blur();

    await expect(page.locator('#word-input')).not.toHaveClass(/error/);
    await expect(page.locator('#index')).toHaveText('1');
  });

  test('should complete a French word typed without its accents', async ({ page }) => {
    await page.goto('/');
    await page.locator('#language-toggle').click();
    await page.locator('[data-lang="french"]').click();
    await page.waitForTimeout(500);
    await page.locator('#word-input').click();

    await page.keyboard.type('academi');

    await expect(page.locator('#word-input')).toHaveValue('académie'.normalize('NFD'));
  });

  test('should keep a Japanese voiced mark meaningful', async ({ page }) => {
    await page.goto('/');
    await page.locator('#language-toggle').click();
    await page.locator('[data-lang="japanese"]').click();
    await page.waitForTimeout(500);
    await page.locator('#word-input').click();

    // The voiced word is the third in the list
    await page.keyboard.type('あいだ');
    await expect(page.locator('#index')).toHaveText('3');

    await page.keyboard.press('Escape');

    // Its unvoiced spelling is not itself a word, so nothing is selected outright
    await page.keyboard.type('あいた');
    await expect(page.locator('#word-input')).toHaveValue('あいた');
    await expect(page.locator('#index')).toHaveText('-');
  });
});

test.describe('Word Input - Enter after a completion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#language-toggle').click();
    await page.locator('[data-lang="spanish"]').click();
    await page.waitForTimeout(500);
    await page.locator('#word-input').click();
  });

  test('should keep the completed word instead of the stale first suggestion', async ({ page }) => {
    // "amb" offers ámbar and ámbito; "ambi" settles on ámbito
    await page.keyboard.type('amb');
    await expect(page.locator('.suggestion-word').first()).toHaveText('ámbar'.normalize('NFD'));

    await page.keyboard.type('i');
    await expect(page.locator('#word-input')).toHaveValue('ámbito'.normalize('NFD'));

    await page.keyboard.press('Enter');

    await expect(page.locator('#word-input')).toHaveValue('ámbito'.normalize('NFD'));
    await expect(page.locator('#index')).toHaveText('94');
  });

  test('should take the list down as soon as the completion settles it', async ({ page }) => {
    await page.keyboard.type('ambi');

    // Not merely hidden: nothing left behind that Enter could still act on
    await expect(page.locator('#word-suggestions')).toHaveAttribute('hidden');
    await expect(page.locator('.suggestion-item')).toHaveCount(0);
  });

  test('should collapse the selection on Enter', async ({ page }) => {
    await page.keyboard.type('ambi');
    await page.keyboard.press('Enter');

    const caret = await page.evaluate(() => {
      const input = document.getElementById('word-input') as HTMLInputElement;
      return [input.selectionStart, input.selectionEnd];
    });

    expect(caret).toEqual([7, 7]);
  });

  test('should still take the first suggestion while the list is open', async ({ page }) => {
    await page.keyboard.type('amb');
    await page.waitForSelector('.suggestion-item');

    await page.keyboard.press('Enter');

    await expect(page.locator('#word-input')).toHaveValue('ámbar'.normalize('NFD'));
    await expect(page.locator('#index')).toHaveText('93');
  });
});

test.describe('Word Input - Enter on a word that does not exist', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#word-input').click();
  });

  test('should reset the input when nothing matches', async ({ page }) => {
    await page.keyboard.type('zzzz');
    await page.keyboard.press('Enter');

    await expect(page.locator('#word-input')).toHaveValue('');
    await expect(page.locator('#index')).toHaveText('-');
    await expect(page.locator('#word-input')).toBeFocused();
  });

  test('should reset when typing past a completed word', async ({ page }) => {
    await page.keyboard.type('abandonx');
    await page.keyboard.press('Enter');

    await expect(page.locator('#word-input')).toHaveValue('');
    await expect(page.locator('#index')).toHaveText('-');
  });

  test('should not fall back to a suggestion the input has outgrown', async ({ page }) => {
    // "z" offers zebra; "zz" matches nothing, so Enter must not settle on zebra
    await page.keyboard.type('z');
    await expect(page.locator('.suggestion-word').first()).toHaveText('zebra');

    await page.keyboard.type('z');
    await page.keyboard.press('Enter');

    await expect(page.locator('#word-input')).toHaveValue('');
    await expect(page.locator('#index')).toHaveText('-');
  });

  test('should still take the first suggestion for a valid prefix', async ({ page }) => {
    await page.keyboard.type('z');
    await page.waitForSelector('.suggestion-item');

    await page.keyboard.press('Enter');

    await expect(page.locator('#word-input')).toHaveValue('zebra');
  });

  test('should keep a word typed out in full', async ({ page }) => {
    await page.keyboard.type('abandon');
    await page.keyboard.press('Enter');

    await expect(page.locator('#word-input')).toHaveValue('abandon');
    await expect(page.locator('#index')).toHaveText('1');
  });

  test('should do nothing on Enter with an empty input', async ({ page }) => {
    await page.keyboard.press('Enter');

    await expect(page.locator('#word-input')).toHaveValue('');
    await expect(page.locator('#index')).toHaveText('-');
  });
});
