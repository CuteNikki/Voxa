'use client';

// import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';

import { api } from '../../../convex/_generated/api';

import { formatPresenceTimestamp } from '@/lib/utils';

// import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export function SiteHeader({ chatId }: { chatId: string }) {
  const chatInfo = useQuery(api.chats.getChatById, { chatId });

  const { user } = useUser();

  const otherUserId = chatInfo?.userIdOne === user?.id ? chatInfo?.userIdTwo : chatInfo?.userIdOne;

  const otherUser = useQuery(api.users.getUser, { clerkId: otherUserId ?? '' });
  const otherUserPresence = useQuery(api.presence.getUserPresence, { userId: otherUserId ?? '' });

  return (
    <header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
      <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mx-2 data-[orientation=vertical]:h-4' />
        <Avatar>
          <AvatarImage src={otherUser?.imageUrl} />
          <AvatarFallback>{otherUser?.username ? otherUser.username.charAt(0).toUpperCase() : <Skeleton>U</Skeleton>}</AvatarFallback>
        </Avatar>
        <div className='flex w-full flex-row items-center justify-between gap-2'>
          <div className='flex flex-col'>
            {otherUser?.username ? (
              <span className='text-sm leading-tight font-semibold capitalize'>{otherUser.username}</span>
            ) : (
              <Skeleton className='w-fit text-sm leading-tight font-semibold capitalize'>Unknown User</Skeleton>
            )}
            {otherUserPresence ? (
              <span className='text-muted-foreground text-xs leading-tight'>{formatPresenceTimestamp(otherUserPresence.lastSeen)}</span>
            ) : (
              <Skeleton className='text-muted-foreground w-fit text-xs leading-tight'>{formatPresenceTimestamp(0)}</Skeleton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
