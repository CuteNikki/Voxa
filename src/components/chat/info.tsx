import { UserDetails } from '@/components/chat/user';
import { TypographyMuted } from '@/components/typography/muted';

export function PrivateChatInfo({
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

export function GroupChatInfo({
  chat,
}: {
  chat: {
    _id: string;
    _creationTime: number;
    createdAt: number;
    name: string;
    memberIds: string[];
    createdBy: string;
  };
}) {
  return (
    <div className='border-b p-4'>
      <div className='flex flex-col'>
        <h2 className='text-xl font-semibold'>{chat.name}</h2>
        <div className='flex flex-col sm:flex-row sm:gap-2'>
          <TypographyMuted>Created at: {new Date(chat.createdAt).toLocaleString()}</TypographyMuted>
          <TypographyMuted className='hidden sm:block'>—</TypographyMuted>
          <TypographyMuted>ID: {chat._id}</TypographyMuted>
        </div>
      </div>
    </div>
  );
}
