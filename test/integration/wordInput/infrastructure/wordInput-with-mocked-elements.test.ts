import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockElements = {
  wordInput: {
    value: '',
    classList: { add: vi.fn(), remove: vi.fn() },
    addEventListener: vi.fn(),
    blur: vi.fn(),
  },
  wordSuggestions: {
    classList: { add: vi.fn(), remove: vi.fn() },
    setAttribute: vi.fn(),
    removeAttribute: vi.fn(),
    querySelectorAll: vi.fn(() => []),
    innerHTML: '',
    contains: vi.fn(() => false),
  },
  grid: {
    querySelectorAll: vi.fn(() =>
      Array.from({ length: 12 }, () => ({
        classList: { add: vi.fn(), remove: vi.fn() },
      }))
    ),
  },
};

vi.mock('../../../../src/modules/bip39/infrastructure/elements', () => ({
  elements: mockElements,
}));

vi.mock('../../../../src/modules/bip39/domain/state', () => ({
  state: {
    boxes: Array(12).fill(false),
    wordlist: ['abandon', 'ability', 'able'],
  },
  setStateFromIndex: vi.fn(),
  resetBoxes: vi.fn(),
}));

vi.mock('../../../../src/modules/display/infrastructure/display', () => ({
  updateDisplay: vi.fn(),
  setSyncWordInputCallback: vi.fn(),
}));

vi.mock('../../../../src/modules/language/infrastructure/language', () => ({
  currentTranslations: { invalidWordMessage: 'Invalid word' },
}));

describe('WordInput - With Mocked Elements', () => {
  beforeEach(() => {
    mockElements.wordInput.value = '';
    vi.clearAllMocks();
    vi.resetModules();

    // Mock document for click outside handler
    document.addEventListener = vi.fn();
  });

  it('should execute setupWordInput', async () => {
    const { setupWordInput } = await import('../../../../src/modules/wordInput/infrastructure/wordInput');

    expect(() => setupWordInput()).not.toThrow();
  });

  it('should execute clearWordInput', async () => {
    const { clearWordInput } = await import('../../../../src/modules/wordInput/infrastructure/wordInput');
    mockElements.wordInput.value = 'test';

    clearWordInput();

    expect(mockElements.wordInput.value).toBe('');
  });

  it('should execute syncWordInputFromState with no active boxes', async () => {
    const { syncWordInputFromState } = await import('../../../../src/modules/wordInput/infrastructure/wordInput');

    syncWordInputFromState();

    expect(mockElements.wordInput.value).toBe('');
  });

  it('should execute syncWordInputFromState with active boxes', async () => {
    const { state } = await import('../../../../src/modules/bip39/domain/state');
    const { syncWordInputFromState } = await import('../../../../src/modules/wordInput/infrastructure/wordInput');

    state.boxes[11] = true; // Value 1
    state.wordlist = ['abandon'];

    syncWordInputFromState();

    expect(mockElements.wordInput.value).toBe('abandon');
  });

  it('should handle setupWordInput event listeners', async () => {
    const { setupWordInput } = await import('../../../../src/modules/wordInput/infrastructure/wordInput');

    setupWordInput();

    expect(mockElements.wordInput.addEventListener).toHaveBeenCalled();
  });
});
