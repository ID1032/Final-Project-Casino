'use client';

import { Coins, Gamepad2 } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { useMenu } from '@/app/home/contexts/menu-context';
import Link from 'next/link';

// Import SVG images
import FishPrawnCrabSvg from './assets/fish-pawn-crab.svg';
import HiLoSvg from './assets/hi-lo.svg';
import MahjongSvg from './assets/mohjong.svg';
import PaiGowSvg from './assets/pai-gow.svg';
import FanTanSvg from './assets/fan-tan.svg';
import PachinkoSvg from './assets/pachinko.svg';
import GoStopSvg from './assets/go-stop.svg';

const games = [
  {
    id: 1,
    name: 'Fish Prawn Crab',
    type: 'RANDOM',
    backgroundImage: FishPrawnCrabSvg,
    slug: 'fish-prawn-crab',
  },
  {
    id: 2,
    name: 'Hi-Lo',
    type: 'RANDOM',
    backgroundImage: HiLoSvg,
    slug: 'hilo',
  },
  {
    id: 3,
    name: 'Mahjong',
    type: 'CARD',
    backgroundImage: MahjongSvg,
    description: 'Classic tile matching game',
    slug: 'mahjong',
  },
  {
    id: 4,
    name: 'Pai Gow',
    type: 'RANDOM',
    backgroundImage: PaiGowSvg,
    icon: Coins,
    slug: 'pai-gow',
  },
  {
    id: 5,
    name: 'Fan Tan',
    type: 'CARD',
    backgroundImage: FanTanSvg,
    slug: 'fan-tan',
  },
  {
    id: 6,
    name: 'Pachinko',
    type: 'SLOT',
    backgroundImage: PachinkoSvg,
    slug: 'pachinko',
  },
  {
    id: 7,
    name: 'Go-Stop',
    type: 'CARD',
    backgroundImage: GoStopSvg,
    slug: 'go-stop',
  },
];

export function SectionGames() {
  const { selectedMenu } = useMenu();

  const filteredGames = (() => {
    if (selectedMenu === 'MAIN') {
      return games;
    } else {
      return games.filter(game => game.type === selectedMenu);
    }
  })();

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .game-card {
          animation: fadeInUp 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      <div className='space-y-6 px-4 lg:px-6'>
        {/* Header */}
        <div className='flex items-center gap-2'>
          <Gamepad2 className='h-5 w-5 text-muted-foreground' />
          <h2 className='text-[14px] font-semibold'>
            {selectedMenu === 'MAIN' && 'All Games'}
            {selectedMenu === 'CARD' && 'Card Games'}
            {selectedMenu === 'SLOT' && 'Slot Games'}
            {selectedMenu === 'RANDOM' && 'Random Games'}
          </h2>
        </div>

        {/* Game Cards Grid - First row: 3 bigger cards, Rest rows: 4 cards each */}
        <div className='space-y-6'>
          {/* First Row - 3 bigger cards */}
          <div className='grid grid-cols-1 gap-[19px] sm:grid-cols-2 lg:grid-cols-3'>
            {filteredGames.slice(0, 3).map((game, index) => {
              return (
                <Link
                  key={`${game.id}-${selectedMenu}`}
                  href={`/games/${game.slug}`}
                >
                  <Card
                    className='group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg game-card'
                    style={{
                      animationDelay: `${index * 80}ms`,
                    }}
                  >
                    <CardContent
                      className='p-8 text-white rounded-lg h-48 flex flex-col justify-between relative overflow-hidden'
                      style={{
                        backgroundImage: `url(${(game as any).backgroundImage.src})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }}
                    >
                      {/* Dark overlay for better text readability */}
                      <div className='absolute inset-0 rounded-lg'></div>
                      <div className='relative z-10 flex flex-col justify-end h-full w-32'>
                        <div className='flex items-end justify-start'>
                          <div className='space-y-2'>
                            <h3 className='font-semibold text-3xl leading-tight'>
                              {game.name}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className='grid grid-cols-1 gap-[19px] sm:grid-cols-2 lg:grid-cols-4'>
            {filteredGames.slice(3, games.length).map((game, index) => {
              return (
                <Link
                  key={`${game.id}-${selectedMenu}`}
                  href={`/games/${game.slug}`}
                >
                  <Card
                    className='group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg game-card'
                    style={{
                      animationDelay: `${(index + 3) * 80}ms`,
                    }}
                  >
                    <CardContent
                      className='p-6 text-white rounded-lg h-36 flex flex-col justify-between relative overflow-hidden'
                      style={{
                        backgroundImage: `url(${(game as any).backgroundImage.src})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }}
                    >
                      {/* Dark overlay for better text readability */}
                      <div className='absolute inset-0 rounded-lg'></div>
                      <div className='relative z-10 flex flex-col justify-end h-full w-32'>
                        <div className='flex items-end justify-start'>
                          <div className='space-y-1'>
                            <h3 className='font-semibold text-2xl leading-tight'>
                              {game.name}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
