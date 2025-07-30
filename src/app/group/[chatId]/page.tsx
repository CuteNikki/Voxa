import { ChatInfo } from '@/components/group/info';

export default async function ChatPage({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params;

  return (
    <div className='flex flex-col items-center justify-center h-full'>
      <ChatInfo chatId={chatId} />
    </div>
  );
}
