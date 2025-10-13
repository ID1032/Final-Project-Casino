'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Search, Settings, User, Coins, PlusCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function SiteHeader() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <>
      <header className='bg-[#2D1E0C] h-16 flex items-center justify-between px-6 gap-5'>
        {/* Mobile Sidebar Trigger */}
        <div className='md:hidden'>
          <SidebarTrigger className='text-white hover:bg-[#A0522D]' />
        </div>

        {/* Search Bar */}
        <div className='flex-1'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
            <Input
              type='text'
              placeholder='Search'
              className='pl-10 pr-4 py-2  border-[#67533C] text-white placeholder:text-gray-400 rounded-full h-10 w-full'
            />
          </div>
        </div>

        {/* Right side buttons and settings */}
        <div className='flex items-center gap-3'>
          {isLoading ? (
            // Show loading state
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-gray-600 rounded-full animate-pulse'></div>
              <Button
                variant='ghost'
                size='icon'
                className='text-gray-400 hover:text-white hover:bg-[#A0522D] rounded-lg'
              >
                <Settings className='h-8 w-8' />
              </Button>
            </div>
          ) : isAuthenticated ? (
            // Show user avatar (no dropdown) when logged in; actions moved to sidebar
            <div className='flex items-center gap-3'>
              {/* Coin balance pill */}
              <Button
                variant='outline'
                className='bg-[#4C3519] border-[#67533C] text-white rounded-lg px-4 py-2 h-10 flex items-center gap-2'
              >
                <Coins className='h-4 w-4 text-[#F5A524]' />
                <span className='font-semibold tracking-wider'>888,888</span>
              </Button>
              {/* Deposit button */}
              <Link href='/deposit'>
                <Button className='bg-[#DA7814] hover:brightness-110 text-white rounded-lg px-5 py-2 h-10 flex items-center gap-2'>
                  <PlusCircle className='h-5 w-5 opacity-90' />
                  <span className='font-semibold'>Deposit</span>
                </Button>
              </Link>
              <div className='relative h-8 w-8 rounded-full'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
                  <AvatarFallback className='bg-[#8B4513] text-white'>
                    {user?.name?.charAt(0)?.toUpperCase() || (
                      <User className='h-4 w-4' />
                    )}
                  </AvatarFallback>
                </Avatar>
              </div>
              <Button
                variant='ghost'
                size='icon'
                className='text-gray-400 hover:text-white hover:bg-[#A0522D] rounded-lg'
              >
                <Settings className='h-5 w-5' />
              </Button>
            </div>
          ) : (
            // Show login/signup buttons when not authenticated
            <>
              <Link href='/login'>
                <Button
                  variant='outline'
                  className='bg-[#8B4513] border-[#8B4513] text-white hover:bg-[#A0522D] rounded-lg px-4 py-2'
                >
                  Log in
                </Button>
              </Link>
              <Button
                variant='ghost'
                size='icon'
                className='text-gray-400 hover:text-white hover:bg-[#A0522D] rounded-lg'
              >
                <Settings />
              </Button>
            </>
          )}
        </div>
      </header>
    </>
  );
}
