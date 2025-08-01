import { useMutation } from 'convex/react';

import { UserMinus2Icon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export function RemoveFriendButton({ friendId }: { friendId: string }) {
  const removeFriend = useMutation(api.friends.removeFriend);

  return (
    <Button onClick={() => removeFriend({ friendId })} variant='destructive' size='icon' aria-label='Remove friend'>
      <UserMinus2Icon />
    </Button>
  );
}
