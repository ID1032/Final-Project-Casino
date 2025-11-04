export interface LotteryItem {
  id: number;
  numbers: [number, number, number];
  progress: number; // out of 5
}
