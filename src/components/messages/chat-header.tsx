'use client';

import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';

import { EllipsisVertical, Trash2Icon, UserMinus2Icon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { formatPresenceTimestamp } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export function ChatHeader({ chatId }: { chatId: string }) {
  const chatInfo = useQuery(api.chats.getChatById, { chatId });
  const { user } = useUser();
  const router = useRouter();
  
  const otherUserId = user?.id === chatInfo?.userIdOne ? chatInfo?.userIdTwo : chatInfo?.userIdOne;

  if (chatInfo === null) {
    router.push('/chats');
  }

  if (!otherUserId || !user) {
    return (
      <header className='z-50 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
        <div className='flex w-full items-center gap-2 px-2'>
          <SidebarTrigger />
          <Separator orientation='vertical' className='mx-2 data-[orientation=vertical]:h-4' />
          <UserDetailsSkeleton />
        </div>

        <div className='flex items-center gap-2 pr-2'>
          <Separator orientation='vertical' className='mx-2 data-[orientation=vertical]:h-4' />
          <Button variant='ghost' size='icon' disabled aria-label='Chat Options'>
            <EllipsisVertical />
          </Button>
        </div>
      </header>
    );
  }

  return (
    <header className='z-50 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
      <div className='flex w-full items-center gap-2 px-2'>
        <SidebarTrigger />
        <Separator orientation='vertical' className='mx-2 data-[orientation=vertical]:h-4' />
        <UserDetails targetId={otherUserId} />
      </div>

      <div className='flex items-center gap-2 pr-2'>
        <Separator orientation='vertical' className='mx-2 data-[orientation=vertical]:h-4' />
        <UserDropdown targetId={otherUserId} chatId={chatId} userId={user.id} />
      </div>
    </header>
  );
}

function UserDetailsSkeleton() {
  return (
    <>
      <Avatar>
        <AvatarFallback>
          <Skeleton>U</Skeleton>
        </AvatarFallback>
      </Avatar>
      <div className='flex w-full flex-row items-center justify-between gap-2'>
        <div className='flex flex-col'>
          <Skeleton className='w-fit text-sm leading-tight font-semibold capitalize'>Unknown User</Skeleton>
          <Skeleton className='text-muted-foreground w-fit text-xs leading-tight'>{formatPresenceTimestamp(0)}</Skeleton>
        </div>
      </div>
    </>
  );
}

function UserDetails({ targetId }: { targetId: string }) {
  const targetUser = useQuery(api.users.getUser, { clerkId: targetId });
  const targetUserPresence = useQuery(api.presence.getUserPresence, { userId: targetId });

  if (!targetUser || !targetUserPresence) {
    return <UserDetailsSkeleton />;
  }

  return (
    <>
      <Avatar>
        <AvatarImage src={targetUser?.imageUrl} />
        <AvatarFallback>{targetUser?.username ? targetUser.username.charAt(0).toUpperCase() : <Skeleton>U</Skeleton>}</AvatarFallback>
      </Avatar>

      <div className='flex w-full flex-row items-center justify-between gap-2'>
        <div className='flex flex-col'>
          {targetUser?.username ? (
            <span className='text-sm leading-tight font-semibold capitalize'>{targetUser.username}</span>
          ) : (
            <Skeleton className='w-fit text-sm leading-tight font-semibold capitalize'>Unknown User</Skeleton>
          )}
          {targetUserPresence ? (
            <span className='text-muted-foreground text-xs leading-tight'>{formatPresenceTimestamp(targetUserPresence.lastSeen)}</span>
          ) : (
            <Skeleton className='text-muted-foreground w-fit text-xs leading-tight'>{formatPresenceTimestamp(0)}</Skeleton>
          )}
        </div>
      </div>
    </>
  );
}

function UserDropdown({ targetId, userId, chatId }: { targetId: string; userId: string; chatId: string }) {
  const removeFriend = useMutation(api.friends.removeFriend);
  const clearMessages = useMutation(api.chats.clearMessages);

  const handleClear = async () => {
    if (confirm('Are you sure you want to delete all messages in this chat?')) {
      await clearMessages({ chatId });
    }
  };

  const handleUnfriend = async () => {
    if (confirm('Are you sure you want to remove this user from your friends?')) {
      await removeFriend({ friendId: targetId, userId });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' aria-label='Chat Options'>
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleClear} variant='destructive'>
            <Trash2Icon />
            Clear Messages
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleUnfriend} variant='destructive'>
            <UserMinus2Icon />
            Remove Friend
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
