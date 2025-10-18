import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockState = {
  boxes: Array(12).fill(false),
  wordlist: [],
};

const mockBoxElements = Array.from({ length: 12 }, () => ({
  classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn() },
  setAttribute: vi.fn(),
  dataset: { isDisabled: 'false' },
}));

const mockElements = {
  grid: {
    querySelectorAll: vi.fn(() => mockBoxElements),
  },
  binary: { textContent: '' },
  index: { textContent: '' },
  wordInput: { value: '' },
};

vi.mock('../../../../src/modules/bip39/infrastructure/elements', () => ({
  elements: mockElements,
}));

vi.mock('../../../../src/modules/bip39/domain/state', () => ({
  state: mockState,
  calculateBinaryValue: vi.fn(() => 100),
  getBinaryString: vi.fn(() => '0 1 1 0 0 1 0 0'),
}));

vi.mock('../../../../src/modules/bip39/infrastructure/wordlist', () => ({
  getWord: vi.fn(() => 'abandon'),
}));

vi.mock('../../../../src/modules/wordInput/infrastructure/wordInput', () => ({
  syncWordInputFromState: vi.fn(),
}));

describe('Display - With Mocked Elements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    document.body.innerHTML = '<div id="sr-announcements"></div>';
  });

  it('should execute updateDisplay', async () => {
    const { updateDisplay } = await import('../../../../src/modules/display/infrastructure/display');

    expect(() => updateDisplay()).not.toThrow();
  });

  it('should update binary display', async () => {
    const { updateDisplay } = await import('../../../../src/modules/display/infrastructure/display');

    updateDisplay();

    expect(mockElements.binary.textContent).toBe('0 1 1 0 0 1 0 0');
  });

  it('should update word index', async () => {
    const { updateDisplay } = await import('../../../../src/modules/display/infrastructure/display');

    updateDisplay();

    expect(mockElements.index.textContent).toBe('100');
  });

  it('should update box states', async () => {
    const { updateDisplay } = await import('../../../../src/modules/display/infrastructure/display');
    mockState.boxes[0] = true;

    updateDisplay();

    expect(mockBoxElements[0].classList.toggle).toHaveBeenCalled();
  });

  it('should handle multiple calls', async () => {
    const { updateDisplay } = await import('../../../../src/modules/display/infrastructure/display');

    updateDisplay();
    updateDisplay();
    updateDisplay();

    expect(true).toBe(true);
  });
});
