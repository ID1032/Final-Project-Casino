'use client';

import type { LotteryItem } from '@/app/lottery/components/grid';
type Props = {
  data: LotteryItem;
  onClick?: () => void;
  showAvailable?: boolean;
};

export default function LotteryPanel({ data, onClick, showAvailable }: Props) {
  const isUnavailable = showAvailable ? !data || !data.available : false;

  return (
    <div
      className='relative z-10 flex flex-col space-y-2 rounded-xl items-center justify-center mx-auto h-auto w-full max-w-[300px] '
      onClick={!isUnavailable ? onClick : undefined}
    >
      {/*Lotter number panel*/}
      <div className='justify-center lative rounded-md shadow-lg'>
        <button
          disabled={isUnavailable}
          className={`flex items-center justify-center w-full max-w-[300px] h-full py-6 bg-[#b22222] rounded-md mx-auto font-bold transition
          ${
            isUnavailable
              ? (showAvailable 
                ? 'opacity-70 cursor-not-allowed'
                : 'cursor-not-allowed')
              : 'hover:bg-white'
          }`}
        >
          {/* Light Bulbs Around Border */}
          <div className='absolute inset-0 pointer-events-none'>
            {/* Top Row */}
            <div className='absolute top-1 left-0 right-0 flex justify-between px-4'>
              {[...Array(8)].map((_, i) => (
                <div
                  key={`top-${i}`}
                  className='w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_6px_rgba(255,215,0,0.8)]'
                />
              ))}
            </div>

            {/* Bottom Row */}
            <div className='absolute bottom-13 left-0 right-0 flex justify-between px-4'>
              {[...Array(8)].map((_, i) => (
                <div
                  key={`bottom-${i}`}
                  className='w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_6px_rgba(255,215,0,0.8)]'
                />
              ))}
            </div>

            {/* Left Column */}
            <div className='absolute top-2 bottom-13 left-1 flex flex-col justify-between py-2'>
              {[...Array(6)].map((_, i) => (
                <div
                  key={`left-${i}`}
                  className='w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_6px_rgba(255,215,0,0.8)]'
                />
              ))}
            </div>

            {/* Right Column */}
            <div className='absolute top-1 bottom-13 right-1 flex flex-col justify-between py-4'>
              {[...Array(6)].map((_, i) => (
                <div
                  key={`right-${i}`}
                  className='w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_6px_rgba(255,215,0,0.8)]'
                />
              ))}
            </div>
          </div>

          <div className='relative rounded-xl p-6 mx-auto bg-[#5d0000] border-4 border-[#ffffff] grid grid-cols-3 gap-2 mt-2 mb-2 ml-5 mr-5 w-full max-w-[278px] h-full max-h-[136px]'>
            {data.numbers.length > 0 ? (
              data.numbers.map((num, idx) => (
                <div
                  key={idx}
                  className='flex flex-col items-center justify-center bg-gradient-to-b from-[#D2C7BD] via-white to-[#D2C7BD] border-4 border-[#FFC548] text-[#DA7814] font-extrabold text-3xl rounded-xl w-[60px] h-[60px] shadow-[0_0_10px_rgba(255,215,0,0.6)]'
                >
                  {num}
                </div>
              ))
            ) : (
              <p className='text-white text-sm'>No numbers</p>
            )}
          </div>
        </button>
      </div>

      {/*status can buy or not*/}
      {showAvailable !== false && (
        <button>
          <div
            className={`rounded-full px-4 py-2 text-white font-bold shadow-md
              ${
                data.available > 0
                  ? 'bg-gradient-to-b from-[#FF0000A3] to-[#EE9F3D] hover:bg-white'
                  : 'bg-gradient-to-b from-[#737373B2] to-[#FFFFFF] opacity-70 cursor-not-allowed'
              }`}
          >
            {`${data.available}/5 `}
          </div>
        </button>
      )}
    </div>
  );
}
