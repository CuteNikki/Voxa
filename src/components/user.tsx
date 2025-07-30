import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import Image from 'next/image';

import { api } from '../../convex/_generated/api';

import { AddFriendButton } from '@/components/friends/add';
import { CancelRequestButton } from '@/components/friends/cancel';
import { RemoveFriendButton } from '@/components/friends/remove';

export function User({ targetId, lastSeen, isOnline }: { targetId: string; lastSeen: number; isOnline?: boolean }) {
  const currentUser = useUser();
  const targetUser = useQuery(api.users.getUser, { clerkId: targetId });
  const isFriend = useQuery(api.friends.isFriend, { targetId });
  const isPending = useQuery(api.friends.isPendingRequest, { targetId });

  console.log(isFriend);

  if (!currentUser || !currentUser.isLoaded || !currentUser.isSignedIn) {
    return null;
  }

  return (
    <li key={targetId} className='flex items-center mb-2 min-h-[24px]'>
      {!targetUser ? (
        <div className='flex items-center gap-2'>
          <div className='w-12 h-12 bg-gray-400 rounded-full' />
          <div className='flex flex-col items-start'>
            <div className='h-[21px] w-40 bg-gray-400 rounded-md' />
            <div className='h-[21px] w-20 bg-gray-400 rounded-md' />
          </div>
        </div>
      ) : (
        <div className='flex items-center gap-2'>
          <Image
            src={targetUser.imageUrl || '/default-avatar.png'}
            alt={`${targetUser.username} avatar`}
            width={512}
            height={512}
            className='rounded-full h-12 w-12'
          />
          <div className='flex flex-col items-start'>
            <span className='capitalize'>{targetUser.username}</span>
            {isOnline ? (
              <span className='text-green-500'>Online</span>
            ) : (
              <span className='text-gray-400'>Last seen {new Date(lastSeen).toLocaleTimeString()}</span>
            )}
          </div>
          {currentUser.user.id !== targetId &&
            (isPending || isFriend ? (
              isPending ? (
                <CancelRequestButton targetId={targetId} />
              ) : (
                <RemoveFriendButton friendId={targetId} />
              )
            ) : (
              <AddFriendButton targetUserId={targetId} />
            ))}
        </div>
      )}
    </li>
  );
}
