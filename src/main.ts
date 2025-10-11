import { getTranslation, wordlistToUILang } from './i18n';
import { resetBoxes } from './core/state';
import { loadWordlist } from './services/wordlist';
import { initTheme, toggleTheme } from './services/theme';
import { initLanguage, setupLanguageToggle, setTranslations, updateUITranslations } from './services/language';
import { createGrid } from './components/grid';
import { updateDisplay } from './components/display';
import { elements } from './core/dom';

function handleReset(): void {
  resetBoxes();
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

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    const target = e.target as HTMLElement;

    // Press 'R' to reset (but not when dropdown is open or in input fields)
    if (e.key === 'r' || e.key === 'R') {
      const isDropdownOpen = elements.languageDropdown.classList.contains('open');
      if (!isDropdownOpen) {
        e.preventDefault();
        handleReset();
        return;
      }
    }

    // Close language dropdown with Escape key
    if (e.key === 'Escape' && elements.languageDropdown.classList.contains('open')) {
      e.preventDefault();
      elements.languageDropdown.classList.remove('open');
      elements.languageToggle.setAttribute('aria-expanded', 'false');
      elements.languageToggle.focus();
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
