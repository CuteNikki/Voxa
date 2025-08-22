'use client';

import { useUser } from '@clerk/nextjs';
import { useParams } from 'next/navigation';

import { ChatHeader } from '@/components/messages/chat-header';
import { MessageContainer } from '@/components/messages/container';

export default function GroupPage() {
  const { groupId } = useParams<{ groupId: string }>();

  const { user } = useUser();

  if (!user?.id) {
    return;
  }

  return (
    <>
      <ChatHeader chatId={groupId} />
      <MessageContainer chatId={groupId} userId={user.id} />
    </>
  );
}
