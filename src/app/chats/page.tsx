'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useMemo, useState } from 'react';

import { FriendsOverview } from '@/components/friends/overview';
import { SidebarInset } from '@/components/ui/sidebar';

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
    <SidebarInset>
      <FriendsOverview activeTab={activeTab} userId={user.id} groups={groups} setActiveTab={setActiveTab} />
    </SidebarInset>
  );
}
