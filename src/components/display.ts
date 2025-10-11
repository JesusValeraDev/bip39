import { state, calculateBinaryValue, getBinaryString } from '../core/state';
import { elements } from '../core/dom';
import { currentTranslations } from '../services/language';
import { getWord } from '../services/wordlist';

export function updateDisplay(): void {
  const boxElements = elements.grid.querySelectorAll('.box');
  boxElements.forEach((box, index) => {
    const isActive = state.boxes[index];
    if (isActive) {
      box.classList.add('active');
      box.setAttribute('aria-pressed', 'true');
    } else {
      box.classList.remove('active');
      box.setAttribute('aria-pressed', 'false');
    }
  });

  const binaryValue = calculateBinaryValue();

  // Update binary display
  const binaryString = getBinaryString();
  elements.binary.textContent = binaryString;

  let announcement = '';

  // Update word and index
  if (binaryValue === 0) {
    // No boxes selected
    elements.word.textContent = currentTranslations.pickPattern;
    elements.index.textContent = '-';
    elements.word.classList.remove('error');
    announcement = 'No pattern selected';
  } else if (binaryValue > 2048) {
    // Out of range
    elements.word.textContent = currentTranslations.outOfRange;
    elements.index.textContent = `${binaryValue}`;
    elements.word.classList.add('error');
    announcement = `Value ${binaryValue} is out of range. Maximum is 2048`;
  } else {
    // Valid range: 1-2048
    const arrayIndex = binaryValue - 1; // Convert to 0-indexed array
    const displayIndex = binaryValue;
    const word = getWord(arrayIndex);
    elements.word.textContent = word;
    elements.index.textContent = displayIndex.toString();
    elements.word.classList.remove('error');
    announcement = `Word selected: ${word}, index ${displayIndex}`;
  }

  announceToScreenReader(announcement);
}

function announceToScreenReader(message: string): void {
  const announcer = document.getElementById('sr-announcements');
  if (announcer) {
    announcer.textContent = message;
    // Clear after a short delay to allow for new announcements
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  }
}
