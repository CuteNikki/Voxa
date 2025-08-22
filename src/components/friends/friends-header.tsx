'use client';

import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function FriendsHeader({ groups, activeTab, setActiveTab }: { groups: string[]; activeTab: string; setActiveTab: (tab: string) => void }) {
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
                activeTab === group ? 'border-primary text-primary' : 'text-muted-foreground hover:text-primary border-transparent'
              }`}
              onClick={() => setActiveTab(group)}
              type='button'
            >
              {group}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
