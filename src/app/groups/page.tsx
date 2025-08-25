import { SiteHeader } from '@/components/navigation/site-header';
import { ChartAreaInteractive } from '@/components/test/chart-area-interactive';
import { DataTable } from '@/components/test/data-table';
import { SectionCards } from '@/components/test/section-cards';
import { CreateGroupChat } from '@/components/create-group';

import data from './data.json';

export default function Page() {
  return (
    <>
      <SiteHeader />
      <div className='flex flex-1 flex-col overflow-y-auto'>
        <div className='@container/main flex flex-1 flex-col gap-2'>
          <div className='flex flex-col gap-6 py-4 md:py-4'>
            <CreateGroupChat />
            <SectionCards />
            <div className='px-4'>
              <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
