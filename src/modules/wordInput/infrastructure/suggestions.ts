import { elements, state } from '../../bip39';
import { getIndexBase, toDisplayIndex } from '../../indexBase';

let selectedSuggestionIndex = -1;
let hideSuggestionsTimeout: NodeJS.Timeout | null = null;

export function getSelectedIndex(): number {
  return selectedSuggestionIndex;
}

export function setSelectedIndex(index: number): void {
  selectedSuggestionIndex = index;
}

export function showSuggestions(matches: string[], onSelect: (word: string) => void): void {
  // A hide scheduled a moment ago must not land on the list being rendered now
  cancelPendingHide();
  elements.wordSuggestions.innerHTML = '';

  matches.forEach((word, index) => {
    const wordIndex = state.wordlist.indexOf(word);
    const item = document.createElement('div');
    item.className = 'suggestion-item';
    item.setAttribute('role', 'option');
    item.setAttribute('data-index', index.toString());

    item.innerHTML = `
      <span class="suggestion-word">${word}</span>
      <span class="suggestion-index">#${toDisplayIndex(wordIndex, getIndexBase())}</span>
    `;

    item.addEventListener('mousedown', e => {
      e.preventDefault();
      onSelect(word);
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

function cancelPendingHide(): void {
  if (hideSuggestionsTimeout) {
    clearTimeout(hideSuggestionsTimeout);
    hideSuggestionsTimeout = null;
  }
}

/**
 * Delayed, so a click on a suggestion still lands after the input blurs.
 */
export function hideSuggestions(): void {
  cancelPendingHide();

  hideSuggestionsTimeout = setTimeout(() => {
    clearSuggestions();
  }, 200);
}

/**
 * Takes the list down at once, leaving nothing stale behind to be read as the
 * current offer.
 */
export function clearSuggestions(): void {
  cancelPendingHide();

  elements.wordSuggestions.innerHTML = '';
  elements.wordSuggestions.setAttribute('hidden', '');
  selectedSuggestionIndex = -1;
}

export function isSuggestionListOpen(): boolean {
  return !elements.wordSuggestions.hasAttribute('hidden');
}

export function updateSuggestionSelection(suggestions: NodeListOf<Element>): void {
  clearSuggestionSelection();

  if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
    const selectedItem = suggestions[selectedSuggestionIndex] as HTMLElement;
    selectedItem.setAttribute('aria-selected', 'true');
    selectedItem.scrollIntoView({ block: 'nearest' });
  }
}

export function clearSuggestionSelection(): void {
  elements.wordSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
    item.setAttribute('aria-selected', 'false');
  });
}
