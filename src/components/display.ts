import { state, calculateBinaryValue, getBinaryString } from '../core/state';
import { elements } from '../core/dom';
import { currentTranslations } from '../services/language';
import { getWord } from '../services/wordlist';

export function updateDisplay(): void {
  updateBoxStates();
  updateBinaryDisplay();
  updateWordDisplay();
  syncWordInputFromBoxes();
}

function syncWordInputFromBoxes(): void {
  // Import dynamically to avoid circular dependency
  import('./wordInput').then(({ syncWordInputFromState }) => {
    syncWordInputFromState();
  });
}

function updateBoxStates(): void {
  const boxElements = elements.grid.querySelectorAll('.box');
  const is2048Active = state.boxes[0];
  const isAnyOtherBoxActive = state.boxes.slice(1).some(box => box);

  boxElements.forEach((box, index) => {
    const isActive = state.boxes[index];
    const htmlBox = box as HTMLButtonElement;

    updateBoxActiveState(htmlBox, isActive);
    updateBoxDisabledState(htmlBox, index, isActive, is2048Active, isAnyOtherBoxActive);
  });
}

function updateBoxActiveState(box: HTMLButtonElement, isActive: boolean): void {
  if (isActive) {
    box.classList.add('active');
    box.setAttribute('aria-pressed', 'true');
  } else {
    box.classList.remove('active');
    box.setAttribute('aria-pressed', 'false');
  }
}

function updateBoxDisabledState(
  box: HTMLButtonElement,
  index: number,
  isActive: boolean,
  is2048Active: boolean,
  isAnyOtherBoxActive: boolean
): void {
  let shouldDisable = false;

  if (index === 0) {
    // First box (2048): disable if any other box is active
    shouldDisable = isAnyOtherBoxActive && !isActive;
  } else {
    // Other boxes: disable if 2048 is active
    shouldDisable = is2048Active && !isActive;
  }

  if (shouldDisable) {
    box.dataset.isDisabled = 'true';
    box.classList.add('disabled');
    box.setAttribute('aria-disabled', 'true');
  } else {
    box.dataset.isDisabled = 'false';
    box.classList.remove('disabled');
    box.setAttribute('aria-disabled', 'false');
  }
}

function updateBinaryDisplay(): void {
  elements.binary.textContent = getBinaryString();
}

function updateWordDisplay(): void {
  const binaryValue = calculateBinaryValue();
  let announcement = '';

  if (binaryValue === 0) {
    elements.index.textContent = '-';
    announcement = 'No pattern selected';
  } else if (binaryValue > 2048) {
    // Safety net: Should be unreachable due to disabled box logic,
    // but kept for defensive programming (e.g., direct state manipulation, bugs)
    elements.index.textContent = `${binaryValue}`;
    announcement = `Value ${binaryValue} is out of range. Maximum is 2048`;
  } else {
    elements.index.textContent = binaryValue.toString();
    const word = getWord(binaryValue - 1);
    announcement = `Word selected: ${word}, index ${binaryValue}`;
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
