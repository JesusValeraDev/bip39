import { state } from '../core/state';

export async function loadWordlist(language: string = 'english'): Promise<void> {
  try {
    state.currentLanguage = language;
    const response = await fetch(`/doc/${language}.txt`);
    const text = await response.text();
    state.wordlist = text.trim().split('\n').map(word => word.trim());
  } catch (error) {
    // Failed to load wordlist
  }
}

export function getWord(index: number): string {
  if (state.wordlist.length > 0 && state.wordlist[index]) {
    return state.wordlist[index];
  }
  return 'N/A';
}
