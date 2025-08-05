'use client';

import { usePaginatedQuery } from 'convex/react';
import { useEffect, useRef } from 'react';

import { api } from '../../../convex/_generated/api';

import { Message, MessageSkeleton } from '@/components/messages/message';
import { ChatInput } from '@/components/messages/chat-input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function MessageContainer({ chatId, userId }: { chatId: string; userId: string }) {
  const { results, status, loadMore } = usePaginatedQuery(api.messages.getPaginatedMessages, { chatId }, { initialNumItems: 50 });

  const messages = [...results].reverse(); // Reverse to show the latest messages at the bottom

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [results]);

  if (status === 'LoadingFirstPage') {
    return (
      <div className='flex min-h-0 flex-1 flex-col'>
        <ScrollArea className='flex-1 overflow-y-auto'>
          <div className='flex flex-col gap-3 px-4 py-2'>
            {Array.from({ length: 10 }).map((_, index) => (
              <MessageSkeleton key={index} />
            ))}
          </div>
        </ScrollArea>
        <ChatInput chatId={chatId} />
      </div>
    );
  }

  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      <div ref={scrollRef} className='flex-1 overflow-y-auto'>
        <div className='flex w-full flex-col py-4'>
          {status === 'CanLoadMore' && (
            <Button variant='default' className='self-center' onClick={() => loadMore(25)}>
              Load More Messages
            </Button>
          )}
          {messages.map((message, index) => (
            <Message
              key={message._id}
              message={message}
              showAvatar={message.senderId !== messages[index - 1]?.senderId || message.createdAt - messages[index - 1]?.createdAt > 60_000 * 5} // Show avatar if sender changed or if more than 5 minutes passed
              userId={userId}
            />
          ))}
        </div>
      </div>

      <ChatInput chatId={chatId} />
    </div>
  );
}
