'use client';

import { useState } from 'react';
import LotteryPanel from '@/app/lottery/components/panel-card';
import LotteryModal from '@/app/lottery/components/lottery-modal';
import { LotteryItem } from '@/app/lottery/components/data';

type Props = {
  items: LotteryItem[];
  pageKey: number;
};

export default function LotteriesGrid({ items, pageKey }: Props) {
  const [selectedItem, setSelectedItem] = useState<LotteryItem | null>(null);

  return (
    <div key={pageKey} className='relative'>
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-screen-xl transition-transform duration-500 ease-in-out animate-slide'>
        {items.map(item => (
          <LotteryPanel
            key={item.id}
            data={item}
            onClick={() => setSelectedItem(item)}
          />
        ))}
      </div>
      {selectedItem && (
        <LotteryModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
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
