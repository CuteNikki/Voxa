// import Link from 'next/link';

// import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function SiteHeader() {
  return (
    <header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
      <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mx-2 data-[orientation=vertical]:h-4' />
        <div className='ml-auto flex items-center gap-2'>
          {/* <Button variant='ghost' asChild size='sm' className='hidden sm:flex'>
            <Link href='/' className='dark:text-foreground'>
              Home
            </Link>
          </Button>
          <Button variant='ghost' asChild size='sm' className='hidden sm:flex'>
            <Link href='/groups' className='dark:text-foreground'>
              Groups
            </Link>
          </Button>
          <Button variant='ghost' asChild size='sm' className='hidden sm:flex'>
            <Link href='/chats' className='dark:text-foreground'>
              Chats
            </Link>
          </Button> */}
        </div>
      </div>
    </header>
  );
}
