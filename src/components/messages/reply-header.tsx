import { useQuery } from 'convex/react';

import { XIcon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function ReplyHeader({ messageId, setReplyingTo }: { messageId: string; setReplyingTo: (messageId?: string) => void }) {
  const message = useQuery(api.messages.getMessageById, { messageId });
  const author = useQuery(api.users.getUser, { clerkId: message?.senderId ?? '' });

  if (!message || !author) {
    return (
      <div className='bg-muted w-full rounded-tl-md rounded-tr-md'>
        <div className='flex items-center gap-2 p-2 px-4'>
          <span className='shrink-0 text-sm font-semibold'>Loading...</span>
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
        <span className='shrink-0 text-sm font-semibold'>
          Replying to <span className='capitalize'>{author?.username}</span>:
        </span>

        <span className='text-muted-foreground truncate pr-10 text-sm'>{message?.content}</span>
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
