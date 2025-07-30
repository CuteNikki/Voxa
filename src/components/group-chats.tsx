import { useQuery } from 'convex/react';
import Link from 'next/link';
import { api } from '../../convex/_generated/api';

export function GroupChats() {
  const groupChats = useQuery(api.chats.getGroups);

  return (
    <div className='h-60'>
      <h3 className='mb-2 text-lg font-semibold'>Group Chats:</h3>
      {groupChats ? (
        <ul>
          {groupChats.map((chat) => (
            <Link href={`/group/${chat._id}`} key={chat._id} className='mb-2 flex min-h-[24px] items-center'>
              <span className='capitalize'>{chat.name}</span>
            </Link>
          ))}
        </ul>
      ) : (
        <p>No group chats available.</p>
      )}
    </div>
  );
}
