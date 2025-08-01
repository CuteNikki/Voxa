import { fetchQuery } from 'convex/nextjs';
import Image from 'next/image';

import { api } from '../../../convex/_generated/api';

import { TypographyLarge } from '@/components/typography/large';
import { TypographyMuted } from '@/components/typography/muted';

export async function UserDetails({ userId }: { userId: string }) {
  const user = await fetchQuery(api.users.getUser, { clerkId: userId });
  const presence = await fetchQuery(api.presence.getUserPresence, { userId });

  const lastSeen = presence?.lastSeen ?? 0;
  const isOnline = Date.now() - lastSeen < 30_000; // 30 seconds

  if (!user) {
    return <p>User not found.</p>;
  }

  return (
    <div className='flex flex-row items-center gap-2'>
      <Image src={user.imageUrl || '/default-avatar.png'} alt={`${user.username} avatar`} width={512} height={512} className='h-12 w-12 rounded-full' />
      <div className='flex flex-col'>
        <TypographyLarge className='capitalize'>{user.username}</TypographyLarge>
        {isOnline ? <span className='text-green-600'>Online</span> : <TypographyMuted>Last seen {new Date(lastSeen).toLocaleString()}</TypographyMuted>}
      </div>
    </div>
  );
}
