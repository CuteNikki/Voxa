import { ChatInfo } from '@/components/chat/info';

export default async function ChatPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  return (
    <div className='flex flex-col items-center justify-center h-full'>
      <ChatInfo userId={userId} />
    </div>
  );
}
