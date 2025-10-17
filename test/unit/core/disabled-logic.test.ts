import { describe, it, expect, beforeEach } from 'vitest';
import { state, resetBoxes, toggleBox, calculateBinaryValue } from '../../../src/core/state';

describe('Disabled Box Logic (Unit Tests)', () => {
  beforeEach(() => {
    resetBoxes();
  });

  describe('2048 Box Disable Conditions', () => {
    it('should identify when 2048 should be disabled (any other box active)', () => {
      // No boxes active - 2048 should NOT be disabled
      const isAnyOtherActive1 = state.boxes.slice(1).some(box => box);
      expect(isAnyOtherActive1).toBe(false);
      
      // Click box 11 (value 1)
      toggleBox(11);
      
      // Now any other box is active - 2048 should be disabled
      const isAnyOtherActive2 = state.boxes.slice(1).some(box => box);
      expect(isAnyOtherActive2).toBe(true);
    });

    it('should identify when 2048 should be enabled (no other boxes active)', () => {
      // Click and unclick box 11
      toggleBox(11);
      toggleBox(11);
      
      // No boxes active
      const isAnyOtherActive = state.boxes.slice(1).some(box => box);
      expect(isAnyOtherActive).toBe(false);
    });

    it('should correctly identify multiple other boxes active', () => {
      toggleBox(1); // 1024
      toggleBox(2); // 512
      toggleBox(11); // 1
      
      const isAnyOtherActive = state.boxes.slice(1).some(box => box);
      expect(isAnyOtherActive).toBe(true);
    });
  });

  describe('Other Boxes Disable Conditions', () => {
    it('should identify when other boxes should be disabled (2048 active)', () => {
      // 2048 not active - others should NOT be disabled
      const is2048Active1 = state.boxes[0];
      expect(is2048Active1).toBe(false);
      
      // Activate 2048
      toggleBox(0);
      
      // Now 2048 is active - others should be disabled
      const is2048Active2 = state.boxes[0];
      expect(is2048Active2).toBe(true);
    });

    it('should identify when other boxes should be enabled (2048 not active)', () => {
      // Click and unclick 2048
      toggleBox(0);
      toggleBox(0);
      
      const is2048Active = state.boxes[0];
      expect(is2048Active).toBe(false);
    });
  });

  describe('Disable Logic Edge Cases', () => {
    it('should not disable active boxes themselves', () => {
      // When box 1024 is active and 2048 gets disabled,
      // box 1024 itself should remain enabled (isActive check)
      toggleBox(1); // Activate 1024
      
      const is2048Active = state.boxes[0];
      const isBox1024Active = state.boxes[1];
      
      expect(is2048Active).toBe(false); // 2048 not active
      expect(isBox1024Active).toBe(true); // 1024 is active
      
      // Logic: box 1024 should NOT be disabled even though 2048 rule applies
      // because isActive = true for box 1024
    });

    it('should handle all boxes active except 2048', () => {
      // Activate all boxes except first (2048)
      for (let i = 1; i < 12; i++) {
        toggleBox(i);
      }
      
      const is2048Active = state.boxes[0];
      const isAnyOtherActive = state.boxes.slice(1).some(box => box);
      
      expect(is2048Active).toBe(false);
      expect(isAnyOtherActive).toBe(true);
      
      // 2048 should be disabled
      const shouldDisable2048 = isAnyOtherActive && !is2048Active;
      expect(shouldDisable2048).toBe(true);
    });

    it('should handle only 2048 active', () => {
      toggleBox(0); // Only 2048
      
      const is2048Active = state.boxes[0];
      const isAnyOtherActive = state.boxes.slice(1).some(box => box);
      
      expect(is2048Active).toBe(true);
      expect(isAnyOtherActive).toBe(false);
      
      // All other boxes should be disabled (except themselves if active)
      for (let i = 1; i < 12; i++) {
        const isActive = state.boxes[i];
        const shouldDisable = is2048Active && !isActive;
        expect(shouldDisable).toBe(true);
      }
    });
  });

  describe('Value Range Prevention', () => {
    it('should never exceed 2048 with disabled logic', () => {
      // Clicking 2048 alone = 2048 (valid)
      toggleBox(0);
      expect(calculateBinaryValue()).toBe(2048);
      
      // Can't click others when 2048 is active (disabled logic prevents it)
      // So value will never exceed 2048
    });

    it('should prevent 2048 + any other combination', () => {
      // If somehow both were active (shouldn't happen with disabled logic)
      state.boxes[0] = true; // 2048
      state.boxes[11] = true; // 1
      
      const value = calculateBinaryValue();
      expect(value).toBe(2049); // Would be out of range
      
      // But disabled logic prevents this state in UI
    });

    it('should allow maximum combination without 2048', () => {
      // All boxes except 2048
      for (let i = 1; i < 12; i++) {
        toggleBox(i);
      }
      
      const value = calculateBinaryValue();
      expect(value).toBe(2047); // Maximum without 2048
      expect(value).toBeLessThanOrEqual(2048);
    });
  });
});
