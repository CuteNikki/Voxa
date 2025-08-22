'use client';

import { useQuery } from 'convex/react';

import { api } from '../../../convex/_generated/api';

import { BaseSkeleton, FriendElement } from '@/components/friends/user';
import { TypographyLarge } from '@/components/typography/large';
import { TypographyMuted } from '@/components/typography/muted';

export function FriendList({ userId }: { userId: string }) {
  const friendIds = useQuery(api.friends.getFriendIds, { userId });

  return (
    <div className='flex flex-col gap-2'>
      <TypographyLarge>Friends</TypographyLarge>
      {friendIds === undefined ? (
        <ul className='flex flex-col gap-2'>
          {Array.from({ length: 3 }).map((_, index) => (
            <BaseSkeleton key={index} />
          ))}
        </ul>
      ) : friendIds.length > 0 ? (
        <ul className='flex flex-col gap-2'>
          {friendIds.map((id) => (
            <FriendElement key={id} userId={userId} targetId={id} />
          ))}
        </ul>
      ) : (
        <TypographyMuted>No friends found</TypographyMuted>
      )}
    </div>
  );
}
