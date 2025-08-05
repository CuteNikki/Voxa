import { cn, formatMessageTimestamp } from '@/lib/utils';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function MessageTimestamp({ message, className }: { message: { createdAt: number; editedAt?: number }; className?: string }) {
  return (
    <>
      {message.editedAt && (
        <Tooltip delayDuration={400}>
          <TooltipTrigger className='text-muted-foreground text-xs'>(edited)</TooltipTrigger>
          <TooltipContent>Edited at {formatMessageTimestamp(message.editedAt)}</TooltipContent>
        </Tooltip>
      )}
      <div className={cn('text-muted-foreground text-sm', className)}>{formatMessageTimestamp(message.createdAt)}</div>
    </>
  );
}
