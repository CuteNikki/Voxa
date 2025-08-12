'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

import { LucideIcon } from 'lucide-react';
// import { IconCirclePlusFilled, IconMail, type Icon } from '@tabler/icons-react';

// import { Button } from '@/components/ui/button';
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    requiresAuthenticated?: boolean;
  }[];
}) {
  const { user } = useUser();

  return (
    <SidebarGroup>
      <SidebarGroupContent className='flex flex-col gap-2'>
        {/* <SidebarMenu>
          <SidebarMenuItem className='flex items-center gap-2'>
            <SidebarMenuButton
              tooltip='Quick Create'
              className='bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear'
            >
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button size='icon' className='size-8 group-data-[collapsible=icon]:opacity-0' variant='outline'>
              <IconMail />
              <span className='sr-only'>Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu> */}
        <SidebarMenu>
          {items.map((item, index) => (
            <SidebarMenuItem key={`nav-main-${index}-${item.title}`}>
              {item.requiresAuthenticated && !user ? (
                <SidebarMenuButton className='text-sidebar-foreground/70'>
                  <Skeleton className='h-4 w-24' />
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
