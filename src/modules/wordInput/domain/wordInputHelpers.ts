export function isWordInWordlist(word: string, wordlist: string[]): boolean {
  const normalizedWord = word.trim().toLowerCase();
  if (!normalizedWord) return false;
  
  return wordlist.some(w => w.toLowerCase() === normalizedWord);
}

export function getSuggestions(input: string, wordlist: string[], maxSuggestions: number = 10): string[] {
  const normalizedInput = input.trim().toLowerCase();
  
  if (!normalizedInput) {
    return [];
  }

  return wordlist
    .filter(word => word.toLowerCase().startsWith(normalizedInput))
    .slice(0, maxSuggestions);
}

export function getWordIndex(word: string, wordlist: string[]): number {
  return wordlist.indexOf(word);
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
