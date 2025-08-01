'use client';

import { useMutation } from 'convex/react';

import { UserPlus2Icon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export function AddFriendButton({ targetUserId }: { targetUserId: string }) {
  const sendRequest = useMutation(api.friends.sendRequest);

  return (
    <Button onClick={() => sendRequest({ to: targetUserId })} size='icon' aria-label='Add friend'>
      <UserPlus2Icon />
    </Button>
  );
}
