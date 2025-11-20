"use client";
import { useMemo, useState } from 'react';
import Modal from '@/components/ui/rules';
import SummaryModal from '@/components/ui/summary';
import { useRouter } from 'next/navigation';
import DiceResultModal from '@/components/ui/dice-result';
import { Random_Dice } from '@/app/games/fish-prawn-crab/Random_Dice';
import { Check_Betting_Results } from '@/app/games/fish-prawn-crab/Check_Betting_Results';

export default function FishPrawnCrabPage() {
  const router = useRouter();
  const [isRulesOpen, setisRulesOpen] = useState(false);

  // Simple demo bet amounts, will be replace later
  const bets = useMemo<Record<string, number>>(
    () => ({
      Chicken: 100,
      Shrimp: 500,
      Calabash: 300,
    }),
    []
  );

  const animals = useMemo(
    () => ['Calabash', 'Crab', 'Fish', 'Tiger', 'Shrimp', 'Chicken'],
    []
  );

  const [diceIndexes, setDiceIndexes] = useState<number[]>([]);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isDiceOpen, setIsDiceOpen] = useState(false);

  const diceFaces = useMemo<string[]>(() => {
    if (diceIndexes.length === 3) {
      return diceIndexes.map(index => animals[index] ?? '');
    }
    return Array(3).fill('');
  }, [diceIndexes, animals]);

  const betArray = useMemo<number[]>(() => {
    return animals.map(label => bets[label] ?? 0);
  }, [animals, bets]);

  //For generate dice result, This is for test roll dice modal(may have to adjust)
  const rollDice = () => {
    const next = Random_Dice();
    setDiceIndexes(next);
    setIsDiceOpen(true);
  };

  //Calculate result, if match more than 1 will points will be multiply by the number that match
  const resultItems = useMemo(() => {
    if (diceIndexes.length !== 3) {
      return animals.map(label => ({ label, points: 0 }));
    }
    const results = Check_Betting_Results([...diceIndexes], betArray);
    return animals.map((label, index) => ({
      label,
      points: results[index] ?? 0,
    }));
  }, [animals, diceIndexes, betArray]);

  return (
    <div>
      <div className='flex justify-end items-center mt-2 px-4'>
        <button onClick={() => setisRulesOpen(true)} className='mr-5'>
          <i className='fa-solid fa-question px-2 py-1 text-white text-xl rounded-full border-2 border-white '></i>
        </button>
      </div>

      {/* Roll dice button for test dice result modal, will have to connect this button to confirm button from popup bet*/}
      <div className='flex justify-center items-center mt-20 px-4'>
        <button
          onClick={rollDice}
          className='px-4 py-2 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600'
        >
          Roll dice
        </button>
      </div>

      {/* Rules modal */}
      <Modal
        title='Hoo Hey How (Fish-Prawn-Crab) Rules'
        isOpen={isRulesOpen}
        onClose={() => setisRulesOpen(false)}
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
          setDiceIndexes([]);
        }}
        onExit={() => router.push('/dashboard')}
        items={resultItems}
      />
    </div>
  );
}
