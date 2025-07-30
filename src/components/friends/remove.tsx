import { useMutation, useQuery } from 'convex/react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export function RemoveFriendButton({ friendId }: { friendId: string }) {
  const respond = useMutation(api.friends.respondToRequest);
  const deleteChat = useMutation(api.chats.deleteChat);
  const chat = useQuery(api.chats.getPrivateChatWithUser, { userId: friendId });

  return (
    <Button
      variant='destructive'
      onClick={() => {
        respond({ targetId: friendId, response: 'decline' });
        if (chat) {
          deleteChat({ chatId: chat._id });
        }
      }}
    >
      Remove
    </Button>
  );
}
