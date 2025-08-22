import { useQuery } from 'convex/react';

import { api } from '../../../convex/_generated/api';

import { FriendList } from '@/components/friends/friend-list';
import { FriendsHeader } from '@/components/friends/friends-header';
import { RequestList } from '@/components/friends/request-list';

export function FriendsOverview({
  activeTab,
  userId,
  groups,
  setActiveTab,
}: {
  activeTab: string;
  userId: string;
  groups: string[];
  setActiveTab: (tab: string) => void;
}) {
  const incomingRequests = useQuery(api.friends.getFriendRequests, { userId });
  const outgoingRequests = useQuery(api.friends.getSentRequests, { userId });
  const friendIds = useQuery(api.friends.getFriendIds, { userId });

  return (
    <>
      <FriendsHeader groups={groups} activeTab={activeTab} setActiveTab={setActiveTab} requestCount={incomingRequests?.length} />
      <div>
        <div className='flex flex-col gap-2 p-3'>
          {activeTab === 'Friends' && <FriendList userId={userId} friendIds={friendIds} />}
          {activeTab === 'Requests' && <RequestList userId={userId} incomingRequests={incomingRequests} outgoingRequests={outgoingRequests} />}
        </div>
      </div>
    </>
  );
}
