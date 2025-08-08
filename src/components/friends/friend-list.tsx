import { auth } from '@clerk/nextjs/server';
import { fetchQuery } from 'convex/nextjs';

import { api } from '../../../convex/_generated/api';

import { RemoveFriendButton } from '@/components/friends/remove';
import { UserDetails } from '@/components/friends/user-details';

export async function FriendList() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const friendIds = await fetchQuery(api.friends.getFriendIds, { userId });

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

function UserElement({ userId }: { userId: string }) {
  return (
    <li className='flex items-center gap-4'>
      <UserDetails userId={userId} />
      <RemoveFriendButton friendId={userId} />
    </li>
  );
}
