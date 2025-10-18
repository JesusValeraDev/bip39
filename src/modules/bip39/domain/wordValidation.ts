export const MIN_WORD_INDEX = 0;
export const MAX_WORD_INDEX = 2047;

export function normalizeWord(word: string): string {
  return word.trim().toLowerCase();
}

export function isWordInWordlist(word: string, wordlist: string[]): boolean {
  const normalized = normalizeWord(word);
  if (!normalized) return false;

  return wordlist.some(w => normalizeWord(w) === normalized);
}

export function findWordIndex(word: string, wordlist: string[]): number {
  return wordlist.findIndex(w => normalizeWord(w) === normalizeWord(word));
}

export function getWordByIndex(index: number, wordlist: string[]): string | null {
  if (index < 0 || index >= wordlist.length) {
    return null;
  }
  return wordlist[index];
}

export function getWordSuggestions(prefix: string, wordlist: string[], maxResults: number = 10): string[] {
  const normalized = normalizeWord(prefix);

  if (!normalized) {
    return [];
  }

  return wordlist.filter(word => normalizeWord(word).startsWith(normalized)).slice(0, maxResults);
}

export function shouldShowSuggestions(input: string, minLength: number = 1): boolean {
  return normalizeWord(input).length >= minLength;
}

/**
 * Convert wordlist index to BIP39 number (1-2048)
 */
export function indexToNumber(index: number): number {
  return index + 1;
}

/**
 * Convert BIP39 number to wordlist index (0-2047)
 */
export function numberToIndex(number: number): number {
  return number - 1;
}

export function isValidNumber(number: number): boolean {
  return number >= 1 && number <= 2048;
}
