'use client';

import { LotteryItem } from '@/app/lottery/data';

export default function LotteryPanel({ item }: { item: LotteryItem }) {
  return (
    <div className='relative z-10 flex flex-col space-y-2 items-center justify-center'>
      <div className='relative rounded-md p-3 bg-[#b22222] shadow-lg'>
        <div className='justify-center relative rounded-xl p-7 bg-[#5d0000] border-4 border-[#ffffff]  grid grid-cols-3 sm:gap-6 mb-4 w-full h-full'>
          {item.numbers.map((num, idx) => (
            <div
              key={idx}
              className='flex items-center justify-center bg-gradient-to-b from-gray-300 via-white to-gray-300 border border-black  text-black text-center font-bold px-3 py-2 rounded text-base sm:text-lg md:text-xl w-full'
            >
              {num}
            </div>
          ))}
        </div>
      </div>
      <div className='flex flex-row gap-4 px-6 py-1 rounded-full bg-gradient-to-b from-[#FF0000A3] to-[#EE9F3D] text-white font-bold sm:text-sm shadow-md '>
        {item.progress}/5
      </div>
    </div>
  );
}
