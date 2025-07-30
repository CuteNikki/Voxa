import { useMutation } from 'convex/react';
import { useState } from 'react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export function ChatInput({ chatId }: { chatId: string }) {
  const [value, setValue] = useState('');
  const sendMessage = useMutation(api.messages.sendChatMessage);

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
    <div className='p-4 flex fley-row gap-4 justify-between items-center border-t'>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={2}
        className='border rounded px-2 py-1 w-full resize-none'
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
