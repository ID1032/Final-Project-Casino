export type LotteryApiRow = {
  lotteryNo: string;
  remain?: number;
  available?: number;
};

export type LotteryApiResponse = {
  data: LotteryApiRow[];
};
