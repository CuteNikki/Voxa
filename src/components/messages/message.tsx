'use client';

import { useMutation, useQuery } from 'convex/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { api } from '../../../convex/_generated/api';
import { Doc } from '../../../convex/_generated/dataModel';

import { CornerUpRightIcon, MessagesSquareIcon } from 'lucide-react';

import { MAX_MESSAGE_LENGTH, MAX_MESSAGE_LENGTH_WARNING } from '@/constants/limits';
import { PLACEHOLDER_MESSAGE, PLACEHOLDER_UNKNOWN_USER } from '@/constants/placeholders';
import { formatJoinedTimestamp } from '@/lib/utils';

import { AcceptRequestButton } from '@/components/friends/accept';
import { AddFriendButton } from '@/components/friends/add';
import { CancelRequestButton } from '@/components/friends/cancel';
import { DeclineRequestButton } from '@/components/friends/decline';
import { RemoveFriendButton } from '@/components/friends/remove';
import { DeleteMessageButton } from '@/components/messages/delete-button';
import { EditMessageButton } from '@/components/messages/edit-button';
import { ReactionButton } from '@/components/messages/reaction-button';
import { ReplyButton } from '@/components/messages/reply-button';
import { MessageTimestamp } from '@/components/messages/timestamp';
import { TypographyLarge } from '@/components/typography/large';
import { TypographyMuted } from '@/components/typography/muted';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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
  setViewReactionsFor,
  highlightedMessageId,
  setHighlightedMessageId,
  setDisableAutoScrollUntil,
}: {
  message: Doc<'messages'>;
  showAvatar?: boolean;
  userId: string;
  replyingTo?: string;
  setReplyingTo: (messageId?: string) => void;
  editing?: string;
  setEditing: (messageId?: string) => void;
  reactionPicker?: string;
  setReactionPicker: (messageId?: string) => void;
  setViewReactionsFor: (messageId?: string) => void;
  highlightedMessageId?: string;
  setHighlightedMessageId: (messageId?: string) => void;
  setDisableAutoScrollUntil: (timestamp: number) => void;
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
      className={`hover:bg-accent/40 focus:bg-accent/40 focus-within:bg-accent/40 ${message._id === replyingTo || message._id === editing || message._id === reactionPicker || message._id === highlightedMessageId ? 'bg-accent/30 border-primary border-l-4' : ''} group relative flex items-start gap-2 px-4 transition-colors sm:mr-4 sm:rounded-tr-xl sm:rounded-br-xl ${showAvatar ? 'pt-2 pb-1' : 'pt-1 pb-1'}`}
    >
      <div className='flex flex-1 flex-col gap-2'>
        {message.reference && (
          <MessageReference
            messageId={message.reference}
            setHighlightedMessageId={setHighlightedMessageId}
            setDisableAutoScrollUntil={setDisableAutoScrollUntil}
          />
        )}
        <Popover>
          <div className='flex flex-row gap-2'>
            {showAvatar ? (
              <PopoverTrigger asChild>
                <Avatar>
                  <AvatarImage src={author.imageUrl} />
                  <AvatarFallback>
                    {author.username ? author.username.charAt(0).toUpperCase() : <Skeleton>{PLACEHOLDER_UNKNOWN_USER.initials}</Skeleton>}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
            ) : (
              <div className='w-8' />
            )}
            <PopoverContentUser target={author} userId={userId} side='bottom' align='start' />
            <div className='flex-1'>
              {showAvatar && (
                <div className='flex justify-between'>
                  <PopoverTrigger className='hover:underline' asChild>
                    <div className='leading-tight font-semibold capitalize'>{author.username}</div>
                  </PopoverTrigger>
                  <div className='flex items-center gap-2'>
                    <div
                      className={`bg-muted absolute -top-6 right-4 flex items-center gap-1 rounded-lg p-1 opacity-0 shadow-md transition-opacity ${
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
                          <DeleteMessageButton message={message} />
                        </>
                      )}
                    </div>
                    <MessageTimestamp message={message} />
                  </div>
                </div>
              )}
              <div className='flex items-start'>
                {editing === message._id ? (
                  <div className='relative w-full py-1'>
                    <Textarea
                      autoFocus
                      defaultValue={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          setEditing(undefined);
                          setEditingValue(message.content ?? '');
                          return;
                        }

                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();

                          const trimmedContent = e.currentTarget.value.trim();

                          if (!trimmedContent || trimmedContent === message.content) {
                            setEditing(undefined);
                            setEditingValue(message.content ?? '');
                            return;
                          }

                          setEditing(undefined);
                          setEditingValue(trimmedContent);
                          editMessage({ messageId: message._id, content: trimmedContent }).catch(console.error);
                        }
                      }}
                      className='no-scrollbar max-h-18 w-full resize-none break-all whitespace-pre-line'
                    />
                  </div>
                ) : (
                  <div className='flex flex-col'>
                    <div className='text-sm break-all whitespace-pre-line'>{message.content}</div>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className='mt-2 flex w-full max-w-5xl flex-wrap gap-2'>
                        {message.attachments.map((att, idx) => (
                          <Image
                            priority
                            key={idx}
                            width={255}
                            height={255}
                            src={att.url}
                            alt={`Image ${idx + 1} for message ${message._id}`}
                            className='max-h-40 w-fit rounded-md'
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.onerror = null; // Prevent infinite loop
                              target.src = '/fallback.png';
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
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
                          <DeleteMessageButton message={message} />
                        </>
                      )}
                    </div>
                    <MessageTimestamp className='text-foreground pr-2' message={message} />
                  </div>
                )}
              </div>
              {(message.reactions?.length ?? 0) > 0 && !editing && (
                <div className='flex flex-row items-center gap-1 py-2'>
                  {Array.from(new Set(message.reactions?.map((r) => r.reaction))).map((uniqueReaction, index) => {
                    const reactions = message.reactions?.filter((r) => r.reaction === uniqueReaction);
                    const userReacted = reactions?.find((r) => r.userId === userId);

                    return (
                      <Tooltip key={`message-${message._id}-reaction-${index}`}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={userReacted ? 'default' : 'secondary'}
                            size='sm'
                            onClick={() =>
                              userReacted
                                ? removeReaction({ messageId: message._id, reaction: uniqueReaction }).catch(console.error)
                                : addReaction({ messageId: message._id, reaction: uniqueReaction }).catch(console.error)
                            }
                          >
                            {uniqueReaction} <span className='font-mono'>{reactions?.length}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent variant='secondary' onClick={() => setViewReactionsFor(message._id)} className='group hover:cursor-pointer'>
                          <span className='text-xs'>
                            {uniqueReaction} reacted by{' '}
                            {(() => {
                              const maxNames = 3;
                              const names = reactions?.slice(0, maxNames) ?? [];
                              const othersCount = (reactions?.length ?? 0) - names.length;
                              return (
                                <span className='text-primary group-hover:underline'>
                                  {names.map((r, i) => (
                                    <span key={`message-${message._id}-reaction-${i}-user-${r.userId}-name`}>
                                      <ReactionName userId={r.userId} />
                                      {i < names.length - 1 && ', '}
                                    </span>
                                  ))}
                                  {othersCount > 0 && (
                                    <span>
                                      {' '}
                                      and {othersCount} other{othersCount > 1 ? 's' : ''}
                                    </span>
                                  )}
                                </span>
                              );
                            })()}
                          </span>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              )}
              {editing === message._id && (
                <div className='flex flex-row items-center gap-2'>
                  <Button
                    variant='secondary'
                    onClick={() => {
                      setEditing(undefined);
                      setEditingValue(message.content ?? '');
                    }}
                    className='mt-2 ml-2'
                    size='sm'
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      const trimmedContent = editingValue.trim();

                      if (!trimmedContent || trimmedContent === message.content) {
                        setEditing(undefined);
                        return;
                      }

                      setEditing(undefined);
                      editMessage({ messageId: message._id, content: trimmedContent }).catch(console.error);
                    }}
                    disabled={editingValue.length > MAX_MESSAGE_LENGTH}
                    className='mt-2'
                    size='sm'
                  >
                    Save
                  </Button>
                  {editingValue.length >= MAX_MESSAGE_LENGTH_WARNING && (
                    <span className={`text-xs ${editingValue.length > MAX_MESSAGE_LENGTH ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {editingValue.length}/{MAX_MESSAGE_LENGTH}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </Popover>
      </div>
    </div>
  );
}

function ReactionName({ userId }: { userId: string }) {
  const user = useQuery(api.users.getUser, { clerkId: userId });

  if (!user) return <Skeleton>{PLACEHOLDER_UNKNOWN_USER.username}</Skeleton>;

  return <span className='capitalize'>{user.username}</span>;
}

export function MessageSkeleton({ showAvatar = true }: { showAvatar?: boolean }) {
  return (
    <div className={`hover:bg-muted/30 group relative flex items-start gap-2 px-4 transition-colors ${showAvatar ? 'py-2' : 'pt-1 pb-2'}`}>
      {showAvatar ? (
        <Avatar>
          <AvatarFallback>
            <Skeleton>{PLACEHOLDER_UNKNOWN_USER.initials}</Skeleton>
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className='w-8' />
      )}
      <div className='flex-1'>
        {showAvatar && (
          <div className='flex justify-between'>
            <Skeleton className='leading-tight font-semibold capitalize'>{PLACEHOLDER_UNKNOWN_USER.username}</Skeleton>
            <div className='flex items-center gap-2'>
              <MessageTimestamp message={{ _creationTime: PLACEHOLDER_MESSAGE.timestamp }} />
            </div>
          </div>
        )}
        <div className='flex items-start justify-between'>
          <Skeleton className='text-sm break-all whitespace-pre-line'>{PLACEHOLDER_MESSAGE.content}</Skeleton>
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
        <Skeleton className='text-muted-foreground max-w-30 truncate text-sm italic sm:max-w-60 lg:max-w-90'>{PLACEHOLDER_MESSAGE.content}</Skeleton>
      </div>
    </div>
  );
}

function MessageReference({
  messageId,
  setHighlightedMessageId,
  setDisableAutoScrollUntil,
}: {
  messageId: string;
  setHighlightedMessageId: (messageId?: string) => void;
  setDisableAutoScrollUntil: (timestamp: number) => void;
}) {
  const message = useQuery(api.messages.getMessageById, { messageId });

  if (message === undefined) return <MessageReferenceSkeleton />;

  if (message === null)
    return (
      <div className='flex flex-row items-center gap-2'>
        <CornerUpRightIcon className='text-muted-foreground ml-2.5 size-5' />
        <span className='text-muted-foreground text-sm italic'>Replied message was deleted</span>
      </div>
    );

  return (
    <button
      type='button'
      onClick={() => {
        const el = document.getElementById(messageId);
        if (el) {
          setDisableAutoScrollUntil(Date.now() + 1600);

          el.focus();
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setHighlightedMessageId(messageId);
        }
      }}
      className='group/ref flex w-fit cursor-pointer flex-row items-center gap-2'
    >
      <CornerUpRightIcon className='text-muted-foreground ml-2.5 size-5' />
      <div className='flex flex-row items-center gap-1'>
        <ReferenceUser targetId={message.senderId} />
        <span className='text-muted-foreground max-w-30 truncate text-sm italic group-hover/ref:underline sm:max-w-60 lg:max-w-90' title={message.content}>
          {message.content} {message.attachments && message.attachments.length > 0 && '🖼'}
        </span>
      </div>
    </button>
  );
}

function ReferenceUserSkeleton() {
  return (
    <div className='flex flex-row items-center gap-1 text-sm'>
      <Avatar className='size-4'>
        <AvatarFallback>
          <Skeleton>{PLACEHOLDER_UNKNOWN_USER.initials}</Skeleton>
        </AvatarFallback>
      </Avatar>
      <Skeleton className='capitalize'>{PLACEHOLDER_UNKNOWN_USER.username}:</Skeleton>
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
        <AvatarFallback>{user.username ? user.username.charAt(0).toUpperCase() : <Skeleton>{PLACEHOLDER_UNKNOWN_USER.initials}</Skeleton>}</AvatarFallback>
      </Avatar>
      <span className='capitalize'>{user.username}:</span>
    </div>
  );
}

function PopoverContentUser({
  target,
  userId,
  side,
  align,
}: {
  target: Doc<'users'>;
  userId: string;
  side: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
}) {
  const isFriend = useQuery(api.friends.isFriend, { userId: userId, targetId: target.clerkId });
  const isPending = useQuery(api.friends.isPendingRequest, { userId: userId, targetId: target.clerkId });
  const chatWithFriend = useQuery(api.chats.getChatByUserId, target.clerkId === userId ? 'skip' : { targetId: target.clerkId });

  return (
    <PopoverContent side={side} align={align} className='mx-2 md:w-sm'>
      <div className='flex flex-col gap-4'>
        {/* TOP PART */}
        <div className='flex flex-row items-center justify-between gap-2'>
          {/* PROFILE */}
          <div className='flex flex-row gap-2'>
            {/* LEFT SIDE - AVATAR */}
            <Avatar className='size-10'>
              <AvatarImage src={target.imageUrl} />
              <AvatarFallback>
                {target.username ? target.username.charAt(0).toUpperCase() : <Skeleton>{PLACEHOLDER_UNKNOWN_USER.initials}</Skeleton>}
              </AvatarFallback>
            </Avatar>
            {/* RIGHT SIDE - NAME & DATE */}
            <div className='flex flex-col'>
              <TypographyLarge className='leading-tight capitalize'>{target.username}</TypographyLarge>
              <TypographyMuted>
                Created at<span className='md:hidden'>: <br /></span>
                {' '}{formatJoinedTimestamp(target._creationTime)}
              </TypographyMuted>
            </div>
          </div>
          {/* FRIEND STATUS */}
          {target.clerkId !== userId && (
            <div className='flex flex-row items-center gap-1'>
              {isPending ? (
                <PendingUserButton target={target.clerkId} userId={userId} />
              ) : isFriend ? (
                <>
                  <Button asChild title='Open chat'>
                    <Link href={`/chats/${chatWithFriend?._id}`}>
                      <MessagesSquareIcon />
                    </Link>
                  </Button>
                  <RemoveFriendButton targetUserId={target.clerkId} userId={userId} />
                </>
              ) : (
                <AddFriendButton targetUserId={target.clerkId} userId={userId} />
              )}
            </div>
          )}
        </div>
        <Separator />
        {/* BOTTOM PART */}
        <div>
          <TypographyMuted>Profile customization features coming soon.</TypographyMuted>
        </div>
      </div>
    </PopoverContent>
  );
}

function PendingUserButton({ target, userId }: { target: string; userId: string }) {
  const receivedRequests = useQuery(api.friends.getFriendRequests, { userId });
  const isReceived = receivedRequests?.some((req) => req.from === target);

  if (isReceived) {
    return (
      <>
        <AcceptRequestButton userId={userId} targetId={target} />
        <DeclineRequestButton userId={userId} targetId={target} />
      </>
    );
  } else {
    return <CancelRequestButton userId={userId} targetId={target} />;
  }
}
