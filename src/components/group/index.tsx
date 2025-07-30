'use client';

import { useQuery } from 'convex/react';

import { api } from '../../../convex/_generated/api';

import { ChatInfo } from '@/components/group/info';
import { ChatInput } from '@/components/group/input';
import { Messages } from '@/components/group/messages';

export function GroupChat({ chatId }: { chatId: string }) {
  const chat = useQuery(api.chats.getGroupById, { groupId: chatId });

  if (!chat) {
    return <p>No chat found.</p>;
  }

  return (
    <div className='w-full'>
      <ChatInfo chat={chat} />
      <Messages chatId={chat._id} />
      <ChatInput chatId={chat._id} />
    </div>
  );
}
