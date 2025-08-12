'use client';

import { useUser } from '@clerk/nextjs';
import { usePaginatedQuery, useQuery } from 'convex/react';
import Link from 'next/link';

import { api } from '../../../convex/_generated/api';

import { EllipsisIcon } from 'lucide-react';

import { formatSidebarTimestamp } from '@/lib/utils';

import { LAST_READ_THRESHOLD } from '@/constants/limits';

import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export function NavGroups() {
  const { user } = useUser();
  const { results, loadMore, status } = usePaginatedQuery(api.groups.getGroupsPaginated, {}, { initialNumItems: 6 });

  if (status === 'LoadingFirstPage' || !user) {
    return (
      <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
        <SidebarGroupLabel>Group Chats</SidebarGroupLabel>
        <SidebarMenu>
          {Array.from({ length: 6 }).map((_, index) => (
            <GroupItemSkeleton key={index} />
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
      <SidebarGroupLabel>Group Chats</SidebarGroupLabel>
      <SidebarMenu>
        <ScrollArea className='max-h-200'>
          {results.map((item) => (
            <GroupItem key={item._id} item={item} currentUserId={user.id} />
          ))}
        </ScrollArea>
        <SidebarMenuItem>
          <SidebarMenuButton disabled={status === 'LoadingMore' || status === 'Exhausted'} onClick={() => loadMore(6)} className='text-muted-foreground'>
            <EllipsisIcon className='text-muted-foreground' />
            <span>Load More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

function GroupItemSkeleton() {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton className='items-center py-6'>
        <div className='flex w-full flex-row items-center justify-between gap-2'>
          <div className='flex flex-col'>
            <Skeleton className='w-fit'>Unknown Group</Skeleton>
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

function GroupItem({
  item,
  currentUserId,
}: {
  item: {
    _id: string;
    createdAt: number;
    members: { userId: string; lastReadAt?: number }[];
    name: string;
  };
  currentUserId: string;
}) {
  const lastMessage = useQuery(api.groups.getLastMessage, { groupId: item._id });
  const activeMembers = item.members.filter((member) => (member?.lastReadAt ?? 0) > Date.now() - LAST_READ_THRESHOLD);

  console.log('Active Members:', activeMembers);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton className='items-center py-6' asChild>
        <Link href={`/groups/${item._id}`}>
          <div className='flex w-full flex-row items-center justify-between gap-2'>
            <div className='flex flex-col'>
              <span className='max-w-30 truncate leading-tight font-semibold capitalize'>{item.name}</span>
              {lastMessage?.content ? (
                <span className='text-muted-foreground max-w-30 truncate text-sm leading-tight'>
                  {lastMessage.senderId === currentUserId ? 'You: ' : ''}
                  {lastMessage.content.slice(0, 20)}
                </span>
              ) : (
                <span className='text-muted-foreground max-w-30 truncate text-sm leading-tight'>No Messages</span>
              )}
            </div>
            {lastMessage?.createdAt && <span className='text-muted-foreground text-xs leading-tight'>{formatSidebarTimestamp(lastMessage.createdAt)}</span>}
          </div>
          {activeMembers?.length > 0 && <Badge className='rounded-full'>{activeMembers.length}</Badge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
