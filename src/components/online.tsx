import { User } from '@/components/user';
import { useQuery } from 'convex/react';

import { api } from '../../convex/_generated/api';
export default function OnlineUsersList() {
  const onlineUsers = useQuery(api.presence.getOnlineUsers);

  return (
    <div className='h-60'>
      <h3 className='text-lg font-semibold mb-2'>Online Users:</h3>
      {onlineUsers ? (
        <ul>
          {onlineUsers.map((user) => (
            <User key={user.userId} userId={user.userId} lastSeen={user.lastSeen} isOnline={user.isOnline} />
          ))}
        </ul>
      ) : (
        <ul>
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className='flex items-center mb-2'>
              <div className='w-6 h-6 bg-gray-300 rounded-full mr-2' />
              <div className='h-[21px] w-20 bg-gray-400 rounded-md' />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
