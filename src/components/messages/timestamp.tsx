import { formatMessageTimestamp } from '@/lib/utils';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function MessageTimestamp({ message }: { message: { createdAt: number; editedAt?: number } }) {
  return (
    <>
      {message.editedAt && (
        <Tooltip delayDuration={400}>
          <TooltipTrigger className='text-muted-foreground text-xs'>(edited)</TooltipTrigger>
          <TooltipContent>Edited at {formatMessageTimestamp(message.editedAt)}</TooltipContent>
        </Tooltip>
      )}
      <div className='text-muted-foreground text-sm'>{formatMessageTimestamp(message.createdAt)}</div>
    </>
  );
}
