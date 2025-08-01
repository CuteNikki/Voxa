import { auth } from '@clerk/nextjs/server';
import { fetchMutation } from 'convex/nextjs';
import { revalidatePath } from 'next/cache';

import { XIcon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export async function CancelRequestButton({ targetId }: { targetId: string }) {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return (
    <form
      action={async () => {
        'use server';

        await fetchMutation(api.friends.respondToRequest, { targetId, userId, response: 'decline' });
        revalidatePath('/');
      }}
    >
      <Button type='submit' variant='destructive' size='icon' aria-label='Cancel request'>
        <XIcon />
      </Button>
    </form>
  );
}
