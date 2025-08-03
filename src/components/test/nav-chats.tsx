'use client';

import { useUser } from '@clerk/nextjs';
import { usePaginatedQuery, useQuery } from 'convex/react';
import Link from 'next/link';

import { api } from '../../../convex/_generated/api';

import { EllipsisIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

export function NavChats() {
  const { results, loadMore, status } = usePaginatedQuery(api.chats.getOwnChatsPaginated, {}, { initialNumItems: 6 });

  const { user } = useUser();

  if (!user || !results) return null;

  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      <SidebarMenu>
        {results.map((item) => (
          <UserItem key={item._id} item={item} currentUserId={user.id} />
        ))}
        {status === 'CanLoadMore' && (
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => loadMore(6)} className='text-sidebar-foreground/70'>
              <EllipsisIcon className='text-sidebar-foreground/70' />
              <span>Load More</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function UserItem({
  item,
  currentUserId,
}: {
  item: {
    _id: string;
    createdAt: number;
    userIdOne: string;
    userIdTwo: string;
  };
  currentUserId: string;
}) {
  const otherUserId = item.userIdOne === currentUserId ? item.userIdTwo : item.userIdOne;

  const user = useQuery(api.users.getUser, { clerkId: otherUserId });
  const lastMessage = useQuery(api.chats.getLastMessage, { chatId: item._id });

  if (!user) return null;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton className='items-center py-6' asChild>
        <Link href={`/chats/${item._id}`}>
          <Avatar>
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className='flex w-full flex-row items-center justify-between gap-2'>
            <div className='flex flex-col'>
              <span className='leading-tight font-semibold capitalize'>{user?.username}</span>
              {lastMessage?.content && (
                <span className='text-muted-foreground max-w-28 truncate text-sm leading-tight'>
                  {lastMessage.senderId === currentUserId ? 'You: ' : ''}
                  {lastMessage.content.slice(0, 20)}
                </span>
              )}
            </div>
            {lastMessage?.createdAt && (
              <div>
                <span className='text-muted-foreground text-sm leading-tight'>{formatTimestamp(lastMessage.createdAt)}</span>
              </div>
            )}
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
