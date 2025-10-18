import { describe, it, expect } from 'vitest';
import {
  determineUILanguage,
  getGitHashOrDefault,
  validateModalElement,
  validateButtonElements,
  isEscapeKey,
  isModalOpen,
  getModalTransitionDuration,
} from '../../../../src/modules/bip39/domain/mainHelpers';

describe('Main Helpers - Pure Functions', () => {
  describe('determineUILanguage', () => {
    it('should map english to en', () => {
      expect(determineUILanguage('english')).toBe('en');
    });

    it('should map spanish to es', () => {
      expect(determineUILanguage('spanish')).toBe('es');
    });

    it('should map french to fr', () => {
      expect(determineUILanguage('french')).toBe('fr');
    });

    it('should map czech to cs', () => {
      expect(determineUILanguage('czech')).toBe('cs');
    });

    it('should map italian to it', () => {
      expect(determineUILanguage('italian')).toBe('it');
    });

    it('should map portuguese to pt', () => {
      expect(determineUILanguage('portuguese')).toBe('pt');
    });

    it('should map japanese to ja', () => {
      expect(determineUILanguage('japanese')).toBe('ja');
    });

    it('should map korean to ko', () => {
      expect(determineUILanguage('korean')).toBe('ko');
    });

    it('should map chinese_simplified to zh-Hans', () => {
      expect(determineUILanguage('chinese_simplified')).toBe('zh-Hans');
    });

    it('should map chinese_traditional to zh-Hant', () => {
      expect(determineUILanguage('chinese_traditional')).toBe('zh-Hant');
    });

    it('should default to en for unknown language', () => {
      expect(determineUILanguage('unknown')).toBe('en');
    });
  });

  describe('getGitHashOrDefault', () => {
    it('should return git hash when provided', () => {
      expect(getGitHashOrDefault('abc123')).toBe('abc123');
      expect(getGitHashOrDefault('1a2b3c')).toBe('1a2b3c');
    });

    it('should return dev when git hash is undefined', () => {
      expect(getGitHashOrDefault(undefined)).toBe('dev');
    });

    it('should return dev when git hash is empty string', () => {
      expect(getGitHashOrDefault('')).toBe('dev');
    });
  });

  describe('validateModalElement', () => {
    it('should return true for valid modal element', () => {
      const modal = document.createElement('div');
      expect(validateModalElement(modal)).toBe(true);
    });

    it('should return false for null', () => {
      expect(validateModalElement(null)).toBe(false);
    });
  });

  describe('validateButtonElements', () => {
    it('should return true when both buttons exist', () => {
      const btn1 = document.createElement('button');
      const btn2 = document.createElement('button');
      expect(validateButtonElements(btn1, btn2)).toBe(true);
    });

    it('should return false when first button is null', () => {
      const btn2 = document.createElement('button');
      expect(validateButtonElements(null, btn2)).toBe(false);
    });

    it('should return false when second button is null', () => {
      const btn1 = document.createElement('button');
      expect(validateButtonElements(btn1, null)).toBe(false);
    });

    it('should return false when both buttons are null', () => {
      expect(validateButtonElements(null, null)).toBe(false);
    });
  });

  describe('isEscapeKey', () => {
    it('should return true for Escape key', () => {
      expect(isEscapeKey('Escape')).toBe(true);
    });

    it('should return false for other keys', () => {
      expect(isEscapeKey('Enter')).toBe(false);
      expect(isEscapeKey('a')).toBe(false);
      expect(isEscapeKey('ArrowDown')).toBe(false);
    });

    it('should be case sensitive', () => {
      expect(isEscapeKey('escape')).toBe(false);
      expect(isEscapeKey('ESCAPE')).toBe(false);
    });
  });

  describe('isModalOpen', () => {
    it('should return true when aria-hidden is false', () => {
      expect(isModalOpen('false')).toBe(true);
    });

    it('should return false when aria-hidden is true', () => {
      expect(isModalOpen('true')).toBe(false);
    });

    it('should return false when aria-hidden is null', () => {
      expect(isModalOpen(null)).toBe(false);
    });

    it('should return false for other values', () => {
      expect(isModalOpen('other')).toBe(false);
    });
  });

  describe('getModalTransitionDuration', () => {
    it('should return 300 milliseconds', () => {
      expect(getModalTransitionDuration()).toBe(300);
    });

    it('should be consistent', () => {
      expect(getModalTransitionDuration()).toBe(getModalTransitionDuration());
    });
  });
});
