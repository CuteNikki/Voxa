'use client';

import { usePresenceSync } from '@/hooks/presence';

export default function PresenceSyncClient() {
  usePresenceSync();
  return null;
}
