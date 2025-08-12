'use client';

import { useQuery } from 'convex/react';

import { api } from '../../../convex/_generated/api';

import { BaseSkeleton, OutgoingRequestUser, ReceivedRequestUser } from '@/components/friends/user';
import { TypographyMuted } from '@/components/typography/muted';

export function RequestList({ userId }: { userId: string }) {
  return (
    <>
      <ReceivedRequests userId={userId} />
      <OutgoingRequests userId={userId} />
    </>
  );
}

function ReceivedRequests({ userId }: { userId: string }) {
  const receivedRequests = useQuery(api.friends.getFriendRequests, { userId });

  if (receivedRequests === undefined) {
    return (
      <div className='p-2'>
        <h2>Received requests</h2>
        <ul className='flex flex-col gap-2'>
          {Array.from({ length: 3 }).map((_, index) => (
            <BaseSkeleton key={index} />
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className='p-2'>
      <h2>Received requests</h2>
      <ul className='flex flex-col gap-2'>
        {receivedRequests.map((req) => (
          <ReceivedRequestUser key={req._id} targetId={req.from} userId={userId} />
        ))}
      </ul>
      {!receivedRequests.length && <TypographyMuted>No received requests.</TypographyMuted>}
    </div>
  );
}

function OutgoingRequests({ userId }: { userId: string }) {
  const outgoingRequests = useQuery(api.friends.getSentRequests, { userId });

  if (outgoingRequests === undefined) {
    return (
      <div>
        <h2>Outgoing requests</h2>
        <ul className='flex flex-col gap-2 p-2'>
          {Array.from({ length: 3 }).map((_, index) => (
            <BaseSkeleton key={index} />
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className='p-2'>
      <h2>Outgoing requests</h2>
      <ul className='flex flex-col gap-2'>
        {outgoingRequests.map((req) => (
          <OutgoingRequestUser key={req._id} targetId={req.from} userId={userId} />
        ))}
      </ul>
      {!outgoingRequests.length && <TypographyMuted>No outgoing requests.</TypographyMuted>}
    </div>
  );
}
