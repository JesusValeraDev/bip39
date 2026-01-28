import { describe, it, expect, beforeEach } from 'vitest';
import { state, resetBoxes, toggleBox, calculateBinaryValue, getBinaryString } from '../../../../src/modules/bip39';
import { resetState } from '../../../test-utils';

describe('State Management', () => {
  beforeEach(() => {
    resetState();
  });

  describe('resetBoxes', () => {
    it('should reset all boxes to false', () => {
      // Set some boxes to true
      state.boxes[0] = true;
      state.boxes[5] = true;
      state.boxes[11] = true;

      resetBoxes();

      expect(state.boxes.every(box => !box)).toBe(true);
    });
  });

  describe('toggleBox', () => {
    it('should toggle a box from false to true', () => {
      expect(state.boxes[0]).toBe(false);

      toggleBox(0);

      expect(state.boxes[0]).toBe(true);
    });

    it('should toggle a box from true to false', () => {
      state.boxes[0] = true;

      toggleBox(0);

      expect(state.boxes[0]).toBe(false);
    });

    it('should not affect other boxes', () => {
      state.boxes[1] = true;
      state.boxes[2] = false;

      toggleBox(0);

      expect(state.boxes[1]).toBe(true);
      expect(state.boxes[2]).toBe(false);
    });
  });

  describe('calculateBinaryValue', () => {
    it('should return 0 for all boxes false', () => {
      expect(calculateBinaryValue()).toBe(0);
    });

    it('should return correct value for single box', () => {
      state.boxes[11] = true; // 2^0 = 1
      expect(calculateBinaryValue()).toBe(1);

      state.boxes[11] = false;
      state.boxes[10] = true; // 2^1 = 2
      expect(calculateBinaryValue()).toBe(2);
    });

    it('should return correct value for multiple boxes', () => {
      state.boxes[11] = true; // 2^0 = 1
      state.boxes[10] = true; // 2^1 = 2
      state.boxes[9] = true; // 2^2 = 4

      expect(calculateBinaryValue()).toBe(7); // 1 + 2 + 4
    });

    it('should handle all boxes true', () => {
      state.boxes.fill(true);
      expect(calculateBinaryValue()).toBe(4095); // 2^12 - 1
    });
  });

  describe('getBinaryString', () => {
    it('should return all empty dots for no boxes selected', () => {
      expect(getBinaryString()).toBe('○○○○○○○○○○○○');
    });

    it('should return correct binary string for single box', () => {
      state.boxes[11] = true;
      expect(getBinaryString()).toBe('○○○○○○○○○○○●');

      state.boxes[11] = false;
      state.boxes[0] = true;
      expect(getBinaryString()).toBe('●○○○○○○○○○○○');
    });

    it('should return correct binary string for multiple boxes', () => {
      state.boxes[0] = true; // 2^11
      state.boxes[11] = true; // 2^0
      expect(getBinaryString()).toBe('●○○○○○○○○○○●');
    });

    it('should return all filled dots for all boxes selected', () => {
      state.boxes.fill(true);
      expect(getBinaryString()).toBe('●●●●●●●●●●●●');
    });
  });
});
