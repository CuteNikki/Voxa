import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';

import { api } from '../../convex/_generated/api';

export function PrivateChats() {
  const user = useUser();
  const privateChats = useQuery(api.chats.getUserChats);

  if (!user || !user.isLoaded || !user.isSignedIn) {
    return null;
  }

  return (
    <div className='h-60'>
      <h3 className='text-lg font-semibold mb-2'>Private Chats:</h3>
      {privateChats ? (
        <ul>
          {privateChats.map((chat) => (
            <li key={chat._id} className='flex items-center mb-2 min-h-[24px]'>
              <ChatName members={chat.memberIds} currentUser={user.user.id} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No group chats available.</p>
      )}
    </div>
  );
}

function ChatName({ members, currentUser }: { members: string[]; currentUser: string }) {
  const otherUser = useQuery(api.users.getUser, { clerkId: members.filter((m) => m !== currentUser)[0] });

  return <span className='capitalize'>{otherUser ? otherUser.username : 'Unnamed Chat'}</span>;
}
