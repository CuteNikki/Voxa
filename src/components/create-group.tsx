'use client';

import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';

import { api } from '../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export function CreateGroupChat() {
  const user = useUser();
  const createGroupChat = useMutation(api.chats.createGroupChat);

  if (!user || !user.isLoaded || !user.isSignedIn) {
    return null;
  }

  return (
    <div className='flex flex-col items-center justify-center p-4'>
      <h3>Create a New Group Chat</h3>
      <Button className='mt-4' onClick={() => createGroupChat({ name: 'New Group Chat' })}>
        Create Group
      </Button>
    </div>
  );
}
