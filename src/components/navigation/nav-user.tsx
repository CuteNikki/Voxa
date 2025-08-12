'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import { useTheme } from 'next-themes';

import { EllipsisVertical, LogOutIcon, MoonIcon, OrbitIcon, PaintbrushIcon, SunIcon, User2Icon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export function NavUser() {
  const { isMobile } = useSidebar();
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut, openUserProfile, openSignIn } = useClerk();
  const { setTheme } = useTheme();

  const handleThemeChange = (theme: 'system' | 'light' | 'dark') => {
    setTheme(theme);
  };

  if (!isLoaded) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size='lg' className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
            <Avatar className='h-8 w-8 rounded-lg'>
              <AvatarFallback className='rounded-lg'>
                <Skeleton>U</Skeleton>
              </AvatarFallback>
            </Avatar>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <Skeleton className='w-fit truncate font-medium capitalize'>Unknown User</Skeleton>
              <Skeleton className='text-muted-foreground w-fit truncate text-xs'>unknown@voxa</Skeleton>
            </div>
            <EllipsisVertical className='ml-auto size-4' />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!isSignedIn) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size='lg' className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarFallback className='rounded-lg'>G</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium capitalize'>Guest</span>
                  <span className='text-muted-foreground truncate text-xs'>Not signed in</span>
                </div>
                <EllipsisVertical className='ml-auto size-4' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
              side={isMobile ? 'bottom' : 'right'}
              align='end'
              sideOffset={4}
            >
              <DropdownMenuLabel className='p-0 font-normal'>
                <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarFallback className='rounded-lg'>G</AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-medium capitalize'>Guest</span>
                    <span className='text-muted-foreground truncate text-xs'>Not signed in</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <PaintbrushIcon />
                    Appearance
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => handleThemeChange('system')}>
                        <OrbitIcon />
                        System
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleThemeChange('light')}>
                        <SunIcon />
                        Light
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
                        <MoonIcon />
                        Dark
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openSignIn()}>
                <User2Icon />
                Sign In
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size='lg' className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage src={user?.imageUrl} alt={user?.username + ' avatar'} />
                <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium capitalize'>{user.username}</span>
                <span className='text-muted-foreground truncate text-xs'>{user.primaryEmailAddress?.emailAddress}</span>
              </div>
              <EllipsisVertical className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage src={user.imageUrl} alt={user.username + ' avatar'} />
                  <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium capitalize'>{user.username}</span>
                  <span className='text-muted-foreground truncate text-xs'>{user.primaryEmailAddress?.emailAddress}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => openUserProfile()}>
                <User2Icon />
                Account
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <PaintbrushIcon />
                  Appearance
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => handleThemeChange('system')}>
                      <OrbitIcon />
                      System
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleThemeChange('light')}>
                      <SunIcon />
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
                      <MoonIcon />
                      Dark
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              {/* <DropdownMenuItem>
                <MailIcon />
                Notifications
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant='destructive' onClick={() => signOut()}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
