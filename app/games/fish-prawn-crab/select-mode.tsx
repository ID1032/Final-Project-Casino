/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

// Import image
import Player from '@/app/dashboard/player.svg';
import Dealer from '@/app/dashboard/dealer.svg';
import DealerHover from '@/app/dashboard/Dealer_hover.svg';

interface Mode {
  id: number;
  name: string;
  backgroundImage: any;
  backgroundHover: any;
  slug: string;
}

const modes: Mode[] = [
  {
    id: 1,
    name: 'Player',
    backgroundImage: Player,
    backgroundHover: Player,
    slug: 'player',
  },
  {
    id: 2,
    name: 'Dealer',
    backgroundImage: Dealer,
    slug: 'dealer',
    backgroundHover: DealerHover,
  },
];

export function SectionModes() {
  return (
    <>
      <div className=' flex justify-center items-center gap-[5vw] min-h-screen' >
        {modes.map((modes, index) =>
          modes.slug === 'dealer' ? (
            <Card
              key={modes.id}
              className='modes-card group relative w-[35vw] h-[49vw] max-w-[550px] max-h-[760px] cursor-not-allowed overflow-hidden rounded-xl '
              style={{
                animationDelay: `${index * 150}ms`,
                backgroundImage: `url(${modes.backgroundImage.src})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
              title='Dealer mode is not open now'
            >
              <CardContent className='h-full w-full p-0'>
                <div
                  className='absolute inset-0 bg-center bg-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100'
                  style={{
                    backgroundImage: `url(${modes.backgroundHover.src})`,
                  }}
                ></div>
              </CardContent>
            </Card>
          ) : (
            <Link
              key={modes.id}
              href={`/games/fish-prawn-crab/mode`}
            >
              <Card
                className='modes-card group relative w-[35vw] h-[49vw] max-w-[550px] max-h-[760px] cursor-pointer overflow-hidden rounded-xl transition-transform duration-300 hover:scale-105 shadow-lg'
                style={{
                  animationDelay: `${index * 150}ms`,
                  backgroundImage: `url(${modes.backgroundImage.src})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }}
              >
              </Card>
            </Link>
          )
        )}
      </div>
    </>
  );
}
