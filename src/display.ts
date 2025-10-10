import { state, calculateBinaryValue, getBinaryString } from './state';
import { elements } from './dom';
import { currentTranslations } from './language';
import { getWord } from './wordlist';

export function updateDisplay(): void {
  const boxElements = elements.grid.querySelectorAll('.box');
  boxElements.forEach((box, index) => {
    if (state.boxes[index]) {
      box.classList.add('active');
    } else {
      box.classList.remove('active');
    }
  });

  const binaryValue = calculateBinaryValue();

  // Update binary display
  const binaryString = getBinaryString();
  elements.binary.textContent = binaryString;

  // Update word and index
  if (binaryValue === 0) {
    // No boxes selected
    elements.word.textContent = currentTranslations.pickPattern;
    elements.index.textContent = '-';
  } else if (binaryValue > 2048) {
    // Out of range
    elements.word.textContent = currentTranslations.outOfRange;
    elements.index.textContent = `${binaryValue}`;
  } else {
    // Valid range: 1-2048
    const arrayIndex = binaryValue - 1; // Convert to 0-indexed array
    const displayIndex = binaryValue;
    elements.word.textContent = getWord(arrayIndex);
    elements.index.textContent = displayIndex.toString();
  }
}
