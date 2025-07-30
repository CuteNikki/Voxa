import { useQuery } from 'convex/react';
import Image from 'next/image';

import { api } from '../../../convex/_generated/api';

import { RemoveFriendButton } from '@/components/friends/remove';

export function FriendList() {
  const friends = useQuery(api.friends.getFriends);

  return (
    <div>
      <h2>Friend List</h2>
      {friends ? (
        <ul>
          {friends.map((friend) => (
            <UserElement key={friend.clerkId} user={friend} />
          ))}
        </ul>
      ) : (
        <p>Loading friends...</p>
      )}
      {friends && friends.length === 0 && <p>No friends found.</p>}
    </div>
  );
}

function UserElement({
  user,
}: {
  user: {
    imageUrl?: string;
    username?: string;
    emailVerified?: boolean;
    updatedAt?: string;
    isAdmin?: boolean;
    clerkId: string;
  };
}) {
  const presence = useQuery(api.presence.getUserPresence, { userId: user.clerkId });
  const lastSeen = presence?.lastSeen ?? 0;
  const isOnline = Date.now() - lastSeen < 30_000; // 30 seconds threshold

  return (
    <li key={user.clerkId} className='flex items-center gap-2'>
      <Image src={user.imageUrl || '/default-avatar.png'} alt={`${user.username} avatar`} width={512} height={512} className='h-12 w-12 rounded-full' />
      <div className='flex flex-col items-start'>
        <span className='capitalize'>{user.username}</span>
        {isOnline ? <span className='text-green-500'>Online</span> : <span className='text-gray-400'>Last seen {new Date(lastSeen).toLocaleTimeString()}</span>}
      </div>
      <RemoveFriendButton friendId={user.clerkId} />
    </li>
  );
}
