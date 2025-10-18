import { state } from '../../bip39';
import { elements } from '../../bip39';
import { getAllDisplayData } from '../application/displayService';

export function updateDisplay(): void {
  const displayData = getAllDisplayData(state.boxes);

  updateBoxStates(displayData.boxes);
  updateBinaryDisplay(displayData.binary);
  updateWordDisplay(displayData.word);
  syncWordInputFromBoxes();
}

// Callback for syncing word input (set by wordInput module to avoid circular dependency)
let syncWordInputCallback: (() => void) | null = null;
let announcementTimeout: NodeJS.Timeout | null = null;

export function setSyncWordInputCallback(callback: () => void): void {
  syncWordInputCallback = callback;
}

function syncWordInputFromBoxes(): void {
  if (syncWordInputCallback) {
    syncWordInputCallback();
  }
}

function updateBoxStates(boxesData: Array<{ isActive: boolean; isDisabled: boolean; ariaPressed: string }>): void {
  const boxElements = elements.grid.querySelectorAll('.box');

  boxElements.forEach((box, index) => {
    const htmlBox = box as HTMLButtonElement;
    const data = boxesData[index];

    // Update active state
    htmlBox.classList.toggle('active', data.isActive);
    htmlBox.setAttribute('aria-pressed', data.ariaPressed);

    // Update disabled state
    htmlBox.classList.toggle('disabled', data.isDisabled);
    htmlBox.dataset.isDisabled = data.isDisabled.toString();
    htmlBox.setAttribute('aria-disabled', data.isDisabled.toString());
  });
}

function updateBinaryDisplay(binaryData: { binaryString: string }): void {
  elements.binary.textContent = binaryData.binaryString;
}

function updateWordDisplay(wordData: { indexText: string; announcement: string }): void {
  elements.index.textContent = wordData.indexText;
  announceToScreenReader(wordData.announcement);
}

function announceToScreenReader(message: string): void {
  const announcer = document.getElementById('sr-announcements');
  if (announcer) {
    // Clear existing timeout
    if (announcementTimeout) {
      clearTimeout(announcementTimeout);
    }

    announcer.textContent = message;

    // Clear after a short delay to allow for new announcements
    announcementTimeout = setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  }
}
