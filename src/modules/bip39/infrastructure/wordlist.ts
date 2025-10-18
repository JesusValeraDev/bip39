import { state } from '../domain/state';

export async function loadWordlist(language: string = 'english'): Promise<void> {
  try {
    state.currentLanguage = language;
    const response = await fetch(`/doc/${language}.txt`);

    if (!response.ok) {
      throw new Error(`Failed to load wordlist: ${response.status}`);
    }

    const text = await response.text();
    state.wordlist = text
      .trim()
      .split('\n')
      .map(word => word.trim());

    state.error = null; // Clear any previous errors
  } catch (error) {
    state.error = 'wordlist_load_failed';
    console.error('Failed to load wordlist:', error);
    showWordlistError();
  }
}

function showWordlistError(): void {
  // Import dynamically to avoid circular dependency
  void import('../../language/infrastructure/language').then(({ currentTranslations }) => {
    const errorToast = document.createElement('div');
    errorToast.id = 'wordlist-error-toast';
    errorToast.className = 'toast error';
    errorToast.textContent = currentTranslations.wordlistLoadError;
    errorToast.setAttribute('role', 'alert');
    errorToast.setAttribute('aria-live', 'assertive');

    document.body.appendChild(errorToast);

    setTimeout(() => {
      errorToast.classList.add('show');
    }, 10);

    // Keep error visible longer (10 seconds)
    setTimeout(() => {
      errorToast.classList.remove('show');
      setTimeout(() => {
        errorToast.remove();
      }, 300);
    }, 10000);
  });
}

export function getWord(index: number): string {
  if (state.wordlist.length > 0 && state.wordlist[index]) {
    return state.wordlist[index];
  }
  return 'N/A';
}
