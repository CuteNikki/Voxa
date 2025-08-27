'use client';

import { useMutation } from 'convex/react';
import { SmilePlusIcon } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';
import { EmojiPicker, EmojiPickerContent, EmojiPickerFooter, EmojiPickerSearch } from '@/components/ui/emoji-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useShiftKey } from '@/hooks/shift';

export function ReactionButton({
  messageId,
  reactionPicker,
  setReactionPicker,
}: {
  messageId: string;
  reactionPicker?: string;
  setReactionPicker: (messageId?: string) => void;
}) {
  const addReaction = useMutation(api.messages.addReaction);
  const isHoldingShift = useShiftKey();

  return (
    <Popover
      onOpenChange={(open) => {
        if (!open) {
          setReactionPicker(undefined);
        } else {
          setReactionPicker(messageId);
        }
      }}
      open={reactionPicker === messageId}
    >
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' aria-label='Add reaction' className='h-7' title='Add reaction'>
          <SmilePlusIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-fit p-0 mx-2'>
        <EmojiPicker
          className='h-[342px]'
          onEmojiSelect={({ emoji }) => {
            if (!isHoldingShift) {
              setReactionPicker(undefined);
            }
            // Extract error message after "Uncaught Error: "

            addReaction({ messageId, reaction: emoji }).catch((error) => {
              const match = error.message.match(/Uncaught Error: (.*)/);
              const errorMsg = match ? match[1].split('\n')[0] : error.message;
              toast.error('Failed to add reaction', { description: errorMsg });
            });
          }}
        >
          <EmojiPickerSearch />
          <EmojiPickerContent />
          <EmojiPickerFooter />
        </EmojiPicker>
      </PopoverContent>
    </Popover>
  );
}
