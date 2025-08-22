'use client';

import { useUser } from '@clerk/nextjs';
import { useParams } from 'next/navigation';

import { ChatHeader } from '@/components/messages/chat-header';
import { MessageContainer } from '@/components/messages/container';

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();

  const { user } = useUser();

  if (!user?.id) {
    return;
  }

  return (
    <>
      <ChatHeader chatId={chatId} />
      <MessageContainer chatId={chatId} userId={user.id} />
    </>
  );
}
