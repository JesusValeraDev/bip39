import { getTranslation, wordlistToUILang, type Translations } from '../i18n';
import { elements } from '../core/dom';
import { loadWordlist } from './wordlist';
import { updateDisplay } from '../components/display';

export let currentTranslations: Translations = getTranslation('en');
export let currentLanguage = 'english';

// SVG flags for each language
const languageFlagsSVG: Record<string, string> = {
  'english': `<svg class="flag-icon" width="28" height="28" viewBox="0 0 28 28">
    <defs><clipPath id="uk-circle"><circle cx="14" cy="14" r="14"/></clipPath></defs>
    <g clip-path="url(#uk-circle)">
      <rect width="28" height="28" fill="#012169"/>
      <path d="M 0 0 L 28 28 M 28 0 L 0 28" stroke="#FFF" stroke-width="5.6"/>
      <path d="M 0 0 L 28 28 M 28 0 L 0 28" stroke="#C8102E" stroke-width="3.36"/>
      <path d="M 14 0 V 28 M 0 14 H 28" stroke="#FFF" stroke-width="9.33"/>
      <path d="M 14 0 V 28 M 0 14 H 28" stroke="#C8102E" stroke-width="5.6"/>
    </g>
  </svg>`,
  'spanish': `<svg class="flag-icon" width="28" height="28" viewBox="0 0 28 28">
    <defs><clipPath id="es-circle-btn"><circle cx="14" cy="14" r="14"/></clipPath></defs>
    <g clip-path="url(#es-circle-btn)">
      <rect width="28" height="7" fill="#AA151B"/>
      <rect y="7" width="28" height="14" fill="#F1BF00"/>
      <rect y="21" width="28" height="7" fill="#AA151B"/>
    </g>
  </svg>`,
  'french': `<svg class="flag-icon" width="28" height="28" viewBox="0 0 28 28">
    <defs><clipPath id="fr-circle-btn"><circle cx="14" cy="14" r="14"/></clipPath></defs>
    <g clip-path="url(#fr-circle-btn)">
      <rect width="9.33" height="28" fill="#002395"/>
      <rect x="9.33" width="9.33" height="28" fill="#FFF"/>
      <rect x="18.67" width="9.33" height="28" fill="#ED2939"/>
    </g>
  </svg>`,
  'italian': `<svg class="flag-icon" width="28" height="28" viewBox="0 0 28 28">
    <defs><clipPath id="it-circle-btn"><circle cx="14" cy="14" r="14"/></clipPath></defs>
    <g clip-path="url(#it-circle-btn)">
      <rect width="9.33" height="28" fill="#009246"/>
      <rect x="9.33" width="9.33" height="28" fill="#FFF"/>
      <rect x="18.67" width="9.33" height="28" fill="#CE2B37"/>
    </g>
  </svg>`,
  'portuguese': `<svg class="flag-icon" width="28" height="28" viewBox="0 0 28 28">
    <defs><clipPath id="pt-circle-btn"><circle cx="14" cy="14" r="14"/></clipPath></defs>
    <g clip-path="url(#pt-circle-btn)">
      <rect width="11.2" height="28" fill="#006600"/>
      <rect x="11.2" width="16.8" height="28" fill="#FF0000"/>
      <circle cx="11.2" cy="14" r="4.67" fill="#FFFF00"/>
      <circle cx="11.2" cy="14" r="3.06" fill="#FF0000"/>
      <circle cx="11.2" cy="14" r="1.93" fill="#FFF"/>
    </g>
  </svg>`,
  'czech': `<svg class="flag-icon" width="28" height="28" viewBox="0 0 28 28">
    <defs><clipPath id="cz-circle-btn"><circle cx="14" cy="14" r="14"/></clipPath></defs>
    <g clip-path="url(#cz-circle-btn)">
      <rect width="28" height="14" fill="#FFF"/>
      <rect y="14" width="28" height="14" fill="#D7141A"/>
      <path d="M 0 0 L 14 14 L 0 28 Z" fill="#11457E"/>
    </g>
  </svg>`,
  'japanese': `<svg class="flag-icon" width="28" height="28" viewBox="0 0 28 28">
    <defs><clipPath id="jp-circle-btn"><circle cx="14" cy="14" r="14"/></clipPath></defs>
    <g clip-path="url(#jp-circle-btn)">
      <rect width="28" height="28" fill="#FFF"/>
      <circle cx="14" cy="14" r="5.6" fill="#BC002D"/>
    </g>
  </svg>`,
  'korean': `<svg class="flag-icon" width="28" height="28" viewBox="0 0 28 28">
    <defs><clipPath id="kr-circle-btn"><circle cx="14" cy="14" r="14"/></clipPath></defs>
    <g clip-path="url(#kr-circle-btn)">
      <rect width="28" height="28" fill="#FFF"/>
      <path d="M 9.33 14 A 4.67 4.67 0 0 1 18.67 14 Z" fill="#C60C30"/>
      <path d="M 18.67 14 A 4.67 4.67 0 0 1 9.33 14 Z" fill="#003478"/>
      <g stroke="#000" stroke-width="1.15" stroke-linecap="round">
        <!-- Superior derecha -->
        <line x1="18.4" y1="7" x2="21.9" y2="10.5"/>
        <line x1="19.45" y1="5.95" x2="22.95" y2="9.45"/>
        <line x1="17.35" y1="8.05" x2="20.85" y2="11.55"/>
        <!-- Inferior derecha -->
        <line x1="18.4" y1="21" x2="21.9" y2="17.5"/>
        <line x1="19.45" y1="22.05" x2="22.95" y2="18.55"/>
        <line x1="17.35" y1="19.95" x2="20.85" y2="16.45"/>
        <!-- Inferior izquierda -->
        <line x1="9.6" y1="21" x2="6.1" y2="17.5"/>
        <line x1="8.55" y1="22.05" x2="5.05" y2="18.55"/>
        <line x1="10.65" y1="19.95" x2="7.15" y2="16.45"/>
        <!-- Superior izquierda -->
        <line x1="9.6" y1="7" x2="6.1" y2="10.5"/>
        <line x1="8.55" y1="5.95" x2="5.05" y2="9.45"/>
        <line x1="10.65" y1="8.05" x2="7.15" y2="11.55"/>
      </g>
    </g>
  </svg>`,
  'chinese_simplified': `<svg class="flag-icon" width="28" height="28" viewBox="0 0 28 28">
    <defs><clipPath id="cn-circle-btn"><circle cx="14" cy="14" r="14"/></clipPath></defs>
    <g clip-path="url(#cn-circle-btn)">
      <rect width="28" height="28" fill="#DE2910"/>
      <polygon points="5.6,4.9 6.825,8.225 10.325,8.225 7.525,10.15 8.75,13.475 5.6,11.55 2.45,13.475 3.675,10.15 0.875,8.225 4.375,8.225" fill="#FFDE00"/>
    </g>
  </svg>`,
  'chinese_traditional': `<svg class="flag-icon" width="28" height="28" viewBox="0 0 28 28">
    <defs><clipPath id="tw-circle-btn"><circle cx="14" cy="14" r="14"/></clipPath></defs>
    <g clip-path="url(#tw-circle-btn)">
      <rect width="28" height="28" fill="#FE0000"/>
      <rect width="14" height="14" fill="#000095"/>
      <polygon points="7,2.8 8.05,5.95 11.375,5.95 8.75,7.875 9.8,11.025 7,9.1 4.2,11.025 5.25,7.875 2.625,5.95 5.95,5.95" fill="#FFF"/>
    </g>
  </svg>`,
};

const browserLangToWordlist: Record<string, string> = {
  'en': 'english',
  'es': 'spanish',
  'fr': 'french',
  'it': 'italian',
  'pt': 'portuguese',
  'cs': 'czech',
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
  currentLanguage = defaultLanguage;
  
  // Update flag icon with SVG
  elements.currentFlag.innerHTML = languageFlagsSVG[defaultLanguage] || languageFlagsSVG['english'];
  
  // Update active state in dropdown
  updateActiveLanguageOption();
  
  return defaultLanguage;
}

export async function changeLanguage(newLanguage: string): Promise<void> {
  currentLanguage = newLanguage;
  localStorage.setItem('language', newLanguage);
  
  // Update flag icon with SVG
  elements.currentFlag.innerHTML = languageFlagsSVG[newLanguage] || languageFlagsSVG['english'];
  
  // Update UI language based on wordlist selection
  const uiLang = wordlistToUILang[newLanguage] || 'en';
  currentTranslations = getTranslation(uiLang);
  
  // Update active state in dropdown
  updateActiveLanguageOption();
  
  await loadWordlist(newLanguage);
  updateUITranslations();
}

function updateActiveLanguageOption(): void {
  const options = elements.languageDropdown.querySelectorAll('.language-option');
  options.forEach(option => {
    const btn = option as HTMLButtonElement;
    if (btn.dataset.lang === currentLanguage) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

export function setupLanguageToggle(): void {
  let isOpen = false;

  // Toggle dropdown
  elements.languageToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen = !isOpen;
    elements.languageDropdown.classList.toggle('open', isOpen);
    elements.languageToggle.setAttribute('aria-expanded', isOpen.toString());
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (isOpen && !elements.languageDropdown.contains(e.target as Node)) {
      isOpen = false;
      elements.languageDropdown.classList.remove('open');
      elements.languageToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Handle language option clicks
  const options = elements.languageDropdown.querySelectorAll('.language-option');
  options.forEach(option => {
    option.addEventListener('click', async () => {
      const btn = option as HTMLButtonElement;
      const lang = btn.dataset.lang;
      if (lang) {
        await changeLanguage(lang);
        // Close dropdown
        isOpen = false;
        elements.languageDropdown.classList.remove('open');
        elements.languageToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Keyboard navigation
  elements.languageToggle.addEventListener('keydown', (e) => {
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

export function updateUITranslations(): void {
  elements.title.textContent = currentTranslations.title;
  elements.subtitle.textContent = currentTranslations.subtitle;
  elements.wordLabel.textContent = currentTranslations.selectedWord;
  elements.indexLabel.textContent = currentTranslations.index;
  elements.resetButton.textContent = currentTranslations.resetButton;
  elements.infoText.textContent = currentTranslations.infoText;
  elements.privacyTooltip.textContent = currentTranslations.privacyTooltip;
  elements.themeToggle.title = currentTranslations.toggleTheme;
  elements.languageToggle.title = currentTranslations.languageLabel;
  updateDisplay();
}
