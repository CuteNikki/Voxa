'use client';

import { useQuery } from 'convex/react';

import { api } from '../../../convex/_generated/api';

import { UserElement } from '@/components/friends/user';

export function FriendList({ userId }: { userId: string }) {
  const friendIds = useQuery(api.friends.getFriendIds, { userId });

  return (
    <div>
      <h2>Friend List</h2>
      {friendIds ? (
        <ul className='flex flex-col gap-2 p-2'>
          {friendIds.map((id) => (
            <UserElement key={id} userId={userId} targetId={id} />
          ))}
        </ul>
      ) : (
        <p>Loading friends...</p>
      )}
      {friendIds && friendIds.length === 0 && <p>No friends found.</p>}
    </div>
  );
}
