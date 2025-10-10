import { getTranslation, wordlistToUILang, type Translations } from './i18n';

// Load the BIP39 wordlist
let wordlist: string[] = [];
let currentLanguage: string = 'english';
let currentTranslations: Translations = getTranslation('en');

async function loadWordlist(language: string = 'english'): Promise<void> {
  try {
    currentLanguage = language;
    const response = await fetch(`/doc/${language}.txt`);
    const text = await response.text();
    wordlist = text.trim().split('\n').map(word => word.trim());
  } catch (error) {
    // Failed to load wordlist
  }
}

// State management
const boxes: boolean[] = new Array(12).fill(false);

// DOM elements
const gridElement = document.getElementById('grid') as HTMLDivElement;
const wordElement = document.getElementById('word') as HTMLDivElement;
const indexElement = document.getElementById('index') as HTMLSpanElement;
const binaryElement = document.getElementById('binary') as HTMLElement;
const resetButton = document.getElementById('reset') as HTMLButtonElement;
const themeToggle = document.getElementById('theme-toggle') as HTMLButtonElement;
const languageSelect = document.getElementById('language') as HTMLSelectElement;

// Translation elements
const titleElement = document.getElementById('title') as HTMLHeadingElement;
const subtitleElement = document.getElementById('subtitle') as HTMLParagraphElement;
const wordlistLabelElement = document.getElementById('wordlist-label') as HTMLLabelElement;
const wordLabelElement = document.getElementById('word-label') as HTMLDivElement;
const binaryLabelElement = document.getElementById('binary-label') as HTMLSpanElement;
const infoTextElement = document.getElementById('info-text') as HTMLParagraphElement;
const privacyTooltipElement = document.getElementById('privacy-tooltip') as HTMLDivElement;

// Create the grid
function createGrid(): void {
  gridElement.innerHTML = '';
  
  for (let i = 0; i < 12; i++) {
    const box = document.createElement('div');
    box.className = 'box';
    box.dataset.index = i.toString();
    
    // Add bit label showing the power of 2 value
    const label = document.createElement('span');
    label.className = 'bit-label';
    const bitValue = Math.pow(2, 11 - i);
    label.textContent = bitValue.toString();
    box.appendChild(label);
    
    box.addEventListener('click', () => toggleBox(i));
    gridElement.appendChild(box);
  }
  
  updateDisplay();
}

// Toggle a box
function toggleBox(index: number): void {
  boxes[index] = !boxes[index];
  updateDisplay();
}

// Calculate the word index from the binary pattern
function calculateIndex(): number {
  let value = 0;
  for (let i = 0; i < 12; i++) {
    if (boxes[i]) {
      value += Math.pow(2, 11 - i);
    }
  }
  // Map binary value to word: 0->1, 1->2, ..., 2047->2048, 2048+->wrap
  // Array index is value % 2048
  return value % 2048;
}

// Update the display
function updateDisplay(): void {
  // Update box states
  const boxElements = gridElement.querySelectorAll('.box');
  boxElements.forEach((box, index) => {
    if (boxes[index]) {
      box.classList.add('active');
    } else {
      box.classList.remove('active');
    }
  });
  
  // Calculate the binary value
  let binaryValue = 0;
  for (let i = 0; i < 12; i++) {
    if (boxes[i]) {
      binaryValue += Math.pow(2, 11 - i);
    }
  }
  
  // Update binary display
  const binaryString = boxes.map(b => b ? '1' : '0').join('');
  binaryElement.textContent = binaryString;
  
  // Update word and index
  if (binaryValue === 0) {
    // No boxes selected
    wordElement.textContent = currentTranslations.pickPattern;
    indexElement.textContent = '-';
  } else if (binaryValue > 2048) {
    // Out of range
    wordElement.textContent = currentTranslations.outOfRange;
    indexElement.textContent = `${binaryValue}`;
  } else {
    // Valid range: 1-2048
    const arrayIndex = binaryValue - 1; // Convert to 0-indexed array
    const displayIndex = binaryValue;
    if (wordlist.length > 0 && wordlist[arrayIndex]) {
      wordElement.textContent = wordlist[arrayIndex];
    } else {
      wordElement.textContent = 'N/A';
    }
    indexElement.textContent = displayIndex.toString();
  }
}

// Update UI translations
function updateUITranslations(): void {
  titleElement.textContent = currentTranslations.title;
  subtitleElement.textContent = currentTranslations.subtitle;
  wordlistLabelElement.textContent = currentTranslations.languageLabel;
  wordLabelElement.textContent = currentTranslations.selectedWord;
  resetButton.textContent = currentTranslations.resetButton;
  binaryLabelElement.textContent = currentTranslations.binaryPattern;
  infoTextElement.textContent = currentTranslations.infoText;
  privacyTooltipElement.textContent = currentTranslations.privacyTooltip;
  updateDisplay(); // Refresh word display with new translations
}

// Reset all boxes
function reset(): void {
  boxes.fill(false);
  updateDisplay();
}

// Theme management
function initTheme(): void {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme(): void {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Language management
function initLanguage(): string {
  const savedLanguage = localStorage.getItem('language') || 'english';
  languageSelect.value = savedLanguage;
  return savedLanguage;
}

async function changeLanguage(): Promise<void> {
  const newLanguage = languageSelect.value;
  localStorage.setItem('language', newLanguage);
  
  // Update UI language based on wordlist selection
  const uiLang = wordlistToUILang[newLanguage] || 'en';
  currentTranslations = getTranslation(uiLang);
  
  await loadWordlist(newLanguage);
  updateUITranslations();
}

// Initialize the app
async function init(): Promise<void> {
  initTheme();
  const savedLanguage = initLanguage();
  
  // Set UI language based on saved wordlist language
  const uiLang = wordlistToUILang[savedLanguage] || 'en';
  currentTranslations = getTranslation(uiLang);
  
  await loadWordlist(savedLanguage);
  createGrid();
  updateUITranslations();
  resetButton.addEventListener('click', reset);
  themeToggle.addEventListener('click', toggleTheme);
  languageSelect.addEventListener('change', changeLanguage);
}

// Start the app
init();

