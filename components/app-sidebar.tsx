'use client';

import * as React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Diamond,
  Dice3,
  LayoutGrid,
  Target,
  User,
  Users,
  HelpCircle,
  LogOut,
} from 'lucide-react';

import { NavMain } from '@/app/home/nav-main';
import { LanguageSelector, Language } from '@/app/home/language-selector';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import Logo from '@/assets/logo.svg';
import { useAuth, handleSignOut } from '@/lib/auth';

const data = {
  navMain: [
    {
      id: 'MAIN',
      title: 'MAIN',
      url: '#',
      icon: LayoutGrid,
    },
    {
      id: 'CARD',
      title: 'CARD',
      url: '#',
      icon: Diamond,
    },
    {
      id: 'RANDOM',
      title: 'RANDOM',
      url: '#',
      icon: Dice3,
    },
    {
      id: 'SLOT',
      title: 'SLOT',
      url: '#',
      icon: Target,
    },
  ],
};

const languages: Language[] = [
  { code: 'en', name: 'ENGLISH', flag: '🇬🇧' },
  { code: 'es', name: 'ESPAÑOL', flag: '🇪🇸' },
  { code: 'fr', name: 'FRANÇAIS', flag: '🇫🇷' },
  { code: 'de', name: 'DEUTSCH', flag: '🇩🇪' },
];

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  hideContent?: boolean;
};

export function AppSidebar({ hideContent = false, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  return (
    <Sidebar collapsible='offcanvas' className='px-[32px]' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className='h-full hover:bg-transparent'>
              <a href='#' className='flex items-center justify-center gap-3'>
                <Image src={Logo} alt='Logo' height={70} />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* GAMES/LOTTERY Tabs */}
        <div className='pb-[16px]'>
          <div className='flex gap-2 bg-amber-900 rounded-full'>
            <Link href='/home' className='flex-1'>
              <span
                className={
                  `block text-center px-3 py-2 text-white text-sm font-bold uppercase rounded-full ` +
                  (pathname?.startsWith('/home')
                    ? 'bg-gradient-to-t from-amber-500 to-amber-700'
                    : 'bg-amber-900 hover:bg-amber-800')
                }
              >
                GAMES
              </span>
            </Link>
            <Link href='/lottery' className='flex-1'>
              <span
                className={
                  `block text-center px-3 py-2 text-white text-sm font-bold uppercase rounded-full ` +
                  (pathname === '/lottery'
                    ? 'bg-gradient-to-t from-amber-500 to-amber-700'
                    : 'bg-amber-900 hover:bg-amber-800')
                }
              >
                LOTTERY
              </span>
            </Link>
          </div>
        </div>
      </SidebarHeader>

      {!hideContent && (
        <SidebarContent>
          <NavMain items={data.navMain} />
        </SidebarContent>
      )}

      <SidebarFooter className='mt-auto'>
        <div>
          <LanguageSelector languages={languages} defaultValue='en' />
          {isAuthenticated && (
            <div className='mt-3 rounded-2xl bg-[#2D1E0C] p-4 space-y-3'>
              <Link
                href='/profile'
                className='flex items-center gap-3 text-white hover:opacity-80'
              >
                <User size={18} />
                <span className='text-sm font-semibold uppercase'>Profile</span>
              </Link>
              <Link
                href='/invite'
                className='flex items-center gap-3 text-white hover:opacity-80'
              >
                <Users size={18} />
                <span className='text-sm font-semibold uppercase'>
                  Invite Friends
                </span>
              </Link>
              <Link
                href='/help'
                className='flex items-center gap-3 text-white hover:opacity-80'
              >
                <HelpCircle size={18} />
                <span className='text-sm font-semibold uppercase'>Help</span>
              </Link>
              <button
                type='button'
                onClick={handleSignOut}
                className='flex w-full items-center gap-3 text-left text-white hover:opacity-80'
              >
                <LogOut size={18} />
                <span className='text-sm font-semibold uppercase'>Logout</span>
              </button>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
