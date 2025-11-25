export const WINNING_CODES = ['W1', 'W2', 'W3'];

export function calculateWinnings(rank: number): number {
  switch (rank) {
    case 1: return 10000;
    case 2: return 5000;
    case 3: return 2000;
    default: return 0;
  }
}
