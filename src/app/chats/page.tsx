'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';

import { FriendsOverview } from '@/components/friends/overview';
import { SidebarInset } from '@/components/ui/sidebar';

const groups = ['Friends', 'Requests'];

export default function Page() {
  const { user } = useUser();

  const [activeTab, setActiveTab] = useState(groups[0]);

  if (!user) {
    return null;
  }

  return (
    <SidebarInset>
      <FriendsOverview activeTab={activeTab} userId={user.id} groups={groups} setActiveTab={setActiveTab} />
    </SidebarInset>
  );
}
