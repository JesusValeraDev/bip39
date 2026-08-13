export function isWordInWordlist(word: string, wordlist: string[]): boolean {
  const normalizedWord = normalizeForMatching(word);
  if (!normalizedWord) return false;

  return wordlist.some(w => normalizeForMatching(w) === normalizedWord);
}

export function getSuggestions(input: string, wordlist: string[], maxSuggestions: number = 10): string[] {
  const normalizedInput = input.trim().toLowerCase();

  if (!normalizedInput) {
    return [];
  }

  return wordlist.filter(word => word.toLowerCase().startsWith(normalizedInput)).slice(0, maxSuggestions);
}

export function getWordIndex(word: string, wordlist: string[]): number {
  const normalizedWord = normalizeForMatching(word);

  return wordlist.findIndex(w => normalizeForMatching(w) === normalizedWord);
}

export function indexToBinaryValue(index: number): number {
  return index + 1;
}

export function binaryValueToIndex(value: number): number {
  return value - 1;
}

export function isValidIndex(index: number, wordlistLength: number): boolean {
  return index >= 0 && index < wordlistLength;
}

export function getWordByIndex(index: number, wordlist: string[]): string | null {
  if (!isValidIndex(index, wordlist.length)) {
    return null;
  }
  return wordlist[index];
}

export function shouldShowSuggestions(input: string, minLength: number = 1): boolean {
  return input.trim().length >= minLength;
}

/**
 * BIP39 wordlists are built so the first four characters identify a word.
 */
export const AUTOCOMPLETE_MIN_LENGTH = 4;

/**
 * Latin combining marks only. Japanese voiced sound marks (U+3099) sit outside
 * this range on purpose: stripping those would fold が into か, which are
 * different words.
 */
const LATIN_COMBINING_MARKS = /[̀-ͯ]/;

// Built once: folding runs over the whole wordlist on every keystroke
const ALL_LATIN_COMBINING_MARKS = /[̀-ͯ]/g;

function isCombiningMark(character: string): boolean {
  return LATIN_COMBINING_MARKS.test(character);
}

/**
 * Folds accents away, so "a" and "á" are the same character to type.
 *
 * This also settles the encoding: the Spanish and French wordlists ship
 * decomposed, where "á" is two code points, while keyboards mostly send one.
 * No two words in any of the ten wordlists collide once folded.
 */
export function foldDiacritics(text: string): string {
  return text.normalize('NFD').replace(ALL_LATIN_COMBINING_MARKS, '');
}

export function normalizeForMatching(text: string): string {
  return foldDiacritics(text.trim().toLowerCase());
}

/** Counts code points, so single-character CJK wordlists measure as 1, not 3. */
export function countCharacters(text: string): number {
  return [...text.normalize('NFC')].length;
}

/**
 * The word to complete the input to, or null while the input has yet to settle
 * on one. `typed` is expected normalized.
 *
 * An exact hit always wins, which is what makes words shorter than the minimum
 * reachable at all: "cat" would otherwise be typed over on its way to "catalog".
 */
export function getAutocompletion(
  typed: string,
  matches: string[],
  minLength: number = AUTOCOMPLETE_MIN_LENGTH
): string | null {
  if (!typed || matches.length === 0) {
    return null;
  }

  const exactMatch = matches.find(word => normalizeForMatching(word) === typed);
  if (exactMatch) {
    return exactMatch;
  }

  if (countCharacters(typed) < minLength) {
    return null;
  }

  // Four characters identify a word in English, but not in Korean, French,
  // Spanish or Japanese; completing there would be picking one word out of
  // several the input still allows.
  if (matches.length > 1) {
    return null;
  }

  return matches[0];
}

/**
 * Where the caret belongs inside the completed word. Not the length of what was
 * typed: a decomposed word spends more code units on the same characters.
 */
export function getCompletionCaretOffset(completion: string, typed: string): number {
  for (let offset = 0; offset <= completion.length; offset++) {
    if (normalizeForMatching(completion.slice(0, offset)) !== typed) {
      continue;
    }

    // Never park the caret between a letter and its accent
    let end = offset;
    while (end < completion.length && isCombiningMark(completion[end])) {
      end++;
    }

    return end;
  }

  return typed.length;
}

/**
 * Completing while the user deletes would type the word straight back in.
 */
export function isForwardTyping(inputType: string | null | undefined): boolean {
  return typeof inputType === 'string' && inputType.length > 0 && !inputType.startsWith('delete');
}

export function isCaretAtEnd(selectionStart: number | null, selectionEnd: number | null, length: number): boolean {
  return selectionStart === length && selectionEnd === length;
}
