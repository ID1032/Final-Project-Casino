import { LotteryItem } from '@/app/lottery/mainpage/data';

export function filterLotteryData(
  data: LotteryItem[],
  query: string
): LotteryItem[] {
  const cleanQuery = query.replace(/\D/g, '');
  if (!cleanQuery) return data;

  return data.filter(item => item.numbers.join('').includes(cleanQuery));
}
