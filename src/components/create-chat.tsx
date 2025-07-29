'use client';

import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';

import { api } from '../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export function CreatePrivateChat({ targetUserId }: { targetUserId: string }) {
  const user = useUser();
  const createChat = useMutation(api.chats.createChat);

  if (!user || !user.isLoaded || !user.isSignedIn) {
    return null;
  }

  return (
    <Button className='mt-4' onClick={() => createChat({ members: [user.user.id, targetUserId], isGroup: false })}>
      Create DM
    </Button>
  );
}
