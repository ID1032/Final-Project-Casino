'use client';

import { Coins, Gamepad2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Card, CardContent } from '@/components/ui/card';
import { useMenu } from '@/contexts/menu-context';

// Import SVG images
import FishPrawnCrabSvg from './fish-pawn-crab.svg';
import HiLoSvg from './hi-lo.svg';
import MahjongSvg from './mohjong.svg';
import PaiGowSvg from './pai-gow.svg';
import FanTanSvg from './fan-tan.svg';
import PachinkoSvg from './pachinko.svg';
import GoStopSvg from './go-stop.svg';

const games = [
  {
    id: 1,
    name: 'Fish Prawn Crab',
    type: 'CARD',
    backgroundImage: FishPrawnCrabSvg,
  },
  {
    id: 2,
    name: 'Hi-Lo',
    type: 'CARD',
    backgroundImage: HiLoSvg,
  },
  {
    id: 3,
    name: 'Mahjong',
    type: 'CARD',
    backgroundImage: MahjongSvg,
    description: 'Classic tile matching game',
  },
  {
    id: 4,
    name: 'Pai Gow',
    type: 'CARD',
    backgroundImage: PaiGowSvg,
    icon: Coins,
  },
  {
    id: 5,
    name: 'Fan Tan',
    type: 'CARD',
    backgroundImage: FanTanSvg,
  },
  {
    id: 6,
    name: 'Pachinko',
    type: 'SLOT',
    backgroundImage: PachinkoSvg,
  },
  {
    id: 7,
    name: 'Go-Stop',
    type: 'CARD',
    backgroundImage: GoStopSvg,
  },
];

export function SectionGames() {
  const { selectedMenu } = useMenu();
  const router = useRouter();

  const goToGame = (name: string) => {
    // Map game names to routes
    switch (name) {
      case 'Fish Prawn Crab':
        router.push('/games/fish-prawn-crab');
        return;
      case 'Hi-Lo':
        router.push('/games/hi-lo');
        return;
      case 'Mahjong':
        router.push('/games/mahjong');
        return;
      case 'Pai Gow':
        router.push('/games/pai-gow');
        return;
      case 'Fan Tan':
        router.push('/games/fan-tan');
        return;
      case 'Pachinko':
        router.push('/games/pachinko');
        return;
      case 'Go-Stop':
        router.push('/games/go-stop');
        return;
      default:
        return;
    }
  }

  const filteredGames = (() => {
    if (selectedMenu === 'MAIN') {
      return games;
    } else if (selectedMenu === 'RANDOM') {
      // Shuffle array and take first 3 games
      const shuffled = [...games].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 3);
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
                <Card
                  key={`${game.id}-${selectedMenu}`}
                  className='group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg game-card'
                  style={{
                    animationDelay: `${index * 80}ms`,
                  }}
                  onClick={() => goToGame(game.name)}
                >
                  <CardContent
                    className='p-8 text-white rounded-lg h-48 flex flex-col justify-between relative overflow-hidden'
                    style={{
                      backgroundImage: `url(${game.backgroundImage.src})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                      onClick={() => goToGame(game.name)}
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
              );
            })}
          </div>

          {/* Second Row - 4 cards (hidden for RANDOM mode) */}
          {selectedMenu !== 'RANDOM' && (
            <div className='grid grid-cols-1 gap-[19px] sm:grid-cols-2 lg:grid-cols-4'>
              {filteredGames.slice(3, games.length).map((game, index) => {
                return (
                  <Card
                    key={`${game.id}-${selectedMenu}`}
                    className='group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg game-card'
                    style={{
                      animationDelay: `${(index + 3) * 80}ms`,
                    }}
                  >
                    <CardContent
                      className='p-6 text-white rounded-lg h-36 flex flex-col justify-between relative overflow-hidden'
                      style={{
                        backgroundImage: `url(${game.backgroundImage.src})`,
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
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
