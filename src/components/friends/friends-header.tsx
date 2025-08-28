'use client';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function FriendsHeader({
  groups,
  activeTab,
  setActiveTab,
  requestCount = 0,
}: {
  groups: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  requestCount?: number;
}) {
  return (
    <header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b px-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
      <div className='flex w-full items-center gap-1'>
        <SidebarTrigger />
        <Separator orientation='vertical' className='data-[orientation=vertical]:h-4' />
        <div className='flex items-center gap-2'>
          {groups.map((group) => (
            <button
              key={group}
              className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                activeTab === group
                  ? 'border-primary text-foreground/80 hover:text-foreground'
                  : 'text-muted-foreground hover:text-foreground border-transparent'
              }`}
              onClick={() => setActiveTab(group)}
              type='button'
            >
              {group}
              {group === 'Requests' && requestCount > 0 && <Badge className='mx-1 px-1.5 rounded-full'>{requestCount}</Badge>}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
