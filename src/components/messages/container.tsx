'use client';

import { useMutation, usePaginatedQuery } from 'convex/react';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { api } from '../../../convex/_generated/api';

import { ClipboardCopyIcon, CornerUpRightIcon, PencilIcon, SmileIcon, SmilePlusIcon, Trash2Icon } from 'lucide-react';

import { LAST_READ_UPDATE_INTERVAL, MESSAGE_GROUPING_THRESHOLD } from '@/constants/limits';

import { ChatInput } from '@/components/messages/chat-input';
import { Message, MessageSkeleton } from '@/components/messages/message';
import { ReactionDialogContent } from '@/components/messages/reaction-dialog';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function MessageContainer({ chatId, userId }: { chatId: string; userId: string }) {
  const [replyingTo, setReplyingTo] = useState<string | undefined>(undefined);
  const [editing, setEditing] = useState<string | undefined>(undefined);
  const [reactionPicker, setReactionPicker] = useState<string | undefined>(undefined);
  const [viewReactionsFor, setViewReactionsFor] = useState<string | undefined>(undefined);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | undefined>(undefined);
  const [disableAutoScrollUntil, setDisableAutoScrollUntil] = useState<number>(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);
  const scrollAttemptRef = useRef<{ rafId: number | null; timeouts: number[] }>({ rafId: null, timeouts: [] });
  const disableAutoScrollUntilRef = useRef(disableAutoScrollUntil);

  const pathname = usePathname();
  const isGroup = pathname.startsWith('/groups');

  const { results, status, loadMore } = usePaginatedQuery(api.messages.getPaginatedMessages, { chatId }, { initialNumItems: 50 });
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const setLastRead = useMutation(api.chats.setLastRead);

  const messages = [...results].reverse();

  // keep the ref up-to-date
  useEffect(() => {
    disableAutoScrollUntilRef.current = disableAutoScrollUntil;
  }, [disableAutoScrollUntil]);

  const robustScrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Only scroll if there is overflow
    if (el.scrollHeight <= el.clientHeight) return;

    if (disableAutoScrollUntilRef.current && Date.now() <= disableAutoScrollUntilRef.current) return;
    if (!stickToBottomRef.current) return;

    const state = scrollAttemptRef.current;
    if (state.rafId) cancelAnimationFrame(state.rafId);
    state.timeouts.forEach(clearTimeout);
    state.timeouts = [];

    const deadline = Date.now() + 1200;
    let attempts = 0;

    function frame() {
      const el2 = scrollRef.current;
      if (!el2) return;
      if (disableAutoScrollUntilRef.current && Date.now() <= disableAutoScrollUntilRef.current) return;
      if (!stickToBottomRef.current) return;

      el2.scrollTop = el2.scrollHeight;
      attempts++;

      const atBottom = Math.abs(el2.scrollHeight - el2.clientHeight - el2.scrollTop) < 1;
      if (!atBottom && Date.now() < deadline && attempts < 40) {
        state.rafId = requestAnimationFrame(frame);
      } else {
        state.rafId = null;
      }
    }

    state.rafId = requestAnimationFrame(frame);

    let backoff = 50;
    for (let i = 0; i < 6; i++) {
      const id = window.setTimeout(() => {
        const el3 = scrollRef.current;
        if (!el3) return;
        if (disableAutoScrollUntilRef.current && Date.now() <= disableAutoScrollUntilRef.current) return;
        if (!stickToBottomRef.current) return;
        el3.scrollTop = el3.scrollHeight;
      }, backoff);
      state.timeouts.push(id);
      backoff *= 2;
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
      stickToBottomRef.current = isNearBottom;
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (stickToBottomRef.current && Date.now() > disableAutoScrollUntilRef.current) {
      robustScrollToBottom();
    }
  }, [messages, robustScrollToBottom]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      if (Date.now() > disableAutoScrollUntilRef.current && stickToBottomRef.current) {
        robustScrollToBottom();
      }
    });
    observer.observe(el);

    const imgs = Array.from(el.querySelectorAll('img'));
    const handlers = new Map<HTMLImageElement, EventListener>();

    imgs.forEach((img) => {
      const handler = () => {
        if (Date.now() > disableAutoScrollUntilRef.current && stickToBottomRef.current) {
          robustScrollToBottom();
        }
      };
      handlers.set(img, handler);
      if (!img.complete || (img.naturalWidth === 0 && img.naturalHeight === 0)) {
        img.addEventListener('load', handler);
        img.addEventListener('error', handler);
      } else {
        robustScrollToBottom();
      }
    });

    return () => {
      observer.disconnect();
      handlers.forEach((h, img) => {
        img.removeEventListener('load', h);
        img.removeEventListener('error', h);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const state = scrollAttemptRef.current;
      if (state.rafId) cancelAnimationFrame(state.rafId);
      state.timeouts.forEach(clearTimeout);
      state.timeouts = [];
    };
  }, [messages, robustScrollToBottom]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastRead({ chatId, lastReadAt: Date.now(), isGroup }).catch(console.error);
    }, LAST_READ_UPDATE_INTERVAL);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const userLastRead = messages[messages.length - 1]?._creationTime ?? Date.now();
    setLastRead({ chatId, lastReadAt: userLastRead, isGroup }).catch(console.error);
  }, [messages, chatId, isGroup, setLastRead]);

  useEffect(() => {
    if (highlightedMessageId) {
      setDisableAutoScrollUntil(Date.now() + 1600);
      const timeout = setTimeout(() => {
        setHighlightedMessageId(undefined);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [highlightedMessageId]);

  useEffect(() => {
    if (!replyingTo) return;
    if (!messages.map((m) => m._id.toString()).includes(replyingTo)) setReplyingTo(undefined);
  }, [messages, replyingTo]);

  // ---------- RENDER ----------

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

        <ChatInput userId={userId} chatId={chatId} replyingTo={replyingTo} setReplyingTo={setReplyingTo} disabled />
      </div>
    );
  }

  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      {/* SCROLLABLE MESSAGES */}
      <div ref={scrollRef} className='flex-1 overflow-y-auto'>
        <div className='flex w-full flex-col pt-6 pb-2'>
          {status === 'CanLoadMore' && (
            <Button variant='default' className='self-center' onClick={() => loadMore(25)}>
              Load More Messages
            </Button>
          )}
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <ContextMenu key={message._id} modal={false}>
                <ContextMenuTrigger>
                  <Message
                    message={message}
                    showAvatar={
                      message.senderId !== messages[index - 1]?.senderId ||
                      message._creationTime - messages[index - 1]?._creationTime > MESSAGE_GROUPING_THRESHOLD
                    }
                    userId={userId}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                    editing={editing}
                    setEditing={setEditing}
                    reactionPicker={reactionPicker}
                    setReactionPicker={setReactionPicker}
                    setViewReactionsFor={setViewReactionsFor}
                    highlightedMessageId={highlightedMessageId}
                    setHighlightedMessageId={setHighlightedMessageId}
                    setDisableAutoScrollUntil={setDisableAutoScrollUntil}
                  />
                </ContextMenuTrigger>

                <ContextMenuContent>
                  <ContextMenuItem onSelect={() => setReplyingTo(message._id)}>
                    <CornerUpRightIcon /> Reply
                  </ContextMenuItem>
                  <ContextMenuItem onSelect={() => setReactionPicker(message._id)}>
                    <SmilePlusIcon /> React
                  </ContextMenuItem>
                  {(message.reactions?.length ?? 0) > 0 && (
                    <ContextMenuItem onSelect={() => setViewReactionsFor(message._id)}>
                      <SmileIcon />
                      View Reactions
                    </ContextMenuItem>
                  )}
                  <ContextMenuSeparator />
                  {message.senderId === userId && (
                    <>
                      <ContextMenuItem onSelect={() => setEditing(message._id)}>
                        <PencilIcon /> Edit Message
                      </ContextMenuItem>
                      <ContextMenuItem variant='destructive' onSelect={() => deleteMessage({ messageId: message._id }).catch(console.error)}>
                        <Trash2Icon /> Delete Message
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                    </>
                  )}
                  <ContextMenuItem onSelect={() => navigator.clipboard.writeText(message._id)}>
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

      {/* REACTIONS DIALOG */}
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

      {/* MESSAGE INPUT */}
      <ChatInput userId={userId} chatId={chatId} replyingTo={replyingTo} setReplyingTo={setReplyingTo} isGroup={isGroup} />
    </div>
  );
}
