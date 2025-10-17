import { vi } from 'vitest';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

global.fetch = vi.fn();

Object.defineProperty(document, 'querySelectorAll', {
  value: vi.fn(() => []),
});

Object.defineProperty(document, 'getElementById', {
  value: vi.fn(() => null),
});

beforeEach(() => {
  vi.clearAllMocks();
});
