import { elements, resetBoxes, setStateFromIndex, state } from '../../bip39';
import { setSyncWordInputCallback, updateDisplay } from '../../display';
import {
  getAutocompletion,
  getCompletionCaretOffset,
  getWordByIndex,
  getWordIndex,
  isCaretAtEnd,
  isForwardTyping,
  isWordInWordlist,
  normalizeForMatching,
} from '../domain/wordInputHelpers';
import { getIndexBase, isSelectableDisplayIndex, toWordlistIndex } from '../../indexBase';
import { validateWordInput } from './validation';
import { showSuggestions, hideSuggestions, clearSuggestions } from './suggestions';
import { handleKeydown as handleKeyboardNavigation } from './keyboard';

// Guards the input against being rewritten from the state while its content is
// the user's to control
let suppressInputSync = false;

function withoutInputSync(action: () => void): void {
  suppressInputSync = true;

  try {
    action();
  } finally {
    suppressInputSync = false;
  }
}

export function setupWordInput(): void {
  setSyncWordInputCallback(syncWordInputFromState);

  elements.wordInput.addEventListener('input', handleWordInput);
  elements.wordInput.addEventListener('keydown', e =>
    handleKeyboardNavigation(e, {
      onSelectWord: word => selectWord(word, true),
      onReset: handleClearInput,
      onAccept: handleAcceptInput,
    })
  );
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

  // Left empty on purpose: under 0-based numbering the emptied boxes still name
  // the first word, and writing it straight back would leave nowhere to type.
  withoutInputSync(() => {
    resetBoxes();
    updateDisplay();
  });

  clearSuggestions();
  toggleClearButton(false);
  elements.wordInput.focus();
}

/**
 * Enter on a word that exists settles the caret behind it; on anything else
 * there is nothing to settle on, so the input goes back to empty.
 */
function handleAcceptInput(): void {
  const value = elements.wordInput.value;

  if (!normalizeForMatching(value)) return;

  if (!isWordInWordlist(value, state.wordlist)) {
    handleClearInput();
    return;
  }

  elements.wordInput.setSelectionRange(value.length, value.length);
}

function handleWordInputBlur(): void {
  hideSuggestions();
  validateWordInput();

  // The field is only allowed to stay empty while it is being typed in; once
  // focus leaves it shows whatever the boxes name.
  if (!elements.wordInput.value) {
    syncWordInputFromState();
  }
}

function handleWordInput(event?: Event): void {
  const value = normalizeForMatching(elements.wordInput.value);

  toggleClearButton(elements.wordInput.value.length > 0);

  if (!value) {
    clearSuggestions();
    return;
  }

  const matches = state.wordlist.filter(word => normalizeForMatching(word).startsWith(value));

  if (matches.length === 0) {
    // Nothing the input could still become, so stop showing a word it no longer names
    clearSelectionWhileTyping();
    clearSuggestions();
    return;
  }

  const completed = autocompleteWordInput(value, matches, event);

  // Nothing left to offer once the only match is already in the input. Taken
  // down at once: a list still fading out is a list Enter can still act on.
  if (matches.length === 1 && (completed !== null || normalizeForMatching(matches[0]) === value)) {
    clearSuggestions();
    return;
  }

  showSuggestions(matches.slice(0, 10), selectWord);
}

/**
 * Fills in the rest of the word and leaves it selected, so the caret stays put
 * and the next keystroke either types over the selection or, when it matches,
 * simply advances through it.
 */
function autocompleteWordInput(typed: string, matches: string[], event?: Event): string | null {
  const input = elements.wordInput;

  if (!isForwardTyping((event as InputEvent | undefined)?.inputType)) {
    return null;
  }

  if (!isCaretAtEnd(input.selectionStart, input.selectionEnd, input.value.length)) {
    return null;
  }

  const completion = getAutocompletion(typed, matches);
  if (completion === null) {
    return null;
  }

  const wordIndex = getWordIndex(completion, state.wordlist);
  if (wordIndex === -1) {
    return null;
  }

  input.value = completion;
  input.classList.remove('error');
  setStateFromIndex(wordIndex);
  updateDisplay();
  input.setSelectionRange(getCompletionCaretOffset(completion, typed), completion.length);
  toggleClearButton(true);

  return completion;
}

/**
 * Drops the selection without the display writing the state back over what is
 * being typed.
 */
function clearSelectionWhileTyping(): void {
  withoutInputSync(() => {
    resetBoxes();
    updateDisplay();
  });
}

function selectWord(word: string, keepFocus: boolean = false): void {
  const wordIndex = getWordIndex(word, state.wordlist);

  if (wordIndex === -1) return;

  elements.wordInput.value = word;
  elements.wordInput.classList.remove('error');
  setStateFromIndex(wordIndex);
  updateDisplay();
  clearSuggestions();

  // Enter fills the word mid-typing, so the caret stays for the next keystroke
  if (keepFocus) {
    elements.wordInput.setSelectionRange(word.length, word.length);
    return;
  }

  elements.wordInput.blur();
}

export function clearWordInput(): void {
  elements.wordInput.value = '';
  elements.wordInput.classList.remove('error');
  clearSuggestions();
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
  if (suppressInputSync) return;

  const index = state.boxes.reduce((acc, val, i) => acc + (val ? Math.pow(2, 11 - i) : 0), 0);
  const base = getIndexBase();

  if (isSelectableDisplayIndex(index, base)) {
    const wordIndex = toWordlistIndex(index, base);
    const word = getWordByIndex(wordIndex, state.wordlist);
    if (word && elements.wordInput.value !== word) {
      elements.wordInput.value = word;
      // What is shown is a real word now, whatever was typed before
      elements.wordInput.classList.remove('error');
      toggleClearButton(true);
    }
  } else {
    if (elements.wordInput.value !== '') {
      elements.wordInput.value = '';
      toggleClearButton(false);
    }
  }
}
