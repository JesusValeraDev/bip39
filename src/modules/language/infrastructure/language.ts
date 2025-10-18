import { getTranslation, type Translations } from '../../i18n';
import { elements } from '../../bip39';
import { loadWordlist } from '../../bip39';
import { updateDisplay } from '../../display';
import { saveLanguage, isLanguageActive, getUILanguageCode } from '../domain/languageHelpers';

export let currentTranslations: Translations = getTranslation('en');
export let currentLanguage = 'english';

const languageFlagsSVG: Record<string, string> = {
  english: `<svg class="flag-icon" width="28" height="28"><use href="/sprite.svg#flag-uk"/></svg>`,
  spanish: `<svg class="flag-icon" width="28" height="28"><use href="/sprite.svg#flag-es"/></svg>`,
  french: `<svg class="flag-icon" width="28" height="28"><use href="/sprite.svg#flag-fr"/></svg>`,
  italian: `<svg class="flag-icon" width="28" height="28"><use href="/sprite.svg#flag-it"/></svg>`,
  portuguese: `<svg class="flag-icon" width="28" height="28"><use href="/sprite.svg#flag-pt"/></svg>`,
  czech: `<svg class="flag-icon" width="28" height="28"><use href="/sprite.svg#flag-cz"/></svg>`,
  japanese: `<svg class="flag-icon" width="28" height="28"><use href="/sprite.svg#flag-jp"/></svg>`,
  korean: `<svg class="flag-icon" width="28" height="28"><use href="/sprite.svg#flag-kr"/></svg>`,
  chinese_simplified: `<svg class="flag-icon" width="28" height="28"><use href="/sprite.svg#flag-cn"/></svg>`,
  chinese_traditional: `<svg class="flag-icon" width="28" height="28"><use href="/sprite.svg#flag-tw"/></svg>`,
};

const browserLangToWordlist: Record<string, string> = {
  en: 'english',
  es: 'spanish',
  fr: 'french',
  it: 'italian',
  pt: 'portuguese',
  cs: 'czech',
  ja: 'japanese',
  ko: 'korean',
  'zh-Hans': 'chinese_simplified',
  'zh-CN': 'chinese_simplified',
  'zh-SG': 'chinese_simplified',
  'zh-Hant': 'chinese_traditional',
  'zh-TW': 'chinese_traditional',
  'zh-HK': 'chinese_traditional',
  'zh-MO': 'chinese_traditional',
  zh: 'chinese_simplified',
};

function getBrowserLanguage(): string {
  if (typeof navigator === 'undefined') {
    return 'english';
  }

  // Get browser language (e.g., "en-US", "es", "zh-CN")
  const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage;

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
  currentLanguage = defaultLanguage;

  elements.currentFlag.innerHTML = languageFlagsSVG[defaultLanguage] || languageFlagsSVG['english'];

  updateActiveLanguageOption();

  return defaultLanguage;
}

export async function changeLanguage(newLanguage: string): Promise<void> {
  currentLanguage = newLanguage;
  saveLanguage(newLanguage);

  elements.currentFlag.innerHTML = languageFlagsSVG[newLanguage] || languageFlagsSVG['english'];

  const uiLang = getUILanguageCode(newLanguage);
  currentTranslations = getTranslation(uiLang);

  updateActiveLanguageOption();

  await loadWordlist(newLanguage);
  updateUITranslations();
}

function updateActiveLanguageOption(): void {
  const options = elements.languageDropdown.querySelectorAll('.language-option');
  options.forEach(option => {
    const btn = option as HTMLButtonElement;
    if (isLanguageActive(btn.dataset.lang || '', currentLanguage)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

export function setupLanguageToggle(): void {
  let isOpen = false;

  // Toggle dropdown
  elements.languageToggle.addEventListener('click', e => {
    e.stopPropagation();
    isOpen = !isOpen;
    elements.languageDropdown.classList.toggle('open', isOpen);
    elements.languageToggle.setAttribute('aria-expanded', isOpen.toString());
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', e => {
    if (isOpen && !elements.languageDropdown.contains(e.target as Node)) {
      isOpen = false;
      elements.languageDropdown.classList.remove('open');
      elements.languageToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Handle language option clicks
  const options = elements.languageDropdown.querySelectorAll('.language-option');
  options.forEach(option => {
    option.addEventListener('click', () => {
      const btn = option as HTMLButtonElement;
      const lang = btn.dataset.lang;
      if (lang) {
        void changeLanguage(lang).then(() => {
          // Close dropdown
          isOpen = false;
          elements.languageDropdown.classList.remove('open');
          elements.languageToggle.setAttribute('aria-expanded', 'false');
        });
      }
    });
  });

  elements.languageToggle.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) {
      isOpen = false;
      elements.languageDropdown.classList.remove('open');
      elements.languageToggle.setAttribute('aria-expanded', 'false');
      elements.languageToggle.focus();
    }
  });
}

export function setTranslations(translations: Translations): void {
  currentTranslations = translations;
}

function updateBasicUITranslations(): void {
  elements.title.textContent = currentTranslations.title;
  elements.indexLabel.textContent = currentTranslations.index;
  elements.resetButton.textContent = currentTranslations.resetButton;
  elements.infoText.textContent = currentTranslations.infoText;
  elements.privacyTitle.textContent = currentTranslations.privacyTitle;
  elements.privacyText.textContent = currentTranslations.privacyTooltip;
  elements.themeToggle.title = currentTranslations.toggleTheme;
  elements.languageToggle.title = currentTranslations.languageLabel;
  elements.helpIconTitle.textContent = currentTranslations.helpIconLabel;
}

function updateWordInputTranslations(): void {
  elements.wordInputLabel.textContent = currentTranslations.wordInputLabel;
  elements.wordInput.placeholder = currentTranslations.wordInputPlaceholder;
}

function updateModalTranslations(): void {
  elements.modalTitle.textContent = currentTranslations.modalTitle;

  updateModalStep1Translations();
  updateModalStep2Translations();
  updateModalStep3Translations();
  updateModalStep4Translations();
  updateModalWarningTranslations();
  updateModalWhyTranslations();
}

function updateModalStep1Translations(): void {
  elements.modalStep1Title.textContent = currentTranslations.modalStep1Title;
  elements.modalStep1Text.textContent = currentTranslations.modalStep1Text;

  elements.modalStep1WordGrid.innerHTML = '';
  currentTranslations.modalStep1Words.forEach(word => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'word-example';
    wordSpan.textContent = word;
    elements.modalStep1WordGrid.appendChild(wordSpan);
  });
}

function updateModalStep2Translations(): void {
  elements.modalStep2Title.textContent = currentTranslations.modalStep2Title;
  elements.modalStep2Text.textContent = currentTranslations.modalStep2Text;
  elements.modalStep2Word1.textContent = currentTranslations.modalStep1Words[0];
  elements.modalStep2Word2.textContent = currentTranslations.modalStep1Words[1];
  elements.modalStep2Entropy.textContent = currentTranslations.modalStep2Entropy;
}

function updateModalStep3Translations(): void {
  elements.modalStep3Title.textContent = currentTranslations.modalStep3Title;
  elements.modalStep3Text.textContent = currentTranslations.modalStep3Text;
  elements.modalStep3MasterSeed.textContent = currentTranslations.modalStep3MasterSeed;
  elements.modalStep3BitValue.textContent = currentTranslations.modalStep3BitValue;
}

function updateModalStep4Translations(): void {
  elements.modalStep4Title.textContent = currentTranslations.modalStep4Title;
  elements.modalStep4Text.textContent = currentTranslations.modalStep4Text;
  elements.modalStep4PrivateKey.textContent = currentTranslations.modalStep4PrivateKey;
  elements.modalStep4PrivateKey1.textContent = currentTranslations.modalStep4PrivateKey1;
  elements.modalStep4PrivateKey2.textContent = currentTranslations.modalStep4PrivateKey2;
  elements.modalStep4PrivateKey3.textContent = currentTranslations.modalStep4PrivateKey3;
  elements.modalStep4BitSize1.textContent = currentTranslations.modalStep4BitSize;
  elements.modalStep4BitSize2.textContent = currentTranslations.modalStep4BitSize;
  elements.modalStep4BitSize3.textContent = currentTranslations.modalStep4BitSize;
  elements.modalStep4PublicKey.textContent = currentTranslations.modalStep4PublicKey;
  elements.modalStep4Address.textContent = currentTranslations.modalStep4Address;
}

function updateModalWarningTranslations(): void {
  elements.modalWarningTitle.textContent = currentTranslations.modalWarningTitle;
  elements.modalWarningText.textContent = currentTranslations.modalWarningText;
  elements.modalWarningItem1.textContent = currentTranslations.modalWarningItem1;
  elements.modalWarningItem2.textContent = currentTranslations.modalWarningItem2;
  elements.modalWarningItem3.textContent = currentTranslations.modalWarningItem3;
  elements.modalWarningItem4.textContent = currentTranslations.modalWarningItem4;
}

function updateModalWhyTranslations(): void {
  elements.modalWhyTitle.textContent = currentTranslations.modalWhyBIP39Title;
  elements.modalWhyText.textContent = currentTranslations.modalWhyBIP39Text;

  elements.modalWhyLink.innerHTML = `
    <svg width="18" height="18" style="display: inline-block">
      <use href="/sprite.svg#icon-lightbulb"/>
    </svg>
    ${currentTranslations.modalWhyBIP39Link}
  `;
}

export function updateUITranslations(): void {
  updateBasicUITranslations();
  updateWordInputTranslations();
  updateModalTranslations();

  updateDisplay();
}
