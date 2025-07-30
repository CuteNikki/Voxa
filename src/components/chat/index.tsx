'use client';

import { useQuery } from 'convex/react';

import { api } from '../../../convex/_generated/api';

import { ChatInfo } from '@/components/chat/info';
import { ChatInput } from '@/components/chat/input';
import { Messages } from '@/components/chat/messages';

export function Chat({ userId }: { userId: string }) {
  const chat = useQuery(api.chats.getChatByUserId, { userId });

  if (!chat) {
    return <p>No chat found for this user.</p>;
  }

  return (
    <div className='w-full'>
      <ChatInfo chat={chat} userId={userId} />
      <Messages chatId={chat._id} />
      <ChatInput chatId={chat._id} />
    </div>
  );
}
