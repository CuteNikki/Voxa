'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

import { AddFriendButton } from '@/components/friends/add';
import { RemoveFriendButton } from '@/components/friends/remove';
import { TypographyLarge } from '@/components/typography/large';
import { TypographyMuted } from '@/components/typography/muted';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPresenceTimestamp } from '@/lib/utils';

export function UserElement({ targetId, userId }: { targetId: string; userId: string }) {
  const target = useQuery(api.users.getUser, { clerkId: targetId });
  const presence = useQuery(api.presence.getUserPresence, { userId: targetId });
  const isFriend = useQuery(api.friends.isFriend, { userId: userId, targetId: targetId });
  const isPending = useQuery(api.friends.isPendingRequest, { userId: userId, targetId: targetId });

  const lastSeen = presence?.lastSeen ?? 0;
  const formatted = formatPresenceTimestamp(lastSeen);

  if (!target) {
    return (
      <li className='bg-accent hover:bg-accent/80 flex items-center gap-6 rounded-xl p-2 px-4 transition-colors'>
        <div className='flex flex-row items-center gap-4'>
          <Skeleton className='rounded-full'>
            <Avatar className='size-10'>
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </Skeleton>
          <div className='flex flex-col'>
            <TypographyLarge className='capitalize'>Unknown User</TypographyLarge>
            <TypographyMuted>{formatPresenceTimestamp(0)}</TypographyMuted>
          </div>
        </div>
        <AddFriendButton />
      </li>
    );
  }

  return (
    <li className='bg-accent hover:bg-accent/80 flex items-center gap-6 rounded-xl p-2 px-4 transition-colors'>
      <div className='flex flex-row items-center gap-4'>
        <Avatar className='size-10'>
          <AvatarImage src={target.imageUrl || '/default-avatar.png'} alt={`${target.username} avatar`} />
          <AvatarFallback>{target.username ? target.username.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
        </Avatar>
        <div className='flex flex-col'>
          <TypographyLarge className='capitalize'>{target.username}</TypographyLarge>
          <TypographyMuted className={formatted.toLowerCase() === 'online' ? 'text-green-500' : ''}>{formatPresenceTimestamp(lastSeen)}</TypographyMuted>
        </div>
      </div>
      {target.clerkId !== userId &&
        (isFriend ? (
          <RemoveFriendButton targetUserId={target.clerkId} userId={userId} />
        ) : isPending ? null : (
          <AddFriendButton targetUserId={target.clerkId} userId={userId} />
        ))}
    </li>
  );
}
