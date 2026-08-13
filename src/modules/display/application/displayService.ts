import { calculateBinaryValue, getBinaryString } from '../../bip39';
import { getWord } from '../../bip39';
import { calculateDisplayState, generateWordAnnouncement } from '../domain/displayHelpers';
import { shouldBoxBeDisabled } from '../../bip39';
import { getIndexBase, hasUnusedLeadingBit, toWordlistIndex, type IndexBase } from '../../indexBase';

export interface BoxDisplayData {
  isActive: boolean;
  isDisabled: boolean;
  ariaPressed: string;
}

export interface WordDisplayData {
  indexText: string;
  announcement: string;
}

export interface BinaryDisplayData {
  binaryString: string;
  hasUnusedLeadingBit: boolean;
}

export function getBoxDisplayData(index: number, boxes: boolean[], base: IndexBase = getIndexBase()): BoxDisplayData {
  const isActive = boxes[index];
  const isDisabled = shouldBoxBeDisabled(index, boxes, base);

  return {
    isActive,
    isDisabled,
    ariaPressed: isActive.toString(),
  };
}

export function getAllBoxesDisplayData(boxes: boolean[], base: IndexBase = getIndexBase()): BoxDisplayData[] {
  return boxes.map((_, index) => getBoxDisplayData(index, boxes, base));
}

export function getWordDisplayData(binaryValue: number, base: IndexBase = getIndexBase()): WordDisplayData {
  const displayState = calculateDisplayState(binaryValue, base);

  let announcement = displayState.announcement;

  if (displayState.shouldGetWord) {
    const word = getWord(toWordlistIndex(binaryValue, base));
    announcement = generateWordAnnouncement(word, binaryValue);
  }

  return {
    indexText: displayState.indexText,
    announcement,
  };
}

export function getBinaryDisplayData(base: IndexBase = getIndexBase()): BinaryDisplayData {
  return {
    binaryString: getBinaryString(),
    hasUnusedLeadingBit: hasUnusedLeadingBit(base),
  };
}

export function getAllDisplayData(boxes: boolean[]): {
  boxes: BoxDisplayData[];
  word: WordDisplayData;
  binary: BinaryDisplayData;
} {
  const binaryValue = calculateBinaryValue();
  const base = getIndexBase();

  return {
    boxes: getAllBoxesDisplayData(boxes, base),
    word: getWordDisplayData(binaryValue, base),
    binary: getBinaryDisplayData(base),
  };
}
