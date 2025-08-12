'use client';

import { useMutation, usePaginatedQuery } from 'convex/react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { api } from '../../../convex/_generated/api';

import { ClipboardCopyIcon, CornerUpRightIcon, PencilIcon, SmilePlusIcon, Trash2Icon } from 'lucide-react';

import { ChatInput } from '@/components/messages/chat-input';
import { Message, MessageSkeleton } from '@/components/messages/message';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu';

export function MessageContainer({ chatId, userId }: { chatId: string; userId: string }) {
  const [replyingTo, setReplyingTo] = useState<string | undefined>(undefined);
  const [editing, setEditing] = useState<string | undefined>(undefined);
  const [reactionPicker, setReactionPicker] = useState<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isGroup = pathname.startsWith('/groups');

  const { results, status, loadMore } = usePaginatedQuery(api.messages.getPaginatedMessages, { chatId }, { initialNumItems: 50 });
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const setLastRead = useMutation(api.chats.setLastRead);

  const messages = [...results].reverse(); // Reverse to show the latest messages at the bottom

  useEffect(() => {
    const interval = setInterval(() => {
      setLastRead({ chatId, lastReadAt: Date.now(), isGroup });
    }, 4_000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const userLastRead = messages[messages.length - 1]?.createdAt ?? Date.now();
    setLastRead({ chatId, lastReadAt: userLastRead, isGroup });
  }, [messages, chatId, isGroup, setLastRead]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  if (status === 'LoadingFirstPage') {
    return (
      <div className='flex min-h-0 flex-1 flex-col'>
        <div className='flex-1 overflow-y-auto'>
          <div className='flex w-full flex-col pt-6 pb-2'>
            {Array.from({ length: 50 }).map((_, index) => (
              <MessageSkeleton key={index} showAvatar={index % 3 === 0} />
            ))}
          </div>
        </div>

        <ChatInput chatId={chatId} replyingTo={replyingTo} setReplyingTo={setReplyingTo} disabled />
      </div>
    );
  }

  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      <div ref={scrollRef} className='flex-1 overflow-y-auto'>
        <div className='flex w-full flex-col pt-6 pb-2'>
          {status === 'CanLoadMore' && (
            <Button variant='default' className='self-center' onClick={() => loadMore(25)}>
              Load More Messages
            </Button>
          )}
          {messages.length ? (
            messages.map((message, index) => (
              <ContextMenu key={message._id}>
                <ContextMenuTrigger>
                  <Message
                    message={message}
                    showAvatar={message.senderId !== messages[index - 1]?.senderId || message.createdAt - messages[index - 1]?.createdAt > 60_000 * 5} // Show avatar if sender changed or if more than 5 minutes passed
                    userId={userId}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                    editing={editing}
                    setEditing={setEditing}
                    reactionPicker={reactionPicker}
                    setReactionPicker={setReactionPicker}
                  />
                </ContextMenuTrigger>
                <ContextMenuContent className='w-52'>
                  <ContextMenuItem onClick={() => setReactionPicker(message._id)}>
                    <SmilePlusIcon /> React
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => setReplyingTo(message._id)}>
                    <CornerUpRightIcon /> Reply
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  {message.senderId === userId && (
                    <>
                      <ContextMenuItem onClick={() => setEditing(message._id)}>
                        <PencilIcon /> Edit Message
                      </ContextMenuItem>
                      <ContextMenuItem variant='destructive' onClick={() => deleteMessage({ messageId: message._id })}>
                        <Trash2Icon /> Delete Message
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                    </>
                  )}
                  <ContextMenuItem onClick={() => navigator.clipboard.writeText(message._id)}>
                    <ClipboardCopyIcon />
                    Copy Id
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))
          ) : (
            <div className='text-muted-foreground self-center text-center text-sm'>No messages yet. Start the conversation!</div>
          )}
        </div>
      </div>

      <ChatInput chatId={chatId} replyingTo={replyingTo} setReplyingTo={setReplyingTo} isGroup={isGroup} />
    </div>
  );
}
