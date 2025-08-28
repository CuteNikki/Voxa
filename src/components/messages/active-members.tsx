import { useQuery } from 'convex/react';

import { api } from '../../../convex/_generated/api';

import { LAST_READ_THRESHOLD } from '@/constants/limits';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function ActiveMembers({ groupId }: { groupId: string }) {
  const group = useQuery(api.groups.getGroupById, { chatId: groupId });
  const groupMemberIds = group?.members.filter((m) => Date.now() - (m.lastReadAt ?? 0) < LAST_READ_THRESHOLD).map((m) => m.userId);
  const groupMembers = useQuery(api.users.getUsersByIds, groupMemberIds ? { ids: groupMemberIds } : 'skip');

  return (
    <div className='hidden w-50 flex-col border-l lg:flex'>
      <div className='flex h-(--header-height) shrink-0 flex-col items-center justify-center border-b p-4'>
        <span className='text-center text-sm'>
          Group Members <Badge className='rounded-full px-1.5'>{groupMembers?.length ?? 0}</Badge>
        </span>
      </div>
      <div className='flex flex-col gap-2 p-4'>
        {groupMembers && groupMembers.length > 0 ? (
          groupMembers.map((member, id) => (
            <div key={id} className='flex items-center gap-1'>
              <Avatar className='size-6'>
                <AvatarImage src={member.imageUrl} alt={member.username + ' avatar'} />
                <AvatarFallback>{member.username?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className='capitalize'>{member.username}</span>
            </div>
          ))
        ) : (
          <span>None</span>
        )}
      </div>
    </div>
  );
}
