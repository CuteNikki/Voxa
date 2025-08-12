'use client';

import { api } from '../../../convex/_generated/api';

import { UserElement } from '@/components/friends/user';
import { useQuery } from 'convex/react';

export function UserList({ userId }: { userId: string }) {
  const users = useQuery(api.users.getUsers);

  return (
    <div>
      <h2>User List</h2>
      {users ? (
        <ul className='flex flex-col gap-2 p-2'>
          {users.map((target) => (
            <UserElement key={target.clerkId} targetId={target.clerkId} userId={userId} />
          ))}
        </ul>
      ) : (
        <p>Loading users...</p>
      )}
      {users && users.length === 0 && <p>No users found.</p>}
    </div>
  );
}
