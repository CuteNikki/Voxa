import { useQuery } from 'convex/react';
import Image from 'next/image';
import { useEffect, useMemo, useRef } from 'react';

import { api } from '../../../convex/_generated/api';

import { TypographyLarge } from '@/components/typography/large';
import { TypographyMuted } from '@/components/typography/muted';
import { TypographyP } from '@/components/typography/p';

export function Messages({ chatId }: { chatId: string }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = useQuery(api.messages.getMessages, { chatId });

  // Get unique sender IDs from messages
  const senderIds = useMemo(() => {
    if (!messages) return [];
    return Array.from(new Set(messages.map((m) => m.senderId)));
  }, [messages]);

  // Batch fetch senders info once
  const rawSenders = useQuery(api.users.getUsersByIds, { ids: senderIds });
  const senders = useMemo(() => rawSenders || {}, [rawSenders]);

  // Scroll after messages or senders load
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const timer = setTimeout(() => {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'auto',
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [messages, senders]);

  if (!messages || messages.length === 0) return <p>No messages found.</p>;

  return (
    <div ref={scrollRef} className='p-4 flex-1 overflow-y-auto max-h-full flex flex-col gap-2'>
      {messages.map((message) => (
        <Message key={message._id} message={message} />
      ))}
      <div ref={bottomRef} className='hidden' />
    </div>
  );
}

export function Message({ message }: { message: { _id: string; senderId: string; content?: string; createdAt: number } }) {
  const sender = useQuery(api.users.getUser, { clerkId: message.senderId });

  if (!sender) {
    return <p>Sender not found.</p>;
  }

  return (
    <div className='flex flex-row gap-2 w-full'>
      <Image src={sender.imageUrl || '/default-avatar.png'} alt={`${sender.username} avatar`} width={512} height={512} className='w-12 h-12 rounded-full' />
      <div className='flex flex-col w-full'>
        <div className='flex flex-row items-center gap-2 justify-between w-full'>
          <TypographyLarge className='capitalize'>{sender.username}</TypographyLarge>
          <TypographyMuted>{new Date(message.createdAt).toLocaleString()}</TypographyMuted>
        </div>
        <TypographyP className='break-all whitespace-pre-line'>{message.content}</TypographyP>
      </div>
    </div>
  );
}
