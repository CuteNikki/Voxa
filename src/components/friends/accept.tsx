import { useMutation } from 'convex/react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export function AcceptRequestButton({ targetId }: { targetId: string }) {
  const respond = useMutation(api.friends.respondToRequest);
  const createChat = useMutation(api.chats.createChat);

  return (
    <Button
      onClick={() => {
        respond({ targetId, response: 'accept' });
        createChat({ members: [targetId], isGroup: false });
      }}
    >
      Accept
    </Button>
  );
}
