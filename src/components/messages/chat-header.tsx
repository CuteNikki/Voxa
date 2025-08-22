'use client';

import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { ClipboardCopyIcon, ClipboardListIcon, EllipsisVertical, Trash2Icon, UserMinus2Icon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';
import { Doc } from '../../../convex/_generated/dataModel';

import { formatPresenceTimestamp, getPresenceText, isOnline, PresenceText } from '@/lib/utils';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export function ChatHeader({ chatId }: { chatId: string }) {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const isGroup = pathname.startsWith('/groups');
  const channel = useQuery(isGroup ? api.groups.getGroupById : api.chats.getChatById, { chatId });

  // Helper to check if channel is a chat
  const isChat = (obj: unknown): obj is Doc<'chats'> => !!obj && typeof obj === 'object' && 'userIdOne' in obj && 'userIdTwo' in obj;

  // Redirect if channel is null
  if (channel === null) {
    router.push('/');
    return null;
  }

  // Loading or unauthenticated state
  if (!user || channel === undefined) {
    return (
      <header className='z-50 flex h-(--header-height) shrink-0 items-center gap-2 border-b px-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
        <div className='flex w-full items-center gap-1'>
          <SidebarTrigger />
          <Separator orientation='vertical' className='data-[orientation=vertical]:h-4' />
          {isGroup ? <span className='px-2 text-sm'>Loading Channel</span> : <UserDetailsSkeleton />}
        </div>
        {isGroup ? null : (
          <div className='flex items-center gap-1'>
            <Separator orientation='vertical' className='data-[orientation=vertical]:h-4' />
            <Button variant='ghost' size='icon' disabled aria-label='Chat Options'>
              <EllipsisVertical />
            </Button>
          </div>
        )}
      </header>
    );
  }

  // Main header content
  const headerContent =
    isGroup || !isChat(channel) ? (
      <span className='px-2 text-sm'>{'name' in channel ? channel.name : 'Unnamed Group'}</span>
    ) : (
      <UserDetails targetId={user.id === channel.userIdOne ? channel.userIdTwo : channel.userIdOne} />
    );
  // Dropdown menu for chat options
  const dropdown =
    isGroup || !isChat(channel) ? null : (
      <div className='flex items-center gap-1'>
        <Separator orientation='vertical' className='data-[orientation=vertical]:h-4' />
        <ChatDropdown targetUserId={user.id === channel.userIdOne ? channel.userIdTwo : channel.userIdOne} chatId={chatId} userId={user.id} />
      </div>
    );

  return (
    <header className='z-50 flex h-(--header-height) shrink-0 items-center gap-2 border-b px-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
      <div className='flex w-full items-center gap-1'>
        <SidebarTrigger />
        <Separator orientation='vertical' className='data-[orientation=vertical]:h-4' />
        {headerContent}
      </div>
      {dropdown}
    </header>
  );
}

function UserDetailsSkeleton() {
  return (
    <div className='flex flex-row items-center gap-1 pl-1 sm:gap-2 sm:pl-2'>
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
    </div>
  );
}

function UserDetails({ targetId }: { targetId: string }) {
  const targetUser = useQuery(api.users.getUser, { clerkId: targetId });
  const targetUserPresence = useQuery(api.presence.getUserPresence, { userId: targetId });

  if (!targetUser || !targetUserPresence) {
    return <UserDetailsSkeleton />;
  }

  const online = isOnline(targetUserPresence.lastSeen);
  const formatted = online
    ? getPresenceText(PresenceText.Online)
    : getPresenceText(PresenceText.LastSeen) + ' ' + formatPresenceTimestamp(targetUserPresence.lastSeen ?? 0);

  return (
    <div className='flex flex-row items-center gap-1 pl-1 sm:gap-2 sm:pl-2'>
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
            <span className={`text-muted-foreground text-xs leading-tight ${online ? 'text-green-500' : ''}`}>{formatted}</span>
          ) : (
            <Skeleton className='text-muted-foreground w-fit text-xs leading-tight'>{formatted}</Skeleton>
          )}
        </div>
      </div>
    </div>
  );
}

function ChatDropdown({ targetUserId, userId, chatId }: { targetUserId: string; userId: string; chatId: string }) {
  const [clearAlertOpen, setClearAlertOpen] = useState(false);
  const [removeAlertOpen, setRemoveAlertOpen] = useState(false);

  const removeFriend = useMutation(api.friends.removeFriend);
  const clearMessages = useMutation(api.chats.clearMessages);

  const handleClear = () => {
    clearMessages({ chatId });
  };

  const handleUnfriend = () => {
    removeFriend({ targetUserId, userId });
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon' aria-label='Chat Options'>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => window.navigator.clipboard.writeText(chatId)}>
            <ClipboardListIcon />
            Copy Channel ID
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => window.navigator.clipboard.writeText(targetUserId)}>
            <ClipboardCopyIcon />
            Copy User ID
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant='destructive' onSelect={() => setClearAlertOpen(true)}>
              <Trash2Icon />
              Clear Messages
            </DropdownMenuItem>
            <DropdownMenuItem variant='destructive' onSelect={() => setRemoveAlertOpen(true)}>
              <UserMinus2Icon />
              Remove Friend
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={clearAlertOpen} onOpenChange={setClearAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete all messages.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant='secondary'>Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild onClick={handleClear}>
              <Button variant='destructive'>Continue</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={removeAlertOpen} onOpenChange={setRemoveAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This will remove them from your friend list. To undo this, they will have to add you back.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant='secondary'>Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild onClick={handleUnfriend}>
              <Button variant='destructive'>Continue</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
