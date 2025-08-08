import { auth } from '@clerk/nextjs/server';
import { fetchQuery } from 'convex/nextjs';

import { api } from '../../convex/_generated/api';

import Link from 'next/link';

export async function PrivateChats() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const privateChats = await fetchQuery(api.chats.getChats, { userId });

  return (
    <div className='h-60'>
      <h3 className='mb-2 text-lg font-semibold'>Private Chats:</h3>
      <ul>
        {privateChats.map((chat) => (
          <Link href={`/chats/${chat._id}`} key={chat._id} className='mb-2 flex min-h-[24px] items-center'>
            <ChatName members={[chat.userIdOne, chat.userIdTwo]} currentUser={userId} />
          </Link>
        ))}
      </ul>
    </div>
  );
}

export async function ChatName({ members, currentUser }: { members: string[]; currentUser: string }) {
  const otherUser = await fetchQuery(api.users.getUser, { clerkId: members.filter((m) => m !== currentUser)[0] });

  return <span className='capitalize'>{otherUser ? otherUser.username : 'Unnamed Chat'}</span>;
}
