function getOSTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark'; // Fallback to dark if detection fails
}

export function initTheme(): void {
  const savedTheme = localStorage.getItem('theme');
  const theme = savedTheme || getOSTheme();
  document.documentElement.setAttribute('data-theme', theme);
  
  updateThemeButtonState(theme);

  // Listen for OS theme changes (only if no saved preference)
  if (!savedTheme && typeof window !== 'undefined' && window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        updateThemeButtonState(newTheme);
      }
    });
  }
}

export function toggleTheme(): void {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeButtonState(newTheme);
}

function updateThemeButtonState(theme: string): void {
  const themeButton = document.getElementById('theme-toggle');
  if (themeButton) {
    themeButton.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
}
