export const state = {
  boxes: new Array(12).fill(false) as boolean[],
  wordlist: [] as string[],
  currentLanguage: 'english',
  error: null as string | null,
};

export function resetBoxes(): void {
  state.boxes.fill(false);
}

export function toggleBox(index: number): void {
  state.boxes[index] = !state.boxes[index];
}

export function calculateBinaryValue(): number {
  let value = 0;
  for (let i = 0; i < 12; i++) {
    if (state.boxes[i]) {
      value += Math.pow(2, 11 - i);
    }
  }
  return value;
}

export function getBinaryString(): string {
  return state.boxes.map(b => (b ? '●' : '○')).join('');
}

export function setStateFromIndex(wordIndex: number): void {
  // Convert word index (0-2047) to binary and set the boxes
  // Note: wordIndex + 1 gives us the actual number (1-2048)
  const value = wordIndex + 1;

  resetBoxes();

  for (let i = 0; i < 12; i++) {
    const bitPosition = 11 - i;
    const bitValue = Math.pow(2, bitPosition);
    state.boxes[i] = (value & bitValue) !== 0;
  }
}
