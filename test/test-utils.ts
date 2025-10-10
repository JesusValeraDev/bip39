import { state } from '../src/core/state';

/**
 * Reset the application state to initial values
 */
export function resetState(): void {
  state.boxes.fill(false);
  state.wordlist = [];
  state.currentLanguage = 'english';
}

/**
 * Set up a mock DOM environment with required elements
 */
export function setupMockDOM(): void {
  // Create mock elements
  const mockElement = {
    innerHTML: '',
    textContent: '',
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(),
    },
    addEventListener: vi.fn(),
    querySelectorAll: vi.fn(() => []),
  };

  // Mock all required DOM elements
  const elements = [
    'grid', 'word', 'index', 'binary', 'reset', 'theme-toggle', 'language',
    'title', 'subtitle', 'wordlist-label', 'word-label', 'binary-label',
    'info-text', 'privacy-tooltip'
  ];

  elements.forEach(id => {
    (document.getElementById as any).mockImplementation((elementId: string) => {
      if (elementId === id) {
        return mockElement;
      }
      return null;
    });
  });
}

/**
 * Mock wordlist data for testing
 */
export const mockWordlist = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
  'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
  'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual'
];

/**
 * Create a mock fetch response for wordlist loading
 */
export function mockWordlistResponse(words: string[] = mockWordlist) {
  return Promise.resolve({
    text: () => Promise.resolve(words.join('\n')),
  });
}
