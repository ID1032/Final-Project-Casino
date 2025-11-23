'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Search, Settings, User, Coins, PlusCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function SiteHeader() {
  const supabase = useMemo(() => createClient(), []);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [displayName, setDisplayName] = useState<string | undefined>(undefined);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) return;
      if (error) {
        console.error('Error loading session', error);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      const session = data.session;
      const user = session?.user;
      setIsAuthenticated(Boolean(session));
      setDisplayName(
        (user?.user_metadata?.name as string | undefined) ||
          (user?.email as string | undefined)
      );
      setAvatarUrl(user?.user_metadata?.picture as string | undefined);
      setIsLoading(false);
    };

    loadSession();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      loadSession();
    });
    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

    useEffect(() => {
    const fetchBalance = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        if (!user) return;

        const { data: existingRow, error: fetchError } = await supabase
          .from('point')
          .select('points')
          .eq('id', user.id)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!existingRow) {
          const { data: newRow, error: insertError } = await supabase
            .from('point')
            .insert({ id: user.id, points: 1000 })
            .select()
            .maybeSingle();

          if (insertError) throw insertError;

          setBalance(newRow?.points ?? 1000);
        } else {
          setBalance(existingRow.points ?? 1000);
        }
      } catch (err) {
        console.error('Error fetching balance:', err);
        setBalance(1000);
      }
    };

    fetchBalance();
  }, [supabase]);


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
                {balance !== null ? balance.toLocaleString() : 'Loading...'}
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
                  <AvatarImage src={avatarUrl || ''} alt={displayName || ''} />
                  <AvatarFallback className='bg-[#8B4513] text-white'>
                    {displayName?.charAt(0)?.toUpperCase() || (
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
