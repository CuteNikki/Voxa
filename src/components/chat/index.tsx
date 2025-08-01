import { auth } from '@clerk/nextjs/server';
import { fetchQuery } from 'convex/nextjs';
import { redirect } from 'next/navigation';

import { api } from '../../../convex/_generated/api';

import { GroupChatInfo, PrivateChatInfo } from '@/components/chat/info';
import { ChatInput } from '@/components/chat/input';
import { Messages } from '@/components/chat/messages';

export async function Chat({ targetUserId, chatId, isGroup }: { targetUserId: string; chatId: string; isGroup: boolean }) {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/');
  }

  const userChat = await fetchQuery(api.chats.getChatByUserId, { targetUserId, currentUserId: userId });
  const groupChat = await fetchQuery(api.chats.getGroupById, { groupId: chatId });

  if (!userChat && !groupChat) {
    redirect('/');
  }

  return (
    <div className='flex h-full w-full flex-col'>
      <div className='shrink-0'>{isGroup ? <GroupChatInfo chat={groupChat!} /> : <PrivateChatInfo chat={userChat!} userId={targetUserId} />}</div>

      <div className='min-h-0 flex-1'>
        <Messages chatId={isGroup ? chatId : userChat!._id} />
      </div>

      <div className='shrink-0'>
        <ChatInput chatId={isGroup ? chatId : userChat!._id} isGroup={isGroup} />
      </div>
    </div>
  );
}
