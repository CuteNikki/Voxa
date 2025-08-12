'use client';

import { useMutation } from 'convex/react';

import { XIcon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export function DeclineRequestButton({ targetId, userId }: { targetId: string; userId: string }) {
  const respondToRequest = useMutation(api.friends.respondToRequest);

  return (
    <Button
      variant='destructive'
      size='icon'
      title='Decline friend request'
      aria-label='Decline friend request'
      onClick={() => respondToRequest({ userId, targetId, response: 'decline' })}
    >
      <XIcon />
    </Button>
  );
}
