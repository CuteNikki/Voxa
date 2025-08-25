'use client';

import { useMutation } from 'convex/react';

import { UserMinus2Icon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export function RemoveFriendButton({ targetUserId, userId }: { targetUserId: string; userId: string }) {
  const removeFriend = useMutation(api.friends.removeFriend);

  return (
    <Button variant='destructive' size='icon' title='Remove friend' aria-label='Remove friend' onClick={() => removeFriend({ targetUserId, userId }).catch(console.error)}>
      <UserMinus2Icon />
    </Button>
  );
}
