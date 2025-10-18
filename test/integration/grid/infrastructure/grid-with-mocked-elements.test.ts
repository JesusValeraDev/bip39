import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockElements = {
  grid: {
    innerHTML: '',
    appendChild: vi.fn(),
  },
};

vi.mock('../../../../src/modules/bip39/infrastructure/elements', () => ({
  elements: mockElements,
}));

vi.mock('../../../../src/modules/bip39/domain/state', () => ({
  toggleBox: vi.fn(),
}));

vi.mock('../../../../src/modules/display/infrastructure/display', () => ({
  updateDisplay: vi.fn(),
}));

vi.mock('../../../../src/modules/display/infrastructure/toast', () => ({
  showDisabledBoxToast: vi.fn(),
}));

describe('Grid - With Mocked Elements', () => {
  beforeEach(() => {
    mockElements.grid.innerHTML = '';
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('should execute createGrid', async () => {
    const { createGrid } = await import('../../../../src/modules/grid/infrastructure/grid');
    
    expect(() => createGrid()).not.toThrow();
  });

  it('should clear grid innerHTML', async () => {
    const { createGrid } = await import('../../../../src/modules/grid/infrastructure/grid');
    mockElements.grid.innerHTML = 'old content';
    
    createGrid();
    
    expect(mockElements.grid.innerHTML).toBe('');
  });

  it('should call appendChild 12 times', async () => {
    const { createGrid } = await import('../../../../src/modules/grid/infrastructure/grid');
    
    createGrid();
    
    expect(mockElements.grid.appendChild).toHaveBeenCalledTimes(12);
  });

  it('should call updateDisplay after grid creation', async () => {
    const { updateDisplay } = await import('../../../../src/modules/display/infrastructure/display');
    const { createGrid } = await import('../../../../src/modules/grid/infrastructure/grid');
    
    createGrid();
    
    expect(updateDisplay).toHaveBeenCalled();
  });
});
