import { elements } from '../../bip39';
import { state, setStateFromIndex, resetBoxes } from '../../bip39';
import { updateDisplay, setSyncWordInputCallback } from '../../display';
import { currentTranslations } from '../../language';
import { isWordInWordlist, getWordIndex, binaryValueToIndex, getWordByIndex } from '../domain/wordInputHelpers';

let selectedSuggestionIndex = -1;

export function setupWordInput(): void {
  // Register callback to avoid circular dependency
  setSyncWordInputCallback(syncWordInputFromState);
  
  elements.wordInput.addEventListener('input', handleWordInput);
  elements.wordInput.addEventListener('keydown', handleKeydown);
  elements.wordInput.addEventListener('focus', handleWordInput);
  elements.wordInput.addEventListener('blur', handleWordInputBlur);
  
  // Handle click outside to close suggestions
  document.addEventListener('click', (e) => {
    if (!elements.wordInput.contains(e.target as Node) && 
        !elements.wordSuggestions.contains(e.target as Node)) {
      hideSuggestions();
    }
  });
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
    return;
  }

  // Invalid word - show error and reset boxes
  elements.wordInput.classList.add('error');
  resetBoxes();
  updateDisplay();
  showInvalidWordToast();
}

function showInvalidWordToast(): void {
  const existingToast = document.getElementById('invalid-word-toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.id = 'invalid-word-toast';
  toast.className = 'toast';
  toast.textContent = currentTranslations.invalidWordMessage;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');

  document.body.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 0);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

function handleWordInput(): void {
  const value = elements.wordInput.value.trim().toLowerCase();
  
  if (!value) {
    hideSuggestions();
    return;
  }
  
  // Find matching words
  const matches = state.wordlist.filter(word => 
    word.toLowerCase().startsWith(value)
  );
  
  if (matches.length === 0) {
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
    
    item.addEventListener('mousedown', (e) => {
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
  setTimeout(() => {
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
}

export function syncWordInputFromState(): void {
  const index = state.boxes.reduce((acc, val, i) => acc + (val ? Math.pow(2, 11 - i) : 0), 0);
  
  if (index > 0 && index <= state.wordlist.length) {
    const wordIndex = binaryValueToIndex(index);
    const word = getWordByIndex(wordIndex, state.wordlist);
    if (word && elements.wordInput.value !== word) {
      elements.wordInput.value = word;
    }
  } else {
    if (elements.wordInput.value !== '') {
      elements.wordInput.value = '';
    }
  }
}
