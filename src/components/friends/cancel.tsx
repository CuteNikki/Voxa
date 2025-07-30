import { useMutation } from 'convex/react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export function CancelRequestButton({ targetId }: { targetId: string }) {
  const respond = useMutation(api.friends.respondToRequest);

  return (
    <Button onClick={() => respond({ targetId, response: 'decline' })} variant='destructive'>
      Cancel
    </Button>
  );
}
