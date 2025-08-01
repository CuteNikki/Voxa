import { useMutation } from 'convex/react';

import { CheckIcon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export function AcceptRequestButton({ targetId }: { targetId: string }) {
  const respond = useMutation(api.friends.respondToRequest);

  return (
    <Button onClick={() => respond({ targetId, response: 'accept' })} size='icon' aria-label='Accept request'>
      <CheckIcon />
    </Button>
  );
}
