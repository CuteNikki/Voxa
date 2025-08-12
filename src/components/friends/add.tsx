'use client';

import { useMutation } from 'convex/react';

import { UserPlus2Icon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export function AddFriendButton({ targetUserId, userId }: { targetUserId: string; userId: string }) {
  const addFriend = useMutation(api.friends.sendRequest);

  return (
    <Button size='icon' title='Send friend request' aria-label='Send friend request' onClick={() => addFriend({ to: targetUserId, from: userId })}>
      <UserPlus2Icon />
    </Button>
  );
}
