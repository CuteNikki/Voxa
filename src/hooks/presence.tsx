import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import React from 'react';

import { api } from '../../convex/_generated/api';

import { ONLINE_UPDATE_INTERVAL } from '@/constants/limits';

export function usePresenceSync() {
  const { user } = useUser();
  const updatePresence = useMutation(api.presence.setOnlineStatus);

  React.useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      updatePresence().catch(console.error);
    }, ONLINE_UPDATE_INTERVAL);

    updatePresence().catch(console.error);

    return () => clearInterval(interval);
  }, [user, updatePresence]);
}
