import { DEFAULT_INDEX_BASE, type IndexBase } from './indexBaseLogic';

/**
 * Kept apart from the infrastructure layer so the display pipeline can read the
 * current base without importing the DOM/localStorage side of the module.
 */
let currentIndexBase: IndexBase = DEFAULT_INDEX_BASE;

export function getIndexBase(): IndexBase {
  return currentIndexBase;
}

export function setIndexBase(base: IndexBase): void {
  currentIndexBase = base;
}
