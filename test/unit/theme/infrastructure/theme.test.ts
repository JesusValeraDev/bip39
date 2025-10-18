import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initTheme, toggleTheme, updateThemeButtonState } from '../../../../src/modules/theme';

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('Theme Service (Unit Tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.removeAttribute('data-theme');
    document.body.innerHTML = '<button id="theme-toggle"></button>';
  });

  describe('initTheme', () => {
    it('should set theme from localStorage when available', () => {
      mockLocalStorage.getItem.mockReturnValue('dark');

      initTheme();

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should set light theme from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('light');

      initTheme();

      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('should use OS theme when no saved preference', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          addEventListener: vi.fn(),
        })),
      });

      initTheme();

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should default to dark when matchMedia is not available', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: undefined,
      });

      initTheme();

      // Should use fallback in getOSTheme()
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      document.documentElement.setAttribute('data-theme', 'light');

      toggleTheme();

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('should toggle from dark to light', () => {
      document.documentElement.setAttribute('data-theme', 'dark');

      toggleTheme();

      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    it('should toggle to dark when current theme is undefined', () => {
      document.documentElement.removeAttribute('data-theme');

      toggleTheme();

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('updateThemeButtonState', () => {
    it('should update button for dark theme without errors', () => {
      expect(() => updateThemeButtonState('dark')).not.toThrow();
    });

    it('should update button for light theme without errors', () => {
      expect(() => updateThemeButtonState('light')).not.toThrow();
    });

    it('should handle missing theme button gracefully', () => {
      document.body.innerHTML = '';

      expect(() => updateThemeButtonState('dark')).not.toThrow();
    });

    it('should be callable multiple times', () => {
      expect(() => {
        updateThemeButtonState('dark');
        updateThemeButtonState('light');
        updateThemeButtonState('dark');
      }).not.toThrow();
    });
  });
});
