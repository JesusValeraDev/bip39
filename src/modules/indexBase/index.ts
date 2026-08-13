export {
  type IndexBase,
  DEFAULT_INDEX_BASE,
  INDEX_BASE_STORAGE_KEY,
  WORDLIST_SIZE,
  toggleIndexBase as toggleIndexBaseValue,
  isValidIndexBase,
  getIndexBaseOrDefault,
  toDisplayIndex,
  toWordlistIndex,
  getMinDisplayIndex,
  getMaxDisplayIndex,
  hasEmptyPatternState,
  hasUnusedLeadingBit,
  isSelectableDisplayIndex,
  WORD_BITS,
  BINARY_GROUP_SIZE,
  toBinaryString,
  groupBits,
  getIndexRangeLabel,
  getIndexBaseLabel,
  getIndexBaseAriaPressed,
  applyIndexRange,
  applyIndexMax,
  formatIndexBaseToggleLabel,
} from './domain/indexBaseLogic';

export { getIndexBase, setIndexBase } from './domain/indexBaseState';

export { initIndexBase, toggleIndexBase, updateIndexBaseButtonState } from './infrastructure/indexBase';
