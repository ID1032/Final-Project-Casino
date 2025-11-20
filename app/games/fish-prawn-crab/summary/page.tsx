/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SummaryModal from '@/components/ui/summary';
import DiceResultModal from '@/components/ui/dice-result';
import Modal from '@/components/ui/rules';
import { Random_Dice } from '@/app/games/fish-prawn-crab/Random_Dice';
import { Check_Betting_Results } from '@/app/games/fish-prawn-crab/Check_Betting_Results';

export default function Summary() {
  const router = useRouter();
  const sp = useSearchParams();


  const bets = useMemo<number[]>(() => {
    const raw = sp.get('bets');
    try {
      const parsed = raw ? JSON.parse(decodeURIComponent(raw)) : [];
      return Array.isArray(parsed) ? parsed.map(Number) : [];
    } catch {
      return [];
    }
  }, [sp]);

  const normalizedBets = useMemo<number[]>(() => {
    const base = Array(6).fill(0);
    bets.forEach((value, index) => {
      if (index < base.length) {
        const amount = Number(value);
        base[index] = Number.isFinite(amount) ? amount : 0;
      }
    });
    return base;
  }, [bets]);

  const animals = useMemo(
    () => ['Calabash', 'Crab', 'Fish', 'Tiger', 'Shrimp', 'Chicken'],
    []
  );

  const [diceIndexes, setDiceIndexes] = useState<number[]>([]);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isDiceOpen, setIsDiceOpen] = useState(false);

  const diceFaces = useMemo<string[]>(() => {
    if (diceIndexes.length === 3) {
      return diceIndexes.map(index => animals[index] ?? '');
    }
    return Array(3).fill('');
  }, [diceIndexes, animals]);

  useEffect(() => {
    console.log('🎲 ค่า bets ปัจจุบัน:', bets);
    const hasBet = normalizedBets.some(v => Number(v) > 0);
    if (!hasBet) return;
    if (diceIndexes.length > 0 || isResultOpen || isDiceOpen) return;

    const rolled = Random_Dice();
    setDiceIndexes(rolled);
    setIsDiceOpen(true);
  }, [normalizedBets, diceIndexes, isResultOpen, isDiceOpen]);

  const summaryItems = useMemo(() => {
    if (diceIndexes.length !== 3) {
      return animals.map(label => ({ label, points: 0 }));
    }
    const results = Check_Betting_Results([...diceIndexes], normalizedBets);
    return animals.map((label, index) => ({
      label,
      points: results[index] ?? 0,
    }));
  }, [animals, diceIndexes, normalizedBets]);

  return (
    <>
      {/* Dice result modal */}
      <DiceResultModal
        isOpen={isDiceOpen}
        dice={diceFaces}
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
        items={summaryItems}
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
