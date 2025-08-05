'use client';

import { useMutation } from 'convex/react';
import { useState } from 'react';

import { api } from '../../../convex/_generated/api';

import { SendHorizontalIcon, SmileIcon } from 'lucide-react';

import { ReplyHeader } from '@/components/messages/reply-header';
import { Button } from '@/components/ui/button';
import { EmojiPicker, EmojiPickerContent, EmojiPickerFooter, EmojiPickerSearch } from '@/components/ui/emoji-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';

const MAX_LENGTH = 1000;
const WARNING_THRESHOLD = 800;

export function ChatInput({ chatId, replyingTo, setReplyingTo }: { chatId: string; replyingTo?: string; setReplyingTo: (messageId?: string) => void }) {
  const sendMessage = useMutation(api.messages.sendChatMessage);

  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleSend = async () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    await sendMessage({ chatId, content: trimmed, reference: replyingTo });
    setValue(''); // Clear the input after sending
    setReplyingTo(undefined); // Clear the replying state after sending
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      setReplyingTo(undefined);
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      if (!value.trim() || value.length > MAX_LENGTH) return;

      handleSend();
    }
  };

  return (
    <div className='relative'>
      {replyingTo && <ReplyHeader messageId={replyingTo} setReplyingTo={setReplyingTo} />}
      <div className={`${replyingTo ? 'bg-muted' : 'bg-background'} flex w-full flex-row items-center gap-2 p-2 pt-0`}>
        <Textarea
          autoFocus
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder='Your Message'
          className='no-scrollbar z-40 max-h-18 resize-none py-3 pr-20'
        />
        {value.length >= WARNING_THRESHOLD && (
          <span className={`absolute top-2 right-5 z-50 text-xs ${value.length > MAX_LENGTH ? 'text-red-500' : 'text-muted-foreground'}`}>
            {value.length}/{MAX_LENGTH}
          </span>
        )}
        <div className='absolute right-3 bottom-3 z-50 flex flex-row items-center gap-1'>
          <Popover onOpenChange={setEmojiPickerOpen} open={emojiPickerOpen}>
            <PopoverTrigger asChild>
              <Button variant='outline' size='icon' aria-label='Emoji Picker' title='Emoji Picker'>
                <SmileIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-fit p-0'>
              <EmojiPicker
                className='h-[342px]'
                onEmojiSelect={({ emoji }) => {
                  setEmojiPickerOpen(false);
                  // Add space before emoji if not already present and the emoji isn't at the start of the message
                  setValue((prev) => prev + (prev.length > 0 && prev[prev.length - 1] !== ' ' ? ' ' + emoji : emoji));
                }}
              >
                <EmojiPickerSearch />
                <EmojiPickerContent />
                <EmojiPickerFooter />
              </EmojiPicker>
            </PopoverContent>
          </Popover>
          <Button
            onClick={handleSend}
            variant='default'
            size='icon'
            aria-label='Send message'
            disabled={!value.trim() || value.length > MAX_LENGTH}
            title='Send message'
          >
            <SendHorizontalIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
