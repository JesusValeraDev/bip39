import { describe, it, expect } from 'vitest';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_UI_LANGUAGE,
  wordlistToUILanguage,
  getDefaultLanguage,
  determineLanguage,
  isValidWordlistLanguage,
  languagesMatch,
  getSupportedLanguages,
} from '../../../../src/modules/i18n';

describe('Domain - Language Mapping', () => {
  describe('constants', () => {
    it('should have correct default language', () => {
      expect(DEFAULT_LANGUAGE).toBe('english');
    });

    it('should have correct default UI language', () => {
      expect(DEFAULT_UI_LANGUAGE).toBe('en');
    });
  });

  describe('wordlistToUILanguage', () => {
    it('should map all languages correctly', () => {
      expect(wordlistToUILanguage('english')).toBe('en');
      expect(wordlistToUILanguage('spanish')).toBe('es');
      expect(wordlistToUILanguage('french')).toBe('fr');
      expect(wordlistToUILanguage('czech')).toBe('cs');
      expect(wordlistToUILanguage('italian')).toBe('it');
      expect(wordlistToUILanguage('portuguese')).toBe('pt');
      expect(wordlistToUILanguage('japanese')).toBe('ja');
      expect(wordlistToUILanguage('korean')).toBe('ko');
      expect(wordlistToUILanguage('chinese_simplified')).toBe('zh-Hans');
      expect(wordlistToUILanguage('chinese_traditional')).toBe('zh-Hant');
    });

    it('should default to en for unknown', () => {
      expect(wordlistToUILanguage('unknown')).toBe('en');
    });
  });

  describe('getDefaultLanguage', () => {
    it('should return english', () => {
      expect(getDefaultLanguage()).toBe('english');
    });
  });

  describe('determineLanguage', () => {
    it('should return saved language if valid', () => {
      expect(determineLanguage('spanish')).toBe('spanish');
    });

    it('should return default for null', () => {
      expect(determineLanguage(null)).toBe('english');
    });

    it('should return default for invalid', () => {
      expect(determineLanguage('invalid')).toBe('english');
    });
  });

  describe('isValidWordlistLanguage', () => {
    it('should return true for valid languages', () => {
      expect(isValidWordlistLanguage('english')).toBe(true);
      expect(isValidWordlistLanguage('spanish')).toBe(true);
    });

    it('should return false for invalid', () => {
      expect(isValidWordlistLanguage('invalid')).toBe(false);
    });
  });

  describe('languagesMatch', () => {
    it('should return true for matching languages', () => {
      expect(languagesMatch('english', 'english')).toBe(true);
    });

    it('should return false for different languages', () => {
      expect(languagesMatch('english', 'spanish')).toBe(false);
    });
  });

  describe('getSupportedLanguages', () => {
    it('should return array of supported languages', () => {
      const langs = getSupportedLanguages();
      expect(langs).toContain('english');
      expect(langs).toContain('spanish');
      expect(langs.length).toBe(10);
    });
  });
});
