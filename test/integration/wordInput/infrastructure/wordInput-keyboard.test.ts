import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

vi.mock('../../../../src/modules/display', () => ({
  updateDisplay: vi.fn(),
  setSyncWordInputCallback: vi.fn(),
}));

const mockElements = {
  wordInput: {
    value: '',
    classList: { add: vi.fn(), remove: vi.fn() },
    addEventListener: vi.fn((event, handler) => {
      mockElements.wordInput._handlers = mockElements.wordInput._handlers || {};
      mockElements.wordInput._handlers[event] = handler;
    }),
    blur: vi.fn(),
    _handlers: {} as any,
    _trigger: function (event: string, data?: any) {
      if (this._handlers[event]) {
        this._handlers[event](data || {});
      }
    },
  },
  wordSuggestions: {
    classList: { add: vi.fn(), remove: vi.fn() },
    setAttribute: vi.fn(),
    removeAttribute: vi.fn(),
    querySelectorAll: vi.fn(() => [
      {
        getAttribute: vi.fn(() => '0'),
        setAttribute: vi.fn(),
        querySelector: vi.fn(() => ({ textContent: 'abandon' })),
        scrollIntoView: vi.fn(),
      },
      {
        getAttribute: vi.fn(() => '1'),
        setAttribute: vi.fn(),
        querySelector: vi.fn(() => ({ textContent: 'ability' })),
        scrollIntoView: vi.fn(),
      },
    ]),
    innerHTML: '',
    appendChild: vi.fn(),
    contains: vi.fn(() => false),
  },
  grid: {
    querySelectorAll: vi.fn(() => []),
  },
};

vi.mock('../../../../src/modules/bip39/infrastructure/elements', () => ({
  elements: mockElements,
}));

vi.mock('../../../../src/modules/bip39/domain/state', () => ({
  state: {
    boxes: Array(12).fill(false),
    wordlist: ['abandon', 'ability', 'able', 'about', 'above'],
  },
  setStateFromIndex: vi.fn(),
  resetBoxes: vi.fn(),
}));

vi.mock('../../../../src/modules/display/infrastructure/display', () => ({
  updateDisplay: vi.fn(),
}));

vi.mock('../../../../src/modules/language/infrastructure/language', () => ({
  currentTranslations: { invalidWordMessage: 'Invalid word' },
}));

describe('WordInput - Keyboard Navigation & Suggestions', () => {
  beforeEach(() => {
    mockElements.wordInput.value = '';
    mockElements.wordSuggestions.innerHTML = '';
    vi.clearAllMocks();
    vi.resetModules();
    vi.useFakeTimers();

    document.addEventListener = vi.fn();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should handle input with matching words', async () => {
    const { setupWordInput } = await import('../../../../src/modules/wordInput/infrastructure/wordInput');

    setupWordInput();

    // Simulate typing
    mockElements.wordInput.value = 'ab';
    mockElements.wordInput._trigger('input');

    expect(mockElements.wordSuggestions.appendChild).toHaveBeenCalled();
  });

  it('should handle empty input', async () => {
    const { setupWordInput } = await import('../../../../src/modules/wordInput/infrastructure/wordInput');

    setupWordInput();

    mockElements.wordInput.value = '';
    mockElements.wordInput._trigger('input');

    vi.advanceTimersByTime(300);
    expect(mockElements.wordSuggestions.setAttribute).toHaveBeenCalledWith('hidden', '');
  });

  it('should handle ArrowDown key', async () => {
    const { setupWordInput } = await import('../../../../src/modules/wordInput/infrastructure/wordInput');

    setupWordInput();

    // First show suggestions
    mockElements.wordInput.value = 'ab';
    mockElements.wordInput._trigger('input');

    // Then press ArrowDown
    const keyEvent = { key: 'ArrowDown', preventDefault: vi.fn() };
    mockElements.wordInput._trigger('keydown', keyEvent);

    expect(keyEvent.preventDefault).toHaveBeenCalled();
  });

  it('should handle ArrowUp key', async () => {
    const { setupWordInput } = await import('../../../../src/modules/wordInput/infrastructure/wordInput');

    setupWordInput();

    mockElements.wordInput.value = 'ab';
    mockElements.wordInput._trigger('input');

    const keyEvent = { key: 'ArrowUp', preventDefault: vi.fn() };
    mockElements.wordInput._trigger('keydown', keyEvent);

    expect(keyEvent.preventDefault).toHaveBeenCalled();
  });

  it('should handle Enter key', async () => {
    mockElements.wordInput.value = 'ab';
    mockElements.wordInput._trigger('input');

    const keyEvent = { key: 'Enter', preventDefault: vi.fn() };
    mockElements.wordInput._trigger('keydown', keyEvent);

    expect(keyEvent.preventDefault).toHaveBeenCalled();
  });

  it('should handle Escape key', async () => {
    const { setupWordInput } = await import('../../../../src/modules/wordInput/infrastructure/wordInput');

    setupWordInput();

    mockElements.wordInput.value = 'ab';
    mockElements.wordInput._trigger('input');

    const keyEvent = { key: 'Escape', preventDefault: vi.fn() };
    mockElements.wordInput._trigger('keydown', keyEvent);

    vi.advanceTimersByTime(300);
    expect(mockElements.wordSuggestions.setAttribute).toHaveBeenCalledWith('hidden', '');
  });

  it('should handle focus event', async () => {
    const { setupWordInput } = await import('../../../../src/modules/wordInput/infrastructure/wordInput');

    setupWordInput();

    mockElements.wordInput.value = 'test';
    mockElements.wordInput._trigger('focus');

    expect(mockElements.wordInput.addEventListener).toHaveBeenCalled();
  });

  it('should validate on blur', async () => {
    const { setupWordInput } = await import('../../../../src/modules/wordInput/infrastructure/wordInput');

    setupWordInput();

    mockElements.wordInput.value = 'abandon';
    mockElements.wordInput._trigger('blur');

    vi.advanceTimersByTime(300);
    expect(mockElements.wordInput.classList.remove).toHaveBeenCalledWith('error');
  });

  it('should show error for invalid word on blur', async () => {
    const { setupWordInput } = await import('../../../../src/modules/wordInput/infrastructure/wordInput');
    const { resetBoxes } = await import('../../../../src/modules/bip39/domain/state');

    setupWordInput();

    mockElements.wordInput.value = 'invalid';
    mockElements.wordInput._trigger('blur');

    vi.advanceTimersByTime(300);
    expect(mockElements.wordInput.classList.add).toHaveBeenCalledWith('error');
    expect(resetBoxes).toHaveBeenCalled();
  });
});
