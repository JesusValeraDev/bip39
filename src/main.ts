import { getTranslation, wordlistToUILang } from './i18n';
import { resetBoxes } from './core/state';
import { loadWordlist } from './services/wordlist';
import { initTheme, toggleTheme } from './services/theme';
import { initLanguage, setupLanguageToggle, setTranslations, updateUITranslations } from './services/language';
import { createGrid } from './components/grid';
import { updateDisplay } from './components/display';
import { setupWordInput, clearWordInput } from './components/wordInput';
import { elements } from './core/dom';

function handleReset(): void {
  resetBoxes();
  clearWordInput();
  updateDisplay();
}

function setupLearnModal(): void {
  const learnBtn = document.getElementById('learn-more-btn');
  const modal = document.getElementById('learn-modal');
  const modalClose = document.getElementById('modal-close');
  const modalOverlay = modal?.querySelector('.modal-overlay');

  if (!learnBtn || !modal || !modalClose) return;

  const openModal = () => {
    modal.removeAttribute('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    modal.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      modal.setAttribute('hidden', '');
      document.body.style.overflow = ''; // Restore scrolling
    }, 300); // Match CSS transition duration
  };

  learnBtn.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', closeModal);

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      e.preventDefault();
      closeModal();
    }
  });
}

async function init(): Promise<void> {
  initTheme();
  const savedLanguage = initLanguage();

  const uiLang = wordlistToUILang[savedLanguage] || 'en';
  setTranslations(getTranslation(uiLang));

  await loadWordlist(savedLanguage);
  createGrid();
  setupWordInput();
  updateUITranslations();

  // Inject git commit hash into footer
  const gitHashElement = document.getElementById('git-hash');
  if (gitHashElement) {
    gitHashElement.textContent = import.meta.env.VITE_GIT_HASH || 'dev';
  }

  elements.resetButton.addEventListener('click', handleReset);
  elements.themeToggle.addEventListener('click', toggleTheme);
  setupLanguageToggle();
  setupLearnModal();
}

init().catch((error) => {
  console.error('Failed to initialize application:', error);
});
