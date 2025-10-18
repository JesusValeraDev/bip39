import { describe, it, expect } from 'vitest';
import {
  calculateDisplayState,
  generateWordAnnouncement,
  shouldBoxBeActive,
  shouldBoxBeDisabled,
} from '../../../../src/modules/display';

describe('Display Helpers - Pure Functions', () => {
  describe('calculateDisplayState', () => {
    it('should return dash for zero value', () => {
      const state = calculateDisplayState(0);
      expect(state.indexText).toBe('-');
      expect(state.announcement).toBe('No pattern selected');
      expect(state.shouldGetWord).toBe(false);
    });

    it('should return value for 1', () => {
      const state = calculateDisplayState(1);
      expect(state.indexText).toBe('1');
      expect(state.shouldGetWord).toBe(true);
    });

    it('should return value for 2048 (maximum)', () => {
      const state = calculateDisplayState(2048);
      expect(state.indexText).toBe('2048');
      expect(state.shouldGetWord).toBe(true);
    });

    it('should handle out of range value', () => {
      const state = calculateDisplayState(3000);
      expect(state.indexText).toBe('3000');
      expect(state.announcement).toContain('out of range');
      expect(state.shouldGetWord).toBe(false);
    });

    it('should handle mid-range values', () => {
      const state = calculateDisplayState(1024);
      expect(state.indexText).toBe('1024');
      expect(state.shouldGetWord).toBe(true);
    });

    it('should not get word for zero', () => {
      const state = calculateDisplayState(0);
      expect(state.shouldGetWord).toBe(false);
    });

    it('should not get word for out of range', () => {
      const state = calculateDisplayState(5000);
      expect(state.shouldGetWord).toBe(false);
    });
  });

  describe('generateWordAnnouncement', () => {
    it('should generate correct announcement', () => {
      const announcement = generateWordAnnouncement('abandon', 1);
      expect(announcement).toBe('Word selected: abandon, index 1');
    });

    it('should include word and index', () => {
      const announcement = generateWordAnnouncement('zoo', 2048);
      expect(announcement).toContain('zoo');
      expect(announcement).toContain('2048');
    });

    it('should handle different words', () => {
      const announcement1 = generateWordAnnouncement('ability', 2);
      const announcement2 = generateWordAnnouncement('able', 3);
      
      expect(announcement1).toContain('ability');
      expect(announcement2).toContain('able');
    });
  });

  describe('shouldBoxBeActive', () => {
    it('should return true for active box', () => {
      expect(shouldBoxBeActive(true)).toBe(true);
    });

    it('should return false for inactive box', () => {
      expect(shouldBoxBeActive(false)).toBe(false);
    });
  });

  describe('shouldBoxBeDisabled', () => {
    describe('2048 box (index 0)', () => {
      it('should be disabled when other boxes are active', () => {
        const boxes = [false, true, false, false, false, false, false, false, false, false, false, false];
        expect(shouldBoxBeDisabled(0, boxes)).toBe(true);
      });

      it('should not be disabled when no other boxes are active', () => {
        const boxes = Array(12).fill(false);
        expect(shouldBoxBeDisabled(0, boxes)).toBe(false);
      });

      it('should not be disabled when 2048 itself is active', () => {
        const boxes = [true, false, false, false, false, false, false, false, false, false, false, false];
        expect(shouldBoxBeDisabled(0, boxes)).toBe(false);
      });

      it('should be disabled when multiple other boxes are active', () => {
        const boxes = [false, true, true, true, false, false, false, false, false, false, false, false];
        expect(shouldBoxBeDisabled(0, boxes)).toBe(true);
      });
    });

    describe('Other boxes', () => {
      it('should be disabled when 2048 is active and box is inactive', () => {
        const boxes = [true, false, false, false, false, false, false, false, false, false, false, false];
        expect(shouldBoxBeDisabled(5, boxes)).toBe(true);
      });

      it('should not be disabled when 2048 is not active', () => {
        const boxes = [false, true, false, false, false, false, false, false, false, false, false, false];
        expect(shouldBoxBeDisabled(5, boxes)).toBe(false);
      });

      it('should not be disabled when box is active even if 2048 is active', () => {
        const boxes = [true, false, false, false, false, true, false, false, false, false, false, false];
        expect(shouldBoxBeDisabled(5, boxes)).toBe(false);
      });

      it('should not be disabled for last box when no 2048', () => {
        const boxes = [false, false, false, false, false, false, false, false, false, false, false, false];
        expect(shouldBoxBeDisabled(11, boxes)).toBe(false);
      });
    });
  });
});
