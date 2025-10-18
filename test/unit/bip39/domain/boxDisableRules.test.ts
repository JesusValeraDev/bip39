import { describe, it, expect } from 'vitest';
import {
  should2048BeDisabled,
  shouldOtherBoxBeDisabled,
  shouldBoxBeDisabled,
  isBoxActive,
  getDisabledBoxIndices,
  getActiveBoxIndices,
} from '../../../../src/modules/bip39';

describe('Domain - Box Disable Rules', () => {
  describe('should2048BeDisabled', () => {
    it('should return true when other boxes active', () => {
      const boxes = [false, true, false, false, false, false, false, false, false, false, false, false];
      expect(should2048BeDisabled(boxes)).toBe(true);
    });

    it('should return false when no other boxes active', () => {
      const boxes = Array(12).fill(false);
      expect(should2048BeDisabled(boxes)).toBe(false);
    });

    it('should return false when 2048 is active', () => {
      const boxes = [true, false, false, false, false, false, false, false, false, false, false, false];
      expect(should2048BeDisabled(boxes)).toBe(false);
    });
  });

  describe('shouldOtherBoxBeDisabled', () => {
    it('should return true when 2048 active and box inactive', () => {
      const boxes = [true, false, false, false, false, false, false, false, false, false, false, false];
      expect(shouldOtherBoxBeDisabled(5, boxes)).toBe(true);
    });

    it('should return false when 2048 not active', () => {
      const boxes = Array(12).fill(false);
      expect(shouldOtherBoxBeDisabled(5, boxes)).toBe(false);
    });

    it('should return false when box is active', () => {
      const boxes = [true, false, false, false, false, true, false, false, false, false, false, false];
      expect(shouldOtherBoxBeDisabled(5, boxes)).toBe(false);
    });
  });

  describe('shouldBoxBeDisabled', () => {
    it('should handle index 0 correctly', () => {
      const boxes = [false, true, false, false, false, false, false, false, false, false, false, false];
      expect(shouldBoxBeDisabled(0, boxes)).toBe(true);
    });

    it('should handle other indices correctly', () => {
      const boxes = [true, false, false, false, false, false, false, false, false, false, false, false];
      expect(shouldBoxBeDisabled(5, boxes)).toBe(true);
    });
  });

  describe('isBoxActive', () => {
    it('should return true for active box', () => {
      const boxes = [true, false, false, false, false, false, false, false, false, false, false, false];
      expect(isBoxActive(0, boxes)).toBe(true);
    });

    it('should return false for inactive box', () => {
      const boxes = Array(12).fill(false);
      expect(isBoxActive(0, boxes)).toBe(false);
    });
  });

  describe('getDisabledBoxIndices', () => {
    it('should return indices of disabled boxes', () => {
      const boxes = [false, true, false, false, false, false, false, false, false, false, false, false];
      const disabled = getDisabledBoxIndices(boxes);
      expect(disabled).toContain(0); // 2048 should be disabled
    });

    it('should return empty for no disabled boxes', () => {
      const boxes = Array(12).fill(false);
      const disabled = getDisabledBoxIndices(boxes);
      expect(disabled).toEqual([]);
    });
  });

  describe('getActiveBoxIndices', () => {
    it('should return indices of active boxes', () => {
      const boxes = [true, false, true, false, false, false, false, false, false, false, false, false];
      const active = getActiveBoxIndices(boxes);
      expect(active).toEqual([0, 2]);
    });

    it('should return empty for no active boxes', () => {
      const boxes = Array(12).fill(false);
      const active = getActiveBoxIndices(boxes);
      expect(active).toEqual([]);
    });
  });
});
