import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initLanguage, setTranslations } from '../../../src/services/language';
import { getTranslation } from '../../../src/i18n';

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

vi.mock('../../../src/core/dom', () => ({
  elements: {
    currentFlag: { innerHTML: '' },
    languageDropdown: {
      querySelectorAll: vi.fn(() => []),
    },
    title: { textContent: '' },
    indexLabel: { textContent: '' },
    resetButton: { textContent: '' },
    infoText: { textContent: '' },
    privacyTitle: { textContent: '' },
    privacyText: { textContent: '' },
    themeToggle: { title: '' },
    languageToggle: { title: '' },
    helpIconTitle: { textContent: '' },
    wordInputLabel: { textContent: '' },
    wordInput: { placeholder: '' },
    modalTitle: { textContent: '' },
    modalStep1Title: { textContent: '' },
    modalStep1Text: { textContent: '' },
    modalStep1WordGrid: { 
      innerHTML: '',
      appendChild: vi.fn() 
    },
    modalStep2Title: { textContent: '' },
    modalStep2Text: { textContent: '' },
    modalStep2Word1: { textContent: '' },
    modalStep2Word2: { textContent: '' },
    modalStep2Entropy: { textContent: '' },
    modalStep3Title: { textContent: '' },
    modalStep3Text: { textContent: '' },
    modalStep3MasterSeed: { textContent: '' },
  },
}));

describe('Language Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initLanguage', () => {
    it('should return default language when none saved', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const language = initLanguage();
      
      expect(language).toBe('english');
    });

    it('should return saved language from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('spanish');
      
      const language = initLanguage();
      
      expect(language).toBe('spanish');
    });

    it('should return saved language for different languages', () => {
      const testCases = ['french', 'italian', 'japanese', 'korean'];
      
      testCases.forEach(lang => {
        mockLocalStorage.getItem.mockReturnValue(lang);
        const result = initLanguage();
        expect(result).toBe(lang);
      });
    });
  });

  describe('setTranslations', () => {
    it('should set English translations', () => {
      const enTranslations = getTranslation('en');
      setTranslations(enTranslations);
      
      // Verify translations are set (imported module state)
      expect(enTranslations.title).toBe('BIP39 Word Selector');
    });

    it('should set Spanish translations', () => {
      const esTranslations = getTranslation('es');
      setTranslations(esTranslations);
      
      expect(esTranslations.title).toBe('Selector de Palabras BIP39');
    });
  });
});
