import { getTranslation } from './modules/i18n';
import { resetBoxes, loadWordlist, elements, determineUILanguage, getGitHashOrDefault, validateModalElement, validateButtonElements, isEscapeKey, isModalOpen, getModalTransitionDuration } from './modules/bip39';
import { initTheme, toggleTheme } from './modules/theme';
import { initLanguage, setupLanguageToggle, setTranslations, updateUITranslations } from './modules/language';
import { createGrid } from './modules/grid';
import { updateDisplay } from './modules/display';
import { setupWordInput, clearWordInput } from './modules/wordInput';

function handleReset(): void {
  resetBoxes();
  clearWordInput();
  updateDisplay();
}

function openLearnModal(modal: HTMLElement): void {
  modal.removeAttribute('hidden');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeLearnModal(modal: HTMLElement): void {
  modal.setAttribute('aria-hidden', 'true');
  setTimeout(() => {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }, getModalTransitionDuration());
}

function setupModalEventListeners(
  learnBtn: HTMLElement,
  modal: HTMLElement,
  modalClose: HTMLElement,
  modalOverlay: Element | null
): void {
  learnBtn.addEventListener('click', () => openLearnModal(modal));
  modalClose.addEventListener('click', () => closeLearnModal(modal));
  modalOverlay?.addEventListener('click', () => closeLearnModal(modal));
}

function setupModalKeyboardHandler(modal: HTMLElement): void {
  document.addEventListener('keydown', (e) => {
    if (isEscapeKey(e.key) && isModalOpen(modal.getAttribute('aria-hidden'))) {
      e.preventDefault();
      closeLearnModal(modal);
    }
  });
}

function setupLearnModal(): void {
  const learnBtn = document.getElementById('learn-more-btn');
  const modal = document.getElementById('learn-modal');
  const modalClose = document.getElementById('modal-close');
  const modalOverlay = modal?.querySelector('.modal-overlay') ?? null;

  if (!validateButtonElements(learnBtn, modalClose) || !validateModalElement(modal)) return;

  setupModalEventListeners(learnBtn!, modal!, modalClose!, modalOverlay);
  setupModalKeyboardHandler(modal!);
}

async function init(): Promise<void> {
  initTheme();
  const savedLanguage = initLanguage();

  const uiLang = determineUILanguage(savedLanguage);
  setTranslations(getTranslation(uiLang));

  updateUITranslations();
  await loadWordlist(savedLanguage);
  createGrid();
  setupWordInput();

  // Inject git commit hash into footer
  const gitHashElement = document.getElementById('git-hash');
  if (gitHashElement) {
    gitHashElement.textContent = getGitHashOrDefault(import.meta.env.VITE_GIT_HASH);
  }

  elements.resetButton.addEventListener('click', handleReset);
  elements.themeToggle.addEventListener('click', toggleTheme);
  setupLanguageToggle();
  setupLearnModal();
}

init().catch((error) => {
  console.error('Failed to initialize application:', error);
});
