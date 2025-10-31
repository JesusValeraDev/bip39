import { elements, resetBoxes, setStateFromIndex, state } from '../../bip39';
import { setSyncWordInputCallback, updateDisplay } from '../../display';
import { binaryValueToIndex, getWordByIndex, getWordIndex } from '../domain/wordInputHelpers';
import { validateWordInput } from './validation';
import { showSuggestions, hideSuggestions } from './suggestions';
import { handleKeydown as handleKeyboardNavigation } from './keyboard';

export function setupWordInput(): void {
  setSyncWordInputCallback(syncWordInputFromState);

  elements.wordInput.addEventListener('input', handleWordInput);
  elements.wordInput.addEventListener('keydown', e => handleKeyboardNavigation(e, selectWord));
  elements.wordInput.addEventListener('focus', handleWordInput);
  elements.wordInput.addEventListener('blur', handleWordInputBlur);

  const clearBtn = document.getElementById('clear-input-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', handleClearInput);
  }

  document.addEventListener('click', e => {
    if (!elements.wordInput.contains(e.target as Node) && !elements.wordSuggestions.contains(e.target as Node)) {
      hideSuggestions();
    }
  });
}

function handleClearInput(): void {
  elements.wordInput.value = '';
  elements.wordInput.classList.remove('error');
  resetBoxes();
  updateDisplay();
  hideSuggestions();
  toggleClearButton(false);
  elements.wordInput.focus();
}

function handleWordInputBlur(): void {
  hideSuggestions();
  validateWordInput();
}

function handleWordInput(): void {
  const value = elements.wordInput.value.trim().toLowerCase();

  toggleClearButton(elements.wordInput.value.length > 0);

  if (!value) {
    hideSuggestions();
    return;
  }

  const matches = state.wordlist.filter(word => word.toLowerCase().startsWith(value));

  if (matches.length === 0) {
    hideSuggestions();
    return;
  }

  // Hide suggestions if only 1 match and it's an exact match
  if (matches.length === 1 && matches[0].toLowerCase() === value) {
    hideSuggestions();
    return;
  }

  showSuggestions(matches.slice(0, 10), selectWord);
}

function selectWord(word: string): void {
  const wordIndex = getWordIndex(word, state.wordlist);

  if (wordIndex === -1) return;

  elements.wordInput.value = word;
  elements.wordInput.classList.remove('error');
  setStateFromIndex(wordIndex);
  updateDisplay();
  hideSuggestions();
  elements.wordInput.blur();
}

export function clearWordInput(): void {
  elements.wordInput.value = '';
  elements.wordInput.classList.remove('error');
  hideSuggestions();
  toggleClearButton(false);
}

function toggleClearButton(show: boolean): void {
  const clearBtn = document.getElementById('clear-input-btn') as HTMLButtonElement | null;
  if (clearBtn) {
    if (show) {
      clearBtn.disabled = false;
      clearBtn.removeAttribute('aria-disabled');
    } else {
      clearBtn.disabled = true;
      clearBtn.setAttribute('aria-disabled', 'true');
    }
  }
}

export function syncWordInputFromState(): void {
  const index = state.boxes.reduce((acc, val, i) => acc + (val ? Math.pow(2, 11 - i) : 0), 0);

  if (index > 0 && index <= state.wordlist.length) {
    const wordIndex = binaryValueToIndex(index);
    const word = getWordByIndex(wordIndex, state.wordlist);
    if (word && elements.wordInput.value !== word) {
      elements.wordInput.value = word;
      toggleClearButton(true);
    }
  } else {
    if (elements.wordInput.value !== '') {
      elements.wordInput.value = '';
      toggleClearButton(false);
    }
  }
}
