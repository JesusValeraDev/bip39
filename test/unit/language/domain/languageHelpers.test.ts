import { describe, it, expect } from 'vitest';
import {
  getDefaultLanguage,
  determineLanguage,
  isLanguageActive,
  getUILanguageCode,
} from '../../../../src/modules/language';

describe('Language Helpers - Pure Functions', () => {
  describe('getDefaultLanguage', () => {
    it('should return english as default', () => {
      expect(getDefaultLanguage()).toBe('english');
    });
    
    it('should always return the same value', () => {
      expect(getDefaultLanguage()).toBe(getDefaultLanguage());
    });
  });

  describe('determineLanguage', () => {
    it('should return saved language if provided', () => {
      expect(determineLanguage('french')).toBe('french');
      expect(determineLanguage('spanish')).toBe('spanish');
    });

    it('should return default if no saved language', () => {
      expect(determineLanguage(null)).toBe('english');
    });

    it('should handle all supported languages', () => {
      const languages = ['english', 'spanish', 'french', 'italian', 'portuguese', 'japanese', 'korean', 'czech'];
      
      languages.forEach(lang => {
        expect(determineLanguage(lang)).toBe(lang);
      });
    });
  });

  describe('isLanguageActive', () => {
    it('should return true when languages match', () => {
      expect(isLanguageActive('english', 'english')).toBe(true);
      expect(isLanguageActive('spanish', 'spanish')).toBe(true);
    });

    it('should return false when languages do not match', () => {
      expect(isLanguageActive('english', 'spanish')).toBe(false);
      expect(isLanguageActive('french', 'italian')).toBe(false);
    });

    it('should be case sensitive', () => {
      expect(isLanguageActive('English', 'english')).toBe(false);
    });
  });

  describe('getUILanguageCode', () => {
    it('should map english to en', () => {
      expect(getUILanguageCode('english')).toBe('en');
    });

    it('should map spanish to es', () => {
      expect(getUILanguageCode('spanish')).toBe('es');
    });

    it('should map french to fr', () => {
      expect(getUILanguageCode('french')).toBe('fr');
    });

    it('should map czech to cs', () => {
      expect(getUILanguageCode('czech')).toBe('cs');
    });

    it('should map italian to it', () => {
      expect(getUILanguageCode('italian')).toBe('it');
    });

    it('should map portuguese to pt', () => {
      expect(getUILanguageCode('portuguese')).toBe('pt');
    });

    it('should map japanese to ja', () => {
      expect(getUILanguageCode('japanese')).toBe('ja');
    });

    it('should map korean to ko', () => {
      expect(getUILanguageCode('korean')).toBe('ko');
    });

    it('should map chinese_simplified to zh-Hans', () => {
      expect(getUILanguageCode('chinese_simplified')).toBe('zh-Hans');
    });

    it('should map chinese_traditional to zh-Hant', () => {
      expect(getUILanguageCode('chinese_traditional')).toBe('zh-Hant');
    });

    it('should default to en for unknown language', () => {
      expect(getUILanguageCode('unknown')).toBe('en');
    });
  });
});
