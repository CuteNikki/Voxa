import { Chat } from '@/components/chat';

export default async function ChatPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  return <Chat targetUserId={userId} chatId='' isGroup={false} />;
}
