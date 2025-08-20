'use client';

import { useMutation, useQuery } from 'convex/react';
import { useState } from 'react';

import { api } from '../../../convex/_generated/api';

import { CornerUpRightIcon } from 'lucide-react';

import { MAX_MESSAGE_LENGTH, MAX_MESSAGE_LENGTH_WARNING } from '@/constants/limits';

import { DeleteMessageButton } from '@/components/messages/delete-button';
import { EditMessageButton } from '@/components/messages/edit-button';
import { ReactionButton } from '@/components/messages/reaction-button';
import { ReplyButton } from '@/components/messages/reply-button';
import { MessageTimestamp } from '@/components/messages/timestamp';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

export function Message({
  message,
  userId,
  showAvatar,
  replyingTo,
  setReplyingTo,
  editing,
  setEditing,
  reactionPicker,
  setReactionPicker,
}: {
  message: {
    imageUrl?: string;
    content?: string;
    chatId: string;
    createdAt: number;
    senderId: string;
    _id: string;
    editedAt?: number;
    reactions?: { userId: string; reaction: string; createdAt: number }[];
    reference?: string;
  };
  showAvatar?: boolean;
  userId: string;
  replyingTo?: string;
  setReplyingTo: (messageId?: string) => void;
  editing?: string;
  setEditing: (messageId?: string) => void;
  reactionPicker?: string;
  setReactionPicker: (messageId?: string) => void;
}) {
  const [editingValue, setEditingValue] = useState(message.content ?? '');

  const author = useQuery(api.users.getUser, { clerkId: message.senderId });
  const editMessage = useMutation(api.messages.editMessage);
  const addReaction = useMutation(api.messages.addReaction);
  const removeReaction = useMutation(api.messages.removeReaction);

  if (!author) {
    return <MessageSkeleton />;
  }

  const isOwnMessage = message.senderId === userId;
  if (message.reference) showAvatar = true;

  return (
    <div
      id={message._id}
      className={`hover:bg-primary/10 focus:bg-primary/10 focus-within:bg-primary/10 ${message._id === replyingTo || message._id === editing || message._id === reactionPicker ? 'bg-primary/5 border-primary border-l-4' : ''} group relative flex items-start gap-2 px-4 transition-colors ${showAvatar ? 'pt-2 pb-1' : 'pt-1 pb-1'}`}
    >
      <div className='flex flex-1 flex-col gap-2'>
        {message.reference && <MessageReference messageId={message.reference} />}
        <div className='flex flex-row gap-2'>
          {showAvatar ? (
            <Avatar>
              <AvatarImage src={author.imageUrl} />
              <AvatarFallback>{author.username ? author.username.charAt(0).toUpperCase() : <Skeleton>U</Skeleton>}</AvatarFallback>
            </Avatar>
          ) : (
            <div className='w-8' />
          )}
          <div className='flex-1'>
            {showAvatar && (
              <div className='flex justify-between'>
                <div className='leading-tight font-semibold capitalize'>{author.username}</div>
                <div className='flex items-center gap-2'>
                  <div
                    className={`bg-muted absolute -top-6 right-4 flex items-center gap-2 rounded-lg p-1 opacity-0 shadow-md transition-opacity ${
                      message._id === replyingTo || message._id === editing || message._id === reactionPicker
                        ? 'opacity-100'
                        : 'group-focus-within:opacity-100 group-hover:opacity-100'
                    }`}
                  >
                    <ReactionButton messageId={message._id} reactionPicker={reactionPicker} setReactionPicker={setReactionPicker} />
                    <ReplyButton messageId={message._id} replyingTo={replyingTo} setReplyingTo={setReplyingTo} />
                    {isOwnMessage && (
                      <>
                        <EditMessageButton message={message} editing={editing} setEditing={setEditing} />
                        <DeleteMessageButton messageId={message._id} />
                      </>
                    )}
                  </div>
                  <MessageTimestamp message={message} />
                </div>
              </div>
            )}
            <div className='flex items-start justify-between'>
              {editing === message._id ? (
                <div className='relative w-full py-1'>
                  <Textarea
                    autoFocus
                    defaultValue={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setEditing(undefined);
                        return;
                      }

                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();

                        const trimmedContent = e.currentTarget.value.trim();

                        if (!trimmedContent || trimmedContent === message.content) {
                          setEditing(undefined);
                          return;
                        }

                        setEditing(undefined);
                        editMessage({ messageId: message._id, content: trimmedContent });
                      }
                    }}
                    onBlur={(e) => {
                      const trimmedContent = e.target.value.trim();

                      if (!trimmedContent || trimmedContent === message.content) {
                        setEditing(undefined);
                        return;
                      }

                      setEditing(undefined);
                      editMessage({ messageId: message._id, content: trimmedContent });
                    }}
                    className='no-scrollbar max-h-18 w-full resize-none pr-18 break-all whitespace-pre-line'
                  />
                  {editingValue.length >= MAX_MESSAGE_LENGTH_WARNING && (
                    <span
                      className={`absolute right-2 bottom-2 text-xs ${editingValue.length > MAX_MESSAGE_LENGTH ? 'text-red-500' : 'text-muted-foreground'}`}
                    >
                      {editingValue.length}/{MAX_MESSAGE_LENGTH}
                    </span>
                  )}
                </div>
              ) : (
                <div className='text-sm break-all whitespace-pre-line'>{message.content}</div>
              )}
              {!showAvatar && (
                <div
                  className={`bg-muted absolute -top-6 right-4 flex items-center gap-2 rounded-lg p-1 opacity-0 shadow-md transition-opacity ${message._id === replyingTo || message._id === editing || message._id === reactionPicker ? 'opacity-100' : 'group-focus-within:opacity-100 group-hover:opacity-100'}`}
                >
                  <div className='flex flex-row gap-1'>
                    <ReactionButton messageId={message._id} reactionPicker={reactionPicker} setReactionPicker={setReactionPicker} />
                    <ReplyButton messageId={message._id} replyingTo={replyingTo} setReplyingTo={setReplyingTo} />
                    {isOwnMessage && (
                      <>
                        <EditMessageButton message={message} editing={editing} setEditing={setEditing} />
                        <DeleteMessageButton messageId={message._id} />
                      </>
                    )}
                  </div>
                  <MessageTimestamp className='text-foreground pr-2' message={message} />
                </div>
              )}
            </div>
            {(message.reactions?.length ?? 0) > 0 && (
              <div className='flex flex-row items-center gap-1 py-2'>
                {Array.from(new Set(message.reactions?.map((r) => r.reaction))).map((uniqueReaction, index) => {
                  const userReacted = message.reactions?.some((r) => r.reaction === uniqueReaction && r.userId === userId);
                  return (
                    <Button
                      key={`message-${message._id}-reaction-${index}`}
                      variant={userReacted ? 'default' : 'secondary'}
                      size='sm'
                      onClick={() =>
                        userReacted
                          ? removeReaction({ messageId: message._id, reaction: uniqueReaction })
                          : addReaction({ messageId: message._id, reaction: uniqueReaction })
                      }
                    >
                      {uniqueReaction} <span className='font-mono'>{message.reactions?.filter((r) => r.reaction === uniqueReaction).length}</span>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MessageSkeleton({ showAvatar = true }: { showAvatar?: boolean }) {
  return (
    <div className={`hover:bg-muted/30 group relative flex items-start gap-2 px-4 transition-colors ${showAvatar ? 'py-2' : 'pt-1 pb-2'}`}>
      {showAvatar ? (
        <Avatar>
          <AvatarFallback>
            <Skeleton>U</Skeleton>
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className='w-8' />
      )}
      <div className='flex-1'>
        {showAvatar && (
          <div className='flex justify-between'>
            <Skeleton className='leading-tight font-semibold capitalize'>Unknown User</Skeleton>
            <div className='flex items-center gap-2'>
              <MessageTimestamp message={{ createdAt: 0 }} />
            </div>
          </div>
        )}
        <div className='flex items-start justify-between'>
          <Skeleton className='text-sm break-all whitespace-pre-line'>No Content</Skeleton>
        </div>
      </div>
    </div>
  );
}

function MessageReferenceSkeleton() {
  return (
    <div className='flex flex-row items-center gap-2'>
      <CornerUpRightIcon className='text-muted-foreground ml-2.5 size-5' />
      <div className='flex flex-row items-center gap-1'>
        <ReferenceUserSkeleton />
        <span className='text-muted-foreground max-w-30 truncate text-sm italic sm:max-w-60 lg:max-w-90'>Some Message</span>
      </div>
    </div>
  );
}

function MessageReference({ messageId }: { messageId: string }) {
  const message = useQuery(api.messages.getMessageById, { messageId });

  if (message === undefined) return <MessageReferenceSkeleton />;

  if (message === null)
    return (
      <div className='flex flex-row items-center gap-2'>
        <CornerUpRightIcon className='text-muted-foreground ml-2.5 size-5' />
        <span className='text-muted-foreground text-sm italic'>Replied message was deleted</span>
      </div>
    );

  if (!message) return null;

  return (
    <div className='flex flex-row items-center gap-2'>
      <CornerUpRightIcon className='text-muted-foreground ml-2.5 size-5' />
      <div className='flex flex-row items-center gap-1'>
        <ReferenceUser targetId={message.senderId} />
        <span className='text-muted-foreground max-w-30 truncate text-sm italic sm:max-w-60 lg:max-w-90' title={message.content}>
          {message.content}
        </span>
      </div>
    </div>
  );
}

function ReferenceUserSkeleton() {
  return (
    <div className='flex flex-row items-center gap-1 text-sm'>
      <Avatar className='size-4'>
        <AvatarFallback>
          <Skeleton>U</Skeleton>
        </AvatarFallback>
      </Avatar>
      <span className='capitalize'>Unknown:</span>
    </div>
  );
}

function ReferenceUser({ targetId }: { targetId: string }) {
  const user = useQuery(api.users.getUser, { clerkId: targetId });

  if (!user) return <ReferenceUserSkeleton />;

  return (
    <div className='flex flex-row items-center gap-1 text-sm'>
      <Avatar className='size-4'>
        <AvatarImage src={user.imageUrl} />
        <AvatarFallback>{user.username ? user.username.charAt(0).toUpperCase() : <Skeleton>U</Skeleton>}</AvatarFallback>
      </Avatar>
      <span className='capitalize'>{user.username}:</span>
    </div>
  );
}
