'use client';

import { useQuery } from 'convex/react';

import { api } from '../../../convex/_generated/api';

import { BaseSkeleton, OutgoingRequestUser, ReceivedRequestUser } from '@/components/friends/user';
import { TypographyLarge } from '@/components/typography/large';
import { TypographyMuted } from '@/components/typography/muted';

export function RequestList({ userId }: { userId: string }) {
  return (
    <div className='flex flex-col gap-6'>
      <IncomingRequests userId={userId} />
      <OutgoingRequests userId={userId} />
    </div>
  );
}

function IncomingRequests({ userId }: { userId: string }) {
  const incomingRequests = useQuery(api.friends.getFriendRequests, { userId });

  return (
    <div className='flex flex-col gap-2'>
      <TypographyLarge>Incoming</TypographyLarge>
      {incomingRequests === undefined ? (
        <ul className='flex flex-col gap-2'>
          {Array.from({ length: 3 }).map((_, index) => (
            <BaseSkeleton key={index} />
          ))}
        </ul>
      ) : incomingRequests.length > 0 ? (
        <ul className='flex flex-col gap-2'>
          {incomingRequests.map((req) => (
            <ReceivedRequestUser key={req._id} targetId={req.from} userId={userId} />
          ))}
        </ul>
      ) : (
        <TypographyMuted>No incoming requests</TypographyMuted>
      )}
    </div>
  );
}

function OutgoingRequests({ userId }: { userId: string }) {
  const outgoingRequests = useQuery(api.friends.getSentRequests, { userId });

  return (
    <div className='flex flex-col gap-2'>
      <TypographyLarge>Outgoing</TypographyLarge>
      {outgoingRequests === undefined ? (
        <ul className='flex flex-col gap-2'>
          {Array.from({ length: 3 }).map((_, index) => (
            <BaseSkeleton key={index} />
          ))}
        </ul>
      ) : outgoingRequests.length > 0 ? (
        <ul className='flex flex-col gap-2'>
          {outgoingRequests.map((req) => (
            <OutgoingRequestUser key={req._id} targetId={req.to} userId={userId} />
          ))}
        </ul>
      ) : (
        <TypographyMuted>No outgoing requests</TypographyMuted>
      )}
    </div>
  );
}
