import { getTranslation, wordlistToUILang, type Translations } from '../i18n';
import { elements } from '../core/dom';
import { loadWordlist } from './wordlist';
import { updateDisplay } from '../components/display';

export let currentTranslations: Translations = getTranslation('en');

export function initLanguage(): string {
  const savedLanguage = localStorage.getItem('language') || 'english';
  elements.languageSelect.value = savedLanguage;
  return savedLanguage;
}

export async function changeLanguage(): Promise<void> {
  const newLanguage = elements.languageSelect.value;
  localStorage.setItem('language', newLanguage);
  
  // Update UI language based on wordlist selection
  const uiLang = wordlistToUILang[newLanguage] || 'en';
  currentTranslations = getTranslation(uiLang);
  
  await loadWordlist(newLanguage);
  updateUITranslations();
}

export function setTranslations(translations: Translations): void {
  currentTranslations = translations;
}

export function updateUITranslations(): void {
  elements.title.textContent = currentTranslations.title;
  elements.subtitle.textContent = currentTranslations.subtitle;
  elements.wordlistLabel.textContent = currentTranslations.languageLabel;
  elements.wordLabel.textContent = currentTranslations.selectedWord;
  elements.resetButton.textContent = currentTranslations.resetButton;
  elements.binaryLabel.textContent = currentTranslations.binaryPattern;
  elements.infoText.textContent = currentTranslations.infoText;
  elements.privacyTooltip.textContent = currentTranslations.privacyTooltip;
  updateDisplay();
}
