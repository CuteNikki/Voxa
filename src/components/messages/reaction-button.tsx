'use client';

import { useMutation } from 'convex/react';
import { SmilePlusIcon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';
import { EmojiPicker, EmojiPickerContent, EmojiPickerFooter, EmojiPickerSearch } from '@/components/ui/emoji-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
      <PopoverContent className='w-fit p-0'>
        <EmojiPicker
          className='h-[342px]'
          onEmojiSelect={({ emoji }) => {
            setReactionPicker(undefined);

            addReaction({ messageId, reaction: emoji });
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
