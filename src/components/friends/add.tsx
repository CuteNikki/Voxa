import { auth } from '@clerk/nextjs/server';
import { fetchMutation } from 'convex/nextjs';
import { revalidatePath } from 'next/cache';

import { UserPlus2Icon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export async function AddFriendButton({ targetUserId }: { targetUserId: string }) {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return (
    <form
      action={async () => {
        'use server';

        await fetchMutation(api.friends.sendRequest, { to: targetUserId, from: userId });
        revalidatePath('/');
      }}
    >
      <Button type='submit' size='icon' aria-label='Add friend'>
        <UserPlus2Icon />
      </Button>
    </form>
  );
}
