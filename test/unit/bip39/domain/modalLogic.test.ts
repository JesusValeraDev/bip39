import { describe, it, expect } from 'vitest';
import {
  MODAL_TRANSITION_DURATION,
  isEscapeKey,
  isModalOpen,
  getModalTransitionDuration,
  shouldCloseOnKey,
  validateModalElements,
} from '../../../../src/modules/bip39';

describe('Domain - Modal Logic', () => {
  describe('constants', () => {
    it('should have correct transition duration', () => {
      expect(MODAL_TRANSITION_DURATION).toBe(300);
    });
  });

  describe('isEscapeKey', () => {
    it('should return true for Escape', () => {
      expect(isEscapeKey('Escape')).toBe(true);
    });

    it('should return false for other keys', () => {
      expect(isEscapeKey('Enter')).toBe(false);
      expect(isEscapeKey('a')).toBe(false);
    });
  });

  describe('isModalOpen', () => {
    it('should return true when aria-hidden is false', () => {
      expect(isModalOpen('false')).toBe(true);
    });

    it('should return false when aria-hidden is true', () => {
      expect(isModalOpen('true')).toBe(false);
    });

    it('should return false for null', () => {
      expect(isModalOpen(null)).toBe(false);
    });
  });

  describe('getModalTransitionDuration', () => {
    it('should return 300', () => {
      expect(getModalTransitionDuration()).toBe(300);
    });
  });

  describe('shouldCloseOnKey', () => {
    it('should return true for Escape when modal open', () => {
      expect(shouldCloseOnKey('Escape', true)).toBe(true);
    });

    it('should return false when modal closed', () => {
      expect(shouldCloseOnKey('Escape', false)).toBe(false);
    });

    it('should return false for other keys', () => {
      expect(shouldCloseOnKey('Enter', true)).toBe(false);
    });
  });

  describe('validateModalElements', () => {
    it('should return true when all exist', () => {
      expect(validateModalElements({}, {}, {})).toBe(true);
    });

    it('should return false when any is null', () => {
      expect(validateModalElements(null, {}, {})).toBe(false);
      expect(validateModalElements({}, null, {})).toBe(false);
      expect(validateModalElements({}, {}, null)).toBe(false);
    });
  });
});
