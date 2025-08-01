import { fetchMutation } from 'convex/nextjs';

import { UserPlus2Icon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export async function AddFriendButton({ targetUserId }: { targetUserId: string }) {
  return (
    <form
      action={async () => {
        'use server';

        await fetchMutation(api.friends.sendRequest, { to: targetUserId });
      }}
    >
      <Button type='submit' size='icon' aria-label='Add friend'>
        <UserPlus2Icon />
      </Button>
    </form>
  );
}
