'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AudioLinesIcon, HomeIcon, MessageSquareMoreIcon, UsersRoundIcon } from 'lucide-react';

import { NavChats } from '@/components/navigation/nav-chats';
import { NavGroups } from '@/components/navigation/nav-groups';
import { NavMain } from '@/components/navigation/nav-main';
import { NavUser } from '@/components/navigation/nav-user';
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
  const pathname = usePathname();

  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className='data-[slot=sidebar-menu-button]:!p-1.5'>
              <Link href='/'>
                <AudioLinesIcon className='drop-shadow-glow drop-shadow-primary !size-5' />
                <span className='text-base font-semibold'>Voxa</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {pathname.startsWith('/chats') && <NavChats />}
        {pathname.startsWith('/groups') && <NavGroups />}

        {/* <NavSecondary items={data.navSecondary} className='mt-auto' /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
