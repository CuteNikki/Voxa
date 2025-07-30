import { useMutation } from 'convex/react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export function RemoveFriendButton({ friendId }: { friendId: string }) {
  const removeFriend = useMutation(api.friends.removeFriend);

  return (
    <Button
      variant='destructive'
      onClick={() => {
        removeFriend({ friendId });
      }}
    >
      Remove
    </Button>
  );
}
