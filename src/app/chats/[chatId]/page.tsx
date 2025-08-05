import { MessageContainer } from '@/components/messages/container';
import { SiteHeader } from '@/components/test/chat-site-header';
import { auth } from '@clerk/nextjs/server';

export default async function ChatPage({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params;

  const { userId } = await auth();

  if (!userId) {
    return;
  }

  return (
    <>
      <SiteHeader chatId={chatId} />
      <MessageContainer chatId={chatId} userId={userId} />
    </>
  );
}
