import { usePaginatedQuery, useQuery } from 'convex/react';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

import { api } from '../../../convex/_generated/api';

import { TypographyLarge } from '@/components/typography/large';
import { TypographyMuted } from '@/components/typography/muted';
import { TypographyP } from '@/components/typography/p';

export function Messages({ chatId }: { chatId: string }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const prevScrollTopRef = useRef<number>(0);
  const [hasInitialScrolled, setInitialScrolled] = useState(false);

  const { results, status, loadMore } = usePaginatedQuery(api.messages.getPaginatedMessages, { chatId }, { initialNumItems: 50 });
  const messages = results.reverse();

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || status !== 'CanLoadMore') return;

    const onScroll = () => {
      if (container.scrollTop < 300) {
        prevScrollHeightRef.current = container.scrollHeight;
        prevScrollTopRef.current = container.scrollTop;
        loadMore(25);
      }
    };

    container.addEventListener('scroll', onScroll);
    return () => container.removeEventListener('scroll', onScroll);
  }, [loadMore, status]);

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
    // Only scroll when messages and senders are loaded and not yet scrolled
    if (!scrollContainer || hasInitialScrolled || !messages.length || !rawSenders) return;

    scrollContainer.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior: 'auto',
    });
    setInitialScrolled(true);
  }, [messages, senders, hasInitialScrolled, status, rawSenders]);

  // Group consecutive messages by the same sender
  const groupedMessages = useMemo(() => {
    if (!messages) return [];
    const groups: Array<{ senderId: string; messages: typeof messages }> = [];
    let currentGroup: { senderId: string; messages: typeof messages } | null = null;

    for (const msg of messages) {
      if (!currentGroup || currentGroup.senderId !== msg.senderId) {
        currentGroup = { senderId: msg.senderId, messages: [msg] };
        groups.push(currentGroup);
      } else {
        currentGroup.messages.push(msg);
      }
    }
    return groups;
  }, [messages]);

  if (!messages || messages.length === 0) return <p>No messages found.</p>;

  return (
    <div ref={scrollRef} className='flex max-h-full flex-1 flex-col gap-2 overflow-y-auto p-4 pb-8'>
      {groupedMessages.map((group) => (
        <MessageGroup key={group.messages[0]._id} senderId={group.senderId} messages={group.messages} />
      ))}
      <div ref={bottomRef} className='hidden' />
    </div>
  );
}

function MessageGroup({ senderId, messages }: { senderId: string; messages: Array<{ _id: string; senderId: string; content?: string; createdAt: number }> }) {
  const sender = useQuery(api.users.getUser, { clerkId: senderId });

  if (!sender) {
    return <p>Sender not found.</p>;
  }

  return (
    <div className='flex flex-row gap-2'>
      <Image
        src={sender.imageUrl || '/default-avatar.png'}
        alt={`${sender.username} avatar`}
        width={512}
        height={512}
        className='h-12 w-12 self-start rounded-full'
      />
      <div className='flex w-full flex-col'>
        <div className='flex w-full flex-row items-center justify-between gap-2'>
          <TypographyLarge className='capitalize'>{sender.username}</TypographyLarge>
          <TypographyMuted>{new Date(messages[0].createdAt).toLocaleString()}</TypographyMuted>
        </div>
        {messages.map((message, idx) => (
          <TypographyP key={message._id} className={`break-all whitespace-pre-line ${idx > 0 ? 'mt-2' : ''}`}>
            {message.content}
          </TypographyP>
        ))}
      </div>
    </div>
  );
}
