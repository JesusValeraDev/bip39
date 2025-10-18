function getElementById<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

function querySelector<T extends Element>(selector: string): T {
  return document.querySelector(selector) as T;
}

export const elements = {
  // Main elements
  get grid() {
    return getElementById<HTMLDivElement>('grid');
  },
  get index() {
    return getElementById<HTMLSpanElement>('index');
  },
  get binary() {
    return getElementById<HTMLElement>('binary');
  },
  get resetButton() {
    return getElementById<HTMLButtonElement>('reset');
  },
  get themeToggle() {
    return getElementById<HTMLButtonElement>('theme-toggle');
  },
  get languageToggle() {
    return getElementById<HTMLButtonElement>('language-toggle');
  },
  get languageDropdown() {
    return getElementById<HTMLDivElement>('language-dropdown');
  },
  get currentFlag() {
    return getElementById<HTMLElement>('current-flag');
  },

  // Word input elements
  get wordInput() {
    return getElementById<HTMLInputElement>('word-input');
  },
  get wordInputLabel() {
    return getElementById<HTMLLabelElement>('word-input-label');
  },
  get wordSuggestions() {
    return getElementById<HTMLDivElement>('word-suggestions');
  },

  // Help icon
  get helpIconTitle() {
    return querySelector<SVGTitleElement>('#learn-more-btn svg title');
  },

  // Translation elements
  get title() {
    return getElementById<HTMLHeadingElement>('title');
  },
  get indexLabel() {
    return getElementById<HTMLSpanElement>('index-label');
  },
  get infoText() {
    return getElementById<HTMLParagraphElement>('info-text');
  },
  get privacyTitle() {
    return querySelector<HTMLElement>('.warning-title');
  },
  get privacyText() {
    return getElementById<HTMLParagraphElement>('privacy-text');
  },

  // Modal translation elements
  get modalTitle() {
    return getElementById<HTMLHeadingElement>('modal-title');
  },
  get modalStep1Title() {
    return getElementById<HTMLHeadingElement>('modal-step1-title');
  },
  get modalStep1Text() {
    return getElementById<HTMLParagraphElement>('modal-step1-text');
  },
  get modalStep1WordGrid() {
    return getElementById<HTMLDivElement>('modal-step1-word-grid');
  },
  get modalStep2Title() {
    return getElementById<HTMLHeadingElement>('modal-step2-title');
  },
  get modalStep2Text() {
    return getElementById<HTMLParagraphElement>('modal-step2-text');
  },
  get modalStep2Word1() {
    return getElementById<HTMLSpanElement>('modal-step2-word1');
  },
  get modalStep2Word2() {
    return getElementById<HTMLSpanElement>('modal-step2-word2');
  },
  get modalStep2Entropy() {
    return getElementById<HTMLElement>('modal-step2-entropy');
  },
  get modalStep3Title() {
    return getElementById<HTMLHeadingElement>('modal-step3-title');
  },
  get modalStep3Text() {
    return getElementById<HTMLParagraphElement>('modal-step3-text');
  },
  get modalStep3MasterSeed() {
    return getElementById<HTMLDivElement>('modal-step3-master-seed');
  },
  get modalStep3BitValue() {
    return getElementById<HTMLDivElement>('modal-step3-bit-value');
  },
  get modalStep4Title() {
    return getElementById<HTMLHeadingElement>('modal-step4-title');
  },
  get modalStep4Text() {
    return getElementById<HTMLParagraphElement>('modal-step4-text');
  },
  get modalStep4PrivateKey() {
    return getElementById<HTMLDivElement>('modal-step4-private-key');
  },
  get modalStep4PrivateKey1() {
    return getElementById<HTMLDivElement>('modal-step4-private-key1');
  },
  get modalStep4PrivateKey2() {
    return getElementById<HTMLDivElement>('modal-step4-private-key2');
  },
  get modalStep4PrivateKey3() {
    return getElementById<HTMLDivElement>('modal-step4-private-key3');
  },
  get modalStep4BitSize1() {
    return getElementById<HTMLDivElement>('modal-step4-bit-size1');
  },
  get modalStep4BitSize2() {
    return getElementById<HTMLDivElement>('modal-step4-bit-size2');
  },
  get modalStep4BitSize3() {
    return getElementById<HTMLDivElement>('modal-step4-bit-size3');
  },
  get modalStep4PublicKey() {
    return getElementById<HTMLDivElement>('modal-step4-public-key');
  },
  get modalStep4Address() {
    return getElementById<HTMLDivElement>('modal-step4-address');
  },
  get modalWarningTitle() {
    return getElementById<HTMLHeadingElement>('modal-warning-title');
  },
  get modalWarningText() {
    return getElementById<HTMLParagraphElement>('modal-warning-text');
  },
  get modalWarningItem1() {
    return getElementById<HTMLLIElement>('modal-warning-item1');
  },
  get modalWarningItem2() {
    return getElementById<HTMLLIElement>('modal-warning-item2');
  },
  get modalWarningItem3() {
    return getElementById<HTMLLIElement>('modal-warning-item3');
  },
  get modalWarningItem4() {
    return getElementById<HTMLLIElement>('modal-warning-item4');
  },
  get modalWhyTitle() {
    return getElementById<HTMLHeadingElement>('modal-why-title');
  },
  get modalWhyText() {
    return getElementById<HTMLParagraphElement>('modal-why-text');
  },
  get modalWhyLink() {
    return getElementById<HTMLAnchorElement>('modal-why-link');
  },
};
