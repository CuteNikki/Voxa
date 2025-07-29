import { useQuery } from 'convex/react';
import Image from 'next/image';
import { api } from '../../convex/_generated/api';

export default function OnlineUsersList() {
  const onlineUsers = useQuery(api.presence.getOnlineUsers);

  if (!onlineUsers) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      <h3 className='text-lg font-semibold mb-2'>Online Users:</h3>
      {onlineUsers.map((user) => (
        <OnlineUser key={user.userId} userId={user.userId} lastSeen={user.lastSeen} />
      ))}
    </ul>
  );
}

export function OnlineUser({ userId, lastSeen }: { userId: string; lastSeen: number }) {
  const user = useQuery(api.users.getUser, { clerkId: userId });

  if (!user) {
    return (
      <li key={userId} className='flex items-center mb-2'>
        <div className='w-6 h-6 bg-gray-300 rounded-full mr-2' />
        <div className='h-[21px] w-20 bg-gray-400 rounded-md' />
      </li>
    );
  }

  return (
    <li key={userId} className='flex items-center mb-2'>
      <Image
        src={user.imageUrl || '/default-avatar.png'}
        alt={`${user.fullName} avatar`}
        width={512}
        height={512}
        style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8 }}
      />
      {user.fullName} last seen: {new Date(lastSeen).toLocaleTimeString()}
    </li>
  );
}
