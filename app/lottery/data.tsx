export interface LotteryItem {
  id: number;
  numbers: [number, number, number];
  available: number;
}

export const lotteryData: LotteryItem[] = [
  { id: 1, numbers: [1, 2, 2], available: 5 },
  { id: 2, numbers: [1, 2, 8], available: 1 },
  { id: 3, numbers: [1, 3, 0], available: 2 },
  { id: 4, numbers: [1, 4, 3], available: 4 },
  { id: 5, numbers: [1, 4, 9], available: 2 },
  { id: 6, numbers: [1, 5, 9], available: 5 },
  { id: 7, numbers: [2, 2, 1], available: 4 },
  { id: 8, numbers: [3, 1, 0], available: 3 },
  { id: 9, numbers: [3, 4, 1], available: 0 },
  { id: 10, numbers: [3, 5, 1], available: 5 },
  { id: 11, numbers: [4, 1, 1], available: 3 },
  { id: 12, numbers: [4, 1, 5], available: 3 },
];