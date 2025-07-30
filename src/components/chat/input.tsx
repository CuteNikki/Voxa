import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { useRef, useState } from 'react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';

export function ChatInput({ chatId }: { chatId: string }) {
  const { user } = useUser();

  const [value, setValue] = useState('');
  const sendMessage = useMutation(api.messages.sendChatMessage);
  const setTyping = useMutation(api.typing.setTyping);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  if (!user) {
    return <div>Please log in to send messages.</div>;
  }

  const stopTyping = () => {
    setIsTyping(false);
    setTyping({ chatId, userId: user.id, typing: false });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      setTyping({ chatId, userId: user.id, typing: true });
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      stopTyping();
    }, 2000); // 2 seconds after user stops typing
  };

  const handleSend = async () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    try {
      await sendMessage({ content: trimmed, chatId });
      setValue('');
      stopTyping();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className='relative flex flex-col'>
      <TypingIndicator chatId={chatId} currentUserId={user.id} />
      <div className='flex flex-row items-center justify-between gap-4 border-t p-4'>
        <textarea
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={2}
          className='w-full resize-none rounded border px-2 py-1'
          placeholder='Type your message...'
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
}

export function TypingIndicator({ chatId, currentUserId }: { chatId: string; currentUserId: string }) {
  const typingUsers = useQuery(api.typing.getTypingUsers, { chatId });
  const usernames = useQuery(api.users.getUserNames, { ids: typingUsers?.map((u) => u.userId)?.filter((userId) => userId !== currentUserId) || [] });

  if (!typingUsers || !usernames || usernames.length === 0 || typingUsers.length === 0) return null;

  return (
    <div className='absolute bottom-full p-2 text-sm leading-tight italic bg-background w-full'>
      {usernames.length > 4 ? 'Several users are typing...' : `${usernames.join(', ')} ${usernames.length === 1 ? 'is' : 'are'} typing...`}
    </div>
  );
}
