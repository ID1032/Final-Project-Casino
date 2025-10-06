'use client';

import { LucideIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useMenu } from '@/contexts/menu-context';

export function NavMain({
  items,
}: {
  items: {
    id: string;
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const { selectedMenu, setSelectedMenu } = useMenu();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className='space-y-2'>
          {items.map(item => {
            const isActive = selectedMenu === item.id;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() => setSelectedMenu(item.id)}
                  className={`w-full justify-start gap-3 px-[12px] py-[8px] rounded-lg transition-colors ${
                    isActive
                      ? 'bg-amber-600 text-white hover:bg-amber-600'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                >
                  {item.icon && <item.icon className='w-5 h-5' />}
                  <span className='font-medium'>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
