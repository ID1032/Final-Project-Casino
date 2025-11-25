'use client';

import { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import LotteryGrid from '@/app/lottery/components/grid';
import {
  LotteryItem,
  LotteryApiRow,
  UserProfile,
} from '@/app/lottery/components/data';
import Pagination from '@/app/lottery/components/pagination';
import { filterLotteryData } from '@/app/lottery/components/filter-lottery';
import AwardView from '@/app/lottery/components/award-view';
import { generateAwardNumbers } from '@/app/lottery/components/generate-award';
import HistoryDraw from '@/app/lottery/components/historyDraw';
import { MenuProvider } from '@/app/home/contexts/menu-context';
import { SiteHeader } from '@/app/lottery/components/site-header';
import LotteryModal from '@/app/lottery/components/lottery-modal';
import MyLotteryView, {
  LotteryTicket,
} from '@/app/lottery/components/mylotteryview';

import { useAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/client';


export default function LotteryPage() {
  const [query, setQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [lotteryData, setLotteryData] = useState<LotteryItem[]>([]);

  const filtered = filterLotteryData(lotteryData, query);
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginatedItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [showAwardView, setShowAwardView] = useState(false);
  const [awardNumbers, setAwardNumbers] = useState<number[][]>([]);
  const [showHistoryDraw, setShowHistoryDraw] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const [lotteries, setLotteries] = useState<LotteryTicket[]>([]);
  const [showMyLottery, setShowMyLottery] = useState(false);

  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LotteryItem | null>(null);

  useEffect(() => {
    if (user?.email) {
      // Fetch profile
      fetch(`/api/lottery?profileEmail=${user.email}`)
        .then(res => (res.ok ? res.json() : Promise.reject(res)))
        .then((data: UserProfile) => {
          setProfile(data);
        })
        .catch(err => console.error('Profile fetch failed:', err));

      // Fetch user lottery tickets
      fetch(`/api/lottery?userEmail=${user.email}`)
        .then(res => res.json())
        .then((data: LotteryTicket[]) => {
          setLotteries(data);
        })
        .catch(err => console.error('Lottery fetch failed:', err));
    }
  }, [user]);

useEffect(() => {
  const supabase = createClient();

  const fetchLotteryData = async () => {
    try {
      const { data, error } = await supabase
        .from('Lottery_Remaining')
        .select('id, lotteryNo, remain');

      if (error) throw error;

      const formatted: LotteryItem[] = (data ?? []).map((row, i) => ({
        id: row.id ?? i + 1,
        numbers: row.lotteryNo?.split('-').map(Number) ?? [],
        available: row.remain ?? 0,
      }));

      setLotteryData(formatted);
    } catch (err) {
        if (err instanceof Error) {
          console.error('Supabase fetch failed:', err.message);
        } else {
          console.error('Supabase fetch failed:', String(err));
        }
      }
  };

  fetchLotteryData();
}, []);

  const handleAwardClick = () => {
    setAwardNumbers(generateAwardNumbers());
    setShowHistoryDraw(false);
    setShowAwardView(true);
  };

  const handleCardClick = (item: LotteryItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <MenuProvider>
      <SidebarProvider
        style={
          {
            '--sidebar-width': '263px',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <AppSidebar
          variant='inset'
          showMyLottery={showMyLottery}
          onMyLotteryClick={setShowMyLottery}
        />
        <SidebarInset>
          <SiteHeader
            onSearch={q => {
              setQuery(q);
              setCurrentPage(1);
              setSearchLoading(true);

              setTimeout(() => {
                setSearchLoading(false);
              }, 1000);
            }}
          />
          <div className='flex flex-1 flex-col bg-[#2D1E0C]'>
            <div className='@container/main flex flex-1 flex-col gap-2'>
              <div className='flex flex-col gap-4 py-4 md:gap-4'>
                <div className='flex flex-col space-y-1 rounded-lg px-4 lg:px-6'>
                  {!showAwardView && (
                    <div className='flex items-center gap-0.5 rounded-full bg-[#D80027] border-1 border-[#EE9F3D] px-1 w-fit'>
                      <img src='/lottery_icon.png' width={35} />
                      <span className='rounded text-xl font-bold mb-2'>
                        LOTTERIES
                      </span>
                    </div>
                  )}
                  {!showAwardView && (
                    <div className='absolute right-4 flex items-center gap-4 z-50'>
                      <div
                        onClick={handleAwardClick}
                        className='flex items-center bg-[#EE9F3D] rounded-lg px-4 py-2 shadow-md hover:scale-105 transition-transform duration-200'
                      >
                        <div className='w-6 h-6 mr-2 flex items-center justify-center text-[10px] font-bold text-red-600'>
                          <img
                            src='lucky.png'
                            alt='win'
                            className='w-12 h-12 object-contain'
                          />
                        </div>
                        <span className='text-[#74400B] font-bold text-sm'>
                          Award
                        </span>
                      </div>
                    </div>
                  )}

                  <div className='bg-gradient-to-b from-[#D2C7BD] to-[#e89c3f7d] border-7 border-[#FFC548e0]/88 p-6 rounded-lg w-auto h-full '>
                    {searchLoading ? (
                      <div className='flex justify-center items-center h-64'>
                        <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-400'></div>{' '}
                      </div>
                    ) : showMyLottery ? (
                      <MyLotteryView
                        tickets={lotteries}
                        onBack={() => setShowMyLottery(false)} // ✅ allow going back
                      />
                    ) : showHistoryDraw ? (
                      <HistoryDraw onBack={() => setShowHistoryDraw(false)} />
                    ) : showAwardView ? (
                      <AwardView
                        numbers={awardNumbers}
                        onBack={() => setShowAwardView(false)}
                        onHistory={() => setShowHistoryDraw(true)} // ✅ Add this prop
                      />
                    ) : (
                      <div className='flex justify-center w-full'>
                        <div className='w-full max-w-screen-xl px-2'>
                          <LotteryGrid
                            items={lotteryData.slice(
                              (currentPage - 1) * itemsPerPage,
                              currentPage * itemsPerPage
                            )}
                            pageKey={currentPage}
                            onCardClick={handleCardClick}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  {!showAwardView && (
                    <div className='space-y-10'>
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={page => {
                          setCurrentPage(page);
                          setShowHistoryDraw(false);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      {/* ✅ Render modal when needed */}
      {showModal && selectedItem && (
        <LotteryModal
          item={selectedItem}
          userEmail={user?.email ?? ''}
          onClose={() => setShowModal(false)}
          onPurchaseSuccess={() => {
            setShowMyLottery(true);

            // Re-fetch tickets after purchase
            if (user?.email) {
              fetch(`/api/lottery?userEmail=${user.email}`)
                .then(res => res.json())
                .then(data => setLotteries(data));
            }

            // 🔄 Re-fetch lottery numbers to update availability
            fetch('/api/[lottery]')
              .then(res => (res.ok ? res.json() : Promise.reject(res)))
              .then(data => {
                const formatted: LotteryItem[] = data.map(
                  (row: LotteryApiRow, i: number) => {
                    const numbers = row.lotteryNo
                      ? row.lotteryNo.split('-').map(Number)
                      : [];
                    return {
                      id: i + 1,
                      numbers,
                      available: row.remain ?? row.available ?? 0,
                    };
                  }
                );

                setLotteryData(formatted);
              })
              .catch(err =>
                console.error('Failed to refresh lottery data:', err)
              );
          }}
        />
      )}
    </MenuProvider>
  );
}
