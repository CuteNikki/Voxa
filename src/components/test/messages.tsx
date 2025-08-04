'use client';

import { useMutation, usePaginatedQuery, useQuery } from 'convex/react';
import { useEffect, useRef } from 'react';

import { api } from '../../../convex/_generated/api';

import { formatMessageTimestamp } from '@/lib/utils';

import { ChatInput } from '@/components/test/chat-input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { PencilIcon, SmilePlusIcon, Trash2Icon } from 'lucide-react';

export function ChatMessages({ chatId, userId }: { chatId: string; userId: string }) {
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

function MessageSkeleton() {
  return (
    <div className='flex items-center gap-2 px-4 py-2'>
      <Avatar>
        <AvatarFallback>
          <Skeleton>U</Skeleton>
        </AvatarFallback>
      </Avatar>
      <div className='flex-1'>
        <Skeleton className='w-fit'>Unknown User</Skeleton>
        <Skeleton className='text-muted-foreground w-fit max-w-30 truncate text-sm leading-tight'>No Messages</Skeleton>
      </div>
    </div>
  );
}

function Message({
  message,
  userId,
  showAvatar,
}: {
  message: { imageUrl?: string; content?: string; chatId: string; createdAt: number; senderId: string; _id: string };
  showAvatar?: boolean;
  userId: string;
}) {
  const author = useQuery(api.users.getUser, { clerkId: message.senderId });
  const deleteMessage = useMutation(api.messages.deleteMessage);

  if (!author) {
    return <MessageSkeleton />;
  }

  const isOwnMessage = message.senderId === userId;

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this message?')) {
      await deleteMessage({ messageId: message._id });
    }
  };

  const handleEdit = async () => {
    // await editMessage({ messageId: message._id, content: newContent });
  };

  return (
    <div className={`hover:bg-muted/30 group flex items-start gap-2 px-4 transition-colors ${showAvatar ? 'py-2' : ''}`}>
      {showAvatar ? (
        <Avatar>
          <AvatarImage src={author.imageUrl} />
          <AvatarFallback>{author.username ? author.username.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
        </Avatar>
      ) : (
        <div className='w-8' />
      )}
      <div className='flex-1'>
        {showAvatar && (
          <div className='flex justify-between'>
            <div className='font-semibold capitalize leading-tight'>{author.username}</div>
            <div className='flex items-center gap-2'>
              <div className='flex flex-row space-x-1 opacity-0 transition-opacity group-hover:opacity-100'>
                {isOwnMessage && (
                  <>
                    <Button variant='ghost' size='sm' aria-label='Edit message' className='h-7' onClick={handleEdit}>
                      <PencilIcon />
                    </Button>
                    <Button variant='ghost' size='sm' aria-label='Delete message' className='text-destructive h-7' onClick={handleDelete}>
                      <Trash2Icon />
                    </Button>
                  </>
                )}
                <Button
                  variant='ghost'
                  size='sm'
                  aria-label='Add reaction'
                  className='h-7'
                  onClick={() => {
                    alert('Add reaction functionality not implemented yet');
                  }}
                >
                  <SmilePlusIcon />
                </Button>
              </div>
              <div className='text-muted-foreground text-sm'>{formatMessageTimestamp(message.createdAt)}</div>
            </div>
          </div>
        )}
        <div className='flex justify-between'>
          <div className='text-sm break-all whitespace-pre-line'>{message.content}</div>
          {!showAvatar && (
            <div className='flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100'>
              <div className='flex flex-row space-x-1'>
                {isOwnMessage && (
                  <>
                    <Button variant='ghost' size='sm' aria-label='Edit message' className='h-7' onClick={handleEdit}>
                      <PencilIcon />
                    </Button>
                    <Button variant='ghost' size='sm' aria-label='Delete message' className='text-destructive h-7' onClick={handleDelete}>
                      <Trash2Icon />
                    </Button>
                  </>
                )}
                <Button
                  variant='ghost'
                  size='sm'
                  aria-label='Add reaction'
                  className='h-7'
                  onClick={() => {
                    alert('Add reaction functionality not implemented yet');
                  }}
                >
                  <SmilePlusIcon />
                </Button>
              </div>
              <div className='text-muted-foreground text-sm'>{formatMessageTimestamp(message.createdAt)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
