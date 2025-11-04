'use client';

import { LotteryItem } from '@/app/lottery/data';

export default function LotteryPanel({ item }: { item: LotteryItem }) {
  return (
      <div className='relative z-10 flex flex-col items-center justify-center'>
        <div className='relative rounded-xl p-4 text-black text-center bg-gradient-to-br from-yellow-500 via-yellow-700 to-yellow-900 w-full h-full grid grid-cols-3 gap-y-6 gap-x-2 sm:gap-5 md:gap-2 mb-3 '>
          {item.numbers.map((num, idx) => (
            <div
              key={idx}
              className='aspect-square flex items-center justify-center bg-gradient-to-b from-gray-300 via-white to-gray-300 border border-black px-3 py-2 rounded text-base sm:text-lg md:text-xl w-full'
            >
              {num}
            </div>
          ))}
        </div>
        <div className='inline-block px-6 py-1 rounded-full bg-gradient-to-b from-[#FF0000A3] to-[#EE9F3D] text-white text-xs sm:text-sm font-semibold shadow-md '>
          {item.progress}/5
        </div>
      </div>
  );
}
