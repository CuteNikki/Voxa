'use client';

import Link from 'next/link';

import { IconHelp, IconSearch, IconSettings } from '@tabler/icons-react';
import { AudioLinesIcon, BotMessageSquareIcon, ClipboardListIcon, DatabaseIcon, HomeIcon, MessageSquareMoreIcon, UsersRoundIcon } from 'lucide-react';

import { NavChats } from '@/components/test/nav-chats';
import { NavMain } from '@/components/test/nav-main';
// import { NavSecondary } from '@/components/test/nav-secondary';
import { NavUser } from '@/components/test/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Home',
      url: '/',
      icon: HomeIcon,
    },
    {
      title: 'Groups',
      url: '/groups',
      icon: UsersRoundIcon,
    },
    {
      title: 'Chats',
      url: '/chats',
      icon: MessageSquareMoreIcon,
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: IconSettings,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: IconHelp,
    },
    {
      title: 'Search',
      url: '#',
      icon: IconSearch,
    },
  ],
  chats: [
    {
      name: 'Data Library',
      url: '#',
      icon: DatabaseIcon,
    },
    {
      name: 'Reports',
      url: '#',
      icon: ClipboardListIcon,
    },
    {
      name: 'Word Assistant',
      url: '#',
      icon: BotMessageSquareIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className='data-[slot=sidebar-menu-button]:!p-1.5'>
              <Link href='/'>
                <AudioLinesIcon className='!size-5' />
                <span className='text-base font-semibold'>Voxa</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavChats />
        {/* <NavSecondary items={data.navSecondary} className='mt-auto' /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
