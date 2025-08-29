import { useQuery } from 'convex/react';

import { api } from '../../../convex/_generated/api';

import { LAST_READ_THRESHOLD } from '@/constants/limits';
import { PLACEHOLDER_UNKNOWN_USER } from '@/constants/placeholders';

import { PopoverContentUser } from '@/components/messages/message';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';

export function ActiveMembers({ groupId, userId }: { groupId: string; userId: string }) {
  const group = useQuery(api.groups.getGroupById, { chatId: groupId });
  const groupMemberIds = group?.members.filter((m) => Date.now() - (m.lastReadAt ?? 0) < LAST_READ_THRESHOLD).map((m) => m.userId);
  const groupMembers = useQuery(api.users.getUsersByIds, groupMemberIds && groupMemberIds.length > 0 ? { ids: groupMemberIds } : 'skip');

  return (
    <div className='hidden w-45 flex-col items-center justify-center border-l lg:flex'>
      <div className='flex h-(--header-height) w-full shrink-0 flex-col items-center justify-center border-b p-4'>
        <span className='text-center text-sm'>
          <Badge className='rounded-full px-1.5'>{groupMembers?.length ?? 0}</Badge> Active Members
        </span>
      </div>
      <div className='flex h-full flex-col gap-2 p-4'>
        {groupMembers !== undefined ? (
          groupMembers.length > 0 ? (
            groupMembers.map((member, id) => (
              <Popover key={id}>
                <PopoverContentUser target={member} userId={userId} side='left' align='start' />
                <PopoverTrigger className='cursor-pointer self-start'>
                  <div className='flex items-center gap-2'>
                    <Avatar className='size-6'>
                      <AvatarImage src={member.imageUrl} alt={member.username + ' avatar'} />
                      <AvatarFallback>{member.username?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className='capitalize'>{member.username}</span>
                  </div>
                </PopoverTrigger>
              </Popover>
            ))
          ) : (
            <span className='text-muted-foreground text-sm'>No active members</span>
          )
        ) : (
          Array.from({ length: 3 }).map((member, id) => (
            <div key={id} className='flex items-center gap-2'>
              <Avatar className='size-6'>
                <AvatarFallback>
                  <Skeleton>{PLACEHOLDER_UNKNOWN_USER.initials}</Skeleton>
                </AvatarFallback>
              </Avatar>
              <Skeleton>{PLACEHOLDER_UNKNOWN_USER.username}</Skeleton>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
