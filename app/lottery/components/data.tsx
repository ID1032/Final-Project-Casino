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
  { id: 8, numbers: [2, 2, 9], available: 1 },
  { id: 9, numbers: [3, 1, 0], available: 3 },
  { id: 10, numbers: [3, 2, 5], available: 0 },
  { id: 11, numbers: [3, 3, 2], available: 3 },
  { id: 12, numbers: [3, 4, 1], available: 0 },
  { id: 13, numbers: [3, 5, 1], available: 5 },
  { id: 14, numbers: [3, 5, 7], available: 1 },
  { id: 15, numbers: [3, 6, 4], available: 2 },
  { id: 16, numbers: [3, 6, 5], available: 4 },
  { id: 17, numbers: [3, 7, 2], available: 2 },
  { id: 18, numbers: [3, 7, 7], available: 5 },
  { id: 19, numbers: [3, 8, 3 ], available: 4 },
  { id: 20, numbers: [3, 8, 7], available: 1 },
  { id: 21, numbers: [3, 9, 2], available: 3 },
  { id: 22, numbers: [4, 1, 1], available: 0 },
  { id: 23, numbers: [4, 1, 5], available: 3 },
  { id: 24, numbers: [4, 2, 5], available: 0 },
  { id: 25, numbers: [4, 3, 7], available: 5 },
  { id: 26, numbers: [4, 4, 4], available: 1 },
  { id: 27, numbers: [4, 4, 6], available: 2 },
  { id: 28, numbers: [4, 4, 7], available: 4 },
  { id: 29, numbers: [4, 5, 1], available: 2 },
  { id: 30, numbers: [4, 5, 2], available: 5 },
  { id: 31, numbers: [4, 5, 3], available: 4 },
  { id: 32, numbers: [4, 6, 1], available: 1 },
  { id: 33, numbers: [4, 6, 3], available: 3 },
  { id: 34, numbers: [4, 6, 7], available: 0 },
  
];