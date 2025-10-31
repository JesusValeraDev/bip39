import { elements, state } from '../../bip39';

let selectedSuggestionIndex = -1;
let hideSuggestionsTimeout: NodeJS.Timeout | null = null;

export function getSelectedIndex(): number {
  return selectedSuggestionIndex;
}

export function setSelectedIndex(index: number): void {
  selectedSuggestionIndex = index;
}

export function showSuggestions(matches: string[], onSelect: (word: string) => void): void {
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

export function hideSuggestions(): void {
  if (hideSuggestionsTimeout) {
    clearTimeout(hideSuggestionsTimeout);
  }

  hideSuggestionsTimeout = setTimeout(() => {
    elements.wordSuggestions.setAttribute('hidden', '');
    selectedSuggestionIndex = -1;
  }, 200);
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
