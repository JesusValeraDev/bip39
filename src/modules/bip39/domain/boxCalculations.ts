export interface BoxConfig {
  index: number;
  bitValue: number;
  bitNumber: number;
  ariaLabel: string;
}

export const BOX_COUNT = 12;

export const MAX_VALUE = 2048;

/**
 * Formula: 2^(11-index)
 */
export function calculateBitValue(index: number): number {
  return Math.pow(2, 11 - index);
}

export function getAllBitValues(): number[] {
  return Array.from({ length: BOX_COUNT }, (_, i) => calculateBitValue(i));
}

export function generateBoxAriaLabel(bitNumber: number, bitValue: number): string {
  return `Bit ${bitNumber}, value ${bitValue}`;
}

export function generateBoxConfig(index: number): BoxConfig {
  const bitValue = calculateBitValue(index);
  const bitNumber = index + 1;

  return {
    index,
    bitValue,
    bitNumber,
    ariaLabel: generateBoxAriaLabel(bitNumber, bitValue),
  };
}

export function generateAllBoxConfigs(): BoxConfig[] {
  return Array.from({ length: BOX_COUNT }, (_, i) => generateBoxConfig(i));
}

export function isValidBinaryValue(value: number): boolean {
  return value > 0 && value <= MAX_VALUE;
}

export function isNoSelection(value: number): boolean {
  return value === 0;
}

export function isOutOfRange(value: number): boolean {
  return value > MAX_VALUE;
}
