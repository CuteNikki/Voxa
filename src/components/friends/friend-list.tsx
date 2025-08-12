'use client';

import { useQuery } from 'convex/react';

import { api } from '../../../convex/_generated/api';

import { UserElement, UserSkeleton } from '@/components/friends/user';
import { TypographyMuted } from '@/components/typography/muted';

export function FriendList({ userId }: { userId: string }) {
  const friendIds = useQuery(api.friends.getFriendIds, { userId });

  if (friendIds === undefined) {
    return (
      <div className='p-2'>
        <h2>Friend List</h2>
        <ul className='flex flex-col gap-2'>
          {Array.from({ length: 3 }).map((_, index) => (
            <UserSkeleton key={index} />
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className='p-2'>
      <h2>Friend List</h2>
      <ul className='flex flex-col gap-2'>
        {friendIds.map((id) => (
          <UserElement key={id} userId={userId} targetId={id} />
        ))}
      </ul>
      {!friendIds.length && <TypographyMuted>No friends found.</TypographyMuted>}
    </div>
  );
}
