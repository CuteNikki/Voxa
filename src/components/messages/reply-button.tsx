import { ReplyIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function ReplyButton({ replyingTo, setReplyingTo, messageId }: { messageId: string; replyingTo?: string; setReplyingTo: (messageId?: string) => void }) {
  return (
    <Button
      variant='outline'
      size='sm'
      aria-label='Reply to message'
      className='h-7'
      onClick={() => {
        if (messageId === replyingTo) {
          setReplyingTo(undefined);
          return;
        }
        setReplyingTo(messageId);
      }}
      title='Reply to message'
    >
      <ReplyIcon />
    </Button>
  );
}
