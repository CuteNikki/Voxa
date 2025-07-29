import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function GroupChats() {
  const groupChats = useQuery(api.chats.getChats);

  return (
    <div className='h-60'>
      <h3 className='text-lg font-semibold mb-2'>Group Chats:</h3>
      {groupChats ? (
        <ul>
          {groupChats.map((chat) => (
            <li key={chat._id} className='flex items-center mb-2 min-h-[24px]'>
              <span className='capitalize'>{chat.name || 'Unnamed Group'}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No group chats available.</p>
      )}
    </div>
  );
}
