import { useQuery } from 'convex/react';

import { api } from '../../../convex/_generated/api';

import { LAST_READ_THRESHOLD } from '@/constants/limits';
import { PLACEHOLDER_UNKNOWN_USER } from '@/constants/placeholders';

import { PopoverContentUser } from '@/components/messages/message';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NumberBadge } from '@/components/ui/badge';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

export function ActiveMembers({ groupId, userId }: { groupId: string; userId: string }) {
  const group = useQuery(api.groups.getGroupById, { chatId: groupId });
  const groupMemberIds = group?.members.filter((m) => Date.now() - (m.lastReadAt ?? 0) < LAST_READ_THRESHOLD).map((m) => m.userId);
  const groupMembers = useQuery(api.users.getUsersByIds, groupMemberIds && groupMemberIds.length > 0 ? { ids: groupMemberIds } : 'skip');

  return (
    <div className='hidden w-45 flex-col items-center justify-center border-l lg:flex'>
      <div className='flex h-(--header-height) w-full shrink-0 flex-col items-center justify-center border-b p-4'>
        <span className='text-center text-sm'>
          <NumberBadge className='mr-1'>{groupMembers?.length ?? 0}</NumberBadge> Active Members
        </span>
      </div>
      <ScrollArea className='h-full w-full overflow-auto'>
        <div className='flex w-full flex-col p-2'>
          {groupMembers !== undefined ? (
            groupMembers.length > 0 ? (
              groupMembers.map((member, id) => (
                <Popover key={id}>
                  <PopoverContentUser target={member} userId={userId} side='left' align='start' />
                  <PopoverTrigger className='hover:bg-muted/60 w-full cursor-pointer self-start rounded-md p-2 transition-colors'>
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
              <div key={id} className='hover:bg-muted/60 w-full cursor-pointer self-start rounded-md p-2 transition-colors'>
                <div className='flex items-center gap-2'>
                  <Avatar className='size-6'>
                    <AvatarFallback>
                      <Skeleton>{PLACEHOLDER_UNKNOWN_USER.initials}</Skeleton>
                    </AvatarFallback>
                  </Avatar>
                  <Skeleton className='capitalize'>{PLACEHOLDER_UNKNOWN_USER.username}</Skeleton>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
