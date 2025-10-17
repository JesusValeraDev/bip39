export const elements = {
  // Main elements
  grid: document.getElementById('grid') as HTMLDivElement,
  index: document.getElementById('index') as HTMLSpanElement,
  binary: document.getElementById('binary') as HTMLElement,
  resetButton: document.getElementById('reset') as HTMLButtonElement,
  themeToggle: document.getElementById('theme-toggle') as HTMLButtonElement,
  languageToggle: document.getElementById('language-toggle') as HTMLButtonElement,
  languageDropdown: document.getElementById('language-dropdown') as HTMLDivElement,
  currentFlag: document.getElementById('current-flag') as HTMLElement,

  // Word input elements
  wordInput: document.getElementById('word-input') as HTMLInputElement,
  wordInputLabel: document.getElementById('word-input-label') as HTMLLabelElement,
  wordSuggestions: document.getElementById('word-suggestions') as HTMLDivElement,

  // Translation elements
  title: document.getElementById('title') as HTMLHeadingElement,
  indexLabel: document.getElementById('index-label') as HTMLSpanElement,
  infoText: document.getElementById('info-text') as HTMLParagraphElement,
  privacyTitle: document.querySelector('.warning-title') as HTMLElement,
  privacyText: document.getElementById('privacy-text') as HTMLParagraphElement,

  // Modal translation elements
  modalTitle: document.getElementById('modal-title') as HTMLHeadingElement,
  modalStep1Title: document.getElementById('modal-step1-title') as HTMLHeadingElement,
  modalStep1Text: document.getElementById('modal-step1-text') as HTMLParagraphElement,
  modalStep2Title: document.getElementById('modal-step2-title') as HTMLHeadingElement,
  modalStep2Text: document.getElementById('modal-step2-text') as HTMLParagraphElement,
  modalStep2Entropy: document.getElementById('modal-step2-entropy') as HTMLElement,
  modalStep3Title: document.getElementById('modal-step3-title') as HTMLHeadingElement,
  modalStep3Text: document.getElementById('modal-step3-text') as HTMLParagraphElement,
  modalStep4Title: document.getElementById('modal-step4-title') as HTMLHeadingElement,
  modalStep4Text: document.getElementById('modal-step4-text') as HTMLParagraphElement,
  modalStep4PrivateKey: document.getElementById('modal-step4-private-key') as HTMLDivElement,
  modalStep4PublicKey: document.getElementById('modal-step4-public-key') as HTMLDivElement,
  modalStep4Address: document.getElementById('modal-step4-address') as HTMLDivElement,
  modalWarningTitle: document.getElementById('modal-warning-title') as HTMLHeadingElement,
  modalWarningText: document.getElementById('modal-warning-text') as HTMLParagraphElement,
  modalWarningItem1: document.getElementById('modal-warning-item1') as HTMLLIElement,
  modalWarningItem2: document.getElementById('modal-warning-item2') as HTMLLIElement,
  modalWarningItem3: document.getElementById('modal-warning-item3') as HTMLLIElement,
  modalWarningItem4: document.getElementById('modal-warning-item4') as HTMLLIElement,
  modalWhyTitle: document.getElementById('modal-why-title') as HTMLHeadingElement,
  modalWhyText: document.getElementById('modal-why-text') as HTMLParagraphElement,
  modalWhyLink: document.getElementById('modal-why-link') as HTMLAnchorElement,
};
