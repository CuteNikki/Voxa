import { useQuery } from 'convex/react';
import Image from 'next/image';
import { api } from '../../../convex/_generated/api';

export function Messages({ chatId }: { chatId: string }) {
  const messages = useQuery(api.messages.getMessages, { chatId });

  if (!messages || messages.length === 0) {
    return <p>No messages found for this chat.</p>;
  }

  return (
    <div className='messages'>
      {messages.map((message) => (
        <Message key={message._id} message={message} />
      ))}
    </div>
  );
}

export function Message({ message }: { message: { _id: string; senderId: string; content?: string; createdAt: number } }) {
  const sender = useQuery(api.users.getUser, { clerkId: message.senderId });

  if (!sender) {
    return <p>Sender not found.</p>;
  }

  return (
    <div className='flex flex-row items-center gap-2'>
      <Image src={sender.imageUrl || '/default-avatar.png'} alt={`${sender.username} avatar`} width={512} height={512} className='w-12 h-12 rounded-full' />
      <div className='flex flex-col'>
        <div className='flex flex-row items-center gap-2'>
          <strong className='capitalize'>{sender?.username}</strong>
          <span className='text-gray-500 text-sm'>{new Date(message.createdAt).toLocaleString()}</span>
        </div>
        <p>{message.content}</p>
      </div>
    </div>
  );
}
