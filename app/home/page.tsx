import { AppSidebar } from '@/app/home/app-sidebar';
import { SectionGames } from '@/app/home/section-games';
import { SiteHeader } from '@/app/home/site-header';
import { SignupBanner } from '@/app/home/signup-banner';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { MenuProvider } from '@/app/home/contexts/menu-context';

export default function Page() {
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
                  <SignupBanner />
                </div>
                <SectionGames />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </MenuProvider>
  );
}
