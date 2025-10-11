'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Search, Settings, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
            // Show user avatar and dropdown when logged in
            <div className='flex items-center gap-3'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='relative h-8 w-8 rounded-full hover:bg-[#A0522D]'
                  >
                    <Avatar className='h-8 w-8'>
                      <AvatarImage
                        src={user?.image || ''}
                        alt={user?.name || ''}
                      />
                      <AvatarFallback className='bg-[#8B4513] text-white'>
                        {user?.name?.charAt(0)?.toUpperCase() || (
                          <User className='h-4 w-4' />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className='w-56 bg-black border-[#8B4513]'
                  align='end'
                  forceMount
                >
                  <div className='flex items-center justify-start gap-2 p-2'>
                    <div className='flex flex-col space-y-1 leading-none'>
                      {user?.name && (
                        <p className='font-medium text-white'>{user.name}</p>
                      )}
                      {user?.email && (
                        <p className='w-[200px] truncate text-sm text-gray-400'>
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuItem className='text-white hover:bg-[#A0522D] cursor-pointer'>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className='text-white hover:bg-[#A0522D] cursor-pointer'>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className='text-white hover:bg-[#A0522D] cursor-pointer'
                    onClick={() => signOut()}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
