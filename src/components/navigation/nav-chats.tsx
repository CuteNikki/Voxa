'use client';

import { useUser } from '@clerk/nextjs';
import { usePaginatedQuery, useQuery } from 'convex/react';
import Link from 'next/link';

import { api } from '../../../convex/_generated/api';

import { EllipsisIcon } from 'lucide-react';

import { formatSidebarTimestamp } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export function NavChats() {
  const { user } = useUser();
  const { results, loadMore, status } = usePaginatedQuery(api.chats.getOwnChatsPaginated, {}, { initialNumItems: 6 });

  if (status === 'LoadingFirstPage' || !user) {
    return (
      <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
        <SidebarGroupLabel>Direct Messages</SidebarGroupLabel>
        <SidebarMenu>
          {Array.from({ length: 6 }).map((_, index) => (
            <UserItemSkeleton key={index} />
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton disabled className='text-muted-foreground'>
              <EllipsisIcon className='text-muted-foreground' />
              <span>Load More</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel>Direct Messages</SidebarGroupLabel>
      <SidebarMenu>
        <ScrollArea className='max-h-200'>
          {results.map((item) => (
            <UserItem key={item._id} item={item} currentUserId={user.id} />
          ))}
        </ScrollArea>
        {/* {status === 'CanLoadMore' && ( */}
        <SidebarMenuItem>
          <SidebarMenuButton disabled={status === 'LoadingMore' || status === 'Exhausted'} onClick={() => loadMore(6)} className='text-muted-foreground'>
            <EllipsisIcon className='text-muted-foreground' />
            <span>Load More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {/* )} */}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function UserItemSkeleton() {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton className='items-center py-6'>
        <Avatar>
          <AvatarFallback>
            <Skeleton>U</Skeleton>
          </AvatarFallback>
        </Avatar>
        <div className='flex w-full flex-row items-center justify-between gap-2'>
          <div className='flex flex-col'>
            <Skeleton className='w-fit'>Unknown User</Skeleton>
            <Skeleton className='text-muted-foreground w-fit max-w-30 truncate text-sm leading-tight'>No Messages</Skeleton>
          </div>
          <div>
            <Skeleton className='text-muted-foreground text-xs leading-tight'>{formatSidebarTimestamp(0)}</Skeleton>
          </div>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function UserItem({
  item,
  currentUserId,
}: {
  item: {
    _id: string;
    _creationTime: number;
    userIdOne: string;
    userIdTwo: string;
  };
  currentUserId: string;
}) {
  const otherUserId = item.userIdOne === currentUserId ? item.userIdTwo : item.userIdOne;

  const user = useQuery(api.users.getUser, { clerkId: otherUserId });
  const lastMessage = useQuery(api.chats.getLastMessage, { chatId: item._id });
  const unreadMessages = useQuery(api.chats.getUnreadMessages, { chatId: item._id });

  if (!user) return <UserItemSkeleton />;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton className='items-center py-6' asChild>
        <Link href={`/chats/${item._id}`}>
          <Avatar>
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>{user?.username?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
          </Avatar>
          <div className='flex w-full flex-row items-center justify-between gap-2'>
            <div className='flex flex-col'>
              <span className='max-w-30 truncate leading-tight font-semibold capitalize'>{user.username ?? 'Unknown User'}</span>
              {lastMessage?.content ? (
                <span className='text-muted-foreground max-w-30 truncate text-sm leading-tight'>
                  {lastMessage.senderId === currentUserId ? 'You: ' : ''}
                  {lastMessage.content.slice(0, 20)}
                </span>
              ) : (
                <span className='text-muted-foreground max-w-30 truncate text-sm leading-tight'>No Messages</span>
              )}
            </div>
            {lastMessage?._creationTime && (
              <span className='text-muted-foreground text-xs leading-tight'>{formatSidebarTimestamp(lastMessage._creationTime)}</span>
            )}
          </div>
          {/* Stop flickering by only showing the badge when you're not in the channel already */}
          {unreadMessages && unreadMessages.length > 0 && lastMessage?.senderId !== currentUserId && item._id !== window.location.pathname.split('/').pop() && (
            <Badge className='absolute top-0 left-0 rounded-full'>{unreadMessages.length}</Badge>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
