import { describe, it, expect } from 'vitest';
import {
  DEFAULT_THEME,
  toggleThemeLogic as toggleTheme,
  isValidTheme,
  getThemeOrDefault,
  isDarkMode,
  getOppositeThemeName,
  getAriaPressed,
  getThemeToggleLabel,
} from '../../../../src/modules/theme';

describe('Domain - Theme Logic', () => {
  describe('constants', () => {
    it('should have dark as default', () => {
      expect(DEFAULT_THEME).toBe('dark');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle dark to light', () => {
      expect(toggleTheme('dark')).toBe('light');
    });

    it('should toggle light to dark', () => {
      expect(toggleTheme('light')).toBe('dark');
    });

    it('should default to dark for null', () => {
      expect(toggleTheme(null)).toBe('dark');
    });
  });

  describe('isValidTheme', () => {
    it('should return true for valid themes', () => {
      expect(isValidTheme('light')).toBe(true);
      expect(isValidTheme('dark')).toBe(true);
    });

    it('should return false for invalid', () => {
      expect(isValidTheme('invalid')).toBe(false);
    });
  });

  describe('getThemeOrDefault', () => {
    it('should return theme if valid', () => {
      expect(getThemeOrDefault('light')).toBe('light');
      expect(getThemeOrDefault('dark')).toBe('dark');
    });

    it('should return default for invalid', () => {
      expect(getThemeOrDefault('invalid')).toBe('dark');
      expect(getThemeOrDefault(null)).toBe('dark');
    });
  });

  describe('isDarkMode', () => {
    it('should return true for dark', () => {
      expect(isDarkMode('dark')).toBe(true);
    });

    it('should return false for light', () => {
      expect(isDarkMode('light')).toBe(false);
    });
  });

  describe('getOppositeThemeName', () => {
    it('should return opposite', () => {
      expect(getOppositeThemeName('dark')).toBe('light');
      expect(getOppositeThemeName('light')).toBe('dark');
    });
  });

  describe('getAriaPressed', () => {
    it('should return true for dark', () => {
      expect(getAriaPressed('dark')).toBe('true');
    });

    it('should return false for light', () => {
      expect(getAriaPressed('light')).toBe('false');
    });
  });

  describe('getThemeToggleLabel', () => {
    it('should generate correct label', () => {
      expect(getThemeToggleLabel('dark')).toBe('Switch to light mode');
      expect(getThemeToggleLabel('light')).toBe('Switch to dark mode');
    });
  });
});
