import { auth } from '@clerk/nextjs/server';
import { fetchQuery } from 'convex/nextjs';
import Image from 'next/image';

import { api } from '../../../convex/_generated/api';

import { AddFriendButton } from '@/components/friends/add';
import { RemoveFriendButton } from '@/components/friends/remove';
import { TypographyLarge } from '@/components/typography/large';
import { TypographyMuted } from '@/components/typography/muted';

export async function UserList() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const users = await fetchQuery(api.users.getUsers);

  return (
    <div>
      <h2>User List</h2>
      {users ? (
        <ul>
          {users.map((target) => (
            <UserElement key={target.clerkId} target={target} userId={userId} />
          ))}
        </ul>
      ) : (
        <p>Loading users...</p>
      )}
      {users && users.length === 0 && <p>No users found.</p>}
    </div>
  );
}

async function UserElement({
  target,
  userId,
}: {
  target: {
    _id: string;
    imageUrl?: string | undefined;
    username?: string | undefined;
    emailVerified?: boolean | undefined;
    isAdmin?: boolean | undefined;
    clerkId: string;
    email: string;
    createdAt: number;
  };
  userId: string;
}) {
  const presence = await fetchQuery(api.presence.getUserPresence, { userId: target.clerkId });
  const isFriend = await fetchQuery(api.friends.isFriend, { userId: userId, targetId: target.clerkId });
  const isPending = await fetchQuery(api.friends.isPendingRequest, { userId: userId, targetId: target.clerkId });

  const lastSeen = presence?.lastSeen ?? 0;
  const isOnline = Date.now() - lastSeen < 30_000;

  return (
    <li className='flex items-center gap-4'>
      <div className='flex flex-row items-center gap-2'>
        <Image src={target.imageUrl || '/default-avatar.png'} alt={`${target.username} avatar`} width={512} height={512} className='h-12 w-12 rounded-full' />
        <div className='flex flex-col'>
          <TypographyLarge className='capitalize'>{target.username}</TypographyLarge>
          {isOnline ? <span className='text-green-600'>Online</span> : <TypographyMuted>Last seen {new Date(lastSeen).toLocaleString()}</TypographyMuted>}
        </div>
      </div>
      {target.clerkId !== userId &&
        (isFriend ? <RemoveFriendButton friendId={target.clerkId} /> : isPending ? null : <AddFriendButton targetUserId={target.clerkId} />)}
    </li>
  );
}
