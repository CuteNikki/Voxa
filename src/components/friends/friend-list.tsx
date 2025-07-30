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
            <li key={friend.clerkId} className='flex items-center gap-2'>
              <Image
                src={friend.imageUrl || '/default-avatar.png'}
                alt={`${friend.username} avatar`}
                width={512}
                height={512}
                className='rounded-full h-12 w-12'
              />
              <span className='capitalize'>{friend.username}</span>
              <RemoveFriendButton friendId={friend.clerkId} />
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading friends...</p>
      )}
      {friends && friends.length === 0 && <p>No friends found.</p>}
    </div>
  );
}
