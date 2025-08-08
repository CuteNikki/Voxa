'use client';

import { useQuery } from 'convex/react';

import Image from 'next/image';
import { api } from '../../../convex/_generated/api';

export function UserDetails({ userId }: { userId: string }) {
  const user = useQuery(api.users.getUser, { clerkId: userId });

  if (!user) {
    return <span>Loading user...</span>;
  }

  return (
    <div className='flex items-center gap-2'>
      <Image width={512} height={512} src={user.imageUrl!} alt={`${user.username}'s profile`} className='h-8 w-8 rounded-full' />
      <span>{user.username}</span>
    </div>
  );
}
