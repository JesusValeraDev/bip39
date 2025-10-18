import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getSavedLanguage,
  saveLanguage,
} from '../../../../src/modules/language';

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('Language Helpers - Extended Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSavedLanguage', () => {
    it('should return saved language from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('spanish');
      expect(getSavedLanguage()).toBe('spanish');
    });

    it('should return null if no saved language', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      expect(getSavedLanguage()).toBe(null);
    });

    it('should call localStorage.getItem with language key', () => {
      getSavedLanguage();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('language');
    });
  });

  describe('saveLanguage', () => {
    it('should save language to localStorage', () => {
      saveLanguage('french');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('language', 'french');
    });

    it('should save different languages', () => {
      saveLanguage('spanish');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('language', 'spanish');
      
      saveLanguage('japanese');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('language', 'japanese');
    });
  });
});
