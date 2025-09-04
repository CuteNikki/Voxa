'use client';

import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import { api } from '../../../../convex/_generated/api';

import { ActiveMembers } from '@/components/messages/active-members';
import { ChatHeader } from '@/components/messages/chat-header';
import { MessageContainer } from '@/components/messages/container';
import { LAST_READ_UPDATE_INTERVAL } from '@/constants/limits';

export default function GroupPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useUser();

  const updateLastRead = useMutation(api.groups.updateMembers);

  useEffect(() => {
    if (!groupId || !user?.id) return;
    updateLastRead({ groupId }).catch(console.error);
  }, [user?.id, groupId, updateLastRead]);

  useEffect(() => {    
    const interval = setInterval(() => {
      updateLastRead({ groupId }).catch(console.error);
    }, LAST_READ_UPDATE_INTERVAL);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user?.id) {
    return;
  }

  return (
    <div className='flex flex-1 flex-row overflow-hidden'>
      <div className='flex flex-1 flex-col overflow-hidden'>
        <ChatHeader chatId={groupId} />
        <MessageContainer chatId={groupId} userId={user.id} />
      </div>
      <ActiveMembers groupId={groupId} userId={user.id} />
    </div>
  );
}
