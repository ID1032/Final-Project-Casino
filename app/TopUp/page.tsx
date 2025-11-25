'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { MenuProvider } from '@/app/home/contexts/menu-context';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Modal, { TopUpModal } from './topUp';
import type { CSSProperties } from 'react';
import { createClient } from '@/lib/supabase/client';

type ActionItem = {
  label: string;
  icon: string;
  description: string;
  type: 'info' | 'topup';
};

const ACTION_ITEMS: ActionItem[] = [
  {
    label: 'Withdraw',
    icon: '/Withdraw.png',
    description:
      'Withdraw funds directly to your verified bank account. Review your banking details before submitting.',
    type: 'info',
  },
  {
    label: 'Top UP',
    icon: '/TopUp.png',
    description:
      'Add credits via your preferred payment channel. Top-ups are instant once your payment is confirmed.',
    type: 'topup',
  },
  {
    label: 'History',
    icon: '/History.png',
    description:
      'Review your recent transactions, withdrawals, and deposits in detail with timestamps and references.',
    type: 'info',
  },
];

//mock balance, will need to fetch from backend
// const INITIAL_BALANCE = 0;

export default function TopUpPage() {
  const supabase = createClient();
  const [balance, setBalance] = useState<number | null>(null);
  const [activeAction, setActiveAction] = useState<ActionItem | null>(null);
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        if (!user) return;

        console.log('🔍 Checking existing point row for user:', user.id);

        const { data: existingRow, error: fetchError } = await supabase
          .from('point')
          .select('points')
          .eq('id', user.id)
          .maybeSingle();

        console.log('📌 Existing row:', existingRow);
        if (fetchError) {
          console.error('❌ Fetch error:', fetchError);
          throw fetchError;
        }

        // -------------------------------
        // CASE 1: No Existing Value Row
        // -------------------------------
        if (!existingRow) {
          console.log('🟡 No point row found — inserting new row...');

          const { data: newRow, error: insertError } = await supabase
            .from('point')
            .insert({ id: user.id, points: 1000 })
            .select()
            .maybeSingle();

          console.log('🟢 Insert result:', newRow);

          if (insertError) {
            console.error('❌ Insert error:', insertError);
            throw insertError;
          }

          setBalance(newRow?.points ?? 1000);
        } else {
          // -------------------------------
          // CASE 2: Existing Value Row
          // -------------------------------
          console.log(
            '🟢 Row exists — using existing points:',
            existingRow.points
          );
          setBalance(existingRow.points ?? 1000);
        }
      } catch (err) {
        console.error('🔥 Final catch — something went wrong:', err);
        setBalance(1000);
      }
    };

    fetchBalance();
  }, [supabase]);

  // const formattedBalance = useMemo(
  //   () => balance.toLocaleString('en-US'),
  //   [balance]
  // );

  // When user taps a menu tile show its modal
  const openAction = (action: ActionItem) => {
    setActiveAction(action);
  };

  // Close whichever modal is open
  const closeModal = () => {
    setActiveAction(null);
  };

  // Callback passed into TopUpModal to add total balance. Right now it only updates client state;
  // later this should call an API and refresh balance from backend.
  const handleTopUpSuccess = (amountAdded: number) => {
    setBalance(prev => (prev ?? 0) + amountAdded);
  };

  const isTopUpModal = activeAction?.type === 'topup';

  const renderModalBody = () => {
    if (!activeAction) return null;
    return (
      <p className='text-center text-lg leading-relaxed text-[#1A0E06]'>
        {activeAction.description}
      </p>
    );
  };

  return (
    <MenuProvider>
      <SidebarProvider
        style={
          {
            '--sidebar-width': '263px',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as CSSProperties
        }
      >
        <AppSidebar variant='inset' />
        <SidebarInset>
          <SiteHeader />
          <main className='flex flex-1 flex-col bg-[#1F1308] px-4 py-6 text-white md:px-8'>
            <div className='mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 rounded-[32px] border border-[#3D2815] bg-gradient-to-b from-[#3B2411] via-[#2B1A0C] to-[#140B05] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] md:gap-12 md:p-10'>
              <section className='rounded-[28px] border border-[#DE9950] bg-gradient-to-b from-[#52351F] via-[#704420] to-[#C98E54] p-8 text-center shadow-[0_25px_70px_rgba(0,0,0,0.35)]'>
                <p className='text-sm uppercase tracking-[0.35em] text-[#F4C18E]'>
                  Current
                </p>
                <div className='mt-6 flex flex-col items-center gap-4'>
                  <div className='flex items-center gap-4 text-5xl font-extrabold tracking-wider text-white sm:text-6xl'>
                    <span className='text-[#F4C18E]'>$</span>
                    {balance !== null ? balance.toLocaleString() : 'Loading...'}
                  </div>
                  <p className='text-xs uppercase tracking-[0.6em] text-[#F9DCC2]'>
                    Balance
                  </p>
                </div>
              </section>

              <section className='rounded-[28px] border border-[#2A1A0D] bg-[#120802] p-6 md:p-10'>
                <div className='grid gap-6 md:grid-cols-3'>
                  {ACTION_ITEMS.map(action => (
                    <button
                      key={action.label}
                      type='button'
                      className='group flex flex-col items-center gap-6 rounded-3xl border border-transparent bg-gradient-to-b from-[#2B1A0C] to-[#1A0E06] px-6 py-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-[#DE9950] hover:shadow-[0_25px_70px_rgba(0,0,0,0.4)]'
                      onClick={() => openAction(action)}
                    >
                      <div className='relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#DE9950] bg-white shadow-inner shadow-black/40'>
                        <div className='relative h-16 w-16'>
                          <Image
                            src={action.icon}
                            alt={action.label}
                            fill
                            sizes='64px'
                            className='object-contain'
                          />
                        </div>
                      </div>
                      <span className='text-2xl font-semibold tracking-wide text-[#E7892D]'>
                        {action.label}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>

      {isTopUpModal ? (
        <TopUpModal
          isOpen={Boolean(activeAction)}
          onClose={closeModal}
          onSuccess={handleTopUpSuccess}
          title={activeAction?.label}
        />
      ) : (
        <Modal
          title={activeAction?.label ?? ''}
          isOpen={Boolean(activeAction)}
          onClose={closeModal}
        >
          {activeAction && renderModalBody()}
        </Modal>
      )}
    </MenuProvider>
  );
}

