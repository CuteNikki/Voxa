import { useMutation } from 'convex/react';

import { CheckIcon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export function AcceptRequestButton({ targetId, userId }: { targetId: string; userId: string }) {
  const respondToRequest = useMutation(api.friends.respondToRequest);

  return (
    <Button size='icon' aria-label='Accept request' onClick={async () => respondToRequest({ targetId, userId, response: 'accept' })}>
      <CheckIcon />
    </Button>
  );
}
