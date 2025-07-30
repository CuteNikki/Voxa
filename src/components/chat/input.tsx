import { useMutation } from 'convex/react';
import React from 'react';

import { api } from '../../../convex/_generated/api';

export function ChatInput({ chatId }: { chatId: string }) {
  const [message, setMessage] = React.useState('');
  const sendMessage = useMutation(api.messages.sendChatMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await sendMessage({ content: message, chatId });
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='p-4 flex fley-row justify-between'>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Type your message...' className='w-full' />
      <button type='submit'>Send</button>
    </form>
  );
}
