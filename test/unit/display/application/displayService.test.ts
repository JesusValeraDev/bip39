import { describe, it, expect, vi } from 'vitest';
import {
  getBoxDisplayData,
  getAllBoxesDisplayData,
  getWordDisplayData,
  getBinaryDisplayData,
  getAllDisplayData,
} from '../../../../src/modules/display';

vi.mock('../../../src/modules/bip39/domain/state', () => ({
  calculateBinaryValue: vi.fn(() => 100),
  getBinaryString: vi.fn(() => '0 1 1 0 0 1 0 0'),
}));

vi.mock('../../../src/modules/bip39/infrastructure/wordlist', () => ({
  getWord: vi.fn(() => 'test'),
}));

describe('Application - Display Service', () => {
  describe('getBoxDisplayData', () => {
    it('should return display data for active box', () => {
      const boxes = [true, false, false, false, false, false, false, false, false, false, false, false];
      const data = getBoxDisplayData(0, boxes);
      
      expect(data.isActive).toBe(true);
      expect(data.ariaPressed).toBe('true');
    });

    it('should return display data for inactive box', () => {
      const boxes = Array(12).fill(false);
      const data = getBoxDisplayData(0, boxes);
      
      expect(data.isActive).toBe(false);
      expect(data.ariaPressed).toBe('false');
    });

    it('should mark box as disabled when appropriate', () => {
      const boxes = [false, true, false, false, false, false, false, false, false, false, false, false];
      const data = getBoxDisplayData(0, boxes); // 2048 should be disabled
      
      expect(data.isDisabled).toBe(true);
    });
  });

  describe('getAllBoxesDisplayData', () => {
    it('should return data for all 12 boxes', () => {
      const boxes = Array(12).fill(false);
      const data = getAllBoxesDisplayData(boxes);
      
      expect(data).toHaveLength(12);
    });

    it('should correctly mark active boxes', () => {
      const boxes = [true, false, true, false, false, false, false, false, false, false, false, false];
      const data = getAllBoxesDisplayData(boxes);
      
      expect(data[0].isActive).toBe(true);
      expect(data[1].isActive).toBe(false);
      expect(data[2].isActive).toBe(true);
    });
  });

  describe('getWordDisplayData', () => {
    it('should return display data for valid value', () => {
      const data = getWordDisplayData(100);
      
      expect(data.indexText).toBe('100');
      expect(data.announcement).toContain('Word selected');
    });

    it('should return dash for zero', () => {
      const data = getWordDisplayData(0);
      
      expect(data.indexText).toBe('-');
      expect(data.announcement).toContain('No pattern');
    });

    it('should handle out of range', () => {
      const data = getWordDisplayData(3000);
      
      expect(data.indexText).toBe('3000');
      expect(data.announcement).toContain('out of range');
    });
  });

  describe('getBinaryDisplayData', () => {
    it('should return binary string', () => {
      const data = getBinaryDisplayData();
      
      expect(data.binaryString).toBe('000000000000');
    });
  });

  describe('getAllDisplayData', () => {
    it('should return complete display data', () => {
      const boxes = Array(12).fill(false);
      const data = getAllDisplayData(boxes);
      
      expect(data.boxes).toHaveLength(12);
      expect(data.word).toBeDefined();
      expect(data.binary).toBeDefined();
    });
  });
});
