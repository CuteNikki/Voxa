'use client';

import { useQuery } from 'convex/react';

import { api } from '../../../convex/_generated/api';

import { ChatInput } from '@/components/group/input';
import { Messages } from '@/components/group/messages';

export function ChatInfo({ chatId }: { chatId: string }) {
  const chat = useQuery(api.chats.getGroupById, { groupId: chatId });

  if (!chat) {
    return <p>No chat found.</p>;
  }

  return (
    <div className='chat-info'>
      <h2 className='text-xl font-semibold'>Chat ID {chat._id}</h2>
      <p>Created at: {new Date(chat.createdAt).toLocaleString()}</p>
      <Messages chatId={chat._id} />
      <ChatInput chatId={chat._id} />
    </div>
  );
}
