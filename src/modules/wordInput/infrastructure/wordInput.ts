import { elements, resetBoxes, setStateFromIndex, state } from '../../bip39';
import { setSyncWordInputCallback, updateDisplay } from '../../display';
import { showToast } from '../../display';
import { currentTranslations } from '../../language';
import { binaryValueToIndex, getWordByIndex, getWordIndex, isWordInWordlist } from '../domain/wordInputHelpers';

let selectedSuggestionIndex = -1;
let hideSuggestionsTimeout: NodeJS.Timeout | null = null;
let errorClearTimeout: NodeJS.Timeout | null = null;

export function setupWordInput(): void {
  // Register callback to avoid circular dependency
  setSyncWordInputCallback(syncWordInputFromState);

  elements.wordInput.addEventListener('input', handleWordInput);
  elements.wordInput.addEventListener('keydown', handleKeydown);
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

function validateWordInput(): void {
  const value = elements.wordInput.value.trim().toLowerCase();

  if (!value) {
    elements.wordInput.classList.remove('error');
    return;
  }

  // Check if word exists in wordlist using helper
  const wordExists = isWordInWordlist(value, state.wordlist);

  if (wordExists) {
    elements.wordInput.classList.remove('error');
    const wordIndex = getWordIndex(value, state.wordlist);
    if (wordIndex !== -1) {
      setStateFromIndex(wordIndex);
      updateDisplay();
    }
    return;
  }

  // Invalid word - show error and reset boxes
  elements.wordInput.classList.add('error');
  resetBoxes();
  updateDisplay();
  showToast('invalid-word-toast', currentTranslations.invalidWordMessage);

  if (errorClearTimeout) {
    clearTimeout(errorClearTimeout);
  }
  errorClearTimeout = setTimeout(() => {
    elements.wordInput.classList.remove('error');
  }, 3500);
}

function handleWordInput(): void {
  const value = elements.wordInput.value.trim().toLowerCase();

  toggleClearButton(elements.wordInput.value.length > 0);

  if (!value) {
    hideSuggestions();
    return;
  }

  // Find matching words
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

  // Show suggestions
  showSuggestions(matches.slice(0, 10)); // Limit to 10 suggestions
  selectedSuggestionIndex = -1;
}

function showSuggestions(matches: string[]): void {
  elements.wordSuggestions.innerHTML = '';

  matches.forEach((word, index) => {
    const wordIndex = state.wordlist.indexOf(word);
    const item = document.createElement('div');
    item.className = 'suggestion-item';
    item.setAttribute('role', 'option');
    item.setAttribute('data-index', index.toString());

    item.innerHTML = `
      <span class="suggestion-word">${word}</span>
      <span class="suggestion-index">#${wordIndex + 1}</span>
    `;

    item.addEventListener('mousedown', e => {
      e.preventDefault(); // Prevent blur event
      selectWord(word);
    });

    item.addEventListener('mouseenter', () => {
      clearSuggestionSelection();
      selectedSuggestionIndex = index;
      item.setAttribute('aria-selected', 'true');
    });

    elements.wordSuggestions.appendChild(item);
  });

  elements.wordSuggestions.removeAttribute('hidden');
}

function hideSuggestions(): void {
  // Clear existing timeout to prevent multiple timers
  if (hideSuggestionsTimeout) {
    clearTimeout(hideSuggestionsTimeout);
  }

  hideSuggestionsTimeout = setTimeout(() => {
    elements.wordSuggestions.setAttribute('hidden', '');
    selectedSuggestionIndex = -1;
  }, 200);
}

function handleArrowDown(suggestions: NodeListOf<Element>): void {
  selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, suggestions.length - 1);
  updateSuggestionSelection(suggestions);
}

function handleArrowUp(suggestions: NodeListOf<Element>): void {
  selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, 0);
  updateSuggestionSelection(suggestions);
}

function handleEnterKey(suggestions: NodeListOf<Element>): void {
  if (selectedSuggestionIndex >= 0) {
    const selectedItem = suggestions[selectedSuggestionIndex] as HTMLElement;
    const word = selectedItem.querySelector('.suggestion-word')?.textContent || '';
    selectWord(word);
  }
}

function handleEscapeKey(): void {
  hideSuggestions();
  elements.wordInput.blur();
}

function handleKeydown(e: KeyboardEvent): void {
  const suggestions = elements.wordSuggestions.querySelectorAll('.suggestion-item');

  if (suggestions.length === 0) {
    return;
  }

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      handleArrowDown(suggestions);
      break;

    case 'ArrowUp':
      e.preventDefault();
      handleArrowUp(suggestions);
      break;

    case 'Enter':
      e.preventDefault();
      handleEnterKey(suggestions);
      break;

    case 'Escape':
      handleEscapeKey();
      break;
  }
}

function updateSuggestionSelection(suggestions: NodeListOf<Element>): void {
  clearSuggestionSelection();

  if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
    const selectedItem = suggestions[selectedSuggestionIndex] as HTMLElement;
    selectedItem.setAttribute('aria-selected', 'true');
    selectedItem.scrollIntoView({ block: 'nearest' });
  }
}

function clearSuggestionSelection(): void {
  elements.wordSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
    item.setAttribute('aria-selected', 'false');
  });
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
