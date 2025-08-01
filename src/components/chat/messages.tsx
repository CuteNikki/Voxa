import { useUser } from '@clerk/nextjs';
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

import { PencilIcon, SendHorizontalIcon, TrashIcon, XIcon } from 'lucide-react';

import { api } from '../../../convex/_generated/api';

import { TypographyLarge } from '@/components/typography/large';
import { TypographyMuted } from '@/components/typography/muted';
import { TypographyP } from '@/components/typography/p';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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
  // Group up to 5 consecutive messages by the same sender, stop if 5 minutes apart
  const groupedMessages = useMemo(() => {
    if (!messages) return [];
    const groups: Array<{ senderId: string; messages: typeof messages }> = [];
    let currentGroup: { senderId: string; messages: typeof messages } | null = null;

    for (const msg of messages) {
      const lastMsg = currentGroup?.messages[currentGroup.messages.length - 1];
      const isSameSender = currentGroup && currentGroup.senderId === msg.senderId;
      const isWithinLimit = currentGroup && currentGroup.messages.length < 5;
      const isWithinTime = lastMsg && Math.abs(msg.createdAt - lastMsg.createdAt) <= 5 * 60 * 1000;

      if (!currentGroup || !isSameSender || !isWithinLimit || !isWithinTime) {
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

function MessageEditInput({ initialValue, onSave, onCancel }: { initialValue: string; onSave: (value: string) => void; onCancel: () => void }) {
  const [value, setValue] = useState(initialValue);

  return (
    <form
      className='flex gap-2'
      onSubmit={(e) => {
        e.preventDefault();
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
      <Button type='submit' size='icon' variant='default'>
        <SendHorizontalIcon />
      </Button>
      <Button type='button' size='icon' variant='secondary' onClick={onCancel}>
        <XIcon />
      </Button>
    </form>
  );
}

function MessageGroup({ senderId, messages }: { senderId: string; messages: Array<{ _id: string; senderId: string; content?: string; createdAt: number }> }) {
  const sender = useQuery(api.users.getUser, { clerkId: senderId });
  const { user } = useUser(); // Get current user
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const editMessage = useMutation(api.messages.editMessage);

  // Track which message is hovered (by index)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Track which message is being edited (by _id)
  const [editingId, setEditingId] = useState<string | null>(null);

  // Handler for delete
  const handleDelete = (messageId: string) => {
    deleteMessage({ messageId });
  };

  // Handler for save edit
  const handleSaveEdit = async (messageId: string, newContent: string) => {
    await editMessage({ messageId, content: newContent });
    setEditingId(null);
  };

  if (!sender) {
    return <p>Sender not found.</p>;
  }

  // Check if current user is the author
  const isAuthor = user?.id === senderId;

  return (
    <div className='flex flex-row gap-3 px-2 py-0'>
      {/* Avatar */}
      <div className='flex flex-col' tabIndex={0} role='button' aria-label={`${sender.username} avatar`}>
        <Image
          src={sender.imageUrl || '/default-avatar.png'}
          alt={`${sender.username} avatar`}
          width={40}
          height={40}
          className={`h-10 w-10 rounded-full transition-colors ${hoveredIdx === 0 ? 'bg-zinc-800/60' : ''}`}
        />
      </div>
      {/* Messages */}
      <div className='flex w-full flex-col'>
        {/* First message: name, timestamp, message */}
        <div className='flex flex-row items-center gap-2' onMouseEnter={() => setHoveredIdx(0)} onMouseLeave={() => setHoveredIdx(null)}>
          <TypographyLarge className='capitalize'>{sender.username}</TypographyLarge>
          <TypographyMuted className='text-xs'>
            {(() => {
              const createdAt = messages[0]?.createdAt;
              if (typeof createdAt !== 'number' || isNaN(createdAt)) {
                return 'Invalid date';
              }
              const createdDate = new Date(createdAt);
              const now = new Date();
              const isToday =
                createdDate.getFullYear() === now.getFullYear() && createdDate.getMonth() === now.getMonth() && createdDate.getDate() === now.getDate();
              const isYesterday = (() => {
                const yesterday = new Date(now);
                yesterday.setDate(now.getDate() - 1);
                return (
                  createdDate.getFullYear() === yesterday.getFullYear() &&
                  createdDate.getMonth() === yesterday.getMonth() &&
                  createdDate.getDate() === yesterday.getDate()
                );
              })();

              if (isYesterday) {
                // Show "Yesterday" and time
                return `Yesterday, ${createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
              } else if (!isToday) {
                // Show date and time
                return createdDate.toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
              } else {
                // Show only time
                return createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              }
            })()}
          </TypographyMuted>
        </div>
        <div
          className={`relative rounded-md px-2 py-1 transition-colors ${hoveredIdx === 0 ? 'bg-zinc-800/60' : ''}`}
          onMouseEnter={() => setHoveredIdx(0)}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {editingId === messages[0]._id ? (
            <MessageEditInput
              initialValue={messages[0].content || ''}
              onSave={(value) => handleSaveEdit(messages[0]._id, value)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <>
              <TypographyP className='break-all whitespace-pre-line'>{messages[0].content}</TypographyP>
              {isAuthor && hoveredIdx === 0 && (
                <div className='absolute top-0 right-0 flex gap-1'>
                  <Button variant='secondary' size='icon' onClick={() => setEditingId(messages[0]._id)} aria-label='Edit message'>
                    <PencilIcon />
                  </Button>
                  <Button variant='destructive' size='icon' onClick={() => handleDelete(messages[0]._id)} aria-label='Delete message'>
                    <TrashIcon />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
        {/* Subsequent messages */}
        {messages.slice(1).map((message, idx) => (
          <div
            key={message._id}
            className={`relative rounded-md px-2 py-1 transition-colors ${hoveredIdx === idx + 1 ? 'bg-zinc-800/60' : ''}`}
            onMouseEnter={() => setHoveredIdx(idx + 1)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {editingId === message._id ? (
              <MessageEditInput
                initialValue={message.content || ''}
                onSave={(value) => handleSaveEdit(message._id, value)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <>
                <TypographyP className='break-all whitespace-pre-line'>{message.content}</TypographyP>
                {isAuthor && hoveredIdx === idx + 1 && (
                  <div className='absolute top-0 right-0 flex gap-1'>
                    <Button variant='secondary' size='icon' onClick={() => setEditingId(message._id)} aria-label='Edit message'>
                      <PencilIcon />
                    </Button>
                    <Button variant='destructive' size='icon' onClick={() => handleDelete(message._id)} aria-label='Delete message'>
                      <TrashIcon />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
