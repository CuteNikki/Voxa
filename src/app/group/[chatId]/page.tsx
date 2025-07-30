import { GroupChat } from '@/components/group';

export default async function ChatPage({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params;

  return <GroupChat chatId={chatId} />;
}
