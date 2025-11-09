/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SummaryModal from '@/components/ui/summary';
import DiceResultModal from '@/components/ui/dice-result';
import Modal from '@/components/ui/rules';

export default function Summary() {
  const router = useRouter();
  const sp = useSearchParams();


  const bets = useMemo<number[]>(() => {
    const raw = sp.get('bets');
    try {
      return raw ? JSON.parse(decodeURIComponent(raw)) : [];
    } catch {
      return [];
    }
  }, [sp]);

  const animals = useMemo(
    () => ['Calabash', 'Crab', 'Fish', 'Tiger', 'Shrimp', 'Chicken'],
    []
  );

  const [dice, setDice] = useState<string[]>([]);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isDiceOpen, setIsDiceOpen] = useState(false);

  useEffect(() => {
    console.log('🎲 ค่า bets ปัจจุบัน:', bets);
    const hasBet = bets.some(v => Number(v) > 0);
    if (!hasBet) return;
    if (dice.length > 0 || isResultOpen || isDiceOpen) return;

    const rolled = Array.from(
      { length: 3 },
      () => animals[Math.floor(Math.random() * animals.length)]
    );

    setDice(rolled);
    setIsDiceOpen(true);
  }, [bets, dice, isResultOpen, isDiceOpen, animals]);

  const resultItems = useMemo(() => {
    const items = animals.map((label, index) => {
      const stake = bets[index] || 0;
      const count = dice.filter(a => a === label).length;
      const payout = count > 0 ? count * stake : -stake;
      return { label, points: payout };
    });
    return items;
  }, [bets, dice, animals]);

  return (
    <>
      {/* Dice result modal */}
      <DiceResultModal
        isOpen={isDiceOpen}
        dice={dice}
        onClose={() => setIsDiceOpen(false)}
        onSummary={() => {
          setIsDiceOpen(false);
          setIsResultOpen(true);
        }}
      />

      {/* Summary modal */}
      <SummaryModal
        isOpen={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        onPlayAgain={() => {
          router.push('/games/fish-prawn-crab/mode');
        }}
        onExit={() => router.push('/dashboard')}
        items={resultItems}
      // total={totalPoints}
      />

      {/* Rules modal */}
      <Modal
        title='Hoo Hey How (Fish-Prawn-Crab) Rules'
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10'>
          <div>
            <h3 className='text-lg font-semibold mb-4'>Equipment</h3>
            <ul className='space-y-3 text-md leading-6'>
              <li>
                - Three dice, each face marked with six animals: Calabash
                (Gourd), Crab, Fish, Tiger, Shrimp, Rooster.
              </li>
              <li>- A betting board showing the six animal symbols.</li>
            </ul>

            <h3 className='text-lg font-semibold mt-8 mb-4'>How to Play</h3>
            <ul className='space-y-3 text-md leading-6'>
              <li>
                - Players place bets on the animal(s) they think will appear.
              </li>
              <li>- The dealer shakes all three dice together.</li>
            </ul>
          </div>

          <div className='md:border-l md:pl-10 border-gray-200'>
            <h3 className='text-lg font-semibold mb-4'>Winning Conditions</h3>
            <ul className='space-y-3 text-md leading-6'>
              <li>
                - If the chosen animal appears on the dice → the player wins and
                gets a payout.
              </li>
              <li>- If it doesn’t appear at all → the player loses the bet.</li>
            </ul>

            <h3 className='text-lg font-semibold mt-8 mb-4'>
              Payouts (Typical)
            </h3>
            <ul className='space-y-3 text-md leading-6'>
              <li>1 matching dice → 1:1 payout</li>
              <li>2 matching dice → 1:2 payout</li>
              <li>3 matching dice → 1:3 payout</li>
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
}
