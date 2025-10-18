import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initTheme, toggleTheme } from '../../../../src/modules/theme';

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('Theme Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.removeAttribute('data-theme');
  });

  describe('initTheme', () => {
    it('should set OS theme as default when no saved theme', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      // Mock matchMedia to return light theme
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-color-scheme: dark)' ? false : false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      initTheme();

      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('should set saved theme from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('light');

      initTheme();

      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('should set dark theme when saved theme is dark', () => {
      mockLocalStorage.getItem.mockReturnValue('dark');

      initTheme();

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should set dark theme when OS prefers dark', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      // Mock matchMedia to return dark theme
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      initTheme();

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from dark to light', () => {
      document.documentElement.setAttribute('data-theme', 'dark');

      toggleTheme();

      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    it('should toggle from light to dark', () => {
      document.documentElement.setAttribute('data-theme', 'light');

      toggleTheme();

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('should handle undefined theme by setting to light', () => {
      document.documentElement.removeAttribute('data-theme');

      toggleTheme();

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
  });
});
