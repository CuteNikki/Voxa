import { useQuery } from 'convex/react';

import { CreatePrivateChat } from '@/components/create-chat';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { api } from '../../convex/_generated/api';

export function User({ userId, lastSeen, isOnline }: { userId: string; lastSeen: number; isOnline?: boolean }) {
  const currentUser = useUser();
  const user = useQuery(api.users.getUser, { clerkId: userId });

  if (!currentUser || !currentUser.isLoaded || !currentUser.isSignedIn) {
    return null;
  }

  return (
    <li key={userId} className='flex items-center mb-2 min-h-[24px]'>
      {!user ? (
        <div className='flex items-center gap-2'>
          <div className='w-12 h-12 bg-gray-400 rounded-full' />
          <div className='flex flex-col items-start'>
            <div className='h-[21px] w-40 bg-gray-400 rounded-md' />
            <div className='h-[21px] w-20 bg-gray-400 rounded-md' />
          </div>
        </div>
      ) : (
        <div className='flex items-center gap-2'>
          <Image src={user.imageUrl || '/default-avatar.png'} alt={`${user.username} avatar`} width={512} height={512} className='rounded-full h-12 w-12' />
          <div className='flex flex-col items-start'>
            <span className='capitalize'>{user.username}</span>
            {isOnline ? (
              <span className='text-green-500'>Online</span>
            ) : (
              <span className='text-gray-400'>Last seen {new Date(lastSeen).toLocaleTimeString()}</span>
            )}
          </div>
          {currentUser.user.id !== userId && <CreatePrivateChat targetUserId={userId} />}
        </div>
      )}
    </li>
  );
}
