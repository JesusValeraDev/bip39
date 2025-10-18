export function getDefaultLanguage(): string {
  return 'english';
}

export function getSavedLanguage(): string | null {
  return localStorage.getItem('language');
}

export function saveLanguage(language: string): void {
  localStorage.setItem('language', language);
}

export function determineLanguage(savedLanguage: string | null): string {
  return savedLanguage || getDefaultLanguage();
}

export function isLanguageActive(optionLang: string, currentLang: string): boolean {
  return optionLang === currentLang;
}

export function getUILanguageCode(wordlistLang: string): string {
  const mapping: Record<string, string> = {
    'english': 'en',
    'spanish': 'es',
    'french': 'fr',
    'czech': 'cs',
    'italian': 'it',
    'portuguese': 'pt',
    'japanese': 'ja',
    'korean': 'ko',
    'chinese_simplified': 'zh-Hans',
    'chinese_traditional': 'zh-Hant',
  };
  
  return mapping[wordlistLang] || 'en';
}

export function shouldCloseDropdown(isOpen: boolean, clickedInside: boolean): boolean {
  return isOpen && !clickedInside;
}

export function toggleOpenState(currentState: boolean): boolean {
  return !currentState;
}
