import { describe, it, expect } from 'vitest';
import {
  getOppositeTheme,
  getInitialTheme,
  shouldAriaPressedBeTrue,
  getThemeAriaLabelHelper as getThemeAriaLabel,
  isValidTheme,
} from '../../../../src/modules/theme';

describe('Theme Helpers - Pure Functions', () => {
  describe('getOppositeTheme', () => {
    it('should return light when current is dark', () => {
      expect(getOppositeTheme('dark')).toBe('light');
    });

    it('should return dark when current is light', () => {
      expect(getOppositeTheme('light')).toBe('dark');
    });

    it('should return dark when current is null', () => {
      expect(getOppositeTheme(null)).toBe('dark');
    });

    it('should return dark for any other value', () => {
      expect(getOppositeTheme('other')).toBe('dark');
    });

    it('should be reversible', () => {
      const initial = 'light';
      const opposite = getOppositeTheme(initial);
      const back = getOppositeTheme(opposite);
      expect(back).toBe(initial);
    });
  });

  describe('getInitialTheme', () => {
    it('should return saved theme when light', () => {
      expect(getInitialTheme('light')).toBe('light');
    });

    it('should return saved theme when dark', () => {
      expect(getInitialTheme('dark')).toBe('dark');
    });

    it('should fallback to OS theme when no saved theme', () => {
      const theme = getInitialTheme(null);
      expect(['light', 'dark']).toContain(theme);
    });

    it('should fallback when saved theme is invalid', () => {
      const theme = getInitialTheme('invalid');
      expect(['light', 'dark']).toContain(theme);
    });
  });

  describe('shouldAriaPressedBeTrue', () => {
    it('should return true for dark theme', () => {
      expect(shouldAriaPressedBeTrue('dark')).toBe(true);
    });

    it('should return false for light theme', () => {
      expect(shouldAriaPressedBeTrue('light')).toBe(false);
    });

    it('should return false for other values', () => {
      expect(shouldAriaPressedBeTrue('other')).toBe(false);
    });
  });

  describe('getThemeAriaLabel', () => {
    it('should return switch to light for dark theme', () => {
      expect(getThemeAriaLabel('dark')).toBe('Switch to light mode');
    });

    it('should return switch to dark for light theme', () => {
      expect(getThemeAriaLabel('light')).toBe('Switch to dark mode');
    });

    it('should return switch to dark for other values', () => {
      expect(getThemeAriaLabel('other')).toBe('Switch to dark mode');
    });

    it('should include mode in label', () => {
      const label = getThemeAriaLabel('dark');
      expect(label).toContain('mode');
    });
  });

  describe('isValidTheme', () => {
    it('should return true for light', () => {
      expect(isValidTheme('light')).toBe(true);
    });

    it('should return true for dark', () => {
      expect(isValidTheme('dark')).toBe(true);
    });

    it('should return false for other values', () => {
      expect(isValidTheme('other')).toBe(false);
      expect(isValidTheme('Dark')).toBe(false);
      expect(isValidTheme('LIGHT')).toBe(false);
      expect(isValidTheme('')).toBe(false);
    });
  });
});
