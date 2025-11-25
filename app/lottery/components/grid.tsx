'use client';

import { useEffect,useState } from 'react';
import LotteryModal from '@/app/lottery/components/lottery-modal';

type LotteryRow = {
  id: number;
  lotteryNo: string;
  remain: number;
};

type LotteryItem = {
  id: number;
  numbers: number[];
  available: number;
};

type Props = {
  pageKey: number;
  onCardClick?: (item: LotteryItem) => void;
};



export default function LotteriesGrid({ pageKey }: Props) {
  const [lotteries, setLotteries] = useState<LotteryItem[]>([]);
  //console.log('LotteriesGrid items:', items);
  const [selectedItem, setSelectedItem] = useState<LotteryItem | null>(null);


  return (
    <div key={pageKey} className='relative'>
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-screen-xl transition-transform duration-500 ease-in-out animate-slide'>
        {lotteries.map(item => (
          <div
            key={item.id}
            className='bg-white p-4 rounded-lg shadow cursor-pointer'
            onClick={() => setSelectedItem(item)}
          >
            <div className='text-xl font-bold text-center text-red-600'>
              {item.numbers.join('-')}
            </div>
            <div className='text-sm text-center text-gray-500'>
              Remaining: {item.available}
            </div>
          </div>
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
