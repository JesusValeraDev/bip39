import { describe, it, expect, beforeEach } from 'vitest';
import { calculateBinaryValue, getBinaryString, resetBoxes, setStateFromIndex } from '../../../../src/modules/bip39';
import { shouldBoxBeDisabled } from '../../../../src/modules/bip39';
import { setIndexBase } from '../../../../src/modules/indexBase';

describe('Box Encoding Across Index Bases', () => {
  beforeEach(() => {
    setIndexBase(1);
    resetBoxes();
  });

  describe('setStateFromIndex - 0-based', () => {
    it('should leave the pattern empty for the first word', () => {
      setStateFromIndex(0, 0);

      expect(getBinaryString()).toBe('0000 0000 0000');
      expect(calculateBinaryValue()).toBe(0);
    });

    it('should put the second word on pattern 1', () => {
      setStateFromIndex(1, 0);

      expect(getBinaryString()).toBe('0000 0000 0001');
    });

    it('should put the third word on pattern 2', () => {
      setStateFromIndex(2, 0);

      expect(getBinaryString()).toBe('0000 0000 0010');
    });

    it('should put the last word on 2047, without the 2048 bit', () => {
      setStateFromIndex(2047, 0);

      expect(calculateBinaryValue()).toBe(2047);
      expect(getBinaryString()).toBe('0111 1111 1111');
    });
  });

  describe('setStateFromIndex - 1-based', () => {
    it('should put the first word on pattern 1', () => {
      setStateFromIndex(0, 1);

      expect(getBinaryString()).toBe('0000 0000 0001');
    });

    it('should put the last word on 2048', () => {
      setStateFromIndex(2047, 1);

      expect(calculateBinaryValue()).toBe(2048);
      expect(getBinaryString()).toBe('1000 0000 0000');
    });
  });

  describe('setStateFromIndex - current base', () => {
    it('should follow the base in effect when none is passed', () => {
      setIndexBase(0);
      setStateFromIndex(0);

      expect(calculateBinaryValue()).toBe(0);

      setIndexBase(1);
      setStateFromIndex(0);

      expect(calculateBinaryValue()).toBe(1);
    });
  });

  describe('shouldBoxBeDisabled - 0-based', () => {
    const empty = Array(12).fill(false);

    it('should always disable the 2048 box', () => {
      expect(shouldBoxBeDisabled(0, empty, 0)).toBe(true);

      const allLowBitsSet = [false, ...Array(11).fill(true)];
      expect(shouldBoxBeDisabled(0, allLowBitsSet, 0)).toBe(true);
    });

    it('should never disable the other boxes', () => {
      const allLowBitsSet = [false, ...Array(11).fill(true)];

      for (let index = 1; index < 12; index++) {
        expect(shouldBoxBeDisabled(index, empty, 0)).toBe(false);
        expect(shouldBoxBeDisabled(index, allLowBitsSet, 0)).toBe(false);
      }
    });
  });

  describe('shouldBoxBeDisabled - 1-based', () => {
    it('should keep the existing 2048 exclusion rules', () => {
      const otherActive = [false, true, ...Array(10).fill(false)];
      expect(shouldBoxBeDisabled(0, otherActive, 1)).toBe(true);

      const only2048 = [true, ...Array(11).fill(false)];
      expect(shouldBoxBeDisabled(0, only2048, 1)).toBe(false);
      expect(shouldBoxBeDisabled(5, only2048, 1)).toBe(true);
    });
  });
});
