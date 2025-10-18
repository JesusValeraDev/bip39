export type Theme = 'light' | 'dark';

export const DEFAULT_THEME: Theme = 'dark';

export function toggleTheme(current: string | null): Theme {
  return current === 'dark' ? 'light' : 'dark';
}

export function isValidTheme(theme: string): theme is Theme {
  return theme === 'light' || theme === 'dark';
}

export function getThemeOrDefault(theme: string | null): Theme {
  if (theme && isValidTheme(theme)) {
    return theme;
  }
  return DEFAULT_THEME;
}

export function isDarkMode(theme: string): boolean {
  return theme === 'dark';
}

export function getOppositeThemeName(theme: string): string {
  return theme === 'dark' ? 'light' : 'dark';
}

export function getAriaPressed(theme: string): 'true' | 'false' {
  return isDarkMode(theme) ? 'true' : 'false';
}

export function getThemeToggleLabel(currentTheme: string): string {
  const opposite = getOppositeThemeName(currentTheme);
  return `Switch to ${opposite} mode`;
}
