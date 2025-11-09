'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SectionModes } from './select-mode';
import Home from '@/app/dashboard/home.svg';
import Modal from '@/components/ui/rules';
import Rule from '@/app/dashboard/rulesFantan.svg';
import { useState } from 'react';

export default function Navbar() {
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  return (
    <div className='flex items-center '>
      <Link
        href='/'
        className='absolute top-[1vw] left-[1vw] p-2 w-[4vw] h-[4vw] max-w-[50px] max-h-[50px]'
      >
        <Image
          src={Home}
          alt='Home'
          fill
          className='cursor-pointer hover:scale-110 transition-transform duration-200'
        />
      </Link>
      <SectionModes />
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
    </div>
  );
}
