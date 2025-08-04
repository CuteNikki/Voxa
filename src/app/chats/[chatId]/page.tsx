import { SiteHeader } from '@/components/test/chat-site-header';
import { ChatMessages } from '@/components/test/messages';
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
      <ChatMessages chatId={chatId} userId={userId} />
    </>
  );
}
