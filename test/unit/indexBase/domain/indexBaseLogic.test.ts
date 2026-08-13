import { describe, it, expect } from 'vitest';
import {
  DEFAULT_INDEX_BASE,
  applyIndexMax,
  applyIndexRange,
  getMinDisplayIndex,
  hasEmptyPatternState,
  isSelectableDisplayIndex,
  toWordlistIndex,
  formatIndexBaseToggleLabel,
  getIndexBaseAriaPressed,
  getIndexBaseLabel,
  getIndexBaseOrDefault,
  getIndexRangeLabel,
  getMaxDisplayIndex,
  isValidIndexBase,
  toDisplayIndex,
  toggleIndexBaseValue,
} from '../../../../src/modules/indexBase';

describe('Index Base Logic - Pure Functions', () => {
  describe('DEFAULT_INDEX_BASE', () => {
    it('should default to 1 to preserve the original numbering', () => {
      expect(DEFAULT_INDEX_BASE).toBe(1);
    });
  });

  describe('toggleIndexBaseValue', () => {
    it('should flip 1 to 0', () => {
      expect(toggleIndexBaseValue(1)).toBe(0);
    });

    it('should flip 0 to 1', () => {
      expect(toggleIndexBaseValue(0)).toBe(1);
    });
  });

  describe('isValidIndexBase', () => {
    it('should accept 0 and 1', () => {
      expect(isValidIndexBase(0)).toBe(true);
      expect(isValidIndexBase(1)).toBe(true);
    });

    it('should reject anything else', () => {
      expect(isValidIndexBase(2)).toBe(false);
      expect(isValidIndexBase('1')).toBe(false);
      expect(isValidIndexBase(null)).toBe(false);
    });
  });

  describe('getIndexBaseOrDefault', () => {
    it('should read a stored base', () => {
      expect(getIndexBaseOrDefault('0')).toBe(0);
      expect(getIndexBaseOrDefault('1')).toBe(1);
    });

    it('should fall back to the default for missing or invalid values', () => {
      expect(getIndexBaseOrDefault(null)).toBe(DEFAULT_INDEX_BASE);
      expect(getIndexBaseOrDefault('')).toBe(DEFAULT_INDEX_BASE);
      expect(getIndexBaseOrDefault('2')).toBe(DEFAULT_INDEX_BASE);
    });
  });

  describe('toDisplayIndex', () => {
    it('should show the first word as 1 when 1-based', () => {
      expect(toDisplayIndex(0, 1)).toBe(1);
    });

    it('should show the first word as 0 when 0-based', () => {
      expect(toDisplayIndex(0, 0)).toBe(0);
    });

    it('should shift the last word accordingly', () => {
      expect(toDisplayIndex(2047, 1)).toBe(2048);
      expect(toDisplayIndex(2047, 0)).toBe(2047);
    });
  });

  describe('toWordlistIndex', () => {
    it('should map the empty pattern to the first word when 0-based', () => {
      expect(toWordlistIndex(0, 0)).toBe(0);
    });

    it('should map pattern 1 to the first word when 1-based', () => {
      expect(toWordlistIndex(1, 1)).toBe(0);
    });

    it('should round-trip with toDisplayIndex', () => {
      for (const base of [0, 1] as const) {
        for (const wordlistIndex of [0, 1, 2, 1023, 2047]) {
          expect(toWordlistIndex(toDisplayIndex(wordlistIndex, base), base)).toBe(wordlistIndex);
        }
      }
    });
  });

  describe('hasEmptyPatternState', () => {
    it('should only leave the empty pattern spare when 1-based', () => {
      expect(hasEmptyPatternState(1)).toBe(true);
      expect(hasEmptyPatternState(0)).toBe(false);
    });
  });

  describe('isSelectableDisplayIndex', () => {
    it('should span 0-2047 when 0-based', () => {
      expect(isSelectableDisplayIndex(0, 0)).toBe(true);
      expect(isSelectableDisplayIndex(2047, 0)).toBe(true);
      expect(isSelectableDisplayIndex(2048, 0)).toBe(false);
    });

    it('should span 1-2048 when 1-based', () => {
      expect(isSelectableDisplayIndex(0, 1)).toBe(false);
      expect(isSelectableDisplayIndex(1, 1)).toBe(true);
      expect(isSelectableDisplayIndex(2048, 1)).toBe(true);
      expect(isSelectableDisplayIndex(2049, 1)).toBe(false);
    });
  });

  describe('getMinDisplayIndex', () => {
    it('should start at the base itself', () => {
      expect(getMinDisplayIndex(0)).toBe(0);
      expect(getMinDisplayIndex(1)).toBe(1);
    });
  });

  describe('applyIndexMax', () => {
    it('should substitute the maximum placeholder', () => {
      expect(applyIndexMax('exceed {max}', 1)).toBe('exceed 2048');
      expect(applyIndexMax('exceed {max}', 0)).toBe('exceed 2047');
    });
  });

  describe('getMaxDisplayIndex', () => {
    it('should end at 2048 when 1-based and 2047 when 0-based', () => {
      expect(getMaxDisplayIndex(1)).toBe(2048);
      expect(getMaxDisplayIndex(0)).toBe(2047);
    });
  });

  describe('getIndexRangeLabel', () => {
    it('should describe the full range for each base', () => {
      expect(getIndexRangeLabel(1)).toBe('1-2048');
      expect(getIndexRangeLabel(0)).toBe('0-2047');
    });
  });

  describe('getIndexBaseLabel', () => {
    it('should render the base as a hash prefix', () => {
      expect(getIndexBaseLabel(1)).toBe('#1');
      expect(getIndexBaseLabel(0)).toBe('#0');
    });
  });

  describe('getIndexBaseAriaPressed', () => {
    it('should be pressed only when 0-based', () => {
      expect(getIndexBaseAriaPressed(0)).toBe('true');
      expect(getIndexBaseAriaPressed(1)).toBe('false');
    });
  });

  describe('applyIndexRange', () => {
    it('should substitute the range placeholder', () => {
      expect(applyIndexRange('boxes ({range})', 1)).toBe('boxes (1-2048)');
      expect(applyIndexRange('boxes ({range})', 0)).toBe('boxes (0-2047)');
    });

    it('should leave templates without the placeholder untouched', () => {
      expect(applyIndexRange('no placeholder', 0)).toBe('no placeholder');
    });
  });

  describe('formatIndexBaseToggleLabel', () => {
    it('should fill in the current and the next base', () => {
      expect(formatIndexBaseToggleLabel('at {current}, go {next}', 1)).toBe('at 1, go 0');
      expect(formatIndexBaseToggleLabel('at {current}, go {next}', 0)).toBe('at 0, go 1');
    });
  });
});
