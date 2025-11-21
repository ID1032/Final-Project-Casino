'use client';

import { LotteryItem } from '@/app/lottery/components/data';
type Props = {
  data: LotteryItem;
  onClick?: () => void;
};

export default function LotteryPanel({ data, onClick }: Props) {
  const isUnavailable = data == null || !data.available;

  return (
    
    <div
      className='relative z-10 flex flex-col space-y-2 rounded-xl items-center justify-center mx-auto w-fit '
      onClick={!isUnavailable ? onClick : undefined}
    >
      {/*Lotter number panel*/}
      <div className='justify-center lative rounded-md shadow-lg'>
        <button
          disabled={isUnavailable}
          className={`flex items-center justify-center w-full max-w-[300px] h-full py-6 bg-[#b22222] rounded-md mx-auto font-bold transition
          ${isUnavailable ? 'opacity-70 cursor-not-allowed' : 'hover:bg-white'}`}
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
                  className='flex items-center justify-center bg-gradient-to-b from-gray-300 via-white to-gray-300 border border-black text-black font-bold rounded-full w-[45px] h-[45px] shadow-md'
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
    </div>
  );
}

{
  /*{item.available === 0 && (
        <div className='flex flex-row gap-4 px-6 py-1 rounded-full bg-gradient-to-b from-[#737373B2] to-[#FFFFFF] text-white font-bold sm:text-sm shadow-md hover:scale-105 transition-transform duration-200'>
          {item.available}/5
        </div>
      )}
        <div className='flex flex-row gap-4 px-6 py-1 rounded-full bg-gradient-to-b from-[#FF0000A3] to-[#EE9F3D] text-white font-bold sm:text-sm shadow-md hover:scale-105 transition-transform duration-2'>
        {item.available}/5
      </div>
      
      <div >
        {/* Number Tiles 
      {item.numbers.map((num, idx) => {
        const isZero = num === 0 || isUnavailable
        return (
          <div
            key={idx}
            className={`flex flex-row gap-4 px-6 py-1 rounded-full bg-gradient-to-b  text-white font-bold text-lg sm:text-xl shadow-md hover:scale-105 transition-transform duration-200'
              ${isZero ? 'bg-gray-300 text-gray-600' : 'bg-gradient-to-b bg-white text-black'}`}
          >
            {item.available}/5
          </div>
          )
      })}
      </div>*/
}
