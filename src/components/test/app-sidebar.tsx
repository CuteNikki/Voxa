'use client';

import Link from 'next/link';

import { AudioLinesIcon, HomeIcon, MessageSquareMoreIcon, UsersRoundIcon } from 'lucide-react';

import { NavChats } from '@/components/test/nav-chats';
import { NavMain } from '@/components/test/nav-main';
// import { NavSecondary } from '@/components/test/nav-secondary';
import { NavUser } from '@/components/test/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

const navMain = [
  {
    title: 'Home',
    url: '/',
    icon: HomeIcon,
  },
  {
    title: 'Groups',
    url: '/groups',
    icon: UsersRoundIcon,
    requiresAuthenticated: true,
  },
  {
    title: 'Chats',
    url: '/chats',
    icon: MessageSquareMoreIcon,
    requiresAuthenticated: true,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className='data-[slot=sidebar-menu-button]:!p-1.5'>
              <Link href='/'>
                <AudioLinesIcon className='!size-5 drop-shadow-glow drop-shadow-primary' />
                <span className='text-base font-semibold'>Voxa</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavChats />
        {/* <NavSecondary items={data.navSecondary} className='mt-auto' /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
