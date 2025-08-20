'use client';

import { useMutation, usePaginatedQuery, useQuery } from 'convex/react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { api } from '../../../convex/_generated/api';

import { ClipboardCopyIcon, CornerUpRightIcon, PencilIcon, SmileIcon, SmilePlusIcon, Trash2Icon } from 'lucide-react';

import { LAST_READ_UPDATE_INTERVAL, MESSAGE_GROUPING_THRESHOLD } from '@/constants/limits';

import { ChatInput } from '@/components/messages/chat-input';
import { Message, MessageSkeleton } from '@/components/messages/message';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatReactionTimestamp } from '@/lib/utils';

export function MessageContainer({ chatId, userId }: { chatId: string; userId: string }) {
  const [replyingTo, setReplyingTo] = useState<string | undefined>(undefined);
  const [editing, setEditing] = useState<string | undefined>(undefined);
  const [reactionPicker, setReactionPicker] = useState<string | undefined>(undefined);
  const [viewReactionsFor, setViewReactionsFor] = useState<string | undefined>(undefined);
  const [viewReactionsForPending, setViewReactionsForPending] = useState<string | undefined>(undefined);

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
    }, LAST_READ_UPDATE_INTERVAL);
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
              <ContextMenu
                key={message._id}
                onOpenChange={(open) => {
                  if (!open && viewReactionsForPending) {
                    setViewReactionsFor(viewReactionsForPending);
                    setViewReactionsForPending(undefined);
                  }
                }}
              >
                <ContextMenuTrigger>
                  <Message
                    message={message}
                    showAvatar={
                      message.senderId !== messages[index - 1]?.senderId || message.createdAt - messages[index - 1]?.createdAt > MESSAGE_GROUPING_THRESHOLD
                    }
                    userId={userId}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                    editing={editing}
                    setEditing={setEditing}
                    reactionPicker={reactionPicker}
                    setReactionPicker={setReactionPicker}
                  />
                </ContextMenuTrigger>

                <ContextMenuContent>
                  <ContextMenuItem onClick={() => setReplyingTo(message._id)}>
                    <CornerUpRightIcon /> Reply
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => setReactionPicker(message._id)}>
                    <SmilePlusIcon /> React
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  {(message.reactions?.length ?? 0) > 0 && (
                    <ContextMenuItem onSelect={() => setViewReactionsForPending(message._id)}>
                      <SmileIcon />
                      View Reactions
                    </ContextMenuItem>
                  )}
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

      {viewReactionsFor && (
        <Dialog open={!!viewReactionsFor} onOpenChange={(open) => !open && setViewReactionsFor(undefined)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reactions</DialogTitle>
            </DialogHeader>
            <ReactionDialogContent message={messages.find((m) => m._id === viewReactionsFor)} />
          </DialogContent>
        </Dialog>
      )}

      <ChatInput chatId={chatId} replyingTo={replyingTo} setReplyingTo={setReplyingTo} isGroup={isGroup} />
    </div>
  );
}

export function ReactionDialogContent({
  message,
}: {
  message?: {
    reactions?: {
      reaction: string;
      userId: string;
      createdAt: number;
    }[];
  };
}) {
  const reactions = message?.reactions ?? [];
  const emojiGroups = reactions.reduce<Record<string, typeof reactions>>((acc, r) => {
    acc[r.reaction] = acc[r.reaction] || [];
    acc[r.reaction].push(r);
    return acc;
  }, {});
  const emojis = Object.keys(emojiGroups);
  const [activeTab, setActiveTab] = useState(emojis[0] ?? '');

  useEffect(() => {
    if (!emojis.includes(activeTab)) setActiveTab(emojis[0] ?? '');
  }, [emojis, activeTab]);

  if (!emojis.length) {
    return <div className='text-muted-foreground text-sm'>No reactions yet.</div>;
  }

  return (
    <div>
      <div className='mb-4'>
        <div className='flex border-b'>
          {emojis.map((emoji) => (
            <button
              key={emoji}
              className={`flex items-center gap-1 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === emoji ? 'border-primary text-primary' : 'text-muted-foreground hover:text-primary border-transparent'
              }`}
              onClick={() => setActiveTab(emoji)}
              type='button'
            >
              {emoji}
              <span className='text-muted-foreground ml-1 font-mono text-xs'>{emojiGroups[emoji].length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        {emojiGroups[activeTab]?.map((r, i) => (
          <div key={i} className='flex items-center justify-between gap-2'>
            <ReactionUser userId={r.userId} />
            <span className='text-muted-foreground text-xs'>{formatReactionTimestamp(r.createdAt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReactionUser({ userId }: { userId: string }) {
  const target = useQuery(api.users.getUser, { clerkId: userId });

  if (!target) {
    return <span className='text-muted-foreground'>Unknown User</span>;
  }

  return (
    <div className='flex flex-row items-center gap-2'>
      <Avatar className='size-6'>
        <AvatarImage src={target.imageUrl || '/default-avatar.png'} alt={`${target.username} avatar`} />
        <AvatarFallback>{target.username ? target.username.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
      </Avatar>
      <span className='font-medium capitalize'>{target.username}</span>
    </div>
  );
}
