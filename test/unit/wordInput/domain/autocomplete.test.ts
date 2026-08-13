import { describe, it, expect } from 'vitest';
import {
  AUTOCOMPLETE_MIN_LENGTH,
  countCharacters,
  foldDiacritics,
  getAutocompletion,
  getCompletionCaretOffset,
  getWordIndex,
  isCaretAtEnd,
  isForwardTyping,
  isWordInWordlist,
  normalizeForMatching,
} from '../../../../src/modules/wordInput/domain/wordInputHelpers';

const matchesFor = (prefix: string, wordlist: string[]) => wordlist.filter(word => word.startsWith(prefix));

const WORDS = ['abandon', 'ability', 'able', 'about', 'cat', 'catalog', 'catch', 'category', 'cattle'];

// The Spanish and French wordlists ship decomposed; keyboards mostly compose
const decomposed = 'ábaco'.normalize('NFD');
const composed = 'ábaco'.normalize('NFC');

describe('Word Input Autocomplete', () => {
  describe('AUTOCOMPLETE_MIN_LENGTH', () => {
    it('should be the four characters that identify a BIP39 word', () => {
      expect(AUTOCOMPLETE_MIN_LENGTH).toBe(4);
    });
  });

  describe('countCharacters', () => {
    it('should count plain characters', () => {
      expect(countCharacters('aban')).toBe(4);
    });

    it('should count a single CJK character as one', () => {
      expect(countCharacters('的')).toBe(1);
    });
  });

  describe('getAutocompletion', () => {
    it('should complete once four characters are typed', () => {
      expect(getAutocompletion('aban', matchesFor('aban', WORDS))).toBe('abandon');
      expect(getAutocompletion('abou', matchesFor('abou', WORDS))).toBe('about');
    });

    it('should hold off below four characters', () => {
      expect(getAutocompletion('aba', matchesFor('aba', WORDS))).toBeNull();
      expect(getAutocompletion('ab', matchesFor('ab', WORDS))).toBeNull();
      expect(getAutocompletion('a', matchesFor('a', WORDS))).toBeNull();
    });

    it('should complete a three-character word on an exact hit', () => {
      expect(getAutocompletion('cat', matchesFor('cat', WORDS))).toBe('cat');
    });

    it('should prefer the exact hit over the longer words sharing it', () => {
      const matches = matchesFor('cat', WORDS);

      expect(matches).toContain('catalog');
      expect(getAutocompletion('cat', matches)).toBe('cat');
    });

    it('should move on to the longer word once the prefix grows', () => {
      expect(getAutocompletion('cata', matchesFor('cata', WORDS))).toBe('catalog');
    });

    it('should complete single-character words, as CJK wordlists have', () => {
      expect(getAutocompletion('的', ['的'])).toBe('的');
    });

    it('should hold off when four characters still allow several words', () => {
      expect(getAutocompletion('catx', ['catxa', 'catxb'])).toBeNull();
    });

    it('should complete once the ambiguity is typed away', () => {
      expect(getAutocompletion('catxa', ['catxa'])).toBe('catxa');
    });

    it('should still complete an exact hit that longer words extend', () => {
      expect(getAutocompletion('catx', ['catx', 'catxa', 'catxb'])).toBe('catx');
    });

    it('should return null without matches', () => {
      expect(getAutocompletion('zzzz', [])).toBeNull();
    });

    it('should return null for empty input', () => {
      expect(getAutocompletion('', WORDS)).toBeNull();
    });

    it('should honour a custom minimum length', () => {
      expect(getAutocompletion('aba', matchesFor('aba', WORDS), 3)).toBe('abandon');
    });
  });

  describe('normalization', () => {
    it('should count an accented character once, however it is encoded', () => {
      expect(countCharacters(decomposed)).toBe(5);
      expect(countCharacters(composed)).toBe(5);
    });

    it('should treat both encodings as the same text', () => {
      expect(normalizeForMatching(decomposed)).toBe(normalizeForMatching(composed));
    });

    it('should complete a composed input against a decomposed wordlist', () => {
      const typed = normalizeForMatching('ábac');

      expect(getAutocompletion(typed, [decomposed])).toBe(decomposed);
    });

    it('should hold off at three accented characters, not four code points', () => {
      const typed = normalizeForMatching('ába');

      expect(getAutocompletion(typed, [decomposed])).toBeNull();
    });

    it('should find a decomposed word from composed input', () => {
      expect(isWordInWordlist(composed, [decomposed])).toBe(true);
      expect(getWordIndex(composed, ['abandon', decomposed])).toBe(1);
    });
  });

  describe('foldDiacritics', () => {
    it('should treat a letter and its accented form as the same character', () => {
      expect(normalizeForMatching('á')).toBe(normalizeForMatching('a'));
      expect(normalizeForMatching('é')).toBe(normalizeForMatching('e'));
      expect(normalizeForMatching('ñ')).toBe(normalizeForMatching('n'));
      expect(normalizeForMatching('ç')).toBe(normalizeForMatching('c'));
    });

    it('should strip accents whichever way they are encoded', () => {
      expect(foldDiacritics('ábaco'.normalize('NFC'))).toBe('abaco');
      expect(foldDiacritics('ábaco'.normalize('NFD'))).toBe('abaco');
    });

    it('should keep Japanese voiced marks, which distinguish words', () => {
      expect(normalizeForMatching('が')).not.toBe(normalizeForMatching('か'));
    });

    it('should leave unaccented text alone', () => {
      expect(foldDiacritics('abandon')).toBe('abandon');
      expect(foldDiacritics('的')).toBe('的');
    });

    it('should complete an accented word from unaccented typing', () => {
      expect(getAutocompletion(normalizeForMatching('abac'), [decomposed])).toBe(decomposed);
    });

    it('should match an accented word typed without its accent', () => {
      expect(isWordInWordlist('abaco', [decomposed])).toBe(true);
      expect(getWordIndex('abaco', ['abandon', decomposed])).toBe(1);
    });

    it('should put the caret past the accent it just completed through', () => {
      // "abac" folded spans 5 code units of the decomposed word
      expect(getCompletionCaretOffset(decomposed, normalizeForMatching('abac'))).toBe(5);
    });
  });

  describe('getCompletionCaretOffset', () => {
    it('should sit right after what was typed', () => {
      expect(getCompletionCaretOffset('abandon', 'aban')).toBe(4);
    });

    it('should count the code units a decomposed accent really occupies', () => {
      // "ába" is 3 characters but 4 code units once decomposed
      expect(getCompletionCaretOffset('ábaco', normalizeForMatching('ába'))).toBe(4);
    });

    it('should land at the end for an exact hit', () => {
      expect(getCompletionCaretOffset('cat', 'cat')).toBe(3);
    });
  });

  describe('isForwardTyping', () => {
    it('should accept inserted text', () => {
      expect(isForwardTyping('insertText')).toBe(true);
      expect(isForwardTyping('insertFromPaste')).toBe(true);
    });

    it('should reject deletions, so completing does not undo a backspace', () => {
      expect(isForwardTyping('deleteContentBackward')).toBe(false);
      expect(isForwardTyping('deleteContentForward')).toBe(false);
      expect(isForwardTyping('deleteByCut')).toBe(false);
    });

    it('should reject events carrying no input type, such as focus', () => {
      expect(isForwardTyping(undefined)).toBe(false);
      expect(isForwardTyping(null)).toBe(false);
      expect(isForwardTyping('')).toBe(false);
    });
  });

  describe('isCaretAtEnd', () => {
    it('should accept a collapsed caret at the end', () => {
      expect(isCaretAtEnd(4, 4, 4)).toBe(true);
    });

    it('should reject a caret parked mid-word', () => {
      expect(isCaretAtEnd(2, 2, 4)).toBe(false);
    });

    it('should reject an active selection', () => {
      expect(isCaretAtEnd(2, 4, 4)).toBe(false);
    });

    it('should reject a missing caret', () => {
      expect(isCaretAtEnd(null, null, 4)).toBe(false);
    });
  });
});
