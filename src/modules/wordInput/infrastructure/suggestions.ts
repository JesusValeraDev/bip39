import { elements, state } from '../../bip39';
import { getIndexBase, toDisplayIndex } from '../../indexBase';

let selectedSuggestionIndex = -1;
let hideSuggestionsTimeout: NodeJS.Timeout | null = null;

/** Options need an id for the input to be able to point at the active one. */
const SUGGESTION_ID_PREFIX = 'word-suggestion-';

function setListExpanded(isExpanded: boolean): void {
  elements.wordInput.setAttribute('aria-expanded', isExpanded.toString());
}

/**
 * Names the highlighted option on the input, which is what a screen reader
 * reads out as the arrow keys move through the list.
 */
function setActiveSuggestion(index: number): void {
  const items = elements.wordSuggestions.querySelectorAll('.suggestion-item');

  items.forEach((item, itemIndex) => {
    item.setAttribute('aria-selected', (itemIndex === index).toString());
  });

  if (index < 0 || index >= items.length) {
    elements.wordInput.removeAttribute('aria-activedescendant');
    return;
  }

  elements.wordInput.setAttribute('aria-activedescendant', `${SUGGESTION_ID_PREFIX}${index}`);
}

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
  // A freshly rendered list starts with nothing highlighted
  selectedSuggestionIndex = -1;

  matches.forEach((word, index) => {
    const wordIndex = state.wordlist.indexOf(word);
    const item = document.createElement('div');
    item.className = 'suggestion-item';
    item.id = `${SUGGESTION_ID_PREFIX}${index}`;
    item.setAttribute('role', 'option');
    item.setAttribute('aria-selected', 'false');
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
      selectedSuggestionIndex = index;
      setActiveSuggestion(index);
    });

    elements.wordSuggestions.appendChild(item);
  });

  elements.wordSuggestions.removeAttribute('hidden');
  setListExpanded(true);
  setActiveSuggestion(-1);
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
  setListExpanded(false);
  elements.wordInput.removeAttribute('aria-activedescendant');
}

export function isSuggestionListOpen(): boolean {
  return !elements.wordSuggestions.hasAttribute('hidden');
}

export function updateSuggestionSelection(suggestions: NodeListOf<Element>): void {
  setActiveSuggestion(selectedSuggestionIndex);

  if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
    (suggestions[selectedSuggestionIndex] as HTMLElement).scrollIntoView({ block: 'nearest' });
  }
}

export function clearSuggestionSelection(): void {
  setActiveSuggestion(-1);
}
