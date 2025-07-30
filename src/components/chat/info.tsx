'use client';

import { useQuery } from 'convex/react';

import { api } from '../../../convex/_generated/api';

import { ChatInput } from '@/components/chat/input';
import { Messages } from '@/components/chat/messages';
import { UserDetails } from '@/components/chat/user';

export function ChatInfo({ userId }: { userId: string }) {
  const chat = useQuery(api.chats.getChatByUserId, { userId });

  if (!chat) {
    return <p>No chat found for this user.</p>;
  }

  return (
    <div className='chat-info'>
      <h2 className='text-xl font-semibold'>Chat ID {chat._id}</h2>
      <p>Created at: {new Date(chat.createdAt).toLocaleString()}</p>
      <UserDetails userId={userId} />
      <Messages chatId={chat._id} />
      <ChatInput chatId={chat._id} />
    </div>
  );
}
