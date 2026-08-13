import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockElements = {
  indexBaseValue: { textContent: '' },
  indexBaseToggle: { setAttribute: vi.fn() },
};

vi.mock('../../../../src/modules/bip39/infrastructure/elements', () => ({
  elements: mockElements,
}));

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

async function loadIndexBase() {
  return import('../../../../src/modules/indexBase');
}

describe('Index Base Service', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    mockElements.indexBaseValue.textContent = '';

    const { setIndexBase } = await loadIndexBase();
    setIndexBase(1);
  });

  describe('initIndexBase', () => {
    it('should restore a saved 0-based preference', async () => {
      mockLocalStorage.getItem.mockReturnValue('0');
      const { initIndexBase, getIndexBase } = await loadIndexBase();

      initIndexBase();

      expect(getIndexBase()).toBe(0);
      expect(mockElements.indexBaseValue.textContent).toBe('#0');
    });

    it('should default to 1-based when nothing is saved', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      const { initIndexBase, getIndexBase } = await loadIndexBase();

      initIndexBase();

      expect(getIndexBase()).toBe(1);
      expect(mockElements.indexBaseValue.textContent).toBe('#1');
    });

    it('should ignore an unusable saved value', async () => {
      mockLocalStorage.getItem.mockReturnValue('banana');
      const { initIndexBase, getIndexBase } = await loadIndexBase();

      initIndexBase();

      expect(getIndexBase()).toBe(1);
    });
  });

  describe('toggleIndexBase', () => {
    it('should switch to 0-based and persist it', async () => {
      const { toggleIndexBase, getIndexBase } = await loadIndexBase();

      toggleIndexBase();

      expect(getIndexBase()).toBe(0);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('indexBase', '0');
    });

    it('should switch back to 1-based on a second click', async () => {
      const { toggleIndexBase, getIndexBase } = await loadIndexBase();

      toggleIndexBase();
      toggleIndexBase();

      expect(getIndexBase()).toBe(1);
      expect(mockLocalStorage.setItem).toHaveBeenLastCalledWith('indexBase', '1');
    });

    it('should keep the button label and pressed state in sync', async () => {
      const { toggleIndexBase } = await loadIndexBase();

      toggleIndexBase();

      expect(mockElements.indexBaseValue.textContent).toBe('#0');
      expect(mockElements.indexBaseToggle.setAttribute).toHaveBeenCalledWith('aria-pressed', 'true');
    });
  });

  describe('updateIndexBaseButtonState', () => {
    it('should render the base passed to it', async () => {
      const { updateIndexBaseButtonState } = await loadIndexBase();

      updateIndexBaseButtonState(0);

      expect(mockElements.indexBaseValue.textContent).toBe('#0');
      expect(mockElements.indexBaseToggle.setAttribute).toHaveBeenCalledWith('aria-pressed', 'true');
    });

    it('should fall back to the current base', async () => {
      const { updateIndexBaseButtonState, setIndexBase } = await loadIndexBase();

      setIndexBase(0);
      updateIndexBaseButtonState();

      expect(mockElements.indexBaseValue.textContent).toBe('#0');
    });
  });
});
