/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Card, CardContent } from '../../../../components/ui/card';
import Calabash from '../image/Calabash.svg';
import CalabashH from '../image/Calabash.svg';
import Crab from '../image/Crab.svg';
import CrabH from '../image/Crab.svg';
import Fish from '../image/Fish.svg';
import FishH from '../image/FishH.svg';
import Chicken from '../image/Chicken.svg';
import ChickenH from '../image/ChickenH.svg';
import Shrimp from '../image/Shrimp.svg';
import ShrimpH from '../image/ShrimpH.svg';
import Tiger from '../image/Tiger.svg';
import TigerH from '../image/TigerH.svg';
import ModalBet from './ModalBet';
import Link from 'next/link';
import Image from 'next/image';
import Home from '../image/home.svg';
import Rule from '../image/rulesFantan.svg';
import Modal from '@/components/ui/rules';
import { useState, useEffect } from 'react';
import Coin from '../image/Coin.svg';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {Weight_IF_WIN, INITIAL_POINTS} from '@/app/games/fish-prawn-crab/summary/Config_fish';

interface Items {
  id: number;
  name: string;
  backgroundImage: any;
  backgroundHover: any;
  slug: string;
  bet: number;
}

const itemsU: Items[] = [
  {
    id: 1,
    name: 'Calabash',
    backgroundImage: Calabash,
    backgroundHover: CalabashH,
    slug: 'calabash',
    bet: 0,
  },
  {
    id: 2,
    name: 'Crab',
    backgroundImage: Crab,
    backgroundHover: CrabH,
    slug: 'crab',
    bet: 0,
  },
  {
    id: 3,
    name: 'Fish',
    backgroundImage: Fish,
    backgroundHover: FishH,
    slug: 'fish',
    bet: 0,
  },
];

const itemsB: Items[] = [
  {
    id: 4,
    name: 'Chicken',
    backgroundImage: Chicken,
    backgroundHover: ChickenH,
    slug: 'chicken',
    bet: 0,
  },
  {
    id: 5,
    name: 'Shrimp',
    backgroundImage: Shrimp,
    backgroundHover: ShrimpH,
    slug: 'shrimp',
    bet: 0,
  },
  {
    id: 6,
    name: 'Tiger',
    backgroundImage: Tiger,
    backgroundHover: TigerH,
    slug: 'tiger',
    bet: 0,
  },
];

const getSrc = (img: any) => (typeof img === 'string' ? img : (img?.src ?? ''));

export default function PlayRoom() {
  const supabase = createClient();
  const router = useRouter();

  const [balance, setBalance] = useState<number | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [pendingBet, setPendingBet] = useState<number>(0);

  const items = [...itemsU, ...itemsB];
  const [bets, setBets] = useState<number[]>(() => Array(items.length).fill(0));

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        if (!user) return;

        const { data: existingRow, error: fetchError } = await supabase
          .from('point')
          .select('points')
          .eq('id', user.id)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!existingRow) {
          const { data: newRow, error: insertError } = await supabase
            .from('point')
            .insert({ id: user.id, points: INITIAL_POINTS })
            .select()
            .maybeSingle();

          if (insertError) throw insertError;

          setBalance(newRow?.points ?? INITIAL_POINTS);
        } else {
          setBalance(existingRow.points);
        }
      } catch (error) {
        // console.log(error);
        setBalance(INITIAL_POINTS);
      }
    };

    fetchBalance();
  }, [supabase]);

  const handleSelect = (item: any) => {
    setSelected(item);
    const idx = items.findIndex(i => i.id === item.id);
    setPendingBet(bets[idx] || 0);
    setOpen(true);
  };

  const handleConfirm = (value: number): boolean => {
    if (!selected) return false;

    const idx = items.findIndex(i => i.id === selected.id);
    if (idx === -1) return false;

    const newBetPoints = value * Weight_IF_WIN;
    const prevBetPoints = (bets[idx] ?? 0) * Weight_IF_WIN;

    const currentTotalPoints = bets.reduce(
      (sum, b) => sum + b * Weight_IF_WIN,
      0
    );
    const newTotalPoints = currentTotalPoints - prevBetPoints + newBetPoints;

    const available = typeof balance === 'number' ? balance : 0;
    if (newTotalPoints > available) {
      return false;
    }

    setBets(prev => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });

    setOpen(false);
    return true;
  };

  const handleConfirmAll = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const payload = items.map(
      it => bets[items.findIndex(i => i.id === it.id)] || 0
    );
    router.push(
      `/games/fish-prawn-crab/summary?bets=${encodeURIComponent(JSON.stringify(payload))}`
    );
  };

  return (
    <main className='relative min-h-screen flex items-center justify-center bg-[#2D1C0C]'>
      <Link
        href='/'
        className='absolute top-[1vw] left-[1vw] p-2 w-[4vw] h-[4vw] max-w-[50px] max-h-[50px]'
        aria-label='Back Home'
      >
        <Image
          src={Home}
          alt='Home'
          fill
          className='cursor-pointer hover:scale-110 transition-transform duration-200'
        />
      </Link>
      <div className='flex flex-col justify-center items-center'>
        <div className='grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 pb-5 pt-10 pl-10 pr-10 items-start gap-[5vw]'>
          {itemsU.map((it, index) => (
            <Card
              key={it.id}
              onClick={() => handleSelect(it)}
              className='items-card group relative w-[22vw] h-[22vw] max-w-[400px] max-h-[400px] cursor-pointer overflow-hidden rounded-xl transition-transform duration-300 hover:scale-105 shadow-lg'
              style={{
                animationDelay: `${index * 150}ms`,
                backgroundImage: `url(${getSrc(it.backgroundImage)})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
              title={it.name}
            >
              <CardContent className='h-full w-full p-0'>
                <div
                  className='absolute inset-0 bg-center bg-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100'
                  style={{
                    backgroundImage: `url(${getSrc(it.backgroundHover)})`,
                  }}
                />
                {bets[items.findIndex(i => i.id === it.id)] > 0 && (
                  <span className='absolute bottom-3 right-3 flex items-center gap-1 bg-black text-white text-sm px-2 py-1 rounded-full'>
                    <Image
                      src={Coin}
                      alt='coin'
                      width={18}
                      height={18}
                      className='inline-block'
                    />
                    {bets[items.findIndex(i => i.id === it.id)]}
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className='grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 pb-5 pt-10 pl-10 pr-10 items-start gap-[5vw]'>
          {itemsB.map((it, index) => (
            <Card
              key={it.id}
              onClick={() => handleSelect(it)}
              className='items-card group relative w-[22vw] h-[22vw] max-w-[400px] max-h-[400px] cursor-pointer overflow-hidden rounded-xl transition-transform duration-300 hover:scale-105 shadow-lg'
              style={{
                animationDelay: `${index * 150}ms`,
                backgroundImage: `url(${getSrc(it.backgroundImage)})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
              title={it.name}
            >
              <CardContent className='h-full w-full p-0'>
                <div
                  className='absolute inset-0 bg-center bg-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100'
                  style={{
                    backgroundImage: `url(${getSrc(it.backgroundHover)})`,
                  }}
                />
                {bets[items.findIndex(i => i.id === it.id)] > 0 && (
                  <span className='absolute bottom-3 right-3 flex items-center gap-1 bg-black text-white text-sm px-2 py-1 rounded-full'>
                    <Image
                      src={Coin}
                      alt='coin'
                      width={18}
                      height={18}
                      className='inline-block'
                    />
                    {bets[items.findIndex(i => i.id === it.id)]}
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <div>
          <button
            onClick={handleConfirmAll}
            className='px-4 py-2 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600'
          >
            Confirm
          </button>
        </div>
      </div>
      <button
        onClick={() => setIsRulesOpen(true)}
        className='absolute top-[1vw] right-[1vw] p-2 w-[4vw] h-[4vw] max-w-[50px] max-h-[50px]'
        aria-label='Open rules'
      >
        <Image
          src={Rule}
          alt='Rules'
          fill
          className='cursor-pointer hover:scale-110 transition-transform duration-200'
        />
      </button>

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
                (Gourd), Crab, Fish, Tiger, Shrimp, Chicken.
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
      <ModalBet
        open={open}
        close={() => setOpen(false)}
        selected={selected}
        initial={pendingBet}
        onConfirm={handleConfirm}
      />
    </main>
  );
}
