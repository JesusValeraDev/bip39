import { describe, it, expect, beforeEach } from 'vitest';
import { elements } from '../../../../src/modules/bip39';

describe('DOM Elements', () => {
  beforeEach(() => {
    // Set up minimal DOM structure
    document.body.innerHTML = `
      <div id="grid"></div>
      <span id="index"></span>
      <code id="binary"></code>
      <button id="reset"></button>
      <button id="theme-toggle"></button>
      <button id="language-toggle"></button>
      <div id="language-dropdown"></div>
      <span id="current-flag"></span>
      <input id="word-input" />
      <label id="word-input-label"></label>
      <div id="word-suggestions"></div>
      <button id="learn-more-btn"><svg><title></title></svg></button>
      <h1 id="title"></h1>
      <span id="index-label"></span>
      <p id="info-text"></p>
      <div class="warning-title"></div>
      <p id="privacy-text"></p>
      <h2 id="modal-title"></h2>
      <h3 id="modal-step1-title"></h3>
      <p id="modal-step1-text"></p>
      <div id="modal-step1-word-grid"></div>
      <h3 id="modal-step2-title"></h3>
      <p id="modal-step2-text"></p>
      <span id="modal-step2-word1"></span>
      <span id="modal-step2-word2"></span>
      <span id="modal-step2-entropy"></span>
      <h3 id="modal-step3-title"></h3>
      <p id="modal-step3-text"></p>
      <div id="modal-step3-master-seed"></div>
      <div id="modal-step3-bit-value"></div>
      <h3 id="modal-step4-title"></h3>
      <p id="modal-step4-text"></p>
      <div id="modal-step4-private-key"></div>
      <div id="modal-step4-private-key1"></div>
      <div id="modal-step4-private-key2"></div>
      <div id="modal-step4-private-key3"></div>
      <div id="modal-step4-bit-size1"></div>
      <div id="modal-step4-bit-size2"></div>
      <div id="modal-step4-bit-size3"></div>
      <div id="modal-step4-public-key"></div>
      <div id="modal-step4-address"></div>
      <h3 id="modal-warning-title"></h3>
      <p id="modal-warning-text"></p>
      <li id="modal-warning-item1"></li>
      <li id="modal-warning-item2"></li>
      <li id="modal-warning-item3"></li>
      <li id="modal-warning-item4"></li>
      <h3 id="modal-why-title"></h3>
      <p id="modal-why-text"></p>
      <a id="modal-why-link"></a>
    `;
  });

  describe('elements object', () => {
    it('should export elements object', () => {
      expect(elements).toBeDefined();
      expect(typeof elements).toBe('object');
    });

    it('should have main elements defined', () => {
      expect(elements.grid).toBeDefined();
      expect(elements.index).toBeDefined();
      expect(elements.binary).toBeDefined();
      expect(elements.resetButton).toBeDefined();
      expect(elements.themeToggle).toBeDefined();
    });

    it('should have word input elements defined', () => {
      expect(elements.wordInput).toBeDefined();
      expect(elements.wordInputLabel).toBeDefined();
      expect(elements.wordSuggestions).toBeDefined();
    });

    it('should have translation elements defined', () => {
      expect(elements.title).toBeDefined();
      expect(elements.indexLabel).toBeDefined();
      expect(elements.infoText).toBeDefined();
    });

    it('should have modal elements defined', () => {
      expect(elements.modalTitle).toBeDefined();
      expect(elements.modalStep1Title).toBeDefined();
      expect(elements.modalStep2Title).toBeDefined();
      expect(elements.modalStep3Title).toBeDefined();
      expect(elements.modalStep4Title).toBeDefined();
    });

    it('should have language elements defined', () => {
      expect(elements.languageToggle).toBeDefined();
      expect(elements.languageDropdown).toBeDefined();
      expect(elements.currentFlag).toBeDefined();
    });
  });
});
