import { elements, resetBoxes, setStateFromIndex, state } from '../../bip39';
import { updateDisplay } from '../../display';
import { showToast } from '../../display';
import { currentTranslations } from '../../language';
import { getWordIndex, isWordInWordlist } from '../domain/wordInputHelpers';

let errorClearTimeout: NodeJS.Timeout | null = null;

export function validateWordInput(): void {
  const value = elements.wordInput.value.trim().toLowerCase();

  if (!value) {
    clearInputError();
    return;
  }

  const wordExists = isWordInWordlist(value, state.wordlist);

  if (wordExists) {
    handleValidWord(value);
  } else {
    handleInvalidWord();
  }
}

function clearInputError(): void {
  elements.wordInput.classList.remove('error');
}

function handleValidWord(value: string): void {
  clearInputError();
  const wordIndex = getWordIndex(value, state.wordlist);
  if (wordIndex !== -1) {
    setStateFromIndex(wordIndex);
    updateDisplay();
  }
}

function handleInvalidWord(): void {
  elements.wordInput.classList.add('error');
  resetBoxes();
  updateDisplay();
  showToast('invalid-word-toast', currentTranslations.invalidWordMessage);
  scheduleErrorAutoClear();
}

function scheduleErrorAutoClear(): void {
  if (errorClearTimeout) {
    clearTimeout(errorClearTimeout);
  }
  errorClearTimeout = setTimeout(() => {
    elements.wordInput.classList.remove('error');
  }, 3500);
}
