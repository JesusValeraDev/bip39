export const elements = {
  // Main elements
  grid: document.getElementById('grid') as HTMLDivElement,
  word: document.getElementById('word') as HTMLDivElement,
  index: document.getElementById('index') as HTMLSpanElement,
  binary: document.getElementById('binary') as HTMLElement,
  resetButton: document.getElementById('reset') as HTMLButtonElement,
  themeToggle: document.getElementById('theme-toggle') as HTMLButtonElement,
  languageSelect: document.getElementById('language') as HTMLSelectElement,

  // Translation elements
  title: document.getElementById('title') as HTMLHeadingElement,
  subtitle: document.getElementById('subtitle') as HTMLParagraphElement,
  wordlistLabel: document.getElementById('wordlist-label') as HTMLLabelElement,
  wordLabel: document.getElementById('word-label') as HTMLDivElement,
  binaryLabel: document.getElementById('binary-label') as HTMLSpanElement,
  infoText: document.getElementById('info-text') as HTMLParagraphElement,
  privacyTooltip: document.getElementById('privacy-tooltip') as HTMLDivElement,
};
