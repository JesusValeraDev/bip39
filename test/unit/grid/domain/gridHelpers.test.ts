import { describe, it, expect } from 'vitest';
import { calculateBitValue, generateBoxAriaLabel, generateBoxConfigs, getBoxCount } from '../../../../src/modules/grid';

describe('Grid Helpers - Pure Functions', () => {
  describe('calculateBitValue', () => {
    it('should calculate correct bit value for index 0', () => {
      expect(calculateBitValue(0)).toBe(2048);
    });

    it('should calculate correct bit value for index 11', () => {
      expect(calculateBitValue(11)).toBe(1);
    });

    it('should calculate correct bit values for all positions', () => {
      const expected = [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1];
      for (let i = 0; i < 12; i++) {
        expect(calculateBitValue(i)).toBe(expected[i]);
      }
    });

    it('should follow power of 2 pattern', () => {
      expect(calculateBitValue(0)).toBe(Math.pow(2, 11));
      expect(calculateBitValue(5)).toBe(Math.pow(2, 6));
      expect(calculateBitValue(11)).toBe(Math.pow(2, 0));
    });
  });

  describe('generateBoxAriaLabel', () => {
    it('should generate correct label for first box', () => {
      expect(generateBoxAriaLabel(0, 2048)).toBe('Bit 1, value 2048');
    });

    it('should generate correct label for last box', () => {
      expect(generateBoxAriaLabel(11, 1)).toBe('Bit 12, value 1');
    });

    it('should generate correct label for middle box', () => {
      expect(generateBoxAriaLabel(5, 64)).toBe('Bit 6, value 64');
    });

    it('should include bit number and value', () => {
      const label = generateBoxAriaLabel(3, 256);
      expect(label).toContain('Bit 4');
      expect(label).toContain('256');
    });
  });

  describe('generateBoxConfigs', () => {
    it('should generate 12 box configurations', () => {
      const configs = generateBoxConfigs();
      expect(configs).toHaveLength(12);
    });

    it('should generate correct config for first box', () => {
      const configs = generateBoxConfigs();
      expect(configs[0]).toEqual({
        index: 0,
        bitValue: 2048,
        ariaLabel: 'Bit 1, value 2048',
      });
    });

    it('should generate correct config for last box', () => {
      const configs = generateBoxConfigs();
      expect(configs[11]).toEqual({
        index: 11,
        bitValue: 1,
        ariaLabel: 'Bit 12, value 1',
      });
    });

    it('should have sequential indices', () => {
      const configs = generateBoxConfigs();
      configs.forEach((config, index) => {
        expect(config.index).toBe(index);
      });
    });

    it('should have decreasing bit values', () => {
      const configs = generateBoxConfigs();
      for (let i = 0; i < configs.length - 1; i++) {
        expect(configs[i].bitValue).toBeGreaterThan(configs[i + 1].bitValue);
      }
    });

    it('should have unique bit values', () => {
      const configs = generateBoxConfigs();
      const bitValues = configs.map(c => c.bitValue);
      const uniqueValues = new Set(bitValues);
      expect(uniqueValues.size).toBe(12);
    });

    it('should generate valid aria labels for all boxes', () => {
      const configs = generateBoxConfigs();
      configs.forEach(config => {
        expect(config.ariaLabel).toMatch(/^Bit \d+, value \d+$/);
      });
    });
  });

  describe('getBoxCount', () => {
    it('should return 12', () => {
      expect(getBoxCount()).toBe(12);
    });
  });
});
