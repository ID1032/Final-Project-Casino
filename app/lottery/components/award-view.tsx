import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

import AnimatedDigit from '@/app/lottery/components/animateDigit';


function DigitPanel({
  digits,
  delay = 0,
}: {
  digits: number[];
  delay?: number;
}) {
  return (
    <div className='justify-center relative rounded-md shadow-lg p-4 flex items-center w-full h-full bg-[#b22222] mx-auto font-bold transition'>
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
            <div className='absolute bottom-1 left-0 right-0 flex justify-between px-4'>
              {[...Array(8)].map((_, i) => (
                <div
                  key={`bottom-${i}`}
                  className='w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_6px_rgba(255,215,0,0.8)]'
                />
              ))}
            </div>

            {/* Left Column */}
            <div className='absolute top-2 bottom-1 left-1 flex flex-col justify-between py-2'>
              {[...Array(6)].map((_, i) => (
                <div
                  key={`left-${i}`}
                  className='w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_6px_rgba(255,215,0,0.8)]'
                />
              ))}
            </div>

            {/* Right Column */}
            <div className='absolute top-1 bottom-1 right-1 flex flex-col justify-between py-4'>
              {[...Array(6)].map((_, i) => (
                <div
                  key={`right-${i}`}
                  className='w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_6px_rgba(255,215,0,0.8)]'
                />
              ))}
            </div>
          </div>
      <div className='relative rounded-xl p-6 mx-auto bg-[#5d0000] border-4 border-[#ffffff] grid grid-cols-3 gap-2 w-full h-full'>
        {digits.map((d, i) => (
          <AnimatedDigit key={i} finalDigit={d} delay={delay + i * 10} />
        ))}
      </div>
    </div>
  );
}

export default function AwardView({
  onBack,
  onHistory,
}: {
  numbers: number[][];
  onBack: () => void;
  onHistory: () => void;
}) {
  const [numbers, setNumbers] = useState<number[][]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchOrGenerateAward = async () => {
      const today = new Date();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);

      // Get latest award
      const { data, error } = await supabase
        .from("Lottery_WinNo")
        .select("*")
        .order("date", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching award:", error);
      }

        // If exists and within 7 days → reuse
      if (data && new Date(data.date).getTime() >= oneWeekAgo.getTime()) {
        // Reuse existing award
        setNumbers([
          String(data.firstPrize).split("").map(Number),
          String(data.secondPrize).split("").map(Number),
          String(data.thirdPrize).split("").map(Number),
        ]);
      } else {
        // Generate new award
        const newAward = [
          Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)),
          Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)),
          Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)),
        ];

        await supabase.from("Lottery_WinNo").insert([
          {
            date: today.toISOString().split("T")[0],
            firstPrize: parseInt(newAward[0].join("")),
            secondPrize: parseInt(newAward[1].join("")),
            thirdPrize: parseInt(newAward[2].join("")),
          },
        ]);

        setNumbers(newAward);
      }
    };

    fetchOrGenerateAward();
  }, []);

  if (!numbers.length) return <div>Loading...</div>;

  return (
    <div className='flex flex-col items-center gap-6 py-6 text-white'>
      <div className='text-3xl font-bold text-yellow-400'>🎉 JACKPOT 🎉</div>

      {/* 🥇 First Prize */}
      <div className='text-center w-fit max-w-md scale-125 mb-10'>
        <div className='text-2xl font-extrabold text-yellow-400 mb-2'>1st Prize</div>
        <DigitPanel digits={numbers[0]} delay={0} />
      </div>

      {/* 🥈 Second & Third Prize */}
      <div className='items-center  grid grid-cols-2 gap-20 relative scale-100'>
        
        <div className='text-center'>
          <div className='text-xl font-bold text-yellow-300 mb-2'>
            2nd Prize
          </div>
          <DigitPanel digits={numbers[1]} delay={100} />
        </div>
        <div className='text-center'>
          <div className='text-xl font-bold text-yellow-200 mb-2'>
            3rd Prize
          </div>
          <DigitPanel digits={numbers[2]} delay={200} />
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
