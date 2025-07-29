import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import React from 'react';

import { api } from '../../convex/_generated/api';

export function usePresenceSync() {
  const { user } = useUser();
  const setOnlineStatus = useMutation(api.presence.setOnlineStatus);

  React.useEffect(() => {
    if (!user) return;

    const goOnline = () => setOnlineStatus({ userId: user.id, isOnline: true });
    const goOffline = () => setOnlineStatus({ userId: user.id, isOnline: false });

    goOnline();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') goOffline();
      else goOnline();
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', goOffline);

    return () => {
      goOffline();
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, setOnlineStatus]);
}
