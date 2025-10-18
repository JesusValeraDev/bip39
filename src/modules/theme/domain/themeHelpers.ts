export function getOppositeTheme(currentTheme: string | null): 'light' | 'dark' {
  return currentTheme === 'dark' ? 'light' : 'dark';
}

export function getOSPreferredTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark'; // Fallback
}

export function getInitialTheme(savedTheme: string | null): 'light' | 'dark' {
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }
  return getOSPreferredTheme();
}

export function shouldAriaPressedBeTrue(theme: string): boolean {
  return theme === 'dark';
}

export function getThemeAriaLabel(theme: string): string {
  return `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
}

export function isValidTheme(theme: string): theme is 'light' | 'dark' {
  return theme === 'light' || theme === 'dark';
}
