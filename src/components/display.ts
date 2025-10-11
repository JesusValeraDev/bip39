import { state, calculateBinaryValue, getBinaryString } from '../core/state';
import { elements } from '../core/dom';
import { currentTranslations } from '../services/language';
import { getWord } from '../services/wordlist';

export function updateDisplay(): void {

  const boxElements = elements.grid.querySelectorAll('.box');

  // Check if the first box (2048) is active
  const is2048Active = state.boxes[0];

  // Check if any other box is active
  const isAnyOtherBoxActive = state.boxes.slice(1).some(box => box);

  boxElements.forEach((box, index) => {
    const isActive = state.boxes[index];
    const htmlBox = box as HTMLButtonElement;

    // Update active state
    if (isActive) {
      htmlBox.classList.add('active');
      htmlBox.setAttribute('aria-pressed', 'true');
    } else {
      htmlBox.classList.remove('active');
      htmlBox.setAttribute('aria-pressed', 'false');
    }

    // Disable/enable logic
    if (index === 0) {
      // First box (2048): disable if any other box is active
      if (isAnyOtherBoxActive && !isActive) {
        htmlBox.disabled = true;
        htmlBox.classList.add('disabled');
        htmlBox.setAttribute('aria-disabled', 'true');
      } else {
        htmlBox.disabled = false;
        htmlBox.classList.remove('disabled');
        htmlBox.setAttribute('aria-disabled', 'false');
      }
    } else {
      // Other boxes: disable if 2048 is active
      if (is2048Active && !isActive) {
        htmlBox.disabled = true;
        htmlBox.classList.add('disabled');
        htmlBox.setAttribute('aria-disabled', 'true');
      } else {
        htmlBox.disabled = false;
        htmlBox.classList.remove('disabled');
        htmlBox.setAttribute('aria-disabled', 'false');
      }
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
