'use client';

import { useMutation } from 'convex/react';

import { UserPlus2Icon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export function AddFriendButton({ targetUserId, userId }: { targetUserId?: string; userId?: string }) {
  const addFriend = useMutation(api.friends.sendRequest);

  if (!targetUserId || !userId) {
    return (
      <Button size='icon' aria-label='Add friend'>
        <UserPlus2Icon />
      </Button>
    );
  }

  return (
    <Button size='icon' aria-label='Add friend' onClick={() => addFriend({ to: targetUserId, from: userId })}>
      <UserPlus2Icon />
    </Button>
  );
}
