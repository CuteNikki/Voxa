import { auth } from '@clerk/nextjs/server';

import { ChatHeader } from '@/components/messages/chat-header';
import { MessageContainer } from '@/components/messages/container';

export default async function ChatPage({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params;

  const { userId } = await auth();

  if (!userId) {
    return;
  }

  return (
    <>
      <ChatHeader chatId={chatId} />
      <MessageContainer chatId={chatId} userId={userId} />
    </>
  );
}
