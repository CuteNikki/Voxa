import { useQuery } from 'convex/react';

import { api } from '../../../convex/_generated/api';

import { UserDetails } from '@/components/chat/user';
import { RemoveFriendButton } from '@/components/friends/remove';

export function FriendList() {
  const friendIds = useQuery(api.friends.getFriendIds);

  return (
    <div>
      <h2>Friend List</h2>
      {friendIds ? (
        <ul>
          {friendIds.map((id) => (
            <UserElement key={id} userId={id} />
          ))}
        </ul>
      ) : (
        <p>Loading friends...</p>
      )}
      {friendIds && friendIds.length === 0 && <p>No friends found.</p>}
    </div>
  );
}

function UserElement({
  userId,
}: {
    userId: string;
}) {

  return (
    <li className='flex items-center gap-4'>
      <UserDetails userId={userId} />
      <RemoveFriendButton friendId={userId} />
    </li>
  );
}
