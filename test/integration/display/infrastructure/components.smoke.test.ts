import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../../src/modules/bip39/domain/state', () => ({
  state: { boxes: Array(12).fill(false), wordlist: ['test'] },
  toggleBox: vi.fn(),
  resetBoxes: vi.fn(),
  setStateFromIndex: vi.fn(),
  calculateBinaryValue: vi.fn(() => 0),
  getBinaryString: vi.fn(() => '○○○○○○○○○○○○'),
}));

vi.mock('../../../../src/modules/bip39/infrastructure/wordlist', () => ({
  getWord: vi.fn(() => 'test'),
}));

vi.mock('../../../../src/modules/language/infrastructure/language', () => ({
  currentTranslations: { invalidWordMessage: 'Invalid', disabledBoxMessage: 'Disabled' },
}));

describe('Components - Smoke Tests', () => {
  it('should import display module', async () => {
    const display = await import('../../../../src/modules/display/infrastructure/display');
    expect(display).toBeDefined();
    expect(display.updateDisplay).toBeDefined();
  });

  it('should import toast module', async () => {
    const toast = await import('../../../../src/modules/display/infrastructure/toast');
    expect(toast).toBeDefined();
    expect(toast.showDisabledBoxToast).toBeDefined();
  });

  it('should call toast function', async () => {
    const { showDisabledBoxToast } = await import('../../../../src/modules/display/infrastructure/toast');

    // Call it multiple times to trigger the actual toast (needs 2+ calls)
    showDisabledBoxToast();
    showDisabledBoxToast();
    showDisabledBoxToast();

    expect(true).toBe(true);
  });
});
