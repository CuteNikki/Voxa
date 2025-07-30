'use client';

import { useMutation } from 'convex/react';

import { Button } from '@/components/ui/button';

import { api } from '../../../convex/_generated/api';

export function AddFriendButton({ targetUserId }: { targetUserId: string }) {
  const sendRequest = useMutation(api.friends.sendRequest);

  return (
    <Button
      onClick={() => {
        sendRequest({ to: targetUserId });
      }}
    >
      Add Friend
    </Button>
  );
}
