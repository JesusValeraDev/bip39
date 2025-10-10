export const state = {
  boxes: new Array(12).fill(false) as boolean[],
  wordlist: [] as string[],
  currentLanguage: 'english',
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
  return state.boxes.map(b => b ? '1' : '0').join('');
}
