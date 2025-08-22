'use client';

import { useQuery } from 'convex/react';
import { useEffect, useState } from 'react';

import { api } from '../../../convex/_generated/api';

import { cn, formatPresenceTimestamp, getPresenceText, isOnline, PresenceText } from '@/lib/utils';

import { ONLINE_UPDATE_INTERVAL } from '@/constants/limits';

import { AcceptRequestButton } from '@/components/friends/accept';
import { AddFriendButton } from '@/components/friends/add';
import { CancelRequestButton } from '@/components/friends/cancel';
import { DeclineRequestButton } from '@/components/friends/decline';
import { RemoveFriendButton } from '@/components/friends/remove';
import { TypographyLarge } from '@/components/typography/large';
import { TypographyMuted } from '@/components/typography/muted';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

export function FriendElement({ targetId, userId }: { targetId: string; userId: string }) {
  const isFriend = useQuery(api.friends.isFriend, { userId: userId, targetId: targetId });
  const isPending = useQuery(api.friends.isPendingRequest, { userId: userId, targetId: targetId });

  return (
    <BaseUser targetId={targetId}>
      {targetId !== userId &&
        (isFriend ? (
          <RemoveFriendButton targetUserId={targetId} userId={userId} />
        ) : isPending ? null : (
          <AddFriendButton targetUserId={targetId} userId={userId} />
        ))}
    </BaseUser>
  );
}

export function ReceivedRequestUser({ targetId, userId }: { targetId: string; userId: string }) {
  return (
    <BaseUser targetId={targetId}>
      <AcceptRequestButton userId={userId} targetId={targetId} />
      <DeclineRequestButton userId={userId} targetId={targetId} />
    </BaseUser>
  );
}

export function OutgoingRequestUser({ targetId, userId }: { targetId: string; userId: string }) {
  return (
    <BaseUser targetId={targetId}>
      <CancelRequestButton userId={userId} targetId={targetId} />
    </BaseUser>
  );
}

export function BaseUser({ targetId, children }: { targetId: string; children?: React.ReactNode }) {
  const target = useQuery(api.users.getUser, { clerkId: targetId });
  const presence = useQuery(api.presence.getUserPresence, { userId: targetId });

  // Re-render update presence status
  const [, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), ONLINE_UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const lastSeen = presence?.lastSeen ?? 0;
  const online = isOnline(lastSeen);
  const formatted = online ? getPresenceText(PresenceText.Online) : getPresenceText(PresenceText.LastSeen) + ' ' + formatPresenceTimestamp(lastSeen);

  if (!target) {
    return <BaseSkeleton />;
  }

  return (
    <li className='bg-accent/70 hover:bg-primary/20 flex items-center justify-between gap-2 rounded-xl p-3 shadow-md transition-colors duration-300'>
      <div className='flex flex-row items-center gap-2 md:gap-4'>
        <Avatar className='size-10'>
          <AvatarImage src={target.imageUrl || '/default-avatar.png'} alt={`${target.username} avatar`} />
          <AvatarFallback>{target.username ? target.username.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
        </Avatar>
        <div className='flex flex-col'>
          <TypographyLarge className='capitalize'>{target.username}</TypographyLarge>
          <TypographyMuted className={cn(online ? 'text-green-500' : '', 'text-xs')}>{formatted}</TypographyMuted>
        </div>
      </div>
      <div className='flex items-center gap-1'>{children}</div>
    </li>
  );
}

export function BaseSkeleton() {
  return (
    <li className='bg-accent/70 hover:bg-primary/20 flex items-center justify-between gap-2 rounded-xl p-3 shadow-md transition-colors duration-300'>
      <div className='flex flex-row items-center gap-2 md:gap-4'>
        <Avatar className='size-10'>
          <AvatarFallback>
            <Skeleton>U</Skeleton>
          </AvatarFallback>
        </Avatar>
        <div className='flex flex-col'>
          <TypographyLarge className='capitalize'>Unknown User</TypographyLarge>
          <TypographyMuted className='text-xs'>{getPresenceText(PresenceText.LastSeen) + ' ' + formatPresenceTimestamp(0)}</TypographyMuted>
        </div>
      </div>
    </li>
  );
}
