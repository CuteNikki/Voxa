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
    <div className='border-b p-4'>
      <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
        <UserDetails userId={userId} />

        <div className='flex flex-col'>
          <TypographyMuted>Created at: {new Date(chat.createdAt).toLocaleString()}</TypographyMuted>
          <TypographyMuted>ID: {chat._id}</TypographyMuted>
        </div>
      </div>
    </div>
  );
}
