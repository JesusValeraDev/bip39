import { elements } from '../../bip39';
import {
  getSelectedIndex,
  setSelectedIndex,
  updateSuggestionSelection,
  clearSuggestionSelection,
  clearSuggestions,
  isSuggestionListOpen,
} from './suggestions';

export interface WordInputKeyHandlers {
  /** Fills in a suggestion the user picked, or the first one on offer. */
  onSelectWord: (word: string) => void;
  /** Clears the input and the selection it made. */
  onReset: () => void;
  /** Settles whatever was typed once there is nothing left to offer. */
  onAccept: () => void;
}

export function handleKeydown(e: KeyboardEvent, handlers: WordInputKeyHandlers): void {
  // Escape clears the input, so it acts whether or not suggestions are open
  if (e.key === 'Escape') {
    e.preventDefault();
    handleEscapeKey(handlers.onReset);
    return;
  }

  const suggestions = elements.wordSuggestions.querySelectorAll('.suggestion-item');
  const hasOffer = isSuggestionListOpen() && suggestions.length > 0;

  if (!hasOffer) {
    // Enter with nothing on offer settles on what was typed
    if (e.key === 'Enter') {
      e.preventDefault();
      handlers.onAccept();
    }
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

    case 'Enter': {
      e.preventDefault();
      handleEnterKey(suggestions, handlers.onSelectWord);
      break;
    }
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
  // Without an explicit pick, Enter takes the first suggestion
  const currentIndex = getSelectedIndex();
  const targetIndex = currentIndex >= 0 ? currentIndex : 0;

  const selectedItem = suggestions[targetIndex] as HTMLElement;
  const wordSpan = selectedItem.querySelector('.suggestion-word');
  const word = wordSpan?.textContent;

  if (word) {
    onSelectWord(word);
    clearSuggestions();
  }
}

function handleEscapeKey(onReset: () => void): void {
  clearSuggestions();
  clearSuggestionSelection();
  onReset();
}
