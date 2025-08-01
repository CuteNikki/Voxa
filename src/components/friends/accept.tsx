import { auth } from '@clerk/nextjs/server';
import { fetchMutation } from 'convex/nextjs';
import { revalidatePath } from 'next/cache';

import { CheckIcon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export async function AcceptRequestButton({ targetId }: { targetId: string }) {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return (
    <form
      action={async () => {
        'use server';

        await fetchMutation(api.friends.respondToRequest, { targetId, userId, response: 'accept' });
        revalidatePath('/');
      }}
    >
      <Button type='submit' size='icon' aria-label='Accept request'>
        <CheckIcon />
      </Button>
    </form>
  );
}
