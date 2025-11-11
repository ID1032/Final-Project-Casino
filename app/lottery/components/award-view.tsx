import AnimatedDigit from '@/app/lottery/components/animateDigit';

function DigitPanel({
  digits,
  delay = 0,
}: {
  digits: number[];
  delay?: number;
}) {
  return (
    <div className='bg-gray-800 rounded-lg p-4 flex justify-center gap-2 shadow-inner border-2 border-yellow-500'>
      {digits.map((d, i) => (
        <AnimatedDigit key={i} finalDigit={d} delay={delay + i * 100} />
      ))}
    </div>
  );
}

export default function AwardView({
  numbers,
  onBack,
  onHistory
}: {
  numbers: number[][];
  onBack: () => void;
  onHistory: () => void;
}) {
  return (
    <div className='flex flex-col items-center gap-6 py-6 text-white'>
      <div className='text-3xl font-bold text-yellow-400'>🎉 JACKPOT 🎉</div>

      {/* 🥇 First Prize */}
      <div className='text-center'>
        <div className='text-xl font-bold text-yellow-400 mb-2'>1st Prize</div>
        <DigitPanel digits={numbers[0]} delay={0} />
      </div>

      {/* 🥈 Second & Third Prize */}
      <div className='grid grid-cols-2 gap-4'>
        <div className='text-center'>
          <div className='text-xl font-bold text-yellow-300 mb-2'>
            2nd Prize
          </div>
          <DigitPanel digits={numbers[1]} delay={500} />
        </div>
        <div className='text-center'>
          <div className='text-xl font-bold text-yellow-200 mb-2'>
            3rd Prize
          </div>
          <DigitPanel digits={numbers[2]} delay={1000} />
        </div>
      </div>

      <div className='relative w-full mt-50 px-50'>
        <button
          onClick={onHistory}
          className='absolute left-0 bottom-0 text-[#000000] font-bold px-20 py-3 rounded-lg hover:scale-105 transition-transform'
        >
          <img
            src='/lotteryHistory.png'
            alt='History Icon'
            className='inline-block w-10 h-10 '
          />
          History Draw
        </button>

        <button
          onClick={onBack}
          className='absolute right-0 bottom-0 font-bold px-20 py-3 bg-gradient-to-b from-[#BBBBBB] to-[#525252] rounded-full hover:scale-105'
        >
          Back
        </button>
      </div>
    </div>
  );
}
