import { useMutation } from 'convex/react';
import { useState } from 'react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export function ChatInput({ chatId }: { chatId: string }) {
  const [value, setValue] = useState('');
  const sendMessage = useMutation(api.messages.sendGroupMessage);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const trimmed = value.trim();
      if (trimmed) {
        setValue('');
        try {
          sendMessage({ content: trimmed, chatId });
        } catch (error) {
          console.error('Failed to send message:', error);
        }
      }
    }
  };

  return (
    <div className='fley-row flex items-center justify-between gap-4 border-t p-4'>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={2}
        className='w-full resize-none rounded border px-2 py-1'
        placeholder='Type your message...'
      />
      <Button
        onClick={() => {
          const trimmed = value.trim();
          if (trimmed) {
            setValue('');
            try {
              sendMessage({ content: trimmed, chatId });
            } catch (error) {
              console.error('Failed to send message:', error);
            }
          }
        }}
      >
        Send
      </Button>
    </div>
  );
}
