import { useQuery } from 'convex/react';
import React from 'react';

import { api } from '../../../convex/_generated/api';

import { PLACEHOLDER_UNKNOWN_USER } from '@/constants/placeholders';

import { Skeleton } from '@/components/ui/skeleton';

export function TypingHeader({ typingUsers }: { typingUsers?: { userId: string }[] }) {
  const response = useQuery(api.users.getUserNames, typingUsers ? { ids: typingUsers.map((u) => u.userId) } : 'skip');

  if (!response)
    return (
      <div className='bg-muted w-full rounded-tl-md rounded-tr-md'>
        <div className='flex items-center gap-2 p-2 px-4'>
          <span className='shrink-0 text-sm font-semibold'>
            {typingUsers && typingUsers.length > 0 ? (
              typingUsers.length <= 3 ? (
                <>
                  {typingUsers.map((u, idx) => (
                    <React.Fragment key={u.userId}>
                      <Skeleton>{PLACEHOLDER_UNKNOWN_USER.username}</Skeleton>
                      {idx < typingUsers.length - 1 && ', '}
                    </React.Fragment>
                  ))}
                  {` ${typingUsers.length === 1 ? 'is' : 'are'} typing...`}
                </>
              ) : (
                <>
                  {typingUsers.slice(0, 3).map((u, idx) => (
                    <React.Fragment key={u.userId}>
                      <Skeleton>{PLACEHOLDER_UNKNOWN_USER.username}</Skeleton>
                      {idx < 2 && ', '}
                    </React.Fragment>
                  ))}
                  {`, and ${typingUsers.length - 3} more are typing...`}
                </>
              )
            ) : null}
          </span>
        </div>
      </div>
    );

  return (
    <div className='bg-muted w-full rounded-tl-md rounded-tr-md'>
      <div className='flex items-center gap-2 p-2 px-4'>
        <span className='shrink-0 text-sm font-semibold'>
          {typingUsers && typingUsers.length > 0 ? (
            typingUsers.length <= 3 ? (
              <>
                {response.map((u, idx) => (
                  <React.Fragment key={u.userId}>
                    <span className='capitalize'>{u.username}</span>
                    {idx < typingUsers.length - 1 && ', '}
                  </React.Fragment>
                ))}
                {` ${typingUsers.length === 1 ? 'is' : 'are'} typing...`}
              </>
            ) : (
              <>
                {response.slice(0, 3).map((u, idx) => (
                  <React.Fragment key={u.userId}>
                    <span className='capitalize'>{u.username}</span>
                    {idx < 2 && ', '}
                  </React.Fragment>
                ))}
                {`, and ${typingUsers.length - 3} more are typing...`}
              </>
            )
          ) : null}
        </span>
      </div>
    </div>
  );
}
