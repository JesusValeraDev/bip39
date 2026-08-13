export type IndexBase = 0 | 1;

export const DEFAULT_INDEX_BASE: IndexBase = 1;

export const INDEX_BASE_STORAGE_KEY = 'indexBase';

export const WORDLIST_SIZE = 2048;

export function toggleIndexBase(current: IndexBase): IndexBase {
  return current === 1 ? 0 : 1;
}

export function isValidIndexBase(value: unknown): value is IndexBase {
  return value === 0 || value === 1;
}

export function getIndexBaseOrDefault(value: string | null): IndexBase {
  if (value === '0') return 0;
  if (value === '1') return 1;
  return DEFAULT_INDEX_BASE;
}

/**
 * Wordlist positions are always stored 0-based (0-2047); the base decides
 * whether the first word reads as 0 or as 1.
 *
 * The displayed index and the value the boxes encode are the same number, so
 * 0-based numbering makes the empty pattern the first word.
 */
export function toDisplayIndex(wordlistIndex: number, base: IndexBase): number {
  return wordlistIndex + base;
}

export function toWordlistIndex(displayIndex: number, base: IndexBase): number {
  return displayIndex - base;
}

export function getMinDisplayIndex(base: IndexBase): number {
  return base;
}

export function getMaxDisplayIndex(base: IndexBase): number {
  return WORDLIST_SIZE - 1 + base;
}

/**
 * 0-based numbering tops out at 2047, so the leading 2048 bit can never be
 * set. It is still shown, but out of play, like the box above it.
 */
export function hasUnusedLeadingBit(base: IndexBase): boolean {
  return base === 0;
}

/**
 * Only 1-based numbering leaves the empty pattern spare to mean "nothing
 * selected"; 0-based numbering spends it on the first word.
 */
export function hasEmptyPatternState(base: IndexBase): boolean {
  return base === 1;
}

export function isSelectableDisplayIndex(displayIndex: number, base: IndexBase): boolean {
  return displayIndex >= getMinDisplayIndex(base) && displayIndex <= getMaxDisplayIndex(base);
}

/** A BIP39 word carries eleven bits of entropy. */
export const WORD_BITS = 11;

export const BINARY_GROUP_SIZE = 4;

export function toBinaryString(displayIndex: number, bits: number = WORD_BITS): string {
  return displayIndex.toString(2).padStart(bits, '0');
}

/**
 * Splits bits into groups so a long pattern can be read and counted at a
 * glance. Grouped from the right, like any other number, which leaves the
 * short group at the front when the width is not a multiple of the group.
 */
export function groupBits(bits: string, size: number = BINARY_GROUP_SIZE): string {
  const groups: string[] = [];

  for (let end = bits.length; end > 0; end -= size) {
    groups.unshift(bits.slice(Math.max(0, end - size), end));
  }

  return groups.join(' ');
}

export function getIndexRangeLabel(base: IndexBase): string {
  return `${base}-${getMaxDisplayIndex(base)}`;
}

export function getIndexBaseLabel(base: IndexBase): string {
  return `#${base}`;
}

export function getIndexBaseAriaPressed(base: IndexBase): 'true' | 'false' {
  return base === 0 ? 'true' : 'false';
}

export function applyIndexRange(template: string, base: IndexBase): string {
  return template.replace('{range}', getIndexRangeLabel(base));
}

export function applyIndexMax(template: string, base: IndexBase): string {
  return template.replace('{max}', getMaxDisplayIndex(base).toString());
}

export function formatIndexBaseToggleLabel(template: string, base: IndexBase): string {
  return template.replace('{current}', base.toString()).replace('{next}', toggleIndexBase(base).toString());
}
