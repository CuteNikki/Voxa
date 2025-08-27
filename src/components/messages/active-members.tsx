import { useQuery } from 'convex/react';

import { api } from '../../../convex/_generated/api';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function ActiveMembers({ groupId }: { groupId: string }) {
  const groupMemberIds = useQuery(api.groups.getGroupById, { chatId: groupId })?.members.map((m) => m.userId);
  const groupMembers = useQuery(api.users.getUsersByIds, groupMemberIds ? { ids: groupMemberIds } : 'skip');

  return (
    <div className='hidden w-50 border-l pt-(--header-height) lg:flex'>
      <div className='flex flex-col gap-4 border-t p-2'>
        <span>
          Group Members <Badge className='rounded-full px-1.5'>{groupMembers?.length}</Badge>
        </span>
        {groupMembers && groupMembers.length > 0 ? (
          <div className='flex flex-col gap-2'>
            {groupMembers.map((member, id) => (
              <div key={id} className='flex items-center gap-1'>
                <Avatar className='size-6'>
                  <AvatarImage src={member.imageUrl} alt={member.username + ' avatar'} />
                  <AvatarFallback>{member.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className='capitalize'>{member.username}</span>
              </div>
            ))}
          </div>
        ) : (
          <span>None</span>
        )}
      </div>
    </div>
  );
}
