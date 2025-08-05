'use client';

import { useQuery } from 'convex/react';

import { api } from '../../../convex/_generated/api';

import { DeleteMessageButton } from '@/components/messages/delete-button';
import { EditMessageButton } from '@/components/messages/edit-button';
import { ReactionButton } from '@/components/messages/reaction-button';
import { MessageTimestamp } from '@/components/messages/timestamp';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

export function Message({
  message,
  userId,
  showAvatar,
}: {
  message: {
    imageUrl?: string;
    content?: string;
    chatId: string;
    createdAt: number;
    senderId: string;
    _id: string;
    editedAt?: number;
    reactions?: { userId: string; reaction: string }[];
    reference?: string;
  };
  showAvatar?: boolean;
  userId: string;
}) {
  const author = useQuery(api.users.getUser, { clerkId: message.senderId });

  if (!author) {
    return <MessageSkeleton />;
  }

  const isOwnMessage = message.senderId === userId;

  return (
    <div className={`hover:bg-muted/30 group relative flex items-start gap-2 px-4 transition-colors ${showAvatar ? 'py-2' : 'pb-2'}`}>
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
            <div className='leading-tight font-semibold capitalize'>{author.username}</div>
            <div className='flex items-center gap-2'>
              <div className='bg-background absolute -top-6 right-4 flex items-center gap-2 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100'>
                {isOwnMessage && (
                  <>
                    <EditMessageButton message={message} />
                    <DeleteMessageButton messageId={message._id} />
                  </>
                )}
                <ReactionButton messageId={message._id} />
              </div>
              <MessageTimestamp message={message} />
            </div>
          </div>
        )}
        <div className='flex items-start justify-between'>
          <div className='text-sm break-all whitespace-pre-line'>{message.content}</div>
          {!showAvatar && (
            <div className='bg-background absolute -top-6 right-4 flex items-center gap-2 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100'>
              <div className='flex flex-row space-x-1'>
                {isOwnMessage && (
                  <>
                    <EditMessageButton message={message} />
                    <DeleteMessageButton messageId={message._id} />
                  </>
                )}
                <ReactionButton messageId={message._id} />
              </div>
              <MessageTimestamp message={message} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function MessageSkeleton() {
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
