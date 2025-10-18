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

export function shouldBoxBeDisabled(index: number, boxes: boolean[]): boolean {
  if (index === 0) {
    return should2048BeDisabled(boxes);
  }
  return shouldOtherBoxBeDisabled(index, boxes);
}

export function isBoxActive(index: number, boxes: boolean[]): boolean {
  return boxes[index];
}

export function getDisabledBoxIndices(boxes: boolean[]): number[] {
  return boxes
    .map((_, index) => index)
    .filter(index => shouldBoxBeDisabled(index, boxes));
}

export function getActiveBoxIndices(boxes: boolean[]): number[] {
  return boxes
    .map((_, index) => index)
    .filter(index => isBoxActive(index, boxes));
}
