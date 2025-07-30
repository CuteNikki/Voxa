import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';

import Link from 'next/link';
import { api } from '../../convex/_generated/api';

export function PrivateChats() {
  const user = useUser();
  const privateChats = useQuery(api.chats.getChats);

  if (!user || !user.isLoaded || !user.isSignedIn) {
    return null;
  }

  return (
    <div className='h-60'>
      <h3 className='mb-2 text-lg font-semibold'>Private Chats:</h3>
      {privateChats ? (
        <ul>
          {privateChats.map((chat) => (
            <Link
              href={`/chat/${chat.userIdOne === user.user.id ? chat.userIdTwo : chat.userIdOne}`}
              key={chat._id}
              className='mb-2 flex min-h-[24px] items-center'
            >
              <ChatName members={[chat.userIdOne, chat.userIdTwo]} currentUser={user.user.id} />
            </Link>
          ))}
        </ul>
      ) : (
        <p>No chats available.</p>
      )}
    </div>
  );
}

function ChatName({ members, currentUser }: { members: string[]; currentUser: string }) {
  const otherUser = useQuery(api.users.getUser, { clerkId: members.filter((m) => m !== currentUser)[0] });

  return <span className='capitalize'>{otherUser ? otherUser.username : 'Unnamed Chat'}</span>;
}
