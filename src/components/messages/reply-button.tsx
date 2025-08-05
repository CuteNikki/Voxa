import { ReplyIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function ReplyButton({ setReplyingTo, messageId }: { messageId: string; setReplyingTo: (messageId?: string) => void }) {
  return (
    <Tooltip delayDuration={400}>
      <TooltipTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          aria-label='Reply to message'
          className='h-7'
          onClick={() => {
            setReplyingTo(messageId);
          }}
        >
          <ReplyIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Reply</TooltipContent>
    </Tooltip>
  );
}
