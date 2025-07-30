import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import React from 'react';

import { api } from '../../convex/_generated/api';

export function usePresenceSync() {
  const { user } = useUser();
  const updatePresence = useMutation(api.presence.setOnlineStatus);

  React.useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      updatePresence();
    }, 20_000); // Update presence every 20 seconds

    return () => clearInterval(interval);
  }, [user, updatePresence]);
}
