/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

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
  onConfirm: (val: number) => void;
}) {
  const [val, setVal] = useState<number | ''>(initial as number | '');
  useEffect(() => {
    if (open) setVal(initial as number | '');
  }, [open, initial]);

  if (!open || !selected) return null;
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
          <h2 className='text-3xl sm:text-5xl font-extrabold text-black'>
            {selected.name}
          </h2>
        </div>

        <div className='mt-6 flex items-center gap-3 sm:gap-4 justify-center'>
          <span className='text-2xl sm:text-3xl font-semibold text-black'>
            5 Points
          </span>
          <span className='text-2xl sm:text-3xl text-black'>X</span>
          <input
            type='number'
            inputMode='numeric'
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
              if (val === '' || (typeof val === 'number' && isNaN(val))) setVal(0);
            }}
            className='h-11 sm:h-12 w-28 sm:w-32 rounded-xl border px-3 text-xl text-center bg-[#2b1f16] text-white 
             [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
            placeholder='0'
          />
        </div>

        <div className='mt-6 flex justify-center'>
          <button
            onClick={() => onConfirm(typeof val === 'number' ? val : 0)}
            className='px-6 py-2 rounded-full bg-emerald-500 text-white font-semibold hover:brightness-110'
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
