import { describe, it, expect } from 'vitest';
import {
  isWordInWordlist,
  getSuggestions,
  getWordIndex,
  indexToBinaryValue,
  binaryValueToIndex,
  isValidIndex,
  getWordByIndex,
  shouldShowSuggestions,
} from '../../../../src/modules/wordInput';

const mockWordlist = [
  'abandon',
  'ability',
  'able',
  'about',
  'above',
  'absent',
  'absorb',
  'abstract',
  'absurd',
  'abuse',
];

describe('Word Input Helpers - Pure Functions', () => {
  describe('isWordInWordlist', () => {
    it('should return true for existing word', () => {
      expect(isWordInWordlist('abandon', mockWordlist)).toBe(true);
    });

    it('should return false for non-existing word', () => {
      expect(isWordInWordlist('nonexistent', mockWordlist)).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(isWordInWordlist('ABANDON', mockWordlist)).toBe(true);
      expect(isWordInWordlist('Ability', mockWordlist)).toBe(true);
    });

    it('should trim whitespace', () => {
      expect(isWordInWordlist('  abandon  ', mockWordlist)).toBe(true);
    });

    it('should return false for empty string', () => {
      expect(isWordInWordlist('', mockWordlist)).toBe(false);
      expect(isWordInWordlist('   ', mockWordlist)).toBe(false);
    });
  });

  describe('getSuggestions', () => {
    it('should return matching suggestions', () => {
      const suggestions = getSuggestions('ab', mockWordlist);
      expect(suggestions).toContain('abandon');
      expect(suggestions).toContain('ability');
      expect(suggestions).toContain('absent');
      expect(suggestions).toContain('absorb');
      expect(suggestions).toContain('abstract');
      expect(suggestions).toContain('absurd');
      expect(suggestions).toContain('abuse');
    });

    it('should limit results to maxSuggestions', () => {
      const suggestions = getSuggestions('ab', mockWordlist, 3);
      expect(suggestions.length).toBeLessThanOrEqual(3);
    });

    it('should return empty for empty input', () => {
      const suggestions = getSuggestions('', mockWordlist);
      expect(suggestions).toEqual([]);
    });

    it('should be case insensitive', () => {
      const suggestions = getSuggestions('AB', mockWordlist);
      expect(suggestions.length).toBeGreaterThan(0);
    });

    it('should return exact matches', () => {
      const suggestions = getSuggestions('abandon', mockWordlist);
      expect(suggestions).toContain('abandon');
    });

    it('should return no matches for non-existing prefix', () => {
      const suggestions = getSuggestions('xyz', mockWordlist);
      expect(suggestions).toEqual([]);
    });
  });

  describe('getWordIndex', () => {
    it('should return correct index', () => {
      expect(getWordIndex('abandon', mockWordlist)).toBe(0);
      expect(getWordIndex('ability', mockWordlist)).toBe(1);
    });

    it('should return -1 for non-existing word', () => {
      expect(getWordIndex('nonexistent', mockWordlist)).toBe(-1);
    });
  });

  describe('indexToBinaryValue', () => {
    it('should convert index to binary value', () => {
      expect(indexToBinaryValue(0)).toBe(1);
      expect(indexToBinaryValue(1)).toBe(2);
      expect(indexToBinaryValue(2047)).toBe(2048);
    });

    it('should add 1 to index', () => {
      expect(indexToBinaryValue(99)).toBe(100);
    });
  });

  describe('binaryValueToIndex', () => {
    it('should convert binary value to index', () => {
      expect(binaryValueToIndex(1)).toBe(0);
      expect(binaryValueToIndex(2)).toBe(1);
      expect(binaryValueToIndex(2048)).toBe(2047);
    });

    it('should subtract 1 from value', () => {
      expect(binaryValueToIndex(100)).toBe(99);
    });
  });

  describe('isValidIndex', () => {
    it('should return true for valid index', () => {
      expect(isValidIndex(0, 2048)).toBe(true);
      expect(isValidIndex(100, 2048)).toBe(true);
      expect(isValidIndex(2047, 2048)).toBe(true);
    });

    it('should return false for negative index', () => {
      expect(isValidIndex(-1, 2048)).toBe(false);
    });

    it('should return false for index >= length', () => {
      expect(isValidIndex(2048, 2048)).toBe(false);
      expect(isValidIndex(3000, 2048)).toBe(false);
    });
  });

  describe('getWordByIndex', () => {
    it('should return word for valid index', () => {
      expect(getWordByIndex(0, mockWordlist)).toBe('abandon');
      expect(getWordByIndex(1, mockWordlist)).toBe('ability');
    });

    it('should return null for invalid index', () => {
      expect(getWordByIndex(-1, mockWordlist)).toBe(null);
      expect(getWordByIndex(100, mockWordlist)).toBe(null);
    });
  });

  describe('shouldShowSuggestions', () => {
    it('should return true for input with length >= minLength', () => {
      expect(shouldShowSuggestions('a', 1)).toBe(true);
      expect(shouldShowSuggestions('ab', 1)).toBe(true);
    });

    it('should return false for empty input', () => {
      expect(shouldShowSuggestions('', 1)).toBe(false);
    });

    it('should respect minLength parameter', () => {
      expect(shouldShowSuggestions('a', 2)).toBe(false);
      expect(shouldShowSuggestions('ab', 2)).toBe(true);
    });

    it('should trim whitespace', () => {
      expect(shouldShowSuggestions('  ', 1)).toBe(false);
      expect(shouldShowSuggestions('  a  ', 1)).toBe(true);
    });
  });
});
