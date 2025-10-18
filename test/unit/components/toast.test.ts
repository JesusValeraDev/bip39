import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { showDisabledBoxToast } from '../../../src/components/toast';

vi.mock('../../../src/services/language', () => ({
  currentTranslations: {
    disabledBoxMessage: 'Cannot select this number with the current pattern - it would exceed 2048',
  },
}));

describe('Toast Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('showDisabledBoxToast', () => {
    it('should not show toast on first click (debouncing)', () => {
      showDisabledBoxToast();
      
      const toast = document.getElementById('toast-notification');
      expect(toast).toBeFalsy();
    });

    it('should be callable without errors', () => {
      expect(() => showDisabledBoxToast()).not.toThrow();
      expect(() => showDisabledBoxToast()).not.toThrow();
    });
  });
});
