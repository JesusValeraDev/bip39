import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

const mockElements = {
  wordSuggestions: {
    setAttribute: vi.fn(),
    removeAttribute: vi.fn(),
    querySelectorAll: vi.fn(() => [{ setAttribute: vi.fn() }, { setAttribute: vi.fn() }, { setAttribute: vi.fn() }]),
    innerHTML: '',
    appendChild: vi.fn(),
  },
};

vi.mock('../../../../src/modules/bip39', () => ({
  elements: mockElements,
  state: {
    wordlist: ['abandon', 'ability', 'able'],
  },
}));

describe('Suggestion Dropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('hideSuggestions', () => {
    it('should hide suggestions after timeout', async () => {
      const { hideSuggestions } = await import('../../../../src/modules/wordInput/infrastructure/suggestions');

      hideSuggestions();

      expect(mockElements.wordSuggestions.setAttribute).not.toHaveBeenCalled();

      vi.advanceTimersByTime(200);

      expect(mockElements.wordSuggestions.setAttribute).toHaveBeenCalledWith('hidden', '');
    });

    it('should not create duplicate timers on rapid calls', async () => {
      const { hideSuggestions } = await import('../../../../src/modules/wordInput/infrastructure/suggestions');
      const initialTimers = vi.getTimerCount();

      // Call multiple times rapidly
      for (let i = 0; i < 5; i++) {
        hideSuggestions();
      }

      const finalTimers = vi.getTimerCount();

      // Should have only 1 timer (old ones cancelled)
      expect(finalTimers - initialTimers).toBeLessThanOrEqual(1);
    });
  });

  describe('clearSuggestionSelection', () => {
    it('should clear all suggestion selections', async () => {
      const { clearSuggestionSelection } = await import('../../../../src/modules/wordInput/infrastructure/suggestions');

      expect(() => clearSuggestionSelection()).not.toThrow();
    });
  });
});
