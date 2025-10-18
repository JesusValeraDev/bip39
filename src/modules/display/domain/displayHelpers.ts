export interface DisplayState {
  indexText: string;
  announcement: string;
  shouldGetWord: boolean;
}

export function calculateDisplayState(binaryValue: number): DisplayState {
  if (binaryValue === 0) {
    return {
      indexText: '-',
      announcement: 'No pattern selected',
      shouldGetWord: false,
    };
  }

  if (binaryValue > 2048) {
    return {
      indexText: binaryValue.toString(),
      announcement: `Value ${binaryValue} is out of range. Maximum is 2048`,
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

export function shouldBoxBeDisabled(index: number, boxes: boolean[]): boolean {
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
