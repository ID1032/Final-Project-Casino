'use client';
import { useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SummaryModal from '@/components/ui/summary';
import DiceResultModal from '@/components/ui/dice-result';
import Modal from '@/components/ui/rules';
import { Random_Dice } from '@/app/games/fish-prawn-crab/Random_Dice';
import { createClient } from '@/lib/supabase/client';
import { Weight_IF_WIN, Weight_FOR_BET, INITIAL_POINTS } from './Config_fish';

export default function Summary() {
  const router = useRouter();
  const sp = useSearchParams();
  const supabase = createClient();
  const [userPoints, setUserPoints] = useState<number | null>(null);

  // --- parse bets from query ---
  const parsedBets = useMemo<number[]>(() => {
    const raw = sp.get('bets');
    try {
      const parsed = raw ? JSON.parse(decodeURIComponent(raw)) : [];
      return Array.isArray(parsed) ? parsed.map(Number) : [];
    } catch (err) {
      console.error('Error parsing bets from query:', err);
      return [];
    }
  }, [sp]);

  // --- normalized bets length 6 (index mapping must match PlayRoom items) ---
  const normalizedBets = useMemo<number[]>(() => {
    const base = Array(6).fill(0);
    parsedBets.forEach((value, index) => {
      if (index < base.length) {
        const amount = Number(value);
        base[index] = Number.isFinite(amount) ? amount : 0;
      }
    });
    return base;
  }, [parsedBets]);

  // IMPORTANT: ensure this order matches PlayRoom items order
  const animals = useMemo(
    () => ['Calabash', 'Crab', 'Fish', 'Chicken', 'Shrimp', 'Tiger'],
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

  // --- fetch user points ---
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        if (!user) return;

        const { data: pointRow, error } = await supabase
          .from('point')
          .select('points')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (!pointRow) {
          const { data: newRow } = await supabase
            .from('point')
            .insert({ id: user.id, points: INITIAL_POINTS })
            .select()
            .maybeSingle();
          setUserPoints(newRow?.points ?? INITIAL_POINTS);
        } else {
          setUserPoints(pointRow.points ?? INITIAL_POINTS);
        }
      } catch (err) {
        console.error('Error fetching user points:', err);
        setUserPoints(INITIAL_POINTS);
      }
    };

    fetchPoints();
  }, [supabase]);

  // --- roll dice when bets present ---
  useEffect(() => {
    const hasBet = normalizedBets.some(v => Number(v) > 0);
    if (!hasBet || diceIndexes.length > 0 || isResultOpen || isDiceOpen) return;

    const rolled = Random_Dice();
    setDiceIndexes(rolled);
    setIsDiceOpen(true);
  }, [normalizedBets, diceIndexes, isResultOpen, isDiceOpen]);

  // --- compute summaryItems: results should be "matches count" per animal (0..3) ---
  const summaryItems = useMemo(() => {
    if (diceIndexes.length !== 3) {
      return animals.map(label => ({ label, points: 0 }));
    }

    // Count matches
    const matches = Array(animals.length).fill(0);
    diceIndexes.forEach(idx => {
      if (idx >= 0 && idx < matches.length) matches[idx] += 1;
    });

    return animals.map((label, index) => ({
      label,
      points: matches[index],
    }));
  }, [animals, diceIndexes]);

  // --- update points using matches (1->1x, 2->2x, 3->3x) ---
  const [individualResults, setIndividualResults] = useState<
    { label: string; bet: number; matches: number; points: number }[]
  >([]);
  const handleUpdatePoints = async () => {
    if (userPoints === null) return;

    const results = summaryItems.map((item, idx) => {
      const bet = normalizedBets[idx] ?? 0;
      const matches = item.points ?? 0;
      const points =
        bet > 0
          ? matches === 0
            ? bet * Weight_FOR_BET
            : bet * matches * Weight_IF_WIN
          : 0;
      return { label: item.label, bet, matches, points };
    });

    console.table(results);

    const totalWin = results.reduce((sum, r) => sum + r.points, 0);
    const newPoints = Math.max((userPoints ?? 0) + totalWin, 0);

    try {
      const { error } = await supabase
        .from('point')
        .update({ points: newPoints })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (!error) setUserPoints(newPoints);
    } catch (err) {
      console.error(err);
    }

    setIndividualResults(results);
  };

  return (
    <>
      <DiceResultModal
        isOpen={isDiceOpen}
        dice={diceFaces}
        onClose={() => setIsDiceOpen(false)}
        onSummary={() => {
          setIsDiceOpen(false);
          setIsResultOpen(true);
          handleUpdatePoints(); // update points when opening summary
        }}
      />

      <SummaryModal
        isOpen={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        onPlayAgain={() => router.push('/games/fish-prawn-crab/mode')}
        onExit={() => router.push('/home')}
        items={individualResults}
      />

      <Modal
        title='Hoo Hey How (Fish-Prawn-Crab) Rules'
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      >
        {/* rules content unchanged */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10'>
          <div>
            <h3 className='text-lg font-semibold mb-4'>Equipment</h3>
            <ul className='space-y-3 text-md leading-6'>
              <li>
                - Three dice, each face marked with six animals: Calabash
                (Gourd), Crab, Fish, Chicken, Shrimp, Tiger.
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

      {/* <div className='absolute top-20 left-10 text-white font-bold text-xl'>
        Current Points: {userPoints ?? 'Loading...'}
      </div> */}
    </>
  );
}
