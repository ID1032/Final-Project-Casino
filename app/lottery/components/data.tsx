export interface LotteryItem {
  id: number;
  numbers: number[];
  available: number;
}

export interface LotteryApiRow {
  lotteryNo: string;
  remain: number;
  available?: number;
}

export interface UserProfile {
  full_name?: string;
  avatar_url?: string;
  coins?: number;
}
