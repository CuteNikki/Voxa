'use client';

import { fetchQuery } from 'convex/nextjs';
import { useQuery } from 'convex/react';
import Image from 'next/image';

import { api } from '../../../convex/_generated/api';

import { AcceptRequestButton } from '@/components/friends/accept';
import { CancelRequestButton } from '@/components/friends/cancel';
import { DeclineRequestButton } from '@/components/friends/decline';

export function RequestList({ userId }: { userId: string }) {
  const receivedRequests = useQuery(api.friends.getFriendRequests, { userId });
  const sentRequests = useQuery(api.friends.getSentRequests, { userId });

  return (
    <div>
      <h2>Request List</h2>
      {receivedRequests ? (
        <ul>
          {receivedRequests.map((req) => (
            <ReceivedRequestUser key={req._id} targetId={req.from} userId={userId} />
          ))}
        </ul>
      ) : (
        <p>Loading friend requests...</p>
      )}
      {receivedRequests && receivedRequests.length === 0 && <p>No friend requests.</p>}
      <h2>Sent Requests</h2>
      {sentRequests ? (
        <ul>
          {sentRequests.map((req) => (
            <SentRequestUser key={req._id} targetId={req.to} userId={userId} />
          ))}
        </ul>
      ) : (
        <p>Loading sent requests...</p>
      )}
      {sentRequests && sentRequests.length === 0 && <p>No sent requests.</p>}
    </div>
  );
}

async function ReceivedRequestUser({ targetId, userId }: { targetId: string; userId: string }) {
  const targetUser = await fetchQuery(api.users.getUser, { clerkId: targetId });

  if (!targetUser) {
    return <div className='h-12 w-12 rounded-full bg-gray-400' />;
  }

  return (
    <div className='flex items-center gap-2'>
      <Image
        src={targetUser.imageUrl || '/default-avatar.png'}
        alt={`${targetUser.username} avatar`}
        width={512}
        height={512}
        className='h-12 w-12 rounded-full'
      />
      <div className='flex flex-col items-start'>
        <span className='capitalize'>{targetUser.username}</span>
      </div>
      <AcceptRequestButton userId={userId} targetId={targetId} />
      <DeclineRequestButton userId={userId} targetId={targetId} />
    </div>
  );
}

async function SentRequestUser({ targetId, userId }: { targetId: string; userId: string }) {
  const targetUser = await fetchQuery(api.users.getUser, { clerkId: targetId });

  if (!targetUser) {
    return <div className='h-12 w-12 rounded-full bg-gray-400' />;
  }

  return (
    <div className='flex items-center gap-2'>
      <Image
        src={targetUser.imageUrl || '/default-avatar.png'}
        alt={`${targetUser.username} avatar`}
        width={512}
        height={512}
        className='h-12 w-12 rounded-full'
      />
      <div className='flex flex-col items-start'>
        <span className='capitalize'>{targetUser.username}</span>
      </div>
      <CancelRequestButton userId={userId} targetId={targetId} />
    </div>
  );
}
