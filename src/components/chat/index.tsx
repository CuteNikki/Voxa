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
    <div className='flex flex-col h-screen w-full'>
      <div className='shrink-0'>
        <ChatInfo chat={chat} userId={userId} />
      </div>

      <div className='flex-1 min-h-0'>
        <Messages chatId={chat._id} />
      </div>

      <div className='shrink-0'>
        <ChatInput chatId={chat._id} />
      </div>
    </div>
  );
}
