import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockSuggestions = [
  {
    querySelector: vi.fn(() => ({ textContent: 'abandon' })),
    setAttribute: vi.fn(),
    scrollIntoView: vi.fn(),
  },
  {
    querySelector: vi.fn(() => ({ textContent: 'ability' })),
    setAttribute: vi.fn(),
    scrollIntoView: vi.fn(),
  },
  {
    querySelector: vi.fn(() => ({ textContent: 'able' })),
    setAttribute: vi.fn(),
    scrollIntoView: vi.fn(),
  },
];

const mockElements = {
  wordInput: {
    value: '',
    blur: vi.fn(),
    setSelectionRange: vi.fn(),
    setAttribute: vi.fn(),
    removeAttribute: vi.fn(),
  },
  wordSuggestions: {
    querySelectorAll: vi.fn(() => mockSuggestions),
    setAttribute: vi.fn(),
    removeAttribute: vi.fn(),
    innerHTML: '',
    // Open unless a test says otherwise
    hasAttribute: vi.fn(() => false),
  },
};

vi.mock('../../../../src/modules/bip39', () => ({
  elements: mockElements,
}));

describe('Keyboard Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleKeydown', () => {
    it('should not handle keys when no suggestions', async () => {
      const { handleKeydown } = await import('../../../../src/modules/wordInput/infrastructure/keyboard');
      mockElements.wordSuggestions.querySelectorAll = vi.fn(() => []);
      const onSelectWord = vi.fn();
      const onReset = vi.fn();
      const onAccept = vi.fn();

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      handleKeydown(event, { onSelectWord, onReset, onAccept });

      expect(onSelectWord).not.toHaveBeenCalled();
    });

    it('should handle ArrowDown key with suggestions', async () => {
      const { handleKeydown } = await import('../../../../src/modules/wordInput/infrastructure/keyboard');
      mockElements.wordSuggestions.querySelectorAll = vi.fn(() => mockSuggestions);
      const onSelectWord = vi.fn();
      const onReset = vi.fn();
      const onAccept = vi.fn();
      const event = { key: 'ArrowDown', preventDefault: vi.fn() } as any;

      handleKeydown(event, { onSelectWord, onReset, onAccept });

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should handle ArrowUp key with suggestions', async () => {
      const { handleKeydown } = await import('../../../../src/modules/wordInput/infrastructure/keyboard');
      mockElements.wordSuggestions.querySelectorAll = vi.fn(() => mockSuggestions);
      const onSelectWord = vi.fn();
      const onReset = vi.fn();
      const onAccept = vi.fn();
      const event = { key: 'ArrowUp', preventDefault: vi.fn() } as any;

      handleKeydown(event, { onSelectWord, onReset, onAccept });

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should handle Enter key with suggestions', async () => {
      const { handleKeydown } = await import('../../../../src/modules/wordInput/infrastructure/keyboard');
      mockElements.wordSuggestions.querySelectorAll = vi.fn(() => mockSuggestions);
      const onSelectWord = vi.fn();
      const onReset = vi.fn();
      const onAccept = vi.fn();
      const event = { key: 'Enter', preventDefault: vi.fn() } as any;

      handleKeydown(event, { onSelectWord, onReset, onAccept });

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should handle Escape key', async () => {
      const { handleKeydown } = await import('../../../../src/modules/wordInput/infrastructure/keyboard');
      mockElements.wordSuggestions.querySelectorAll = vi.fn(() => mockSuggestions);
      const onSelectWord = vi.fn();
      const onReset = vi.fn();
      const onAccept = vi.fn();
      const event = { key: 'Escape', preventDefault: vi.fn() } as any;

      // Function should execute without throwing
      expect(() => handleKeydown(event, { onSelectWord, onReset, onAccept })).not.toThrow();
    });

    it('should ignore other keys', async () => {
      const { handleKeydown } = await import('../../../../src/modules/wordInput/infrastructure/keyboard');
      const onSelectWord = vi.fn();
      const onReset = vi.fn();
      const onAccept = vi.fn();
      const event = { key: 'a', preventDefault: vi.fn() } as any;

      handleKeydown(event, { onSelectWord, onReset, onAccept });

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(onSelectWord).not.toHaveBeenCalled();
    });
  });
});
