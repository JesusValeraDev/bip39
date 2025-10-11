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

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    const target = e.target as HTMLElement;
    const isInSelect = target.tagName === 'SELECT';

    // Press 'R' to reset
    if (!isInSelect && (e.key === 'r' || e.key === 'R')) {
      e.preventDefault();
      handleReset();
      return;
    }

    // Arrow key navigation between grid boxes
    if (target.classList.contains('box') && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      e.preventDefault();
      const currentIndex = parseInt(target.dataset.index || '0');
      let nextIndex: number;

      if (e.key === 'ArrowLeft') {
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) nextIndex = 11; // Wrap to last box
      } else {
        nextIndex = currentIndex + 1;
        if (nextIndex > 11) nextIndex = 0; // Wrap to first box
      }

      const boxes = elements.grid.querySelectorAll('.box');
      const nextBox = boxes[nextIndex] as HTMLElement;
      if (nextBox) {
        nextBox.focus();
      }
    }
  });
}

init();
