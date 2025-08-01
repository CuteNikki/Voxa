import { fetchMutation } from 'convex/nextjs';

import { UserMinus2Icon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export async function RemoveFriendButton({ friendId }: { friendId: string }) {
  return (
    <form
      action={async () => {
        'use server';

        await fetchMutation(api.friends.removeFriend, { friendId });
      }}
    >
      <Button type='submit' variant='destructive' size='icon' aria-label='Remove friend'>
        <UserMinus2Icon />
      </Button>
    </form>
  );
}
