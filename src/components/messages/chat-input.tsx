'use client';

import { useMutation } from 'convex/react';
import { useState } from 'react';

import { api } from '../../../convex/_generated/api';

import { SendHorizontalIcon, SmileIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const MAX_LENGTH = 1000;
const WARNING_THRESHOLD = 800;

export function ChatInput({ chatId }: { chatId: string }) {
  const sendMessage = useMutation(api.messages.sendChatMessage);

  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleSend = async () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    await sendMessage({ chatId, content: trimmed });
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!value.trim() || value.length > MAX_LENGTH) return;
      handleSend();
    }
  };

  return (
    <div className='bg-background relative flex w-full flex-row items-center gap-2 p-2 pt-0'>
      <Textarea autoFocus value={value} onChange={handleChange} onKeyDown={handleKeyDown} placeholder='Your Message' className='max-h-18 resize-none py-3 pr-20 no-scrollbar' />
      {value.length >= WARNING_THRESHOLD && (
        <span className={`absolute right-5 top-2 text-xs ${value.length > MAX_LENGTH ? 'text-red-500' : 'text-muted-foreground'}`}>
          {value.length}/{MAX_LENGTH}
        </span>
      )}
      <div className='absolute right-3 bottom-3 flex flex-row items-center'>
        <Button variant='ghost' size='icon' aria-label='Emoji Picker'>
          <SmileIcon />
        </Button>
        <Button onClick={handleSend} variant='ghost' size='icon' aria-label='Send message' disabled={!value.trim() || value.length > MAX_LENGTH}>
          <SendHorizontalIcon />
        </Button>
      </div>
    </div>
  );
}
