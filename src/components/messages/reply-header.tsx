import { useQuery } from 'convex/react';

import { XIcon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { PLACEHOLDER_MESSAGE, PLACEHOLDER_UNKNOWN_USER } from '@/constants/placeholders';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function ReplyHeader({
  messageId,
  setReplyingTo,
  roundCorners,
}: {
  messageId: string;
  roundCorners?: boolean;
  setReplyingTo: (messageId?: string) => void;
}) {
  const message = useQuery(api.messages.getMessageById, { messageId });

  if (!message) {
    return (
      <div className={`bg-muted relative w-full ${roundCorners ? 'rounded-tl-md rounded-tr-md' : 'rounded-none'}`}>
        <div className='flex items-center gap-2 p-2 px-4'>
          <span className='flex shrink-0 flex-row items-center text-sm font-semibold'>
            Replying to <Skeleton className='bg-background capitalize'>{PLACEHOLDER_UNKNOWN_USER.username}</Skeleton>:{' '}
            <Skeleton className='bg-background'>{PLACEHOLDER_MESSAGE.content}</Skeleton>
          </span>
        </div>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setReplyingTo(undefined)}
          className='absolute top-0.5 right-3'
          aria-label='Cancel reply'
          title='Cancel reply'
        >
          <XIcon />
        </Button>
      </div>
    );
  }

  return (
    <div className={`bg-muted relative w-full ${roundCorners ? 'rounded-tl-md rounded-tr-md' : 'rounded-none'}`}>
      <div className='flex items-center gap-2 p-2 px-4'>
        <ReplyHeaderUser targetId={message.senderId} />

        <span className='text-muted-foreground truncate pr-10 text-sm'>{message.content}</span>
      </div>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => setReplyingTo(undefined)}
        className='absolute top-0.5 right-3'
        aria-label='Cancel reply'
        title='Cancel reply'
      >
        <XIcon />
      </Button>
    </div>
  );
}

function ReplyHeaderUser({ targetId }: { targetId: string }) {
  const author = useQuery(api.users.getUser, { clerkId: targetId });

  if (!author) {
    return (
      <span className='shrink-0 text-sm font-semibold'>
        Replying to <span className='capitalize'>unknown user</span>:
      </span>
    );
  }

  return (
    <span className='shrink-0 text-sm font-semibold'>
      Replying to <span className='capitalize'>{author?.username}</span>:
    </span>
  );
}
