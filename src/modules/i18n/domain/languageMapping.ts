export type WordlistLanguage =
  | 'english' 
  | 'spanish' 
  | 'french' 
  | 'czech' 
  | 'italian' 
  | 'portuguese' 
  | 'japanese' 
  | 'korean' 
  | 'chinese_simplified' 
  | 'chinese_traditional';

export type UILanguage = 'en' | 'es' | 'fr' | 'cs' | 'it' | 'pt' | 'ja' | 'ko' | 'zh-Hans' | 'zh-Hant';

export const DEFAULT_LANGUAGE: WordlistLanguage = 'english';
export const DEFAULT_UI_LANGUAGE: UILanguage = 'en';

/**
 * Mapping from wordlist language to UI language code
 */
const wordlistToUIMap: Record<WordlistLanguage, UILanguage> = {
  english: 'en',
  spanish: 'es',
  french: 'fr',
  czech: 'cs',
  italian: 'it',
  portuguese: 'pt',
  japanese: 'ja',
  korean: 'ko',
  chinese_simplified: 'zh-Hans',
  chinese_traditional: 'zh-Hant',
};

export function wordlistToUILanguage(wordlistLang: string): UILanguage {
  return wordlistToUIMap[wordlistLang as WordlistLanguage] || DEFAULT_UI_LANGUAGE;
}

export function getDefaultLanguage(): WordlistLanguage {
  return DEFAULT_LANGUAGE;
}

export function determineLanguage(savedLanguage: string | null): WordlistLanguage {
  if (savedLanguage && isValidWordlistLanguage(savedLanguage)) {
    return savedLanguage as WordlistLanguage;
  }
  return DEFAULT_LANGUAGE;
}

export function isValidWordlistLanguage(lang: string): boolean {
  return Object.keys(wordlistToUIMap).includes(lang);
}

export function languagesMatch(lang1: string, lang2: string): boolean {
  return lang1 === lang2;
}

export function getSupportedLanguages(): WordlistLanguage[] {
  return Object.keys(wordlistToUIMap) as WordlistLanguage[];
}
