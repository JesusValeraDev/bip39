import { elements } from '../core/dom';
import { state, setStateFromIndex, resetBoxes } from '../core/state';
import { updateDisplay } from './display';
import { currentTranslations } from '../services/language';

let selectedSuggestionIndex = -1;

export function setupWordInput(): void {
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
    // Empty input - valid state
    elements.wordInput.classList.remove('error');
    return;
  }
  
  // Check if word exists in wordlist
  const wordExists = state.wordlist.some(word => word.toLowerCase() === value);
  
  if (!wordExists) {
    // Invalid word - show error and reset boxes
    elements.wordInput.classList.add('error');
    resetBoxes();
    updateDisplay();
    showInvalidWordToast();
  } else {
    // Valid word
    elements.wordInput.classList.remove('error');
  }
}

function showInvalidWordToast(): void {
  // Remove existing toast if any
  const existingToast = document.getElementById('invalid-word-toast');
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast element
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

function handleKeydown(e: KeyboardEvent): void {
  const suggestions = elements.wordSuggestions.querySelectorAll('.suggestion-item');
  
  if (suggestions.length === 0) return;
  
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, suggestions.length - 1);
      updateSuggestionSelection(suggestions);
      break;
      
    case 'ArrowUp':
      e.preventDefault();
      selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, 0);
      updateSuggestionSelection(suggestions);
      break;
      
    case 'Enter':
      e.preventDefault();
      if (selectedSuggestionIndex >= 0) {
        const selectedItem = suggestions[selectedSuggestionIndex] as HTMLElement;
        const word = selectedItem.querySelector('.suggestion-word')?.textContent || '';
        selectWord(word);
      }
      break;
      
    case 'Escape':
      hideSuggestions();
      elements.wordInput.blur();
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
  const wordIndex = state.wordlist.indexOf(word);
  
  if (wordIndex === -1) return;
  
  // Update the input
  elements.wordInput.value = word;
  
  // Remove error state if any
  elements.wordInput.classList.remove('error');
  
  // Update the state (wordIndex is 0-based, but we need 1-based for display)
  setStateFromIndex(wordIndex);
  
  // Update the display
  updateDisplay();
  
  // Hide suggestions
  hideSuggestions();
  
  // Blur the input
  elements.wordInput.blur();
}

// Clear input when state is reset
export function clearWordInput(): void {
  elements.wordInput.value = '';
  elements.wordInput.classList.remove('error');
  hideSuggestions();
}

// Update input when boxes change (bidirectional sync)
export function syncWordInputFromState(): void {
  const index = state.boxes.reduce((acc, val, i) => acc + (val ? Math.pow(2, 11 - i) : 0), 0);
  
  if (index > 0 && index <= state.wordlist.length) {
    const word = state.wordlist[index - 1];
    if (elements.wordInput.value !== word) {
      elements.wordInput.value = word;
    }
  } else {
    if (elements.wordInput.value !== '') {
      elements.wordInput.value = '';
    }
  }
}
