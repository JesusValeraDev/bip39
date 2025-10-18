import { describe, it, expect } from 'vitest';
import {
  MIN_WORD_INDEX,
  MAX_WORD_INDEX,
  normalizeWord,
  isWordInWordlist,
  findWordIndex,
  getWordByIndex,
  getWordSuggestions,
  shouldShowSuggestions,
  indexToNumber,
  numberToIndex,
  isValidNumber,
} from '../../../../src/modules/bip39';

const mockWordlist = ['abandon', 'ability', 'able', 'about', 'above'];

describe('Domain - Word Validation', () => {
  describe('constants', () => {
    it('should have correct min index', () => {
      expect(MIN_WORD_INDEX).toBe(0);
    });

    it('should have correct max index', () => {
      expect(MAX_WORD_INDEX).toBe(2047);
    });
  });

  describe('normalizeWord', () => {
    it('should trim and lowercase', () => {
      expect(normalizeWord('  HELLO  ')).toBe('hello');
    });

    it('should handle empty string', () => {
      expect(normalizeWord('')).toBe('');
    });
  });

  describe('isWordInWordlist', () => {
    it('should return true for existing word', () => {
      expect(isWordInWordlist('abandon', mockWordlist)).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(isWordInWordlist('ABANDON', mockWordlist)).toBe(true);
    });

    it('should return false for non-existing word', () => {
      expect(isWordInWordlist('xyz', mockWordlist)).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isWordInWordlist('', mockWordlist)).toBe(false);
    });
  });

  describe('findWordIndex', () => {
    it('should find correct index', () => {
      expect(findWordIndex('abandon', mockWordlist)).toBe(0);
      expect(findWordIndex('ability', mockWordlist)).toBe(1);
    });

    it('should return -1 for non-existing word', () => {
      expect(findWordIndex('xyz', mockWordlist)).toBe(-1);
    });

    it('should be case insensitive', () => {
      expect(findWordIndex('ABANDON', mockWordlist)).toBe(0);
    });
  });

  describe('getWordByIndex', () => {
    it('should return word at index', () => {
      expect(getWordByIndex(0, mockWordlist)).toBe('abandon');
    });

    it('should return null for invalid index', () => {
      expect(getWordByIndex(-1, mockWordlist)).toBe(null);
      expect(getWordByIndex(100, mockWordlist)).toBe(null);
    });
  });

  describe('getWordSuggestions', () => {
    it('should return matching words', () => {
      const suggestions = getWordSuggestions('ab', mockWordlist);
      expect(suggestions).toContain('abandon');
      expect(suggestions).toContain('ability');
      expect(suggestions).toContain('about');
      expect(suggestions).toContain('above');
    });

    it('should limit results', () => {
      const suggestions = getWordSuggestions('ab', mockWordlist, 2);
      expect(suggestions.length).toBeLessThanOrEqual(2);
    });

    it('should return empty for no matches', () => {
      const suggestions = getWordSuggestions('xyz', mockWordlist);
      expect(suggestions).toEqual([]);
    });
  });

  describe('shouldShowSuggestions', () => {
    it('should return true for valid input', () => {
      expect(shouldShowSuggestions('a')).toBe(true);
    });

    it('should return false for empty', () => {
      expect(shouldShowSuggestions('')).toBe(false);
    });

    it('should respect min length', () => {
      expect(shouldShowSuggestions('a', 2)).toBe(false);
      expect(shouldShowSuggestions('ab', 2)).toBe(true);
    });
  });

  describe('indexToNumber', () => {
    it('should convert index to number', () => {
      expect(indexToNumber(0)).toBe(1);
      expect(indexToNumber(2047)).toBe(2048);
    });
  });

  describe('numberToIndex', () => {
    it('should convert number to index', () => {
      expect(numberToIndex(1)).toBe(0);
      expect(numberToIndex(2048)).toBe(2047);
    });
  });

  describe('isValidNumber', () => {
    it('should return true for valid range', () => {
      expect(isValidNumber(1)).toBe(true);
      expect(isValidNumber(2048)).toBe(true);
    });

    it('should return false for out of range', () => {
      expect(isValidNumber(0)).toBe(false);
      expect(isValidNumber(2049)).toBe(false);
    });
  });
});
