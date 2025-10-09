'use client';

import * as React from 'react';

import Image from 'next/image';

import { Diamond, Dice3, LayoutGrid, Target } from 'lucide-react';

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
            <button className='flex-1 px-3 py-2 bg-gradient-to-t from-amber-500 to-amber-700 text-white text-sm font-bold uppercase rounded-full'>
              GAMES
            </button>
            <button className='flex-1 px-3 py-2 bg-amber-900 text-white text-sm font-bold uppercase rounded-full'>
              LOTTERY
            </button>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <div>
          <LanguageSelector languages={languages} defaultValue='en' />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
