import { AppSidebar } from '@/components/test/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function ChatsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-screen flex-col'>
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <AppSidebar variant='inset' />
        <SidebarInset className='flex-1 overflow-hidden'>{children}</SidebarInset>
      </SidebarProvider>
    </div>
  );
}
