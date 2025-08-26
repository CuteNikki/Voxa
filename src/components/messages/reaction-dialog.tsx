import { useQuery } from 'convex/react';
import { useEffect, useState } from 'react';

import { api } from '../../../convex/_generated/api';

import { PLACEHOLDER_UNKNOWN_USER } from '@/constants/placeholders';

import { formatReactionTimestamp } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

export function ReactionDialogContent({
  message,
}: {
  message?: {
    reactions?: {
      reaction: string;
      userId: string;
      createdAt: number;
    }[];
  };
}) {
  const reactions = message?.reactions ?? [];
  const emojiGroups = reactions.reduce<Record<string, typeof reactions>>((acc, r) => {
    acc[r.reaction] = acc[r.reaction] || [];
    acc[r.reaction].push(r);
    return acc;
  }, {});
  const emojis = Object.keys(emojiGroups);
  const [activeTab, setActiveTab] = useState(emojis[0] ?? '');

  useEffect(() => {
    if (!emojis.includes(activeTab)) setActiveTab(emojis[0] ?? '');
  }, [emojis, activeTab]);

  if (!emojis.length) {
    return <div className='text-muted-foreground text-sm'>No reactions yet.</div>;
  }

  return (
    <div>
      <div className='mb-4'>
        <div className='flex border-b'>
          {emojis.map((emoji) => (
            <button
              key={emoji}
              className={`flex items-center gap-1 border-b-2 px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                activeTab === emoji ? 'border-primary text-primary' : 'text-muted-foreground hover:text-primary border-transparent'
              }`}
              onClick={() => setActiveTab(emoji)}
              type='button'
            >
              {emoji}
              <span className='text-muted-foreground ml-1 font-mono text-xs'>{emojiGroups[emoji].length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        {emojiGroups[activeTab]?.map((r, i) => (
          <div key={i} className='flex items-center justify-between gap-2'>
            <ReactionUser userId={r.userId} />
            <span className='text-muted-foreground text-xs'>{formatReactionTimestamp(r.createdAt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReactionUser({ userId }: { userId: string }) {
  const target = useQuery(api.users.getUser, { clerkId: userId });

  if (!target) {
    return (
      <div className='flex flex-row items-center gap-2'>
        <Avatar className='size-6'>
          <AvatarFallback>
            <Skeleton>{PLACEHOLDER_UNKNOWN_USER.initials}</Skeleton>
          </AvatarFallback>
        </Avatar>
        <Skeleton className='font-medium capitalize'>{PLACEHOLDER_UNKNOWN_USER.username}</Skeleton>
      </div>
    );
  }

  return (
    <div className='flex flex-row items-center gap-2'>
      <Avatar className='size-6'>
        <AvatarImage src={target.imageUrl || '/default-avatar.png'} alt={`${target.username} avatar`} />
        <AvatarFallback>{target.username ? target.username.charAt(0).toUpperCase() : <Skeleton>{PLACEHOLDER_UNKNOWN_USER.initials}</Skeleton>}</AvatarFallback>
      </Avatar>
      <span className='font-medium capitalize'>{target.username}</span>
    </div>
  );
}
