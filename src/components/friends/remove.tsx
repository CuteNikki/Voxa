import { auth } from '@clerk/nextjs/server';
import { fetchMutation } from 'convex/nextjs';
import { revalidatePath } from 'next/cache';

import { UserMinus2Icon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export async function RemoveFriendButton({ friendId }: { friendId: string }) {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return (
    <form
      action={async () => {
        'use server';

        await fetchMutation(api.friends.removeFriend, { friendId, userId });
        revalidatePath('/');
      }}
    >
      <Button type='submit' variant='destructive' size='icon' aria-label='Remove friend'>
        <UserMinus2Icon />
      </Button>
    </form>
  );
}
