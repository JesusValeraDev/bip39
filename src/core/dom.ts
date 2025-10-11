export const elements = {
  // Main elements
  grid: document.getElementById('grid') as HTMLDivElement,
  word: document.getElementById('word') as HTMLDivElement,
  index: document.getElementById('index') as HTMLSpanElement,
  binary: document.getElementById('binary') as HTMLElement,
  resetButton: document.getElementById('reset') as HTMLButtonElement,
  themeToggle: document.getElementById('theme-toggle') as HTMLButtonElement,
  languageToggle: document.getElementById('language-toggle') as HTMLButtonElement,
  languageDropdown: document.getElementById('language-dropdown') as HTMLDivElement,
  currentFlag: document.getElementById('current-flag') as HTMLElement,

  // Translation elements
  title: document.getElementById('title') as HTMLHeadingElement,
  subtitle: document.getElementById('subtitle') as HTMLParagraphElement,
  wordLabel: document.getElementById('word-label') as HTMLDivElement,
  indexLabel: document.getElementById('index-label') as HTMLSpanElement,
  infoText: document.getElementById('info-text') as HTMLParagraphElement,
  privacyTooltip: document.getElementById('privacy-tooltip') as HTMLDivElement,
};
