import { getTranslation, wordlistToUILang, type Translations } from '../i18n';
import { elements } from '../core/dom';
import { loadWordlist } from './wordlist';
import { updateDisplay } from '../components/display';

export let currentTranslations: Translations = getTranslation('en');

const browserLangToWordlist: Record<string, string> = {
  'en': 'english',
  'es': 'spanish',
  'fr': 'french',
  'cs': 'czech',
  'it': 'italian',
  'pt': 'portuguese',
  'ja': 'japanese',
  'ko': 'korean',
  'zh-Hans': 'chinese_simplified',
  'zh-CN': 'chinese_simplified',
  'zh-SG': 'chinese_simplified',
  'zh-Hant': 'chinese_traditional',
  'zh-TW': 'chinese_traditional',
  'zh-HK': 'chinese_traditional',
  'zh-MO': 'chinese_traditional',
  'zh': 'chinese_simplified', // Default Chinese to simplified
};

function getBrowserLanguage(): string {
  if (typeof navigator === 'undefined') {
    return 'english';
  }

  // Get browser language (e.g., "en-US", "es", "zh-CN")
  const browserLang = navigator.language || (navigator as any).userLanguage;

  if (!browserLang) {
    return 'english';
  }

  // Try exact match first (e.g., "zh-CN")
  if (browserLangToWordlist[browserLang]) {
    return browserLangToWordlist[browserLang];
  }

  // Try language code only (e.g., "en" from "en-US")
  const langCode = browserLang.split('-')[0];
  if (browserLangToWordlist[langCode]) {
    return browserLangToWordlist[langCode];
  }

  return 'english';
}

export function initLanguage(): string {
  const savedLanguage = localStorage.getItem('language');
  const defaultLanguage = savedLanguage || getBrowserLanguage();
  elements.languageSelect.value = defaultLanguage;
  return defaultLanguage;
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
  elements.indexLabel.textContent = currentTranslations.index;
  elements.resetButton.textContent = currentTranslations.resetButton;
  elements.binaryLabel.textContent = currentTranslations.binaryPattern;
  elements.infoText.textContent = currentTranslations.infoText;
  elements.privacyTooltip.textContent = currentTranslations.privacyTooltip;
  elements.themeToggle.title = currentTranslations.toggleTheme;
  updateDisplay();
}
