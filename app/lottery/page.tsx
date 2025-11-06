import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import LotteryGrid from '@/app/lottery/grid';

export default function LotteryPage() {
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
        <SiteHeader />
        <div className='flex flex-1 flex-col bg-[#2D1E0C]'>
          <div className='@container/main flex flex-1 flex-col gap-2'>
            <div className='flex flex-col gap-4 py-4 md:gap-4'>
              <div className='flex flex-col space-y-1 rounded-lg px-4 lg:px-6'>
                <div className='rounded-lg bg-[#D80027] border-1 border-[#EE9F3D] max-w-fit'>
                  <h1 className='rounded-lg text-2xl font-bold mb-2'>
                    Lottery
                  </h1>
                </div>

                <div className='absolute right-4 flex items-center gap-4 z-50'>
                  {/* Award Badge */}
                  <div className='flex items-center  bg-gradient-to-r from-[#DA7814] to-[#ffffff]  rounded-lg px-3 py-2 shadow-md hover:scale-105 transition-transform duration-200'>
                    {/* Optional Icon */}
                    <div className='w-6 h-6 bg-white rounded-sm border mr-2 flex items-center justify-center text-[10px] font-bold text-red-600'>
                      WIN!
                    </div>
                    <span className='text-[#74400B] font-bold text-sm'>Award</span>
                  </div>
                </div>

                <div className='bg-gradient-to-b from-[#D2C7BD] to-[#e89c3f7d] border-7 border-[#FFC548e0]/88 p-6 rounded-lg w-auto h-auto'>
                  <LotteryGrid />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
