import { useMutation } from 'convex/react';

import { XIcon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export function CancelRequestButton({ targetId, userId }: { targetId: string; userId: string }) {
  const respondToRequest = useMutation(api.friends.respondToRequest);

  return (
    <Button
      variant='destructive'
      size='icon'
      title='Cancel friend request'
      aria-label='Cancel friend request'
      onClick={async () => respondToRequest({ targetId, userId, response: 'decline' })}
    >
      <XIcon />
    </Button>
  );
}
