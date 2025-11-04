'use client'
import LotteryPanel from '@/app/lottery/panel';
import { lotteryData } from '@/app/lottery/data';

export default function LotteriesGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 p-4 w-full max-w-screen-xl mx-auto">
      {lotteryData.map(item => (
        <LotteryPanel key={item.id} item={item} />
      ))}
    </div>
  );
}