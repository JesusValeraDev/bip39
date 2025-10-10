import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock fetch for wordlist loading
global.fetch = vi.fn();

// Mock DOM methods that might not be available in jsdom
Object.defineProperty(document, 'querySelectorAll', {
  value: vi.fn(() => []),
});

Object.defineProperty(document, 'getElementById', {
  value: vi.fn(() => null),
});

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
