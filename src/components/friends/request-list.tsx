'use client';

import { useQuery } from 'convex/react';

import { api } from '../../../convex/_generated/api';

import { AcceptRequestButton } from '@/components/friends/accept';
import { CancelRequestButton } from '@/components/friends/cancel';
import { DeclineRequestButton } from '@/components/friends/decline';
import { UserSkeleton } from '@/components/friends/user';
import { TypographyLarge } from '@/components/typography/large';
import { TypographyMuted } from '@/components/typography/muted';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
            <UserSkeleton key={index} />
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
            <UserSkeleton key={index} />
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
          <SentRequestUser key={req._id} targetId={req.from} userId={userId} />
        ))}
      </ul>
      {!outgoingRequests.length && <TypographyMuted>No outgoing requests.</TypographyMuted>}
    </div>
  );
}

function ReceivedRequestUser({ targetId, userId }: { targetId: string; userId: string }) {
  const target = useQuery(api.users.getUser, { clerkId: targetId });

  if (!target) {
    return <div className='h-12 w-12 rounded-full bg-gray-400' />;
  }

  return (
    <li className='bg-accent/70 hover:bg-primary/20 flex items-center justify-between gap-6 rounded-xl p-2 px-4 transition-colors'>
      <div className='flex flex-row items-center gap-4'>
        <Avatar className='size-12'>
          <AvatarImage src={target.imageUrl || '/default-avatar.png'} alt={`${target.username} avatar`} />
          <AvatarFallback>{target.username ? target.username.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
        </Avatar>
        <div className='flex flex-col'>
          <TypographyLarge className='capitalize'>{target.username}</TypographyLarge>
        </div>
      </div>
      <div className='flex items-center gap-1'>
        <AcceptRequestButton userId={userId} targetId={targetId} />
        <DeclineRequestButton userId={userId} targetId={targetId} />
      </div>
    </li>
  );
}

function SentRequestUser({ targetId, userId }: { targetId: string; userId: string }) {
  const target = useQuery(api.users.getUser, { clerkId: targetId });

  if (!target) {
    return <div className='h-12 w-12 rounded-full bg-gray-400' />;
  }

  return (
    <li className='bg-accent/70 hover:bg-primary/20 flex items-center justify-between gap-6 rounded-xl p-2 px-4 transition-colors'>
      <div className='flex flex-row items-center gap-4'>
        <Avatar className='size-12'>
          <AvatarImage src={target.imageUrl || '/default-avatar.png'} alt={`${target.username} avatar`} />
          <AvatarFallback>{target.username ? target.username.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
        </Avatar>
        <div className='flex flex-col'>
          <TypographyLarge className='capitalize'>{target.username}</TypographyLarge>
        </div>
      </div>
      <CancelRequestButton userId={userId} targetId={targetId} />
    </li>
  );
}
