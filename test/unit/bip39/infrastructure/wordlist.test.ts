import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadWordlist, getWord } from '../../../../src/modules/bip39';
import { state } from '../../../../src/modules/bip39';
import { mockWordlistResponse, resetState } from '../../../test-utils';

global.fetch = vi.fn();

describe('Wordlist Service', () => {
  beforeEach(() => {
    resetState();
    vi.clearAllMocks();
  });

  describe('loadWordlist', () => {
    it('should load wordlist successfully', async () => {
      const mockWords = ['abandon', 'ability', 'able'];
      const mockResponse = await mockWordlistResponse(mockWords);
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        ...mockResponse,
      });

      await loadWordlist('english');

      expect(fetch).toHaveBeenCalledWith('/doc/english.txt');
      expect(state.currentLanguage).toBe('english');
      expect(state.wordlist).toEqual(mockWords);
      expect(state.error).toBeNull();
    });

    it('should handle fetch errors gracefully', async () => {
      (fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await loadWordlist('english');

      expect(state.wordlist).toEqual([]);
    });

    it('should read an embedded wordlist without the network', async () => {
      const embedded = globalThis as { __BIP39_WORDLISTS__?: Record<string, string> };
      embedded.__BIP39_WORDLISTS__ = { english: 'abandon\nability\nable' };

      try {
        await loadWordlist('english');

        expect(fetch).not.toHaveBeenCalled();
        expect(state.wordlist).toEqual(['abandon', 'ability', 'able']);
        expect(state.error).toBeNull();
      } finally {
        delete embedded.__BIP39_WORDLISTS__;
      }
    });

    it('should fall back to the network for a language not embedded', async () => {
      const embedded = globalThis as { __BIP39_WORDLISTS__?: Record<string, string> };
      embedded.__BIP39_WORDLISTS__ = { english: 'abandon' };
      (fetch as any).mockResolvedValueOnce({ ok: true, ...(await mockWordlistResponse(['hola'])) });

      try {
        await loadWordlist('spanish');

        expect(fetch).toHaveBeenCalledWith('/doc/spanish.txt');
        expect(state.wordlist).toEqual(['hola']);
      } finally {
        delete embedded.__BIP39_WORDLISTS__;
      }
    });

    it('should update current language', async () => {
      (fetch as any).mockResolvedValueOnce(mockWordlistResponse(['test']));

      await loadWordlist('spanish');

      expect(state.currentLanguage).toBe('spanish');
    });
  });

  describe('getWord', () => {
    beforeEach(async () => {
      const mockWords = ['abandon', 'ability', 'able', 'about'];
      const mockResponse = await mockWordlistResponse(mockWords);
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        ...mockResponse,
      });
      await loadWordlist('english');
    });

    it('should return correct word for valid index', () => {
      expect(getWord(0)).toBe('abandon');
      expect(getWord(1)).toBe('ability');
      expect(getWord(3)).toBe('about');
    });

    it('should return "N/A" for invalid index', () => {
      expect(getWord(10)).toBe('N/A');
      expect(getWord(-1)).toBe('N/A');
    });

    it('should return "N/A" when wordlist is empty', () => {
      state.wordlist = [];
      expect(getWord(0)).toBe('N/A');
    });
  });
});
