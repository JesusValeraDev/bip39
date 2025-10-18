import { toggleTheme as domainToggleTheme, getThemeToggleLabel, getAriaPressed } from '../domain/themeLogic';

export function initTheme(): void {
  const savedTheme = localStorage.getItem('theme');
  const theme = savedTheme || getOSTheme();
  
  setDocumentTheme(theme);
  updateThemeButtonState(theme);
  setupThemeListener(savedTheme);
}

function getOSTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
}

function setDocumentTheme(theme: string): void {
  document.documentElement.setAttribute('data-theme', theme);
}

function setupThemeListener(savedTheme: string | null): void {
  if (!savedTheme && typeof window !== 'undefined' && window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setDocumentTheme(newTheme);
        updateThemeButtonState(newTheme);
      }
    });
  }
}

export function toggleTheme(): void {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = domainToggleTheme(currentTheme);
  
  setDocumentTheme(newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeButtonState(newTheme);
}

export function updateThemeButtonState(theme: string): void {
  const themeButton = document.getElementById('theme-toggle');
  if (themeButton) {
    themeButton.setAttribute('aria-pressed', getAriaPressed(theme));
    themeButton.setAttribute('aria-label', getThemeToggleLabel(theme));
  }
}
