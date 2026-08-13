// Imported from the leaf module rather than the barrel: the bip39 domain reads
// the index base, so going through the barrel would close a cycle.
import { elements } from '../../bip39/infrastructure/elements';
import {
  INDEX_BASE_STORAGE_KEY,
  getIndexBaseAriaPressed,
  getIndexBaseLabel,
  getIndexBaseOrDefault,
  toggleIndexBase as toggleIndexBaseValue,
  type IndexBase,
} from '../domain/indexBaseLogic';
import { getIndexBase, setIndexBase } from '../domain/indexBaseState';

export function initIndexBase(): void {
  const saved = localStorage.getItem(INDEX_BASE_STORAGE_KEY);

  setIndexBase(getIndexBaseOrDefault(saved));
  updateIndexBaseButtonState();
}

export function toggleIndexBase(): void {
  const next = toggleIndexBaseValue(getIndexBase());

  setIndexBase(next);
  localStorage.setItem(INDEX_BASE_STORAGE_KEY, next.toString());
  updateIndexBaseButtonState();
}

export function updateIndexBaseButtonState(base: IndexBase = getIndexBase()): void {
  elements.indexBaseValue.textContent = getIndexBaseLabel(base);
  elements.indexBaseToggle.setAttribute('aria-pressed', getIndexBaseAriaPressed(base));
}
