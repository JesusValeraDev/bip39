export {
  type Theme,
  DEFAULT_THEME,
  toggleTheme as toggleThemeLogic,
  isValidTheme,
  getThemeOrDefault,
  isDarkMode,
  getOppositeThemeName,
  getAriaPressed,
  getThemeToggleLabel,
} from './domain/themeLogic';

export {
  getOppositeTheme,
  getOSPreferredTheme,
  getInitialTheme,
  shouldAriaPressedBeTrue,
  getThemeAriaLabel as getThemeAriaLabelHelper,
} from './domain/themeHelpers';

export { initTheme, toggleTheme, updateThemeButtonState } from './infrastructure/theme';
