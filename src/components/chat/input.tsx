'use client';

import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { useRef, useState } from 'react';

import { SendHorizontalIcon, XIcon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const MAX_LENGTH = 1000;
const WARNING_THRESHOLD = 800;

export function ChatInput({ chatId, isGroup }: { chatId: string; isGroup: boolean }) {
  const { user } = useUser();

  const [value, setValue] = useState('');
  const sendMessage = useMutation(isGroup ? api.messages.sendGroupMessage : api.messages.sendChatMessage);
  const setTyping = useMutation(api.typing.setTyping);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  if (!user) {
    return (
      <div className='relative flex flex-col'>
        <div className='flex flex-row items-center justify-between gap-2 border-t p-4'>
          <Textarea value={value} disabled rows={2} placeholder='Type your message...' className='resize-none' />
          <Button size='icon' aria-label='Send message' disabled>
            <SendHorizontalIcon />
          </Button>
        </div>
      </div>
    );
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

      if (!value.trim() || value.length > MAX_LENGTH) return;

      handleSend();
    }
  };

  return (
    <div className='flex flex-col'>
      <TypingIndicator chatId={chatId} currentUserId={user.id} />
      <div className='relative flex flex-row items-center justify-between gap-2 border-t p-4'>
        <Textarea value={value} onChange={handleChange} onKeyDown={handleKeyDown} rows={2} placeholder='Type your message...' className='resize-none' />
        {value.length >= WARNING_THRESHOLD && (
          <span className={`absolute right-1 bottom-4 text-xs ${value.length > MAX_LENGTH ? 'text-red-500' : 'text-muted-foreground'}`}>
            {value.length}/{MAX_LENGTH}
          </span>
        )}
        <Button size='icon' onClick={handleSend} aria-label='Send message' disabled={!value.trim() || value.length > MAX_LENGTH}>
          <SendHorizontalIcon />
        </Button>
      </div>
    </div>
  );
}

export function MessageEditInput({ initialValue, onSave, onCancel }: { initialValue: string; onSave: (value: string) => void; onCancel: () => void }) {
  const [value, setValue] = useState(initialValue);

  return (
    <form
      className='relative flex gap-2'
      onSubmit={(e) => {
        e.preventDefault();

        if (!value.trim() || value.length > MAX_LENGTH) return;

        onSave(value.trim());
      }}
    >
      <Textarea
        className='resize-none'
        rows={3}
        value={value}
        autoFocus
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onCancel();
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSave(value.trim());
          }
        }}
      />
      {value.length >= WARNING_THRESHOLD && (
        <span className={`absolute right-1 bottom-4 text-xs ${value.length > MAX_LENGTH ? 'text-red-500' : 'text-muted-foreground'}`}>
          {value.length}/{MAX_LENGTH}
        </span>
      )}
      <Button type='submit' size='icon' variant='default' disabled={!value.trim() || value.length > MAX_LENGTH}>
        <SendHorizontalIcon />
      </Button>
      <Button type='button' size='icon' variant='secondary' onClick={onCancel}>
        <XIcon />
      </Button>
    </form>
  );
}

export function TypingIndicator({ chatId, currentUserId }: { chatId: string; currentUserId: string }) {
  const typingUsers = useQuery(api.typing.getTypingUsers, { chatId });
  const usernames = useQuery(api.users.getUserNames, { ids: typingUsers?.map((u) => u.userId)?.filter((userId) => userId !== currentUserId) || [] });

  if (!typingUsers || !usernames || usernames.length === 0 || typingUsers.length === 0) return null;

  return (
    <div className='bg-background absolute bottom-full w-full p-2 text-sm leading-tight italic'>
      {usernames.length > 4 ? 'Several users are typing...' : `${usernames.join(', ')} ${usernames.length === 1 ? 'is' : 'are'} typing...`}
    </div>
  );
}
