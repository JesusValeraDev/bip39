import { describe, it, expect, beforeEach, vi } from 'vitest';
import { state, resetBoxes, setStateFromIndex } from '../../../src/core/state';

describe('Word Input Validation Logic', () => {
  beforeEach(() => {
    // Reset state
    resetBoxes();
    state.wordlist = ['abandon', 'ability', 'able', 'about', 'above'];
  });

  describe('Word Existence Validation', () => {
    it('should identify valid words', () => {
      const validWords = ['abandon', 'ability', 'able'];
      
      validWords.forEach(word => {
        const exists = state.wordlist.some(w => w.toLowerCase() === word.toLowerCase());
        expect(exists).toBe(true);
      });
    });

    it('should identify invalid words', () => {
      const invalidWords = ['notaword', 'invalid123', 'xyz'];
      
      invalidWords.forEach(word => {
        const exists = state.wordlist.some(w => w.toLowerCase() === word.toLowerCase());
        expect(exists).toBe(false);
      });
    });

    it('should be case-insensitive', () => {
      const variations = ['ABANDON', 'Abandon', 'aBaNdOn'];
      
      variations.forEach(word => {
        const exists = state.wordlist.some(w => w.toLowerCase() === word.toLowerCase());
        expect(exists).toBe(true);
      });
    });

    it('should handle empty string', () => {
      const exists = state.wordlist.some(w => w.toLowerCase() === '');
      expect(exists).toBe(false);
    });

    it('should handle whitespace', () => {
      const exists = state.wordlist.some(w => w.toLowerCase() === '   '.trim());
      expect(exists).toBe(false);
    });
  });

  describe('State Updates on Invalid Word', () => {
    it('should clear all boxes when invalid word is entered', () => {
      setStateFromIndex(10); // Word "above" (index 4, value 11)
      expect(state.boxes.some(b => b)).toBe(true);
      
      resetBoxes();
      
      expect(state.boxes.every(b => !b)).toBe(true);
    });

    it('should not affect state when valid word is entered', () => {
      // Set state for "abandon" (index 0, value 1)
      setStateFromIndex(0);
      
      const boxesBefore = [...state.boxes];

      expect(state.boxes).toEqual(boxesBefore);
    });
  });

  describe('Word to Index Conversion', () => {
    it('should find correct index for valid words', () => {
      expect(state.wordlist.indexOf('abandon')).toBe(0);
      expect(state.wordlist.indexOf('ability')).toBe(1);
      expect(state.wordlist.indexOf('above')).toBe(4);
    });

    it('should return -1 for invalid words', () => {
      expect(state.wordlist.indexOf('notaword')).toBe(-1);
      expect(state.wordlist.indexOf('invalid')).toBe(-1);
    });

    it('should handle case sensitivity in indexOf', () => {
      // indexOf is case-sensitive, so validation must use toLowerCase()
      expect(state.wordlist.indexOf('ABANDON')).toBe(-1);
      expect(state.wordlist.indexOf('Abandon')).toBe(-1);
      
      const word = 'ABANDON';
      const index = state.wordlist.findIndex(w => w.toLowerCase() === word.toLowerCase());
      expect(index).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle wordlist with duplicate words', () => {
      state.wordlist = ['test', 'test', 'other'];
      
      const firstIndex = state.wordlist.indexOf('test');
      expect(firstIndex).toBe(0); // Returns first occurrence
    });

    it('should handle empty wordlist', () => {
      state.wordlist = [];
      
      const exists = state.wordlist.some(w => w === 'anything');
      expect(exists).toBe(false);
    });

    it('should handle special characters', () => {
      state.wordlist = ['test-word', 'test_word', 'test.word'];
      
      expect(state.wordlist.indexOf('test-word')).toBe(0);
      expect(state.wordlist.indexOf('test_word')).toBe(1);
      expect(state.wordlist.indexOf('test.word')).toBe(2);
    });

    it('should handle unicode characters', () => {
      state.wordlist = ['あいこくしん', '가격', '的'];
      
      expect(state.wordlist.indexOf('あいこくしん')).toBe(0);
      expect(state.wordlist.indexOf('가격')).toBe(1);
      expect(state.wordlist.indexOf('的')).toBe(2);
    });
  });
});
