import { getTranslation, wordlistToUILang } from './i18n';
import { resetBoxes } from './core/state';
import { loadWordlist } from './services/wordlist';
import { initTheme, toggleTheme } from './services/theme';
import { initLanguage, changeLanguage, setTranslations, updateUITranslations } from './services/language';
import { createGrid } from './components/grid';
import { updateDisplay } from './components/display';
import { elements } from './core/dom';

function handleReset(): void {
  resetBoxes();
  updateDisplay();
}

async function init(): Promise<void> {
  initTheme();
  const savedLanguage = initLanguage();
 
  const uiLang = wordlistToUILang[savedLanguage] || 'en';
  setTranslations(getTranslation(uiLang));
 
  await loadWordlist(savedLanguage);
  createGrid();
  updateUITranslations();
 
  elements.resetButton.addEventListener('click', handleReset);
  elements.themeToggle.addEventListener('click', toggleTheme);
  elements.languageSelect.addEventListener('change', changeLanguage);
}

init();
