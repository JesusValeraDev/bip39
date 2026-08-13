import {
  DEFAULT_INDEX_BASE,
  getMaxDisplayIndex,
  hasEmptyPatternState,
  isSelectableDisplayIndex,
  type IndexBase,
} from '../../indexBase';

export interface DisplayState {
  indexText: string;
  announcement: string;
  shouldGetWord: boolean;
}

export function calculateDisplayState(binaryValue: number, base: IndexBase = DEFAULT_INDEX_BASE): DisplayState {
  // The boxes encode the index directly, so the empty pattern only means
  // "nothing selected" while 1-based numbering leaves it spare.
  if (binaryValue === 0 && hasEmptyPatternState(base)) {
    return {
      indexText: '-',
      announcement: 'No pattern selected',
      shouldGetWord: false,
    };
  }

  if (!isSelectableDisplayIndex(binaryValue, base)) {
    return {
      indexText: binaryValue.toString(),
      announcement: `Value ${binaryValue} is out of range. Maximum is ${getMaxDisplayIndex(base)}`,
      shouldGetWord: false,
    };
  }

  return {
    indexText: binaryValue.toString(),
    announcement: '', // Will be filled with word info
    shouldGetWord: true,
  };
}

export function generateWordAnnouncement(word: string, index: number): string {
  return `Word selected: ${word}, index ${index}`;
}

export function shouldBoxBeActive(boxState: boolean): boolean {
  return boxState;
}

export function shouldBoxBeDisabled(index: number, boxes: boolean[], base: IndexBase = DEFAULT_INDEX_BASE): boolean {
  // 0-based numbering tops out at 2047, so the 2048 bit is never available
  if (base === 0) {
    return index === 0;
  }

  const is2048Active = boxes[0];
  const isCurrentBoxActive = boxes[index];

  // Box 0 (2048) is disabled if any other box is active and 2048 is not active
  if (index === 0) {
    const isAnyOtherBoxActive = boxes.slice(1).some(box => box);
    return isAnyOtherBoxActive && !is2048Active;
  }

  // Other boxes are disabled if 2048 is active and the current box is not active
  return is2048Active && !isCurrentBoxActive;
}
