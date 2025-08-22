import { randomUUID } from 'crypto';

import { auth } from '@clerk/nextjs/server';
import { fetchMutation } from 'convex/nextjs';

import { api } from '../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export async function CreateGroupChat() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return (
    <div className='flex flex-col items-center justify-center p-4'>
      <h3>Create a New Group Chat</h3>
      <form
        action={async () => {
          'use server';

          await fetchMutation(api.chats.createGroupChat, { name: randomUUID(), userId });
        }}
      >
        <Button className='mt-4' type='submit'>
          Create Group
        </Button>
      </form>
    </div>
  );
}
