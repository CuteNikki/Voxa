import { TypographyMuted } from '@/components/typography/muted';

export function ChatInfo({
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
    <div className='p-4 border-b'>
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
