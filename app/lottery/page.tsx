import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import LotteryGrid from '@/app/lottery/grid'

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
            <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
              <div className='px-4 lg:px-6'>
                <h1 className='text-2xl font-bold mb-2'>Lottery</h1>
                <div className='bg-gradient-to-b from-[#D2C7BD] to-[#e89c3f7d] border-4 border-[#FFC548e0]/88 p-6 rounded-lg w-full h-full'>
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
