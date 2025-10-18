import { describe, it, expect } from 'vitest';
import { setStateFromIndex, state } from '../../../../src/modules/bip39';

describe('Word Input State Conversion', () => {
  describe('setStateFromIndex', () => {
    it('should set state for word index 0 (word "abandon" = 1)', () => {
      setStateFromIndex(0);

      // Index 0 → Number 1 → Binary: 000000000001
      expect(state.boxes).toEqual([false, false, false, false, false, false, false, false, false, false, false, true]);
    });

    it('should set state for word index 1 (word "ability" = 2)', () => {
      setStateFromIndex(1);

      // Index 1 → Number 2 → Binary: 000000000010
      expect(state.boxes).toEqual([false, false, false, false, false, false, false, false, false, false, true, false]);
    });

    it('should set state for word index 2047 (last word = 2048)', () => {
      setStateFromIndex(2047);

      // Index 2047 → Number 2048 → Binary: 100000000000
      expect(state.boxes).toEqual([true, false, false, false, false, false, false, false, false, false, false, false]);
    });

    it('should set state for word index 1023 (= 1024)', () => {
      setStateFromIndex(1023);

      // Index 1023 → Number 1024 → Binary: 010000000000
      expect(state.boxes).toEqual([false, true, false, false, false, false, false, false, false, false, false, false]);
    });

    it('should set state for word index 511 (= 512)', () => {
      setStateFromIndex(511);

      // Index 511 → Number 512 → Binary: 001000000000
      expect(state.boxes).toEqual([false, false, true, false, false, false, false, false, false, false, false, false]);
    });

    it('should set state for word index 10 (= 11)', () => {
      setStateFromIndex(10);

      // Index 10 → Number 11 → Binary: 000000001011
      expect(state.boxes).toEqual([false, false, false, false, false, false, false, false, true, false, true, true]);
    });

    it('should clear all boxes first before setting new state', () => {
      // Set some initial state
      state.boxes = [true, true, true, false, false, false, false, false, false, false, false, false];

      // Set state for index 0
      setStateFromIndex(0);

      // Should clear all and set only the last bit
      expect(state.boxes).toEqual([false, false, false, false, false, false, false, false, false, false, false, true]);
    });
  });
});
