import { auth } from '@clerk/nextjs/server';

import { ChatHeader } from '@/components/messages/chat-header';
import { MessageContainer } from '@/components/messages/container';

export default async function ChatPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;

  const { userId } = await auth();

  if (!userId) {
    return;
  }

  return (
    <>
      <ChatHeader chatId={groupId} />
      <MessageContainer chatId={groupId} userId={userId} />
    </>
  );
}
