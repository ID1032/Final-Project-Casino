'use client';

import { LotteryItem } from '@/app/lottery/components/grid';

type Props = {
  item: LotteryItem;
  onClose: () => void;
  userEmail?: string;
  onPurchaseSuccess?: () => void;
};

export default function LotteryModal({ item, onClose ,userEmail,onPurchaseSuccess}: Props) {
  const isUnavailable = item.available <= 0;

  const handlePurchase = async () => {
  const res = await fetch('/api/lottery', {
    method: 'POST',
    body: JSON.stringify({
      userId: userEmail,                // passed down from parent
      lotteryNo: item.numbers.join('-'),// use item.numbers
      amount: 1,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  const result = await res.json();
  if (result.success) {
  onPurchaseSuccess?.(); // refresh My Lottery
  setTimeout(() => {
    onClose(); // close modal after short delay
  }, 500);
} else {
  console.error('Purchase failed:', result); // helpful for debugging
  alert(result.message || result.error || 'Purchase failed');
}

};


  return (
    <div className='fixed inset-0 flex items-center justify-center bg-[#00000099] bg-opacity-50 z-50'>
      <div className='relative bg-gradient-to-b from-[#EE9F3D] to-[#FFFFFF] rounded-xl p-15 w-[1140px] h-[612px] shadow-2xl border-4 border-[#FFC548] text-[#DA7814]'>
        {/* Number Cards */}
        <div className='relative flex items-center justify-center w-[639px] h-[359px] py-4 bg-[#b22222] rounded-md mx-auto mt-1 mb-10'>
          <div className='relative rounded-xl p-6 mx-auto bg-[#5d0000] border-4 border-[#ffffff] grid grid-cols-3 gap-2 ml-10 mr-10 w-[782px] h-[270px]'>
            {item.numbers.map((num, idx) => (
              <div
                key={idx}
                className='flex items-center justify-center bg-gradient-to-b from-gray-300 via-white to-gray-300 border border-black  text-black  text-center rounded mx-auto text-2xl sm:text-3xl font-extrabold tracking-wide w-[120px] h-full'
              >
                {num}
              </div>
            ))}
          </div>
          {/* Light Bulbs Around Border */}
          <div className='absolute inset-0 pointer-events-none'>
            {/* Top Row */}
            <div className='absolute top-2 left-0 right-0 flex justify-between px-10 '>
              {[...Array(8)].map((_, i) => (
                <div
                  key={`top-${i}`}
                  className='w-7 h-7 bg-yellow-400 rounded-full shadow-[0_0_6px_rgba(255,215,0,0.8)] '
                />
              ))}
            </div>

            {/* Bottom Row */}
            <div className='absolute bottom-2 left-0 right-0 flex justify-between px-10'>
              {[...Array(8)].map((_, i) => (
                <div
                  key={`bottom-${i}`}
                  className='w-7 h-7 bg-yellow-400 rounded-full shadow-[0_0_6px_rgba(255,215,0,0.8)]'
                />
              ))}
            </div>

            {/* Left Column */}
            <div className='absolute top-1 bottom-1 left-1 flex flex-col justify-between py-2'>
              {[...Array(6)].map((_, i) => (
                <div
                  key={`left-${i}`}
                  className='w-7 h-7 bg-yellow-400 rounded-full shadow-[0_0_6px_rgba(255,215,0,0.8)]'
                />
              ))}
            </div>

            {/* Right Column */}
            <div className='absolute top-2 bottom-1 right-1 flex flex-col justify-between py-2'>
              {[...Array(6)].map((_, i) => (
                <div
                  key={`right-${i}`}
                  className='w-7 h-7 bg-yellow-400 rounded-full shadow-[0_0_6px_rgba(255,215,0,0.8)]'
                />
              ))}
            </div>
          </div>
        </div>

        {/* Progress Bar + Status */}
        <div className='flex justify-center items-center mb-4 px-30'>
          <div className='text-sm font-bold bg-gradient-to-b from-[#FF0000A3] to-[#EE9F3D] text-white px-35 py-1 rounded-full'>
            {`${item.available}/5`}
          </div>
          <div className='text-sm font-bold rounded-full bg-gradient-to-r from-[#FFFFFF] to-[#FFC548E0] text-[#DA7814] px-20 py-1'>
            Available
          </div>
        </div>

        {/* Buttons */}
        <div className='flex justify-center gap-50 mt-10'>
          <button
            className={`px-20 py-3 rounded-full font-bold hover:brightness-120 ${
              isUnavailable
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-gradient-to-b from-[#DA7814] to-[#74400B] text-white'
            }`}
            disabled={isUnavailable}
            onClick={handlePurchase}
          >
            Purchase
          </button>
          <button
            className='px-20 py-3 bg-gradient-to-b from-[#BBBBBB] to-[#525252] hover:brightness-120 text-white rounded-full font-bold'
            onClick={onClose}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
