import { describe, it, expect } from 'vitest';
import {
  BOX_COUNT,
  MAX_VALUE,
  calculateBitValue,
  getAllBitValues,
  generateBoxAriaLabel,
  generateBoxConfig,
  generateAllBoxConfigs,
  isValidBinaryValue,
  isNoSelection,
  isOutOfRange,
} from '../../../../src/modules/bip39';

describe('Domain - Box Calculations', () => {
  describe('constants', () => {
    it('should have correct box count', () => {
      expect(BOX_COUNT).toBe(12);
    });

    it('should have correct max value', () => {
      expect(MAX_VALUE).toBe(2048);
    });
  });

  describe('calculateBitValue', () => {
    it('should calculate 2048 for index 0', () => {
      expect(calculateBitValue(0)).toBe(2048);
    });

    it('should calculate 1 for index 11', () => {
      expect(calculateBitValue(11)).toBe(1);
    });

    it('should calculate all correct values', () => {
      const expected = [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1];
      expected.forEach((val, i) => {
        expect(calculateBitValue(i)).toBe(val);
      });
    });
  });

  describe('getAllBitValues', () => {
    it('should return array of 12 values', () => {
      const values = getAllBitValues();
      expect(values).toHaveLength(12);
    });

    it('should return correct values', () => {
      const values = getAllBitValues();
      expect(values).toEqual([2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1]);
    });
  });

  describe('generateBoxAriaLabel', () => {
    it('should generate correct label', () => {
      expect(generateBoxAriaLabel(1, 2048)).toBe('Bit 1, value 2048');
    });

    it('should include bit number and value', () => {
      const label = generateBoxAriaLabel(6, 64);
      expect(label).toContain('6');
      expect(label).toContain('64');
    });
  });

  describe('generateBoxConfig', () => {
    it('should generate complete config', () => {
      const config = generateBoxConfig(0);
      expect(config.index).toBe(0);
      expect(config.bitValue).toBe(2048);
      expect(config.bitNumber).toBe(1);
      expect(config.ariaLabel).toBe('Bit 1, value 2048');
    });

    it('should generate config for last box', () => {
      const config = generateBoxConfig(11);
      expect(config.index).toBe(11);
      expect(config.bitValue).toBe(1);
      expect(config.bitNumber).toBe(12);
    });
  });

  describe('generateAllBoxConfigs', () => {
    it('should generate 12 configs', () => {
      const configs = generateAllBoxConfigs();
      expect(configs).toHaveLength(12);
    });

    it('should have sequential indices', () => {
      const configs = generateAllBoxConfigs();
      configs.forEach((config, i) => {
        expect(config.index).toBe(i);
      });
    });
  });

  describe('isValidBinaryValue', () => {
    it('should return true for 1', () => {
      expect(isValidBinaryValue(1)).toBe(true);
    });

    it('should return true for 2048', () => {
      expect(isValidBinaryValue(2048)).toBe(true);
    });

    it('should return false for 0', () => {
      expect(isValidBinaryValue(0)).toBe(false);
    });

    it('should return false for 2049', () => {
      expect(isValidBinaryValue(2049)).toBe(false);
    });
  });

  describe('isNoSelection', () => {
    it('should return true for 0', () => {
      expect(isNoSelection(0)).toBe(true);
    });

    it('should return false for other values', () => {
      expect(isNoSelection(1)).toBe(false);
      expect(isNoSelection(2048)).toBe(false);
    });
  });

  describe('isOutOfRange', () => {
    it('should return true for values > 2048', () => {
      expect(isOutOfRange(2049)).toBe(true);
      expect(isOutOfRange(3000)).toBe(true);
    });

    it('should return false for valid values', () => {
      expect(isOutOfRange(2048)).toBe(false);
      expect(isOutOfRange(1)).toBe(false);
    });
  });
});
