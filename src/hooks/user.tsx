'use client';

import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { useEffect } from 'react';

import { api } from '../../convex/_generated/api';

export function UserSyncer() {
  const { user, isLoaded } = useUser();
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);

  useEffect(() => {
    if (isLoaded && user) {
      getOrCreateUser();
    }
  }, [getOrCreateUser, isLoaded, user]);

  return null;
}
