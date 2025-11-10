'use client';
import { useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/app/lottery/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import LotteryGrid from '@/app/lottery/grid';
import { lotteryData } from '@/app/lottery/data';
import Pagination from '@/app/lottery/pagination';
import { filterLotteryData } from '@/app/lottery/filter-lottery';

export default function LotteryPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filtered = filterLotteryData(lotteryData, query);
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginatedItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '263px',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant='inset' hideContent />
      <SidebarInset>
        <SiteHeader
          onSearch={q => {
            setQuery(q);
            setCurrentPage(1);

            setTimeout(() => {
              setIsLoading(false);
            }, 1000);
          }}
        />
        <div className='flex flex-1 flex-col bg-[#2D1E0C]'>
          <div className='@container/main flex flex-1 flex-col gap-2'>
            <div className='flex flex-col gap-4 py-4 md:gap-4'>
              <div className='flex flex-col space-y-1 rounded-lg px-4 lg:px-6'>
                <div className='flex items-center gap-0.5 rounded-full bg-[#D80027] border-1 border-[#EE9F3D] px-1 w-fit'>
                  <img src='/lottery_icon.png' width={35} />
                  <span className='rounded text-xl font-bold mb-2'>
                    LOTTERIES
                  </span>
                </div>

                <div className='absolute right-4 flex items-center gap-4 z-50'>
                  <div className='flex items-center bg-[#EE9F3D] rounded-lg px-4 py-2 shadow-md hover:scale-105 transition-transform duration-200'>
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
                <div className='bg-gradient-to-b from-[#D2C7BD] to-[#e89c3f7d] border-7 border-[#FFC548e0]/88 p-6 rounded-lg w-auto h-auto'>
                  {isLoading ? (
                    <div className='flex justify-center items-center h-64'>
                      <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-400'></div>
                    </div>
                  ) : (
                    <div className='flex justify-center w-full'>
                      <div className='w-full max-w-screen-xl px-2'>
                        <LotteryGrid
                          items={paginatedItems}
                          pageKey={currentPage}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className='space-y-10'>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
