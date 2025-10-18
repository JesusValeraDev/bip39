import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockElements = {
  currentFlag: { innerHTML: '' },
  languageDropdown: {
    querySelectorAll: vi.fn(() => [{ dataset: { lang: 'english' }, classList: { add: vi.fn(), remove: vi.fn() } }]),
    classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn(), contains: vi.fn(() => false) },
  },
  languageToggle: {
    addEventListener: vi.fn(),
    setAttribute: vi.fn(),
    focus: vi.fn(),
  },
  title: { textContent: '' },
  indexLabel: { textContent: '' },
  resetButton: { textContent: '' },
  infoText: { textContent: '' },
  privacyTitle: { textContent: '' },
  privacyText: { textContent: '' },
  themeToggle: { title: '' },
  helpIconTitle: { textContent: '' },
  wordInputLabel: { textContent: '' },
  wordInput: { placeholder: '' },
  modalTitle: { textContent: '' },
  modalStep1Title: { textContent: '' },
  modalStep1Text: { textContent: '' },
  modalStep1WordGrid: { innerHTML: '', appendChild: vi.fn() },
  modalStep2Title: { textContent: '' },
  modalStep2Text: { textContent: '' },
  modalStep2Word1: { textContent: '' },
  modalStep2Word2: { textContent: '' },
  modalStep2Entropy: { textContent: '' },
  modalStep3Title: { textContent: '' },
  modalStep3Text: { textContent: '' },
  modalStep3MasterSeed: { textContent: '' },
  modalStep3BitValue: { textContent: '' },
  modalStep4Title: { textContent: '' },
  modalStep4Text: { textContent: '' },
  modalStep4PrivateKey: { textContent: '' },
  modalStep4PrivateKey1: { textContent: '' },
  modalStep4PrivateKey2: { textContent: '' },
  modalStep4PrivateKey3: { textContent: '' },
  modalStep4BitSize1: { textContent: '' },
  modalStep4BitSize2: { textContent: '' },
  modalStep4BitSize3: { textContent: '' },
  modalStep4PublicKey: { textContent: '' },
  modalStep4Address: { textContent: '' },
  modalWarningTitle: { textContent: '' },
  modalWarningText: { textContent: '' },
  modalWarningItem1: { textContent: '' },
  modalWarningItem2: { textContent: '' },
  modalWarningItem3: { textContent: '' },
  modalWarningItem4: { textContent: '' },
  modalWhyTitle: { textContent: '' },
  modalWhyText: { textContent: '' },
  modalWhyLink: { textContent: '', href: '', innerHTML: '' },
};

vi.mock('../../../../src/modules/bip39/infrastructure/elements', () => ({
  elements: mockElements,
}));

vi.mock('../../../../src/modules/bip39/infrastructure/wordlist', () => ({
  loadWordlist: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../../../src/modules/display/infrastructure/display', () => ({
  updateDisplay: vi.fn(),
}));

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('Language Service - With Mocked Elements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('should execute initLanguage', async () => {
    mockLocalStorage.getItem.mockReturnValue('english');

    const { initLanguage } = await import('../../../../src/modules/language/infrastructure/language');
    const lang = initLanguage();

    expect(lang).toBe('english');
  });

  it('should execute setTranslations and updateUITranslations', async () => {
    const { setTranslations, updateUITranslations } = await import(
      '../../../../src/modules/language/infrastructure/language'
    );
    const { getTranslation } = await import('../../../../src/modules/i18n/domain/i18n');

    setTranslations(getTranslation('en'));
    expect(() => updateUITranslations()).not.toThrow();

    expect(mockElements.title.textContent).toBe('BIP39 Word Selector');
  });

  it('should execute changeLanguage', async () => {
    const { changeLanguage } = await import('../../../../src/modules/language/infrastructure/language');

    await changeLanguage('spanish');

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('language', 'spanish');
  });

  it('should update UI for multiple languages', async () => {
    const { setTranslations, updateUITranslations } = await import(
      '../../../../src/modules/language/infrastructure/language'
    );
    const { getTranslation } = await import('../../../../src/modules/i18n/domain/i18n');

    // Test English
    setTranslations(getTranslation('en'));
    updateUITranslations();

    // Test Spanish
    setTranslations(getTranslation('es'));
    updateUITranslations();

    expect(mockElements.title.textContent).toBe('Selector de Palabras BIP39');
  });
});
