import { describe, it, expect } from 'vitest';
import { getTranslation, wordlistToUILang } from '../../src/i18n';

describe('i18n', () => {
  describe('getTranslation', () => {
    it('should return English translations', () => {
      const en = getTranslation('en');
      expect(en.title).toBe('BIP39 Word Selector');
      expect(en.resetButton).toBe('Reset');
      expect(en.languageLabel).toBe('Language');
    });

    it('should return Spanish translations', () => {
      const es = getTranslation('es');
      expect(es.title).toBe('Selector de Palabras BIP39');
      expect(es.resetButton).toBe('Reiniciar');
    });

    it('should return French translations', () => {
      const fr = getTranslation('fr');
      expect(fr.title).toBe('Sélecteur de Mots BIP39');
    });

    it('should return Czech translations', () => {
      const cs = getTranslation('cs');
      expect(cs.title).toBe('BIP39 Výběr Slov');
    });

    it('should return Italian translations', () => {
      const it = getTranslation('it');
      expect(it.title).toBe('Selettore di Parole BIP39');
    });

    it('should return Portuguese translations', () => {
      const pt = getTranslation('pt');
      expect(pt.title).toBe('Seletor de Palavras BIP39');
    });

    it('should return Japanese translations', () => {
      const ja = getTranslation('ja');
      expect(ja.title).toBe('BIP39 ワードセレクター');
    });

    it('should return Korean translations', () => {
      const ko = getTranslation('ko');
      expect(ko.title).toBe('BIP39 단어 선택기');
    });

    it('should return Simplified Chinese translations', () => {
      const zhHans = getTranslation('zh-Hans');
      expect(zhHans.title).toBe('BIP39 单词选择器');
    });

    it('should return Traditional Chinese translations', () => {
      const zhHant = getTranslation('zh-Hant');
      expect(zhHant.title).toBe('BIP39 單詞選擇器');
    });

    it('should default to English for unknown language', () => {
      const unknown = getTranslation('unknown' as any);
      expect(unknown.title).toBe('BIP39 Word Selector');
    });

    it('should include all required translation fields', () => {
      const en = getTranslation('en');
      expect(en.title).toBeDefined();
      expect(en.resetButton).toBeDefined();
      expect(en.infoText).toBeDefined();
      expect(en.wordInputLabel).toBeDefined();
      expect(en.modalTitle).toBeDefined();
    });
  });

  describe('wordlistToUILang mapping', () => {
    it('should map english to en', () => {
      expect(wordlistToUILang['english']).toBe('en');
    });

    it('should map spanish to es', () => {
      expect(wordlistToUILang['spanish']).toBe('es');
    });

    it('should map french to fr', () => {
      expect(wordlistToUILang['french']).toBe('fr');
    });

    it('should map czech to cs', () => {
      expect(wordlistToUILang['czech']).toBe('cs');
    });

    it('should map chinese_simplified to zh-Hans', () => {
      expect(wordlistToUILang['chinese_simplified']).toBe('zh-Hans');
    });

    it('should map chinese_traditional to zh-Hant', () => {
      expect(wordlistToUILang['chinese_traditional']).toBe('zh-Hant');
    });

    it('should have mappings for all supported wordlist languages', () => {
      const keys = Object.keys(wordlistToUILang);
      expect(keys).toContain('english');
      expect(keys).toContain('spanish');
      expect(keys).toContain('french');
      expect(keys).toContain('japanese');
      expect(keys).toContain('korean');
    });
  });
});
