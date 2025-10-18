export function determineUILanguage(savedLanguage: string): string {
  const wordlistToUILang: Record<string, string> = {
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

  return wordlistToUILang[savedLanguage] || 'en';
}

export function getGitHashOrDefault(envGitHash: string | undefined): string {
  return envGitHash || 'dev';
}

export function validateModalElement(modal: HTMLElement | null): boolean {
  return modal !== null && modal !== undefined;
}

export function validateButtonElements(learnBtn: HTMLElement | null, modalClose: HTMLElement | null): boolean {
  return learnBtn !== null && modalClose !== null;
}

export function isEscapeKey(key: string): boolean {
  return key === 'Escape';
}

export function isModalOpen(ariaHidden: string | null): boolean {
  return ariaHidden === 'false';
}

export function getModalTransitionDuration(): number {
  return 300; // milliseconds
}
