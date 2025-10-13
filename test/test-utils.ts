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
    'grid', 'index', 'binary', 'reset', 'theme-toggle', 'language-toggle',
    'title', 'info-text', 'privacy-text', 'word-input', 'word-input-label',
    'language-dropdown', 'current-flag', 'word-suggestions',
    'index-label', 'git-hash', 'sr-announcements',
    'learn-modal', 'learn-more-btn', 'modal-close', 'modal-title',
    'modal-step1-title', 'modal-step1-text', 'modal-step2-title', 'modal-step2-text',
    'modal-step2-entropy', 'modal-step3-title', 'modal-step3-text',
    'modal-step4-title', 'modal-step4-text', 'modal-step4-private-key',
    'modal-step4-public-key', 'modal-step4-address',
    'modal-warning-title', 'modal-warning-text',
    'modal-warning-item1', 'modal-warning-item2', 'modal-warning-item3', 'modal-warning-item4',
    'modal-why-title', 'modal-why-text', 'modal-why-link'
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
