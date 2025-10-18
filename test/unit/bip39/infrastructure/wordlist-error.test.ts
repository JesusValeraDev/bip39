import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { loadWordlist } from '../../../../src/modules/bip39';
import { state } from '../../../../src/modules/bip39';

vi.mock('../../../../src/modules/language/infrastructure/language', () => ({
  currentTranslations: {
    wordlistLoadError: '⚠️ Failed to load wordlist. Please refresh the page.',
  },
}));

global.fetch = vi.fn();

describe('Wordlist Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    document.body.innerHTML = '';
    state.error = null;
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should set error state when wordlist fails to load', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Network error'));

    await loadWordlist('english');

    expect(state.error).toBe('wordlist_load_failed');
  });

  it('should clear error state on successful load', async () => {
    state.error = 'wordlist_load_failed';

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve('abandon\nability\nable'),
    });

    await loadWordlist('english');

    expect(state.error).toBeNull();
  });

  it('should handle non-ok response status', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await loadWordlist('english');

    expect(state.error).toBe('wordlist_load_failed');
  });

  it('should call console.error on failure', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (fetch as any).mockRejectedValueOnce(new Error('Network error'));

    await loadWordlist('english');

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
