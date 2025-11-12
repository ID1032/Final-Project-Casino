import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { MenuProvider } from '@/app/home/contexts/menu-context';

export default function LotteryPage() {
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
        <AppSidebar variant='inset' />
        <SidebarInset>
          <SiteHeader />
          <div className='flex flex-1 flex-col bg-[#2D1E0C]'>
            <div className='@container/main flex flex-1 flex-col gap-2'>
              <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
                <div className='px-4 lg:px-6'>
                  <div className='rounded-xl border border-[#67533C] bg-[#1E1307] p-6 text-white'>
                    <h1 className='text-2xl font-bold mb-2'>Lottery</h1>
                    <p className='text-gray-300'>
                      Lottery content coming soon.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </MenuProvider>
  );
}
