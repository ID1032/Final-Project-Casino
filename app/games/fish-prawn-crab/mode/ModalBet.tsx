/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import {INITIAL_POINTS} from '@/app/games/fish-prawn-crab/summary/Config_fish';

export default function ModalBet({
  open,
  close,
  selected,
  initial = 0,
  onConfirm,
}: {
  open: boolean;
  close: () => void;
  selected: any;
  initial?: number;
  onConfirm: (val: number) => boolean | Promise<boolean>;
}) {
  const supabase = createClient();
  const [val, setVal] = useState<number | ''>(initial as number | '');
  const [error, setError] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);


  useEffect(() => {
    if (open) {
      setVal(initial as number | '');
      setError(false);
    }
  }, [open, initial]);

  useEffect(() => {
    if (error) setError(false);
  }, [val]);

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
          // console.log(error)
          setBalance(INITIAL_POINTS);
        }
      };

      fetchBalance();
    }, [supabase]);

  if (!open || !selected) return null;

  const getPointCost = (v: number | '') =>
    typeof v === 'number' && !isNaN(v) ? v * 5 : 0;

  const handleClickConfirm = async () => {
    const numericVal = typeof val === 'number' ? val : 0;
    try {
      const result = await Promise.resolve(onConfirm(numericVal));
      if (!result) {
        setError(true);
        return;
      }
      setError(false);
    } catch (err) {
      setError(true);
      console.error('onConfirm threw error', err);
    }
  };
  
  return (
    <div
      onClick={close}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'
    >
      <div
        onClick={e => e.stopPropagation()}
        className='bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-[90%] max-w-[560px]'
      >
        <div className='flex flex-row items-center gap-25'>
          <div className='shrink-0 rounded-xl overflow-hidden'>
            <Image
              src={selected.backgroundImage ?? selected.img}
              alt={selected.name}
              width={120}
              height={120}
            />
          </div>
          <div>
            <h2 className='text-3xl sm:text-5xl font-extrabold text-black'>
              {selected.name}
            </h2>
            {error && (
              <p className='text-red-500 text-lg font-semibold mt-2'>
                Not enough points
              </p>
            )}
          </div>
        </div>

        <div className='mt-6 flex items-center gap-3 sm:gap-4 justify-center'>
          <div className='flex items-center gap-3'>
            <span className='text-2xl sm:text-3xl font-semibold text-black'>
              5 Points
            </span>
            <span className='text-2xl sm:text-3xl text-black'>X</span>
            <input
              type='number'
              inputMode='numeric'
              min={0}
              value={val}
              onChange={e => {
                const raw = e.target.value;
                if (raw === '') {
                  setVal('');
                } else {
                  const num = raw.replace(/[^0-9]/g, '');
                  setVal(Number(num));
                }
              }}
              onBlur={() => {
                if (val === '' || (typeof val === 'number' && isNaN(val)))
                  setVal(0);
              }}
              className='h-11 sm:h-12 w-28 sm:w-32 rounded-xl border px-3 text-xl text-center bg-[#2b1f16] text-white 
               [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
              placeholder='0'
            />
          </div>
        </div>
        <div className='mt-4 flex flex-col items-center'>
          <div className='text-sm text-gray-600'>
            <span>Will cost: </span>
            <span className='font-semibold'>{getPointCost(val)} points</span>
          </div>

          <div className='mt-1 text-sm text-gray-600'>
            <span>Current Balance: </span>
            <span className='font-semibold'>
              {balance !== null ? balance.toLocaleString() : 'Loading...'}{' '}
              points
            </span>
          </div>
        </div>

        <div className='mt-6 flex flex-col items-center gap-3'>
          <div className='flex gap-3'>
            <button
              onClick={handleClickConfirm}
              className='px-6 py-2 rounded-full bg-emerald-500 text-white font-semibold hover:brightness-110'
            >
              Confirm
            </button>

            <button
              onClick={() => {
                setError(false);
                close();
              }}
              className='px-6 py-2 rounded-full bg-red-600 text-white font-semibold hover:brightness-95'
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}