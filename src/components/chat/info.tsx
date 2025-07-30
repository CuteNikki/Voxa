import { UserDetails } from '@/components/chat/user';
import { TypographyMuted } from '@/components/typography/muted';

export function ChatInfo({
  chat,
  userId,
}: {
  userId: string;
  chat: {
    _id: string;
    _creationTime: number;
    createdAt: number;
    userIdOne: string;
    userIdTwo: string;
  };
}) {
  return (
    <div className='p-4 border-b shadow-md dark:shadow-white/5'>
      <div className='flex flex-col md:flex-row justify-between md:items-center gap-4'>
        <UserDetails userId={userId} />

        <div className='flex flex-col'>
          <TypographyMuted>Created at: {new Date(chat.createdAt).toLocaleString()}</TypographyMuted>
          <TypographyMuted>ID: {chat._id}</TypographyMuted>
        </div>
      </div>
    </div>
  );
}
