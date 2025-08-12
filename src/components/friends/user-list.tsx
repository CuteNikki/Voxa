'use client';

import { useQuery } from 'convex/react';

import { api } from '../../../convex/_generated/api';

import { UserElement, UserSkeleton } from '@/components/friends/user';
import { TypographyMuted } from '@/components/typography/muted';

export function UserList({ userId }: { userId: string }) {
  const users = useQuery(api.users.getUsers);

  if (users === undefined) {
    return (
      <div className='p-2'>
        <h2>User List</h2>
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
      <h2>User List</h2>
      <ul className='flex flex-col gap-2'>
        {users.map((target) => (
          <UserElement key={target.clerkId} targetId={target.clerkId} userId={userId} />
        ))}
      </ul>
      {!users.length && <TypographyMuted>No users found.</TypographyMuted>}
    </div>
  );
}
