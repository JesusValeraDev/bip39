export interface BoxConfig {
  index: number;
  bitValue: number;
  ariaLabel: string;
}

export function calculateBitValue(index: number): number {
  return Math.pow(2, 11 - index);
}

export function generateBoxAriaLabel(index: number, bitValue: number): string {
  return `Bit ${index + 1}, value ${bitValue}`;
}

export function generateBoxConfigs(): BoxConfig[] {
  const configs: BoxConfig[] = [];
  
  for (let i = 0; i < 12; i++) {
    const bitValue = calculateBitValue(i);
    configs.push({
      index: i,
      bitValue,
      ariaLabel: generateBoxAriaLabel(i, bitValue),
    });
  }
  
  return configs;
}

export function getBoxCount(): number {
  return 12;
}
