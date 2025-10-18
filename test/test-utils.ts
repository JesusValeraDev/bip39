import { state } from '../src/modules/bip39';

export function resetState(): void {
  state.boxes.fill(false);
  state.wordlist = [];
  state.currentLanguage = 'english';
}

export const mockWordlist = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
  'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
  'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual'
];

export function mockWordlistResponse(words: string[] = mockWordlist) {
  return Promise.resolve({
    text: () => Promise.resolve(words.join('\n')),
  });
}
