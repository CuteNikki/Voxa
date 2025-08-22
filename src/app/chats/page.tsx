'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useMemo, useState } from 'react';

import { FriendList } from '@/components/friends/friend-list';
import { FriendsHeader } from '@/components/friends/friends-header';
import { RequestList } from '@/components/friends/request-list';

export default function Page() {
  const { user } = useUser();

  const groups = useMemo(() => ['Friends', 'Requests'], []);
  const [activeTab, setActiveTab] = useState(groups[0]);

  useEffect(() => {
    if (!groups.includes(activeTab)) setActiveTab(groups[0] ?? '');
  }, [groups, activeTab]);

  if (!user) {
    return null;
  }

  return (
    <>
      <FriendsHeader groups={groups} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div>
        <div className='flex flex-col gap-2 p-3'>
          {activeTab === 'Friends' && <FriendList userId={user.id} />}
          {activeTab === 'Requests' && <RequestList userId={user.id} />}
        </div>
      </div>
    </>
  );
}
