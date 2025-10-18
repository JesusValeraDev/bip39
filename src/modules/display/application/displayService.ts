import { calculateBinaryValue, getBinaryString } from '../../bip39';
import { getWord } from '../../bip39';
import { calculateDisplayState, generateWordAnnouncement } from '../domain/displayHelpers';
import { shouldBoxBeDisabled } from '../../bip39';

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
}

export function getBoxDisplayData(index: number, boxes: boolean[]): BoxDisplayData {
  const isActive = boxes[index];
  const isDisabled = shouldBoxBeDisabled(index, boxes);
  
  return {
    isActive,
    isDisabled,
    ariaPressed: isActive.toString(),
  };
}

export function getAllBoxesDisplayData(boxes: boolean[]): BoxDisplayData[] {
  return boxes.map((_, index) => getBoxDisplayData(index, boxes));
}

export function getWordDisplayData(binaryValue: number): WordDisplayData {
  const displayState = calculateDisplayState(binaryValue);
  
  let announcement = displayState.announcement;
  
  if (displayState.shouldGetWord) {
    const word = getWord(binaryValue - 1);
    announcement = generateWordAnnouncement(word, binaryValue);
  }
  
  return {
    indexText: displayState.indexText,
    announcement,
  };
}

export function getBinaryDisplayData(): BinaryDisplayData {
  return {
    binaryString: getBinaryString(),
  };
}

export function getAllDisplayData(boxes: boolean[]): {
  boxes: BoxDisplayData[];
  word: WordDisplayData;
  binary: BinaryDisplayData;
} {
  const binaryValue = calculateBinaryValue();
  
  return {
    boxes: getAllBoxesDisplayData(boxes),
    word: getWordDisplayData(binaryValue),
    binary: getBinaryDisplayData(),
  };
}
