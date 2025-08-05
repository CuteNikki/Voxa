'use client';

import { useState } from 'react';

import { SmilePlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { EmojiPicker, EmojiPickerContent, EmojiPickerFooter, EmojiPickerSearch } from '@/components/ui/emoji-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function ReactionButton({}: { messageId: string }) {
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  return (
    <Popover onOpenChange={setEmojiPickerOpen} open={emojiPickerOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' aria-label='Add reaction' className='h-7' title='Add reaction'>
          <SmilePlusIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-fit p-0'>
        <EmojiPicker
          className='h-[342px]'
          onEmojiSelect={({ emoji }) => {
            setEmojiPickerOpen(false);
            alert(`Reaction added: ${emoji}`);
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
