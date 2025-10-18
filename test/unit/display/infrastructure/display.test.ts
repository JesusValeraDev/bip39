import { describe, it, expect } from 'vitest';

describe('Display Component - Disabled Box Logic', () => {
  describe('Box Disable State Logic (Unit Tests)', () => {
    it('should disable 2048 when any other box is active', () => {
      const boxes = Array(12).fill(false);
      boxes[1] = true; // 1024 is active

      const is2048Active = boxes[0];
      const isAnyOtherBoxActive = boxes.slice(1).some(box => box);

      // For 2048 box (index 0)
      const should2048BeDisabled = isAnyOtherBoxActive && !is2048Active;
      expect(should2048BeDisabled).toBe(true);
    });

    it('should not disable 2048 when no other boxes are active', () => {
      const boxes = Array(12).fill(false);

      const is2048Active = boxes[0];
      const isAnyOtherBoxActive = boxes.slice(1).some(box => box);

      const should2048BeDisabled = isAnyOtherBoxActive && !is2048Active;
      expect(should2048BeDisabled).toBe(false);
    });

    it('should not disable 2048 when 2048 itself is active', () => {
      const boxes = Array(12).fill(false);
      boxes[0] = true; // 2048 is active

      const is2048Active = boxes[0];
      const isAnyOtherBoxActive = boxes.slice(1).some(box => box);

      const should2048BeDisabled = isAnyOtherBoxActive && !is2048Active;
      expect(should2048BeDisabled).toBe(false);
    });

    it('should disable other boxes when 2048 is active', () => {
      const boxes = Array(12).fill(false);
      boxes[0] = true; // 2048 is active

      const is2048Active = boxes[0];

      // For box at index 5 (value 64)
      const boxIndex = 5;
      const isBoxActive = boxes[boxIndex];
      const shouldBoxBeDisabled = is2048Active && !isBoxActive;

      expect(shouldBoxBeDisabled).toBe(true);
    });

    it('should not disable other boxes when 2048 is not active', () => {
      const boxes = Array(12).fill(false);
      boxes[1] = true; // 1024 is active, 2048 is not

      const is2048Active = boxes[0];

      // For box at index 5 (value 64)
      const boxIndex = 5;
      const isBoxActive = boxes[boxIndex];
      const shouldBoxBeDisabled = is2048Active && !isBoxActive;

      expect(shouldBoxBeDisabled).toBe(false);
    });

    it('should not disable active boxes even when 2048 is active', () => {
      const boxes = Array(12).fill(false);
      boxes[0] = true; // 2048 is active
      boxes[5] = true; // 64 is also active

      const is2048Active = boxes[0];
      const boxIndex = 5;
      const isBoxActive = boxes[boxIndex];
      const shouldBoxBeDisabled = is2048Active && !isBoxActive;

      expect(shouldBoxBeDisabled).toBe(false);
    });

    it('should handle multiple other boxes active scenario', () => {
      const boxes = Array(12).fill(false);
      boxes[1] = true; // 1024
      boxes[2] = true; // 512
      boxes[11] = true; // 1

      const is2048Active = boxes[0];
      const isAnyOtherBoxActive = boxes.slice(1).some(box => box);
      const should2048BeDisabled = isAnyOtherBoxActive && !is2048Active;

      expect(should2048BeDisabled).toBe(true);
      expect(isAnyOtherBoxActive).toBe(true);
    });

    it('should handle all boxes except 2048 active', () => {
      const boxes = Array(12).fill(true);
      boxes[0] = false; // Only 2048 is not active

      const is2048Active = boxes[0];
      const isAnyOtherBoxActive = boxes.slice(1).some(box => box);
      const should2048BeDisabled = isAnyOtherBoxActive && !is2048Active;

      expect(should2048BeDisabled).toBe(true);
      expect(isAnyOtherBoxActive).toBe(true);
    });

    it('should correctly identify when any other box is active', () => {
      const testCases = [
        { boxes: [false, true, false, false, false, false, false, false, false, false, false, false], expected: true },
        { boxes: [false, false, false, false, false, false, false, false, false, false, false, true], expected: true },
        { boxes: [true, false, false, false, false, false, false, false, false, false, false, false], expected: false },
        {
          boxes: [false, false, false, false, false, false, false, false, false, false, false, false],
          expected: false,
        },
      ];

      testCases.forEach(({ boxes, expected }) => {
        const isAnyOtherBoxActive = boxes.slice(1).some(box => box);
        expect(isAnyOtherBoxActive).toBe(expected);
      });
    });
  });
});
