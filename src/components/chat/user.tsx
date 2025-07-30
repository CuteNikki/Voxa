import { useQuery } from 'convex/react';
import Image from 'next/image';

import { api } from '../../../convex/_generated/api';

export function UserDetails({ userId }: { userId: string }) {
  const user = useQuery(api.users.getUser, { clerkId: userId });
  const presence = useQuery(api.presence.getUserPresence, { userId });

  const lastSeen = presence?.lastSeen ?? 0;
  const isOnline = Date.now() - lastSeen < 30_000; // 30 seconds

  if (!user) {
    return <p>User not found.</p>;
  }

  return (
    <div className='user-details'>
      <h2 className='text-xl font-semibold capitalize'>{user.username}</h2>
      <Image src={user.imageUrl || '/default-avatar.png'} alt={`${user.username} avatar`} width={512} height={512} className='rounded-full h-12 w-12' />
      {isOnline ? <span className='text-green-600'>Online</span> : <span className='text-gray-500'>Last seen {new Date(lastSeen).toLocaleString()}</span>}
    </div>
  );
}
