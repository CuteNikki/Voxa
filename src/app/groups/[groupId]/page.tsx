'use client';

import { useUser } from '@clerk/nextjs';
import { useParams } from 'next/navigation';

import { ActiveMembers } from '@/components/messages/active-members';
import { ChatHeader } from '@/components/messages/chat-header';
import { MessageContainer } from '@/components/messages/container';

export default function GroupPage() {
  const { groupId } = useParams<{ groupId: string }>();

  const { user } = useUser();

  if (!user?.id) {
    return;
  }

  return (
    <div className='flex flex-1 flex-row overflow-hidden'>
      <div className='flex flex-1 flex-col overflow-hidden'>
        <ChatHeader chatId={groupId} />
        <MessageContainer chatId={groupId} userId={user.id} />
      </div>
      <ActiveMembers groupId={groupId} userId={user.id} />
    </div>
  );
}
