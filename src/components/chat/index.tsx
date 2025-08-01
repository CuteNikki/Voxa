'use client';

import { useQuery } from 'convex/react';

import { api } from '../../../convex/_generated/api';

import { GroupChatInfo, PrivateChatInfo } from '@/components/chat/info';
import { ChatInput } from '@/components/chat/input';
import { Messages } from '@/components/chat/messages';

export function Chat({ userId, chatId, isGroup }: { userId: string; chatId: string; isGroup: boolean }) {
  const userChat = useQuery(api.chats.getChatByUserId, { userId });
  const groupChat = useQuery(api.chats.getGroupById, { groupId: chatId });

  if (!userChat && !groupChat) {
    return <p>No chat found.</p>;
  }

  return (
    <div className='flex h-full w-full flex-col'>
      <div className='shrink-0'>{isGroup ? <GroupChatInfo chat={groupChat!} /> : <PrivateChatInfo chat={userChat!} userId={userId} />}</div>

      <div className='min-h-0 flex-1'>
        <Messages chatId={isGroup ? chatId : userChat!._id} />
      </div>

      <div className='shrink-0'>
        <ChatInput chatId={isGroup ? chatId : userChat!._id} isGroup={isGroup} />
      </div>
    </div>
  );
}
