import { elements } from '../../bip39';
import {
  getSelectedIndex,
  setSelectedIndex,
  updateSuggestionSelection,
  clearSuggestionSelection,
  hideSuggestions,
} from './suggestions';

export function handleKeydown(e: KeyboardEvent, onSelectWord: (word: string) => void): void {
  const suggestions = elements.wordSuggestions.querySelectorAll('.suggestion-item');

  if (suggestions.length === 0) return;

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      handleArrowDown(suggestions);
      break;

    case 'ArrowUp':
      e.preventDefault();
      handleArrowUp(suggestions);
      break;

    case 'Enter': {
      e.preventDefault();
      handleEnterKey(suggestions, onSelectWord);
      break;
    }

    case 'Escape':
      e.preventDefault();
      handleEscapeKey();
      break;
  }
}

function handleArrowDown(suggestions: NodeListOf<Element>): void {
  const currentIndex = getSelectedIndex();
  const newIndex = Math.min(currentIndex + 1, suggestions.length - 1);
  setSelectedIndex(newIndex);
  updateSuggestionSelection(suggestions);
}

function handleArrowUp(suggestions: NodeListOf<Element>): void {
  const currentIndex = getSelectedIndex();
  const newIndex = Math.max(currentIndex - 1, 0);
  setSelectedIndex(newIndex);
  updateSuggestionSelection(suggestions);
}

function handleEnterKey(suggestions: NodeListOf<Element>, onSelectWord: (word: string) => void): void {
  const currentIndex = getSelectedIndex();
  if (currentIndex >= 0) {
    const selectedItem = suggestions[currentIndex] as HTMLElement;
    const wordSpan = selectedItem.querySelector('.suggestion-word');
    const word = wordSpan?.textContent;
    if (word) {
      onSelectWord(word);
      hideSuggestions();
    }
  }
}

function handleEscapeKey(): void {
  hideSuggestions();
  clearSuggestionSelection();
}
