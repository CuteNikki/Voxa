import { useQuery } from 'convex/react';

import { XIcon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function ReplyHeader({ messageId, setReplyingTo }: { messageId: string; setReplyingTo: (messageId?: string) => void }) {
  const message = useQuery(api.messages.getMessageById, { messageId });

  if (!message) {
    return (
      <div className='bg-muted w-full rounded-tl-md rounded-tr-md'>
        <div className='flex items-center gap-2 p-2 px-4'>
          <span className='shrink-0 text-sm font-semibold'>
            Replying to <span className='capitalize'>unknown user</span>:
          </span>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='ghost' size='sm' onClick={() => setReplyingTo(undefined)} className='absolute top-0.5 right-3' aria-label='Cancel reply'>
              <XIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Cancel reply</TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className='bg-muted w-full rounded-tl-md rounded-tr-md'>
      <div className='flex items-center gap-2 p-2 px-4'>
        <ReplyHeaderUser targetId={message.senderId} />

        <span className='text-muted-foreground truncate pr-10 text-sm'>{message.content}</span>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='ghost' size='sm' onClick={() => setReplyingTo(undefined)} className='absolute top-0.5 right-3' aria-label='Cancel reply'>
            <XIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Cancel reply</TooltipContent>
      </Tooltip>
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
