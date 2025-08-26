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
  disabled,
}: {
  messageId: string;
  roundCorners?: boolean;
  setReplyingTo: (messageId?: string) => void;
  disabled?: boolean;
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
          disabled
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
      <button
        type='button'
        onClick={() => {
          const el = document.getElementById(messageId);
          if (el) {
            el.focus();
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }}
        className='group flex cursor-pointer items-center gap-2 p-2 px-4'
      >
        <ReplyHeaderUser targetId={message.senderId} />

        <span className='text-muted-foreground truncate pr-10 text-sm italic group-hover:underline'>
          {message.content} {message.attachments && message.attachments.length > 0 && '🖼'}
        </span>
      </button>
      <Button
        disabled={disabled}
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
