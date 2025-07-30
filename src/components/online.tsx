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
            <User key={user.userId} targetId={user.userId} lastSeen={user.lastSeen} isOnline={user.isOnline} />
          ))}
        </ul>
      ) : (
        <ul>
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className='flex items-center gap-2'>
              <div className='w-12 h-12 bg-gray-400 rounded-full' />
              <div className='flex flex-col items-start'>
                <div className='h-[21px] w-40 bg-gray-400 rounded-md' />
                <div className='h-[21px] w-20 bg-gray-400 rounded-md' />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
