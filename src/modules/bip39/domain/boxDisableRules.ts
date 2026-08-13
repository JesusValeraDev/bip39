import { DEFAULT_INDEX_BASE, type IndexBase } from '../../indexBase';

/**
 * Check if box at index 0 (value 2048) should be disabled
 * Rule: Disabled if any other box is active and 2048 itself is not active
 */
export function should2048BeDisabled(boxes: boolean[]): boolean {
  const is2048Active = boxes[0];
  const isAnyOtherBoxActive = boxes.slice(1).some(box => box);
  return isAnyOtherBoxActive && !is2048Active;
}

/**
 * Check if a non-2048 box should be disabled
 * Rule: Disabled if 2048 is active and the current box is not active
 */
export function shouldOtherBoxBeDisabled(index: number, boxes: boolean[]): boolean {
  const is2048Active = boxes[0];
  const isCurrentBoxActive = boxes[index];
  return is2048Active && !isCurrentBoxActive;
}

export function shouldBoxBeDisabled(index: number, boxes: boolean[], base: IndexBase = DEFAULT_INDEX_BASE): boolean {
  // 0-based numbering tops out at 2047, so the 2048 bit can never take part and
  // the remaining 11 bits are always free.
  if (base === 0) {
    return index === 0;
  }

  if (index === 0) {
    return should2048BeDisabled(boxes);
  }
  return shouldOtherBoxBeDisabled(index, boxes);
}
