'use client';

import { Doc } from '../../../convex/_generated/dataModel';

import { BaseSkeleton, OutgoingRequestUser, ReceivedRequestUser } from '@/components/friends/user';
import { TypographyLarge } from '@/components/typography/large';
import { TypographyMuted } from '@/components/typography/muted';

export function RequestList({
  userId,
  incomingRequests,
  outgoingRequests,
}: {
  userId: string;
  incomingRequests?: Doc<'requests'>[];
  outgoingRequests?: Doc<'requests'>[];
}) {
  return (
    <div className='flex flex-col gap-6'>
      <IncomingRequests userId={userId} incomingRequests={incomingRequests} />
      <OutgoingRequests userId={userId} outgoingRequests={outgoingRequests} />
    </div>
  );
}

function IncomingRequests({ userId, incomingRequests }: { userId: string; incomingRequests?: Doc<'requests'>[] }) {
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

function OutgoingRequests({ userId, outgoingRequests }: { userId: string; outgoingRequests?: Doc<'requests'>[] }) {
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
