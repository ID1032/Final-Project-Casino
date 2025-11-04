export interface LotteryItem {
  id: number;
  numbers: [number, number, number];
  progress: number;
}

export const lotteryData: LotteryItem[] = [
  { id: 1, numbers: [1, 2, 8], progress: 5 },
  { id: 2, numbers: [1, 2, 8], progress: 1 },
  { id: 3, numbers: [1, 3, 0], progress: 2 },
  { id: 4, numbers: [1, 4, 3], progress: 4 },
  { id: 5, numbers: [1, 4, 3], progress: 5 },
  { id: 6, numbers: [1, 5, 9], progress: 2 },
  { id: 7, numbers: [1, 5, 9], progress: 4 },
  { id: 8, numbers: [2, 2, 9], progress: 2 },
  { id: 9, numbers: [2, 2, 9], progress: 5 },
  { id: 10, numbers: [3, 1, 0], progress: 3 },
  { id: 11, numbers: [3, 1, 0], progress: 0 },
  { id: 12, numbers: [3, 1, 0], progress: 3 },
];