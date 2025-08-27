'use client';

import { useMutation } from 'convex/react';

import { api } from '../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export function CreateGroupChat() {
  const createGroupChat = useMutation(api.groups.createGroupChat);

  return (
    <div className='flex flex-col items-center justify-center p-4'>
      <h3>Create a New Group Chat</h3>
      <Button className='mt-4' onClick={() => createGroupChat({}).catch(console.error)}>
        Create Group
      </Button>
    </div>
  );
}
