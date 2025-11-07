'use client';

import LotteryPanel from '@/app/lottery/mainpage/panel-card';
import { LotteryItem } from '@/app/lottery/mainpage/data';

type Props = {
  items: LotteryItem[];
  pageKey: number;
};

export default function LotteriesGrid({ items, pageKey }: Props) {
  return (
    <div
      key={pageKey}
      className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-screen-xl mx-auto 
      transition-transform duration-500 ease-in-out animate-slide'
    >
      {items.map(item => (
        <LotteryPanel key={item.id} data={item} />
      ))}
    </div>
  );
}

{
  /*<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-screen-xl mx-auto">
      {lotteryData.map(item => (
        <LotteryPanel key={item.id} data={item} />
      ))}
    </div> */
}
