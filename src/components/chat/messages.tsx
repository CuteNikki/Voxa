import { useQuery } from 'convex/react';
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

  return (
    <div className='message'>
      <p>
        <strong>{sender?.username}</strong>: {message.content}
      </p>
      <span className='text-gray-500 text-sm'>{new Date(message.createdAt).toLocaleString()}</span>
    </div>
  );
}
